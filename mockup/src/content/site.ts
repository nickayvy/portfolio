/**
 * Single source of truth for every piece of copy and data on the site.
 * Facts come from the current nickayy.dev site and Nick's résumé.
 * Anything marked PLACEHOLDER is stand-in copy for Nick to replace.
 * Components must read from here instead of hardcoding copy.
 */

export const person = {
  name: "Nick Nguyen",
  fullName: "Nicholas Nguyen",
  shortName: "Nick",
  role: "Software Engineer",
  tagline: "Nick makes things.",
  location: "San Diego, CA",
  timeZone: "America/Los_Angeles",
  email: "hello@nickayy.dev",
  currentSite: "https://nickayy.dev",
  github: { label: "GitHub", handle: "@nickayvy", href: "https://github.com/nickayvy" },
  linkedin: {
    label: "LinkedIn",
    handle: "Nicholas Nguyen",
    href: "https://www.linkedin.com/in/nicholas-nguyen-445a29249",
  },
} as const;

export const meta = {
  title: "Nick Nguyen — Software Engineer",
  description:
    "Nick Nguyen is a software engineer in San Diego who makes things: data pipelines, automation platforms and the occasional cat-shaped animation.",
};

/** Header navigation. `Say hello` replaces the reference site's call-booking link. */
export const nav = {
  primary: [
    { label: "Work", href: "/#work" },
    { label: "Playground", href: "/playground" },
    { label: "About", href: "/#intro" },
  ],
  actions: [
    { label: "Say hello", href: "mailto:hello@nickayy.dev", cursor: "Let’s talk" },
    { label: "Résumé", href: "/resume" },
  ],
} as const;

