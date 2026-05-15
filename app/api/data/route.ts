export const dynamic = "force-static";
import { NextResponse } from "next/server";
import { fetchGanttData } from "@/lib/archivizer";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "cache.json");

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function writeCache(data: any) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), "utf-8");
  } catch (e) {
    console.error("Cache write failed:", e);
  }
}

export async function GET() {
  const cached = readCache();
  if (cached) {
    cached.today = new Date().toISOString().slice(0, 10);
    return NextResponse.json(cached);
  }
  return NextResponse.json({ tasks: [], today: new Date().toISOString().slice(0, 10) });
}
