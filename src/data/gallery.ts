export interface GalleryImage {
  seed: string; w: number; h: number; title: string; ratio: string;
}
export interface DeityCategory {
  id: string; name: string; dev: string; seed: string; images: GalleryImage[];
}

export const deityGallery: DeityCategory[] = [
  {
    id: "datta", name: "Shri Datta", dev: "श्री दत्त", seed: "shri-datta-temple",
    images: [
      { seed: "datta-mandir-sunrise", w: 600, h: 800, title: "Datta Mandir Sunrise", ratio: "3:4" },
      { seed: "datta-avtar-kala", w: 640, h: 640, title: "Datta Avtar Art", ratio: "1:1" },
      { seed: "datta-jayanti-utsav", w: 800, h: 450, title: "Datta Jayanti Utsav", ratio: "16:9" },
      { seed: "datta-paduka-pooja", w: 600, h: 1000, title: "Paduka Pooja", ratio: "3:5" },
      { seed: "datta-guru-charitra", w: 600, h: 750, title: "Guru Charitra", ratio: "4:5" },
      { seed: "datta-deepam-evening", w: 800, h: 500, title: "Sandhya Deepam", ratio: "16:10" },
    ],
  },
  {
    id: "swami", name: "Shri Swami Samarth", dev: "श्री स्वामी समर्थ", seed: "shri-swami-samarth",
    images: [
      { seed: "swami-samarth-portrait", w: 600, h: 800, title: "Swami Samarth Portrait", ratio: "3:4" },
      { seed: "swami-akrapur-math", w: 800, h: 450, title: "Akrapur Math", ratio: "16:9" },
      { seed: "swami-bhakti-art", w: 640, h: 640, title: "Bhakti Art", ratio: "1:1" },
      { seed: "swami-vruttipatra", w: 600, h: 750, title: "Vruttipatra", ratio: "4:5" },
      { seed: "swami-temple-lamp", w: 600, h: 1000, title: "Temple Lamp", ratio: "3:5" },
      { seed: "swami-aarti-morning", w: 800, h: 500, title: "Pratah Aarti", ratio: "16:10" },
    ],
  },
  {
    id: "ganesh", name: "Shri Ganesh", dev: "श्री गणेश", seed: "shri-ganesh-idol",
    images: [
      { seed: "ganesh-idol-festival", w: 600, h: 800, title: "Ganesh Idol", ratio: "3:4" },
      { seed: "ganesh-chaturthi-murti", w: 640, h: 640, title: "Chaturthi Murti", ratio: "1:1" },
      { seed: "ganesh-utsav-pandal", w: 800, h: 450, title: "Utsav Pandal", ratio: "16:9" },
      { seed: "ganesh-ashtavinayak", w: 600, h: 750, title: "Ashtavinayak Darshan", ratio: "4:5" },
      { seed: "ganesh-modak-naivedya", w: 600, h: 1000, title: "Modak Naivedya", ratio: "3:5" },
      { seed: "ganesh-temple-morning", w: 800, h: 500, title: "Temple Morning", ratio: "16:10" },
    ],
  },
  {
    id: "hanuman", name: "Shri Hanuman", dev: "श्री हनुमान", seed: "shri-hanuman-temple",
    images: [
      { seed: "hanuman-statue-sunset", w: 600, h: 800, title: "Hanuman Statue Sunset", ratio: "3:4" },
      { seed: "hanuman-chalisa-art", w: 640, h: 640, title: "Chalisa Art", ratio: "1:1" },
      { seed: "hanuman-temple-flag", w: 800, h: 450, title: "Temple Flag", ratio: "16:9" },
      { seed: "hanuman-bajrangbali", w: 600, h: 750, title: "Bajrangbali", ratio: "4:5" },
      { seed: "hanuman-gada-symbol", w: 600, h: 1000, title: "Gada Symbol", ratio: "3:5" },
      { seed: "hanuman-aarti-flame", w: 800, h: 500, title: "Aarti Flame", ratio: "16:10" },
    ],
  },
  {
    id: "krishna", name: "Shri Krishna", dev: "श्री कृष्ण", seed: "shri-krishna-flute",
    images: [
      { seed: "krishna-flute-vrindavan", w: 600, h: 800, title: "Flute of Vrindavan", ratio: "3:4" },
      { seed: "krishna-peacock-crown", w: 640, h: 640, title: "Peacock Crown", ratio: "1:1" },
      { seed: "krishna-janmashtami", w: 800, h: 450, title: "Janmashtami", ratio: "16:9" },
      { seed: "krishna-radha-prem", w: 600, h: 750, title: "Radha Krishna Prem", ratio: "4:5" },
      { seed: "krishna-makhan-chor", w: 600, h: 1000, title: "Makhan Chor", ratio: "3:5" },
      { seed: "krishna-gita-updesh", w: 800, h: 500, title: "Gita Updesh", ratio: "16:10" },
    ],
  },
  {
    id: "lakshmi", name: "Shri Lakshmi", dev: "श्री लक्ष्मी", seed: "shri-lakshmi-lotus",
    images: [
      { seed: "lakshmi-lotus-divine", w: 600, h: 800, title: "Lotus Divine", ratio: "3:4" },
      { seed: "lakshmi-diwalipooja", w: 640, h: 640, title: "Diwali Pooja", ratio: "1:1" },
      { seed: "lakshmi-temple-gold", w: 800, h: 450, title: "Golden Temple", ratio: "16:9" },
      { seed: "lakshmi-shree-yantra", w: 600, h: 750, title: "Shree Yantra", ratio: "4:5" },
      { seed: "lakshmi-haldi-kumkum", w: 600, h: 1000, title: "Haldi Kumkum", ratio: "3:5" },
      { seed: "lakshmi-rangoli-deep", w: 800, h: 500, title: "Rangoli & Deep", ratio: "16:10" },
    ],
  },
];