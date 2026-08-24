export const site = {
  name: "BhaktiMedia.in",
  tagline: "Digital Devotion For Every Heart",
  description:
    "BhaktiMedia creates devotional videos, AI images, reels, posters, YouTube content, social media branding and spiritual digital experiences.",
  url: "https://bhaktimedia.in",
  email: "namaste@bhaktimedia.in",
  phone: "+91 98220 10800",
  address: "Akurdi, Pune, Maharashtra 411035, India",
  socials: {
    instagram: "https://instagram.com/bhaktimedia",
    youtube: "https://youtube.com/@bhaktimedia",
    facebook: "https://facebook.com/bhaktimedia",
    whatsapp: "https://wa.me/919822010800",
  },
};

export interface Service {
  key: string; title: string; desc: string; icon: string;
  tags?: string[]; featured?: boolean;
}
export const services: Service[] = [
  { key: "posters", title: "Devotional Posters", icon: "palette",
    desc: "Festival greetings, vruttipatrak and deity posters crafted with classical Indian aesthetics." },
  { key: "temple", title: "Temple Branding", icon: "landmark",
    desc: "Complete identity systems for mandirs � signage, trusts, events and print collateral." },
  { key: "youtube", title: "YouTube Management", icon: "youtube", featured: true,
    tags: ["Channel strategy", "Aarti livestreams", "SEO & analytics"],
    desc: "End-to-end channel care: planning, editing, thumbnails, SEO and community growth for bhakti channels." },
  { key: "ai", title: "AI Image Generation", icon: "sparkles", featured: true,
    tags: ["Custom deity styles", "4K upscaling", "Poster-ready art"],
    desc: "Ethically-crafted devotional artwork using custom-trained models, reviewed for cultural accuracy." },
  { key: "editing", title: "Video Editing", icon: "clapperboard",
    desc: "Cinematic aarti films, utsav aftermovies and devotional edits with soulful pacing." },
  { key: "reels", title: "Bhakti Reels", icon: "film",
    desc: "Scroll-stopping vertical devotion � hooks, transitions and trending devotional audio." },
  { key: "voice", title: "Voiceovers", icon: "mic",
    desc: "Warm, studio-grade narration in Marathi, Hindi, Sanskrit and English." },
  { key: "thumbs", title: "Thumbnail Design", icon: "image",
    desc: "High-CTR thumbnails tuned for spiritual audiences and YouTube's algorithm." },
  { key: "social", title: "Social Media", icon: "megaphone",
    desc: "Calendars, captions and community management for temples and creators." },
  { key: "web", title: "Website Design", icon: "globe",
    desc: "Fast, SEO-ready temple and creator websites built on modern stacks." },
];

export const deities = [
  { name: "Shri Datta", dev: "???? ????", quote: "?????? ??????, ?? ???? ??????", seed: "shri-datta-temple" },
  { name: "Shri Swami Samarth", dev: "???? ?????? ?????", quote: "?? ????, ?? ????, ??? ????", seed: "shri-swami-samarth" },
  { name: "Shri Ganesh", dev: "???? ????", quote: "????????? ?????? ????????? ??????", seed: "shri-ganesh-idol" },
  { name: "Shri Hanuman", dev: "???? ??????", quote: "?????? ???????????????", seed: "shri-hanuman-temple" },
  { name: "Shri Krishna", dev: "???? ?????", quote: "??? ??? ?? ??????? ???????????? ????", seed: "shri-krishna-flute" },
  { name: "Shri Lakshmi", dev: "???? ???????", quote: "??????????? ??????? ???????? ?????????", seed: "shri-lakshmi-lotus" },
];

