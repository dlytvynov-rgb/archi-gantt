"use client";

import { useEffect, useRef, useState } from "react";

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
  returns: number; // times went back to In progress from QA/Ready
}

const SC: Record<string, { bg: string; tx: string }> = {
  "In progress":          { bg: "#2D7FF9", tx: "#fff" },
  "Quality control":      { bg: "#8B46FF", tx: "#fff" },
  "Ready for acceptance": { bg: "#20C933", tx: "#fff" },
  "Done":                 { bg: "#0A8A3C", tx: "#fff" },
  "Setting task":         { bg: "#C2C2C2", tx: "#555" },
  "Paused":               { bg: "#FF6F2C", tx: "#fff" },
  "Pending more info":    { bg: "#FF6F2C", tx: "#fff" },
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
        start_date: from, segments: [], current_status: status, returns: 0 });
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

  // count returns = transitions from QA → In progress only
  for (const t of map.values()) {
    for (let i = 1; i < t.segments.length; i++) {
      if (t.segments[i].status === "In progress" &&
        t.segments[i-1].status === "Quality control")
        t.returns++;
    }
  }
  return Array.from(map.values());
}

// ─── Cards View ───────────────────────────────────────────────────────────────
function CardsView({ tasks, search, hideStatus, onSelect }: { tasks: TaskRow[]; search: string; hideStatus: Set<string>; onSelect: (t: TaskRow) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [sortBy, setSortBy] = useState<"assignee"|"deadline"|"returns"|"status">("assignee");

  let filtered = tasks.filter(t => !hideStatus.has(t.current_status));
  if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search) || t.assignee.toLowerCase().includes(search));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "assignee") return a.assignee.localeCompare(b.assignee);
    if (sortBy === "deadline") return (a.planned_end || "9").localeCompare(b.planned_end || "9");
    if (sortBy === "returns")  return b.returns - a.returns;
    if (sortBy === "status")   return a.current_status.localeCompare(b.current_status);
    return 0;
  });

  const col = (s: string) => SC[s]?.bg || "#ccc";
  const tx  = (s: string) => SC[s]?.tx || "#fff";

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      {/* Sort bar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
        <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Сортировка</span>
        {(["assignee","deadline","returns","status"] as const).map(v => (
          <span key={v} onClick={() => setSortBy(v)} className="pill"
            style={{ padding:"3px 10px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600, border:"1.5px solid", userSelect:"none",
              borderColor: sortBy===v ? "#1F2D3D" : "#D8E0EC", background: sortBy===v ? "#1F2D3D" : "#EEF2F7", color: sortBy===v ? "#fff" : "#6B7A90" }}>
            {v === "assignee" ? "Воркер" : v === "deadline" ? "Дедлайн" : v === "returns" ? "Возвраты ↓" : "Статус"}
          </span>
        ))}
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:12 }}>{sorted.length} задач</span>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:10, border:"1px solid #D8E0EC", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", background:"#1F2D3D", padding:"0 16px" }}>
          {["Задача","Воркер","Статус","Дедлайн","Возвраты","Прогресс"].map(h => (
            <div key={h} style={{ padding:"10px 8px", fontSize:11, fontWeight:600, color:"rgba(255,255,255,.75)", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {sorted.map((t, i) => {
          const isOverdue = t.planned_end && t.planned_end < today && t.current_status !== "Done";
          const totalDays = t.start_date && t.planned_end ? dif(t.start_date, t.planned_end) : 0;
          const doneDays  = t.start_date ? dif(t.start_date, today) : 0;
          const pct = totalDays > 0 ? Math.min(100, Math.round(doneDays / totalDays * 100)) : 0;
          const daysLeft = t.planned_end ? dif(today, t.planned_end) : null;

          // mini segment bar
          const segTotal = t.segments.length ? dif(t.segments[0].from, t.segments[t.segments.length-1].to || today) : 1;

          return (
            <div key={t.id} onClick={() => onSelect(t)} style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", padding:"0 16px", borderTop: i === 0 ? "none" : "1px solid #F0F4F8", background: i % 2 === 0 ? "#fff" : "#FAFBFC", minHeight:48, alignItems:"center", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F0F6FF")}
              onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFBFC")}>
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
                <span style={{ padding:"3px 8px", borderRadius:4, fontSize:11, fontWeight:600, background:col(t.current_status), color:tx(t.current_status), whiteSpace:"nowrap" }}>
                  {STATUS_SHORT[t.current_status] || t.current_status}
                </span>
              </div>

              {/* Deadline */}
              <div style={{ padding:"0 8px" }}>
                <div style={{ fontSize:12, fontWeight:600, color: isOverdue ? "#E53E3E" : "#4A5568" }}>
                  {t.planned_end ? fmtD(t.planned_end) : "—"}
                </div>
                {daysLeft !== null && t.current_status !== "Done" && (
                  <div style={{ fontSize:10, color: daysLeft < 0 ? "#E53E3E" : daysLeft <= 2 ? "#FF6F2C" : "#9AA5B4", marginTop:1 }}>
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
      </div>
    </div>
  );
}

