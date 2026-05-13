const BASE_URL = "https://api.archivizer.com/api/v3";

export const STATUS_MAP: Record<string, string> = {
  definition:               "Setting task",
  implementation:           "In progress",
  qa:                       "QA",
  incomplete_specification: "Pending more info",
  paused:                   "Pending more info",
  acceptance:               "Ready for Acceptance",
  performed:                "Ready for Acceptance",
  canceled:                 "Canceled",
};

export const STATUS_COLORS: Record<string, { bg: string; tx: string }> = {
  "In progress":          { bg: "#2D7FF9", tx: "#fff" },
  "Ready for Acceptance": { bg: "#20C933", tx: "#fff" },
  "QA":                   { bg: "#8B46FF", tx: "#fff" },
  "Pending more info":    { bg: "#FF6F2C", tx: "#fff" },
  "Setting task":         { bg: "#C2C2C2", tx: "#555" },
};

export const STATUS_ORDER = [
  "In progress",
  "Pending more info",
  "QA",
  "Ready for Acceptance",
  "Setting task",
];

export interface Task {
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

export interface GanttData {
  tasks: Task[];
  view_start: string;
  view_end: string;
  today: string;
  cached_at: string;
}

async function signIn(email: string, password: string) {
  const resp = await fetch(`${BASE_URL}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auth: { email, password } }),
  });
  if (!resp.ok) throw new Error(`Auth failed: ${resp.status}`);
  const data = await resp.json();
  return { token: data.token as string, userId: data.data?.id as number };
}

async function fetchTasksForUser(token: string, userId: number, statuses: string[]) {
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const all: any[] = [];
  let page = 1;

  while (true) {
    const resp = await fetch(`${BASE_URL}/tasks`, {
      method: "GET",
      headers,
      body: JSON.stringify({ page, page_size: 100, filters: { user_id: userId, status: statuses } }),
    });
    if (!resp.ok) break;
    const data = await resp.json();
    const tasks: any[] = data.data || data.tasks || data.items || (Array.isArray(data) ? data : []);
    if (!tasks.length) break;
    all.push(...tasks);
    if (tasks.length < 100) break;
    page++;
  }
  return all;
}

async function fetchTaskById(token: string, taskId: number) {
  const resp = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return data.data || data;
}

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function clampDate(d: string, lo: string, hi: string) {
  if (d < lo) return lo;
  if (d > hi) return hi;
  return d;
}

const ACTIVE_WORKERS = new Set([
  "Irina Kovalenko", "Anastasia Mishustina", "Tetiana Opich",
  "Vera Duhina", "Mykola Stepanov", "Ivan Ivashchenko",
  "Artem Glukhov", "Tanya Rybalova", "Volodymyr Holchevskyi",
  "Maksym Solodkyi", "Krystyna Stan", "Andrii Savchuk",
  "Volodymyr Lysak", "Alona Yaloma", "Oleksii Tereshchenko",
  "Khrystyna Tertytsia", "Diana Savchuk", "Alexander Barsukov",
  "Artur Kovhan", "Kseniia Kukuiashna", "Liliia Sandulska",
  "Kristina Kvach", "Oleksandr Todoriko", "Olena Poruchyk",
  "Ivan Melnychuk", "Dima Lytvynov", "Tania Zykova",
]);

const EXCLUDED_CLIENTS = ["Kyle Neilsen"];
const EXCLUDED_KEYWORDS = ["recap"];
const PM_FILTER = ["Dima Lytvynov", "Tania Zykova"];
const ACTIVE_STATUSES = ["definition","implementation","qa","incomplete_specification","paused","acceptance"];
const ALL_STATUSES    = [...ACTIVE_STATUSES, "performed", "canceled"];

export async function fetchGanttData(): Promise<GanttData> {
  const emailDima  = process.env.ARCHIVIZER_EMAIL!;
  const passDima   = process.env.ARCHIVIZER_PASSWORD!;
  const emailTania = process.env.ARCHIVIZER_EMAIL_TANIA!;
  const passTania  = process.env.ARCHIVIZER_PASSWORD_TANIA!;

  const [dima, tania] = await Promise.all([
    signIn(emailDima, passDima),
    signIn(emailTania, passTania),
  ]);

  console.log(`Signed in: Dima(${dima.userId}), Tania(${tania.userId})`);

  // Fast pass — active statuses
  const [rawDima, rawTania] = await Promise.all([
    fetchTasksForUser(dima.token, dima.userId, ACTIVE_STATUSES),
    fetchTasksForUser(tania.token, tania.userId, ACTIVE_STATUSES),
  ]);

  const seen = new Map<number, any>();
  for (const t of [...rawDima, ...rawTania]) seen.set(t.id, t);
  console.log(`Active tasks: ${seen.size}`);

  // We'll collect task IDs from Excel logic — here we use API directly
  // Fallback: fetch performed/canceled individually if needed (skip for now — use API data)

  const today      = new Date().toISOString().slice(0, 10);
  const viewStart  = "2026-04-20";
  const viewEnd    = addDays(today, 45);

  // Build tasks array
  const rows: Task[] = [];

  for (const t of seen.values()) {
    const rawStatus = t.status as string;
    const status = STATUS_MAP[rawStatus] || rawStatus;

    // PM filter
    const members: any[] = t.members || [];
    const pms = members.filter((m: any) => {
      const full = `${m.name || ""} ${m.surname || ""}`.trim();
      return full.startsWith("PM ");
    });
    const pmNames = pms.map((m: any) => {
      const full = `${m.name || ""} ${m.surname || ""}`.trim().replace(/^PM /, "");
      return full;
    });

    const pmMatch = PM_FILTER.some(pm => pmNames.some(n => n.includes(pm.split(" ")[0]) || pm.includes(n.split(" ").pop() || "")));
    if (!pmMatch && pmNames.length > 0) continue;

    // Dates
    const createdRaw  = t.created_date || t.created_at || today;
    const estimateRaw = t.estimate_date;
    if (!estimateRaw) continue;

    const created  = createdRaw.slice(0, 10);
    const estimate = estimateRaw.slice(0, 10);

    const barStart = clampDate(created,  viewStart, viewEnd);
    const barEnd   = clampDate(estimate, viewStart, viewEnd);

    // Exclude
    if (EXCLUDED_CLIENTS.some(c => (t.client_name || "").includes(c))) continue;
    if (EXCLUDED_KEYWORDS.some(k => t.name?.toLowerCase().includes(k))) continue;

    // Workers from API members
    const workers = members.filter((m: any) => {
      const full = `${m.name || ""} ${m.surname || ""}`.trim();
      return !full.startsWith("PM ") && !full.startsWith("M ");
    });

    const pmStr = pmNames.join("; ") || "—";
    const mentors = members.filter((m: any) => `${m.name || ""} ${m.surname || ""}`.trim().startsWith("M "));
    const mentorStr = mentors.map((m: any) => `${m.name || ""} ${m.surname || ""}`.trim().replace(/^M /, "")).join("; ") || "—";

    const workerList = workers.length
      ? workers.map((m: any) => `${m.name || ""} ${m.surname || ""}`.trim())
      : [pmNames[0] || "Unassigned"];

    for (const w of workerList) {
      if (!ACTIVE_WORKERS.has(w) && w !== "Unassigned") continue;
      rows.push({
        name:      t.name || "(no name)",
        worker:    w,
        status,
        client:    t.client_name || "—",
        pm:        pmStr,
        mentor:    mentorStr,
        bar_start: barStart,
        bar_end:   barEnd,
        url:       `https://archivizer.com/tasks/${t.id}`,
      });
    }
  }

  console.log(`Built ${rows.length} rows`);

  return {
    tasks:      rows,
    view_start: viewStart,
    view_end:   viewEnd,
    today,
    cached_at:  new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
  };
}
