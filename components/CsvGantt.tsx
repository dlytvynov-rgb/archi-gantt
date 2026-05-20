"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type Lang = "ua" | "en";
const LangCtx = createContext<Lang>("ua");
const useT = () => TRANSLATIONS[useContext(LangCtx)];

const TRANSLATIONS = {
  ua: {
    loading: "Завантаження…",
    tasks: "задач",
    gantt: "Гант",
    cards: "Завдання",
    analytics: "Аналітика",
    matching: "Роздача",
    period: "Період",
    p1m: "1 місяць", p3m: "3 місяці", p6m: "6 місяців", pAll: "Весь час",
    compact: "Компактний", comfortable: "Комфортний",
    group: "Групування", byWorker: "За виконавцем", byProject: "За проектом",
    status: "Статус", search: "🔍 Завдання / виконавець…",
    now: "Зараз", history: "Історія",
    sortUrgent: "🔥 Горять", sortWorker: "Виконавець", sortDeadline: "Дедлайн",
    sortProgress: "Прогрес", sortReturns: "Повернення", sortStatus: "Статус",
    sortQaRet: "↩ QA повернення", sortRfa: "🔄 Клієнт цикли",
    sortDuration: "⏱ Найдовші", sortOverdue: "⚠ Прострочені",
    colTask: "Завдання", colWorker: "Виконавець", colProject: "Проект",
    colStatus: "Статус", colDeadline: "Дедлайн", colReturns: "Повернення",
    colProgress: "Прогрес", colDays: "Днів", colQaRet: "QA ↩", colRfa: "RFA",
    colClient: "Клієнт",
    workers: "Спеціалісти", clients: "Клієнти", sort: "Сорт:",
    wSortRating: "Рейтинг ↓", wSortReturns: "Повернення ↓", wSortOverdue: "Прострочення ↓",
    wSortTasks: "Задачі ↓", wSortSpeed: "Швидкість ↓",
    cSortTasks: "Задачі ↓", cSortReturns: "Повернення ↓", cSortName: "Ім'я",
    best: "кращий", worst: "гірший",
    taskType: "Тип завдання",
    specsByLoad: "спеціалістів — черга за навантаженням",
    free: "Вільний", activeCount: (n: number) => `${n} IP`,
    profilePeriod3m: "3 міс", profilePeriod6m: "6 міс", profilePeriodAll: "Весь час",
    periodHint: "Всі цифри нижче перераховуються під вибраний період",
    perfSection: "Показники за період", perfHint: "Основні факти про роботу спеціаліста",
    statTasks: "Завдань", statTasksDesc: "Завдань взято в роботу за період",
    statReturns: "QA повернень / завд", statReturnsDesc: "Середня кількість разів коли QA повернув завдання",
    statOverdue: "Прострочення", statOverdueDesc: "Завдань здано в QA після дедлайну",
    statSpeed: "Середня швидкість", statSpeedDesc: "Середній час від старту завдання до Done",
    ratingSection: "З чого складається рейтинг",
    ratingHint: "Бар показує позицію відносно колег. Довгий = краще за інших за цим критерієм.",
    ratingTotal: (rank: number, total: number) => `#${rank} з ${total} — підсумковий бал`,
    ratingScale: "0 = гірший в команді · 1 = кращий",
    ratingWorstBest: ["гірший за всіх", "кращий за всіх"] as [string, string],
    compACTQ: "ACTQ", compACTQHint: "Помилки в хештегах завдань (Q/A/T1). Менше помилок — вищий бал.",
    compOverdue: "Прострочення", compOverdueHint: "Частка завдань зданих в QA після дедлайну. Менше — вищий бал.",
    compReturns: "Повернення", compReturnsHint: "Середня кількість QA-повернень на завдання. Менше — вищий бал.",
    compSpeed: "Швидкість", compSpeedHint: "Середній час виконання завдання. Швидше за колег — вищий бал.",
    compExp: "Досвід", compExpHint: "Кількість завдань за період. Більше завдань — більше досвіду.",
    sparkSection: "Динаміка по місяцях", sparkHint: "Видно чи покращується спеціаліст з часом. Дані за останні 6 місяців.",
    sparkReturns: "↩ QA-повернення", sparkReturnsHint: "Скільки разів на місяць завдання повертали з QA",
    sparkOverdue: "⚠ Прострочення", sparkOverdueHint: "Скільки завдань здано після дедлайну кожного місяця",
    histSection: (n: number) => `Історія завдань (${n})`,
    histHint: "Клік на завдання → повний таймлайн зміни статусів.",
    sortNewest: "Нові ↓", sortOldest: "Старі ↓",
    colTaskClient: "Завдання / Клієнт", colStatusPath: "Шлях статусів", colErrors: "Помилки",
    noTasks: "Немає завдань за вибраний період",
    panelHint: "💡 Наведи курсор на будь-який елемент щоб побачити підказку · клік на завдання → таймлайн",
    active: "в роботі",
    legendSetting: "Setting", legendIP: "In progress", legendQA: "QA",
    legendRFA: "RFA (у клієнта)", legendDone: "Done", legendTagErr: "помилка хештегу",
    taskHistTitle: "Зміна статусів",
    workerLabel: "Виконавець", clientLabel: "Клієнт", pmLabel: "PM",
    deadlineLabel: "Дедлайн", qaRetLabel: "QA повернення", clientCycLabel: "Клієнт цикли", clientRetLabel: "Клієнт повернув",
    back: "← Назад",
    cmdPlaceholder: "Пошук людей, проектів, команд…", cmdClose: "ESC закрити",
    cmdWorkers: "Виконавці", cmdProjects: "Проекти",
    cmdHint: "Натисни Enter щоб перейти",
    colSearch: "Пошук клієнта…",
    rankOf: (rank: number, total: number) => `#${rank} з ${total}`,
    taskCount: (n: number) => `${n} задач`,
  },
  en: {
    loading: "Loading…",
    tasks: "tasks",
    gantt: "Gantt",
    cards: "Tasks",
    analytics: "Analytics",
    matching: "Matching",
    period: "Period",
    p1m: "1 month", p3m: "3 months", p6m: "6 months", pAll: "All time",
    compact: "Compact", comfortable: "Comfortable",
    group: "Group", byWorker: "By Worker", byProject: "By Project",
    status: "Status", search: "🔍 Task / worker…",
    now: "Now", history: "History",
    sortUrgent: "🔥 Urgent", sortWorker: "Worker", sortDeadline: "Deadline",
    sortProgress: "Progress", sortReturns: "Returns", sortStatus: "Status",
    sortQaRet: "↩ QA Returns", sortRfa: "🔄 Client Cycles",
    sortDuration: "⏱ Longest", sortOverdue: "⚠ Overdue",
    colTask: "Task", colWorker: "Worker", colProject: "Project",
    colStatus: "Status", colDeadline: "Deadline", colReturns: "Returns",
    colProgress: "Progress", colDays: "Days", colQaRet: "QA ↩", colRfa: "RFA",
    colClient: "Client",
    workers: "Specialists", clients: "Clients", sort: "Sort:",
    wSortRating: "Rating ↓", wSortReturns: "Returns ↓", wSortOverdue: "Overdue ↓",
    wSortTasks: "Tasks ↓", wSortSpeed: "Speed ↓",
    cSortTasks: "Tasks ↓", cSortReturns: "Returns ↓", cSortName: "Name",
    best: "best", worst: "worst",
    taskType: "Task type",
    specsByLoad: "specialists — queue by workload",
    free: "Free", activeCount: (n: number) => `${n} IP`,
    profilePeriod3m: "3 mo", profilePeriod6m: "6 mo", profilePeriodAll: "All time",
    periodHint: "All numbers below are recalculated for the selected period",
    perfSection: "Performance", perfHint: "Key facts about the specialist's work",
    statTasks: "Tasks", statTasksDesc: "Tasks taken in the period",
    statReturns: "QA returns / task", statReturnsDesc: "Average number of times QA returned a task",
    statOverdue: "Overdue", statOverdueDesc: "Tasks submitted to QA after deadline",
    statSpeed: "Avg speed", statSpeedDesc: "Average time from task start to Done",
    ratingSection: "Rating Breakdown",
    ratingHint: "The bar shows position relative to colleagues. Longer = better than others on this criterion.",
    ratingTotal: (rank: number, total: number) => `#${rank} of ${total} — overall score`,
    ratingScale: "0 = worst in team · 1 = best",
    ratingWorstBest: ["worst", "best"] as [string, string],
    compACTQ: "ACTQ", compACTQHint: "Hashtag errors in tasks (Q/A/T1). Fewer errors = higher score.",
    compOverdue: "Overdue", compOverdueHint: "Share of tasks submitted to QA after deadline. Fewer = higher score.",
    compReturns: "Returns", compReturnsHint: "Average QA returns per task. Fewer = higher score.",
    compSpeed: "Speed", compSpeedHint: "Average task completion time. Faster than peers = higher score.",
    compExp: "Experience", compExpHint: "Number of tasks in the period. More tasks = more experience.",
    sparkSection: "Monthly Trends", sparkHint: "Shows whether the specialist is improving over time. Last 6 months.",
    sparkReturns: "↩ QA Returns", sparkReturnsHint: "How many times per month tasks were returned from QA",
    sparkOverdue: "⚠ Overdue", sparkOverdueHint: "How many tasks were submitted after deadline each month",
    histSection: (n: number) => `Task History (${n})`,
    histHint: "Click a task → full status timeline.",
    sortNewest: "Newest ↓", sortOldest: "Oldest ↓",
    colTaskClient: "Task / Client", colStatusPath: "Status path", colErrors: "Errors",
    noTasks: "No tasks for the selected period",
    panelHint: "💡 Hover any element for a tooltip · click a task → status timeline",
    active: "active",
    legendSetting: "Setting", legendIP: "In progress", legendQA: "QA",
    legendRFA: "RFA (at client)", legendDone: "Done", legendTagErr: "hashtag error",
    taskHistTitle: "Status Timeline",
    workerLabel: "Worker", clientLabel: "Client", pmLabel: "PM",
    deadlineLabel: "Deadline", qaRetLabel: "QA Returns", clientCycLabel: "Client Cycles", clientRetLabel: "Client Returned",
    back: "← Back",
    cmdPlaceholder: "Search people, projects, teams…", cmdClose: "ESC to close",
    cmdWorkers: "Workers", cmdProjects: "Projects",
    cmdHint: "Press Enter to navigate",
    colSearch: "Search client…",
    rankOf: (rank: number, total: number) => `#${rank} of ${total}`,
    taskCount: (n: number) => `${n} tasks`,
  },
} as const;
// react-glow removed — using CSS hover instead

interface Segment { status: string; from: string; to: string; fromDt?: string; toDt?: string; plannedEndDt?: string; }

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
  client: string;        // из clients.json по task id
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
const SC_SEG: Record<string, { bg: string; gl: string; tx: string; border: string }> = {
  "In progress":          { bg: "#4A7BF7", gl: "#7BA3FF", tx: "#fff", border: "#3261D4" },
  "Quality control":      { bg: "#8B46FF", gl: "#AE7AFF", tx: "#fff", border: "#7032E0" },
  "Ready for acceptance": { bg: "#22C55E", gl: "#4ADE80", tx: "#fff", border: "#16A34A" },
  "Done":                 { bg: "#0D9488", gl: "#2DD4BF", tx: "#fff", border: "#0F766E" },
  "Setting task":         { bg: "#94A3B8", gl: "#B8C4D0", tx: "#fff", border: "#64748B" },
  "Paused":               { bg: "#F97316", gl: "#FDBA74", tx: "#fff", border: "#EA580C" },
  "Pending more info":    { bg: "#F97316", gl: "#FDBA74", tx: "#fff", border: "#EA580C" },
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

// Avatar helpers
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#4A7BF7,#6366F1)",
  "linear-gradient(135deg,#22C55E,#16A34A)",
  "linear-gradient(135deg,#F97316,#EA580C)",
  "linear-gradient(135deg,#8B46FF,#6366F1)",
  "linear-gradient(135deg,#0D9488,#0F766E)",
  "linear-gradient(135deg,#EC4899,#DB2777)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#06B6D4,#0891B2)",
];
const nameToGradient = (name: string) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF;
  return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length];
};
const getInitials = (name: string) => {
  const p = name.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
};
// Status priority for left stripe color
const STRIPE_PRIORITY = ["In progress","Quality control","Paused","Pending more info","Ready for acceptance","Done","Setting task"];
const dominantStatus = (counts: Record<string, number>) =>
  STRIPE_PRIORITY.find(s => (counts[s] || 0) > 0) ?? null;

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
  const iClient = idx("client");

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
    const fromFull = c[iFrom] || "", toFull = c[iTo] || "";
    const from = fromFull.slice(0, 10), to = toFull.slice(0, 10);
    if (!id || !from || !to) continue;

    if (!map.has(id)) {
      map.set(id, { id, name: c[iName]||"", project: c[iProj]||"", assignee: (c[iAss]||"").trim(),
        pm: (c[iPm]||"").replace(/^PM\s+/,"").trim(), planned_end: c[iPEnd]||"",
        start_date: from, segments: [], current_status: status, returns: 0, rfa_count: 0, client_returns: 0,
        client: iClient >= 0 ? (c[iClient]||"").trim() : "" });
    }
    const t = map.get(id)!;
    if (from < t.start_date) t.start_date = from;
    if (from >= (t.segments[t.segments.length-1]?.from || "")) {
      t.current_status = status;
      if (c[iPEnd]) t.planned_end = c[iPEnd];
    }
    const last = t.segments[t.segments.length-1];
    const pEnd = c[iPEnd] || "";
    if (last && last.status === status && last.fromDt === fromFull && last.toDt === toFull) { /* exact duplicate — skip */ }
    else if (last && last.status === status && last.to === from) { last.to = to; last.toDt = toFull; last.plannedEndDt = pEnd || last.plannedEndDt; }
    else t.segments.push({ status, from, to, fromDt: fromFull, toDt: toFull, plannedEndDt: pEnd });
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

type ActqEntry = { Q: number; A: number; T1: number };
type ActqMap = Map<string, ActqEntry>;
type ActqTaskMap = Map<string, ActqEntry>; // keyed by task_id

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

