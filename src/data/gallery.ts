export interface DeityImage {
  seed: string;
  id?: string; // ← real file ka naam (bina .png) — public/murti/<deity>/preview/<id>.png
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
  images: DeityImage[];
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
    id: "ganesh",
    name: "Shri Ganesh",
    dev: "॥ श्री गणेशाय नमः ॥",
    seed: "ganesh",
    images: [
      { seed: "ganesh-1", id: "gn-001", title: "Marble Ganesh — 12 inch", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-2", id: "gn-002", title: "Brass Ganesh Laddoo", ratio: "4:5", w: 960, h: 1200 },
      { seed: "ganesh-3", id: "gn-003", title: "Ganesh — Modak Blessing", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "ganesh-4", id: "gn-004", title: "Ganesh Utsav Palkhi", ratio: "16:9", w: 1600, h: 900 },
      { seed: "ganesh-5", id: "gn-005", title: "Ganesh — Silver Idol", ratio: "2:3", w: 800, h: 1200 },
      { seed: "ganesh-6", id: "gn-006", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-7", id: "gn-007", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-8", id: "gn-008", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-9", id: "gn-009", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-10", id: "gn-010", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-11", id: "gn-011", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-12", id: "gn-012", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
      { seed: "ganesh-12", id: "gn-013", title: "Ganesh — Temple Door", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "swami",
    name: "Shri Swami Samarth",
    dev: "॥ श्री स्वामी समर्थ ॥",
    seed: "swami",
    images: [
      { seed: "swami-1", id: "sw-001", title: "Swami Samarth — Meditation", ratio: "3:4", w: 900, h: 1200 },
      { seed: "swami-2", id: "sw-002", title: "Akkalkot Darbar", ratio: "16:9", w: 1600, h: 900 },
      { seed: "swami-3", id: "sw-003", title: "Swami — Blessing Hand", ratio: "4:5", w: 960, h: 1200 },
      { seed: "swami-4", id: "sw-004", title: "Swami — Peepal Tree", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "swami-5", id: "sw-005", title: "Swami — Night Aarti", ratio: "3:4", w: 900, h: 1200 },
      { seed: "swami-6", id: "sw-006", title: "Swami — Bhakt Mandali", ratio: "16:10", w: 1600, h: 1000 },
    ],
  },
  {
    id: "krishna",
    name: "Shri Krishna",
    dev: "॥ हरे कृष्ण हरे राम ॥",
    seed: "krishna",
    images: [
      { seed: "krishna-1", id: "kr-001", title: "Krishna — Flute Divine", ratio: "3:4", w: 900, h: 1200 },
      { seed: "krishna-2", id: "kr-002", title: "Krishna — Makhan Chor", ratio: "4:5", w: 960, h: 1200 },
      { seed: "krishna-3", id: "kr-003", title: "Krishna — Vrindavan", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "krishna-4", id: "kr-004", title: "Krishna — Govardhan", ratio: "16:9", w: 1600, h: 900 },
      { seed: "krishna-5", id: "kr-005", title: "Krishna — Radha Sang", ratio: "2:3", w: 800, h: 1200 },
      { seed: "krishna-6", id: "kr-006", title: "Krishna — Janmashtami", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "hanuman",
    name: "Shri Hanuman",
    dev: "॥ हनुमते नमः ॥",
    seed: "hanuman",
    images: [
      { seed: "hanuman-1", id: "hn-001", title: "Hanuman — Gada Veer", ratio: "3:4", w: 900, h: 1200 },
      { seed: "hanuman-2", id: "hn-002", title: "Hanuman — Chalisa Path", ratio: "4:5", w: 960, h: 1200 },
      { seed: "hanuman-3", id: "hn-003", title: "Hanuman — Sanjeevani", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "hanuman-4", id: "hn-004", title: "Hanuman — Dwaja Vandan", ratio: "16:9", w: 1600, h: 900 },
      { seed: "hanuman-5", id: "hn-005", title: "Hanuman — Bajrang Bali", ratio: "2:3", w: 800, h: 1200 },
      { seed: "hanuman-6", id: "hn-006", title: "Hanuman — Ram Bhakt", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
  {
    id: "lakshmi",
    name: "Shri Lakshmi",
    dev: "॥ श्रीं महालक्ष्म्यै नमः ॥",
    seed: "lakshmi",
    images: [
      { seed: "lakshmi-1", id: "lk-001", title: "Lakshmi — Padma Asana", ratio: "3:4", w: 900, h: 1200 },
      { seed: "lakshmi-2", id: "lk-002", title: "Lakshmi — Deepotsav", ratio: "4:5", w: 960, h: 1200 },
      { seed: "lakshmi-3", id: "lk-003", title: "Lakshmi — Gaja Lakshmi", ratio: "1:1", w: 1200, h: 1200 },
      { seed: "lakshmi-4", id: "lk-004", title: "Lakshmi — Ksheer Sagar", ratio: "16:9", w: 1600, h: 900 },
      { seed: "lakshmi-5", id: "lk-005", title: "Lakshmi — Varsha Mangal", ratio: "2:3", w: 800, h: 1200 },
      { seed: "lakshmi-6", id: "lk-006", title: "Lakshmi — Diwali Pooja", ratio: "3:4", w: 900, h: 1200 },
    ],
  },
];