// ─── Task History Panel ───────────────────────────────────────────────────────
function TaskHistoryPanel({ task, onClose }: { task: TaskRow; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const lastTo = task.segments[task.segments.length - 1]?.to || today;
  const totalDays = Math.max(1, dif(task.start_date, lastTo));

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:200 }} />
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:420, background:"#fff", zIndex:201, display:"flex", flexDirection:"column", boxShadow:"-4px 0 30px rgba(0,0,0,.22)", overflowY:"auto" }}>
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
            {([["Воркер", task.assignee || "—"], ["PM", task.pm || "—"], ["Дедлайн", task.planned_end ? fmtD(task.planned_end) : "—"], ["Возвраты", task.returns > 0 ? `↩ ${task.returns}` : "—"]] as [string,string][]).map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.38)", textTransform:"uppercase", letterSpacing:".4px", marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, fontWeight:600, color: l==="Возвраты" && task.returns > 0 ? "#FF8C8C" : "#fff" }}>{v}</div>
              </div>
            ))}
          </div>
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

          {task.segments.map((seg, i) => {
            const prev = task.segments[i - 1];
            const isReturn = i > 0 && seg.status === "In progress" && !!prev &&
              prev.status === "Quality control";
            const days = dif(seg.from, seg.to || today);
            const sc = SC[seg.status];
            const isLast = i === task.segments.length - 1;

            return (
              <div key={i}>
                {isReturn && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 24px", color:"#E53E3E", fontSize:11, fontWeight:700 }}>
                    <span>↩ Возврат в работу</span>
                  </div>
                )}
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:12, flexShrink:0, marginTop:4 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%", background:sc?.bg || "#ccc", flexShrink:0 }} />
                    {!isLast && <div style={{ width:2, flex:1, minHeight:28, background:"#E4EAF1", marginTop:3 }} />}
                  </div>
                  <div style={{ flex:1, paddingBottom: isLast ? 0 : 14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:600, background:sc?.bg||"#ccc", color:sc?.tx||"#fff" }}>
                        {STATUS_SHORT[seg.status] || seg.status}
                      </span>
                      <span style={{ fontSize:11, color:"#9AA5B4", fontWeight:500 }}>{days} дн</span>
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

function WorkerCard({ stat }: { stat: WorkerStat }) {
  return (
    <div style={{ background:"#fff", borderRadius:10, border:"1px solid #D8E0EC", overflow:"hidden" }}>
      <div style={{ background:"#1F2D3D", padding:"12px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{stat.assignee}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>{stat.totalTasks} задач</div>
        </div>
        <div style={{ display:"flex", height:6, borderRadius:3, overflow:"hidden", marginTop:10, gap:1 }}>
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
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderBottom:"1px solid #EEF2F7" }}>
        {([
          ["Возвраты", `↩ ${stat.totalReturns}`, stat.totalReturns > 0 ? "#E53E3E" : "#9AA5B4", `${stat.avgReturns} /зад`],
          ["Ср. дней",  `${stat.avgDuration}д`,   "#1F2D3D", "всего"],
          ["Ср. IP",    `${stat.avgInProgress}д`,  "#2D7FF9", "In progress"],
          ["Просроч",   `${stat.overdue}`,          stat.overdue > 0 ? "#E53E3E" : "#9AA5B4", "сейчас"],
        ] as [string,string,string,string][]).map(([label, val, color, sub]) => (
          <div key={label} style={{ padding:"10px 8px", textAlign:"center", borderRight:"1px solid #EEF2F7" }}>
            <div style={{ fontSize:10, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px", marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:15, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:10, color:"#C0C9D6", marginTop:2 }}>{sub}</div>
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
    <div style={{ background:"#fff", borderRadius:10, border:"1px solid #D8E0EC", overflow:"hidden" }}>
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

function AnalyticsView({ tasks }: { tasks: TaskRow[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [sub, setSub]   = useState<"workers"|"clients">("workers");
  const [sortW, setSortW] = useState<"name"|"tasks"|"returns"|"duration"|"overdue">("tasks");
  const [sortC, setSortC] = useState<"name"|"tasks"|"returns">("tasks");

  const workerStats = buildWorkerStats(tasks, today);
  const clientStats = buildClientStats(tasks, today);

  const sortedW = [...workerStats].sort((a, b) => {
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

  const wSortLabels: Record<string, string> = { tasks:"Задачи ↓", returns:"Возвраты ↓", duration:"Ср.дней ↓", overdue:"Просроч ↓", name:"Имя" };
  const cSortLabels: Record<string, string> = { tasks:"Задачи ↓", returns:"Возвраты ↓", name:"Имя" };

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#fff", borderRadius:8, padding:3, gap:2, border:"1px solid #D8E0EC" }}>
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
                style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortW===v ? "#1F2D3D" : "#D8E0EC", background: sortW===v ? "#1F2D3D" : "#EEF2F7", color: sortW===v ? "#fff" : "#6B7A90" }}>
                {wSortLabels[v]}
              </span>
            ))
          : (Object.keys(cSortLabels) as (keyof typeof cSortLabels)[]).map(v => (
              <span key={v} className="pill" onClick={() => setSortC(v as typeof sortC)}
                style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortC===v ? "#1F2D3D" : "#D8E0EC", background: sortC===v ? "#1F2D3D" : "#EEF2F7", color: sortC===v ? "#fff" : "#6B7A90" }}>
                {cSortLabels[v]}
              </span>
            ))
        }
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>весь период · {tasks.length} задач</span>
      </div>
      {sub === "workers" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))", gap:14 }}>
          {sortedW.map(w => <WorkerCard key={w.assignee} stat={w} />)}
        </div>
      )}
      {sub === "clients" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(400px,1fr))", gap:14 }}>
          {sortedC.map(c => <ClientCard key={c.name} stat={c} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CsvGantt() {
  const [tasks, setTasks]     = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState<"gantt"|"cards"|"analytics">("gantt");
  const [groupBy, setGroupBy] = useState<"assignee"|"project">("assignee");
  const [search, setSearch]   = useState("");
  const [hideStatus, setHideStatus] = useState<Set<string>>(new Set(["Done"]));
  const [collapsed, setCollapsed]   = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<TaskRow | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const didScroll   = useRef(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(`${base}/tasks.csv`).then(r => r.text()).then(raw => { setTasks(parseCSV(raw)); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!tasks.length || didScroll.current || !scrollerRef.current || view !== "gantt") return;
    didScroll.current = true;
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
  const allDates = tasks.flatMap(t => t.segments.map(s => s.from)).sort();
  const vs = allDates[0] || today;
  const ve = addD(today, 14);
  const days: string[] = [];
  for (let i = 0; i <= dif(vs, ve); i++) days.push(addD(vs, i));
  const TW = days.length * DW;
  const todayX = dif(vs, today) * DW;

  let filtered = tasks.filter(t => !hideStatus.has(t.current_status));
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
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#EEF2F7", color:"#1F2D3D", fontSize:13, overflow:"hidden", height:"100vh", display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes sp{to{transform:rotate(360deg)}}
        .task-link{font-size:12px;color:#2D7FF9;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;width:100%}
        .task-link:hover{text-decoration:underline}
        .grow-row:hover{background:#F0F6FF!important}
        .pill{transition:all .15s;user-select:none;cursor:pointer}
        .pill:hover{opacity:.8}
      `}</style>

      {/* NAV */}
      <nav style={{ height:52, background:"#1F2D3D", display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,.25)" }}>
        <div style={{ color:"#fff", fontSize:15, fontWeight:700, flex:1 }}>
          ARCHI <span style={{ color:"#2D7FF9" }}>History</span>
          <span style={{ fontSize:11, fontWeight:400, color:"rgba(255,255,255,.4)", marginLeft:10 }}>{tasks.length} задач · CSV</span>
        </div>
        {/* View switcher */}
        <div style={{ display:"flex", background:"rgba(255,255,255,.1)", borderRadius:8, padding:3, gap:2 }}>
          {(["gantt","cards","analytics"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding:"4px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, background: view===v ? "#2D7FF9" : "transparent", color: view===v ? "#fff" : "rgba(255,255,255,.6)", transition:"all .15s" }}>
              {v === "gantt" ? "📊 Ганта" : v === "cards" ? "📋 Карточки" : "📈 Аналитика"}
            </button>
          ))}
        </div>
        <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>↖ кликни строку → история</span>
        <a href="/" style={{ padding:"6px 14px", borderRadius:6, border:"1px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.1)", color:"#fff", fontSize:12, fontWeight:600, textDecoration:"none" }}>← Gantt API</a>
      </nav>

      {/* FILTERS */}
      {view !== "analytics" && <div style={{ background:"#fff", margin:"12px 20px 0", borderRadius:10, padding:"10px 16px", display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", border:"1px solid #D8E0EC", flexShrink:0 }}>
        {view === "gantt" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>Group</span>
              {(["assignee","project"] as const).map(v => (
                <span key={v} className="pill" onClick={() => setGroupBy(v)}
                  style={{ padding:"4px 11px", borderRadius:20, fontSize:12, fontWeight:600, border:"1.5px solid", borderColor:groupBy===v?"#1F2D3D":"#D8E0EC", background:groupBy===v?"#1F2D3D":"#EEF2F7", color:groupBy===v?"#fff":"#6B7A90" }}>
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
            const c = SC[s]?.bg || "#ccc";
            return (
              <span key={s} className="pill" onClick={() => toggleSt(s)}
                style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, border:"1.5px solid", borderColor:c, background:off?"transparent":c, color:off?c:(SC[s]?.tx||"#fff"), opacity:off?.4:1 }}>
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
        ? <AnalyticsView tasks={tasks} />
        : view === "cards"
        ? <CardsView tasks={tasks} search={search} hideStatus={hideStatus} onSelect={setSelectedTask} />
        : (
          <div style={{ flex:1, overflow:"hidden", margin:"12px 20px 16px", borderRadius:10, border:"1px solid #D8E0EC", background:"#fff", display:"flex", flexDirection:"column" }}>
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
                        <div onClick={()=>toggleGroup(gk)} style={{ display:"flex", cursor:"pointer", borderTop:"2px solid #2C3E50", minWidth:`calc(520px + ${TW}px)` }}>
                          <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, background:"#D0DCE8", borderRight:"2px solid #2C3E50", display:"flex", alignItems:"center", gap:8, padding:"7px 12px", fontWeight:700, fontSize:13, color:"#1F2D3D" }}>
                            <span style={{ fontSize:9, transform:isc?"rotate(-90deg)":"none", transition:"transform .2s" }}>▼</span>
                            {gk} <span style={{ fontWeight:400, fontSize:11, opacity:.6 }}>{gt.length} задач</span>
                          </div>
                          <div style={{ flex:1, background:"#C8D8E8", opacity:.45, borderTop:"2px solid #2C3E50" }} />
                        </div>
                        {!isc && gt.map((t, ri) => {
                          const rowBg = ri%2===0?"#fff":"#FAFBFC";
                          const deadlineX = t.planned_end ? dif(vs, t.planned_end)*DW : null;
                          return (
                            <div key={t.id} className="grow-row" onClick={() => setSelectedTask(t)} style={{ display:"flex", height:36, borderTop:"1px solid #D8E0EC", background:rowBg, minWidth:`calc(520px + ${TW}px)`, cursor:"pointer" }}>
                              <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, display:"flex", background:rowBg }}>
                                <div style={{ width:260, flexShrink:0, padding:"0 12px", borderRight:"1px solid #D8E0EC", display:"flex", alignItems:"center", overflow:"hidden" }}>
                                  <a className="task-link" href={`https://archivizer.com/tasks/${t.id}`} target="_blank" rel="noreferrer" title={t.name} onClick={e => e.stopPropagation()}>{t.name}</a>
                                </div>
                                <div style={{ width:130, flexShrink:0, padding:"0 10px", borderRight:"1px solid #D8E0EC", display:"flex", alignItems:"center", fontSize:12, color:"#6B7A90", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{t.assignee}</div>
                                <div style={{ width:130, flexShrink:0, padding:"0 8px", borderRight:"2px solid #2C3E50", display:"flex", alignItems:"center" }}>
                                  <span style={{ padding:"2px 7px", borderRadius:4, fontSize:11, fontWeight:600, whiteSpace:"nowrap", background:SC[t.current_status]?.bg||"#ccc", color:SC[t.current_status]?.tx||"#fff" }}>{STATUS_SHORT[t.current_status]||t.current_status}</span>
                                </div>
                              </div>
                              <div style={{ width:TW, flexShrink:0, position:"relative", overflow:"hidden", background:`linear-gradient(to right,rgba(0,0,0,0.035) 0,rgba(0,0,0,0.035) ${todayX}px,transparent ${todayX}px),repeating-linear-gradient(to right,#DDE8F5 0,#DDE8F5 1px,transparent 1px,transparent ${DW}px)` }}>
                                {t.segments.map((seg,si)=>{
                                  const x0=dif(vs,seg.from)*DW, x1=dif(vs,seg.to)*DW, w=Math.max(2,x1-x0);
                                  const sc=SC[seg.status]; if(!sc||x1<0||x0>TW) return null;
                                  return <div key={si} title={`${seg.status}\n${fmtD(seg.from)} → ${fmtD(seg.to)} (${dif(seg.from,seg.to)}д)`}
                                    style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", height:18, borderRadius:2, left:Math.max(0,x0), width:x0<0?w+x0:w, background:sc.bg, opacity:.88, zIndex:2 }} />;
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
    </div>
  );
}
