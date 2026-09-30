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
      "Every project here started as a message in our Discord. Real hardware, real users, real bugs — built by teams of two to eight students.",
    pitch: "Pitch a project",
    stackLabel: "Built with",
    statusLabel: "Status: ",
    status: { live: "Live", progress: "In progress", prototype: "Prototype" },
    seatsFree: "seats free",
    items: [
      {
        name: "VisionCore",
        category: "Computer Vision",
        status: "live",
        description:
          "Real-time object detection for the campus library entrance — counts occupancy and pushes free-seat estimates to a public dashboard.",
        stack: ["YOLOv8", "OpenCV", "FastAPI", "Jetson Nano"],
        visual: "vision",
      },
      {
        name: "Smart Rover",
        category: "Robotics",
        status: "progress",
        description:
          "A six-wheel rover that maps the engineering courtyard on its own using LiDAR SLAM. Currently learning not to fear curbs.",
        stack: ["ROS 2", "LiDAR", "Raspberry Pi 5", "C++"],
        visual: "rover",
      },
      {
        name: "Neural Lab",
        category: "Machine Learning",
        status: "live",
        description:
          "An in-browser playground where first-years train tiny neural nets and watch every weight update as it happens.",
        stack: ["TypeScript", "WebGPU", "React"],
        visual: "neural",
      },
      {
        name: "Gesture Interface",
        category: "Embedded + ML",
        status: "prototype",
        description: "A wristband that turns hand gestures into keyboard shortcuts with an on-device model under 40 KB.",
        stack: ["ESP32-S3", "TinyML", "IMU", "Edge Impulse"],
        visual: "gesture",
      },
    ],
  },

  events: {
    title: "Coming up",
    calendar: `${club.semester} calendar`,
    nextUp: "Next up",
    rsvp: "RSVP",
    rsvpFor: (title) => ` for ${title}`,
    items: [
      {
        day: "14",
        month: "Oct",
        title: "Intro to AI Workshop",
        category: "Workshop",
        description: "Build and deploy your first image classifier in two hours. Laptops required, experience not.",
        place: "Lab B-204",
      },
      {
        day: "23",
        month: "Oct",
        title: "Robotics Night",
        category: "Build night",
        description: "Open garage for the rover team. Solder, debug and eat pizza with people who love motors.",
        place: "Maker Space",
      },
      {
        day: "08",
        month: "Nov",
        title: "Tech Talk: Robots in the Wild",
        category: "Talk",
        description: "An alumni engineer on shipping perception systems that survive rain, glare and real users.",
        place: "Auditorium 2",
      },
      {
        day: "21",
        month: "Nov",
        title: "Computer Vision Bootcamp",
        category: "Bootcamp",
        description: "Three evenings, one project: from OpenCV basics to a working real-time tracker.",
        place: "Lab B-204",
      },
      {
        day: "05",
        month: "Dec",
        title: "ISC Hackathon",
        category: "Hackathon",
        description: "24 hours, teams of four, one theme revealed at kickoff. Mentors on site all night.",
        place: "Engineering Atrium",
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
      { name: "Samet Mert Dik", focus: "natural language processing", avatar: 0 },
      { name: "Abdullah Naim Yolaçan", focus: "robotics and ROS 2", avatar: 1 },
      { name: "Batın Dikilitaş", focus: "image processing", avatar: 2 },
      { name: "Ahmet Yusuf Şimşek", focus: "the Internet of Things", avatar: 3 },
      { name: "Rümeysa Yeşilova", focus: "reinforcement learning", avatar: 4 },
      { name: "Sudenaz Güven", focus: "image processing", avatar: 5 },
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
    body: "Come to one build night. Bring a laptop, or don't — there's always a soldering iron free. If you like it, stay.",
    primary: "Join the club",
    secondary: "Say hi on Discord",
    details: [
      { k: "When", v: "Thursdays, 18:00" },
      { k: "Where", v: "Lab B-204" },
      { k: "Cost", v: "Free for every student" },
    ],
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
};
