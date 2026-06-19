/* ──────────────────────────────────────────────────────────────────────
   AWAKYNN — home page section data
   Used by the sell-page–style sections on the Awakynn homepage.
   ────────────────────────────────────────────────────────────────────── */

/* ─── Sister brands ─────────────────────────────────────────────── */
export type Brand = {
  id: string;
  name: string;
  display: string;
  tagline: string;
  category: string;
  description: string;
  preview: string;
  textOn: "light" | "dark";
  hero: string;
  href: string;
};

export const brands: Brand[] = [
  {
    id: "grabfabs",
    name: "GrabFabs",
    display: "GRABFABS",
    tagline: "Nourish",
    category: "Healthy Food",
    description:
      "Nourishment that aligns with your wellness journey. Clean, conscious food crafted for bodies that are waking up.",
    preview: "Wholesome meals and snacks rooted in Ayurvedic nutrition principles.",
    textOn: "dark",
    hero: "https://cdn.awakynn.com/grabfabs.avif",
    href: "https://grabfabs.com",
  },
  {
    id: "festiq",
    name: "Festiq",
    display: "FESTIQ",
    tagline: "Indulge",
    category: "Artisan Chocolates",
    description:
      "Chocolate as celebration, not guilt. Festiq brings the ritual of sweetness back to life — mindfully made.",
    preview: "Artisan chocolates that honour your body while delighting your senses.",
    textOn: "dark",
    hero: "https://cdn.awakynn.com/festiq.avif",
    href: "https://festiq.com",
  },
  {
    id: "estra",
    name: "Estra Ritual",
    display: "ÉSTRÁ RITUAL",
    tagline: "Glow",
    category: "Skin Care",
    description:
      "A skincare line rooted in ritual. Ingredients that honour your skin the way Ayurveda has honoured the body for centuries.",
    preview: "Botanical formulas and ritual objects for unhurried self-care.",
    textOn: "dark",
    hero: "https://cdn.awakynn.com/estra_ritual.avif",
    href: "https://estraritual.com",
  },
];

/* ─── Horizontal journey chapters ─────────────────────────────── */
export const chapters = [
  {
    id: "movement",
    index: "01",
    kicker: "Movement",
    brand: "AWAKYNN",
    title: "The body remembers how to be still.",
    body: "Begin where the day begins. Breath-led asana and guided training that restores range, releases tension, and returns you to your own rhythm — regardless of age or experience.",
    bg: "#2F4F46",
    fg: "#FAF8F5",
    image: "https://cdn.awakynn.com/about_bg.avif",
  },
  {
    id: "breath",
    index: "02",
    kicker: "Breath & Stillness",
    brand: "AWAKYNN",
    title: "Stillness is not absence — it is the deepest presence.",
    body: "Pranayama and meditation practices drawn from classical Yogic tradition. A technology of the mind, made practical for modern life — available every Tuesday and Friday evening.",
    bg: "#C8A86B",
    fg: "#222222",
    image: "https://cdn.awakynn.com/offer_meditation.avif",
  },
  {
    id: "nourish",
    index: "03",
    kicker: "Nourishment",
    brand: "AWAKYNN",
    title: "Food as medicine, meal as ritual.",
    body: "Personalised Ayurvedic dietary guidance that reads your constitution and builds a sustainable, joyful relationship with food — no restriction, only alignment.",
    bg: "#3B312B",
    fg: "#FAF8F5",
    image: "https://cdn.awakynn.com/offer_diet.avif",
  },
];

/* ─── Daily wellness pathway ───────────────────────────────────── */
export const pathway = [
  {
    time: "06:30",
    title: "Morning Practice",
    brand: "AWAKYNN",
    note: "A breath-led asana flow to open the body before the world arrives.",
    image: "https://cdn.awakynn.com/offer_yoga.avif",
  },
  {
    time: "08:30",
    title: "Conscious Breakfast",
    brand: "GrabFabs",
    note: "A nourishing meal aligned with your Ayurvedic constitution.",
    image: "https://cdn.awakynn.com/grabfabs.avif",
  },
  {
    time: "20:30",
    title: "Breath & Meditation",
    brand: "AWAKYNN",
    note: "Pranayama and seated stillness to release the weight of the day.",
    image: "https://cdn.awakynn.com/offer_meditation.avif",
  },
  {
    time: "21:30",
    title: "Evening Ritual",
    brand: "Éstrá Ritual",
    note: "A slow skincare ceremony to close the day with intention.",
    image: "https://cdn.awakynn.com/estra_ritual.avif",
  },
];

