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
      "Every project here started as a message in our Discord. Real hardware, real users, real bugs — built by teams of two to eight students.",
    pitch: "Pitch a project",
    stackLabel: "Built with",
    statusLabel: "Status: ",
    status: { live: "Live", progress: "In progress", prototype: "Prototype" },
    seatsFree: "seats free",
    view: "View project",
    items: [
      {
        slug: "visioncore",
        name: "VisionCore",
        category: "Computer Vision",
        status: "live",
        description:
          "Real-time object detection for the campus library entrance — counts occupancy and pushes free-seat estimates to a public dashboard.",
        stack: ["YOLOv8", "OpenCV", "FastAPI", "Jetson Nano"],
        visual: "vision",
        started: "September 2025",
        overview:
          "A single camera at the library entrance counts how many people are inside in real time and publishes a free-seat estimate on a public dashboard. During exam weeks it answers \"is there room?\" before you walk over.",
        highlights: [
          { value: "~30 fps", label: "real-time detection on a Jetson Nano" },
          { value: "94%", label: "accuracy counting people in and out" },
          { value: "0", label: "images stored; only the head count leaves the device" },
        ],
        sections: [
          {
            title: "The problem",
            body: "During exam season students walked to the library only to find no seats. There was no way to check how full it was beforehand.",
          },
          {
            title: "How it works",
            body: "The entrance camera feed runs through YOLOv8 on a Jetson Nano. People are tracked and counted when they cross a virtual line, and the count is pushed to the dashboard through FastAPI every few seconds.",
          },
          {
            title: "Privacy",
            body: "Images never leave the device and are never saved. Only the live head count is sent out.",
          },
          { title: "What's next", body: "A camera for the second entrance and occupancy per floor." },
        ],
        timeline: [
          { date: "Sep 2025", text: "Idea posted on Discord, team formed" },
          { date: "Nov 2025", text: "First prototype tested in the lab" },
          { date: "Feb 2026", text: "Pilot started with the library staff" },
          { date: "Apr 2026", text: "Occupancy dashboard opened to everyone" },
        ],
        team: [
          { name: "Full Name", role: "Computer vision" },
          { name: "Full Name", role: "Hardware" },
          { name: "Full Name", role: "Web dashboard" },
        ],
        repo: "",
      },
      {
        slug: "smart-rover",
        name: "Smart Rover",
        category: "Robotics",
        status: "progress",
        description:
          "A six-wheel rover that maps the engineering courtyard on its own using LiDAR SLAM. Currently learning not to fear curbs.",
        stack: ["ROS 2", "LiDAR", "Raspberry Pi 5", "C++"],
        visual: "rover",
        started: "October 2025",
        overview:
          "A six-wheel rover that maps the engineering courtyard on its own. It scans its surroundings with LiDAR, builds a map and is learning to get from one point to another without hitting anything.",
        highlights: [
          { value: "6", label: "wheels on a rocker-bogie chassis" },
          { value: "360°", label: "LiDAR scanning" },
          { value: "~1.2 km", label: "driven autonomously so far" },
        ],
        sections: [
          {
            title: "Why",
            body: "We wanted to build an autonomous system that works in the real world, end to end: mechanics, electronics and software in one team.",
          },
          {
            title: "How it works",
            body: "ROS 2 runs on a Raspberry Pi 5. LiDAR data feeds SLAM, Nav2 plans the route, and motor control lives on a separate microcontroller.",
          },
          {
            title: "Where it stands",
            body: "Mapping is reliable. A depth camera is being added so the rover can see height changes like curbs and ramps.",
          },
          { title: "What's next", body: "Small delivery runs around campus." },
        ],
        timeline: [
          { date: "Oct 2025", text: "Chassis design and first parts" },
          { date: "Jan 2026", text: "First drive by remote control" },
          { date: "Apr 2026", text: "First autonomous map of the courtyard" },
          { date: "Nov 2026", text: "Depth camera integration (planned)" },
        ],
        repo: "",
      },
      {
        slug: "neural-lab",
        name: "Neural Lab",
        category: "Machine Learning",
        status: "live",
        description:
          "An in-browser playground where first-years train tiny neural nets and watch every weight update as it happens.",
        stack: ["TypeScript", "WebGPU", "React"],
        visual: "neural",
        started: "February 2026",
        overview:
          "A neural-network playground that runs in the browser with nothing to install. First-years drag layers together into small networks, start training and watch every weight change live.",
        highlights: [
          { value: "0", label: "installs; a browser is enough" },
          { value: "WebGPU", label: "accelerates training in the browser" },
          { value: "3", label: "workshops have used it as course material" },
        ],
        sections: [
          {
            title: "Why",
            body: "In a first lecture, neural networks feel like a black box to most students. We wanted a tool that lets them look inside.",
          },
          {
            title: "How it works",
            body: "The model and training loop are written in TypeScript, with the matrix math running on WebGPU. The React interface updates the weights and the loss chart at every step.",
          },
          { title: "What's next", body: "Convolutional layers and ready-made datasets (MNIST, simple shapes)." },
        ],
        timeline: [
          { date: "Feb 2026", text: "First draft" },
          { date: "Mar 2026", text: "Training moved to WebGPU" },
          { date: "Apr 2026", text: "Used in its first workshop" },
          { date: "Sep 2026", text: "Turkish and English interface" },
        ],
        repo: "",
      },
      {
        slug: "gesture-interface",
        name: "Gesture Interface",
        category: "Embedded + ML",
        status: "prototype",
        description: "A wristband that turns hand gestures into keyboard shortcuts with an on-device model under 40 KB.",
        stack: ["ESP32-S3", "TinyML", "IMU", "Edge Impulse"],
        visual: "gesture",
        started: "May 2026",
        overview:
          "A small device on your wrist recognizes hand gestures and sends them to your computer as keyboard shortcuts. The model runs on the device itself; no internet or phone needed.",
        highlights: [
          { value: "< 40 KB", label: "model size" },
          { value: "8", label: "gestures recognized" },
          { value: "~15 ms", label: "to recognize a gesture" },
        ],
        sections: [
          {
            title: "Why",
            body: "We were looking for a more natural way to control a computer while presenting, drawing or with our hands full.",
          },
          {
            title: "How it works",
            body: "The IMU on an ESP32-S3 records the motion. A small model trained with Edge Impulse classifies the gesture, and the device acts as a Bluetooth keyboard to send the shortcut.",
          },
          {
            title: "Where it stands",
            body: "The prototype works on the desk. Battery life and the case are being reworked for everyday use.",
          },
        ],
        timeline: [
          { date: "May 2026", text: "Idea and first experiments" },
          { date: "Jun 2026", text: "Gesture data collected from 12 volunteers" },
          { date: "Aug 2026", text: "First working prototype" },
          { date: "Dec 2026", text: "3D-printed case (planned)" },
        ],
        repo: "",
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
