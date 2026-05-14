import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://api.archivizer.com/api/v3";

const STATUS_MAP = {
  definition:               "Setting task",
  implementation:           "In progress",
  qa:                       "QA",
  incomplete_specification: "Pending more info",
  paused:                   "Pending more info",
  acceptance:               "Ready for Acceptance",
  performed:                "Ready for Acceptance",
  canceled:                 "Canceled",
};

const ACTIVE_STATUSES = ["definition","implementation","qa","incomplete_specification","paused","acceptance"];

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

async function signIn(email, password) {
  const resp = await fetch(`${BASE_URL}/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auth: { email, password } }),
  });
  if (!resp.ok) throw new Error(`Auth failed: ${resp.status}`);
  const data = await resp.json();
  return { token: data.token, userId: data.data?.id };
}

async function fetchTasks(token, userId) {
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const all = [];
  let page = 1;
  while (true) {
    const resp = await fetch(`${BASE_URL}/tasks`, {
      method: "GET",
      headers,
      body: JSON.stringify({ page, page_size: 100, filters: { user_id: userId, status: ACTIVE_STATUSES } }),
    });
    if (!resp.ok) break;
    const data = await resp.json();
    const tasks = data.data || data.tasks || data.items || (Array.isArray(data) ? data : []);
    if (!tasks.length) break;
    all.push(...tasks);
    if (tasks.length < 100) break;
    page++;
  }
  return all;
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function clampDate(d, lo, hi) {
  if (d < lo) return lo;
  if (d > hi) return hi;
  return d;
}

async function main() {
  const emailDima  = process.env.ARCHIVIZER_EMAIL;
  const passDima   = process.env.ARCHIVIZER_PASSWORD;
  const emailTania = process.env.ARCHIVIZER_EMAIL_TANIA;
  const passTania  = process.env.ARCHIVIZER_PASSWORD_TANIA;

  console.log("Signing in...");
  const [dima, tania] = await Promise.all([
    signIn(emailDima, passDima),
    signIn(emailTania, passTania),
  ]);
  console.log(`Signed in: Dima(${dima.userId}), Tania(${tania.userId})`);

  const [rawDima, rawTania] = await Promise.all([
    fetchTasks(dima.token, dima.userId),
    fetchTasks(tania.token, tania.userId),
  ]);

  const seen = new Map();
  for (const t of [...rawDima, ...rawTania]) seen.set(t.id, t);
  console.log(`Active tasks: ${seen.size}`);

  const today     = new Date().toISOString().slice(0, 10);
  const viewStart = "2026-04-20";
  const viewEnd   = addDays(today, 45);
  const rows = [];

  for (const t of seen.values()) {
    const status = STATUS_MAP[t.status] || t.status;
    const members = t.members || [];

    const pms = members.filter(m => `${m.name||""} ${m.surname||""}`.trim().startsWith("PM "));
    const pmNames = pms.map(m => `${m.name||""} ${m.surname||""}`.trim().replace(/^PM /, ""));

    const pmMatch = PM_FILTER.some(pm => pmNames.some(n => n.includes(pm.split(" ")[0]) || pm.includes(n.split(" ").pop()||"")));
    if (!pmMatch && pmNames.length > 0) continue;

    const createdRaw  = t.created_date || t.created_at || today;
    const estimateRaw = t.estimate_date;
    if (!estimateRaw) continue;

    const created  = createdRaw.slice(0, 10);
    const estimate = estimateRaw.slice(0, 10);
    const barStart = clampDate(created,  viewStart, viewEnd);
    const barEnd   = clampDate(estimate, viewStart, viewEnd);

    if (EXCLUDED_CLIENTS.some(c => (t.client_name||"").includes(c))) continue;
    if (EXCLUDED_KEYWORDS.some(k => t.name?.toLowerCase().includes(k))) continue;

    const workers = members.filter(m => {
      const full = `${m.name||""} ${m.surname||""}`.trim();
      return !full.startsWith("PM ") && !full.startsWith("M ");
    });
    const mentors = members.filter(m => `${m.name||""} ${m.surname||""}`.trim().startsWith("M "));
    const pmStr     = pmNames.join("; ") || "—";
    const mentorStr = mentors.map(m => `${m.name||""} ${m.surname||""}`.trim().replace(/^M /, "")).join("; ") || "—";
    const workerList = workers.length
      ? workers.map(m => `${m.name||""} ${m.surname||""}`.trim())
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

  const result = {
    tasks:      rows,
    view_start: viewStart,
    view_end:   viewEnd,
    today,
    cached_at:  new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
  };

  const outPath = path.join(__dirname, "../public/data.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
  console.log(`Saved to public/data.json (${rows.length} tasks)`);
}

main().catch(e => { console.error(e); process.exit(1); });
