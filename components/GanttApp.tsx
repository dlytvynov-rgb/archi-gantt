"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Task {
  name: string;
  worker: string;
  status: string;
  client: string;
  pm: string;
  mentor: string;
  bar_start: string;
  bar_end: string;
  url: string;
}

interface GanttData {
  tasks: Task[];
  view_start: string;
  view_end: string;
  today: string;
  cached_at: string;
}

const SC: Record<string, { bg: string; tx: string }> = {
  "In progress":          { bg: "#2D7FF9", tx: "#fff" },
  "Ready for Acceptance": { bg: "#20C933", tx: "#fff" },
  "QA":                   { bg: "#8B46FF", tx: "#fff" },
  "Pending more info":    { bg: "#FF6F2C", tx: "#fff" },
  "Setting task":         { bg: "#C2C2C2", tx: "#555" },
};

const SO = ["In progress", "Pending more info", "QA", "Ready for Acceptance", "Setting task"];
const DW = 28;

const dif = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5);
const addD = (s: string, n: number) => { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const fmtS = (s: string) => new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
const fmtM = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "long", year: "numeric" });

export default function GanttApp() {
  const [data, setData] = useState<GanttData | null>(null);
  const [groupBy, setGroupByState] = useState<"worker" | "status">("worker");
  const [filterPM, setFilterPMState] = useState("all");
  const [hideSt, setHideSt] = useState<Set<string>>(new Set());
  const [search, setSearchState] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [cardFilter, setCardFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [navStatus, setNavStatus] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstRenderRef = useRef(true);

  const DATA_URL = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data.json`;
  const IS_STATIC = !!process.env.NEXT_PUBLIC_BASE_PATH;
  const GH_REPO = "dlytvynov-rgb/archi-gantt";
  const GH_WORKFLOW = "update.yml";

  useEffect(() => {
    const url = IS_STATIC ? DATA_URL : "/api/data";
    fetch(url)
      .then((r) => r.json())
      .then((d: GanttData) => {
        d.today = new Date().toISOString().slice(0, 10);
        setData(d);
        setNavStatus(d.cached_at ? `cached ${d.cached_at}` : "");
      })
      .catch(() => setNavStatus("⚠ Failed to load data"));
  }, []);

  const doRefresh = async () => {
    if (!IS_STATIC) {
      // Local dev — use API route
      setRefreshing(true);
      setNavStatus("");
      try {
        const r = await fetch("/api/refresh", { method: "POST" });
        const d = await r.json();
        const fresh: GanttData = await (await fetch("/api/data")).json();
        setData(fresh);
        setNavStatus(`✓ ${d.count} tasks · ${d.cached_at}`);
      } catch (e: any) {
        setNavStatus("⚠ Error: " + e.message);
      } finally {
        setRefreshing(false);
      }
      return;
    }

    // GitHub Pages — trigger Actions workflow
    let pat = localStorage.getItem("gh_pat") || "";
    if (!pat) {
      pat = window.prompt("Введи GitHub Personal Access Token (scope: workflow):\n\ngithub.com → Settings → Developer settings → Personal access tokens") || "";
      if (!pat) return;
      localStorage.setItem("gh_pat", pat);
    }

    setRefreshing(true);
    setNavStatus("⏳ Запускаю обновление…");
    try {
      const resp = await fetch(
        `https://api.github.com/repos/${GH_REPO}/actions/workflows/${GH_WORKFLOW}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ref: "master" }),
        }
      );
      if (resp.status === 204) {
        setNavStatus("✓ Обновление запущено (~2 мин). Обновите страницу.");
      } else if (resp.status === 401) {
        localStorage.removeItem("gh_pat");
        setNavStatus("⚠ Неверный токен. Попробуй ещё раз.");
      } else {
        setNavStatus(`⚠ GitHub ответил: ${resp.status}`);
      }
    } catch (e: any) {
      setNavStatus("⚠ " + e.message);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSt = (s: string) => {
    setHideSt((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const handleCardClick = (st: string) => {
    if (st === "all" || st === "workers") {
      setCardFilter(null);
    } else {
      setCardFilter((prev) => (prev === st ? null : st));
    }
  };

  const toggleGroup = (k: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const filteredTasks = useCallback(() => {
    if (!data) return [];
    let tasks = data.tasks;
    if (filterPM !== "all") tasks = tasks.filter((t) => t.pm.includes(filterPM));
    tasks = tasks.filter((t) => !hideSt.has(t.status));
    if (cardFilter) tasks = tasks.filter((t) => t.status === cardFilter);
    if (search) tasks = tasks.filter((t) => t.worker.toLowerCase().includes(search) || t.name.toLowerCase().includes(search));
    return tasks;
  }, [data, filterPM, hideSt, cardFilter, search]);

  const tasks = filteredTasks();

  // Auto-scroll to today − 7 on first data load
  useEffect(() => {
    if (!data || !firstRenderRef.current || !scrollerRef.current) return;
    firstRenderRef.current = false;
    const todayIdx = dif(data.view_start, data.today);
    const scrollX = Math.max(0, (todayIdx - 7) * DW);
    scrollerRef.current.scrollLeft = scrollX;
  }, [data]);

  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", gap: 10, color: "#6B7A90", fontSize: 14 }}>
        <span style={{ width: 18, height: 18, border: "2px solid #D8E0EC", borderTopColor: "#2D7FF9", borderRadius: "50%", animation: "sp .7s linear infinite", display: "inline-block" }} />
        Loading from API…
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const vs = data.view_start;
  const ve = data.view_end;
  const td = data.today;

  const days: string[] = [];
  for (let i = 0; i <= dif(vs, ve); i++) days.push(addD(vs, i));
  const TW = days.length * DW;
  const todayIdx = dif(vs, td);
  const todayX = todayIdx * DW;

  // Stats
  const uniqueNames = new Set(tasks.map((t) => t.name)).size;
  const uniqueWorkers = new Set(tasks.map((t) => t.worker)).size;
  const countIp = tasks.filter((t) => t.status === "In progress").length;
  const countRd = tasks.filter((t) => t.status === "Ready for Acceptance").length;
  const countQa = tasks.filter((t) => t.status === "QA").length;
  const countPi = tasks.filter((t) => t.status === "Pending more info").length;

  // Groups
  type Group = { key: string; label: string; color: string; tx: string; tlbg: string; tasks: Task[] };
  let groups: Group[] = [];
  if (groupBy === "worker") {
    const m: Record<string, Task[]> = {};
    for (const t of tasks) { if (!m[t.worker]) m[t.worker] = []; m[t.worker].push(t); }
    groups = Object.keys(m).sort().map((k) => ({
      key: k, label: k, color: "#D0DCE8", tx: "#1F2D3D", tlbg: "#C8D8E8",
      tasks: m[k].sort((a, b) => ((SO.indexOf(a.status) + 1) || 99) - ((SO.indexOf(b.status) + 1) || 99) || a.bar_end.localeCompare(b.bar_end)),
    }));
  } else {
    const seen = new Set<string>(); const sm: Record<string, Task[]> = {};
    for (const t of tasks) {
      const k = t.name + "|" + t.status;
      if (seen.has(k)) continue;
      seen.add(k);
      if (!sm[t.status]) sm[t.status] = [];
      sm[t.status].push(t);
    }
    groups = SO.filter((s) => sm[s]?.length).map((s) => ({
      key: s, label: s, color: SC[s]?.bg || "#ccc", tx: SC[s]?.tx || "#fff", tlbg: SC[s]?.bg || "#ccc",
      tasks: (sm[s] || []).sort((a, b) => a.bar_end.localeCompare(b.bar_end)),
    }));
  }

  // Month header
  const mmap: Record<string, { l: string; n: number }> = {};
  for (const d of days) {
    const mk = d.slice(0, 7);
    if (!mmap[mk]) mmap[mk] = { l: fmtM(d), n: 0 };
    mmap[mk].n++;
  }

  // Weekend overlay
  const weOverlays = days
    .map((d, i) => [0, 6].includes(new Date(d).getDay()) ? (
      <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: i * DW, width: DW, background: "rgba(0,0,0,.03)" }} />
    ) : null)
    .filter(Boolean);

  const CARD_MAP: Record<string, { color: string }> = {
    "In progress":          { color: "#2D7FF9" },
    "Ready for Acceptance": { color: "#20C933" },
    "QA":                   { color: "#8B46FF" },
    "Pending more info":    { color: "#FF6F2C" },
  };

  const cardActive = (st: string) => cardFilter === st;

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#EEF2F7", color: "#1F2D3D", fontSize: 13, overflow: "hidden", height: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        *{box-sizing:border-box}
        @keyframes sp{to{transform:rotate(360deg)}}
        .task-link{font-size:12px;color:#2D7FF9;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;width:100%}
        .task-link:hover{text-decoration:underline}
        .g-task:hover{background:#F0F6FF!important}
        .card:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.1)!important}
        .btn:hover{opacity:.8}
        .pill:hover{opacity:.85}
        .spill:hover{opacity:.85}
        .bar:hover{opacity:1!important}
        .g-group:hover .g-left-inner{filter:brightness(1.05)}
      `}</style>

      {/* NAV */}
      <nav style={{ height: 52, background: "#1F2D3D", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,.25)" }}>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-.3px", flex: 1 }}>
          ARCHI <span style={{ color: "#2D7FF9" }}>Gantt</span>
        </div>
        <span style={{ color: "rgba(255,255,255,.45)", fontSize: 12 }}>{navStatus}</span>
        <button
          className="btn"
          disabled={refreshing}
          onClick={doRefresh}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,.2)", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, transition: "opacity .15s", background: "rgba(255,255,255,.1)", color: "#fff" }}
        >
          {refreshing ? "⏳ Fetching…" : "↻ Refresh API"}
        </button>
      </nav>

      {/* CARDS */}
      <div style={{ display: "flex", gap: 12, padding: "14px 20px 0", flexShrink: 0 }}>
        {[
          { id: "all", label: "Tasks", val: uniqueNames, color: null, dot: null },
          { id: "workers", label: "Workers", val: uniqueWorkers, color: null, dot: null },
          { id: "In progress", label: "In Progress", val: countIp, color: "#2D7FF9", dot: "#2D7FF9" },
          { id: "Ready for Acceptance", label: "Ready", val: countRd, color: "#20C933", dot: "#20C933" },
          { id: "QA", label: "QA", val: countQa, color: "#8B46FF", dot: "#8B46FF" },
          { id: "Pending more info", label: "Pending", val: countPi, color: "#FF6F2C", dot: "#FF6F2C" },
        ].map(({ id, label, val, color, dot }) => {
          const isActive = cardActive(id);
          const acc = color ? CARD_MAP[id]?.color : undefined;
          return (
            <div
              key={id}
              className="card"
              onClick={() => handleCardClick(id)}
              style={{
                background: isActive && acc ? acc : "#fff",
                borderRadius: 10,
                padding: "12px 18px",
                flex: 1,
                border: `2px solid ${isActive && acc ? acc : "#D8E0EC"}`,
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                transition: "all .18s",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: isActive ? "#fff" : (color || "#1F2D3D"), transition: "color .18s" }}>{val}</div>
              <div style={{ color: isActive ? "rgba(255,255,255,.75)" : "#6B7A90", fontSize: 11, marginTop: 3, display: "flex", alignItems: "center", gap: 5, transition: "color .18s" }}>
                {dot && <span style={{ width: 9, height: 9, borderRadius: "50%", background: isActive ? "rgba(255,255,255,.7)" : dot, display: "inline-block" }} />}
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", margin: "12px 20px 0", borderRadius: 10, padding: "10px 16px", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", border: "1px solid #D8E0EC", flexShrink: 0 }}>
        {/* Group */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#6B7A90", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Group</span>
          {(["worker", "status"] as const).map((v) => (
            <span
              key={v}
              className="pill"
              onClick={() => setGroupByState(v)}
              style={{ padding: "4px 11px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, border: "1.5px solid", borderColor: groupBy === v ? "#1F2D3D" : "#D8E0EC", background: groupBy === v ? "#1F2D3D" : "#EEF2F7", color: groupBy === v ? "#fff" : "#6B7A90", transition: "all .15s", userSelect: "none" }}
            >
              {v === "worker" ? "By Worker" : "By Status"}
            </span>
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: "#D8E0EC", margin: "0 2px" }} />

        {/* PM */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#6B7A90", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>PM</span>
          {[["all", "All"], ["Dima Lytvynov", "Dima"], ["Tania Zykova", "Tania"]].map(([v, lbl]) => (
            <span
              key={v}
              className="pill"
              onClick={() => setFilterPMState(v)}
              style={{ padding: "4px 11px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, border: "1.5px solid", borderColor: filterPM === v ? "#1F2D3D" : "#D8E0EC", background: filterPM === v ? "#1F2D3D" : "#EEF2F7", color: filterPM === v ? "#fff" : "#6B7A90", transition: "all .15s", userSelect: "none" }}
            >
              {lbl}
            </span>
          ))}
        </div>
        <div style={{ width: 1, height: 22, background: "#D8E0EC", margin: "0 2px" }} />

        {/* Status toggles */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#6B7A90", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>Status</span>
          {SO.map((s) => {
            const col = SC[s]?.bg || "#ccc";
            const tx = SC[s]?.tx || "#fff";
            const off = hideSt.has(s);
            const lbl = s.replace(" for Acceptance", "").replace(" more info", "");
            return (
              <span
                key={s}
                className="spill"
                onClick={() => toggleSt(s)}
                style={{ padding: "4px 10px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontWeight: 600, border: "1.5px solid", borderColor: col, display: "flex", alignItems: "center", gap: 4, userSelect: "none", transition: "opacity .15s", opacity: off ? 0.35 : 1, background: off ? "transparent" : col, color: off ? col : tx }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: off ? col : "rgba(255,255,255,.6)", flexShrink: 0 }} />
                {lbl}
              </span>
            );
          })}
        </div>
        <div style={{ width: 1, height: 22, background: "#D8E0EC", margin: "0 2px" }} />

        {/* Search */}
        <input
          placeholder="🔍 Search worker / task…"
          value={search}
          onChange={(e) => setSearchState(e.target.value.toLowerCase())}
          style={{ padding: "5px 11px", borderRadius: 6, border: "1.5px solid #D8E0EC", background: "#EEF2F7", fontSize: 13, color: "#1F2D3D", outline: "none", width: 170 }}
        />
      </div>

      {/* GANTT */}
      <div style={{ flex: 1, overflow: "hidden", margin: "12px 20px 16px", borderRadius: 10, border: "1px solid #D8E0EC", boxShadow: "0 1px 4px rgba(0,0,0,.06)", background: "#fff", display: "flex", flexDirection: "column" }}>
        {tasks.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#6B7A90", fontSize: 14 }}>
            No tasks match current filters
          </div>
        ) : (
          <div ref={scrollerRef} style={{ flex: 1, overflow: "auto", position: "relative" }}>
            {/* Header */}
            <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#1F2D3D", display: "flex", minWidth: `calc(580px + ${TW}px)` }}>
              {/* Left info header */}
              <div style={{ position: "sticky", left: 0, zIndex: 20, width: 580, flexShrink: 0, display: "flex", background: "#1F2D3D" }}>
                <div style={{ width: 260, flexShrink: 0, padding: "0 12px", borderRight: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)", textTransform: "uppercase", letterSpacing: ".3px", height: 42 }}>Task</div>
                <div style={{ width: 130, flexShrink: 0, padding: "0 12px", borderRight: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)", textTransform: "uppercase", letterSpacing: ".3px", height: 42 }}>Status</div>
                <div style={{ width: 110, flexShrink: 0, padding: "0 12px", borderRight: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)", textTransform: "uppercase", letterSpacing: ".3px", height: 42 }}>Client</div>
                <div style={{ width: 80, flexShrink: 0, padding: "0 12px", borderRight: "2px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.8)", textTransform: "uppercase", letterSpacing: ".3px", height: 42 }}>PM</div>
              </div>
              {/* Timeline header */}
              <div style={{ flex: 1, minWidth: 0, background: "#1F2D3D" }}>
                {/* Month row */}
                <div style={{ display: "flex" }}>
                  {Object.entries(mmap).map(([mk, m]) => (
                    <div key={mk} style={{ width: m.n * DW, height: 21, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: ".4px", borderRight: "1px solid rgba(255,255,255,.15)", whiteSpace: "nowrap", overflow: "hidden" }}>
                      {m.l}
                    </div>
                  ))}
                </div>
                {/* Day row */}
                <div style={{ display: "flex" }}>
                  {days.map((d, i) => {
                    const isT = d === td;
                    const isW = [0, 6].includes(new Date(d).getDay());
                    return (
                      <div key={i} style={{ width: DW, height: 21, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: isT ? "#fff" : "rgba(255,255,255,.65)", borderRight: "1px solid rgba(255,255,255,.08)", borderTop: "1px solid rgba(255,255,255,.1)", background: isT ? "#2D7FF9" : "transparent", fontWeight: isT ? 700 : undefined, opacity: (!isT && isW) ? 0.4 : 1 }}>
                        {new Date(d).getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rows */}
            {(() => {
              let alt = false;
              return groups.map((g) => {
                const isc = collapsed.has(g.key);
                return (
                  <div key={g.key}>
                    {/* Group header */}
                    <div
                      className="g-group"
                      onClick={() => toggleGroup(g.key)}
                      style={{ display: "flex", cursor: "pointer", userSelect: "none", borderTop: "2px solid #2C3E50", minWidth: `calc(580px + ${TW}px)` }}
                    >
                      <div className="g-left-inner" style={{ position: "sticky", left: 0, zIndex: 20, width: 580, flexShrink: 0, display: "flex", background: g.color, borderTop: "2px solid #2C3E50", borderRight: "2px solid #2C3E50" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", fontWeight: 700, fontSize: 13, width: "100%", whiteSpace: "nowrap", overflow: "hidden", color: g.tx }}>
                          <span style={{ fontSize: 9, transition: "transform .2s", flexShrink: 0, transform: isc ? "rotate(-90deg)" : "rotate(0deg)" }}>▼</span>
                          {g.label}
                          <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.65 }}>{g.tasks.length} tasks</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: g.tlbg, opacity: 0.45, borderTop: "2px solid #2C3E50" }} />
                    </div>

                    {/* Task rows */}
                    {!isc && g.tasks.map((t) => {
                      const rowBg = alt ? "#FAFBFC" : "#fff";
                      alt = !alt;
                      const bs = dif(vs, t.bar_start);
                      const be = dif(vs, t.bar_end);
                      const bL = Math.max(0, bs) * DW;
                      const bW = Math.max(DW, (be - Math.max(0, bs) + 1) * DW);
                      const col = SC[t.status]?.bg || "#C2C2C2";
                      const pmShort = t.pm.split(";")[0].replace("Dima Lytvynov", "Dima").replace("Tania Zykova", "Tania").trim();
                      return (
                        <div
                          key={t.url + t.worker}
                          className="g-task"
                          style={{ display: "flex", height: 36, borderTop: "1px solid #D8E0EC", background: rowBg, minWidth: `calc(580px + ${TW}px)` }}
                        >
                          {/* Left info */}
                          <div style={{ position: "sticky", left: 0, zIndex: 10, width: 580, flexShrink: 0, display: "flex", background: rowBg }}>
                            <div style={{ width: 260, flexShrink: 0, padding: "0 12px", borderRight: "1px solid #D8E0EC", display: "flex", alignItems: "center", overflow: "hidden" }}>
                              <a className="task-link" href={t.url} target="_blank" rel="noreferrer" title={t.name}>{t.name}</a>
                            </div>
                            <div style={{ width: 130, flexShrink: 0, padding: "0 8px", borderRight: "1px solid #D8E0EC", display: "flex", alignItems: "center" }}>
                              <span style={{ padding: "3px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", background: col, color: SC[t.status]?.tx || "#fff" }}>{t.status}</span>
                            </div>
                            <div style={{ width: 110, flexShrink: 0, padding: "0 10px", borderRight: "1px solid #D8E0EC", display: "flex", alignItems: "center", fontSize: 12, color: "#6B7A90", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} title={t.client}>{t.client}</div>
                            <div style={{ width: 80, flexShrink: 0, padding: "0 10px", borderRight: "2px solid #2C3E50", display: "flex", alignItems: "center", fontSize: 12, color: "#6B7A90", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{pmShort}</div>
                          </div>
                          {/* Timeline cell */}
                          <div style={{ width: TW, flexShrink: 0, position: "relative", overflow: "hidden", background: `linear-gradient(to right,rgba(0,0,0,0.045) 0,rgba(0,0,0,0.045) ${todayX}px,transparent ${todayX}px),repeating-linear-gradient(to right,#DDE8F5 0,#DDE8F5 1px,transparent 1px,transparent ${DW}px)` }}>
                            {weOverlays}
                            <div className="bar" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", height: 18, borderRadius: 3, opacity: 0.88, transition: "opacity .15s", left: bL, width: bW, background: col }} title={`${t.name}\n${fmtS(t.bar_start)} → ${fmtS(t.bar_end)}`} />
                            <div style={{ position: "absolute", top: 0, bottom: 0, left: todayX, width: DW, background: "rgba(45,127,249,.12)", borderLeft: "2px solid rgba(45,127,249,.5)", borderRight: "2px solid rgba(45,127,249,.5)", pointerEvents: "none", zIndex: 5 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