export const galleryItems = [
  { seed: "ganesh-utsav-poster", title: "Ganesh Utsav Poster", cat: "Posters", w: 600, h: 800 },
  { seed: "kashi-vishwanath-aarti", title: "Kashi Vishwanath Aarti", cat: "Temples", w: 600, h: 420 },
  { seed: "radha-krishna-ai-art", title: "Radha Krishna � AI Art", cat: "AI Art", w: 600, h: 750 },
  { seed: "diwali-deepotsav", title: "Diwali Deepotsav", cat: "Festivals", w: 600, h: 600 },
  { seed: "hanuman-chalisa-poster", title: "Hanuman Chalisa Poster", cat: "Posters", w: 600, h: 850 },
  { seed: "gopuram-sunrise", title: "Gopuram at Sunrise", cat: "Temples", w: 600, h: 700 },
  { seed: "cosmic-mahadev-ai", title: "Cosmic Mahadev � AI Art", cat: "AI Art", w: 600, h: 800 },
  { seed: "navratri-garba-nights", title: "Navratri Garba Nights", cat: "Festivals", w: 600, h: 450 },
  { seed: "swami-samarth-vruttipatra", title: "Swami Samarth Vruttipatra", cat: "Posters", w: 600, h: 760 },
  { seed: "akurdi-ganesh-mandir", title: "Akurdi Ganesh Mandir", cat: "Temples", w: 600, h: 640 },
  { seed: "shri-datta-ai-portrait", title: "Shri Datta � AI Portrait", cat: "AI Art", w: 600, h: 820 },
  { seed: "janmashtami-celebration", title: "Janmashtami Celebration", cat: "Festivals", w: 600, h: 520 },
];

export const testimonials = [
  { seed: "trustee-ramesh", name: "Ramesh Kulkarni", role: "Trustee, Shri Ganesh Mandir, Pune",
    quote: "BhaktiMedia redesigned our temple's entire digital presence � aarti livestream graphics to festival posters. Devotees noticed immediately." },
  { seed: "creator-sneha", name: "Sneha Deshpande", role: "Creator, Bhakti Sagar (240K subs)",
    quote: "Our YouTube channel grew from 8K to 240K subscribers in one year. The thumbnails alone doubled our click-through rate." },
  { seed: "committee-ajay", name: "Ajay Patil", role: "Utsav Committee, Akurdi",
    quote: "The AI posters they created for our Utsav looked divine � every detail was respectful, accurate and beautiful." },
  { seed: "trust-meera", name: "Meera Joshi", role: "Temple Trust, Nashik",
    quote: "Professional, fast and deeply respectful of our traditions. The Marathi voiceovers gave me goosebumps." },
  { seed: "admin-vikram", name: "Vikram Bhosale", role: "Administrator, Datta Mandir",
    quote: "They handle our reels, posters and ads end-to-end. It feels like having a full creative team inside the trust." },
];

export const stats = [
  { value: 1000, suffix: "+", label: "Creative Designs", icon: "palette" },
  { value: 500, suffix: "+", label: "Videos Produced", icon: "film" },
  { value: 100, suffix: "+", label: "Happy Clients", icon: "heart" },
  { value: 25, suffix: "M+", label: "Total Views", icon: "eye" },
];

export const plans = [
  { dev: "????", name: "Aarti", price: 4999, featured: false,
    desc: "For creators beginning their digital seva.",
    features: ["8 devotional posters / month", "2 bhakti reels", "1 AI image pack", "Basic thumbnail design", "WhatsApp support"] },
  { dev: "?????", name: "Utsav", price: 11999, featured: true,
    desc: "For serious channels & growing temples.",
    features: ["20 posters + 8 reels / month", "Full YouTube management", "AI image generation", "Voiceovers (Marathi/Hindi)", "Thumbnail + social branding", "Priority support"] },
  { dev: "???????", name: "Mahayagya", price: 24999, featured: false,
    desc: "Complete digital temple & enterprise care.",
    features: ["Unlimited creative requests", "Temple website + branding", "Dedicated creative manager", "Ad campaign management", "Custom AI style models", "24�7 seva support"] },
];

