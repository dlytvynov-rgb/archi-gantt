"use client";

import { useEffect, useRef, useState } from "react";
// react-glow removed — using CSS hover instead

interface Segment { status: string; from: string; to: string; }

interface TaskRow {
  id: string;
  name: string;
  project: string;
  assignee: string;
  pm: string;
  planned_end: string;
  start_date: string;
  segments: Segment[];
  current_status: string;
  returns: number;       // QA → IP (внутренний возврат)
  rfa_count: number;     // сколько раз была в RFA
  client_returns: number; // rfa_count - 1 (клиент вернул)
}

// Solid colors — for Gantt bars, mini-bars, history timeline dots
const SC: Record<string, { bg: string; tx: string }> = {
  "In progress":          { bg: "#4A7BF7", tx: "#fff" },
  "Quality control":      { bg: "#8B46FF", tx: "#fff" },
  "Ready for acceptance": { bg: "#22C55E", tx: "#fff" },
  "Done":                 { bg: "#0D9488", tx: "#fff" },
  "Setting task":         { bg: "#94A3B8", tx: "#fff" },
  "Paused":               { bg: "#F97316", tx: "#fff" },
  "Pending more info":    { bg: "#F97316", tx: "#fff" },
};
// Gantt segment colors — solid, same palette as SC but with border
const SC_SEG: Record<string, { bg: string; tx: string; border: string }> = {
  "In progress":          { bg: "#4A7BF7", tx: "#fff", border: "#3261D4" },
  "Quality control":      { bg: "#8B46FF", tx: "#fff", border: "#7032E0" },
  "Ready for acceptance": { bg: "#22C55E", tx: "#fff", border: "#16A34A" },
  "Done":                 { bg: "#0D9488", tx: "#fff", border: "#0F766E" },
  "Setting task":         { bg: "#94A3B8", tx: "#fff", border: "#64748B" },
  "Paused":               { bg: "#F97316", tx: "#fff", border: "#EA580C" },
  "Pending more info":    { bg: "#F97316", tx: "#fff", border: "#EA580C" },
};

// Pastel pills — for status badges in Cards, filter bar, history panel
const SC_PILL: Record<string, { bg: string; tx: string; border: string }> = {
  "In progress":          { bg: "#EEF4FF", tx: "#3A6AE6", border: "#BFDBFE" },
  "Quality control":      { bg: "#F3EEFF", tx: "#7640D4", border: "#DDD6FE" },
  "Ready for acceptance": { bg: "#ECFBF1", tx: "#1A9645", border: "#BBF7D0" },
  "Done":                 { bg: "#F0FDFA", tx: "#0F766E", border: "#99F6E4" },
  "Setting task":         { bg: "#F1F5F9", tx: "#64748B", border: "#E2E8F0" },
  "Paused":               { bg: "#FFF2EC", tx: "#C05A20", border: "#FED7AA" },
  "Pending more info":    { bg: "#FFF2EC", tx: "#C05A20", border: "#FED7AA" },
};
// Rank gradient: green (best) → red (worst)
const RANK_COLORS = ["#16A34A","#22C55E","#84CC16","#A3E635","#EAB308","#F97316","#EF4444","#DC2626","#B91C1C","#991B1B"];
const rankColor = (rank: number, total: number) => {
  if (total <= 1) return RANK_COLORS[0];
  const idx = Math.round((rank / Math.max(1, total - 1)) * (RANK_COLORS.length - 1));
  return RANK_COLORS[Math.min(idx, RANK_COLORS.length - 1)];
};
const STATUS_SHORT: Record<string, string> = {
  "Ready for acceptance": "Ready",
  "Quality control": "QA",
  "Pending more info": "Pending",
  "In progress": "In progress",
  "Setting task": "Setting",
  "Done": "Done",
  "Paused": "Paused",
};
const ALL_STATUSES = ["In progress","Quality control","Ready for acceptance","Setting task","Paused","Pending more info","Done"];

// Qualification badge colors matching dark-preview.html
const qualBadgeStyle = (q: string): React.CSSProperties => {
  if (["SDC int+","SDC ext+","MDF+","Animation+","Ps+"].includes(q))
    return { color:"#A07820", borderColor:"#E8C860", background:"#FFFBEB" };   // gold
  if (["SDC int","SDC ext","MDF","Animation","Ps"].includes(q))
    return { color:"#2563EB", borderColor:"#BFDBFE", background:"#EFF6FF" };   // blue
  if (["MLR int","MLR ext"].includes(q))
    return { color:"#7C3AED", borderColor:"#DDD6FE", background:"#F5F3FF" };   // purple
  if (q.startsWith("BC ") || q === "BC Lennar")
    return { color:"#C2550F", borderColor:"#FED7AA", background:"#FFF7ED" };   // orange
  return { color:"#6B7A90", borderColor:"#E2E8F0", background:"#F3F5F8" };     // gray: FD, Designer, Architect, A1/A2/B1/C1
};
const DW = 28;