/** Right-edge section progress indicator on the home page. */
export const sections = [
  { id: "intro", label: "About me" },
  { id: "work", label: "Featured projects" },
  { id: "experience", label: "Experience" },
  { id: "clients", label: "Worked with" },
  { id: "testimonials", label: "Kind words" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Say hello" },
] as const;

/** Hero greeting cycles through these, one every ~2.6s. */
export const greetings = [
  { word: "Hello", language: "English" },
  { word: "Xin chào", language: "Tiếng Việt" },
  { word: "Hola", language: "Español" },
  { word: "こんにちは", language: "日本語" },
  { word: "Bonjour", language: "Français" },
  { word: "你好", language: "中文" },
  { word: "Ciao", language: "Italiano" },
  { word: "Meow", language: "Cat" },
] as const;

export type DoodleName =
  | "rocket"
  | "wrench"
  | "bowl"
  | "cap"
  | "terminal"
  | "cat"
  | "gear"
  | "stream";

/**
 * Intro paragraphs as rich-text tokens so inline doodles and links sit mid-sentence.
 * Each word reveals with a stagger (see spec §Intro).
 */
export type IntroToken =
  | string
  | { doodle: DoodleName }
  | { link: string; href: string };

export const intro: IntroToken[][] = [
  [
    "I’m Nick, a software engineer in San Diego. I make things, most recently an Instagram growth platform at Aesthetic AI that watches 1,200+ creator accounts and processes 54,000 posts a month. ",
    { link: "Some of my favourite work is just below", href: "#work" },
    ".",
  ],
  [
    "Since 2022 I’ve kept systems running at Coastal Payroll ",
    { doodle: "wrench" },
    ", shipped storefronts and LLM pipelines at a pre-seed startup ",
    { doodle: "rocket" },
    " and helped run my family’s restaurant, Minh Ky ",
    { doodle: "bowl" },
    ". I’m finishing my computer science degree at San Diego State ",
    { doodle: "cap" },
    ", so I care how things work as much as what they do.",
  ],
  [
    "These days I’m happiest in TypeScript and Python, somewhere between a Kafka consumer ",
    { doodle: "stream" },
    " and a React component. When I’m not at my desk, you’ll probably find me behind the counter at the restaurant, tinkering with a BSD box ",
    { doodle: "terminal" },
    " or being supervised by my two cats ",
    { doodle: "cat" },
    ". The odd experiments end up in my ",
    { link: "playground", href: "/playground" },
    ".",
  ],
];

export const cta = {
  label: "Let’s work together",
  href: "mailto:hello@nickayy.dev",
  cursor: "Let’s talk",
  /** PLACEHOLDER: availability line. Confirm wording with Nick. */
  status: "Open to full-time software engineering roles",
};

/** The pinned paper note beside the CTA. */
export const pinnedNote = {
  label: "Most recently building at",
  company: "Aesthetic AI",
  /** two-letter monogram drawn in the red square badge */
  monogram: "A",
};

/** Hero photo stack. PLACEHOLDER prints: illustrated cards until Nick supplies photos. */
export const photoStack = [
  { id: "desk", caption: "At the desk", tone: "ink" },
  { id: "mizu", caption: "Mizu, supervising", tone: "blue" },
  { id: "tux", caption: "The sleepy one", tone: "ink" },
  { id: "restaurant", caption: "Behind the counter at Minh Ky", tone: "red" },
  { id: "sd", caption: "San Diego", tone: "blue" },
] as const;

export type Project = {
  slug: string;
  title: string;
  /** shown under the card title, dot-separated */
  tags: string[];
  summary: string;
  role: string;
  context: string;
  stack: string[];
  results: string;
  /** number of cover slides the card cycles through on hover */
  slides: number;
  /** palette hint for the generated cover art */
  tone: "green" | "ink" | "blue" | "red" | "paper";
  /** résumé facts. Case study copy must not invent numbers beyond these. `stack` lists only what the résumé names. */
  facts: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "creator-growth",
    title: "Creator Growth Engine",
    tags: ["Automation", "Data Pipeline"],
    summary:
      "An Instagram growth automation platform that watches creator accounts at scale and turns what it sees into app traffic.",
    role: "Software Engineer Intern",
    context: "Aesthetic AI",
    stack: ["Instagram automation", "Data pipeline"],
    results: "1,200+ accounts monitored, 54,000 posts a month, 90% lower operating cost",
    slides: 4,
    tone: "green",
    facts: [
      "Aesthetic AI is a pre-seed consumer startup: $1.5M raised at a $10M valuation, 100,000+ users.",
      "Architected and shipped an Instagram growth automation platform monitoring 1,200+ creator accounts.",
      "Processes 54,000 posts per month to drive app traffic.",
      "Brought operational costs down by 90%.",
    ],
    links: [],
  },
  {
    slug: "stock-pipeline",
    title: "Real-Time Stock Pipeline",
    tags: ["Python", "FastAPI", "Kafka"],
    summary:
      "An event-driven pipeline that streams simulated stock ticks through Kafka into a sharded store, behind a rate-limited gateway.",
    role: "Design and build",
    context: "Personal project",
    stack: ["Python", "FastAPI", "Kafka", "Docker", "Nginx"],
    results: "Idempotent consumers, deterministic shard routing, per-IP rate limiting",
    slides: 4,
    tone: "ink",
    facts: [
      "Event-driven ingestion pipeline using Kafka to stream simulated stock ticks into a sharded storage layer.",
      "Idempotent consumers commit offsets only after successful writes.",
      "Deterministic shard routing (hash-mod-N) across in-memory shards, with unit-tested distribution.",
      "Key-prefix routing for users, picks and price data.",
      "FastAPI service fronted by an Nginx API gateway enforcing per-IP rate limiting and reverse-proxy routing.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/nickayvy" }],
  },
  {
    slug: "unix-lab",
    title: "Self-Hosted Unix Network",
    tags: ["OpenBSD", "FreeBSD", "LDAP"],
    summary:
      "A multi-host Unix lab with its own DNS, directory, shared home directories, certificate authority and mail.",
    role: "Design and build",
    context: "Personal project",
    stack: ["OpenBSD", "FreeBSD", "Linux", "BIND", "OpenLDAP", "NFS"],
    results: "One directory login across every host, TLS everywhere, working mail",
    slides: 3,
    tone: "blue",
    facts: [
      "Multi-host Unix lab with internal DNS (BIND).",
      "LDAP authentication with OpenLDAP and sssd.",
      "Shared home directories over NFS.",
      "A private CA issuing TLS certificates for inter-service auth.",
      "FreeBSD mail server (sendmail + dovecot) integrated with the lab's LDAP directory and CA.",
      "Any directory user can send mail between hosts and read it over TLS-encrypted IMAP from a desktop client.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/nickayvy" }],
  },
  {
    slug: "class-assistant",
    title: "Class Registration Assistant",
    tags: ["TypeScript", "Chrome Extension"],
    summary:
      "A Chrome extension that puts professor ratings directly inside the class registration screen.",
    role: "Design and build",
    context: "Personal project",
    stack: ["TypeScript", "Chrome Extension (Manifest V3)", "GraphQL"],
    results: "27% less time spent registering",
    slides: 3,
    tone: "red",
    facts: [
      "Chrome extension (Manifest V3) written in TypeScript.",
      "Injects RateMyProfessors ratings directly into the CSUF class registration UI via a GraphQL API.",
      "Reduced time spent registering by 27%.",
    ],
    links: [{ label: "GitHub", href: "https://github.com/nickayvy" }],
  },
  {
    slug: "creator-storefront",
    title: "Creator Storefront",
    tags: ["Commerce APIs", "Analytics", "LLM Pipeline"],
    summary:
      "The launch of creator storefronts: rebuilt checkout APIs, analytics across web and serverless, and a catalog cleaned up by a multimodal LLM.",
    role: "Software Engineer Intern",
    context: "Aesthetic AI",
    stack: ["Commerce APIs", "Serverless", "PostHog", "Multimodal LLMs"],
    results: "Storefront launch shipped with GMV, subscriber and per-merchant conversion tracking",
    slides: 4,
    tone: "paper",
    facts: [
      "Shipped the creator storefront launch.",
      "Rebuilt checkout commerce APIs.",
      "Instrumented PostHog analytics across web and serverless for GMV, subscribers and per-merchant conversion.",
      "Built a multimodal LLM pipeline to standardize product descriptions across an entire commerce catalog.",
    ],
    links: [],
  },
];