export const reels = [
  { seed: "reel-ganpati-cinematic", title: "Ganpati Bappa Morya � Cinematic", views: "2.4M", likes: "184K" },
  { seed: "reel-swami-108-names", title: "Swami Samarth 108 Names", views: "1.1M", likes: "96K" },
  { seed: "reel-varanasi-aarti", title: "Morning Aarti at Varanasi", views: "3.8M", likes: "301K" },
  { seed: "reel-krishna-flute", title: "Krishna Flute Meditation", views: "920K", likes: "71K" },
  { seed: "reel-hanuman-kinetic", title: "Hanuman Chalisa � Kinetic Type", views: "1.6M", likes: "143K" },
  { seed: "reel-diwali-transition", title: "Diwali Diya Transition", views: "2.9M", likes: "228K" },
  { seed: "reel-temple-timelapse", title: "Temple Timelapse � Sunrise", views: "640K", likes: "48K" },
  { seed: "reel-datta-jayanti", title: "Datta Jayanti Special", views: "780K", likes: "59K" },
];

export const videos = [
  { seed: "video-swami-aarti-4k", title: "Shri Swami Samarth � Cinematic Aarti | 4K", duration: "12:48", views: "1.8M views", age: "3 months ago" },
  { seed: "video-ganesh-chalisa", title: "Ganesh Chalisa with Lyrics | Morning Special", duration: "08:21", views: "940K views", age: "5 months ago" },
  { seed: "video-temple-vlog", title: "Inside a 400-Year-Old Temple | Vlog", duration: "15:02", views: "620K views", age: "2 months ago" },
  { seed: "video-datta-bhajan", title: "Datta Bavani � Soulful Bhajan Session", duration: "21:37", views: "1.2M views", age: "7 months ago" },
  { seed: "video-diwali-bts", title: "Making of a Deepotsav Poster | Behind the Scenes", duration: "06:44", views: "310K views", age: "1 month ago" },
  { seed: "video-hanuman-documentary", title: "Hanuman: Strength & Surrender | Short Film", duration: "18:15", views: "2.3M views", age: "1 year ago" },
];


export const faqs = [
  { q: "Do you work with small village temples?", a: "Absolutely. Small mandirs and village trusts are our roots � they receive a 20% seva discount on every plan, and we happily tailor scope to modest budgets." },
  { q: "How fast do you deliver?", a: "Posters within 24�48 hours, reels in 3�5 days, and full temple branding projects in 2�3 weeks. Rush delivery is available during festival season." },
  { q: "Do you create content in Marathi, Hindi and English?", a: "Yes � copy, captions and studio voiceovers in all three languages, plus Sanskrit shloka pronunciation reviewed by scholars." },
  { q: "Is your AI art respectful of religious sentiments?", a: "Every AI piece follows our ethics-first pipeline: curated models, cultural review by temple advisors, and zero use of copyrighted deity photography for training." },
  { q: "Can I pause or cancel my plan?", a: "All plans are month-to-month. Pause for Chaturmas, cancel anytime � no lock-ins, no hard feelings." },
];

export const aiServices = [
  { icon: "wand", title: "Devotional AI Art", desc: "Poster-ready deity artwork in custom temple styles � traditional, cinematic or modern." },
  { icon: "voice", title: "AI Voiceovers", desc: "Warm synthetic voices tuned for aarti, abhang and narration in Marathi, Hindi & Sanskrit." },
  { icon: "layers", title: "Poster Upscaling", desc: "Restore and upscale old posters and trust archives to crisp 4K print quality." },
  { icon: "bot", title: "AI Avatar Anchors", desc: "Devotional news and utsav updates presented by consistent, friendly virtual anchors." },
  { icon: "sparkles", title: "Bhakti Copywriting", desc: "Captions, shlokas and scripts generated with AI, then hand-refined by our writers." },
  { icon: "brain", title: "Custom Style Models", desc: "Private models trained on your temple's art direction for a signature visual identity." },
];

export const marqueeItems = [
  "श्री गणेशाय नमः", "श्री दत्तात्रेयाय नमः", "श्री स्वामी समर्थाय नमः",
  "श्री कृष्णाय नमः", "हर हर महादेव", "जय श्री राम",
  "हरे कृष्ण हरे कृष्ण", "ॐ शान्तिः शान्तिः शान्तिः",
];
