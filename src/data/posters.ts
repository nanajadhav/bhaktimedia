// src/data/posters.ts — poster data (build-time auto-scan)
// public/templates/<festival>/ mein PNG daalo → git push → har jagah dikhega
// KOI LIMIT NAHI — folder ki SAARI files uthti hain, newest number first

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "public/templates";

const FESTIVALS: Record<string, { title: string; deity: string; fest: string; added: string }> = {
  navratri: { title: "Navratri Utsav", deity: "Maa Durga", fest: "navratri", added: "2026-09-10" },
  diwali: { title: "Deepotsav", deity: "Shri Lakshmi", fest: "diwali", added: "2026-09-01" },
  ganesh: { title: "Ganesh Utsav 2026", deity: "Shri Ganesh", fest: "ganesh", added: "2026-08-25" },
  hanuman: { title: "Hanuman Chalisa", deity: "Shri Hanuman", fest: "hanuman", added: "2026-08-10" },
  swami: { title: "Swami Samarth Jayanti", deity: "Shri Swami Samarth", fest: "swami", added: "2026-07-15" },
  holi: { title: "Holi Utsav", deity: "Shri Krishna", fest: "holi", added: "2026-03-05" },
  newyear: { title: "Nava Varsh 2026", deity: "Shri Ganesh", fest: "newyear", added: "2026-01-01" },
};

export interface Poster {
  id: string;
  title: string;
  deity: string;
  file: string;
  fest: string;
  added: string; // YYYY-MM-DD
}

function scanFolder(folder: string): string[] {
  const dir = join(ROOT, folder);
  try {
    if (!statSync(dir).isDirectory()) return [];
  } catch {
    return [];
  }
  try {
    return readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true })); // newest number first
  } catch {
    return [];
  }
}

function scan(): Poster[] {
  const out: Poster[] = [];
  for (const [folder, meta] of Object.entries(FESTIVALS)) {
    const files = scanFolder(folder); // ← SAARI files, koi slice/limit NAHI
    files.forEach((f) => {
      const base = f.replace(/\.[^.]+$/, "");        // "ganesh-13"
      const num = base.match(/\d+$/)?.[0] || "";      // "13"
      out.push({
        id: base,                                     // unique + sahi id (filename se)
        title: num ? `${meta.title} — Design ${num}` : meta.title,
        deity: meta.deity,
        file: `/templates/${folder}/${f}`,            // asli file path
        fest: meta.fest,
        added: meta.added,
      });
    });
  }
  return out.sort((a, b) => +new Date(b.added) - +new Date(a.added)); // newest festival first
}

export const posters: Poster[] = scan();