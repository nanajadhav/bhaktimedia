// src/data/gallery.ts — Divine Gallery data
// ASLI photo: `id` field = /murti/{cat}/preview/ aur /full/ ka file naam (bina .png)
// Bina id: picsum placeholder
export interface GalleryImage {
  seed: string;
  id?: string;
  title: string;
  ratio: string;
  w: number;
  h: number;
}
export interface DeityGallery {
  id: string;
  name: string;
  dev: string;
  seed: string;
  images: GalleryImage[];
}

export const deityGallery: DeityGallery[] = [
  {
    id: "datta",
    name: "Shri Datta",
    dev: "॥ श्री दत्तात्रेय नमः ॥",
    seed: "datta",
    images: [
      { seed: "datta-1", id: "dt-001", title: "Datta Darshan — Morning Aarti", ratio: "3:4", w: 900, h: 1200 },
      { seed: "datta-2", id: "dt-002", title: "Shri Datta — Temple Sanctum", ratio: "4:5", w: 960, h: 1200 },
      { seed: "datta-3", id: "dt-003", title: "Dattatreya — Avadhut Roop", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "datta-4", id: "dt-004", title: "Datta Paduka — Akkalkot", ratio: "3:4", w: 900, h: 1200 },
      { seed: "datta-5", id: "dt-005", title: "Datta — Kamandalu Roop", ratio: "16:9", w: 1600, h: 900 },
      { seed: "datta-6", id: "dt-006", title: "Datta Jayanti Special", ratio: "4:5", w: 960, h: 1200 },
      { seed: "datta-7", id: "dt-007", title: "Datta — Guru Charitra", ratio: "2:3", w: 800, h: 1200 },
      { seed: "datta-8", id: "dt-008", title: "Datta — Sunset Bhajan", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "swami",
    name: "Shri Swami Samarth",
    dev: "॥ श्री स्वामी समर्थ ॥",
    seed: "swami",
    images: [
      { seed: "swami-1", title: "Swami Samarth — Meditation", ratio: "3:4", w: 900, h: 1200 },
      { seed: "swami-2", title: "Akkalkot Darbar", ratio: "16:9", w: 1600, h: 900 },
      { seed: "swami-3", title: "Swami — Blessing Hand", ratio: "4:5", w: 960, h: 1200 },
      { seed: "swami-4", title: "Swami — Peepal Tree", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "swami-5", title: "Swami — Night Aarti", ratio: "3:4", w: 900, h: 1200 },
      { seed: "swami-6", title: "Swami — Bhakt Mandali", ratio: "16:10", w: 1600, h: 1000 },
    ],
  },
  {
    id: "ganesh",
    name: "Shri Ganesh",
    dev: "॥ श्री गणेशाय नमः ॥",
    seed: "ganesh",
    images: [
      { seed: "ganesh-1", title: "Marble Ganesh — 12 inch", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-2", title: "Brass Ganesh Laddoo", ratio: "4:5", w: 960, h: 1200 },
      { seed: "ganesh-3", title: "Ganesh — Modak Blessing", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "ganesh-4", title: "Ganesh Utsav Palkhi", ratio: "16:9", w: 1600, h: 900 },
      { seed: "ganesh-5", title: "Ganesh — Silver Idol", ratio: "2:3", w: 800, h: 1200 },
      { seed: "ganesh-6", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "hanuman",
    name: "Shri Hanuman",
    dev: "॥ जय हनुमान ॥",
    seed: "hanuman",
    images: [
      { seed: "hanuman-1", title: "Hanuman — Gada Pose", ratio: "3:4", w: 900, h: 1200 },
      { seed: "hanuman-2", title: "Hanuman — Chalisa", ratio: "4:5", w: 960, h: 1200 },
      { seed: "hanuman-3", title: "Hanuman — Saffron Flag", ratio: "16:9", w: 1600, h: 900 },
      { seed: "hanuman-4", title: "Hanuman — Mountain Temple", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "hanuman-5", title: "Hanuman — Bhakti Aura", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "krishna",
    name: "Shri Krishna",
    dev: "॥ राधे कृष्ण ॥",
    seed: "krishna",
    images: [
      { seed: "krishna-1", title: "Krishna — Flute Divine", ratio: "3:4", w: 900, h: 1200 },
      { seed: "krishna-2", title: "Radha Krishna — Brass", ratio: "4:5", w: 960, h: 1200 },
      { seed: "krishna-3", title: "Krishna — Peacock Crown", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "krishna-4", title: "Krishna — Vrindavan", ratio: "16:9", w: 1600, h: 900 },
      { seed: "krishna-5", title: "Krishna — Butter Thief", ratio: "2:3", w: 800, h: 1200 },
      { seed: "krishna-6", title: "Krishna — Gita Updesh", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "lakshmi",
    name: "Shri Lakshmi",
    dev: "॥ श्री महालक्ष्म्यै नमः ॥",
    seed: "lakshmi",
    images: [
      { seed: "lakshmi-1", title: "Silver Laxmi Ganesh", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "lakshmi-2", title: "Laxmi — Kamal Asana", ratio: "3:4", w: 900, h: 1200 },
      { seed: "lakshmi-3", title: "Laxmi — Gold Coins", ratio: "4:5", w: 960, h: 1200 },
      { seed: "lakshmi-4", title: "Laxmi — Diwali Altar", ratio: "16:9", w: 1600, h: 900 },
      { seed: "lakshmi-5", title: "Laxmi — Temple Brass", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
];