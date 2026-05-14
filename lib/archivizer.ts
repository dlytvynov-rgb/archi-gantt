import https from "node:https";

const BASE_URL = "https://api.archivizer.com/api/v3";

function httpsGetJson(url: string, headers: Record<string, string>, body: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const u = new URL(url);
    const req = https.request(
      { hostname: u.hostname, path: u.pathname, method: "GET", headers: { ...headers, "Content-Length": Buffer.byteLength(bodyStr).toString() } },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          if ((res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300) resolve(JSON.parse(raw));
          else reject(new Error(`HTTP ${res.statusCode}`));
        });
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

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
    let data: any;
    try {
      data = await httpsGetJson(`${BASE_URL}/tasks`, headers, { page, page_size: 100, filters: { user_id: userId, status: statuses } });
    } catch { break; }
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

// PM user IDs (Dima Lytvynov, Tania Zykova) — filter by ID, not by name (names are in Russian)
const PM_USER_IDS = new Set([21296, 34174]);

const EXCLUDED_KEYWORDS = ["recap"];
const ACTIVE_STATUSES = ["definition","implementation","qa","incomplete_specification","paused","acceptance"];

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

    // Members
    const members: any[] = t.members || [];
    const fullName = (m: any) => `${m.name || ""} ${m.surname || ""}`.trim();

    const pms      = members.filter((m: any) => fullName(m).startsWith("PM ") && PM_USER_IDS.has(m.id));
    const mentors  = members.filter((m: any) => fullName(m).startsWith("M "));
    const workers  = members.filter((m: any) => !fullName(m).startsWith("PM ") && !fullName(m).startsWith("M "));

    // Skip tasks that have PMs but none of them are our PMs
    const hasPMs = members.some((m: any) => fullName(m).startsWith("PM "));
    if (hasPMs && pms.length === 0) continue;

    // Dates
    const createdRaw  = t.created_date || t.created_at || today;
    const estimateRaw = t.estimate_date;
    if (!estimateRaw) continue;

    const created  = createdRaw.slice(0, 10);
    const estimate = estimateRaw.slice(0, 10);

    const barStart = clampDate(created,  viewStart, viewEnd);
    const barEnd   = clampDate(estimate, viewStart, viewEnd);

    if (EXCLUDED_KEYWORDS.some(k => t.name?.toLowerCase().includes(k))) continue;

    const pmStr     = pms.map((m: any) => fullName(m).replace(/^PM /, "")).join("; ") || "—";
    const mentorStr = mentors.map((m: any) => fullName(m).replace(/^M /, "")).join("; ") || "—";

    const workerList = workers.length
      ? workers.map((m: any) => fullName(m))
      : [pmStr.split(";")[0].trim() || "Unassigned"];

    for (const w of workerList) {
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