export const experience = [
  { company: "Aesthetic AI", role: "Software Engineer Intern", start: "Jan 2026", end: "May 2026" },
  { company: "Minh Ky Restaurant", role: "Co-Owner", start: "Oct 2023", end: "Present" },
  { company: "Coastal Payroll Services", role: "IT Intern", start: "Dec 2022", end: "Jun 2024" },
  { company: "San Diego State University", role: "B.S. Computer Science", start: "Aug 2024", end: "Dec 2026" },
  { company: "San Diego Miramar College", role: "A.S.-T Computer Science", start: "Jan 2021", end: "Jun 2024" },
] as const;

/**
 * "Worked with" dashed grid. PLACEHOLDER wordmarks: drawn typographically in muted ink,
 * not the organisations' real logos. `style` picks one of the wordmark treatments.
 */
export const clients = {
  heading: "Companies & schools I’ve worked with",
  items: [
    { name: "Aesthetic AI", wordmark: "aesthetic", style: "serif", current: false },
    { name: "Minh Ky Restaurant", wordmark: "MINH KY", style: "condensed", current: true },
    { name: "Coastal Payroll", wordmark: "coastal.", style: "round", current: false },
    { name: "San Diego State University", wordmark: "SDSU", style: "slab", current: true },
    { name: "San Diego Miramar College", wordmark: "Miramar", style: "script", current: false },
  ],
  seat: { title: "This seat’s saved for you.", cta: "Let’s work together", href: "mailto:hello@nickayy.dev" },
} as const;