function parseActqByTask(raw: string): ActqTaskMap {
  const result: ActqTaskMap = new Map();
  const seen = new Set<string>();
  for (const line of raw.split("\n").slice(1)) {
    const m = line.match(/^(\d+),[^,]*,\d+,[^,]+,\d+,[^,]+,(\d+),(##(?:Q[123]|A[123]|T1)\S*)/i);
    if (!m) continue;
    const [, taskId, msgId, body] = m;
    const key = `${taskId}:${msgId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const tagM = body.match(/^##(Q[123]|A[123]|T1)/i);
    if (!tagM) continue;
    const tag = tagM[1].toUpperCase();
    const e = result.get(taskId) || { Q: 0, A: 0, T1: 0 };
    if (tag.startsWith("Q")) e.Q++;
    else if (tag.startsWith("A")) e.A++;
    else if (tag === "T1") e.T1++;
    result.set(taskId, e);
  }
  return result;
}

// ─── Cards View ───────────────────────────────────────────────────────────────
function CardsView({ tasks, search, hideStatus, onSelect, compact }: { tasks: TaskRow[]; search: string; hideStatus: Set<string>; onSelect: (t: TaskRow) => void; compact: boolean }) {
  const T = useT();
  const today = new Date().toISOString().slice(0, 10);
  const rH = compact ? 36 : 48;   // row min-height
  const hP = compact ? "6px 8px" : "10px 8px"; // header cell padding
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

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      {/* Mode toggle + sort bar */}
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
        {/* Тоггл */}
        <div style={{ display:"flex", background:"#E2E8F0", borderRadius:8, padding:3, gap:1, flexShrink:0 }}>
          {(["now","history"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding:"4px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: mode===m ? "#4A7BF7" : "transparent", color: mode===m ? "#fff" : "#6B7A90", transition:"all .15s" }}>
              {m === "now" ? T.now : T.history}
            </button>
          ))}
        </div>
        <div style={{ width:1, height:22, background:"rgba(148,163,184,0.15)" }} />
        {mode === "now"
          ? (["urgent","assignee","deadline","progress","returns","status"] as const).map(v => (
            <span key={v} onClick={() => setSortBy(v)} className="pill"
              style={{ padding:"3px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, border:"1.5px solid", userSelect:"none",
                borderColor: sortBy===v ? "#4A7BF7" : "#E2E8F0", background: sortBy===v ? "#4A7BF7" : "#F8FAFC", color: sortBy===v ? "#fff" : "#6B7A90" }}>
              {v === "urgent" ? T.sortUrgent : v === "assignee" ? T.sortWorker : v === "deadline" ? T.sortDeadline : v === "progress" ? T.sortProgress : v === "returns" ? T.sortReturns : T.sortStatus}
            </span>
          ))
          : (["returns","rfa","duration","overdue"] as const).map(v => (
            <span key={v} onClick={() => setSortHist(v)} className="pill"
              style={{ padding:"3px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, border:"1.5px solid", userSelect:"none",
                borderColor: sortHist===v ? "#C04040" : "rgba(148,163,184,0.15)", background: sortHist===v ? "#C04040" : "#EEF2F7", color: sortHist===v ? "#fff" : "#6B7A90" }}>
              {v === "returns" ? T.sortQaRet : v === "rfa" ? T.sortRfa : v === "duration" ? T.sortDuration : T.sortOverdue}
            </span>
          ))
        }
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:12 }}>
          {mode === "now" ? sorted.length : histSorted.length} {T.tasks}
        </span>
      </div>

      {/* HISTORY TABLE */}
      {mode === "history" && (
        <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)", border:"1px solid #E2E8F0", overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 80px 80px 80px", background:"#F8FAFC", padding:"0 16px", borderBottom:"1px solid #EEF2F8" }}>
            {[T.colTask, T.colWorker, T.colProject, T.colQaRet, T.colRfa, T.colDays].map(h => (
              <div key={h} style={{ padding:hP, fontSize:11, fontWeight:600, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
            ))}
          </div>
          {histSorted.map((t, i) => {
            const dur = taskDuration(t);
            const over = taskOverdueDays(t);
            const rowBg = t.returns >= 3 ? "#FFF5F5" : t.rfa_count >= 3 ? "#FFF8F0" : i % 2 === 0 ? "#fff" : "#FAFBFD";
            return (
              <div key={t.id} onClick={() => onSelect(t)} style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 80px 80px 80px", padding:"0 16px", borderTop: i===0?"none":"1px solid #F0F4F8", background:rowBg, minHeight:compact?32:44, alignItems:"center", cursor:"pointer", borderLeft: t.returns>=3?"3px solid #E05050":t.rfa_count>=3?"3px solid #F97316":"3px solid transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background="#F0F6FF")}
                onMouseLeave={e => (e.currentTarget.style.background=rowBg)}>
                <div style={{ padding:"6px 8px 6px 0", overflow:"hidden" }}>
                  <div style={{ fontSize:12, color:"#4A7BF7", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
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
      {mode === "now" && <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)", border:"1px solid #E2E8F0", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", background:"#F8FAFC", padding:"0 16px", borderBottom:"1px solid #EEF2F8" }}>
          {[T.colTask, T.colWorker, T.colStatus, T.colDeadline, T.colReturns, T.colProgress].map(h => (
            <div key={h} style={{ padding:hP, fontSize:11, fontWeight:600, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
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
            <div key={t.id} onClick={() => onSelect(t)} style={{ display:"grid", gridTemplateColumns:"1fr 140px 160px 90px 90px 180px", padding:"0 16px", borderTop: i === 0 ? "none" : "1px solid #F0F4F8", background: rowBg, minHeight:rH, alignItems:"center", cursor:"pointer", borderLeft: rowBorder }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F0F6FF")}
              onMouseLeave={e => (e.currentTarget.style.background = rowBg)}>
              {/* Task name */}
              <div style={{ padding:`${compact?5:8}px 8px ${compact?5:8}px 0`, overflow:"hidden" }}>
                <a href={`https://archivizer.com/tasks/${t.id}`} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize:12, color:"#4A7BF7", textDecoration:"none", display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight:500 }}
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
                    {daysLeft < 0 ? `+${Math.abs(daysLeft)}d` : daysLeft === 0 ? "today" : `${daysLeft}d left`}
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
                    <div style={{ height:"100%", width:`${pct}%`, background: isOverdue ? "#E53E3E" : "#4A7BF7", borderRadius:2, transition:"width .3s" }} />
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
  const T = useT();
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
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:420, background:"#fff", zIndex:201, display:"flex", flexDirection:"column", boxShadow:"-4px 0 32px rgba(0,0,0,.12)", overflowY:"auto", borderRadius:"16px 0 0 16px", border:"1px solid #E2E8F0", borderRight:"none" }}>
        {/* Header */}
        <div style={{ background:"#F8FAFC", padding:"16px 20px 14px", flexShrink:0, borderBottom:"1px solid #EEF2F8" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#1A2035", lineHeight:1.4 }}>{task.name}</div>
              <div style={{ fontSize:11, color:"#9AA5B4", marginTop:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{task.project}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(0,0,0,.06)", border:"none", color:"#6B7A90", width:28, height:28, borderRadius:8, cursor:"pointer", fontSize:15, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 16px", marginTop:14 }}>
            {([[T.workerLabel, task.assignee || "—"], [T.clientLabel, task.client || "—"], [T.pmLabel, task.pm || "—"], [T.deadlineLabel, task.planned_end ? fmtD(task.planned_end) : "—"], [T.qaRetLabel, task.returns > 0 ? `↩ ${task.returns}` : "—"], [T.clientCycLabel, task.rfa_count > 0 ? `${task.rfa_count} RFA` : "—"], [T.clientRetLabel, task.client_returns > 0 ? `↩ ${task.client_returns}` : "—"]] as [string,string][]).map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize:10, color:"#B0BAC8", textTransform:"uppercase", letterSpacing:".4px", marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:12, fontWeight:600, color: (l===T.qaRetLabel&&task.returns>0)||(l===T.clientRetLabel&&task.client_returns>0) ? "#DC2626" : "#1A2035" }}>{v}</div>
              </div>
            ))}
          </div>
          {(score > 0 || isOverduePanel) && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
              {task.returns > 0 && <span style={{ padding:"2px 8px", borderRadius:4, background:"#E53E3E", color:"#fff", fontSize:11, fontWeight:700 }}>⚠ {task.returns} QA {T.sortQaRet}</span>}
              {task.client_returns > 0 && <span style={{ padding:"2px 8px", borderRadius:4, background:"#FF6F2C", color:"#fff", fontSize:11, fontWeight:700 }}>↩ {T.clientRetLabel} {task.client_returns}×</span>}
              {isOverduePanel && <span style={{ padding:"2px 8px", borderRadius:4, background:"rgba(229,62,62,.7)", color:"#fff", fontSize:11, fontWeight:700 }}>🔴 +{Math.abs(dif(today, task.planned_end))}d</span>}
            </div>
          )}
        </div>

        {/* Link */}
        <div style={{ padding:"9px 20px", borderBottom:"1px solid #EEF2F7", background:"#F8FAFC", flexShrink:0 }}>
          <a href={`https://archivizer.com/tasks/${task.id}`} target="_blank" rel="noreferrer"
            style={{ fontSize:12, color:"#4A7BF7", fontWeight:500, textDecoration:"none" }}>
            🔗 Archivizer →
          </a>
        </div>

        {/* Timeline */}
        <div style={{ padding:"14px 20px", flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#6B7A90", textTransform:"uppercase", letterSpacing:".4px", marginBottom:14 }}>
            {T.taskHistTitle} · {totalDays}d
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
                    <span>↩ {T.sortQaRet}</span>
                  </div>
                )}
                {isClientReturn && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 24px", color:"#FF6F2C", fontSize:11, fontWeight:700 }}>
                    <span>↩ {T.clientRetLabel}</span>
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
                        {days}d {isSlowest ? "⏱" : ""}
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
          <div style={{ fontSize:10, color:"#9AA5B4", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:".3px" }}>Timeline</div>
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
  returnsByMonth: number[];  // last 6 months, oldest→newest
  overdueByMonth: number[];  // late IP→QA transitions by month
  lastActiveDate: string | null;  // fromDt of most recent RFA or Done segment
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
      for (let i = 1; i < t.segments.length; i++) {
        if (t.segments[i-1].status === "In progress" && t.segments[i].status === "Quality control") {
          const ipSeg = t.segments[i-1];
          const pEnd = ipSeg.plannedEndDt || t.planned_end;
          if (pEnd && ipSeg.toDt) {
            const deadline = pEnd.slice(0, 10) + " 18:00:00";
            if (ipSeg.toDt > deadline) overdue++;
          }
        }
      }
      if (!clientMap.has(t.project)) clientMap.set(t.project, { tasks: 0, returns: 0, totalDays: 0 });
      const c = clientMap.get(t.project)!;
      c.tasks++; c.returns += t.returns; c.totalDays += dur;
    }
    // Last time specialist submitted work (most recent RFA or Done segment start)
    let lastActiveDate: string | null = null;
    for (const t of wt) {
      for (const seg of t.segments) {
        if ((seg.status === "Ready for acceptance" || seg.status === "Done") && seg.fromDt) {
          if (!lastActiveDate || seg.fromDt > lastActiveDate) lastActiveDate = seg.fromDt;
        }
      }
    }

    // Returns by month (last 6) — QA→IP transition date = return event
    const returnEvents: string[] = [];
    for (const t of wt) {
      for (let i = 1; i < t.segments.length; i++) {
        if (t.segments[i-1].status === "Quality control" && t.segments[i].status === "In progress") {
          if (t.segments[i].from) returnEvents.push(t.segments[i].from);
        }
      }
    }
    // Overdue events by month — IP→QA transitions after 18:00 on planned_end date
    const overdueEvents: string[] = [];
    for (const t of wt) {
      for (let i = 1; i < t.segments.length; i++) {
        if (t.segments[i-1].status === "In progress" && t.segments[i].status === "Quality control") {
          const ipSeg = t.segments[i-1];
          const pEnd = ipSeg.plannedEndDt || t.planned_end;
          if (pEnd && ipSeg.toDt) {
            const deadline = pEnd.slice(0, 10) + " 18:00:00";
            if (ipSeg.toDt > deadline) overdueEvents.push(ipSeg.toDt.slice(0, 7));
          }
        }
      }
    }

    const todayD = new Date(today);
    const returnsByMonth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(todayD);
      d.setMonth(d.getMonth() - (5 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return returnEvents.filter(e => e.startsWith(key)).length;
    });
    const overdueByMonth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(todayD);
      d.setMonth(d.getMonth() - (5 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return overdueEvents.filter(e => e === key).length;
    });

    const n = wt.length;
    return {
      assignee, totalTasks: n, statusCounts, totalReturns,
      avgReturns: Math.round(totalReturns / n * 10) / 10,
      avgDuration: Math.round(totalDuration / n),
      avgInProgress: Math.round(totalIP / n),
      avgQA: Math.round(totalQA / n),
      overdue, returnsByMonth, overdueByMonth, lastActiveDate,
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

function WorkerCard({ stat, rank, totalWorkers, qualifications, actq, onDrillDown, score, compact = false }: { stat: WorkerStat; rank: number; totalWorkers: number; qualifications: string[]; actq?: { Q: number; A: number; T1: number }; onDrillDown?: () => void; score?: number; compact?: boolean }) {
  const T = useT();
  const lang = useContext(LangCtx);
  const rc = rankColor(rank, totalWorkers);
  const rankNum = rank + 1;
  const rankTextColor = rankNum <= 4 ? "#fff" : rankNum <= 6 ? "#3d2e00" : "#fff";
  const ringColor = score == null ? rc : score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444";
  const circ = 88; // 2π×14
  const filled = score != null ? Math.round((score / 100) * circ) : 0;
  return (
    <div className="glow-card" style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)", border:"1px solid #E2E8F0", overflow:"hidden", height:"100%", display:"flex" }}>
      {/* Status stripe */}
      <div style={{ width:4, flexShrink:0, background: SC[dominantStatus(stat.statusCounts) ?? ""]?.bg ?? rc }} />
      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>
      <div style={{ background:"#F8FAFC", padding: compact ? "7px 9px" : "12px 14px 10px", borderBottom:"1px solid #EEF2F8" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
          {/* Avatar */}
          <div style={{ width: compact?24:34, height: compact?24:34, borderRadius:compact?6:9, background:nameToGradient(stat.assignee), display:"flex", alignItems:"center", justifyContent:"center", fontSize:compact?8:11, fontWeight:900, color:"#fff", flexShrink:0, letterSpacing:.3 }}>
            {getInitials(stat.assignee)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6 }}>
              <div onClick={onDrillDown} style={{ fontSize:compact?9:13, fontWeight:800, color:"#1A2035", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", ...(onDrillDown ? { cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 } : {}) }}>{stat.assignee}</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:5, background:rc, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:rankTextColor }}>#{rankNum}</div>
                {score != null ? (
                  <svg width="34" height="34" viewBox="0 0 36 36" style={{ flexShrink:0 }}>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2.5"/>
                    <circle cx="18" cy="18" r="14" fill="none" stroke={ringColor} strokeWidth="2.5"
                      strokeDasharray={`${filled} ${circ}`} strokeDashoffset={-22} strokeLinecap="round"/>
                    <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1A2035">{score}</text>
                  </svg>
                ) : (
                  <div style={{ fontSize:11, color:"#6B7A90", background:"rgba(0,0,0,.06)", padding:"2px 8px", borderRadius:4 }}>{stat.totalTasks} {T.tasks}</div>
                )}
              </div>
            </div>
            {dominantStatus(stat.statusCounts) && (
              <div style={{ fontSize:9, color: SC[dominantStatus(stat.statusCounts)!]?.bg, marginTop:3, fontWeight:700 }}>
                ● {STATUS_SHORT[dominantStatus(stat.statusCounts)!] ?? dominantStatus(stat.statusCounts)} · {stat.statusCounts[dominantStatus(stat.statusCounts)!]}
              </div>
            )}
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
            <span key={s} style={{ fontSize:10, color:"#6B7A90" }}>
              <span style={{ display:"inline-block", width:7, height:7, borderRadius:2, background:SC[s]?.bg, marginRight:3 }} />
              {STATUS_SHORT[s]||s} {stat.statusCounts[s]}
            </span>
          ))}
        </div>
      </div>
      {!compact && (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderBottom:"1px solid #EEF2F8", background:"#fff" }}>
        {([
          [T.sortReturns, `↩ ${stat.totalReturns}`, stat.totalReturns > 0 ? (stat.avgReturns >= 0.3 ? "#C04040" : "#C05A20") : "#94A3B8", `${stat.avgReturns}/task`],
          ["Avg days",  `${stat.avgDuration}d`,   "#4A7BF7", "total"],
          ["Avg IP",    `${stat.avgInProgress}d`,  "#4A7BF7", "In progress"],
          [T.sortOverdue,   `${stat.overdue}`,     stat.overdue > 0 ? "#C04040" : "#94A3B8", T.active],
        ] as [string,string,string,string][]).map(([label, val, color, sub]) => (
          <div key={label} style={{ padding:"9px 7px", textAlign:"center", borderRight:"1px solid #EEF2F8" }}>
            <div style={{ fontSize:9, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".4px", marginBottom:3, fontWeight:600 }}>{label}</div>
            <div style={{ fontSize:15, fontWeight:700, color }}>{val}</div>
            <div style={{ fontSize:9, color:"#B0BAC8", marginTop:1 }}>{sub}</div>
          </div>
        ))}
      </div>
      )}
      {/* Sparklines — возвраты + просрочка в одной строке */}
      {!compact && (() => {
        const now = new Date();
        const monthLabels = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now); d.setMonth(d.getMonth() - (5 - i));
          return d.toLocaleDateString(lang === "en" ? "en-US" : "uk-UA", { month: "short", year: "2-digit" });
        });
        const mkSpark = (data: number[], colorOk: string, colorBad: string) => {
          const max = Math.max(...data, 1);
          const W = 72, H = 24, PAD = 2;
          const pts = data.map((v, i) => ({
            x: (i / (data.length - 1)) * (W - PAD*2) + PAD,
            y: H - PAD - (v / max) * (H - PAD*2 - 2),
          }));
          const pathD = pts.reduce((d, p, i) => {
            if (i === 0) return `M${p.x},${p.y}`;
            const prev = pts[i-1]; const cx = (prev.x + p.x) / 2;
            return d + ` C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
          }, "");
          const areaD = pathD + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
          const early = data.slice(0,3).reduce((s,v)=>s+v,0);
          const late  = data.slice(3).reduce((s,v)=>s+v,0);
          const lc = late < early ? colorOk : late > early ? colorBad : "#4A7BF7";
          const trendLabel = late < early ? "↓" : late > early ? "↑" : "→";
          const trendColor = late < early ? colorOk : late > early ? colorBad : "#64748B";
          return { pathD, areaD, pts, lc, trendLabel, trendColor, W, H, data };
        };
        const ret = mkSpark(stat.returnsByMonth, "#22C55E", "#F87171");
        const ovd = mkSpark(stat.overdueByMonth,  "#22C55E", "#FB923C");
        const renderSvg = (s: ReturnType<typeof mkSpark>, gId: string, unit: string) => (
          <svg viewBox={`0 0 ${s.W} ${s.H}`} width={s.W} height={s.H} style={{ flexShrink:0 }}>
            <defs>
              <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.lc} stopOpacity="0.25"/>
                <stop offset="100%" stopColor={s.lc} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={s.areaD} fill={`url(#${gId})`}/>
            <path d={s.pathD} fill="none" stroke={s.lc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            {s.pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={s.data[i] > 0 ? 2.5 : 1.5}
                fill={s.data[i] > 0 ? s.lc : "#F8FAFC"} stroke={s.lc} strokeWidth="1"/>
            ))}
            {s.pts.map((p, i) => {
              const colW = s.W / s.pts.length;
              return (
                <rect key={`hr-${i}`} x={Math.max(0, p.x - colW/2)} y={0} width={colW} height={s.H} fill="transparent" style={{ cursor:"default" }}>
                  <title>{monthLabels[i]}: {s.data[i]} {unit}</title>
                </rect>
              );
            })}
          </svg>
        );
        return (
          <div style={{ padding:"6px 12px 7px", display:"flex", alignItems:"center", gap:6, borderTop:"1px solid #EEF2F8", background:"#F8FAFC" }}>
            <span style={{ fontSize:9, color:"#B0BAC8", whiteSpace:"nowrap" }}>↩</span>
            {renderSvg(ret, `sg-${stat.assignee.replace(/\W/g,"")}`, T.sortReturns)}
            <span style={{ fontSize:10, fontWeight:700, color:ret.trendColor }}>{ret.trendLabel}</span>
            <div style={{ width:1, height:18, background:"#E2E8F0", flexShrink:0, margin:"0 2px" }}/>
            <span style={{ fontSize:9, color:"#B0BAC8", whiteSpace:"nowrap" }}>⚠</span>
            {renderSvg(ovd, `od-${stat.assignee.replace(/\W/g,"")}`, T.sortOverdue)}
            <span style={{ fontSize:10, fontWeight:700, color:ovd.trendColor }}>{ovd.trendLabel}</span>
          </div>
        );
      })()}
      <div style={{ marginTop:"auto" }}>
      {actq && (actq.Q > 0 || actq.A > 0 || actq.T1 > 0) && (
        <div style={{ padding:"6px 16px 8px", borderTop:"1px solid #EEF2F8", display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ fontSize:10, fontWeight:600, color:"#9AA5B4", textTransform:"uppercase", marginRight:2 }}>ACTQ</span>
          {actq.Q > 0  && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {actq.Q}</span>}
          {actq.A > 0  && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {actq.A}</span>}
          {actq.T1 > 0 && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {actq.T1}</span>}
        </div>
      )}
      {qualifications.length > 0 && (
        <div style={{ padding:compact?"2px 9px 6px":"8px 16px 12px", borderTop:"1px solid #EEF2F8", display:"flex", flexWrap:"wrap", gap:4 }}>
          {qualifications.map(q => {
            const bs = qualBadgeStyle(q);
            return <span key={q} style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:500, border:"1.5px solid", ...bs }}>{q}</span>;
          })}
        </div>
      )}
      </div>{/* marginTop auto */}
      </div>{/* flex:1 wrapper */}
    </div>
  );
}