/* ─── Offerings gallery ────────────────────────────────────────── */
export const offerings = [
  {
    name: "Yoga — Asana & Pranayama",
    house: "AWAKYNN",
    note: "Movement & Breath",
    price: "₹1,200/mo",
    depth: 0,
    image: "https://cdn.awakynn.com/offer_yoga.avif",
  },
  {
    name: "Breathing & Meditation",
    house: "AWAKYNN",
    note: "Inner Stillness",
    price: "₹1,200/mo",
    depth: 1,
    image: "https://cdn.awakynn.com/offer_meditation.avif",
  },
  {
    name: "Ayurvedic Diet Consulting",
    house: "AWAKYNN",
    note: "Nourishment",
    price: "₹600",
    depth: 2,
    image: "https://cdn.awakynn.com/offer_diet.avif",
  },
  {
    name: "1-on-1 Clarity Session",
    house: "AWAKYNN",
    note: "Personal Growth",
    price: "₹600",
    depth: 1,
    image: "https://cdn.awakynn.com/offer_one_on_one.avif",
  },
  {
    name: "Sunday Workshop",
    house: "AWAKYNN",
    note: "Community Practice",
    price: "₹49",
    depth: 1,
    image: "https://cdn.awakynn.com/offer_workshop.avif",
  },
  {
    name: "Morning Ritual Bundle",
    house: "AWAKYNN",
    note: "Yoga + Breath + Diet",
    price: "Custom",
    depth: 2,
    image: "https://cdn.awakynn.com/mission.avif",
  },
];

/* ─── Journal posts ────────────────────────────────────────────── */
export type JournalPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  read: string;
  size: "lg" | "md" | "sm";
  image: string;
  author: string;
  date: string;
  body: string[];
};