const dif  = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5);
const addD = (s: string, n: number) => { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const fmtM = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" });
const fmtD = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

function parseCSV(raw: string): TaskRow[] {
  const lines = raw.split("\n").filter(Boolean);
  const header = lines[0].split(",");
  const idx = (n: string) => header.findIndex(h => h.trim().replace(/"/g, "") === n);
  const iId = idx("ss.task_id"), iName = idx("task_name"), iProj = idx("project_name");
  const iAss = idx("assignee"), iPm = idx("pm"), iPEnd = idx("planned_end_date");
  const iSt = idx("status"), iFrom = idx("from_date"), iTo = idx("to_date");

  function parseLine(line: string): string[] {
    const r: string[] = []; let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) { r.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    r.push(cur.trim());
    return r;
  }

  const map = new Map<string, TaskRow>();
  for (let i = 1; i < lines.length; i++) {
    const c = parseLine(lines[i]);
    if (c.length < 5) continue;
    const id = c[iId], status = c[iSt];
    const from = c[iFrom]?.slice(0, 10) || "", to = c[iTo]?.slice(0, 10) || "";
    if (!id || !from || !to) continue;

    if (!map.has(id)) {
      map.set(id, { id, name: c[iName]||"", project: c[iProj]||"", assignee: (c[iAss]||"").trim(),
        pm: (c[iPm]||"").replace(/^PM\s+/,"").trim(), planned_end: c[iPEnd]||"",
        start_date: from, segments: [], current_status: status, returns: 0, rfa_count: 0, client_returns: 0 });
    }
    const t = map.get(id)!;
    if (from < t.start_date) t.start_date = from;
    if (from >= (t.segments[t.segments.length-1]?.from || "")) {
      t.current_status = status;
      if (c[iPEnd]) t.planned_end = c[iPEnd];
    }
    const last = t.segments[t.segments.length-1];
    if (last && last.status === status && last.to === from) last.to = to;
    else t.segments.push({ status, from, to });
  }

  for (const t of map.values()) {
    for (let i = 1; i < t.segments.length; i++) {
      const cur = t.segments[i].status, prev = t.segments[i-1].status;
      if (cur === "In progress" && prev === "Quality control") t.returns++;
      // count only transitions INTO RFA from a different status
      if (cur === "Ready for acceptance" && prev !== "Ready for acceptance") t.rfa_count++;
    }
    // segments[0] not covered by loop above
    if (t.segments.length === 1 && t.segments[0].status === "Ready for acceptance") t.rfa_count++;
    t.client_returns = Math.max(0, t.rfa_count - 1);
  }
  return Array.from(map.values());
}

type ActqMap = Map<string, { Q: number; A: number; T1: number }>;

function parseHashtags(raw: string, taskAssignees: Map<string, string>): ActqMap {
  const result: ActqMap = new Map();
  const seen = new Set<string>();
  for (const line of raw.split("\n").slice(1)) {
    // columns: task_id(0), task_name(1), spec_id(2), spec_name(3), pm_id(4), pm_name(5), message_id(6), body(7), ...
    const m = line.match(/^(\d+),[^,]*,\d+,([^,]+),\d+,[^,]+,(\d+),(##(?:Q[123]|A[123]|T1)\S*)/i);
    if (!m) continue;
    const [, taskId, specName, msgId, body] = m;
    const key = `${taskId}:${msgId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tagM = body.match(/^##(Q[123]|A[123]|T1)/i);
    if (!tagM) continue;
    const tag = tagM[1].toUpperCase();
    // attribute: @Firstname Lastname in line, else tasks assignee, else spec_name
    const mention = line.match(/@([A-Z][a-z]+\s[A-Z][a-z]+)/);
    const assignee = (mention ? mention[1] : (taskAssignees.get(taskId) || specName)).trim();
    if (!assignee) continue;
    const e = result.get(assignee) || { Q: 0, A: 0, T1: 0 };
    if (tag.startsWith("Q")) e.Q++;
    else if (tag.startsWith("A")) e.A++;
    else if (tag === "T1") e.T1++;
    result.set(assignee, e);
  }
  return result;
}

// ─── Cards View ───────────────────────────────────────────────────────────────
function CardsView({ tasks, search, hideStatus, onSelect }: { tasks: TaskRow[]; search: string; hideStatus: Set<string>; onSelect: (t: TaskRow) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [mode, setMode] = useState<"now"|"history">("now");
  const [sortBy, setSortBy]   = useState<"urgent"|"assignee"|"deadline"|"returns"|"status"|"progress">("urgent");
  const [sortHist, setSortHist] = useState<"returns"|"rfa"|"duration"|"overdue">("returns");

  const ACTIVE = new Set(["In progress", "Paused", "Quality control"]);

  // — NOW mode
  let filtered = tasks.filter(t => !hideStatus.has(t.current_status));
  if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search) || t.assignee.toLowerCase().includes(search));

  const urgencyKey = (t: TaskRow) => {
    if (!ACTIVE.has(t.current_status)) return 3;
    if (!t.planned_end) return 2;
    const d = dif(today, t.planned_end);
    if (d < 0) return 0;
    if (d <= 3) return 1;
    return 2;
  };

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "urgent") { const ua = urgencyKey(a), ub = urgencyKey(b); if (ua !== ub) return ua - ub; return (a.planned_end||"9").localeCompare(b.planned_end||"9"); }
    if (sortBy === "assignee") return a.assignee.localeCompare(b.assignee);
    if (sortBy === "deadline") return (a.planned_end||"9").localeCompare(b.planned_end||"9");
    if (sortBy === "returns")  return b.returns - a.returns;
    if (sortBy === "status")   return a.current_status.localeCompare(b.current_status);
    if (sortBy === "progress") {
      const pct = (t: TaskRow) => { const total = t.start_date && t.planned_end ? dif(t.start_date, t.planned_end) : 0; const done = t.start_date ? dif(t.start_date, today) : 0; return total > 0 ? Math.min(100, Math.round(done/total*100)) : 0; };
      return pct(b) - pct(a);
    }
    return 0;
  });

  // — HISTORY mode
  let histFiltered = [...tasks];
  if (search) histFiltered = histFiltered.filter(t => t.name.toLowerCase().includes(search) || t.assignee.toLowerCase().includes(search));
  const taskDuration = (t: TaskRow) => Math.max(0, dif(t.start_date, t.segments[t.segments.length-1]?.to || today));
  const taskOverdueDays = (t: TaskRow) => t.planned_end && t.segments[t.segments.length-1]?.to > t.planned_end
    ? dif(t.planned_end, t.segments[t.segments.length-1].to) : 0;
  const histSorted = [...histFiltered].sort((a, b) => {
    if (sortHist === "returns")  return b.returns - a.returns;
    if (sortHist === "rfa")      return b.rfa_count - a.rfa_count;
    if (sortHist === "duration") return taskDuration(b) - taskDuration(a);
    if (sortHist === "overdue")  return taskOverdueDays(b) - taskOverdueDays(a);
    return 0;
  });

  const col = (s: string) => SC[s]?.bg || "#ccc";
  const tx  = (s: string) => SC[s]?.tx || "#fff";

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      {/* Mode toggle + sort bar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
        {/* Тоггл */}
        <div style={{ display:"flex", background:"#E2E8F0", borderRadius:8, padding:3, gap:1, flexShrink:0 }}>
          {(["now","history"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding:"4px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: mode===m ? "#1F2D3D" : "transparent", color: mode===m ? "#fff" : "#6B7A90", transition:"all .15s" }}>
              {m === "now" ? "Сейчас" : "История"}
            </button>
          ))}
        </div>
        <div style={{ width:1, height:22, background:"#D8E0EC" }} />
        {mode === "now"
          ? (["urgent","assignee","deadline","progress","returns","status"] as const).map(v => (
            <span key={v} onClick={() => setSortBy(v)} className="pill"
              style={{ padding:"3px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, border:"1.5px solid", userSelect:"none",
                borderColor: sortBy===v ? "#1F2D3D" : "#D8E0EC", background: sortBy===v ? "#1F2D3D" : "#EEF2F7", color: sortBy===v ? "#fff" : "#6B7A90" }}>
              {v === "urgent" ? "🔥 Горящие" : v === "assignee" ? "Воркер" : v === "deadline" ? "Дедлайн" : v === "progress" ? "Прогресс" : v === "returns" ? "Возвраты" : "Статус"}
            </span>
          ))
          : (["returns","rfa","duration","overdue"] as const).map(v => (
            <span key={v} onClick={() => setSortHist(v)} className="pill"
              style={{ padding:"3px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, border:"1.5px solid", userSelect:"none",
                borderColor: sortHist===v ? "#C04040" : "#D8E0EC", background: sortHist===v ? "#C04040" : "#EEF2F7", color: sortHist===v ? "#fff" : "#6B7A90" }}>
              {v === "returns" ? "↩ QA возвраты" : v === "rfa" ? "🔄 Клиент циклы" : v === "duration" ? "⏱ Самые долгие" : "⚠ Просроченные"}
            </span>
          ))
        }
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:12 }}>
          {mode === "now" ? sorted.length : histSorted.length} задач
        </span>
      </div>

      {/* HISTORY TABLE */}
      {mode === "history" && (
        <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 8px rgba(0,0,0,.08)", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 80px 80px 80px", background:"#1F2D3D", padding:"0 16px" }}>
            {["Задача","Воркер","Проект","QA ↩","RFA","Дней"].map(h => (
              <div key={h} style={{ padding:"10px 8px", fontSize:11, fontWeight:600, color:"rgba(255,255,255,.75)", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
            ))}
          </div>
          {histSorted.map((t, i) => {
            const dur = taskDuration(t);
            const over = taskOverdueDays(t);
            const rowBg = t.returns >= 3 ? "#FFF5F5" : t.rfa_count >= 3 ? "#FFF8F0" : i % 2 === 0 ? "#fff" : "#FAFBFD";
            return (
              <div key={t.id} onClick={() => onSelect(t)} style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 80px 80px 80px", padding:"0 16px", borderTop: i===0?"none":"1px solid #F0F4F8", background:rowBg, minHeight:44, alignItems:"center", cursor:"pointer", borderLeft: t.returns>=3?"3px solid #E05050":t.rfa_count>=3?"3px solid #F97316":"3px solid transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background="#F0F6FF")}
                onMouseLeave={e => (e.currentTarget.style.background=rowBg)}>
                <div style={{ padding:"6px 8px 6px 0", overflow:"hidden" }}>
                  <div style={{ fontSize:12, color:"#2D7FF9", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
                  <div style={{ fontSize:10, color:"#9AA5B4", marginTop:1 }}>{STATUS_SHORT[t.current_status]||t.current_status}</div>
                </div>
                <div style={{ fontSize:12, color:"#4A5568", padding:"0 8px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.assignee}</div>
                <div style={{ fontSize:11, color:"#9AA5B4", padding:"0 8px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.project}</div>
                <div style={{ padding:"0 8px", textAlign:"center" }}>
                  {t.returns > 0 ? <span style={{ fontSize:13, fontWeight:700, color:t.returns>=3?"#E53E3E":t.returns>=2?"#FF6F2C":"#8B46FF" }}>↩ {t.returns}</span> : <span style={{ color:"#C2C2C2" }}>—</span>}
                </div>
                <div style={{ padding:"0 8px", textAlign:"center" }}>
                  {t.rfa_count > 0 ? <span style={{ fontSize:12, fontWeight:700, color:t.rfa_count>=3?"#E53E3E":"#F97316" }}>{t.rfa_count}×</span> : <span style={{ color:"#C2C2C2" }}>—</span>}
                </div>
                <div style={{ padding:"0 8px", textAlign:"center" }}>
                  <span style={{ fontSize:12, fontWeight:600, color: dur > 30 ? "#C04040" : "#4A5568" }}>{dur}д</span>
                  {over > 0 && <div style={{ fontSize:10, color:"#E53E3E" }}>+{over}д</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NOW TABLE */}
      {mode === "now" && <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 8px rgba(0,0,0,.08)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", background:"#1F2D3D", padding:"0 16px" }}>
          {["Задача","Воркер","Статус","Дедлайн","Возвраты","Прогресс"].map(h => (
            <div key={h} style={{ padding:"10px 8px", fontSize:11, fontWeight:600, color:"rgba(255,255,255,.75)", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {sorted.map((t, i) => {
          const isActive  = ACTIVE.has(t.current_status);
          const isOverdue = isActive && !!t.planned_end && t.planned_end < today;
          const totalDays = t.start_date && t.planned_end ? dif(t.start_date, t.planned_end) : 0;
          const doneDays  = t.start_date ? dif(t.start_date, today) : 0;
          const pct = totalDays > 0 ? Math.min(100, Math.round(doneDays / totalDays * 100)) : 0;
          const daysLeft = t.planned_end ? dif(today, t.planned_end) : null;
          const isBurning = isActive && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

          // mini segment bar
          const segTotal = t.segments.length ? dif(t.segments[0].from, t.segments[t.segments.length-1].to || today) : 1;

          const rowBg = isOverdue ? "#FFF8F8" : isBurning ? "#FFFAF6" : i % 2 === 0 ? "#fff" : "#FAFBFD";
          const rowBorder = isOverdue ? "3px solid #E05050" : isBurning ? "3px solid #E07830" : "3px solid transparent";

          return (
            <div key={t.id} onClick={() => onSelect(t)} style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", padding:"0 16px", borderTop: i === 0 ? "none" : "1px solid #F0F4F8", background: rowBg, minHeight:48, alignItems:"center", cursor:"pointer", borderLeft: rowBorder }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F0F6FF")}
              onMouseLeave={e => (e.currentTarget.style.background = rowBg)}>
              {/* Task name */}
              <div style={{ padding:"8px 8px 8px 0", overflow:"hidden" }}>
                <a href={`https://archivizer.com/tasks/${t.id}`} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize:12, color:"#2D7FF9", textDecoration:"none", display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight:500 }}
                  title={t.name}>{t.name}</a>
                <div style={{ fontSize:11, color:"#9AA5B4", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.project}</div>
              </div>

              {/* Assignee */}
              <div style={{ fontSize:12, color:"#4A5568", padding:"0 8px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.assignee}</div>

              {/* Status */}
              <div style={{ padding:"0 8px" }}>
                {(() => { const p = SC_PILL[t.current_status] || { bg:"#F1F5F9", tx:"#64748B", border:"#E2E8F0" }; return (
                  <span style={{ padding:"3px 8px", borderRadius:5, fontSize:11, fontWeight:500, background:p.bg, color:p.tx, border:`1px solid ${p.border}`, whiteSpace:"nowrap" }}>
                    {STATUS_SHORT[t.current_status] || t.current_status}
                  </span>
                ); })()}
              </div>

              {/* Deadline */}
              <div style={{ padding:"0 8px" }}>
                <div style={{ fontSize:12, fontWeight:600, color: isOverdue ? "#E53E3E" : "#4A5568" }}>
                  {t.planned_end ? fmtD(t.planned_end) : "—"}
                </div>
                {daysLeft !== null && isActive && (
                  <div style={{ fontSize:10, color: daysLeft < 0 ? "#E53E3E" : daysLeft <= 3 ? "#FF6F2C" : "#9AA5B4", marginTop:1 }}>
                    {daysLeft < 0 ? `+${Math.abs(daysLeft)}д просроч` : daysLeft === 0 ? "сегодня" : `${daysLeft}д осталось`}
                  </div>
                )}
              </div>

              {/* Returns */}
              <div style={{ padding:"0 8px", textAlign:"center" }}>
                {t.returns > 0
                  ? <span style={{ fontSize:13, fontWeight:700, color: t.returns >= 3 ? "#E53E3E" : t.returns >= 2 ? "#FF6F2C" : "#8B46FF" }}>↩ {t.returns}</span>
                  : <span style={{ fontSize:12, color:"#C2C2C2" }}>—</span>
                }
              </div>

              {/* Progress */}
              <div style={{ padding:"0 8px" }}>
                {/* mini segment bar */}
                <div style={{ display:"flex", height:8, borderRadius:4, overflow:"hidden", marginBottom:4, background:"#EEF2F7" }}>
                  {t.segments.map((seg, si) => {
                    const w = segTotal > 0 ? Math.max(1, dif(seg.from, seg.to || today) / segTotal * 100) : 0;
                    return <div key={si} title={`${STATUS_SHORT[seg.status]||seg.status}: ${dif(seg.from,seg.to||today)}д`}
                      style={{ width:`${w}%`, background: SC[seg.status]?.bg || "#eee", opacity:.85 }} />;
                  })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ height:4, borderRadius:2, background:"#EEF2F7", flex:1, marginRight:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background: isOverdue ? "#E53E3E" : "#2D7FF9", borderRadius:2, transition:"width .3s" }} />
                  </div>
                  <span style={{ fontSize:10, color: isOverdue ? "#E53E3E" : "#9AA5B4", whiteSpace:"nowrap" }}>{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>}

    </div>
  );
}

// ─── Task History Panel ───────────────────────────────────────────────────────
function TaskHistoryPanel({ task, onClose }: { task: TaskRow; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const lastTo = task.segments[task.segments.length - 1]?.to || today;
  const totalDays = Math.max(1, dif(task.start_date, lastTo));

  // merge consecutive same-status segments into one period
  const merged = task.segments.reduce((acc, seg) => {
    const last = acc[acc.length - 1];
    if (last && last.status === seg.status) { last.to = seg.to; }
    else acc.push({ ...seg });
    return acc;
  }, [] as Segment[]);

  const segDays = merged.map(s => dif(s.from, s.to || today));
  const maxSegDays = Math.max(...segDays);
  const isOverduePanel = ["In progress","Paused","Quality control"].includes(task.current_status)
    && !!task.planned_end && task.planned_end < today;
  const score = task.returns * 1.0 + task.client_returns * 0.2;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,20,30,.5)", backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)", zIndex:200 }} />
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:420, background:"#fff", zIndex:201, display:"flex", flexDirection:"column", boxShadow:"-8px 0 40px rgba(0,0,0,.18)", overflowY:"auto", borderRadius:"12px 0 0 12px" }}>
        {/* Header */}
        <div style={{ background:"#1F2D3D", padding:"16px 20px 14px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", lineHeight:1.4 }}>{task.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{task.project}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.14)", border:"none", color:"#fff", width:28, height:28, borderRadius:6, cursor:"pointer", fontSize:15, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 16px", marginTop:14 }}>
            {([["Воркер", task.assignee || "—"], ["PM", task.pm || "—"], ["Дедлайн", task.planned_end ? fmtD(task.planned_end) : "—"], ["QA возвраты", task.returns > 0 ? `↩ ${task.returns}` : "—"], ["Клиент циклы", task.rfa_count > 0 ? `${task.rfa_count} RFA` : "—"], ["Клиент вернул", task.client_returns > 0 ? `↩ ${task.client_returns}` : "—"]] as [string,string][]).map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.38)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, fontWeight:600, color: (l==="QA возвраты"&&task.returns>0)||(l==="Клиент вернул"&&task.client_returns>0) ? "#FF8C8C" : "#fff" }}>{v}</div>
              </div>
            ))}
          </div>
          {(score > 0 || isOverduePanel) && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
              {task.returns > 0 && <span style={{ padding:"2px 8px", borderRadius:4, background:"#E53E3E", color:"#fff", fontSize:11, fontWeight:700 }}>⚠ {task.returns} QA возврат{task.returns>1?"а":""}</span>}
              {task.client_returns > 0 && <span style={{ padding:"2px 8px", borderRadius:4, background:"#FF6F2C", color:"#fff", fontSize:11, fontWeight:700 }}>↩ клиент вернул {task.client_returns}×</span>}
              {isOverduePanel && <span style={{ padding:"2px 8px", borderRadius:4, background:"rgba(229,62,62,.7)", color:"#fff", fontSize:11, fontWeight:700 }}>🔴 просроч +{Math.abs(dif(today, task.planned_end))}д</span>}
            </div>
          )}
        </div>

        {/* Link */}
        <div style={{ padding:"9px 20px", borderBottom:"1px solid #EEF2F7", background:"#F8FAFC", flexShrink:0 }}>
          <a href={`https://archivizer.com/tasks/${task.id}`} target="_blank" rel="noreferrer"
            style={{ fontSize:12, color:"#2D7FF9", fontWeight:500, textDecoration:"none" }}>
            🔗 Открыть в Archivizer →
          </a>
        </div>

        {/* Timeline */}
        <div style={{ padding:"14px 20px", flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#6B7A90", textTransform:"uppercase", letterSpacing:".4px", marginBottom:14 }}>
            История статусов · {totalDays} дней
          </div>

          {merged.map((seg, i) => {
            const prev = merged[i - 1];
            const isReturn = i > 0 && seg.status === "In progress" && !!prev &&
              prev.status === "Quality control";
            const isClientReturn = i > 0 && seg.status === "In progress" && !!prev &&
              prev.status === "Ready for acceptance";
            const days = dif(seg.from, seg.to || today);
            const sc = SC[seg.status];
            const isLast = i === merged.length - 1;
            const isSlowest = days === maxSegDays && maxSegDays > 1;

            return (
              <div key={i}>
                {isReturn && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 24px", color:"#E53E3E", fontSize:11, fontWeight:700 }}>
                    <span>↩ QA вернул в работу</span>
                  </div>
                )}
                {isClientReturn && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 24px", color:"#FF6F2C", fontSize:11, fontWeight:700 }}>
                    <span>↩ Клиент вернул на доработку</span>
                  </div>
                )}
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:12, flexShrink:0, marginTop:4 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:sc?.bg || "#ccc", flexShrink:0 }} />
                    {!isLast && <div style={{ width:2, flex:1, minHeight:28, background:"#E4EAF1", marginTop:3 }} />}
                  </div>
                  <div style={{ flex:1, paddingBottom: isLast ? 0 : 14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      {(() => { const p = SC_PILL[seg.status] || { bg:"#F1F5F9", tx:"#64748B", border:"#E2E8F0" }; return (
                        <span style={{ padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:500, background:p.bg, color:p.tx, border:`1px solid ${p.border}` }}>
                          {STATUS_SHORT[seg.status] || seg.status}
                        </span>
                      ); })()}
                      <span style={{ fontSize:11, fontWeight:600, color: isSlowest ? "#E53E3E" : "#9AA5B4" }}>
                        {days} дн {isSlowest ? "⏱ самый долгий" : ""}
                      </span>
                    </div>
                    <div style={{ fontSize:11, color:"#6B7A90", marginTop:4 }}>
                      {fmtD(seg.from)} → {fmtD(seg.to || today)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini bar footer */}
        <div style={{ padding:"12px 20px 20px", borderTop:"1px solid #EEF2F7", flexShrink:0 }}>
          <div style={{ fontSize:10, color:"#9AA5B4", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:".3px" }}>Шкала времени</div>
          <div style={{ display:"flex", height:12, borderRadius:6, overflow:"hidden", background:"#EEF2F7" }}>
            {task.segments.map((seg, i) => {
              const w = Math.max(1, dif(seg.from, seg.to || today) / totalDays * 100);
              return <div key={i} title={`${STATUS_SHORT[seg.status]||seg.status}: ${dif(seg.from,seg.to||today)}д`}
                style={{ width:`${w}%`, background:SC[seg.status]?.bg||"#eee" }} />;
            })}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9AA5B4", marginTop:4 }}>
            <span>{fmtD(task.start_date)}</span>
            <span>{fmtD(lastTo)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────
interface WorkerStat {
  assignee: string; totalTasks: number; statusCounts: Record<string, number>;
  totalReturns: number; avgReturns: number; avgDuration: number;
  avgInProgress: number; avgQA: number; overdue: number;
  clients: { name: string; tasks: number; returns: number; avgDays: number }[];
}
interface ClientStat {
  name: string; totalTasks: number; totalReturns: number;
  workers: { assignee: string; tasks: number; returns: number; avgDays: number }[];
}

function buildWorkerStats(tasks: TaskRow[], today: string): WorkerStat[] {
  const map = new Map<string, TaskRow[]>();
  for (const t of tasks) {
    if (!t.assignee) continue;
    if (!map.has(t.assignee)) map.set(t.assignee, []);
    map.get(t.assignee)!.push(t);
  }
  return Array.from(map.entries()).map(([assignee, wt]) => {
    const statusCounts: Record<string, number> = {};
    let totalReturns = 0, totalDuration = 0, totalIP = 0, totalQA = 0, overdue = 0;
    const clientMap = new Map<string, { tasks: number; returns: number; totalDays: number }>();
    for (const t of wt) {
      statusCounts[t.current_status] = (statusCounts[t.current_status] || 0) + 1;
      totalReturns += t.returns;
      const lastTo = t.segments[t.segments.length - 1]?.to || today;
      const dur = Math.max(0, dif(t.start_date, lastTo));
      totalDuration += dur;
      for (const seg of t.segments) {
        const d = Math.max(0, dif(seg.from, seg.to || today));
        if (seg.status === "In progress") totalIP += d;
        else if (seg.status === "Quality control") totalQA += d;
      }
      if (t.planned_end && t.planned_end < today && t.current_status !== "Done") overdue++;
      if (!clientMap.has(t.project)) clientMap.set(t.project, { tasks: 0, returns: 0, totalDays: 0 });
      const c = clientMap.get(t.project)!;
      c.tasks++; c.returns += t.returns; c.totalDays += dur;
    }
    const n = wt.length;
    return {
      assignee, totalTasks: n, statusCounts, totalReturns,
      avgReturns: Math.round(totalReturns / n * 10) / 10,
      avgDuration: Math.round(totalDuration / n),
      avgInProgress: Math.round(totalIP / n),
      avgQA: Math.round(totalQA / n),
      overdue,
      clients: Array.from(clientMap.entries())
        .map(([name, c]) => ({ name, tasks: c.tasks, returns: c.returns, avgDays: Math.round(c.totalDays / c.tasks) }))
        .sort((a, b) => b.tasks - a.tasks).slice(0, 5),
    };
  });
}

function buildClientStats(tasks: TaskRow[], today: string): ClientStat[] {
  const map = new Map<string, Map<string, { tasks: number; returns: number; totalDays: number }>>();
  for (const t of tasks) {
    if (!map.has(t.project)) map.set(t.project, new Map());
    const wm = map.get(t.project)!;
    if (!wm.has(t.assignee)) wm.set(t.assignee, { tasks: 0, returns: 0, totalDays: 0 });
    const w = wm.get(t.assignee)!;
    w.tasks++; w.returns += t.returns;
    w.totalDays += Math.max(0, dif(t.start_date, t.segments[t.segments.length - 1]?.to || today));
  }
  return Array.from(map.entries()).map(([name, wm]) => {
    const workers = Array.from(wm.entries())
      .map(([assignee, w]) => ({ assignee, tasks: w.tasks, returns: w.returns, avgDays: Math.round(w.totalDays / w.tasks) }))
      .sort((a, b) => b.tasks - a.tasks);
    return { name, totalTasks: workers.reduce((s, w) => s + w.tasks, 0), totalReturns: workers.reduce((s, w) => s + w.returns, 0), workers };
  });
}

function WorkerCard({ stat, rank, totalWorkers, qualifications, actq }: { stat: WorkerStat; rank: number; totalWorkers: number; qualifications: string[]; actq?: { Q: number; A: number; T1: number } }) {
  const rc = rankColor(rank, totalWorkers);
  const rankNum = rank + 1;
  const rankTextColor = rankNum <= 4 ? "#fff" : rankNum <= 6 ? "#3d2e00" : "#fff";
  return (
    <div className="glow-card" style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04)", overflow:"hidden", height:"100%", borderTop:`3px solid ${rc}` }}>
      <div style={{ background:"#1F2D3D", padding:"12px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#fff", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{stat.assignee}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <div style={{ width:20, height:20, borderRadius:5, background:rc, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:rankTextColor }}>#{rankNum}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", background:"rgba(255,255,255,.08)", padding:"2px 8px", borderRadius:4 }}>{stat.totalTasks} задач</div>
          </div>
        </div>
        <div style={{ display:"flex", height:4, borderRadius:2, overflow:"hidden", marginTop:10, gap:1 }}>
          {ALL_STATUSES.map(s => {
            const n = stat.statusCounts[s] || 0;
            if (!n) return null;
            return <div key={s} title={`${STATUS_SHORT[s]||s}: ${n}`}
              style={{ width:`${n/stat.totalTasks*100}%`, background:SC[s]?.bg||"#ccc", minWidth:3 }} />;
          })}
        </div>
        <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
          {ALL_STATUSES.filter(s => stat.statusCounts[s]).map(s => (
            <span key={s} style={{ fontSize:10, color:"rgba(255,255,255,.55)" }}>
              <span style={{ display:"inline-block", width:7, height:7, borderRadius:2, background:SC[s]?.bg, marginRight:3 }} />
              {STATUS_SHORT[s]||s} {stat.statusCounts[s]}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderBottom:"1px solid #DDE4EE", background:"#EEF2F8" }}>
        {([
          ["Возвраты", `↩ ${stat.totalReturns}`, stat.totalReturns > 0 ? (stat.avgReturns >= 0.3 ? "#C04040" : "#C05A20") : "#6B7A90", `${stat.avgReturns} /зад`],
          ["Ср. дней",  `${stat.avgDuration}д`,   "#4A7BF7", "всего"],
          ["Ср. IP",    `${stat.avgInProgress}д`,  "#4A7BF7", "In progress"],
          ["Просроч",   `${stat.overdue}`,          stat.overdue > 0 ? "#C04040" : "#6B7A90", "сейчас"],
        ] as [string,string,string,string][]).map(([label, val, color, sub]) => (
          <div key={label} style={{ padding:"9px 7px", textAlign:"center", borderRight:"1px solid #DDE4EE" }}>
            <div style={{ fontSize:9, color:"#7A8A9E", textTransform:"uppercase", letterSpacing:".4px", marginBottom:3, fontWeight:600 }}>{label}</div>
            <div style={{ fontSize:15, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:9, color:"#8A99AD", marginTop:1 }}>{sub}</div>
          </div>
        ))}
      </div>
      {stat.clients.length > 0 && (
        <div style={{ padding:"10px 16px 12px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px", marginBottom:6 }}>Топ клиентов</div>
          {stat.clients.map((c, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", borderTop: i > 0 ? "1px solid #F7F9FC" : "none" }}>
              <div style={{ flex:1, fontSize:12, color:"#4A5568", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{c.name}</div>
              <span style={{ fontSize:11, color:"#9AA5B4", whiteSpace:"nowrap" }}>{c.tasks} зад</span>
              {c.returns > 0
                ? <span style={{ fontSize:11, fontWeight:600, color: c.returns >= 5 ? "#E53E3E" : "#FF6F2C", whiteSpace:"nowrap" }}>↩{c.returns}</span>
                : <span style={{ fontSize:11, color:"#C2C2C2" }}>—</span>}
              <span style={{ fontSize:11, color:"#9AA5B4", whiteSpace:"nowrap" }}>{c.avgDays}д</span>
            </div>
          ))}
        </div>
      )}
      {actq && (actq.Q > 0 || actq.A > 0 || actq.T1 > 0) && (
        <div style={{ padding:"6px 16px 8px", borderTop:"1px solid #F3F5F8", display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ fontSize:10, fontWeight:600, color:"#9AA5B4", textTransform:"uppercase", marginRight:2 }}>ACTQ</span>
          {actq.Q > 0  && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {actq.Q}</span>}
          {actq.A > 0  && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {actq.A}</span>}
          {actq.T1 > 0 && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {actq.T1}</span>}
        </div>
      )}
      {qualifications.length > 0 && (
        <div style={{ padding:"8px 16px 12px", borderTop:"1px solid #F3F5F8", display:"flex", flexWrap:"wrap", gap:4 }}>
          {qualifications.map(q => {
            const bs = qualBadgeStyle(q);
            return <span key={q} style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:500, border:"1.5px solid", ...bs }}>{q}</span>;
          })}
        </div>
      )}
    </div>
  );
}

function ClientCard({ stat }: { stat: ClientStat }) {
  const best = stat.workers.length > 0
    ? stat.workers.reduce((b, w) => {
        const ra = w.returns / w.tasks, rb = b.returns / b.tasks;
        return ra !== rb ? (ra < rb ? w : b) : (w.avgDays < b.avgDays ? w : b);
      })
    : null;
  return (
    <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 8px rgba(0,0,0,.08)", overflow:"hidden" }}>
      <div style={{ background:"#1F2D3D", padding:"12px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#fff", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{stat.name || "(без клиента)"}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", flexShrink:0 }}>{stat.totalTasks} задач</div>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:4 }}>
          ↩ {stat.totalReturns} возвратов · {stat.workers.length} воркеров
        </div>
      </div>
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 52px 60px 62px 24px", padding:"7px 16px 4px", borderBottom:"1px solid #EEF2F7" }}>
          {["Воркер","Задач","Возвр.","Ср.дн.",""].map(h => (
            <div key={h} style={{ fontSize:10, color:"#9AA5B4", fontWeight:600, textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
          ))}
        </div>
        {stat.workers.map((w, i) => {
          const isBest = best?.assignee === w.assignee;
          return (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 52px 60px 62px 24px", padding:"6px 16px", borderTop: i > 0 ? "1px solid #F7F9FC" : "none", background: isBest ? "#F0FFF4" : "transparent", alignItems:"center" }}>
              <div style={{ fontSize:12, color:"#4A5568", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{w.assignee}</div>
              <div style={{ fontSize:12, color:"#4A5568" }}>{w.tasks}</div>
              <div style={{ fontSize:12, fontWeight:600, color: w.returns === 0 ? "#20C933" : w.returns >= 5 ? "#E53E3E" : "#FF6F2C" }}>
                {w.returns > 0 ? `↩ ${w.returns}` : "0"}
              </div>
              <div style={{ fontSize:12, color:"#4A5568" }}>{w.avgDays}д</div>
              <div style={{ fontSize:13 }}>{isBest ? "🏆" : ""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalyticsView({ tasks, qualifications, actqErrors }: { tasks: TaskRow[]; qualifications: Qualifications; actqErrors: ActqMap }) {
  const today = new Date().toISOString().slice(0, 10);
  const [sub, setSub]   = useState<"workers"|"clients">("workers");
  const [sortW, setSortW] = useState<"quality"|"name"|"tasks"|"returns"|"duration"|"overdue">("quality");
  const [sortC, setSortC] = useState<"name"|"tasks"|"returns">("tasks");

  const workerStats = buildWorkerStats(tasks, today);
  const clientStats = buildClientStats(tasks, today);

  // composite rating: ACTQ 35%, returns 30%, overdue 20%, speed 10%, tasks 5%
  const _norm = (v: number, min: number, max: number) => max === min ? 0.5 : (v - min) / (max - min);
  const actqRate = (name: string, total: number) => { const e = actqErrors.get(name); return e ? (e.Q + e.A + e.T1) / Math.max(total, 1) : 0; };
  const _actqRates = workerStats.map(w => actqRate(w.assignee, w.totalTasks));
  const _minAQ = Math.min(..._actqRates), _maxAQ = Math.max(..._actqRates);
  const _minR = Math.min(...workerStats.map(w => w.avgReturns)), _maxR = Math.max(...workerStats.map(w => w.avgReturns));
  const _minO = Math.min(...workerStats.map(w => w.overdue)),    _maxO = Math.max(...workerStats.map(w => w.overdue));
  const _minD = Math.min(...workerStats.map(w => w.avgDuration)),_maxD = Math.max(...workerStats.map(w => w.avgDuration));
  const _minT = Math.min(...workerStats.map(w => w.totalTasks)), _maxT = Math.max(...workerStats.map(w => w.totalTasks));
  const ratingScore = (w: WorkerStat) =>
    (1 - _norm(actqRate(w.assignee, w.totalTasks), _minAQ, _maxAQ)) * 0.35 +
    (1 - _norm(w.avgReturns, _minR, _maxR)) * 0.30 +
    (1 - _norm(w.overdue,    _minO, _maxO)) * 0.20 +
    (1 - _norm(w.avgDuration,_minD, _maxD)) * 0.10 +
    _norm(w.totalTasks,      _minT, _maxT)  * 0.05;
  const byQuality = [...workerStats].sort((a, b) => ratingScore(b) - ratingScore(a));
  const qualityRank = new Map(byQuality.map((w, i) => [w.assignee, i]));

  const sortedW = [...workerStats].sort((a, b) => {
    if (sortW === "quality")  return (qualityRank.get(a.assignee) ?? 0) - (qualityRank.get(b.assignee) ?? 0);
    if (sortW === "name")     return a.assignee.localeCompare(b.assignee);
    if (sortW === "tasks")    return b.totalTasks - a.totalTasks;
    if (sortW === "returns")  return b.totalReturns - a.totalReturns;
    if (sortW === "duration") return b.avgDuration - a.avgDuration;
    if (sortW === "overdue")  return b.overdue - a.overdue;
    return 0;
  });
  const sortedC = [...clientStats].sort((a, b) => {
    if (sortC === "name")    return a.name.localeCompare(b.name);
    if (sortC === "tasks")   return b.totalTasks - a.totalTasks;
    if (sortC === "returns") return b.totalReturns - a.totalReturns;
    return 0;
  });

  const wSortLabels: Record<string, string> = { quality:"★ Рейтинг", tasks:"Задачи ↓", returns:"Возвраты ↓", duration:"Ср.дней ↓", overdue:"Просроч ↓", name:"Имя" };
  const cSortLabels: Record<string, string> = { tasks:"Задачи ↓", returns:"Возвраты ↓", name:"Имя" };

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#fff", borderRadius:8, padding:3, gap:2, boxShadow:"0 1px 4px rgba(0,0,0,.07)" }}>
          {(["workers","clients"] as const).map(v => (
            <button key={v} onClick={() => setSub(v)}
              style={{ padding:"4px 16px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: sub===v ? "#1F2D3D" : "transparent", color: sub===v ? "#fff" : "#6B7A90", transition:"all .15s" }}>
              {v === "workers" ? `👤 Специалисты (${workerStats.length})` : `🏢 Клиенты (${clientStats.length})`}
            </button>
          ))}
        </div>
        <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Сорт:</span>
        {sub === "workers"
          ? (Object.keys(wSortLabels) as (keyof typeof wSortLabels)[]).map(v => (
              <span key={v} className="pill" onClick={() => setSortW(v as typeof sortW)}
                style={{ padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortW===v ? "#1F2D3D" : "#D8E0EC", background: sortW===v ? "#1F2D3D" : "#EEF2F7", color: sortW===v ? "#fff" : "#6B7A90" }}>
                {wSortLabels[v]}
              </span>
            ))
          : (Object.keys(cSortLabels) as (keyof typeof cSortLabels)[]).map(v => (
              <span key={v} className="pill" onClick={() => setSortC(v as typeof sortC)}
                style={{ padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortC===v ? "#1F2D3D" : "#D8E0EC", background: sortC===v ? "#1F2D3D" : "#EEF2F7", color: sortC===v ? "#fff" : "#6B7A90" }}>
                {cSortLabels[v]}
              </span>
            ))
        }
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{tasks.length} задач</span>
      </div>
      {sub === "workers" && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, fontSize:11, color:"#7A8A9E" }}>
            <span style={{ width:10, height:10, borderRadius:3, background:"#16A34A", display:"inline-block" }} />
            лучший
            <span style={{ color:"#D8E0EC" }}>→</span>
            <span style={{ width:10, height:10, borderRadius:3, background:"#EF4444", display:"inline-block" }} />
            худший
            <span style={{ color:"#D8E0EC", margin:"0 4px" }}>·</span>
            критерий: кол-во возвратов / задачу
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
            {sortedW.map(w => (
              <WorkerCard key={w.assignee} stat={w} rank={qualityRank.get(w.assignee) ?? 0} totalWorkers={workerStats.length} qualifications={qualifications[w.assignee] || []} actq={actqErrors.get(w.assignee)} />
            ))}
          </div>
        </>
      )}
      {sub === "clients" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(400px,1fr))", gap:14 }}>
          {sortedC.map(c => <ClientCard key={c.name} stat={c} />)}
        </div>
      )}
    </div>
  );
}

// ─── Matching ─────────────────────────────────────────────────────────────────
const TASK_TYPES = ["Interior", "Exterior", "Modeling", "Animation", "Photoshop"] as const;
type TaskType = typeof TASK_TYPES[number];
type Qualifications = Record<string, string[]>;

const MATCH_PRIORITIES: Record<TaskType, string[][]> = {
  "Interior":   [["SDC int+"], ["SDC int"], ["MLR int"]],
  "Exterior":   [["SDC ext+"], ["SDC ext"], ["MLR ext"]],
  "Modeling":   [["MDF+"], ["MDF"], ["FD"]],
  "Animation":  [["Animation+"], ["Animation"]],
  "Photoshop":  [["Ps+"], ["Ps"]],
};

const PRIORITY_LABELS: Record<TaskType, string[]> = {
  "Interior":   ["SDC int+", "SDC int", "MLR int"],
  "Exterior":   ["SDC ext+", "SDC ext", "MLR ext"],
  "Modeling":   ["MDF+", "MDF", "FD"],
  "Animation":  ["Animation+", "Animation"],
  "Photoshop":  ["Ps+", "Ps"],
};

const PRIORITY_COLORS = ["#16A34A", "#4A7BF7", "#F97316"];

function MatchingView({ tasks, qualifications, actqErrors, onWorkerClick }: { tasks: TaskRow[]; qualifications: Qualifications; actqErrors: ActqMap; onWorkerClick: (name: string) => void }) {
  const [taskType, setTaskType] = useState<TaskType | null>(null);
  const [requireBcLennar, setRequireBcLennar] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const ACTIVE = new Set(["In progress", "Paused", "Quality control"]);

  const activeCountMap = new Map<string, number>();
  for (const t of tasks) {
    if (ACTIVE.has(t.current_status)) {
      activeCountMap.set(t.assignee, (activeCountMap.get(t.assignee) || 0) + 1);
    }
  }

  const workerStats = buildWorkerStats(tasks, today);
  const workerStatMap = new Map(workerStats.map(w => [w.assignee, w]));

  // composite rating (same formula as AnalyticsView)
  const _norm = (v: number, min: number, max: number) => max === min ? 0.5 : (v - min) / (max - min);
  const _actqRate = (name: string, total: number) => { const e = actqErrors.get(name); return e ? (e.Q + e.A + e.T1) / Math.max(total, 1) : 0; };
  const _actqRates = workerStats.map(w => _actqRate(w.assignee, w.totalTasks));
  const _minAQ = Math.min(..._actqRates), _maxAQ = Math.max(..._actqRates);
  const _minR = Math.min(...workerStats.map(w => w.avgReturns)), _maxR = Math.max(...workerStats.map(w => w.avgReturns));
  const _minO = Math.min(...workerStats.map(w => w.overdue)),    _maxO = Math.max(...workerStats.map(w => w.overdue));
  const _minD = Math.min(...workerStats.map(w => w.avgDuration)),_maxD = Math.max(...workerStats.map(w => w.avgDuration));
  const _minT = Math.min(...workerStats.map(w => w.totalTasks)), _maxT = Math.max(...workerStats.map(w => w.totalTasks));
  const ratingScore = (name: string) => {
    const w = workerStatMap.get(name);
    if (!w) return 0;
    return (1 - _norm(_actqRate(name, w.totalTasks), _minAQ, _maxAQ)) * 0.35 +
           (1 - _norm(w.avgReturns, _minR, _maxR)) * 0.30 +
           (1 - _norm(w.overdue,    _minO, _maxO)) * 0.20 +
           (1 - _norm(w.avgDuration,_minD, _maxD)) * 0.10 +
           _norm(w.totalTasks,      _minT, _maxT)  * 0.05;
  };

  const wColor = (n: number) => n === 0 ? "#16A34A" : n <= 2 ? "#F97316" : "#EF4444";
  const wBg    = (n: number) => n === 0 ? "#ECFBF1" : n <= 2 ? "#FFF2EC" : "#FFF0F0";
  const wLabel = (n: number) => n === 0 ? "Свободен" : `${n} акт.`;

  // gradient helpers (yellow → orange by load)
  const maxActive = Math.max(...Array.from(activeCountMap.values()), 1);
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const busyBg     = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(254,255,t)},${lerp(252,237,t)},${lerp(232,213,t)})`; };
  const busyText   = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(161,234,t)},${lerp(98,88,t)},${lerp(7,12,t)})`; };
  const busyBorder = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(234,249,t)},${lerp(179,115,t)},${lerp(8,22,t)})`; };
  const cardBg     = (n: number) => n === 0 ? "#ECFBF1" : busyBg(n);
  const cardBorder = (n: number) => n === 0 ? "#16A34A" : busyBorder(n);
  const cardText   = (n: number) => n === 0 ? "#16A34A" : busyText(n);

  // average activeTasks for specialists matching each task type
  const typeAvgLoad = (tt: TaskType): number => {
    const allSkills = MATCH_PRIORITIES[tt].flat();
    const matching = Object.entries(qualifications).filter(([, q]) => allSkills.some(s => q.includes(s)));
    if (!matching.length) return 0;
    return matching.reduce((s, [name]) => s + (activeCountMap.get(name) || 0), 0) / matching.length;
  };
  // button color based on avg load: 0 = green, >0 gradient yellow→orange
  const typeBtnStyle = (tt: TaskType, active: boolean): React.CSSProperties => {
    if (active) return { background:"#1F2D3D", color:"#fff", borderColor:"#1F2D3D" };
    const avg = typeAvgLoad(tt);
    if (avg === 0) return { background:"#ECFBF1", color:"#16A34A", borderColor:"#16A34A66" };
    return { background:busyBg(avg), color:busyText(avg), borderColor:`${busyBorder(avg)}88` };
  };

  // — No task type selected: flat list of all specialists, free-first by rating
  if (taskType === null) {
    const allWorkers = Object.entries(qualifications)
      .filter(([, quals]) => !requireBcLennar || quals.includes("BC Lennar"))
      .map(([name, quals]) => ({
        assignee: name,
        qualifications: quals,
        activeTasks: activeCountMap.get(name) || 0,
        score: ratingScore(name),
      }))
      .sort((a, b) => a.activeTasks - b.activeTasks || b.score - a.score);

    return (
      <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:18, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Тип задачи</span>
          {TASK_TYPES.map(t => (
            <button key={t} onClick={() => setTaskType(t)}
              style={{ padding:"5px 14px", borderRadius:7, border:"1.5px solid", cursor:"pointer", fontSize:12, fontWeight:600,
                ...typeBtnStyle(t, false) }}>
              {t}
            </button>
          ))}
          <div style={{ width:1, height:22, background:"#D8E0EC", margin:"0 4px" }} />
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={requireBcLennar} onChange={e => setRequireBcLennar(e.target.checked)}
              style={{ width:14, height:14, accentColor:"#4A7BF7" }} />
            <span style={{ fontSize:12, fontWeight:600, color:"#4A7BF7" }}>BC Lennar</span>
          </label>
          <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{allWorkers.length} специалистов — очередь по загрузке</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
          {allWorkers.map((w) => (
            <div key={w.assignee} className="glow-card"
              style={{ background:cardBg(w.activeTasks), borderRadius:10, overflow:"hidden", border:`1.5px solid ${cardBorder(w.activeTasks)}44` }}>
              <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${cardBorder(w.activeTasks)}22` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1A2035", cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 }}
                    onClick={() => onWorkerClick(w.assignee)}>{w.assignee}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:cardText(w.activeTasks), background:"#fff",
                    padding:"2px 8px", borderRadius:4, flexShrink:0, whiteSpace:"nowrap" }}>
                    {wLabel(w.activeTasks)}
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {w.qualifications.map(q => (
                    <span key={q} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:600, border:"1px solid",
                      ...qualBadgeStyle(q) }}>
                      {q}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ padding:"6px 14px 8px", borderTop:"1px solid rgba(0,0,0,.07)", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:"#6B7A90" }}>↩ {workerStatMap.get(w.assignee)?.avgReturns ?? 0}/зад</span>
                <div style={{ width:1, height:12, background:"rgba(0,0,0,.1)" }} />
                {(() => { const e = actqErrors.get(w.assignee); const hasErr = e && (e.Q > 0 || e.A > 0 || e.T1 > 0); return hasErr ? <>
                  {e!.Q  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {e!.Q}</span>}
                  {e!.A  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {e!.A}</span>}
                  {e!.T1 > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {e!.T1}</span>}
                </> : <span style={{ fontSize:10, color:"rgba(0,0,0,.2)" }}>ACTQ —</span>; })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // — Task type selected: grouped by priority
  const priorities = MATCH_PRIORITIES[taskType];
  const results: { assignee: string; qualifications: string[]; priority: number; matchingSkill: string; activeTasks: number; avgReturns: number }[] = [];
  const assigned = new Set<string>();

  for (let pi = 0; pi < priorities.length; pi++) {
    const skills = priorities[pi];
    const group = Object.entries(qualifications)
      .filter(([name, quals]) => {
        if (assigned.has(name)) return false;
        if (requireBcLennar && !quals.includes("BC Lennar")) return false;
        return skills.some(s => quals.includes(s));
      })
      .map(([name, quals]) => ({
        assignee: name,
        qualifications: quals,
        priority: pi + 1,
        matchingSkill: skills.find(s => quals.includes(s))!,
        activeTasks: activeCountMap.get(name) || 0,
        avgReturns: workerStatMap.get(name)?.avgReturns || 0,
      }))
      .sort((a, b) => a.activeTasks - b.activeTasks);
    for (const r of group) { results.push(r); assigned.add(r.assignee); }
  }

  const byPriority: Record<number, typeof results> = {};
  for (const r of results) { (byPriority[r.priority] ??= []).push(r); }

  const pColor = (p: number) => PRIORITY_COLORS[p - 1] || "#94A3B8";

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      <div style={{ display:"flex", gap:8, marginBottom:18, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Тип задачи</span>
        {TASK_TYPES.map(t => (
          <button key={t} onClick={() => setTaskType(t === taskType ? null : t)}
            style={{ padding:"5px 14px", borderRadius:7, border:"1.5px solid", cursor:"pointer", fontSize:12, fontWeight:600,
              ...typeBtnStyle(t, t === taskType) }}>
            {t}
          </button>
        ))}
        <div style={{ width:1, height:22, background:"#D8E0EC", margin:"0 4px" }} />
        <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
          <input type="checkbox" checked={requireBcLennar} onChange={e => setRequireBcLennar(e.target.checked)}
            style={{ width:14, height:14, accentColor:"#4A7BF7" }} />
          <span style={{ fontSize:12, fontWeight:600, color:"#4A7BF7" }}>BC Lennar</span>
        </label>
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{results.length} специалистов</span>
      </div>

      {results.length === 0
        ? <div style={{ textAlign:"center", padding:40, color:"#9AA5B4", fontSize:14 }}>
            Нет специалистов{requireBcLennar ? " с доступом BC Lennar" : ""}
          </div>
        : Object.entries(byPriority).map(([p, workers]) => (
          <div key={p} style={{ marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ padding:"3px 12px", borderRadius:6, background:pColor(+p), color:"#fff", fontSize:11, fontWeight:700, letterSpacing:".3px" }}>
                {PRIORITY_LABELS[taskType][+p - 1]}
              </div>
              <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
              <span style={{ fontSize:11, color:"#9AA5B4" }}>{workers.length} чел.</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
              {workers.map(w => (
                <div key={w.assignee} className="glow-card"
                  style={{ background:cardBg(w.activeTasks), borderRadius:10, overflow:"hidden", borderLeft:`3px solid ${pColor(+p)}`, border:`1.5px solid ${cardBorder(w.activeTasks)}44`, borderLeftWidth:3, borderLeftColor:pColor(+p) }}>
                  <div style={{ padding:"10px 14px 8px", borderBottom:`1px solid ${cardBorder(w.activeTasks)}22` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:8 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1A2035", cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 }}
                        onClick={() => onWorkerClick(w.assignee)}>{w.assignee}</div>
                      <div style={{ fontSize:11, fontWeight:700, color:cardText(w.activeTasks), background:"#fff",
                        padding:"2px 8px", borderRadius:4, flexShrink:0, whiteSpace:"nowrap" }}>
                        {wLabel(w.activeTasks)}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {w.qualifications.map(q => (
                        <span key={q} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:600,
                          background: q === w.matchingSkill ? "#16A34A" : "#F1F5F9",
                          color:      q === w.matchingSkill ? "#fff" : "#64748B" }}>
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding:"6px 14px 8px", borderTop:"1px solid rgba(0,0,0,.07)", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:"#6B7A90" }}>↩ {w.avgReturns}/зад</span>
                    <div style={{ width:1, height:12, background:"rgba(0,0,0,.1)" }} />
                    {(() => { const e = actqErrors.get(w.assignee); const hasErr = e && (e.Q > 0 || e.A > 0 || e.T1 > 0); return hasErr ? <>
                      {e!.Q  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {e!.Q}</span>}
                      {e!.A  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {e!.A}</span>}
                      {e!.T1 > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {e!.T1}</span>}
                    </> : <span style={{ fontSize:10, color:"rgba(0,0,0,.2)" }}>ACTQ —</span>; })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
}

function WorkerModal({ name, tasks, qualifications, actqErrors, onClose }: { name: string; tasks: TaskRow[]; qualifications: Qualifications; actqErrors: ActqMap; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const allStats = buildWorkerStats(tasks, today);
  const stat = allStats.find(w => w.assignee === name);
  if (!stat) return null;
  const norm = (v: number, mn: number, mx: number) => mx === mn ? 0.5 : (v - mn) / (mx - mn);
  const aqRate = (w: WorkerStat) => { const e = actqErrors.get(w.assignee); return e ? (e.Q+e.A+e.T1)/Math.max(w.totalTasks,1) : 0; };
  const minAQ = Math.min(...allStats.map(aqRate)), maxAQ = Math.max(...allStats.map(aqRate));
  const minR  = Math.min(...allStats.map(w=>w.avgReturns)), maxR = Math.max(...allStats.map(w=>w.avgReturns));
  const minO  = Math.min(...allStats.map(w=>w.overdue)),    maxO = Math.max(...allStats.map(w=>w.overdue));
  const minD  = Math.min(...allStats.map(w=>w.avgDuration)),maxD = Math.max(...allStats.map(w=>w.avgDuration));
  const minT  = Math.min(...allStats.map(w=>w.totalTasks)), maxT = Math.max(...allStats.map(w=>w.totalTasks));
  const score = (w: WorkerStat) =>
    (1-norm(aqRate(w),minAQ,maxAQ))*0.35 + (1-norm(w.avgReturns,minR,maxR))*0.30 +
    (1-norm(w.overdue,minO,maxO))*0.20   + (1-norm(w.avgDuration,minD,maxD))*0.10 +
    norm(w.totalTasks,minT,maxT)*0.05;
  const rank = [...allStats].sort((a,b) => score(b)-score(a)).findIndex(w => w.assignee === name);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(15,22,36,.6)", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"relative", width:440, maxHeight:"90vh", overflowY:"auto", borderRadius:16, boxShadow:"0 24px 64px rgba(0,0,0,.35)" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          style={{ position:"absolute", top:10, right:10, zIndex:10, width:26, height:26, borderRadius:6, border:"none", background:"rgba(255,255,255,.15)", color:"#fff", cursor:"pointer", fontSize:18, lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        <WorkerCard stat={stat} rank={rank} totalWorkers={allStats.length} qualifications={qualifications[name]||[]} actq={actqErrors.get(name)} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CsvGantt() {
  const [tasks, setTasks]           = useState<TaskRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState<"gantt"|"cards"|"analytics"|"matching">("gantt");
  const [period, setPeriod]         = useState<"1m"|"3m"|"6m"|"all">("3m");
  const [qualifications, setQualifications] = useState<Qualifications>({});
  const [actqErrors, setActqErrors]         = useState<ActqMap>(new Map());
  const [groupBy, setGroupBy]       = useState<"assignee"|"project">("assignee");
  const [search, setSearch]         = useState("");
  const [hideStatus, setHideStatus] = useState<Set<string>>(new Set(["Done"]));
  const [workerModal, setWorkerModal] = useState<string | null>(null);
  const [collapsed, setCollapsed]   = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const [tooltip, setTooltip]       = useState<{ task: TaskRow; x: number; y: number } | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${base}/tasks.csv`).then(r => r.text()).then(raw => {
      const parsed = parseCSV(raw);
      setTasks(parsed);
      setLoading(false);
      const assigneeMap = new Map(parsed.map(t => [t.id, t.assignee]));
      fetch(`${base}/hashtags.csv`).then(r => r.text()).then(hraw => setActqErrors(parseHashtags(hraw, assigneeMap))).catch(() => {});
    });
    fetch(`${base}/qualifications.json`).then(r => r.json()).then(setQualifications).catch(() => {});
  }, []);

  useEffect(() => {
    if (!tasks.length || !scrollerRef.current || view !== "gantt") return;
    const today = new Date().toISOString().slice(0, 10);
    const vs = tasks.flatMap(t => t.segments.map(s => s.from)).sort()[0] || today;
    scrollerRef.current.scrollLeft = Math.max(0, (dif(vs, today) - 7) * DW);
  }, [tasks, view]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", gap:10, color:"#6B7A90", fontSize:14 }}>
      <span style={{ width:18, height:18, border:"2px solid #D8E0EC", borderTopColor:"#2D7FF9", borderRadius:"50%", animation:"sp .7s linear infinite", display:"inline-block" }} />
      Загрузка…
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const today = new Date().toISOString().slice(0, 10);

  const PERIOD_DAYS: Record<string, number | null> = { "1m":30, "3m":90, "6m":180, "all":null };
  const periodDays = PERIOD_DAYS[period];
  const periodStart = periodDays != null ? addD(today, -periodDays) : null;
  const periodTasks = periodStart
    ? tasks.filter(t => t.segments.some(s => s.to >= periodStart))
    : tasks;

  const allDates = periodTasks.flatMap(t => t.segments.map(s => s.from)).sort();
  const vs = periodStart || allDates[0] || today;
  const ve = addD(today, 14);
  const days: string[] = [];
  for (let i = 0; i <= dif(vs, ve); i++) days.push(addD(vs, i));
  const TW = days.length * DW;
  const todayX = dif(vs, today) * DW;

  let filtered = periodTasks.filter(t => !hideStatus.has(t.current_status));
  if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search) || t.assignee.toLowerCase().includes(search));

  const groupMap: Record<string, TaskRow[]> = {};
  for (const t of filtered) {
    const key = groupBy === "assignee" ? t.assignee : t.project;
    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(t);
  }
  const groups = Object.entries(groupMap).sort(([a],[b]) => a.localeCompare(b));
  const mmap: Record<string, number> = {};
  for (const d of days) { const mk = d.slice(0,7); mmap[mk] = (mmap[mk]||0)+1; }
  const toggleGroup = (k: string) => setCollapsed(p => { const n = new Set(p); n.has(k)?n.delete(k):n.add(k); return n; });
  const toggleSt = (s: string) => setHideStatus(p => { const n = new Set(p); n.has(s)?n.delete(s):n.add(s); return n; });

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',system-ui,sans-serif", background:"#F3F5F8", color:"#1A2035", fontSize:13, overflow:"hidden", height:"100vh", display:"flex", flexDirection:"column", WebkitFontSmoothing:"antialiased" } as React.CSSProperties}>
      <style>{`
        @keyframes sp{to{transform:rotate(360deg)}}
        .task-link{font-size:11px;color:#4A7BF7;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;width:100%;font-weight:500}
        .task-link:hover{text-decoration:underline}
        .grow-row:hover{background:#F0F5FF!important}
        .pill{transition:all .15s;user-select:none;cursor:pointer}
        .pill:hover{opacity:.8}
        .glow-card{transition:box-shadow .2s,transform .2s,border-color .2s;will-change:transform;border:1px solid #E2E8F0!important}
        .glow-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.05)!important;transform:translateY(-1px)}
      `}</style>

      {/* NAV */}
      <nav style={{ height:56, background:"#161E2D", display:"flex", alignItems:"center", padding:"0 24px", gap:16, flexShrink:0, boxShadow:"0 1px 0 rgba(255,255,255,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#2D7FF9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>A</div>
          <div>
            <div style={{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:"-.2px", lineHeight:1 }}>ARCHI <span style={{ color:"#2D7FF9" }}>Gantt</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:2 }}>{tasks.length} задач · CSV</div>
          </div>
        </div>
        {/* View switcher */}
        <div style={{ display:"flex", background:"rgba(255,255,255,.07)", borderRadius:8, padding:3, gap:1 }}>
          {(["gantt","cards","analytics","matching"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding:"5px 16px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background: view===v ? "#2D7FF9" : "transparent", color: view===v ? "#fff" : "rgba(255,255,255,.5)", transition:"all .15s", letterSpacing:"-.1px" }}>
              {v === "gantt" ? "Ганта" : v === "cards" ? "Задачи" : v === "analytics" ? "Аналитика" : "Раздача"}
            </button>
          ))}
        </div>
        {/* Period selector */}
        <div style={{ display:"flex", background:"rgba(255,255,255,.07)", borderRadius:8, padding:3, gap:1 }}>
          {(["1m","3m","6m","all"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{ padding:"4px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:600,
                background: period===p ? "rgba(255,255,255,.18)" : "transparent",
                color: period===p ? "#fff" : "rgba(255,255,255,.4)", transition:"all .15s" }}>
              {p === "1m" ? "1 мес" : p === "3m" ? "3 мес" : p === "6m" ? "6 мес" : "Всё"}
            </button>
          ))}
        </div>
        <a href="/" style={{ padding:"6px 14px", borderRadius:6, border:"1px solid rgba(255,255,255,.12)", background:"transparent", color:"rgba(255,255,255,.6)", fontSize:12, fontWeight:500, textDecoration:"none", transition:"all .15s" }}>← API</a>
      </nav>

      {/* FILTERS */}
      {view !== "analytics" && view !== "matching" && <div style={{ background:"#fff", margin:"12px 20px 0", borderRadius:12, padding:"10px 16px", display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", boxShadow:"0 1px 6px rgba(0,0,0,.07)", flexShrink:0 }}>
        {view === "gantt" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Group</span>
              {(["assignee","project"] as const).map(v => (
                <span key={v} className="pill" onClick={() => setGroupBy(v)}
                  style={{ padding:"4px 11px", borderRadius:6, fontSize:12, fontWeight:600, border:"1.5px solid", borderColor:groupBy===v?"#1F2D3D":"#D8E0EC", background:groupBy===v?"#1F2D3D":"#EEF2F7", color:groupBy===v?"#fff":"#6B7A90" }}>
                  {v === "assignee" ? "By Worker" : "By Project"}
                </span>
              ))}
            </div>
            <div style={{ width:1, height:22, background:"#D8E0EC" }} />
          </>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Status</span>
          {ALL_STATUSES.map(s => {
            const off = hideStatus.has(s);
            const pill = SC_PILL[s] || { bg:"#EEF4FF", tx:"#3A6AE6", border:"#BFDBFE" };
            return (
              <span key={s} className="pill" onClick={() => toggleSt(s)}
                style={{ padding:"3px 9px", borderRadius:5, fontSize:11, fontWeight:500, border:"1.5px solid",
                  borderColor: off ? "#D8E0EC" : pill.border,
                  background:  off ? "transparent" : pill.bg,
                  color:       off ? "#9AA5B4" : pill.tx,
                  opacity: off ? .5 : 1 }}>
                {STATUS_SHORT[s]||s}
              </span>
            );
          })}
        </div>
        <div style={{ width:1, height:22, background:"#D8E0EC" }} />
        <input placeholder="🔍 Задача / воркер…" value={search} onChange={e => setSearch(e.target.value.toLowerCase())}
          style={{ padding:"5px 11px", borderRadius:6, border:"1.5px solid #D8E0EC", background:"#EEF2F7", fontSize:13, outline:"none", width:170 }} />
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{filtered.length} задач</span>
      </div>}

      {/* CONTENT */}
      {view === "analytics"
        ? <AnalyticsView tasks={periodTasks} qualifications={qualifications} actqErrors={actqErrors} />
        : view === "matching"
        ? <MatchingView tasks={tasks} qualifications={qualifications} actqErrors={actqErrors} onWorkerClick={setWorkerModal} />
        : view === "cards"
        ? <CardsView tasks={periodTasks} search={search} hideStatus={hideStatus} onSelect={setSelectedTask} />
        : (
          <div style={{ flex:1, overflow:"hidden", margin:"12px 20px 16px", borderRadius:12, boxShadow:"0 1px 8px rgba(0,0,0,.08)", background:"#fff", display:"flex", flexDirection:"column" }}>
            {filtered.length === 0
              ? <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:"#6B7A90" }}>Нет задач</div>
              : <div ref={scrollerRef} style={{ flex:1, overflow:"auto" }}>
                  {/* Header */}
                  <div style={{ position:"sticky", top:0, zIndex:30, display:"flex", minWidth:`calc(520px + ${TW}px)`, background:"#1F2D3D" }}>
                    <div style={{ position:"sticky", left:0, zIndex:20, width:520, flexShrink:0, display:"flex", background:"#1F2D3D" }}>
                      {[["Task",260],["Assignee",130],["Status",130]].map(([l,w])=>(
                        <div key={l} style={{ width:+w, flexShrink:0, padding:"0 12px", borderRight:"1px solid rgba(255,255,255,.12)", display:"flex", alignItems:"center", height:42, fontSize:11, fontWeight:600, color:"rgba(255,255,255,.8)", textTransform:"uppercase", letterSpacing:".3px" }}>{l}</div>
                      ))}
                    </div>
                    <div style={{ flex:1, background:"#1F2D3D" }}>
                      <div style={{ display:"flex" }}>
                        {Object.entries(mmap).map(([mk,n])=>(
                          <div key={mk} style={{ width:n*DW, height:21, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", borderRight:"1px solid rgba(255,255,255,.15)", whiteSpace:"nowrap", overflow:"hidden" }}>{fmtM(mk+"-01")}</div>
                        ))}
                      </div>
                      <div style={{ display:"flex" }}>
                        {days.map((d,i)=>{
                          const isT=d===today, isW=[0,6].includes(new Date(d).getDay());
                          return <div key={i} style={{ width:DW, height:21, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:isT?"#fff":"rgba(255,255,255,.65)", borderRight:"1px solid rgba(255,255,255,.08)", borderTop:"1px solid rgba(255,255,255,.1)", background:isT?"#2D7FF9":"transparent", fontWeight:isT?700:undefined, opacity:(!isT&&isW)?.4:1 }}>{new Date(d).getDate()}</div>;
                        })}
                      </div>
                    </div>
                  </div>

                  {groups.map(([gk, gt]) => {
                    const isc = collapsed.has(gk);
                    return (
                      <div key={gk}>
                        <div onClick={()=>toggleGroup(gk)} style={{ display:"flex", cursor:"pointer", borderTop:"1px solid #E2E8F0", minWidth:`calc(520px + ${TW}px)` }}>
                          <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, background:"#F8FAFC", borderRight:"1px solid #E2E8F0", borderLeft:"3px solid #2D7FF9", display:"flex", alignItems:"center", gap:8, padding:"7px 12px", fontWeight:700, fontSize:12, color:"#1F2D3D" }}>
                            <span style={{ fontSize:9, transform:isc?"rotate(-90deg)":"none", transition:"transform .2s", color:"#9AA5B4" }}>▼</span>
                            {gk} <span style={{ fontWeight:400, fontSize:11, color:"#9AA5B4" }}>{gt.length}</span>
                          </div>
                          <div style={{ flex:1, background:"#F8FAFC", borderTop:"none" }} />
                        </div>
                        {!isc && gt.map((t, ri) => {
                          const ACTIVE_ST = new Set(["In progress", "Paused", "Quality control"]);
                          const isGanttOverdue = ACTIVE_ST.has(t.current_status) && !!t.planned_end && t.planned_end < today;
                          const rowBg = isGanttOverdue ? "#FFF5F5" : ri%2===0?"#fff":"#FAFBFC";
                          const deadlineX = t.planned_end ? dif(vs, t.planned_end)*DW : null;
                          return (
                            <div key={t.id} className="grow-row" onClick={() => setSelectedTask(t)} style={{ display:"flex", height:36, borderTop:"1px solid #D8E0EC", background:rowBg, minWidth:`calc(520px + ${TW}px)`, cursor:"pointer", borderLeft: isGanttOverdue ? "3px solid #E53E3E" : "3px solid transparent" }}>
                              <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, display:"flex", background:rowBg }}>
                                <div style={{ width:260, flexShrink:0, padding:"0 12px", borderRight:"1px solid #D8E0EC", display:"flex", alignItems:"center", overflow:"hidden" }}>
                                  <a className="task-link" href={`https://archivizer.com/tasks/${t.id}`} target="_blank" rel="noreferrer" title={t.name} onClick={e => e.stopPropagation()}>{t.name}</a>
                                </div>
                                <div style={{ width:130, flexShrink:0, padding:"0 10px", borderRight:"1px solid #D8E0EC", display:"flex", alignItems:"center", fontSize:12, color:"#6B7A90", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{t.assignee}</div>
                                <div style={{ width:130, flexShrink:0, padding:"0 8px", borderRight:"1px solid #E2E8F0", display:"flex", alignItems:"center" }}>
                                  {(() => { const p = SC_PILL[t.current_status] || { bg:"#F1F5F9", tx:"#64748B", border:"#E2E8F0" }; return (
                                    <span style={{ padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:500, whiteSpace:"nowrap", background:p.bg, color:p.tx, border:`1px solid ${p.border}` }}>{STATUS_SHORT[t.current_status]||t.current_status}</span>
                                  ); })()}
                                </div>
                              </div>
                              <div style={{ width:TW, flexShrink:0, position:"relative", overflow:"hidden", background:`linear-gradient(to right,rgba(0,0,0,0.035) 0,rgba(0,0,0,0.035) ${todayX}px,transparent ${todayX}px),repeating-linear-gradient(to right,#DDE8F5 0,#DDE8F5 1px,transparent 1px,transparent ${DW}px)` }}>
                                {t.segments.map((seg,si)=>{
                                  const x0=dif(vs,seg.from)*DW, x1=dif(vs,seg.to)*DW, w=Math.max(2,x1-x0);
                                  const sc=SC_SEG[seg.status]; if(!sc||x1<0||x0>TW) return null;
                                  return <div key={si}
                                    onMouseEnter={e => setTooltip({ task: t, x: e.clientX, y: e.clientY })}
                                    onMouseMove={e  => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                                    onMouseLeave={() => setTooltip(null)}
                                    style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", height:20, borderRadius:3, left:Math.max(0,x0), width:x0<0?w+x0:w, background:sc.bg, border:`1px solid ${sc.border}`, zIndex:2, cursor:"pointer" }} />;
                                })}
                                {deadlineX!==null && deadlineX>=0 && deadlineX<=TW && (
                                  <div title={`Дедлайн: ${fmtD(t.planned_end)}`} style={{ position:"absolute", top:0, bottom:0, left:deadlineX, width:2, background:"rgba(255,80,80,.7)", zIndex:3, pointerEvents:"none" }} />
                                )}
                                <div style={{ position:"absolute", top:0, bottom:0, left:todayX, width:DW, background:"rgba(45,127,249,.1)", borderLeft:"2px solid rgba(45,127,249,.5)", borderRight:"2px solid rgba(45,127,249,.5)", pointerEvents:"none", zIndex:4 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        )
      }
      {selectedTask && <TaskHistoryPanel task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {workerModal && <WorkerModal name={workerModal} tasks={tasks} qualifications={qualifications} actqErrors={actqErrors} onClose={() => setWorkerModal(null)} />}

      {tooltip && (() => {
        const t = tooltip.task;
        const today = new Date().toISOString().slice(0, 10);
        const lastTo = t.segments[t.segments.length-1]?.to || today;
        const totalDays = Math.max(1, dif(t.start_date, lastTo));
        const isOverdue = ["In progress","Paused","Quality control"].includes(t.current_status) && !!t.planned_end && t.planned_end < today;
        const daysLeft = t.planned_end ? dif(today, t.planned_end) : null;
        return (
          <div style={{ position:"fixed", left: tooltip.x + 14, top: tooltip.y - 10, zIndex:500, pointerEvents:"none",
            background:"rgba(22,30,45,.82)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
            color:"#fff", borderRadius:12, padding:"12px 16px", minWidth:230, maxWidth:300,
            boxShadow:"0 8px 32px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.08)",
            border:"1px solid rgba(255,255,255,.1)", fontSize:12, lineHeight:1.6 }}>
            <div style={{ fontWeight:700, marginBottom:6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
            <div style={{ color:"rgba(255,255,255,.55)", fontSize:11, marginBottom:8 }}>{t.project}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 12px" }}>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:10 }}>ВОРКЕР</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:10 }}>ДЛИТЕЛЬНОСТЬ</div>
              <div style={{ fontWeight:600 }}>{t.assignee}</div>
              <div style={{ fontWeight:600 }}>{totalDays} дн</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:10, marginTop:4 }}>QA ВОЗВРАТЫ</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:10, marginTop:4 }}>КЛИЕНТ ЦИКЛЫ</div>
              <div style={{ fontWeight:600, color: t.returns > 0 ? "#FF8C8C" : "#fff" }}>{t.returns > 0 ? `↩ ${t.returns}` : "—"}</div>
              <div style={{ fontWeight:600, color: t.client_returns > 0 ? "#FFB347" : "#fff" }}>{t.rfa_count > 0 ? `${t.rfa_count} RFA${t.client_returns > 0 ? ` · ↩${t.client_returns}×` : ""}` : "—"}</div>
            </div>
            {(isOverdue || daysLeft !== null) && t.current_status !== "Done" && (
              <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(255,255,255,.12)", fontSize:11,
                color: isOverdue ? "#FF8C8C" : daysLeft !== null && daysLeft <= 3 ? "#FFB347" : "rgba(255,255,255,.6)" }}>
                {isOverdue ? `🔴 просроч +${Math.abs(dif(today, t.planned_end))}д` : daysLeft === 0 ? "⚡ дедлайн сегодня" : daysLeft !== null && daysLeft <= 3 ? `⚡ ${daysLeft}д до дедлайна` : `дедлайн ${fmtD(t.planned_end)}`}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
