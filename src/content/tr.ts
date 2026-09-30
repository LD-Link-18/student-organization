import type { Content } from "./types";

const club = {
  name: "Akıllı Sistemler Kulübü",
  wordmark: ["Akıllı", "Sistemler Kulübü"] as [string, string],
  university: "Kocaeli Üniversitesi",
  semester: "Güz 2026",
};

export const tr: Content = {
  locale: "tr",
  switcher: { groupLabel: "Dil seçimi" },
  club,

  common: {
    joinClub: "Kulübe katıl",
    skipToContent: "İçeriğe geç",
    backToTop: "Başa dön",
    logoLabel: `${club.name}, sayfanın başına dön`,
    newTab: " (yeni sekmede açılır)",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    mainNav: "Ana menü",
    footerNav: "Alt menü",
  },

  nav: [
    { label: "Hakkımızda", href: "#about" },
    { label: "Alanlar", href: "#areas" },
    { label: "Projeler", href: "#projects" },
    { label: "Etkinlikler", href: "#events" },
    { label: "Ekip", href: "#team" },
    { label: "Sponsorlar", href: "#sponsors" },
  ],

  hero: {
    intakeOpen: `${club.semester} başvuruları açık`,
    tagline: `${club.university}'nde öğrencilerin yürüttüğü bir laboratuvar`,
    words: ["Algıla.", "Düşün.", "Yap."],
    notes: ["çevreni tanı", "karar ver"],
    scale: 0.8,
    intro:
      "Algılayan, düşünen ve harekete geçen makineler geliştiren bir öğrenci laboratuvarı. Birinci sınıflar dahil, deneyim şartı yok.",
    primaryCta: "Kulübe katıl",
    secondaryCta: "Projelerimizi gör",
    chips: { robotics: "Robotik", ml: "Makine öğrenmesi", ai: "Yapay zekâ", automation: "Otomasyon" },
    sticker: `Döngüye katıl / ${club.semester} / `,
  },

  tapeExtras: ["Hackathonlar", "Atölyeler"],

  about: {
    title: ["Ön koşul yok.", "Sadece merak."],
    body: `${club.name}; bilgisayar, elektronik ve makine mühendisliğinden, hatta psikolojiden öğrencilerin öğrenen sistemler geliştirmek için buluştuğu yer. Haftalık üretim geceleri, uygulamalı atölyeler, okuma grupları ve yarışma takımları düzenliyoruz.`,
    principles: [
      "Önce yap. Teori, ihtiyaç duyduğunda gelir.",
      "Her yeni gelen, daha önce proje çıkarmış biriyle eşleşir.",
      "Ürettiğimiz her şey açık kaynak, hatalarımız dahil.",
    ],
  },

  stats: [
    { value: "180+", label: "14 farklı bölümden aktif üye" },
    { value: "24", label: "kulüp kurulduğundan beri tamamlanan proje" },
    { value: "40+", label: "her akademik yıl düzenlenen etkinlik" },
    { value: "16", label: "uygulamalı atölye, ön koşul yok" },
  ],

  areas: {
    title: "Neler yapıyoruz",
    intro: "Altı alan, tek laboratuvar. Birinden başla; üyelerimizin çoğu zamanla hepsine uğruyor.",
    toolsLabel: "Araçlar",
    items: [
      {
        key: "ai",
        title: "Yapay Zekâ",
        blurb:
          "Ajanlar, LLM araçları ve akıl yürüten sistemler. Prompt denemelerinden kendi GPU'larımızda ince ayar yaptığımız modellere kadar.",
        tools: ["LLM'ler", "RAG", "Ajanlar"],
      },
      {
        key: "ml",
        title: "Makine Öğrenmesi",
        blurb: "Eğit, değerlendir, boz, yeniden eğit. Haftalık makale okumaları ve Kaggle takımları.",
        tools: ["PyTorch", "scikit-learn"],
      },
      {
        key: "robotics",
        title: "Robotik",
        blurb: "Gezgin robotlar, robot kolları ve bir de çok inatçı dört ayaklı robot. Baştan sona ROS 2.",
        tools: ["ROS 2", "SLAM", "Gazebo"],
      },
      {
        key: "vision",
        title: "Bilgisayarlı Görü",
        blurb: "Sadece benchmark'larda değil, gerçek kameralarda nesne tespiti, takip ve segmentasyon.",
        tools: ["OpenCV", "YOLO"],
      },
      {
        key: "embedded",
        title: "Gömülü Sistemler",
        blurb: "Birkaç yüz kilobayta sığdırılmış mikrodenetleyiciler, sensörler ve TinyML.",
        tools: ["ESP32", "STM32", "TinyML"],
      },
      {
        key: "automation",
        title: "Otomasyon",
        blurb: "Sıkıcı kısımları senin yerine halleden veri akışları, botlar ve kontrol döngüleri.",
        tools: ["Python", "PLC", "CI/CD"],
      },
    ],
  },

  projects: {
    title: ["Labdan", "çıkanlar."],
    intro:
      "Buradaki her proje Discord'a atılmış bir mesajla başladı. Gerçek donanım, gerçek kullanıcılar, gerçek hatalar; hepsi iki ila sekiz kişilik öğrenci takımlarının işi.",
    pitch: "Proje öner",
    stackLabel: "Kullanılan teknolojiler",
    statusLabel: "Durum: ",
    status: { live: "Yayında", progress: "Geliştiriliyor", prototype: "Prototip" },
    seatsFree: "boş koltuk",
    items: [
      {
        name: "VisionCore",
        category: "Bilgisayarlı Görü",
        status: "live",
        description:
          "Kampüs kütüphanesinin girişinde gerçek zamanlı nesne tespiti. Doluluğu sayıyor ve boş koltuk tahminlerini herkese açık bir panele gönderiyor.",
        stack: ["YOLOv8", "OpenCV", "FastAPI", "Jetson Nano"],
        visual: "vision",
      },
      {
        name: "Smart Rover",
        category: "Robotik",
        status: "progress",
        description:
          "Mühendislik avlusunu LiDAR SLAM ile kendi başına haritalayan altı tekerlekli gezgin robot. Şu sıralar kaldırımlardan korkmamayı öğreniyor.",
        stack: ["ROS 2", "LiDAR", "Raspberry Pi 5", "C++"],
        visual: "rover",
      },
      {
        name: "Neural Lab",
        category: "Makine Öğrenmesi",
        status: "live",
        description:
          "Birinci sınıfların küçük sinir ağları eğitip her ağırlık güncellemesini anlık izleyebildiği, tarayıcıda çalışan bir deney alanı.",
        stack: ["TypeScript", "WebGPU", "React"],
        visual: "neural",
      },
      {
        name: "Gesture Interface",
        category: "Gömülü + ML",
        status: "prototype",
        description: "El hareketlerini klavye kısayollarına çeviren, 40 KB'ın altındaki bir modeli cihaz üzerinde çalıştıran bileklik.",
        stack: ["ESP32-S3", "TinyML", "IMU", "Edge Impulse"],
        visual: "gesture",
      },
    ],
  },

  events: {
    title: "Yaklaşanlar",
    calendar: `${club.semester} takvimi`,
    nextUp: "Sıradaki",
    rsvp: "Katıl",
    rsvpFor: (title) => `: ${title}`,
    items: [
      {
        day: "14",
        month: "Eki",
        title: "Yapay Zekâya Giriş Atölyesi",
        category: "Atölye",
        description: "İki saatte ilk görüntü sınıflandırıcını kur ve yayına al. Bilgisayar şart, deneyim değil.",
        place: "Lab B-204",
      },
      {
        day: "23",
        month: "Eki",
        title: "Robotik Gecesi",
        category: "Üretim gecesi",
        description: "Gezgin robot takımının atölyesi herkese açık. Lehimle, hata ayıkla ve motor seven insanlarla pizza ye.",
        place: "Maker Space",
      },
      {
        day: "08",
        month: "Kas",
        title: "Teknik Sohbet: Gerçek Dünyada Robotlar",
        category: "Söyleşi",
        description:
          "Bir mezunumuz yağmura, güneş parlamasına ve gerçek kullanıcılara dayanıklı algılama sistemleri geliştirmeyi anlatıyor.",
        place: "Konferans Salonu 2",
      },
      {
        day: "21",
        month: "Kas",
        title: "Bilgisayarlı Görü Kampı",
        category: "Kamp",
        description: "Üç akşam, tek proje: OpenCV temellerinden çalışan, gerçek zamanlı bir takip sistemine.",
        place: "Lab B-204",
      },
      {
        day: "05",
        month: "Ara",
        title: "ISC Hackathon",
        category: "Hackathon",
        description: "24 saat, dört kişilik takımlar ve açılışta duyurulan tek bir tema. Mentorlar bütün gece yanında.",
        place: "Mühendislik Atriumu",
      },
    ],
  },

  team: {
    title: ["Döngüdeki", "insanlar."],
    intro: "Bu yılın yönetim kurulu laboratuvarı ayakta tutuyor. Geri kalan herkes onu ilginç kılıyor.",
    focus: (focus) => `İlgi alanı: ${focus}`,
    members: "+ 170 üye bizimle üretiyor",
    takeSeat: "Yerini al",
    people: [
      { name: "Samet Mert Dik", focus: "doğal dil işleme", avatar: 0 },
      { name: "Abdullah Naim Yolaçan", focus: "robotik ve ROS 2", avatar: 1 },
      { name: "Batın Dikilitaş", focus: "görüntü işleme", avatar: 2 },
      { name: "Ahmet Yusuf Şimşek", focus: "nesnelerin interneti", avatar: 3 },
      { name: "Rümeysa Yeşilova", focus: "pekiştirmeli öğrenme", avatar: 4 },
      { name: "Sudenaz Güven", focus: "görüntü işleme", avatar: 5 },
    ],
  },

  sponsors: {
    title: "Laba güç ver",
    intro:
      "Sponsorlarımız, öğrencilerin tek başına karşılayamayacağı GPU'ları, sensörleri, hackathon ödüllerini ve yarışma yolculuklarını finanse ediyor.",
    tiers: [
      {
        key: "core",
        name: "Ana Sponsor",
        perks: [
          "Robotlarımızda ve hackathon tişörtlerinde logonuz",
          "Her dönem bir atölye ya da açılış konuşması",
          "Üyelerimizin CV kitapçığına erken erişim",
        ],
      },
      {
        key: "partner",
        name: "İş Ortağı",
        perks: [
          "Etkinlik sayfalarında ve afişlerde logonuz",
          "Birlikte atölye ya da teknik sohbet düzenleme",
          "Hackathonda işe alım masası",
        ],
      },
      {
        key: "supporter",
        name: "Destekçi",
        perks: ["Bu sitede ve Discord sunucumuzda logonuz", "Her etkinlikte teşekkür", "Demo günümüze davet"],
      },
    ],
    count: (sponsors, open) =>
      [sponsors > 0 ? `${sponsors} sponsor` : "", open > 0 ? `${open} yer açık` : ""].filter(Boolean).join(", "),
    yourLogo: "Logonuz burada",
    cta: {
      title: "Logonuz robotlarımızda yer alsın.",
      body: `${club.semester} için ilk sponsor kadromuzu oluşturuyoruz. Bir kademe seçin ya da neyi desteklemek istediğinizi anlatın; paketi birlikte şekillendirelim.`,
      deck: "Sponsorluk dosyası (PDF)",
    },
  },

  join: {
    words: ["Kur.", "Boz.", "Öğren."],
    body: "Bir üretim gecesine gel. Bilgisayarını getir ya da getirme; boşta bir havya mutlaka vardır. Sevdiysen kal.",
    primary: "Kulübe katıl",
    secondary: "Discord'da selam ver",
    details: [
      { k: "Ne zaman", v: "Perşembe, 18:00" },
      { k: "Nerede", v: "Lab B-204" },
      { k: "Ücret", v: "Tüm öğrencilere ücretsiz" },
    ],
    memberName: "Adın",
    memberSince: `${club.semester}'dan beri üye`,
    sticker: "Tüm öğrencilere ücretsiz / her zaman / ",
  },

  footer: {
    blurb: `Yapay zekâ, robotik ve öğrenen her şey için öğrencilerin yürüttüğü bir topluluk. ${club.university} bünyesinde.`,
    explore: "Keşfet",
    follow: "Takip et",
    rights: (year) => `© ${year} ${club.name}, ${club.university}`,
  },
};
