/**
 * Case-study prose for /work/[slug].
 *
 * Built only from each project's `facts`, `role`, `context`, `stack` and `results` in
 * site.ts. Nothing here adds numbers, clients, dates or outcomes that are not listed
 * there; where a section would need facts we do not have, it stays short and general.
 *
 * Inline markup: wrap a phrase in ==double equals== to render it as a marker <mark>.
 * Figures are generated placeholder art (ProjectCover slides), captioned as illustrative.
 */

export type CaseFigure = {
  /** ProjectCover slide index (0-based). Slide 0 is the hero. */
  slide: number;
  caption: string;
};

export type CaseSection = {
  /** anchor id, also used by the Contents rail */
  id: string;
  title: string;
  body: string[];
  /** optional figure shown after this section's text */
  figure?: CaseFigure;
};

export type CaseStudy = {
  slug: string;
  heroCaption: string;
  sections: CaseSection[];
};

const ILLUSTRATIVE = "Illustrative placeholder.";

export const caseStudies: CaseStudy[] = [
  {
    slug: "creator-growth",
    heroCaption: `${ILLUSTRATIVE} Cover art for the creator growth platform.`,
    sections: [
      {
        id: "the-problem",
        title: "The problem",
        body: [
          "Aesthetic AI is a pre-seed consumer startup. It has raised ==$1.5M at a $10M valuation== and has ==100,000+ users==. At that stage, growth matters and so does every dollar the company spends keeping things running.",
          "Creators on Instagram were a way to bring people to the app. The work was a platform that could keep watch over a large set of creator accounts, keep up with what they post, and turn that into traffic for the app without becoming expensive to run.",
        ],
      },
      {
        id: "watching-the-accounts",
        title: "Watching the accounts",
        body: [
          "I architected and shipped the platform as a software engineer intern. It monitors ==1,200+ creator accounts==, which means the hard part is not any single account but keeping all of them current at once.",
          "It is written in TypeScript and Python, runs on serverless infrastructure and keeps its data in PostgreSQL.",
        ],
        figure: { slide: 1, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the account monitoring.` },
      },
      {
        id: "posts-into-traffic",
        title: "Posts into traffic",
        body: [
          "Every month the platform processes ==54,000 posts==. That steady flow of posts is what it uses to drive traffic back to the app.",
        ],
        figure: { slide: 2, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the post processing.` },
      },
      {
        id: "keeping-it-cheap",
        title: "Keeping it cheap",
        body: [
          "A platform like this only earns its place if it stays cheap enough to leave running. It brought operational costs down by ==90%==.",
        ],
        figure: { slide: 3, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the cost work.` },
      },
      {
        id: "where-it-landed",
        title: "Where it landed",
        body: [
          "The platform shipped. It watches ==1,200+ accounts==, processes ==54,000 posts a month== and runs at ==90% lower operating cost==.",
        ],
      },
    ],
  },
  {
    slug: "stock-pipeline",
    heroCaption: `${ILLUSTRATIVE} Cover art for the stock pipeline.`,
    sections: [
      {
        id: "the-problem",
        title: "The problem",
        body: [
          "This is a personal project about event-driven systems. Simulated stock ticks arrive as a stream, and each one has to end up stored exactly where it belongs, even when a consumer fails halfway through.",
          "I designed and built all of it in Python, with Kafka, FastAPI, Docker and Nginx.",
        ],
      },
      {
        id: "ticks-through-kafka",
        title: "Ticks through Kafka",
        body: [
          "Ingestion is event-driven: Kafka streams the simulated ticks into a sharded storage layer.",
          "The consumers are idempotent and ==commit offsets only after a successful write==. If a consumer stops between writing and committing, the message is delivered again, and because the write is idempotent, writing it twice does no harm.",
        ],
        figure: { slide: 1, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the Kafka consumers.` },
      },
      {
        id: "deterministic-shards",
        title: "Deterministic shards",
        body: [
          "Shard routing is deterministic: a key is hashed and taken ==mod N== to pick one of the in-memory shards, so the same key always lands in the same place. The distribution across shards is covered by unit tests.",
          "Keys carry a prefix for users, picks and price data, and routing uses that prefix to keep each kind of data apart.",
        ],
        figure: { slide: 2, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the shard routing.` },
      },
      {
        id: "the-front-door",
        title: "The front door",
        body: [
          "The API is a FastAPI service. In front of it, an Nginx API gateway handles reverse-proxy routing and enforces ==per-IP rate limiting==, so one noisy client cannot crowd out everyone else.",
        ],
        figure: { slide: 3, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the gateway.` },
      },
      {
        id: "where-it-landed",
        title: "Where it landed",
        body: [
          "The pipeline has idempotent consumers, deterministic shard routing with tested distribution, and a gateway that rate limits per IP. The code is on GitHub.",
        ],
      },
    ],
  },
  {
    slug: "unix-lab",
    heroCaption: `${ILLUSTRATIVE} Cover art for the Unix lab.`,
    sections: [
      {
        id: "the-problem",
        title: "The problem",
        body: [
          "Running one machine teaches you that machine. Running several that have to trust each other teaches you naming, identity, storage and certificates. This lab is a personal project to do exactly that across OpenBSD, FreeBSD and Linux hosts.",
        ],
      },
      {
        id: "names-and-logins",
        title: "Names and logins",
        body: [
          "Internal DNS runs on BIND, so every host can find every other host by name.",
          "Authentication goes through OpenLDAP, with sssd on the hosts. One directory account is ==one login across every host==.",
        ],
        figure: { slide: 1, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for DNS and the directory.` },
      },
      {
        id: "shared-homes-and-trust",
        title: "Shared homes and trust",
        body: [
          "Home directories are shared over NFS, so a user's files follow them from host to host.",
          "A private certificate authority issues the TLS certificates that services use to authenticate to each other.",
        ],
        figure: { slide: 2, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for NFS and the private CA.` },
      },
      {
        id: "mail",
        title: "Mail",
        body: [
          "A FreeBSD mail server running sendmail and dovecot is wired into the same LDAP directory and the same CA.",
          "Any directory user can send mail between hosts and read it over ==TLS-encrypted IMAP== from a desktop client.",
        ],
      },
      {
        id: "where-it-landed",
        title: "Where it landed",
        body: [
          "One directory login works across every host, TLS is used between services, and mail works end to end.",
        ],
      },
    ],
  },
  {
    slug: "class-assistant",
    heroCaption: `${ILLUSTRATIVE} Cover art for the registration assistant.`,
    sections: [
      {
        id: "the-problem",
        title: "The problem",
        body: [
          "Choosing classes usually means choosing professors too, and the ratings live somewhere other than the registration screen. This personal project brings them together.",
        ],
      },
      {
        id: "inside-the-registration-screen",
        title: "Inside the registration screen",
        body: [
          "It is a Chrome extension, built on Manifest V3 and written in TypeScript. It injects RateMyProfessors ratings ==directly into the CSUF class registration UI==, next to the classes you are already looking at.",
        ],
        figure: { slide: 1, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the injected ratings.` },
      },
      {
        id: "fetching-the-ratings",
        title: "Fetching the ratings",
        body: [
          "The ratings come from a GraphQL API, so the extension asks for what it needs and places it in the page.",
        ],
        figure: { slide: 2, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the ratings lookup.` },
      },
      {
        id: "where-it-landed",
        title: "Where it landed",
        body: [
          "It reduced the time spent registering by ==27%==. The code is on GitHub.",
        ],
      },
    ],
  },
  {
    slug: "creator-storefront",
    heroCaption: `${ILLUSTRATIVE} Cover art for the creator storefront.`,
    sections: [
      {
        id: "the-problem",
        title: "The problem",
        body: [
          "At Aesthetic AI I shipped the creator storefront launch as a software engineer intern. A launch like this needs three things to hold up: a checkout that works, numbers you can trust afterwards, and a catalog that reads well.",
        ],
      },
      {
        id: "checkout",
        title: "Checkout",
        body: [
          "I rebuilt the checkout commerce APIs, the part of a storefront that has to be right every time someone pays.",
        ],
        figure: { slide: 1, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the checkout work.` },
      },
      {
        id: "measuring-it",
        title: "Measuring it",
        body: [
          "I instrumented PostHog analytics across both web and serverless, tracking ==GMV==, ==subscribers== and ==per-merchant conversion==. Covering both means the numbers include what happens in the browser and on the server.",
        ],
        figure: { slide: 2, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the analytics.` },
      },
      {
        id: "a-cleaner-catalog",
        title: "A cleaner catalog",
        body: [
          "Product descriptions written by many hands rarely match. I built a multimodal LLM pipeline that standardizes product descriptions ==across an entire commerce catalog==.",
        ],
        figure: { slide: 3, caption: `${ILLUSTRATIVE} Not a real screenshot; it stands in for the catalog pipeline.` },
      },
      {
        id: "where-it-landed",
        title: "Where it landed",
        body: [
          "The storefront launch shipped, with GMV, subscriber and per-merchant conversion tracking in place.",
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
