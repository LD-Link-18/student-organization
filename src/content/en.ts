import type { Content } from "./types";

const club = {
  name: "Smart Systems Club",
  wordmark: ["Smart", "Systems Club"] as [string, string],
  university: "Kocaeli University",
  semester: "Fall 2026",
};

export const en: Content = {
  locale: "en",
  switcher: { groupLabel: "Language" },
  club,

  common: {
    joinClub: "Join the club",
    skipToContent: "Skip to content",
    backToTop: "Back to top",
    logoLabel: `${club.name}, back to top`,
    newTab: " (opens in a new tab)",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main",
    footerNav: "Footer",
    homeLabel: `${club.name}, homepage`,
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Areas", href: "#areas" },
    { label: "Projects", href: "#projects" },
    { label: "Events", href: "#events" },
    { label: "Team", href: "#team" },
    { label: "Sponsors", href: "#sponsors" },
  ],

  hero: {
    intakeOpen: `${club.semester} intake is open`,
    tagline: `Student-led lab at ${club.university}`,
    words: ["Sense.", "Think.", "Act."],
    notes: ["perceive the world", "reason about it"],
    scale: 1,
    intro:
      "A student-run lab for people who build machines that sense, think and act. First-years welcome, no experience needed.",
    primaryCta: "Join the club",
    secondaryCta: "See our projects",
    chips: { robotics: "Robotics", ml: "Machine learning", ai: "AI", automation: "Automation" },
    sticker: `Join the loop / ${club.semester} / `,
  },

  tapeExtras: ["Hackathons", "Workshops"],

  about: {
    title: ["No prereqs.", "Just curiosity."],
    body: `The ${club.name} is where students from computer engineering, electronics, mechanical engineering and even psychology meet to build things that learn. We run weekly build nights, hands-on workshops, reading groups and competition teams.`,
    principles: [
      "Build first. The theory shows up when you need it.",
      "Every beginner pairs with someone who has shipped before.",
      "Everything we make is open source, including the mistakes.",
    ],
  },

  stats: [
    { value: "180+", label: "active members across 14 departments" },
    { value: "24", label: "projects shipped since the club started" },
    { value: "40+", label: "events every academic year" },
    { value: "16", label: "hands-on workshops, zero prerequisites" },
  ],

  areas: {
    title: "What we build",
    intro: "Six tracks, one lab. Pick one to start — most members end up drifting between all of them.",
    toolsLabel: "Tools",
    items: [
      {
        key: "ai",
        title: "Artificial Intelligence",
        blurb: "Agents, LLM tooling and reasoning systems — from prompt hacks to fine-tuned models running on our own GPUs.",
        tools: ["LLMs", "RAG", "Agents"],
      },
      {
        key: "ml",
        title: "Machine Learning",
        blurb: "Train, evaluate, break, retrain. Weekly paper reads and Kaggle squads.",
        tools: ["PyTorch", "scikit-learn"],
      },
      {
        key: "robotics",
        title: "Robotics",
        blurb: "Rovers, arms and one very stubborn quadruped. ROS 2 all the way down.",
        tools: ["ROS 2", "SLAM", "Gazebo"],
      },
      {
        key: "vision",
        title: "Computer Vision",
        blurb: "Detection, tracking and segmentation on real cameras, not just benchmarks.",
        tools: ["OpenCV", "YOLO"],
      },
      {
        key: "embedded",
        title: "Embedded Systems",
        blurb: "Microcontrollers, sensors and TinyML squeezed into a few hundred kilobytes.",
        tools: ["ESP32", "STM32", "TinyML"],
      },
      {
        key: "automation",
        title: "Automation",
        blurb: "Pipelines, bots and control loops that do the boring parts for you.",
        tools: ["Python", "PLC", "CI/CD"],
      },
    ],
  },

  projects: {
    title: ["Built in", "the lab."],
    intro:
      "From an assistant for the university to a traffic simulation that generates synthetic data. Every project started with an idea and took shape in the hands of a student team.",
    pitch: "Pitch a project",
    stackLabel: "Built with",
    statusLabel: "Status: ",
    status: { done: "Completed", progress: "In progress", prototype: "Prototype" },
    view: "View project",
    // Description, team and status are real. PLACEHOLDER: stack, dates, highlights, sections and timeline
    // below are drafted around them; replace with the project's real details.
    items: [
      {
        slug: "koubot",
        name: "KOUBOT",
        category: "Natural Language Processing",
        status: "done",
        description:
          "A RAG-based assistant built for the university. It answers students' questions from the sources it finds in the university's documents, and shows which source it relied on.",
        stack: ["Python", "RAG", "LLM", "Vector database"],
        visual: "koubot",
        started: "November 2025",
        overview:
          "KOUBOT is an assistant that answers questions about the university in conversation. Instead of trusting a language model on its own, it first finds the relevant passages in the university's own documents and bases its answer only on those sources. That keeps its answers both current and verifiable.",
        highlights: [
          { value: "RAG", label: "answers are grounded in university documents" },
          { value: "4", label: "person team" },
          { value: "24/7", label: "open to students' questions" },
        ],
        sections: [
          {
            title: "The problem",
            body: "Students look for regulations, announcements and campus information in several places, buried in long documents. Even a simple question takes time to answer.",
          },
          {
            title: "How it works",
            body: "Documents are split into passages, turned into vectors and stored in a database. When a question comes in, the most relevant passages are retrieved and handed to the language model as context. The model answers only from that context and shows its source.",
          },
          {
            title: "Why RAG",
            body: "Language models can explain things they don't know just as fluently. Grounding the answers in documents lowers the risk of mistakes and makes it possible to check where every answer came from.",
          },
          {
            title: "The outcome",
            body: "The project is complete. The assistant is designed to stay current as new content is added to its document pool.",
          },
        ],
        timeline: [
          { date: "Nov 2025", text: "Idea and team" },
          { date: "Jan 2026", text: "First prototype: indexing the documents" },
          { date: "Mar 2026", text: "Trial use with students" },
          { date: "May 2026", text: "Project completed" },
        ],
        team: [
          { name: "Abdullah Naim Yolaçan" },
          { name: "Ahmet Yusuf Şimşek" },
          { name: "Rümeysa Yeşilova" },
          { name: "Ahmet Bursa" },
        ],
      },
      {
        slug: "scribblemind",
        name: "ScribbleMind",
        category: "Computer Vision",
        status: "done",
        description:
          "A system that tells who wrote a piece of handwriting from a screenshot. It learns each writer's own style and matches new samples to it.",
        stack: ["Python", "PyTorch", "OpenCV", "CNN"],
        visual: "scribble",
        started: "December 2025",
        overview:
          "ScribbleMind picks the handwriting out of a screenshot and predicts who wrote it. By learning what is specific to each writer, such as the shape, slant, pressure and spacing of the letters, it finds the most likely person among known writers and reports a confidence score.",
        highlights: [
          { value: "1", label: "screenshot is enough to predict a writer" },
          { value: "CNN", label: "deep network that learns writing style" },
          { value: "4", label: "person team" },
        ],
        sections: [
          {
            title: "The problem",
            body: "Handwriting is personal, but telling who wrote something takes expertise and time. Screenshots shared online make it harder still: resolution, lighting and background vary a lot.",
          },
          {
            title: "How it works",
            body: "First the writing regions in the image are detected and cleaned up. A deep learning model then extracts a signature (a feature vector) that describes the writer from each piece of writing. That signature is compared with the signatures of known writers, and the closest match is returned with a confidence score.",
          },
          {
            title: "The hard parts",
            body: "Different screen sizes, compression and noise make the model's job harder. Data augmentation and preprocessing became an important part of the system for that reason.",
          },
          {
            title: "The outcome",
            body: "The project is complete. For known writers, the system can predict who wrote a sample from a screenshot.",
          },
        ],
        timeline: [
          { date: "Dec 2025", text: "Problem definition and data collection" },
          { date: "Feb 2026", text: "First model trained" },
          { date: "Apr 2026", text: "Preprocessing and improvements for screenshots" },
          { date: "Jun 2026", text: "Project completed" },
        ],
        team: [
          { name: "Batın Dikilitaş" },
          { name: "Samet Mert Dik" },
          { name: "Zübeyde Bozkurt", href: "https://www.linkedin.com/in/z%C3%BCbeyde-bozkurt-86167b333/" },
          { name: "Cafer Berat Gülsoy" },
        ],
      },
      {
        slug: "traffic-sim",
        name: "Traffic Simulation",
        category: "Simulation",
        status: "progress",
        description:
          "An end-to-end traffic simulation built to generate synthetic data. It brings the whole pipeline together, from the road network and vehicle behavior to sensor readings and labeled output.",
        stack: ["Python", "Simulation", "Synthetic data", "Data labeling"],
        visual: "traffic",
        started: "March 2026",
        overview:
          "Collecting real traffic data is expensive, slow and often raises privacy concerns. This project aims to generate the data it needs in a simulation: roads, vehicles, junctions and sensors are built in a virtual environment, and the system delivers its output as a labeled dataset.",
        highlights: [
          { value: "End-to-end", label: "one pipeline from road network to labeled data" },
          { value: "Synthetic", label: "data generated without collecting real traffic" },
          { value: "2", label: "person team" },
        ],
        sections: [
          {
            title: "The problem",
            body: "Training traffic models takes a lot of labeled data. Collecting it in the real world is costly, and for rare situations (accidents, rush hour) it's nearly impossible.",
          },
          {
            title: "How it works",
            body: "The simulation has four layers: road network, vehicle behavior, sensors and output. Roads and junctions are defined, vehicles move through that network by a set of rules, virtual sensors record what happens, and the records are exported as labeled data.",
          },
          {
            title: "Where it stands",
            body: "The core components are built and being wired together. The team is now focused on making the sensor data more realistic and the scenarios more varied.",
          },
          { title: "What's next", body: "Exporting the labeled dataset in a standard format and showing that the generated data is useful for training other models." },
        ],
        timeline: [
          { date: "Mar 2026", text: "Project planned" },
          { date: "May 2026", text: "Road network and vehicle behavior model" },
          { date: "Sep 2026", text: "Sensor data generation" },
          { date: "Dec 2026", text: "Labeled dataset export (planned)" },
        ],
        team: [{ name: "Rümeysa Yeşilova" }, { name: "Ahmet Yusuf Şimşek" }],
      },
      {
        slug: "quill",
        name: "Quill",
        category: "Deep Learning",
        status: "progress",
        description:
          "A RAG-based deep learning system that splits long book texts into passages, indexes them and reminds readers of everything up to where they stopped, without spoilers.",
        stack: ["Python", "PyTorch", "RAG", "Embeddings"],
        visual: "quill",
        started: "August 2026",
        overview:
          "Put a long novel down for a while and \"where were we?\" is unavoidable. Quill splits a book's text into passages, indexes them by meaning, and reminds you of the events, characters and relationships up to the point where you stopped. Without giving away anything that comes after.",
        highlights: [
          { value: "0", label: "spoilers: nothing past your page is ever shown to the model" },
          { value: "RAG", label: "recaps grounded in passages retrieved from the book" },
          { value: "1", label: "person team" },
        ],
        sections: [
          {
            title: "The problem",
            body: "Long books don't fit in a language model's context window. And asking for a summary risks revealing chapters the reader hasn't reached yet.",
          },
          {
            title: "How it works",
            body: "The book is split into chapters and paragraphs, and every passage is indexed along with its position in the book. Once the reader's place is known, retrieval only searches passages before that position; everything after it is never shown to the model. That filter is what provides the spoiler protection.",
          },
          {
            title: "The hard parts",
            body: "The chunking strategy directly shapes the result: chunks that are too small lose context, ones that are too large carry unneeded information. The project is currently focused on finding that balance.",
          },
          { title: "What's next", body: "Adding a layer that extracts character and event relationships, and trying the system on several different books." },
        ],
        timeline: [
          { date: "Aug 2026", text: "Idea and first research" },
          { date: "Sep 2026", text: "Text splitting and indexing prototype" },
          { date: "Nov 2026", text: "Spoiler-protected recap tests (planned)" },
          { date: "Jan 2027", text: "First demo (planned)" },
        ],
        team: [{ name: "Samet Mert Dik" }],
      },
    ],
  },

  projectPage: {
    home: "Home",
    breadcrumb: "Projects",
    started: "Started",
    statusLabel: "Status",
    teamSize: (n) => `${n} ${n === 1 ? "person" : "people"}`,
    repo: "Source code",
    demo: "Live demo",
    highlights: "Highlights",
    stack: "Built with",
    timeline: "Timeline",
    team: "Team",
    join: {
      title: "Want to work on this?",
      body: "Our projects take new members every semester, no experience required. Join the club or bring an idea of your own.",
      cta: "Join the club",
      pitch: "Pitch a project",
    },
    next: "Next project",
    docTitle: (name) => `${name} | ${club.name}`,
    listDocTitle: `Projects | ${club.name}`,
  },

  events: {
    title: "Coming up",
    calendar: `${club.semester} calendar`,
    nextUp: "Next up",
    rsvp: "RSVP",
    rsvpFor: (title) => ` for ${title}`,
    rsvpClosed: " (currently closed)",
    items: [
      {
        day: "13–15",
        month: "Oct",
        title: "Booth Week",
        category: "Booth",
        description:
          "We're at our booth for three days. See our projects up close, get to know the club and ask us anything. Don't forget to stop by!",
        place: "Umuttepe",
      },
    ],
  },

  team: {
    title: ["The humans", "in the loop."],
    intro: "This year's board keeps the lab running. Everyone else keeps it interesting.",
    focus: (focus) => `Into ${focus}`,
    members: "+ 170 members building with us",
    takeSeat: "Take your seat",
    people: [
      { name: "Samet Mert Dik", focus: "natural language processing", avatar: 0, href: "https://sametmertdik.com" },
      { name: "Abdullah Naim Yolaçan", focus: "robotics and ROS 2", avatar: 1, href: "https://naimyolacan.com" },
      { name: "Batın Dikilitaş", focus: "image processing", avatar: 2, href: "https://www.linkedin.com/in/batın-dikilitaş" },
      { name: "Ahmet Yusuf Şimşek", focus: "the Internet of Things", avatar: 3, href: "https://www.linkedin.com/in/ahmet-yusuf-şimşek-316136326" },
      { name: "Rümeysa Yeşilova", focus: "reinforcement learning", avatar: 4, href: "https://www.linkedin.com/in/rümeysa-yeşilova-528917376" },
      { name: "Sudenaz Güven", focus: "image processing", avatar: 5, href: "https://www.linkedin.com/in/sudenaz-güven-bb202933b" },
    ],
  },

  sponsors: {
    title: "Fuel the lab",
    intro: "Sponsors pay for the GPUs, sensors, hackathon prizes and competition travel that students can't cover alone.",
    tiers: [
      {
        key: "core",
        name: "Core",
        perks: [
          "Logo on our robots and hackathon shirts",
          "A workshop or keynote slot every semester",
          "Early access to our members' CV book",
        ],
      },
      {
        key: "partner",
        name: "Partner",
        perks: ["Logo on event pages and posters", "Co-host a workshop or tech talk", "Recruiting table at the hackathon"],
      },
      {
        key: "supporter",
        name: "Supporter",
        perks: ["Logo on this site and our Discord", "Shout-out at every event", "Invitation to our demo day"],
      },
    ],
    count: (sponsors, open) =>
      [
        sponsors > 0 ? `${sponsors} ${sponsors === 1 ? "sponsor" : "sponsors"}` : "",
        open > 0 ? `${open} ${open === 1 ? "spot" : "spots"} open` : "",
      ]
        .filter(Boolean)
        .join(", "),
    yourLogo: "Your logo here",
    cta: {
      title: "Put your logo on the robots.",
      body: `We're building our first sponsor lineup for ${club.semester}. Pick a tier, or tell us what you'd like to support and we'll shape a package around it.`,
      deck: "Sponsorship deck (PDF)",
    },
  },

  join: {
    words: ["Build.", "Break.", "Learn."],
    body: "Come to one build night. Bring a laptop, or don't — there's always a spot free. If you like it, stay.",
    primary: "Join the club",
    secondary: "Say hi on Discord",
    memberName: "Your name",
    memberSince: `Member since ${club.semester}`,
    sticker: "Free for all students / always / ",
  },

  footer: {
    blurb: `A student-led community for AI, robotics and everything that learns. Part of ${club.university}.`,
    explore: "Explore",
    follow: "Follow along",
    rights: (year) => `© ${year} ${club.name}, ${club.university}`,
  },

  soon: {
    headline: ["Coming", "soon."],
    lead: {
      default: "This link isn't live yet.",
      discord: "Our Discord server is on its way.",
      linkedin: "Our LinkedIn page is in the works.",
      github: "Our GitHub organization is being set up.",
      instagram: "This link isn't live yet.",
    },
    body: "We're still setting up the club's new channels. Until then, follow us on Instagram for announcements and events.",
    instagram: "Follow on Instagram",
    join: "Join the club",
    home: "Back to the homepage",
    status: {
      title: "status",
      steps: [
        ["plan", "done"],
        ["setup", "in progress"],
        ["launch", "next"],
      ],
    },
    sticker: `Coming soon / ${club.semester} / `,
  },

  notFound: {
    title: `Page not found | ${club.name}`,
    lead: "We couldn't detect this page.",
    body: "The link may be outdated, or the address mistyped. Whatever you're looking for is probably on the homepage.",
    home: "Back to the homepage",
    projects: "Browse projects",
    quickLinks: "Maybe one of these:",
    camera: { feed: "cam_01 / site", scanning: "scanning", box: "page 0.00", empty: "no object found", chip: "0 results" },
  },
};
