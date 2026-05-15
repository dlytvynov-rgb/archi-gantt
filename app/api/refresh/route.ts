export const dynamic = "force-static";
import { NextResponse } from "next/server";
import { fetchGanttData } from "@/lib/archivizer";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "cache.json");

export async function POST() {
  try {
    const data = await fetchGanttData();
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), "utf-8");
    return NextResponse.json({ ok: true, count: data.tasks.length, cached_at: data.cached_at });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
