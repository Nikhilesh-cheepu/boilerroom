export type EventItem = {
  id: string;
  title: string;
  dateLabel: string;
  room: string;
  genre: string;
  gradient: string;
};

export type DJItem = {
  id: string;
  name: string;
  tags: string[];
  gradient: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  note?: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

export const siteCopy = {
  name: "Boiler Room",
  tagline: "Sound system loud. Kitchen open late.",
  heroSub:
    "Tonight’s lineup, residents, food & bottle list — scroll like a setlist.",
};

export const featuredEvents: EventItem[] = [
  {
    id: "e1",
    title: "Pressure Fridays",
    dateLabel: "Fri · Apr 25 · 10pm",
    room: "Main room",
    genre: "UKG / bass",
    gradient: "from-fuchsia-950 via-violet-900 to-black",
  },
  {
    id: "e2",
    title: "Afters Society",
    dateLabel: "Sat · Apr 26 · 11pm",
    room: "Basement",
    genre: "Techno",
    gradient: "from-red-950 via-rose-900 to-black",
  },
  {
    id: "e3",
    title: "Sunset Sessions",
    dateLabel: "Sun · Apr 27 · 6pm",
    room: "Terrace",
    genre: "House / disco",
    gradient: "from-amber-950 via-orange-900 to-black",
  },
  {
    id: "e4",
    title: "All Night Long",
    dateLabel: "Thu · May 1 · 9pm",
    room: "Main room",
    genre: "Open format",
    gradient: "from-cyan-950 via-blue-950 to-black",
  },
];

export const residents: DJItem[] = [
  {
    id: "d1",
    name: "Nina K",
    tags: ["House", "Vocal"],
    gradient: "from-pink-900 to-purple-950",
  },
  {
    id: "d2",
    name: "Jules 404",
    tags: ["UKG", "2-step"],
    gradient: "from-emerald-900 to-teal-950",
  },
  {
    id: "d3",
    name: "MARCUS",
    tags: ["Techno", "Peak-time"],
    gradient: "from-neutral-700 to-neutral-950",
  },
  {
    id: "d4",
    name: "Yuki",
    tags: ["Disco", "Edits"],
    gradient: "from-yellow-900 to-amber-950",
  },
];

export const weeklyRhythm = [
  { day: "Thu", vibe: "Warm-up / locals", time: "9pm–3am" },
  { day: "Fri", vibe: "Peak night", time: "10pm–4am" },
  { day: "Sat", vibe: "Basement + main", time: "10pm–4am" },
  { day: "Sun", vibe: "Sunset → late", time: "6pm–2am" },
];

export const foodMenu: MenuCategory[] = [
  {
    id: "small",
    label: "Small plates",
    items: [
      { id: "f1", name: "Crispy squid", price: "$14", note: "yuzu aioli" },
      { id: "f2", name: "Charred broccolini", price: "$12", note: "chili + lemon" },
      { id: "f3", name: "Duck sliders", price: "$16", note: "hoisin · pickles" },
    ],
  },
  {
    id: "late",
    label: "Late night",
    items: [
      { id: "f4", name: "Smash burger", price: "$18" },
      { id: "f5", name: "Truffle fries", price: "$11" },
      { id: "f6", name: "Margherita slice", price: "$9" },
    ],
  },
];

export const drinksMenu: MenuCategory[] = [
  {
    id: "sig",
    label: "Signatures",
    items: [
      { id: "dr1", name: "Boiler Mule", price: "$16", note: "ginger · lime · mist" },
      { id: "dr2", name: "Smoke & Honey", price: "$17", note: "mezcal · citrus" },
      { id: "dr3", name: "Midnight Spritz", price: "$15", note: "berry · prosecco" },
    ],
  },
  {
    id: "classic",
    label: "Classics",
    items: [
      { id: "dr4", name: "Old Fashioned", price: "$16" },
      { id: "dr5", name: "Margarita", price: "$15" },
      { id: "dr6", name: "Negroni", price: "$15" },
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "q1",
    q: "ID & age",
    a: "21+ only. Physical ID required — photos on phones aren’t accepted at the door.",
  },
  {
    id: "q2",
    q: "Dress code",
    a: "Come correct: no sportswear or sandals in peak hours. Think club, not gym.",
  },
  {
    id: "q3",
    q: "Last entry",
    a: "Varies by night — typically 90 minutes before close. Check the event card.",
  },
  {
    id: "q4",
    q: "Tables & minimums",
    a: "Table bookings are subject to minimums on busy nights. WhatsApp us with date + headcount.",
  },
];
