// src/data/posters.ts — homepage poster strip ka data
// Build time par public/templates ke folders AUTO-SCAN hote hain — file naam likhne ki zaroorat NAHI!
//
// NAYA POSTER ADD KARNA HO:
//   1) PNG ko apne festival folder mein daalo (public/templates/navratri/...)
//   2) Neeche FESTIVALS mein us folder ki `added` date = aaj ki date karo
//   → Homepage strip mein sabse pehle dikhega + 🆕 NEW badge milega

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
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function scan(): Poster[] {
  const out: Poster[] = [];
  for (const [folder, meta] of Object.entries(FESTIVALS)) {
    const files = scanFolder(folder).slice(0, 2); // har festival ke max 2 designs strip mein
    files.forEach((f, i) => {
      out.push({
        id: `${folder}-${i + 1}`,
        title: i === 0 ? meta.title : `${meta.title} — Design ${i + 1}`,
        deity: meta.deity,
        file: `/templates/${folder}/${f}`,   // ← asli path: folder ke andar jo file hai wahi
        fest: meta.fest,
        added: meta.added,
      });
    });
  }
  return out.sort((a, b) => +new Date(b.added) - +new Date(a.added)); // newest first
}

export const posters: Poster[] = scan();