// src/data/posters.ts — poster data (build-time auto-scan)
// public/templates/<festival>/ folder mein PNG daalo → git push → web par aa jayega
// Koi manual entry NAHI chahiye — file naam aur folder se sab kuch banta hai
//
// Order: bada number = naya = pehle (ganesh-13 → ganesh-1)
// 🆕 NEW badge: jiska festival 30 din se naya hai

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

const pretty = (s: string) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true })); // newest number FIRST
  } catch {
    return [];
  }
}

function scan(): Poster[] {
  const out: Poster[] = [];
  for (const [folder, meta] of Object.entries(FESTIVALS)) {
    const files = scanFolder(folder); // SAARI files — koi limit nahi
    files.forEach((f, i) => {
      const base = f.replace(/\.[^.]+$/, "");
      const num = base.match(/\d+$/)?.[0];
      out.push({
        id: `${folder}-${base}`,
        title: num ? `${meta.title} — Design ${num}` : meta.title,
        deity: meta.deity,
        file: `/templates/${folder}/${f}`,
        fest: meta.fest,
        added: meta.added,
      });
    });
  }
  return out.sort((a, b) => +new Date(b.added) - +new Date(a.added)); // newest festival first
}

export const posters: Poster[] = scan();

export const isRecent = (p: Poster) => Date.now() - +new Date(p.added) < 30 * 24 * 60 * 60 * 1000;