export const journal: JournalPost[] = [
  {
    slug: "slow-morning-practice",
    tag: "Movement",
    title: "On the quiet power of a slow morning practice",
    excerpt:
      "Before the inbox, before the noise — a few breaths on the mat can reset the entire shape of a day.",
    read: "6 min",
    size: "lg",
    image: "https://cdn.awakynn.com/about_bg.avif",
    author: "Awakynn Studio",
    date: "May 2026",
    body: [
      "There is a particular quality to the first hour of the morning — soft, unclaimed, entirely your own. Most of us spend it reaching for a phone. But the body, freshly woken, is asking for something else: movement that listens rather than demands.",
      "A slow morning practice is not about intensity. It is about arriving. The breath comes first — three deep inhalations, each one a small permission to be here. The spine follows, unravelling from wherever sleep left it. A forward fold. A gentle twist. Nothing performed, nothing rushed.",
      "What happens in those first quiet asanas is largely invisible — a settling of the nervous system, a warmth returning to tissues that stiffened overnight, a gradual orientation of the mind toward the body it inhabits. By the time you stand at the end, the world has not changed. But you have.",
      "The research is clear: morning movement — even fifteen minutes — lowers cortisol, sharpens attention, and improves emotional regulation through the hours ahead. But Awakynn's tradition reaches for a deeper logic than productivity. We practice in the morning because the morning is honest. There is no performance left in us. We meet the mat as we actually are.",
      "Try this: tomorrow, before anything else, roll out your mat and simply breathe for two minutes. Do not count. Do not optimise. Let the breath be imperfect. Then let whatever movement wants to happen, happen. You may be surprised how little that is — and how enough it is.",
    ],
  },
  {
    slug: "why-ayurveda-matters",
    tag: "Nourishment",
    title: "Why Ayurveda still matters in modern life",
    excerpt:
      "Ancient India developed a complete science of living. We are only now beginning to understand why it was right.",
    read: "5 min",
    size: "md",
    image: "https://cdn.awakynn.com/offer_diet.avif",
    author: "Awakynn Studio",
    date: "April 2026",
    body: [
      "Ayurveda is five thousand years old. It predates the germ theory of disease, modern nutrition science, and the concept of the microbiome. And yet, increasingly, its principles read less like ancient wisdom and more like cutting-edge research findings arriving a few millennia late.",
      "The core insight is this: there is no single diet, no single sleep schedule, no single way of moving that is right for every body. Each person has a constitution — a particular ratio of the three doshas, Vata, Pitta, and Kapha — that determines what nourishes them and what disturbs them. Modern personalised medicine is slowly, expensively rediscovering this.",
      "At Awakynn, our dietary consulting begins not with a food list but with a conversation. What is your energy like in the morning? When do you feel most restless? How does your digestion respond to cold food, to stress, to the change of seasons? These questions sound qualitative, almost poetic. But they point toward something precise: an understanding of your body's particular rhythms.",
      "Ayurveda also insists on the role of fire — agni, the digestive capacity — as the foundation of health. You can eat the most nutritious food in the world, but if your digestive fire is low, it will not nourish you. This is why Ayurvedic guidance often begins not with what to eat but with when and how: warm meals, eaten without distraction, at consistent times, in sufficient quiet.",
      "None of this is difficult. Most of it, once understood, feels obvious. That is the hallmark of wisdom that has been tested by generations: it stops sounding ancient and starts sounding simply true.",
    ],
  },
  {
    slug: "art-of-breathing",
    tag: "Breathwork",
    title: "The forgotten art of breathing well",
    excerpt:
      "We breathe twenty thousand times a day and almost none of those breaths are conscious. What if even a few of them were?",
    read: "4 min",
    size: "sm",
    image: "https://cdn.awakynn.com/offer_meditation.avif",
    author: "Awakynn Studio",
    date: "March 2026",
    body: [
      "The breath is the only autonomic function we can also control voluntarily. The heart beats without our instruction. Digestion proceeds without our knowledge. But the breath — the breath we can reach into and reshape, and in doing so, reshape ourselves.",
      "Pranayama, the Yogic science of breath, is not a relaxation technique. It is a technology. Specific patterns of inhalation, retention, and exhalation produce measurable changes in the nervous system: a long exhale activates the parasympathetic response; breath retention builds CO₂ tolerance and improves oxygen delivery; alternate nostril breathing synchronises the two hemispheres of the brain.",
      "In our Tuesday and Friday evening sessions, we begin with ten minutes of silent observation — simply watching the natural breath, without altering it. This alone is harder than it sounds. The mind wanders. The breath becomes self-conscious and irregular. But gradually, something settles. The breath becomes a thread you can hold.",
      "Then we work. Nadi Shodhana. Bhramari. Simple extended exhalation. Each practice with a different aim, a different quality of attention. By the end of forty-five minutes, the room has a stillness to it that is different from silence — it is the stillness of twenty people who have, for a short while, remembered how to arrive in their own bodies.",
      "You do not need to attend a class to begin. Tonight, before sleep, breathe in for four counts, hold for four, and breathe out for eight. Do this five times. Notice what changes.",
    ],
  },
  {
    slug: "discipline-as-love",
    tag: "Philosophy",
    title: "Discipline is not a cage — it is the river that finds the sea",
    excerpt:
      "We have been taught to think of discipline as restriction. Awakynn asks: what if it were the deepest form of care?",
    read: "7 min",
    size: "sm",
    image: "https://cdn.awakynn.com/mission.avif",
    author: "Awakynn Studio",
    date: "February 2026",
    body: [
      "Most of us came to discipline through punishment — through deadlines, through shame, through the fear of falling behind. This version of discipline is exhausting because it runs entirely on anxiety. It works until it doesn't, and when it stops working, we call ourselves failures.",
      "Awakynn was built around a different premise. Discipline, in the Yogic tradition, is not self-denial. It is tapas — the gentle, consistent heat of practice. A fire that burns not to destroy but to refine. The image that stays with us is a river: water that knows exactly where it is going, that bends around obstacles without losing momentum, that carves stone not through violence but through patient presence.",
      "What does this look like in practice? It looks like showing up on a Tuesday evening when you are tired. Not because you have to, but because you have learned — slowly, over months — that the mat is where you become more yourself, not less. It looks like cooking a warm meal at noon even when a cold sandwich is faster, because you understand now that nourishment is not a luxury. It looks like sleeping at a consistent hour, not because a productivity guru told you to, but because your body has taught you, through direct experience, what rest actually is.",
      "The secret Awakynn holds is this: when discipline emerges from love of the self rather than fear of failure, it stops feeling like discipline at all. It becomes something closer to ritual — a set of gestures that affirm, daily, that your life is worth tending.",
      "We are not selling motivation. Motivation is weather: it comes and goes, reliable as nothing. We are building systems so embedded in your life that they become invisible, automatic, joyful. The river does not decide each morning to flow toward the sea. It simply flows.",
      "This is what we mean when we say Awakynn is not a gym or an institution. It is a practice. And a practice, properly understood, is a long love affair with becoming.",
    ],
  },
];