function ClientAccordion({ stats }: { stats: ClientStat[] }) {
  const T = useT();
  const lang = useContext(LangCtx);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const toggle = (name: string) => setOpen(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });
  const filtered = search.trim()
    ? stats.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : stats;
  return (
    <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)", border:"1px solid #E2E8F0", overflow:"hidden" }}>
      <div style={{ padding:"10px 16px", background:"#F8FAFC", borderBottom:"1px solid #EEF2F8" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={T.colSearch}
          style={{ width:"100%", padding:"6px 12px", borderRadius:7, border:"1px solid #E2E8F0", background:"#F1F5F9", color:"#1A2035", fontSize:13, outline:"none", boxSizing:"border-box" }} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px", padding:"8px 16px", background:"#F8FAFC", borderBottom:"1px solid #EEF2F8" }}>
        {[T.colClient, T.tasks, T.sortReturns, T.workers].map(h => (
          <div key={h} style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
        ))}
      </div>
      {filtered.map((stat, i) => {
        const isOpen = open.has(stat.name);
        const best = stat.workers.length > 0
          ? stat.workers.reduce((b, w) => (w.returns/w.tasks < b.returns/b.tasks ? w : b))
          : null;
        return (
          <div key={stat.name} style={{ borderTop: i > 0 ? "1px solid #EEF2F8" : "none" }}>
            <div onClick={() => toggle(stat.name)} style={{ display:"grid", gridTemplateColumns:"1fr 80px 80px 80px", padding:"11px 16px", cursor:"pointer", alignItems:"center", background: isOpen ? "#EFF6FF" : "transparent", transition:"background .12s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:10, color:"#9AA5B4", transition:"transform .15s", display:"inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#1A2035" }}>{stat.name || (lang === "en" ? "(no client)" : "(без клієнта)")}</span>
              </div>
              <div style={{ fontSize:13, color:"#6B7A90" }}>{stat.totalTasks}</div>
              <div style={{ fontSize:13, fontWeight:700, color: stat.totalReturns === 0 ? "#22C55E" : stat.totalReturns >= 10 ? "#F87171" : "#FB923C" }}>
                {stat.totalReturns > 0 ? `↩ ${stat.totalReturns}` : "—"}
              </div>
              <div style={{ fontSize:13, color:"#6B7A90" }}>{stat.workers.length}</div>
            </div>
            {isOpen && (
              <div style={{ borderTop:"1px solid #EEF2F8", background:"#F8FAFC" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 70px 70px 24px", padding:"6px 16px 4px 40px", borderBottom:"1px solid #EEF2F8" }}>
                  {[T.colWorker, T.tasks, "↩", "Avg d", ""].map(h => (
                    <div key={h} style={{ fontSize:10, color:"#9AA5B4", fontWeight:700, textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
                  ))}
                </div>
                {stat.workers.map((w, wi) => {
                  const isBest = best?.assignee === w.assignee;
                  return (
                    <div key={wi} style={{ display:"grid", gridTemplateColumns:"1fr 60px 70px 70px 24px", padding:"7px 16px 7px 40px", borderTop: wi > 0 ? "1px solid #EEF2F8" : "none", alignItems:"center", background: isBest ? "rgba(34,197,94,.07)" : "transparent" }}>
                      <div style={{ fontSize:12, color: isBest ? "#16A34A" : "#4A5568", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{w.assignee}</div>
                      <div style={{ fontSize:12, color:"#64748B" }}>{w.tasks}</div>
                      <div style={{ fontSize:12, fontWeight:700, color: w.returns === 0 ? "#22C55E" : w.returns >= 5 ? "#F87171" : "#FB923C" }}>
                        {w.returns > 0 ? `↩ ${w.returns}` : "—"}
                      </div>
                      <div style={{ fontSize:12, color:"#64748B" }}>{w.avgDays}d</div>
                      <div style={{ fontSize:13 }}>{isBest ? "🏆" : ""}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsView({ tasks, qualifications, actqErrors, onWorkerClick, compact = false }: { tasks: TaskRow[]; qualifications: Qualifications; actqErrors: ActqMap; onWorkerClick?: (name: string) => void; compact?: boolean }) {
  const T = useT();
  const lang = useContext(LangCtx);
  const today = new Date().toISOString().slice(0, 10);
  const [sub, setSub]   = useState<"workers"|"clients">("workers");
  const [sortW, setSortW] = useState<"quality"|"name"|"tasks"|"returns"|"duration"|"overdue">("quality");
  const [sortC, setSortC] = useState<"name"|"tasks"|"returns">("tasks");
  const [drilldown, setDrilldown] = useState<string | null>(null);

  const workerStats = buildWorkerStats(tasks, today);
  const clientStats = buildClientStats(tasks, today);

  // composite rating: ACTQ 40%, returns 20%, overdue 30%, speed 5%, tasks 5%
  const _norm = (v: number, min: number, max: number) => max === min ? 0.5 : (v - min) / (max - min);
  const actqRate = (name: string, total: number) => { const e = actqErrors.get(name); return e ? (e.Q + e.A + e.T1) / Math.max(total, 1) : 0; };
  const _actqRates = workerStats.map(w => actqRate(w.assignee, w.totalTasks));
  const _minAQ = Math.min(..._actqRates), _maxAQ = Math.max(..._actqRates);
  const _minR = Math.min(...workerStats.map(w => w.avgReturns)), _maxR = Math.max(...workerStats.map(w => w.avgReturns));
  const _minO = Math.min(...workerStats.map(w => w.overdue)),    _maxO = Math.max(...workerStats.map(w => w.overdue));
  const _minD = Math.min(...workerStats.map(w => w.avgDuration)),_maxD = Math.max(...workerStats.map(w => w.avgDuration));
  const _minT = Math.min(...workerStats.map(w => w.totalTasks)), _maxT = Math.max(...workerStats.map(w => w.totalTasks));
  const ratingScore = (w: WorkerStat) =>
    (1 - _norm(actqRate(w.assignee, w.totalTasks), _minAQ, _maxAQ)) * 0.40 +
    (1 - _norm(w.avgReturns, _minR, _maxR)) * 0.20 +
    (1 - _norm(w.overdue,    _minO, _maxO)) * 0.30 +
    (1 - _norm(w.avgDuration,_minD, _maxD)) * 0.05 +
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

  const wSortLabels: Record<string, string> = { quality:`★ ${lang === "en" ? "Rating" : "Рейтинг"}`, tasks:T.wSortTasks, returns:T.wSortReturns, duration:lang === "en" ? "Avg days ↓" : "Сер.дні ↓", overdue:T.wSortOverdue, name:T.cSortName };
  const cSortLabels: Record<string, string> = { tasks:T.cSortTasks, returns:T.cSortReturns, name:T.cSortName };

  if (drilldown) {
    const workerTasks = tasks.filter(t => t.assignee === drilldown)
      .sort((a, b) => {
        const order = ["In progress","Quality control","Ready for acceptance","Paused","Setting task","Pending more info","Done"];
        return order.indexOf(a.current_status) - order.indexOf(b.current_status);
      });
    const stat = workerStats.find(w => w.assignee === drilldown);
    const rank = qualityRank.get(drilldown) ?? 0;
    const rc = rankColor(rank, workerStats.length);
    return (
      <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <button onClick={() => setDrilldown(null)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", borderRadius:8, border:"1.5px solid #E2E8F0", background:"#F8FAFC", cursor:"pointer", fontSize:12, fontWeight:600, color:"#4A5568" }}>
            {T.back}
          </button>
          <div style={{ width:22, height:22, borderRadius:6, background:rc, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>#{rank+1}</div>
          <span style={{ fontSize:16, fontWeight:700, color:"#1A2035" }}>{drilldown}</span>
          {stat && <span style={{ fontSize:12, color:"#9AA5B4" }}>{workerTasks.length} {T.tasks} · ↩ {stat.avgReturns}/task · {stat.overdue} overdue</span>}
        </div>
        <div style={{ background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.04)", border:"1px solid #E2E8F0", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #EEF2F8" }}>
                {[T.colTask, T.colProject, T.colStatus, "↩", T.colDays, T.colDeadline].map(h => (
                  <th key={h} style={{ padding:compact?"6px 10px":"9px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workerTasks.map((t, i) => {
                const pill = SC_PILL[t.current_status] || SC_PILL["Setting task"];
                const days = dif(t.start_date, today);
                const isOverdue = t.planned_end && t.planned_end < today && t.current_status !== "Done";
                return (
                  <tr key={t.id} style={{ borderBottom:"1px solid #EEF2F8", background: i % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                    <td style={{ padding:compact?"6px 10px":"9px 14px", maxWidth:260, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                      <span title={t.name} style={{ fontWeight:500, color:"#1A2035" }}>{t.name}</span>
                    </td>
                    <td style={{ padding:compact?"6px 10px":"9px 14px", color:"#64748B", maxWidth:160, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{t.project}</td>
                    <td style={{ padding:compact?"6px 10px":"9px 14px" }}>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:5, fontWeight:600, border:"1px solid", background:pill.bg, color:pill.tx, borderColor:pill.border, whiteSpace:"nowrap" }}>
                        {STATUS_SHORT[t.current_status] || t.current_status}
                      </span>
                    </td>
                    <td style={{ padding:compact?"6px 10px":"9px 14px", textAlign:"center", fontWeight:700, color: t.returns > 0 ? "#C04040" : "#B0BAC8", fontSize:13 }}>
                      {t.returns > 0 ? `↩ ${t.returns}` : "—"}
                    </td>
                    <td style={{ padding:compact?"6px 10px":"9px 14px", color:"#4A7BF7", fontWeight:600, textAlign:"center" }}>{days}d</td>
                    <td style={{ padding:compact?"6px 10px":"9px 14px", whiteSpace:"nowrap", fontWeight:600, color: isOverdue ? "#C04040" : "#6B7A90", fontSize:12 }}>
                      {t.planned_end ? (isOverdue ? `⚠ ${fmtD(t.planned_end)}` : fmtD(t.planned_end)) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, overflow:"auto", padding:"12px 20px 20px" }}>
      <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", background:"#F1F5F9", borderRadius:8, padding:3, gap:2, border:"1px solid #E2E8F0" }}>
          {(["workers","clients"] as const).map(v => (
            <button key={v} onClick={() => setSub(v)}
              style={{ padding:"4px 16px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                background: sub===v ? "#4A7BF7" : "transparent", color: sub===v ? "#fff" : "#6B7A90", transition:"all .15s" }}>
              {v === "workers" ? `👤 ${T.workers} (${workerStats.length})` : `🏢 ${T.clients} (${clientStats.length})`}
            </button>
          ))}
        </div>
        <span style={{ color:"#9AA5B4", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{T.sort}</span>
        {sub === "workers"
          ? (Object.keys(wSortLabels) as (keyof typeof wSortLabels)[]).map(v => (
              <span key={v} className="pill" onClick={() => setSortW(v as typeof sortW)}
                style={{ padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortW===v ? "#4A7BF7" : "#E2E8F0", background: sortW===v ? "#4A7BF7" : "#F8FAFC", color: sortW===v ? "#fff" : "#6B7A90" }}>
                {wSortLabels[v]}
              </span>
            ))
          : (Object.keys(cSortLabels) as (keyof typeof cSortLabels)[]).map(v => (
              <span key={v} className="pill" onClick={() => setSortC(v as typeof sortC)}
                style={{ padding:"3px 10px", borderRadius:6, fontSize:12, fontWeight:600, border:"1.5px solid",
                  borderColor: sortC===v ? "#4A7BF7" : "#E2E8F0", background: sortC===v ? "#4A7BF7" : "#F8FAFC", color: sortC===v ? "#fff" : "#6B7A90" }}>
                {cSortLabels[v]}
              </span>
            ))
        }
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{tasks.length} {T.tasks}</span>
      </div>
      {sub === "workers" && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, fontSize:11, color:"#7A8A9E" }}>
            <span style={{ width:10, height:10, borderRadius:3, background:"#16A34A", display:"inline-block" }} />
            {T.best}
            <span style={{ color:"rgba(148,163,184,0.15)" }}>→</span>
            <span style={{ width:10, height:10, borderRadius:3, background:"#EF4444", display:"inline-block" }} />
            {T.worst}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: compact ? 8 : 12 }}>
            {sortedW.map(w => (
              <WorkerCard key={w.assignee} stat={w} rank={qualityRank.get(w.assignee) ?? 0} totalWorkers={workerStats.length} qualifications={qualifications[w.assignee] || []} actq={actqErrors.get(w.assignee)} onDrillDown={() => onWorkerClick ? onWorkerClick(w.assignee) : setDrilldown(w.assignee)} score={Math.round(ratingScore(w) * 100)} compact={compact} />
            ))}
          </div>
        </>
      )}
      {sub === "clients" && (
        <ClientAccordion stats={sortedC} />
      )}
    </div>
  );
}

// ─── Matching ─────────────────────────────────────────────────────────────────
const TASK_TYPES = ["Interior", "Exterior", "Modeling", "Animation", "Photoshop", "Test"] as const;
type TaskType = typeof TASK_TYPES[number];
type Qualifications = Record<string, string[]>;

const MATCH_PRIORITIES: Record<TaskType, string[][]> = {
  "Interior":   [["SDC int+"], ["SDC int"], ["MLR int"]],
  "Exterior":   [["SDC ext+"], ["SDC ext"], ["MLR ext"]],
  "Modeling":   [["MDF+"], ["MDF"], ["FD"]],
  "Animation":  [["Animation+"], ["Animation"]],
  "Photoshop":  [["Ps+"], ["Ps"]],
  "Test":       [["SDC int+", "SDC ext+"], ["SDC int", "SDC ext"], ["Animation+"], ["Animation"]],
};

const PRIORITY_LABELS: Record<TaskType, string[]> = {
  "Interior":   ["SDC int+", "SDC int", "MLR int"],
  "Exterior":   ["SDC ext+", "SDC ext", "MLR ext"],
  "Modeling":   ["MDF+", "MDF", "FD"],
  "Animation":  ["Animation+", "Animation"],
  "Photoshop":  ["Ps+", "Ps"],
  "Test":       ["SDC+", "SDC", "Anim+", "Anim"],
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  "Interior":  "Interior",
  "Exterior":  "Exterior",
  "Modeling":  "Modeling",
  "Animation": "Animation",
  "Photoshop": "Photoshop",
  "Test":      "🧪 Test",
};

const PRIORITY_COLORS = ["#16A34A", "#4A7BF7", "#F97316", "#8B46FF"];

function MiniGantt({ tasks }: { tasks: TaskRow[] }) {
  const ACTIVE_ST = new Set(["In progress", "Quality control", "Setting task"]);
  const [mo, setMo] = useState(0);

  const now = new Date();
  const vd   = new Date(now.getFullYear(), now.getMonth() + mo, 1);
  const vEnd = new Date(vd.getFullYear(), vd.getMonth() + 1, 0, 23, 59, 59);
  const span = vEnd.getTime() - vd.getTime();
  const toX  = (s: string) => ((new Date(s).getTime() - vd.getTime()) / span) * 100;
  const todX  = ((now.getTime() - vd.getTime()) / span) * 100;

  const active = tasks.filter(t => ACTIVE_ST.has(t.current_status) && t.start_date && t.planned_end);
  const wmap = new Map<string, TaskRow[]>();
  for (const t of active) { if (!wmap.has(t.assignee)) wmap.set(t.assignee, []); wmap.get(t.assignee)!.push(t); }

  const rows = Array.from(wmap.entries())
    .sort(([, a], [, b]) => Math.min(...a.map(t => new Date(t.planned_end).getTime())) - Math.min(...b.map(t => new Date(t.planned_end).getTime())));

  if (!rows.length) return null;

  const label = vd.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div style={{ marginTop:20, background:"#fff", borderRadius:10, padding:"12px 16px 14px", border:"1px solid #E2E8F0", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".5px" }}>
          Gantt · {label}
        </span>
        <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
          {mo !== 0 && (
            <button onClick={() => setMo(0)} style={{ padding:"2px 8px", borderRadius:5, border:"1px solid #4A7BF7", background:"transparent", color:"#4A7BF7", cursor:"pointer", fontSize:11 }}>today</button>
          )}
          <button onClick={() => setMo(o => o-1)} style={{ padding:"2px 9px", borderRadius:5, border:"1px solid #E2E8F0", background:"#F8FAFC", color:"#6B7A90", cursor:"pointer", fontSize:13 }}>←</button>
          <button onClick={() => setMo(o => o+1)} style={{ padding:"2px 9px", borderRadius:5, border:"1px solid #E2E8F0", background:"#F8FAFC", color:"#6B7A90", cursor:"pointer", fontSize:13 }}>→</button>
        </div>
      </div>
      <div style={{ position:"relative" }}>
        {todX >= 0 && todX <= 100 && (
          <div style={{ position:"absolute", left:`${todX}%`, top:-14, bottom:0, width:1.5, background:"rgba(239,68,68,.7)", zIndex:5, pointerEvents:"none" }}>
            <span style={{ position:"absolute", top:0, left:-10, fontSize:9, color:"#EF4444", fontWeight:700 }}>now</span>
          </div>
        )}
        {rows.map(([name, wt], ri) => (
          <div key={name} style={{ display:"flex", alignItems:"center", marginBottom: ri === rows.length-1 ? 0 : 4 }}>
            <div style={{ width:82, fontSize:10, color:"#9AA5B4", flexShrink:0, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", paddingRight:8 }}>
              {name.split(" ")[0]}
            </div>
            <div style={{ flex:1, position:"relative", height:18 }}>
              {wt.map(t => {
                const x0 = toX(t.start_date), x1 = toX(t.planned_end);
                if (x1 < 0 || x0 > 100) return null;
                const cx0 = Math.max(0, x0), cw = Math.min(100, x1) - cx0;
                if (cw <= 0) return null;
                const sc = SC_SEG[t.current_status];
                return (
                  <div key={t.id} title={`${t.name}\n${t.current_status}\nдо ${t.planned_end}`}
                    style={{ position:"absolute", left:`${cx0}%`, width:`${cw}%`, top:1, height:16, borderRadius:3, background:sc?.bg||"#94A3B8", border:`1px solid ${sc?.border||"#64748B"}`, overflow:"hidden", boxSizing:"border-box" }}>
                    <span style={{ fontSize:9, color:"rgba(255,255,255,.9)", padding:"0 4px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", display:"block", lineHeight:"14px" }}>
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchingView({ tasks, qualifications, actqErrors, onWorkerClick, compact = false }: { tasks: TaskRow[]; qualifications: Qualifications; actqErrors: ActqMap; onWorkerClick: (name: string) => void; compact?: boolean }) {
  const T = useT();
  const lang = useContext(LangCtx);
  const [taskType, setTaskType] = useState<TaskType | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const ACTIVE = new Set(["In progress"]);

  const activeCountMap = new Map<string, number>();
  for (const t of tasks) {
    if (ACTIVE.has(t.current_status)) {
      activeCountMap.set(t.assignee, (activeCountMap.get(t.assignee) || 0) + 1);
    }
  }

  // closest deadline among IP tasks per worker
  const deadlineMap = new Map<string, string>();
  for (const t of tasks) {
    if (t.current_status === "In progress" && t.planned_end) {
      const cur = deadlineMap.get(t.assignee);
      if (!cur || t.planned_end < cur) deadlineMap.set(t.assignee, t.planned_end);
    }
  }
  const fmtDeadline = (planned_end: string): { text: string; color: string } => {
    const diffMs = new Date(planned_end).getTime() - Date.now();
    const diffH  = Math.round(diffMs / 3600000);
    const diffD  = Math.round(diffMs / 86400000);
    if (diffMs < 0)   return { text: lang === "ua" ? `-${Math.abs(diffD)}д` : `-${Math.abs(diffD)}d`, color: "#E53E3E" };
    if (diffH < 24)   return { text: lang === "ua" ? `${diffH}г`            : `${diffH}h`,             color: "#F97316" };
    if (diffD <= 2)   return { text: lang === "ua" ? `${diffD}д`            : `${diffD}d`,             color: "#F97316" };
    return              { text: lang === "ua" ? `${diffD}д`                 : `${diffD}d`,             color: "#fff"    };
  };

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
    return (1 - _norm(_actqRate(name, w.totalTasks), _minAQ, _maxAQ)) * 0.40 +
           (1 - _norm(w.avgReturns, _minR, _maxR)) * 0.20 +
           (1 - _norm(w.overdue,    _minO, _maxO)) * 0.30 +
           (1 - _norm(w.avgDuration,_minD, _maxD)) * 0.05 +
           _norm(w.totalTasks,      _minT, _maxT)  * 0.05;
  };

  const idleDays = (name: string) => {
    const d = workerStatMap.get(name)?.lastActiveDate;
    if (!d) return null;
    return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  };
  const wLabel = (n: number, name: string) => {
    if (n > 0) return T.activeCount(n);
    const days = idleDays(name);
    return days != null ? `${T.free} · ${days}d` : T.free;
  };

  // gradient helpers (yellow → orange by load)
  const maxActive = Math.max(...Array.from(activeCountMap.values()), 1);
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const busyBg     = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(254,255,t)},${lerp(252,237,t)},${lerp(232,213,t)})`; };
  const busyText   = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(161,234,t)},${lerp(98,88,t)},${lerp(7,12,t)})`; };
  const busyBorder = (n: number) => { const t = Math.min((n - 1) / Math.max(maxActive - 1, 1), 1); return `rgb(${lerp(234,249,t)},${lerp(179,115,t)},${lerp(8,22,t)})`; };
  const cardBg     = (_n: number) => "#fff";
  const cardBorder = (n: number) => n === 0 ? "#16A34A" : "#E2E8F0";
  const cardText   = (n: number) => n === 0 ? "#16A34A" : "#94A3B8";
  const cardOpacity = (n: number) => n === 0 ? 1 : 0.5;

  // average activeTasks for specialists matching each task type
  const typeAvgLoad = (tt: TaskType): number => {
    const allSkills = MATCH_PRIORITIES[tt].flat();
    const matching = Object.entries(qualifications).filter(([, q]) => allSkills.some(s => q.includes(s)));
    if (!matching.length) return 0;
    return matching.reduce((s, [name]) => s + (activeCountMap.get(name) || 0), 0) / matching.length;
  };
  // button color based on avg load: 0 = green, >0 gradient yellow→orange
  const typeBtnStyle = (tt: TaskType, active: boolean): React.CSSProperties => {
    if (active) return { background:"#4A7BF7", color:"#fff", borderColor:"#4A7BF7" };
    const avg = typeAvgLoad(tt);
    if (avg === 0) return { background:"#ECFBF1", color:"#16A34A", borderColor:"#16A34A66" };
    return { background:busyBg(avg), color:busyText(avg), borderColor:`${busyBorder(avg)}88` };
  };

  // — No task type selected: flat list of all specialists, free-first by rating
  if (taskType === null) {
    const allWorkers = Object.entries(qualifications)
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
          <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{T.taskType}</span>
          {TASK_TYPES.map(t => (
            <button key={t} onClick={() => setTaskType(t)}
              style={{ padding:"5px 14px", borderRadius:7, border:"1.5px solid", cursor:"pointer", fontSize:12, fontWeight:600,
                ...typeBtnStyle(t, false) }}>
              {TASK_TYPE_LABELS[t]}
            </button>
          ))}
          <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{allWorkers.length} {T.specsByLoad}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: compact ? 7 : 10 }}>
          {allWorkers.map((w) => (
            <div key={w.assignee} className="glow-card"
              style={{ background:cardBg(w.activeTasks), borderRadius:10, overflow:"hidden", border:`2px solid ${cardBorder(w.activeTasks)}`, opacity:cardOpacity(w.activeTasks) }}>
              <div style={{ padding:compact?"7px 10px 6px":"10px 14px 8px", borderBottom:`1px solid ${cardBorder(w.activeTasks)}22` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1A2035", cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 }}
                    onClick={() => onWorkerClick(w.assignee)}>{w.assignee}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"#fff",
                      background: w.activeTasks > 0 ? "#4A7BF7" : "#16A34A",
                      padding:"2px 7px", borderRadius:20, whiteSpace:"nowrap" }}>
                      {wLabel(w.activeTasks, w.assignee)}
                    </div>
                    {w.activeTasks > 0 && (() => { const dl = deadlineMap.get(w.assignee); if (!dl) return null; const { text, color } = fmtDeadline(dl); return (
                      <div style={{ fontSize:10, fontWeight:700, color:"#fff", background: color === "#fff" ? "#4A7BF7" : color, padding:"2px 6px", borderRadius:20, whiteSpace:"nowrap" }}>· {text}</div>
                    ); })()}
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
              {!compact && (
              <div style={{ padding:"6px 14px 8px", borderTop:"1px solid rgba(0,0,0,.07)", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, color:"#6B7A90" }}>↩ {workerStatMap.get(w.assignee)?.avgReturns ?? 0}/task</span>
                <div style={{ width:1, height:12, background:"rgba(0,0,0,.1)" }} />
                {(() => { const e = actqErrors.get(w.assignee); const hasErr = e && (e.Q > 0 || e.A > 0 || e.T1 > 0); return hasErr ? <>
                  {e!.Q  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {e!.Q}</span>}
                  {e!.A  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {e!.A}</span>}
                  {e!.T1 > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {e!.T1}</span>}
                </> : <span style={{ fontSize:10, color:"rgba(0,0,0,.2)" }}>ACTQ —</span>; })()}
              </div>
              )}
            </div>
          ))}
        </div>
        {/* <MiniGantt tasks={tasks} /> */}
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
        <span style={{ color:"#6B7A90", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{T.taskType}</span>
        {TASK_TYPES.map(t => (
          <button key={t} onClick={() => setTaskType(t === taskType ? null : t)}
            style={{ padding:"5px 14px", borderRadius:7, border:"1.5px solid", cursor:"pointer", fontSize:12, fontWeight:600,
              ...typeBtnStyle(t, t === taskType) }}>
            {TASK_TYPE_LABELS[t]}
          </button>
        ))}
        <span style={{ marginLeft:"auto", color:"#6B7A90", fontSize:11 }}>{results.length} {T.workers}</span>
      </div>

      {results.length === 0
        ? <div style={{ textAlign:"center", padding:40, color:"#9AA5B4", fontSize:14 }}>
            {lang === "en" ? "No specialists" : "Немає спеціалістів"}
          </div>
        : Object.entries(byPriority).map(([p, workers]) => (
          <div key={p} style={{ marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ padding:"3px 12px", borderRadius:6, background:pColor(+p), color:"#fff", fontSize:11, fontWeight:700, letterSpacing:".3px" }}>
                {PRIORITY_LABELS[taskType][+p - 1]}
              </div>
              <div style={{ flex:1, height:1, background:"#E2E8F0" }} />
              <span style={{ fontSize:11, color:"#9AA5B4" }}>{workers.length}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
              {workers.map(w => {
                const free = w.activeTasks === 0;
                return (
                <div key={w.assignee} className="glow-card"
                  style={{ background: cardBg(w.activeTasks), borderRadius:10, overflow:"hidden", border:`2px solid ${cardBorder(w.activeTasks)}`, borderLeftWidth:4, borderLeftColor:pColor(+p), borderLeftStyle:"solid", opacity:cardOpacity(w.activeTasks) }}>
                  <div style={{ padding:compact?"7px 10px 6px":"10px 14px 8px", borderBottom:`1px solid ${cardBorder(w.activeTasks)}22` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:8 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1A2035", cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:3 }}
                        onClick={() => onWorkerClick(w.assignee)}>{w.assignee}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#fff",
                          background: w.activeTasks > 0 ? "#4A7BF7" : "#16A34A",
                          padding:"2px 7px", borderRadius:20, whiteSpace:"nowrap" }}>
                          {wLabel(w.activeTasks, w.assignee)}
                        </div>
                        {w.activeTasks > 0 && (() => { const dl = deadlineMap.get(w.assignee); if (!dl) return null; const { text, color } = fmtDeadline(dl); return (
                          <div style={{ fontSize:10, fontWeight:700, color:"#fff", background: color === "#fff" ? "#4A7BF7" : color, padding:"2px 6px", borderRadius:20, whiteSpace:"nowrap" }}>· {text}</div>
                        ); })()}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {w.qualifications.map(q => {
                        const sdcHL = taskType === "Test" && q.startsWith("SDC ") && q !== w.matchingSkill;
                        return (
                          <span key={q} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, fontWeight:600, border:"1px solid",
                            ...(q === w.matchingSkill
                              ? { background:"#16A34A", color:"#fff", borderColor:"#15803D" }
                              : sdcHL
                              ? { background:"#DBEAFE", color:"#1E40AF", borderColor:"#93C5FD" }
                              : qualBadgeStyle(q)) }}>
                            {q}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {!compact && (
                  <div style={{ padding:"6px 14px 8px", background: free ? "#ECFDF5" : "transparent", borderTop:`1px solid ${free ? "#BBF7D0" : "rgba(0,0,0,.06)"}`, display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color: free ? "#6B7A90" : "#64748B" }}>↩ {w.avgReturns}/task</span>
                    <div style={{ width:1, height:12, background: free ? "rgba(0,0,0,.1)" : "rgba(255,255,255,.1)" }} />
                    {(() => { const e = actqErrors.get(w.assignee); const hasErr = e && (e.Q > 0 || e.A > 0 || e.T1 > 0); return hasErr ? <>
                      {e!.Q  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA" }}>Q {e!.Q}</span>}
                      {e!.A  > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFF7ED", color:"#C2410C", border:"1px solid #FED7AA" }}>A {e!.A}</span>}
                      {e!.T1 > 0 && <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, fontWeight:700, background:"#FFFBEB", color:"#B45309", border:"1px solid #FDE68A" }}>T1 {e!.T1}</span>}
                    </> : <span style={{ fontSize:10, color: free ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.3)" }}>ACTQ —</span>; })()}
                  </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        ))
      }
      {/* <MiniGantt tasks={tasks} /> */}
    </div>
  );
}

type CompareHL = { returns:"best"|"worst"|null; overdue:"best"|"worst"|null; duration:"best"|"worst"|null; score:"best"|"worst"|null };

function SpecProfilePanel({ name, tasks, qualifications, actqErrors, actqByTask, onClose, onSelectTask, cardMode, cardWidth, compareHL }: {
  name: string; tasks: TaskRow[]; qualifications: Qualifications;
  actqErrors: ActqMap; actqByTask: ActqTaskMap;
  onClose: () => void; onSelectTask: (t: TaskRow) => void;
  cardMode?: boolean; cardWidth?: number; compareHL?: CompareHL;
}) {
  const T = useT();
  const lang = useContext(LangCtx);
  const today = new Date().toISOString().slice(0, 10);
  const [profilePeriod, setProfilePeriod] = useState<"3m"|"6m"|"all">("all");
  const addD2 = (s: string, n: number) => { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0,10); };

  const periodStart = profilePeriod === "3m" ? addD2(today, -90) : profilePeriod === "6m" ? addD2(today, -180) : null;
  const myTasks = tasks.filter(t => t.assignee === name && (!periodStart || t.segments.some(s => s.to >= periodStart)));

  const allStats = buildWorkerStats(periodStart ? tasks.filter(t => t.segments.some(s => s.to >= periodStart)) : tasks, today);
  const stat = allStats.find(w => w.assignee === name);

  const norm = (v: number, mn: number, mx: number) => mx === mn ? 0.5 : (v - mn) / (mx - mn);
  const aqRate = (w: WorkerStat) => { const e = actqErrors.get(w.assignee); return e ? (e.Q+e.A+e.T1)/Math.max(w.totalTasks,1) : 0; };
  const minAQ = Math.min(...allStats.map(aqRate)), maxAQ = Math.max(...allStats.map(aqRate));
  const minR  = Math.min(...allStats.map(w=>w.avgReturns)), maxR = Math.max(...allStats.map(w=>w.avgReturns));
  const minO  = Math.min(...allStats.map(w=>w.overdue)),    maxO = Math.max(...allStats.map(w=>w.overdue));
  const minD  = Math.min(...allStats.map(w=>w.avgDuration)),maxD = Math.max(...allStats.map(w=>w.avgDuration));
  const minT  = Math.min(...allStats.map(w=>w.totalTasks)), maxT = Math.max(...allStats.map(w=>w.totalTasks));
  const calcScore = (w: WorkerStat) =>
    (1-norm(aqRate(w),minAQ,maxAQ))*0.40 + (1-norm(w.avgReturns,minR,maxR))*0.20 +
    (1-norm(w.overdue,minO,maxO))*0.30   + (1-norm(w.avgDuration,minD,maxD))*0.05 +
    norm(w.totalTasks,minT,maxT)*0.05;
  const sorted = [...allStats].sort((a,b) => calcScore(b)-calcScore(a));
  const rank = sorted.findIndex(w => w.assignee === name);
  const myScore = stat ? calcScore(stat) : 0;
  const actq = actqErrors.get(name);

  // per-component normalized scores (0=worst, 1=best in team)
  const sc_actq  = stat ? 1 - norm(aqRate(stat), minAQ, maxAQ) : 0.5;
  const sc_over  = stat ? 1 - norm(stat.overdue,    minO, maxO) : 0.5;
  const sc_ret   = stat ? 1 - norm(stat.avgReturns, minR, maxR) : 0.5;
  const sc_speed = stat ? 1 - norm(stat.avgDuration, minD, maxD) : 0.5;
  const sc_exp   = stat ? norm(stat.totalTasks, minT, maxT) : 0.5;

  // sparkline for last 6 months
  const MONTHS = 6;
  const retByMonth  = stat?.returnsByMonth  ?? Array(MONTHS).fill(0);
  const ovdByMonth  = stat?.overdueByMonth  ?? Array(MONTHS).fill(0);
  const maxRet = Math.max(...retByMonth, 1);
  const maxOvd = Math.max(...ovdByMonth, 1);
  const monthLabels = Array.from({length: MONTHS}, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (MONTHS - 1 - i));
    return d.toLocaleDateString(lang === "en" ? "en-US" : "uk-UA", { month: "short" });
  });

  // initials
  const parts = name.trim().split(" ");
  const initials = (parts[0]?.[0]||"") + (parts[1]?.[0]||"");

  // avatar gradient by rank
  const avatarGrad = rank === 0 ? "135deg,#F59E0B,#D97706" : rank <= 2 ? "135deg,#4A7BF7,#8B46FF" : "135deg,#64748B,#94A3B8";
  const rankBg = rank === 0 ? "#F59E0B" : rank <= 4 ? "#4A7BF7" : rank <= 9 ? "#8B46FF" : "#94A3B8";

  // status dot color
  const dotColor: Record<string,string> = {
    "Setting task":"#94A3B8","In progress":"#4A7BF7","Quality control":"#8B46FF",
    "Ready for acceptance":"#22C55E","Done":"#0D9488","Paused":"#F97316","Pending more info":"#F97316",
  };

  const [taskSort, setTaskSort] = useState<"date_desc"|"date_asc"|"returns"|"overdue">("date_desc");
  const tasksSorted = [...myTasks].sort((a,b) => {
    if (taskSort === "date_asc")  return (a.start_date||"").localeCompare(b.start_date||"");
    if (taskSort === "returns")   return b.returns - a.returns;
    if (taskSort === "overdue") {
      const ao = !!a.planned_end && a.planned_end < today && a.current_status !== "Done";
      const bo = !!b.planned_end && b.planned_end < today && b.current_status !== "Done";
      if (ao !== bo) return ao ? -1 : 1;
    }
    return (b.start_date||"").localeCompare(a.start_date||"");
  });

  const RatingBar = ({ label, hint, weight, value, color }: { label: string; hint: string; weight: string; value: number; color: string }) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
      <div style={{ width:130, flexShrink:0 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#4A5568" }}>{label} <span style={{ fontSize:10, color:"#B0BAC8", fontWeight:400 }}>· {weight}</span></div>
        <div style={{ fontSize:10, color:"#B0BAC8", marginTop:2, lineHeight:1.35 }}>{hint}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ height:8, borderRadius:4, background:"#E2E8F0", overflow:"hidden" }}>
          <div style={{ width:`${Math.round(value*100)}%`, height:"100%", borderRadius:4, background:color, transition:"width .4s" }} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
          <span style={{ fontSize:9, color:"#D1D5DB" }}>{T.ratingWorstBest[0]}</span>
          <span style={{ fontSize:9, color:"#D1D5DB" }}>{T.ratingWorstBest[1]}</span>
        </div>
      </div>
      <div style={{ width:36, textAlign:"right", fontSize:13, fontWeight:800, color, flexShrink:0 }}>{value.toFixed(2)}</div>
    </div>
  );

  const Spark = ({ data, max, color, title, hint }: { data: number[]; max: number; color: string; title: string; hint: string }) => (
    <div style={{ flex:1, background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:10, padding:"10px 12px" }}>
      <div style={{ fontSize:11, fontWeight:600, color:"#6B7A90", marginBottom:2 }}>{title}</div>
      <div style={{ fontSize:10, color:"#B0BAC8", marginBottom:8 }}>{hint}</div>
      <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:32 }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex:1, borderRadius:"3px 3px 0 0", background: v === 0 ? "#E2E8F0" : color, height:`${Math.max(4, Math.round(v/max*100))}%`, minHeight: v > 0 ? 4 : 2, transition:"height .3s" }} title={`${monthLabels[i]}: ${v}`} />
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        {monthLabels.map((m,i) => <span key={i} style={{ fontSize:9, color:"#B0BAC8" }}>{m}</span>)}
      </div>
    </div>
  );

  const innerPanel = (
      <div style={{ width: cardMode ? (cardWidth||660) : 680, background:"#fff", display:"flex", flexDirection:"column", overflow:"hidden",
        boxShadow: cardMode ? "0 8px 48px rgba(0,0,0,.22)" : "-8px 0 48px rgba(0,0,0,.14)",
        borderRadius: cardMode ? 16 : 0, maxHeight: cardMode ? "82vh" : undefined, height: cardMode ? undefined : "100%" }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={{ background:"#F8FAFC", borderBottom:"1px solid #EEF2F8", padding:"20px 24px 16px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(${avatarGrad})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff", flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#1A2035" }}>{name}</div>
              <div style={{ fontSize:12, color:"#9AA5B4", marginTop:3 }}>
                {qualifications[name]?.[0] || T.workers} · {T.taskCount(stat?.totalTasks ?? 0)}
              </div>
            </div>
            <div style={{ padding:"4px 12px", borderRadius:8, background:rankBg, color:"#fff", fontSize:13, fontWeight:800 }}>
              {T.rankOf(rank + 1, allStats.length)}
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:"rgba(0,0,0,.06)", border:"none", cursor:"pointer", fontSize:18, color:"#6B7A90", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* Quals */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
            {(qualifications[name]||[]).map(q => (
              <span key={q} style={{ fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:600, border:"1px solid", ...qualBadgeStyle(q) }}>{q}</span>
            ))}
          </div>

          {/* Period + hint */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", background:"#F1F5F9", borderRadius:8, padding:3, gap:2, border:"1px solid #E2E8F0" }}>
              {(["3m","6m","all"] as const).map(p => (
                <button key={p} onClick={() => setProfilePeriod(p)}
                  style={{ padding:"4px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                    background: profilePeriod===p ? "#4A7BF7" : "transparent", color: profilePeriod===p ? "#fff" : "#6B7A90", transition:"all .15s" }}>
                  {p === "3m" ? T.profilePeriod3m : p === "6m" ? T.profilePeriod6m : T.profilePeriodAll}
                </button>
              ))}
            </div>
            <span style={{ fontSize:11, color:"#B0BAC8" }}>{T.periodHint}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:20 }}>

          {/* Stats row */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".5px", marginBottom:4 }}>{T.perfSection}</div>
            <div style={{ fontSize:11, color:"#B0BAC8", marginBottom:12 }}>{T.perfHint}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[
                { val: stat?.totalTasks ?? 0, label:T.statTasks, desc:T.statTasksDesc, color:"#1A2035", hl: null as "best"|"worst"|null },
                { val: `↩ ${(stat?.avgReturns??0).toFixed(1)}`, label:T.statReturns, desc:T.statReturnsDesc, color: (stat?.avgReturns??0) > 0.5 ? "#EA580C" : "#1A2035", hl: compareHL?.returns ?? null },
                { val: stat?.overdue ?? 0, label:T.statOverdue, desc:T.statOverdueDesc, color: (stat?.overdue??0) > 2 ? "#DC2626" : "#1A2035", hl: compareHL?.overdue ?? null },
                { val: `${(stat?.avgDuration??0).toFixed(1)}d`, label:T.statSpeed, desc:T.statSpeedDesc, color:"#16A34A", hl: compareHL?.duration ?? null },
              ].map(({val, label, desc, color, hl}) => {
                const hlBg = hl === "best" ? "#F0FDF4" : hl === "worst" ? "#FFF5F5" : "#F8FAFC";
                const hlBorder = hl === "best" ? "#86EFAC" : hl === "worst" ? "#FECACA" : "#E2E8F0";
                return (
                <div key={label} style={{ background:hlBg, border:`2px solid ${hlBorder}`, borderRadius:10, padding:"12px 14px", position:"relative" }}>
                  {hl && <div style={{ position:"absolute", top:6, right:8, fontSize:9, fontWeight:700,
                    color: hl === "best" ? "#16A34A" : "#DC2626" }}>{hl === "best" ? "▲" : "▼"}</div>}
                  <div style={{ fontSize:20, fontWeight:800, color, lineHeight:1 }}>{val}</div>
                  <div style={{ fontSize:10, color:"#9AA5B4", marginTop:4, textTransform:"uppercase", letterSpacing:".3px", fontWeight:600 }}>{label}</div>
                  <div style={{ fontSize:10, color:"#B0BAC8", marginTop:3, lineHeight:1.3 }}>{desc}</div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Rating breakdown */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".5px", marginBottom:4 }}>{T.ratingSection}</div>
            <div style={{ fontSize:11, color:"#B0BAC8", marginBottom:12 }}>{T.ratingHint}</div>
            <div style={{ background:"#F8FAFC", borderRadius:12, border:"1px solid #E2E8F0", padding:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18, paddingBottom:16, borderBottom:"1px solid #EEF2F8" }}>
                <div>
                  <div style={{ fontSize:30, fontWeight:900, color:"#4A7BF7", lineHeight:1 }}>{myScore.toFixed(2)}</div>
                  <div style={{ fontSize:11, color:"#9AA5B4", marginTop:3 }}>{T.ratingTotal(rank+1, allStats.length)}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#B0BAC8", marginBottom:4 }}>{T.ratingScale}</div>
                  <div style={{ height:10, background:"#E2E8F0", borderRadius:5, overflow:"hidden" }}>
                    <div style={{ width:`${Math.round(myScore*100)}%`, height:"100%", background:"linear-gradient(90deg,#22C55E,#4A7BF7)", borderRadius:5 }} />
                  </div>
                </div>
              </div>
              <RatingBar label={T.compACTQ} hint={T.compACTQHint} weight="40%" value={sc_actq} color="#4A7BF7" />
              <RatingBar label={T.compOverdue} hint={T.compOverdueHint} weight="30%" value={sc_over} color="#F97316" />
              <RatingBar label={T.compReturns} hint={T.compReturnsHint} weight="20%" value={sc_ret} color="#8B46FF" />
              <RatingBar label={T.compSpeed} hint={T.compSpeedHint} weight="5%" value={sc_speed} color="#22C55E" />
              <RatingBar label={T.compExp} hint={T.compExpHint} weight="5%" value={sc_exp} color="#0D9488" />
            </div>
          </div>

          {/* Sparklines */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".5px", marginBottom:4 }}>{T.sparkSection}</div>
            <div style={{ fontSize:11, color:"#B0BAC8", marginBottom:12 }}>{T.sparkHint}</div>
            <div style={{ display:"flex", gap:10 }}>
              <Spark data={retByMonth} max={maxRet} color="#8B46FF" title={T.sparkReturns} hint={T.sparkReturnsHint} />
              <Spark data={ovdByMonth} max={maxOvd} color="#F97316" title={T.sparkOverdue} hint={T.sparkOverdueHint} />
            </div>
          </div>

          {/* Task history */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".5px" }}>{T.histSection(myTasks.length)}</div>
              <div style={{ display:"flex", gap:4, marginLeft:"auto" }}>
                {([["date_desc",T.sortNewest],["date_asc",T.sortOldest],["returns",`↩ ${T.sortReturns}`],["overdue",T.sortOverdue]] as const).map(([v,l]) => (
                  <button key={v} onClick={() => setTaskSort(v)}
                    style={{ padding:"3px 9px", borderRadius:5, border:"1.5px solid", cursor:"pointer", fontSize:11, fontWeight:600,
                      background: taskSort===v ? "#4A7BF7" : "#F8FAFC", color: taskSort===v ? "#fff" : "#6B7A90", borderColor: taskSort===v ? "#4A7BF7" : "#E2E8F0" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize:11, color:"#B0BAC8", marginBottom:10 }}>{T.histHint}</div>

            {/* Legend */}
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
              {[["#94A3B8",T.legendSetting],["#4A7BF7",T.legendIP],["#8B46FF",T.legendQA],["#22C55E",T.legendRFA],["#0D9488",T.legendDone]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#6B7A90" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />
                  {l}
                </div>
              ))}
              <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#6B7A90" }}>
                <span style={{ fontSize:10, fontWeight:700, color:"#DC2626", background:"#FEF2F2", border:"1px solid #FECACA", padding:"1px 5px", borderRadius:3 }}>Q2</span>
                {T.legendTagErr}
              </div>
            </div>

            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #E2E8F0", overflow:"hidden" }}>
              {/* Table header */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 56px 80px 68px", background:"#F8FAFC", borderBottom:"1px solid #EEF2F8", padding:"0 16px" }}>
                {[T.colTaskClient, T.colStatusPath, T.colQaRet, T.colDeadline, T.colErrors].map(h => (
                  <div key={h} style={{ padding:"8px 0", fontSize:10, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px" }}>{h}</div>
                ))}
              </div>

              {tasksSorted.slice(0,50).map(t => {
                const isActive = !["Done","Canceled"].includes(t.current_status);
                const isOverdue = !!t.planned_end && t.planned_end < today && t.current_status !== "Done";
                const tActq = actqByTask.get(t.id);
                const hasActq = tActq && (tActq.Q > 0 || tActq.A > 0 || tActq.T1 > 0);
                const borderLeft = isOverdue ? "3px solid #DC2626" : t.returns >= 2 ? "3px solid #EA580C" : "3px solid transparent";
                return (
                  <div key={t.id} onClick={() => onSelectTask(t)}
                    style={{ display:"grid", gridTemplateColumns:"1fr 100px 56px 80px 68px", padding:"0 16px", borderBottom:"1px solid #EEF2F8", alignItems:"center", minHeight:44, cursor:"pointer", background: isActive ? "#F0FDF4" : "#fff", borderLeft, transition:"background .1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#EFF6FF")}
                    onMouseLeave={e => (e.currentTarget.style.background = isActive ? "#F0FDF4" : "#fff")}>
                    <div style={{ padding:"8px 0 8px", overflow:"hidden" }}>
                      <div style={{ fontSize:12, fontWeight:600, color: isActive ? "#16A34A" : "#4A7BF7", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
                      <div style={{ fontSize:10, color:"#9AA5B4", marginTop:2 }}>
                        {t.client || t.project}
                        {isActive && <span style={{ color:"#16A34A", fontWeight:600 }}> · {T.active}</span>}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                      {t.segments.map((s, si) => (
                        <div key={si} title={s.status} style={{ width:8, height:8, borderRadius:"50%", background:dotColor[s.status]||"#94A3B8", flexShrink:0,
                          ...(si === t.segments.length-1 && isActive ? { boxShadow:`0 0 0 2px #fff, 0 0 0 3px ${dotColor[s.status]||"#94A3B8"}` } : {}) }} />
                      ))}
                    </div>
                    <div>
                      {t.returns > 0
                        ? <span style={{ fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:4, background: t.returns>=2?"#FFF7ED":"#F5F3FF", color: t.returns>=2?"#EA580C":"#8B46FF" }}>↩ {t.returns}</span>
                        : <span style={{ fontSize:11, color:"#B0BAC8" }}>—</span>}
                    </div>
                    <div>
                      {t.planned_end
                        ? <span style={{ fontSize:11, fontWeight:600, color: isOverdue ? "#DC2626" : isActive ? "#16A34A" : "#6B7A90" }}>
                            {isOverdue ? `⚠ ${fmtD(t.planned_end)}` : fmtD(t.planned_end)}
                          </span>
                        : <span style={{ fontSize:11, color:"#B0BAC8" }}>—</span>}
                    </div>
                    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                      {hasActq ? <>
                        {(tActq!.Q > 0) && <span style={{ fontSize:9, padding:"1px 5px", borderRadius:3, fontWeight:700, border:"1px solid #FECACA", background:"#FEF2F2", color:"#DC2626" }}>Q{tActq!.Q}</span>}
                        {(tActq!.A > 0) && <span style={{ fontSize:9, padding:"1px 5px", borderRadius:3, fontWeight:700, border:"1px solid #FED7AA", background:"#FFF7ED", color:"#C2410C" }}>A{tActq!.A}</span>}
                        {(tActq!.T1 > 0) && <span style={{ fontSize:9, padding:"1px 5px", borderRadius:3, fontWeight:700, border:"1px solid #FDE68A", background:"#FFFBEB", color:"#B45309" }}>T{tActq!.T1}</span>}
                      </> : <span style={{ fontSize:10, color:"#B0BAC8" }}>—</span>}
                    </div>
                  </div>
                );
              })}

              {myTasks.length > 50 && (
                <div style={{ padding:"10px 16px", textAlign:"center", color:"#9AA5B4", fontSize:12, borderTop:"1px solid #EEF2F8" }}>
                  + {myTasks.length - 50} {T.tasks}…
                </div>
              )}
              {myTasks.length === 0 && (
                <div style={{ padding:32, textAlign:"center", color:"#B0BAC8", fontSize:13 }}>{T.noTasks}</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding:10, textAlign:"center", fontSize:11, color:"#B0BAC8", borderTop:"1px solid #EEF2F8", flexShrink:0 }}>
          {T.panelHint}
        </div>
      </div>
  );

  if (cardMode) return innerPanel;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"stretch", justifyContent:"flex-end" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(15,23,42,.35)", backdropFilter:"blur(6px)" }} />
      {innerPanel}
    </div>
  );
}

// ─── Compare Overlay ──────────────────────────────────────────────────────────
function CompareOverlay({ names, tasks, qualifications, actqErrors, actqByTask, onClose, onSelectTask, onChange }: {
  names: string[]; tasks: TaskRow[]; qualifications: Qualifications;
  actqErrors: ActqMap; actqByTask: ActqTaskMap;
  onClose: () => void; onSelectTask: (t: TaskRow) => void;
  onChange: (names: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropPos, setDropPos] = useState<{top:number;left:number}>({top:0,left:0});

  const openSearch = () => {
    const r = inputRef.current?.getBoundingClientRect();
    if (r) setDropPos({ top: r.bottom + 6, left: r.left });
    setSearchOpen(true);
  };

  const allWorkers = Object.keys(qualifications).sort();
  const available  = allWorkers.filter(w => !names.includes(w) &&
    (!search || w.toLowerCase().includes(search.toLowerCase())));

  const add    = (w: string) => { if (names.length < 3) onChange([...names, w]); setSearch(""); setSearchOpen(false); };
  const remove = (w: string) => { const n = names.filter(x => x !== w); n.length ? onChange(n) : onClose(); };

  const cardWidth = names.length === 1 ? 660 : names.length === 2 ? 500 : 400;

  // comparison highlights — only meaningful when 2+ cards
  const today = new Date().toISOString().slice(0, 10);
  const allStats = buildWorkerStats(tasks, today);
  const statOf = (n: string) => allStats.find(w => w.assignee === n);
  const hl = (vals: (number|undefined)[], lowerBetter: boolean): ("best"|"worst"|null)[] => {
    const clean = vals.map(v => v ?? 0);
    if (clean.every(v => v === clean[0])) return clean.map(() => null);
    const best = lowerBetter ? Math.min(...clean) : Math.max(...clean);
    const worst = lowerBetter ? Math.max(...clean) : Math.min(...clean);
    return clean.map(v => v === best ? "best" : v === worst ? "worst" : null);
  };
  const returnsHL  = hl(names.map(n => statOf(n)?.avgReturns),  true);
  const overdueHL  = hl(names.map(n => statOf(n)?.overdue),     true);
  const durationHL = hl(names.map(n => statOf(n)?.avgDuration), true);
  const scoreHL    = hl(names.map(n => { const s = statOf(n); return s ? s.totalTasks : undefined; }), false);
  const compareHLs: CompareHL[] = names.map((_, i) => ({
    returns:  names.length > 1 ? returnsHL[i]  : null,
    overdue:  names.length > 1 ? overdueHL[i]  : null,
    duration: names.length > 1 ? durationHL[i] : null,
    score:    names.length > 1 ? scoreHL[i]    : null,
  }));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(10,18,36,.55)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)" }} />

      {/* ── Top bar ── */}
      <div style={{ position:"relative", zIndex:20, display:"flex", alignItems:"center", gap:8, marginBottom:14,
        background:"rgba(255,255,255,.1)", backdropFilter:"blur(4px)", borderRadius:12, padding:"8px 14px",
        border:"1px solid rgba(255,255,255,.18)" }}
        onClick={e => e.stopPropagation()}>

        {names.map(n => (
          <div key={n} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,.92)",
            borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, color:"#1A2035" }}>
            {n.split(" ")[0]}
            <span onClick={() => remove(n)} style={{ cursor:"pointer", color:"#94A3B8", marginLeft:2, fontSize:14, lineHeight:1 }}>×</span>
          </div>
        ))}

        {names.length < 3 && (
          <div style={{ position:"relative" }}>
            <input ref={inputRef} value={search}
              onChange={e => { setSearch(e.target.value); openSearch(); }}
              onFocus={openSearch}
              placeholder="+ Додати спеца..."
              style={{ background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", borderRadius:8,
                padding:"4px 12px", color:"#fff", fontSize:12, outline:"none", width:150 }} />
            {searchOpen && available.length > 0 && (
              <div style={{ position:"fixed", top: dropPos.top, left:"50%", transform:"translateX(-50%)",
                background:"rgba(255,255,255,.96)", backdropFilter:"blur(12px)", borderRadius:14,
                border:"1px solid rgba(255,255,255,.4)", boxShadow:"0 16px 48px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.1)",
                maxHeight:260, overflowY:"auto", minWidth:260, zIndex:1200,
                animation:"dropIn .15s ease-out" }}>
                <div style={{ padding:"8px 12px 6px", fontSize:10, fontWeight:700, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".4px" }}>
                  Спеціалісти
                </div>
                {available.slice(0, 14).map(w => (
                  <div key={w} onMouseDown={() => add(w)}
                    style={{ padding:"8px 16px", fontSize:13, cursor:"pointer", color:"#1A2035",
                      display:"flex", alignItems:"center", gap:8, transition:"background .1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background="rgba(74,123,247,.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background="")}>
                    <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#4A7BF7,#8B46FF)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>
                      {(w.split(" ")[0]?.[0]||"") + (w.split(" ")[1]?.[0]||"")}
                    </div>
                    {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)",
          color:"#fff", borderRadius:8, padding:"4px 10px", cursor:"pointer", fontSize:13 }}>✕</button>
      </div>

      {/* ── Cards row ── */}
      <div style={{ position:"relative", zIndex:2, display:"flex", gap:12, alignItems:"flex-start" }}
        onClick={e => e.stopPropagation()}>
        {names.map((n, i) => (
          <SpecProfilePanel key={n} name={n} tasks={tasks} qualifications={qualifications}
            actqErrors={actqErrors} actqByTask={actqByTask}
            cardMode cardWidth={cardWidth}
            compareHL={compareHLs[i]}
            onClose={() => remove(n)}
            onSelectTask={t => { onClose(); onSelectTask(t); }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CsvGantt() {
  const [lang, setLang]             = useState<Lang>("ua");
  const T = TRANSLATIONS[lang];
  const [tasks, setTasks]           = useState<TaskRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState<"gantt"|"cards"|"analytics"|"matching">("gantt");
  const [period, setPeriod]         = useState<"1m"|"3m"|"6m"|"all">("all");
  const [compact, setCompact]       = useState(false);
  const [qualifications, setQualifications] = useState<Qualifications>({});
  const [clientMap, setClientMap]           = useState<Record<string, string>>({});
  const [actqErrors, setActqErrors]         = useState<ActqMap>(new Map());
  const [actqByTask, setActqByTask]         = useState<ActqTaskMap>(new Map());
  const [groupBy, setGroupBy]       = useState<"assignee"|"project">("assignee");
  const [search, setSearch]         = useState("");
  const [hideStatus, setHideStatus] = useState<Set<string>>(new Set(["Done"]));
  const [workerModal, setWorkerModal] = useState<string[]>([]);
  const [collapsed, setCollapsed]   = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cmdOpen, setCmdOpen]         = useState(false);
  const [cmdQuery, setCmdQuery]       = useState("");
  const [cmdIdx, setCmdIdx]           = useState(0);
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
      fetch(`${base}/hashtags.csv`).then(r => r.text()).then(hraw => {
        setActqErrors(parseHashtags(hraw, assigneeMap));
        setActqByTask(parseActqByTask(hraw));
      }).catch(() => {});
    });
    fetch(`${base}/qualifications.json`).then(r => r.json()).then(setQualifications).catch(() => {});
    fetch(`${base}/clients.json`).then(r => r.json()).then(setClientMap).catch(() => {});
  }, []);

  useEffect(() => {
    if (!Object.keys(clientMap).length) return;
    setTasks(prev => prev.map(t => ({ ...t, client: clientMap[t.id] || "" })));
  }, [clientMap]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); setCmdQuery(""); setCmdIdx(0); }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!tasks.length || !scrollerRef.current || view !== "gantt") return;
    const today = new Date().toISOString().slice(0, 10);
    const vs = tasks.flatMap(t => t.segments.map(s => s.from)).sort()[0] || today;
    scrollerRef.current.scrollLeft = Math.max(0, (dif(vs, today) - 7) * DW);
  }, [tasks, view]);

  if (loading) return (
    <LangCtx.Provider value={lang}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", gap:10, color:"#6B7A90", fontSize:14 }}>
      <span style={{ width:18, height:18, border:"2px solid rgba(148,163,184,0.15)", borderTopColor:"#4A7BF7", borderRadius:"50%", animation:"sp .7s linear infinite", display:"inline-block" }} />
      {T.loading}
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
    </div>
    </LangCtx.Provider>
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

  const SW = sidebarOpen ? 220 : 60;
  const NAV_ITEMS = [
    { id:"gantt",     icon:"▦", label:T.gantt },
    { id:"cards",     icon:"☰", label:T.cards },
    { id:"analytics", icon:"↗", label:T.analytics },
    { id:"matching",  icon:"⊕", label:T.matching },
  ] as const;

  return (
  <LangCtx.Provider value={lang}>
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',system-ui,sans-serif", background:"#F1F5F9", color:"#1A2035", fontSize:13, overflow:"hidden", height:"100vh", display:"flex", flexDirection:"row", WebkitFontSmoothing:"antialiased" } as React.CSSProperties}>
      <style>{`
        @keyframes sp{to{transform:rotate(360deg)}}
        @keyframes dropIn{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .task-link{font-size:11px;color:#4A7BF7;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;width:100%;font-weight:500}
        .task-link:hover{text-decoration:underline}
        .grow-row:hover{background:#EFF6FF!important}
        .pill{transition:all .15s;user-select:none;cursor:pointer}
        .pill:hover{opacity:.8}
        .glow-card{transition:box-shadow .2s,transform .2s,border-color .2s;will-change:transform}
        .glow-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.06)!important;transform:translateY(-2px)}
        .sb-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;transition:background .12s;color:rgba(255,255,255,.5);font-size:13px;font-weight:500;border:none;background:transparent;width:100%;text-align:left}
        .sb-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
        .sb-item.active{background:rgba(45,127,249,.18);color:#60A5FA}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width:SW, flexShrink:0, background:"#080F1E", display:"flex", flexDirection:"column", borderRight:"1px solid rgba(148,163,184,0.06)", transition:"width .2s", overflow:"hidden" }}>
        {/* Logo + toggle */}
        <div style={{ height:56, display:"flex", alignItems:"center", padding:"0 14px", gap:10, flexShrink:0, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"#4A7BF7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0, fontWeight:700, color:"#fff" }}>A</div>
          {sidebarOpen && <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:"-.2px", lineHeight:1, whiteSpace:"nowrap" }}>ARCHI <span style={{ color:"#4A7BF7" }}>Gantt</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:2 }}>{tasks.length} {T.tasks}</div>
          </div>}
          <button onClick={() => setSidebarOpen(v => !v)} style={{ marginLeft:"auto", width:24, height:24, borderRadius:6, border:"none", background:"rgba(255,255,255,.07)", color:"rgba(255,255,255,.5)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ padding:"10px 8px", display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`sb-item${view===item.id?" active":""}`}>
              <span style={{ fontSize:16, flexShrink:0, width:24, textAlign:"center" }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>}
            </button>
          ))}

          <div style={{ height:1, background:"rgba(255,255,255,.06)", margin:"8px 4px" }} />

          {/* Period selector */}
          {sidebarOpen && <div style={{ padding:"4px 4px 0" }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", fontWeight:600, textTransform:"uppercase", letterSpacing:".4px", marginBottom:6, paddingLeft:4 }}>{T.period}</div>
            {(["1m","3m","6m","all"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`sb-item${period===p?" active":""}`} style={{ padding:"6px 12px" }}>
                <span style={{ fontSize:14, width:24, textAlign:"center" }}>◷</span>
                <span>{p === "1m" ? T.p1m : p === "3m" ? T.p3m : p === "6m" ? T.p6m : T.pAll}</span>
              </button>
            ))}
          </div>}
          {!sidebarOpen && (["1m","3m","6m","all"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} title={p === "1m" ? T.p1m : p === "3m" ? T.p3m : p === "6m" ? T.p6m : T.pAll}
              className={`sb-item${period===p?" active":""}`} style={{ justifyContent:"center", padding:"6px 0" }}>
              <span style={{ fontSize:10, fontWeight:700 }}>{p === "all" ? "∞" : p}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:"10px 8px", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0 }}>
          <button onClick={() => setCompact(v => !v)} className={`sb-item${compact ? " active" : ""}`} title={compact ? T.comfortable : T.compact}>
            <span style={{ fontSize:14, width:24, textAlign:"center" }}>⠿</span>
            {sidebarOpen && <span>{compact ? T.compact : T.comfortable}</span>}
          </button>
          {/* Language toggle */}
          <button onClick={() => setLang(l => l === "ua" ? "en" : "ua")} className="sb-item" title="UA / EN">
            <span style={{ fontSize:13, width:24, textAlign:"center" }}>🌐</span>
            {sidebarOpen && <span style={{ fontSize:12, fontWeight:700 }}>{lang === "ua" ? "UA" : "EN"}</span>}
          </button>
          <a href="/" className="sb-item" style={{ textDecoration:"none" }}>
            <span style={{ fontSize:14, width:24, textAlign:"center" }}>←</span>
            {sidebarOpen && <span>API</span>}
          </a>
        </div>
      </aside>

      {/* Floating tab to expand collapsed sidebar */}
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)}
          style={{ position:"fixed", left:60, top:"50%", transform:"translateY(-50%)", width:14, height:44, background:"#fff", border:"1px solid #E2E8F0", borderLeft:"none", borderRadius:"0 6px 6px 0", color:"#94A3B8", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, zIndex:50, padding:0, lineHeight:1, boxShadow:"2px 0 8px rgba(0,0,0,.06)" }}>
          ›
        </button>
      )}

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* FILTERS */}
      {view !== "analytics" && view !== "matching" && <div style={{ background:"#fff", margin:"12px 20px 0", borderRadius:12, padding:"10px 16px", display:"flex", flexWrap:"wrap", gap:10, alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,.06)", border:"1px solid #E2E8F0", flexShrink:0 }}>
        {view === "gantt" && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ color:"#9AA5B4", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{T.group}</span>
              {(["assignee","project"] as const).map(v => (
                <span key={v} className="pill" onClick={() => setGroupBy(v)}
                  style={{ padding:"4px 11px", borderRadius:8, fontSize:12, fontWeight:600, border:"1.5px solid", borderColor:groupBy===v?"#4A7BF7":"#E2E8F0", background:groupBy===v?"#4A7BF7":"#F8FAFC", color:groupBy===v?"#fff":"#6B7A90" }}>
                  {v === "assignee" ? T.byWorker : T.byProject}
                </span>
              ))}
            </div>
            <div style={{ width:1, height:22, background:"#E2E8F0" }} />
          </>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
          <span style={{ color:"#9AA5B4", fontSize:11, fontWeight:600, textTransform:"uppercase" }}>{T.status}</span>
          {ALL_STATUSES.map(s => {
            const off = hideStatus.has(s);
            const pill = SC_PILL[s] || { bg:"#EEF4FF", tx:"#3A6AE6", border:"#BFDBFE" };
            return (
              <span key={s} className="pill" onClick={() => toggleSt(s)}
                style={{ padding:"3px 9px", borderRadius:7, fontSize:11, fontWeight:500, border:"1.5px solid",
                  borderColor: off ? "#E2E8F0" : pill.border,
                  background:  off ? "#F8FAFC" : pill.bg,
                  color:       off ? "#B0BAC8" : pill.tx,
                  opacity: off ? .7 : 1 }}>
                {STATUS_SHORT[s]||s}
              </span>
            );
          })}
        </div>
        <div style={{ width:1, height:22, background:"#E2E8F0" }} />
        <input placeholder={T.search} value={search} onChange={e => setSearch(e.target.value.toLowerCase())}
          style={{ padding:"5px 11px", borderRadius:8, border:"1.5px solid #E2E8F0", background:"#F8FAFC", color:"#1A2035", fontSize:13, outline:"none", width:170 }} />
        <span style={{ marginLeft:"auto", color:"#9AA5B4", fontSize:11 }}>{filtered.length} {T.tasks}</span>
      </div>}

      {/* CONTENT */}
      {view === "analytics"
        ? <AnalyticsView tasks={periodTasks} qualifications={qualifications} actqErrors={actqErrors} onWorkerClick={n => setWorkerModal([n])} compact={compact} />
        : view === "matching"
        ? <MatchingView tasks={tasks} qualifications={qualifications} actqErrors={actqErrors} onWorkerClick={n => setWorkerModal([n])} compact={compact} />
        : view === "cards"
        ? <CardsView tasks={periodTasks} search={search} hideStatus={hideStatus} onSelect={setSelectedTask} compact={compact} />
        : (
          <div style={{ flex:1, overflow:"hidden", margin:"12px 20px 16px", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)", background:"#fff", border:"1px solid #E2E8F0", display:"flex", flexDirection:"column" }}>
            {filtered.length === 0
              ? <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:"#9AA5B4" }}>{T.noTasks}</div>
              : <div ref={scrollerRef} style={{ flex:1, overflow:"auto" }}>
                  {/* Header */}
                  <div style={{ position:"sticky", top:0, zIndex:30, display:"flex", minWidth:`calc(520px + ${TW}px)`, background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                    <div style={{ position:"sticky", left:0, zIndex:20, width:520, flexShrink:0, display:"flex", background:"#F8FAFC" }}>
                      {[[T.colTask,260],[T.colWorker,130],[T.colStatus,130]].map(([l,w])=>(
                        <div key={l} style={{ width:+w, flexShrink:0, padding:"0 12px", borderRight:"1px solid #E2E8F0", display:"flex", alignItems:"center", height:42, fontSize:11, fontWeight:600, color:"#9AA5B4", textTransform:"uppercase", letterSpacing:".3px" }}>{l}</div>
                      ))}
                    </div>
                    <div style={{ flex:1, background:"#F8FAFC" }}>
                      <div style={{ display:"flex" }}>
                        {Object.entries(mmap).map(([mk,n])=>(
                          <div key={mk} style={{ width:n*DW, height:21, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#4A5568", borderRight:"1px solid #E2E8F0", whiteSpace:"nowrap", overflow:"hidden" }}>{fmtM(mk+"-01")}</div>
                        ))}
                      </div>
                      <div style={{ display:"flex" }}>
                        {days.map((d,i)=>{
                          const isT=d===today, isW=[0,6].includes(new Date(d).getDay());
                          return <div key={i} style={{ width:DW, height:21, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:isT?"#fff":"#6B7A90", borderRight:"1px solid rgba(148,163,184,.2)", borderTop:"1px solid #E2E8F0", background:isT?"#4A7BF7":"transparent", fontWeight:isT?700:undefined, opacity:(!isT&&isW)?.5:1 }}>{new Date(d).getDate()}</div>;
                        })}
                      </div>
                    </div>
                  </div>

                  {groups.map(([gk, gt]) => {
                    const isc = collapsed.has(gk);
                    return (
                      <div key={gk}>
                        <div onClick={()=>toggleGroup(gk)} style={{ display:"flex", cursor:"pointer", borderTop:"1px solid #E2E8F0", minWidth:`calc(520px + ${TW}px)` }}>
                          <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, background:"#F8FAFC", borderRight:"1px solid #E2E8F0", borderLeft:"3px solid #4A7BF7", display:"flex", alignItems:"center", gap:8, padding:"7px 12px", fontWeight:700, fontSize:12, color:"#0C1526" }}>
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
                            <div key={t.id} className="grow-row" onClick={() => setSelectedTask(t)} style={{ display:"flex", height: compact ? 24 : 36, borderTop:"1px solid rgba(148,163,184,0.15)", background:rowBg, minWidth:`calc(520px + ${TW}px)`, cursor:"pointer", borderLeft: isGanttOverdue ? "3px solid #E53E3E" : "3px solid transparent" }}>
                              <div style={{ position:"sticky", left:0, zIndex:10, width:520, flexShrink:0, display:"flex", background:rowBg }}>
                                <div style={{ width:260, flexShrink:0, padding:"0 12px", borderRight:"1px solid rgba(148,163,184,0.15)", display:"flex", alignItems:"center", overflow:"hidden" }}>
                                  <a className="task-link" href={`https://archivizer.com/tasks/${t.id}`} target="_blank" rel="noreferrer" title={t.name} onClick={e => e.stopPropagation()}>{t.name}</a>
                                </div>
                                <div style={{ width:130, flexShrink:0, padding:"0 10px", borderRight:"1px solid rgba(148,163,184,0.15)", display:"flex", alignItems:"center", fontSize:12, color:"#6B7A90", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{t.assignee}</div>
                                <div style={{ width:130, flexShrink:0, padding:"0 8px", borderRight:"1px solid #E2E8F0", display:"flex", alignItems:"center" }}>
                                  {(() => { const p = SC_PILL[t.current_status] || { bg:"#F1F5F9", tx:"#64748B", border:"#E2E8F0" }; return (
                                    <span style={{ padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:500, whiteSpace:"nowrap", background:p.bg, color:p.tx, border:`1px solid ${p.border}` }}>{STATUS_SHORT[t.current_status]||t.current_status}</span>
                                  ); })()}
                                </div>
                              </div>
                              <div style={{ width:TW, flexShrink:0, position:"relative", overflow:"hidden", background:`linear-gradient(to right,rgba(0,0,0,0.035) 0,rgba(0,0,0,0.035) ${todayX}px,transparent ${todayX}px),repeating-linear-gradient(to right,rgba(148,163,184,0.12) 0,rgba(148,163,184,0.12) 1px,transparent 1px,transparent ${DW}px)` }}>
                                {t.segments.map((seg,si)=>{
                                  const x0=dif(vs,seg.from)*DW, x1=dif(vs,seg.to)*DW, w=Math.max(2,x1-x0);
                                  const sc=SC_SEG[seg.status]; if(!sc||x1<0||x0>TW) return null;
                                  const bw = x0<0 ? w+x0 : w;
                                  const bh = compact ? 14 : 20;
                                  const br = compact ? 7 : 10;
                                  return (
                                    <div key={si}
                                      onMouseEnter={e => setTooltip({ task: t, x: e.clientX, y: e.clientY })}
                                      onMouseMove={e  => setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                                      onMouseLeave={() => setTooltip(null)}
                                      style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", height:bh, borderRadius:br, left:Math.max(0,x0), width:bw, background:`linear-gradient(180deg,${sc.gl} 0%,${sc.bg} 100%)`, border:`1px solid ${sc.border}`, zIndex:2, cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center" }}>
                                      {bw > 48 && (
                                        <span style={{ fontSize:9, color:"rgba(255,255,255,.92)", fontWeight:600, padding:"0 6px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", pointerEvents:"none", lineHeight:1, maxWidth:"100%" }}>
                                          {t.name}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                                {deadlineX!==null && deadlineX>=0 && deadlineX<=TW && (
                                  <div title={`Deadline: ${fmtD(t.planned_end)}`} style={{ position:"absolute", top:0, bottom:0, left:deadlineX, width:2, background:"rgba(255,80,80,.7)", zIndex:3, pointerEvents:"none" }} />
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

      {workerModal.length > 0 && <CompareOverlay names={workerModal} tasks={tasks} qualifications={qualifications} actqErrors={actqErrors} actqByTask={actqByTask} onClose={() => setWorkerModal([])} onSelectTask={t => { setWorkerModal([]); setSelectedTask(t); }} onChange={setWorkerModal} />}

      {tooltip && (() => {
        const t = tooltip.task;
        const today = new Date().toISOString().slice(0, 10);
        const lastTo = t.segments[t.segments.length-1]?.to || today;
        const totalDays = Math.max(1, dif(t.start_date, lastTo));
        const isOverdue = ["In progress","Paused","Quality control"].includes(t.current_status) && !!t.planned_end && t.planned_end < today;
        const daysLeft = t.planned_end ? dif(today, t.planned_end) : null;
        return (
          <div style={{ position:"fixed", left: tooltip.x + 14, top: tooltip.y - 10, zIndex:500, pointerEvents:"none",
            background:"#fff",
            color:"#1A2035", borderRadius:14, padding:"12px 16px", minWidth:230, maxWidth:300,
            boxShadow:"0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)",
            border:"1px solid #E2E8F0", fontSize:12, lineHeight:1.6 }}>
            <div style={{ fontWeight:700, marginBottom:6, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
            <div style={{ color:"#9AA5B4", fontSize:11, marginBottom:8 }}>{t.project}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 12px" }}>
              <div style={{ color:"#B0BAC8", fontSize:10 }}>{T.colWorker.toUpperCase()}</div>
              <div style={{ color:"#B0BAC8", fontSize:10 }}>DURATION</div>
              <div style={{ fontWeight:600 }}>{t.assignee}</div>
              <div style={{ fontWeight:600 }}>{totalDays}d</div>
              <div style={{ color:"#B0BAC8", fontSize:10, marginTop:4 }}>{T.colQaRet.toUpperCase()}</div>
              <div style={{ color:"#B0BAC8", fontSize:10, marginTop:4 }}>{T.clientCycLabel.toUpperCase()}</div>
              <div style={{ fontWeight:600, color: t.returns > 0 ? "#DC2626" : "#1A2035" }}>{t.returns > 0 ? `↩ ${t.returns}` : "—"}</div>
              <div style={{ fontWeight:600, color: t.client_returns > 0 ? "#EA580C" : "#1A2035" }}>{t.rfa_count > 0 ? `${t.rfa_count} RFA${t.client_returns > 0 ? ` · ↩${t.client_returns}×` : ""}` : "—"}</div>
            </div>
            {(() => {
              const nowMs = Date.now();
              const statMs: Record<string, number> = {};
              for (const seg of t.segments) {
                const fromMs = seg.fromDt ? new Date(seg.fromDt).getTime() : new Date(seg.from).getTime();
                const toMs   = seg.toDt   ? new Date(seg.toDt).getTime()   : (seg.to ? new Date(seg.to).getTime() : nowMs);
                const ms = Math.max(0, toMs - fromMs);
                statMs[seg.status] = (statMs[seg.status] || 0) + ms;
              }
              const totalMs = Object.values(statMs).reduce((s, v) => s + v, 0) || 1;
              const fmtDur = (ms: number) => {
                const h = Math.round(ms / 3600000);
                if (h < 24) return `${h}h`;
                const d = Math.floor(h / 24), rem = h % 24;
                return rem > 0 ? `${d}d ${rem}h` : `${d}d`;
              };
              const order = ["In progress","Quality control","Paused","Ready for acceptance","Done","Setting task","Pending more info"];
              const rows = order.filter(s => statMs[s] > 0);
              if (!rows.length) return null;
              return (
                <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #EEF2F8" }}>
                  <div style={{ fontSize:9, color:"#B0BAC8", fontWeight:700, textTransform:"uppercase", letterSpacing:".4px", marginBottom:5 }}>By status</div>
                  {rows.map(s => {
                    const sc = SC[s]; const pct = Math.round(statMs[s] / totalMs * 100);
                    return (
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <div style={{ width:7, height:7, borderRadius:2, background: sc?.bg || "#ccc", flexShrink:0 }}/>
                        <div style={{ fontSize:10, color:"#6B7A90", flex:1 }}>{STATUS_SHORT[s] || s}</div>
                        <div style={{ fontSize:10, fontWeight:600, color:"#1A2035" }}>{fmtDur(statMs[s])}</div>
                        <div style={{ fontSize:9, color:"#B0BAC8", width:28, textAlign:"right" }}>{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {(isOverdue || daysLeft !== null) && t.current_status !== "Done" && (
              <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #EEF2F8", fontSize:11,
                color: isOverdue ? "#DC2626" : daysLeft !== null && daysLeft <= 3 ? "#EA580C" : "#9AA5B4" }}>
                {isOverdue ? `🔴 +${Math.abs(dif(today, t.planned_end))}d overdue` : daysLeft === 0 ? "⚡ due today" : daysLeft !== null && daysLeft <= 3 ? `⚡ ${daysLeft}d left` : `due ${fmtD(t.planned_end)}`}
              </div>
            )}
          </div>
        );
      })()}

      {/* COMMAND PALETTE */}
      {cmdOpen && (() => {
        const q = cmdQuery.toLowerCase().trim();
        const vHint = lang === "en" ? "view" : "вид";
        const pHint = lang === "en" ? "period" : "період";
        const actions = [
          { label:T.gantt,     hint:vHint, action:() => { setView("gantt");      setCmdOpen(false); } },
          { label:T.cards,     hint:vHint, action:() => { setView("cards");      setCmdOpen(false); } },
          { label:T.analytics, hint:vHint, action:() => { setView("analytics");  setCmdOpen(false); } },
          { label:T.matching,  hint:vHint, action:() => { setView("matching");   setCmdOpen(false); } },
          { label:T.p1m,       hint:pHint, action:() => { setPeriod("1m");  setCmdOpen(false); } },
          { label:T.p3m,       hint:pHint, action:() => { setPeriod("3m");  setCmdOpen(false); } },
          { label:T.p6m,       hint:pHint, action:() => { setPeriod("6m");  setCmdOpen(false); } },
          { label:T.pAll,      hint:pHint, action:() => { setPeriod("all"); setCmdOpen(false); } },
        ];
        const taskMatches = q.length >= 2
          ? tasks.filter(t => t.name.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q)).slice(0, 6).map(t => ({
              label: t.name, hint: t.assignee,
              action: () => { setSelectedTask(t); setView("gantt"); setCmdOpen(false); }
            }))
          : [];
        const filtered = [...actions.filter(a => !q || a.label.toLowerCase().includes(q) || a.hint.includes(q)), ...taskMatches];
        const onKbd = (e: React.KeyboardEvent) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setCmdIdx(i => Math.min(i+1, filtered.length-1)); }
          if (e.key === "ArrowUp")   { e.preventDefault(); setCmdIdx(i => Math.max(i-1, 0)); }
          if (e.key === "Enter" && filtered[cmdIdx]) filtered[cmdIdx].action();
        };
        return (
          <>
            <div onClick={() => setCmdOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.35)", backdropFilter:"blur(6px)", zIndex:800 }} />
            <div style={{ position:"fixed", top:"20%", left:"50%", transform:"translateX(-50%)", width:520, zIndex:900, borderRadius:16, background:"#fff", border:"1px solid #E2E8F0", boxShadow:"0 24px 64px rgba(0,0,0,.14), 0 4px 16px rgba(0,0,0,.08)", overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderBottom:"1px solid #EEF2F8" }}>
                <span style={{ color:"#B0BAC8", fontSize:16 }}>⌘</span>
                <input autoFocus value={cmdQuery} onChange={e => { setCmdQuery(e.target.value); setCmdIdx(0); }} onKeyDown={onKbd}
                  placeholder={T.cmdPlaceholder}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#1A2035", fontSize:15, fontWeight:400 }} />
                <kbd style={{ padding:"2px 7px", borderRadius:5, background:"#F1F5F9", color:"#9AA5B4", fontSize:11, fontFamily:"monospace", border:"1px solid #E2E8F0" }}>ESC</kbd>
              </div>
              <div style={{ maxHeight:320, overflowY:"auto" }}>
                {filtered.length === 0 && <div style={{ padding:"20px 16px", color:"#B0BAC8", fontSize:13, textAlign:"center" }}>{lang === "en" ? "Nothing found" : "Нічого не знайдено"}</div>}
                {filtered.map((item, i) => (
                  <div key={i} onClick={item.action} onMouseEnter={() => setCmdIdx(i)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", cursor:"pointer", background: i===cmdIdx ? "#EFF6FF" : "transparent", borderLeft: i===cmdIdx ? "3px solid #4A7BF7" : "3px solid transparent", transition:"background .08s" }}>
                    <span style={{ color: i===cmdIdx ? "#1A2035" : "#4A5568", fontSize:13, fontWeight: i===cmdIdx ? 600 : 400 }}>{item.label}</span>
                    <span style={{ fontSize:11, color:"#9AA5B4", background:"#F1F5F9", padding:"2px 8px", borderRadius:5, border:"1px solid #E2E8F0" }}>{item.hint}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding:"8px 16px", borderTop:"1px solid #EEF2F8", display:"flex", gap:16, color:"#B0BAC8", fontSize:11 }}>
                <span>↑↓ {lang === "en" ? "navigate" : "навігація"}</span><span>↵ {lang === "en" ? "select" : "вибрати"}</span><span>{T.cmdClose}</span>
              </div>
            </div>
          </>
        );
      })()}

      </div>{/* MAIN */}
    </div>
  </LangCtx.Provider>
  );
}
