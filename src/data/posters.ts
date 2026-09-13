// src/data/posters.ts — homepage poster strip ka data
// Naya poster add karna ho: public/templates mein png daalo + yahan ek line add karo (added = aaj ki date)
// List mein sabse nayi date sabse pehle dikhegi + 🆕 NEW badge milega

export interface Poster {
  id: string;
  title: string;
  deity: string;
  file: string;
  fest: string;
  added: string; // YYYY-MM-DD
}

export const posters: Poster[] = [
  { id: "navratri-utsav", title: "Navratri Utsav", deity: "Maa Durga", file: "/templates/navratri-utsav.png", fest: "navratri", added: "2026-09-10" },
  { id: "ganesh-utsav", title: "Ganesh Utsav 2026", deity: "Shri Ganesh", file: "/templates/ganesh-utsav.png", fest: "ganesh", added: "2026-08-25" },
  { id: "hanuman-chalisa", title: "Hanuman Chalisa", deity: "Shri Hanuman", file: "/templates/hanuman-chalisa.png", fest: "hanuman", added: "2026-08-10" },
  { id: "datta-jayanti", title: "Datta Jayanti", deity: "Shri Datta", file: "/templates/datta-jayanti.png", fest: "datta", added: "2026-07-28" },
  { id: "swami-samarth-jayanti", title: "Swami Samarth Jayanti", deity: "Shri Swami Samarth", file: "/templates/swami-samarth-jayanti.png", fest: "swami", added: "2026-07-15" },
  { id: "janmashtami", title: "Janmashtami", deity: "Shri Krishna", file: "/templates/janmashtami.png", fest: "krishna", added: "2026-07-01" },
  { id: "diwali-deepotsav", title: "Deepotsav", deity: "Shri Lakshmi", file: "/templates/diwali-deepotsav.png", fest: "diwali", added: "2026-06-18" },
];