/**
 * Kind words. PLACEHOLDER: Nick has no published testimonials yet, so the notes are
 * written by the cats. They are deliberately not attributed to real people.
 */
export const kindWords = [
  {
    from: "Mizu",
    quote:
      "Nick is the most reliable engineer I’ve supervised. Meals ship on schedule, the laptop is always warm, and he only complains a little when I sit on the keyboard.",
    sign: "Mizu",
    title: "Siamese, Head of Quality",
    avatar: "siamese",
  },
  {
    from: "the sleepy one",
    quote:
      "I slept through most of the build, and nothing woke me up. No alarms, no outages, no raised voices. I can’t give a deployment higher praise than that.",
    sign: "Tux",
    title: "Tuxedo, On-call (asleep)",
    avatar: "tuxedo",
  },
  {
    from: "you, maybe",
    quote:
      "This spot is saved for the first team that works with Nick and has something nice to say afterwards. No pressure.",
    sign: "Your name",
    title: "Future teammate",
    avatar: "blank",
  },
] as const;

export type PlayItem = {
  id: string;
  title: string;
  note: string;
  /** masonry span: 1 = small, 2 = wide, 3 = large */
  size: 1 | 2 | 3;
  /** real asset from the current site, or null for generated placeholder art */
  asset: null | { type: "image" | "video" | "sprite"; src: string };
  tone: "green" | "ink" | "blue" | "red" | "paper" | "brass";
};

/** First 10 items are the ones on the home page dial. */
export const playground: PlayItem[] = [
  { id: "siamese-gaze", title: "Siamese gaze", note: "A 96-frame sprite that follows your cursor.", size: 2, asset: { type: "sprite", src: "/play/siamese-gaze.webp" }, tone: "paper" },
  { id: "hero-trio", title: "Nick makes things", note: "The hero trio from nickayy.dev.", size: 3, asset: { type: "image", src: "/play/hero-characters.png" }, tone: "ink" },
  { id: "chroma-motion", title: "Chroma motion test", note: "Frame-by-frame motion, keyed and encoded for the web.", size: 2, asset: { type: "video", src: "/play/motion-chroma.mp4" }, tone: "ink" },
  { id: "loader-mark", title: "Loader mark", note: "The little wave that greets you.", size: 1, asset: { type: "image", src: "/play/loader-mark.png" }, tone: "paper" },
  { id: "shard-router", title: "Shard router", note: "Hash-mod-N, visualised.", size: 2, asset: null, tone: "blue" },
  { id: "tick-stream", title: "Tick stream", note: "Kafka offsets as a ticker tape.", size: 1, asset: null, tone: "green" },
  { id: "ldap-map", title: "Lab map", note: "Every host in the Unix lab on one page.", size: 2, asset: null, tone: "paper" },
  { id: "rmp-badge", title: "Rating badge", note: "The chip the extension injects.", size: 1, asset: null, tone: "red" },
  { id: "scroll-roll", title: "Scroll roll", note: "Sections that roll away in 3D.", size: 2, asset: null, tone: "ink" },
  { id: "cursor-fx", title: "Cursor trail", note: "A cursor that leaves crayon behind.", size: 1, asset: null, tone: "brass" },
  { id: "rate-limiter", title: "Rate limiter", note: "Per-IP token buckets filling up.", size: 1, asset: null, tone: "blue" },
  { id: "siamese-front", title: "Mizu, front view", note: "Keyframe zero.", size: 1, asset: { type: "image", src: "/play/siamese-front.png" }, tone: "paper" },
  { id: "menu-board", title: "Menu board", note: "Minh Ky specials, typeset.", size: 2, asset: null, tone: "red" },
  { id: "post-counter", title: "54,000 a month", note: "A counter that never stops.", size: 1, asset: null, tone: "green" },
  { id: "cert-chain", title: "Certificate chain", note: "A private CA, drawn.", size: 1, asset: null, tone: "ink" },
  { id: "checkout-flow", title: "Checkout flow", note: "Three taps to paid.", size: 2, asset: null, tone: "paper" },
  { id: "crayon-kit", title: "Crayon kit", note: "The filter behind every doodle here.", size: 1, asset: null, tone: "brass" },
  { id: "mail-route", title: "Mail route", note: "sendmail to dovecot, hop by hop.", size: 1, asset: null, tone: "blue" },
];

export const contact = {
  heading: "Let’s grab coffee?",
  /** typed out in the notebook thread by the mascot */
  thread: [
    "Hey! Hiring, or have something to build? I’d love to hear about it.",
  ],
  rows: [
    { label: "Name", kind: "text" as const, value: "Nick Nguyen, or Nicholas Nguyen on LinkedIn" },
    { label: "Mail", kind: "mail" as const, value: "hello@nickayy.dev", href: "mailto:hello@nickayy.dev" },
    { label: "Résumé", kind: "links" as const, links: [{ label: "View résumé", href: "/resume" }] },
    { label: "Current site", kind: "links" as const, links: [{ label: "nickayy.dev", href: "https://nickayy.dev" }] },
    {
      label: "Socials",
      kind: "links" as const,
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/nicholas-nguyen-445a29249" },
        { label: "GitHub", href: "https://github.com/nickayvy" },
      ],
    },
  ],
  footnote: "Designed and built by me, from sketch to code.",
  copyright: "© 2026 Nick Nguyen",
};

export const resume = {
  education: [
    { school: "San Diego State University", place: "San Diego, CA", degree: "Bachelor of Science, Computer Science", dates: "Aug 2024 – Dec 2026" },
    { school: "San Diego Miramar Community College", place: "San Diego, CA", degree: "Associate’s Degree for Transfer, Computer Science", dates: "Jan 2021 – Jun 2024" },
  ],
  experience: [
    {
      company: "Aesthetic AI",
      place: "Los Angeles, CA",
      role: "Software Engineer Intern",
      dates: "Jan 2026 – May 2026",
      bullets: [
        "Pre-seed consumer startup: $1.5M raised at a $10M valuation, 100,000+ users.",
        "Architected and shipped an Instagram growth automation platform monitoring 1,200+ creator accounts and processing 54,000 posts per month to drive app traffic, bringing operational costs down by 90%.",
        "Shipped the creator storefront launch: rebuilt checkout commerce APIs and instrumented PostHog analytics across web and serverless for GMV, subscribers and per-merchant conversion.",
        "Built a multimodal LLM pipeline to standardize product descriptions across an entire commerce catalog.",
      ],
    },
    {
      company: "Coastal Payroll Services",
      place: "San Diego, CA",
      role: "IT Intern",
      dates: "Dec 2022 – Jun 2024",
      bullets: [
        "Helped establish an internal IT department for a 100+ employee company.",
        "Standardized employee onboarding using Microsoft Active Directory, iSolved and ConnectWise, enabling remote onboarding and making the process 50% faster.",
        "Resolved 500+ critical hardware and software failures, prioritizing data loss prevention and cybersecurity ticket triage to maintain 98% uptime across the organization.",
      ],
    },
    {
      company: "Minh Ky Restaurant",
      place: "San Diego, CA",
      role: "Co-Owner",
      dates: "Oct 2023 – Present",
      bullets: [
        "Scaled a family-owned Chinese restaurant into a multi-million-dollar business through operational improvements and sustained revenue growth.",
        "Negotiate vendor contracts and oversee operations, including staffing, inventory, purchasing and day-to-day management.",
        "Analyzed sales, labor and growth opportunities, bringing in hundreds of thousands in revenue through new process implementations.",
      ],
    },
  ],
  skills: [
    { label: "Programming Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "Java", "C"] },
    { label: "Frameworks & Tools", items: ["React.js", "Node.js", "Express.js", "Git", "Docker", "Redis", "Linux", "AWS", "PostgreSQL", "DynamoDB"] },
  ],
};
