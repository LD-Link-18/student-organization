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
    homeLabel: `${club.name}, ana sayfa`,
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
    view: "Projeyi incele",
    items: [
      {
        slug: "visioncore",
        name: "VisionCore",
        category: "Bilgisayarlı Görü",
        status: "live",
        description:
          "Kampüs kütüphanesinin girişinde gerçek zamanlı nesne tespiti. Doluluğu sayıyor ve boş koltuk tahminlerini herkese açık bir panele gönderiyor.",
        stack: ["YOLOv8", "OpenCV", "FastAPI", "Jetson Nano"],
        visual: "vision",
        started: "Eylül 2025",
        overview:
          "Kütüphane girişindeki tek bir kamera, içeride kaç kişi olduğunu gerçek zamanlı sayıyor ve boş koltuk tahminini herkese açık bir panelde yayınlıyor. Sınav haftalarında \"yer var mı?\" sorusunu kapıya gitmeden yanıtlıyor.",
        highlights: [
          { value: "~30 fps", label: "Jetson Nano üzerinde gerçek zamanlı tespit" },
          { value: "%94", label: "giriş-çıkış sayımında doğruluk" },
          { value: "0", label: "kaydedilen görüntü; yalnızca kişi sayısı saklanıyor" },
        ],
        sections: [
          {
            title: "Problem",
            body: "Sınav dönemlerinde öğrenciler kütüphaneye gidip yer bulamadan geri dönüyordu. Doluluğu önceden görmenin bir yolu yoktu.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Girişteki kamera görüntüsü Jetson Nano üzerinde YOLOv8 ile işleniyor. Kişiler takip ediliyor ve sanal bir çizgiyi geçtiklerinde sayılıyor. Sayaç birkaç saniyede bir FastAPI üzerinden panele gönderiliyor.",
          },
          {
            title: "Gizlilik",
            body: "Görüntüler cihazdan hiç çıkmıyor ve kaydedilmiyor. Dışarıya yalnızca anlık kişi sayısı gidiyor.",
          },
          { title: "Sırada ne var", body: "İkinci girişe kamera eklemek ve doluluğu kat kat göstermek." },
        ],
        timeline: [
          { date: "Eyl 2025", text: "Fikir Discord'da paylaşıldı, takım kuruldu" },
          { date: "Kas 2025", text: "İlk prototip laboratuvarda test edildi" },
          { date: "Şub 2026", text: "Kütüphane yönetimiyle pilot çalışma başladı" },
          { date: "Nis 2026", text: "Doluluk paneli herkese açıldı" },
        ],
        team: [
          { name: "Ad Soyad", role: "Görüntü işleme" },
          { name: "Ad Soyad", role: "Donanım" },
          { name: "Ad Soyad", role: "Web paneli" },
        ],
        repo: "",
      },
      {
        slug: "smart-rover",
        name: "Smart Rover",
        category: "Robotik",
        status: "progress",
        description:
          "Mühendislik avlusunu LiDAR SLAM ile kendi başına haritalayan altı tekerlekli gezgin robot. Şu sıralar kaldırımlardan korkmamayı öğreniyor.",
        stack: ["ROS 2", "LiDAR", "Raspberry Pi 5", "C++"],
        visual: "rover",
        started: "Ekim 2025",
        overview:
          "Mühendislik avlusunu kendi başına haritalayan altı tekerlekli bir gezgin robot. LiDAR ile çevresini tarıyor, haritasını çıkarıyor ve bir noktadan diğerine engellere çarpmadan gitmeyi öğreniyor.",
        highlights: [
          { value: "6", label: "tekerlekli rocker-bogie şasi" },
          { value: "360°", label: "LiDAR taraması" },
          { value: "~1,2 km", label: "şimdiye kadarki otonom sürüş" },
        ],
        sections: [
          {
            title: "Neden",
            body: "Gerçek dünyada çalışan bir otonom sistemi uçtan uca kurmak istedik: mekanik, elektronik ve yazılım tek bir takımda.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Raspberry Pi 5 üzerinde ROS 2 çalışıyor. LiDAR verisiyle SLAM yapılıyor, rota Nav2 ile planlanıyor; motor kontrolü ayrı bir mikrodenetleyicide.",
          },
          {
            title: "Şu anki durum",
            body: "Haritalama güvenilir çalışıyor. Kaldırım ve rampa gibi yükseklik farklarını algılamak için bir derinlik kamerası ekleniyor.",
          },
          { title: "Sırada ne var", body: "Kampüs içinde küçük teslimat görevleri." },
        ],
        timeline: [
          { date: "Eki 2025", text: "Şasi tasarımı ve ilk parçalar" },
          { date: "Oca 2026", text: "Uzaktan kumandayla ilk sürüş" },
          { date: "Nis 2026", text: "Avlunun ilk otonom haritası" },
          { date: "Kas 2026", text: "Derinlik kamerası entegrasyonu (planlanıyor)" },
        ],
        repo: "",
      },
      {
        slug: "neural-lab",
        name: "Neural Lab",
        category: "Makine Öğrenmesi",
        status: "live",
        description:
          "Birinci sınıfların küçük sinir ağları eğitip her ağırlık güncellemesini anlık izleyebildiği, tarayıcıda çalışan bir deney alanı.",
        stack: ["TypeScript", "WebGPU", "React"],
        visual: "neural",
        started: "Şubat 2026",
        overview:
          "Tarayıcıda çalışan, kurulum gerektirmeyen bir sinir ağı deney alanı. Birinci sınıflar katmanları sürükleyip bırakarak küçük ağlar kuruyor, eğitimi başlatıyor ve her ağırlığın nasıl değiştiğini canlı izliyor.",
        highlights: [
          { value: "0", label: "kurulum; bir tarayıcı yeterli" },
          { value: "WebGPU", label: "ile tarayıcıda hızlandırılmış eğitim" },
          { value: "3", label: "atölyede ders materyali olarak kullanıldı" },
        ],
        sections: [
          {
            title: "Neden",
            body: "Sinir ağları ilk derste çoğu öğrenciye kara kutu gibi geliyor. İçini görebilecekleri bir araç istedik.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Model ve eğitim döngüsü TypeScript ile yazıldı, matris işlemleri WebGPU üzerinde çalışıyor. Arayüz React ile; her adımda ağırlıklar ve kayıp grafiği güncelleniyor.",
          },
          { title: "Sırada ne var", body: "Evrişimli katmanlar ve hazır veri setleri (MNIST, basit şekiller)." },
        ],
        timeline: [
          { date: "Şub 2026", text: "İlk taslak" },
          { date: "Mar 2026", text: "Eğitim WebGPU'ya taşındı" },
          { date: "Nis 2026", text: "İlk atölyede kullanıldı" },
          { date: "Eyl 2026", text: "Türkçe ve İngilizce arayüz" },
        ],
        repo: "",
      },
      {
        slug: "gesture-interface",
        name: "Gesture Interface",
        category: "Gömülü + ML",
        status: "prototype",
        description: "El hareketlerini klavye kısayollarına çeviren, 40 KB'ın altındaki bir modeli cihaz üzerinde çalıştıran bileklik.",
        stack: ["ESP32-S3", "TinyML", "IMU", "Edge Impulse"],
        visual: "gesture",
        started: "Mayıs 2026",
        overview:
          "Bileğe takılan küçük bir cihaz el hareketlerini tanıyıp bilgisayara klavye kısayolu olarak gönderiyor. Model cihazın üzerinde çalışıyor; internet ya da telefon gerekmiyor.",
        highlights: [
          { value: "< 40 KB", label: "model boyutu" },
          { value: "8", label: "tanınan el hareketi" },
          { value: "~15 ms", label: "hareket başına tanıma süresi" },
        ],
        sections: [
          {
            title: "Neden",
            body: "Sunum yaparken, çizim yaparken ya da elleri doluyken bilgisayarı kontrol etmenin daha doğal bir yolunu arıyorduk.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "ESP32-S3 üzerindeki IMU hareket verisini topluyor. Edge Impulse ile eğitilen küçük bir model hareketi sınıflandırıyor; cihaz Bluetooth klavye gibi davranıp kısayolu gönderiyor.",
          },
          {
            title: "Şu anki durum",
            body: "Prototip masada çalışıyor. Günlük kullanım için pil ömrü ve kasa üzerinde çalışılıyor.",
          },
        ],
        timeline: [
          { date: "May 2026", text: "Fikir ve ilk deneyler" },
          { date: "Haz 2026", text: "12 gönüllüyle hareket verisi toplandı" },
          { date: "Ağu 2026", text: "İlk çalışan prototip" },
          { date: "Ara 2026", text: "3D baskı kasa (planlanıyor)" },
        ],
        repo: "",
      },
    ],
  },

  projectPage: {
    home: "Ana sayfa",
    breadcrumb: "Projeler",
    started: "Başlangıç",
    statusLabel: "Durum",
    teamSize: (n) => `${n} kişi`,
    repo: "Kaynak kodu",
    demo: "Canlı demo",
    highlights: "Öne çıkanlar",
    stack: "Kullanılan teknolojiler",
    timeline: "Zaman çizelgesi",
    team: "Takım",
    join: {
      title: "Bu projede yer almak ister misin?",
      body: "Projelerimiz her dönem yeni üye alıyor; deneyim şart değil. Kulübe katıl ya da kendi fikrinle gel.",
      cta: "Kulübe katıl",
      pitch: "Proje öner",
    },
    next: "Sıradaki proje",
    docTitle: (name) => `${name} | ${club.name}`,
    listDocTitle: `Projeler | ${club.name}`,
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

  soon: {
    headline: ["Çok", "yakında."],
    lead: {
      default: "Bu bağlantı henüz hazır değil.",
      discord: "Discord sunucumuz kuruluyor.",
      linkedin: "LinkedIn sayfamız hazırlanıyor.",
      github: "GitHub organizasyonumuz kuruluyor.",
      instagram: "Bu bağlantı henüz hazır değil.",
    },
    body: "Kulübün yeni kanallarını kuruyoruz. O zamana kadar duyurular ve etkinlikler için bizi Instagram'dan takip et.",
    instagram: "Instagram'da takip et",
    join: "Kulübe katıl",
    home: "Ana sayfaya dön",
    status: {
      title: "durum",
      steps: [
        ["plan", "hazır"],
        ["kurulum", "sürüyor"],
        ["yayın", "sırada"],
      ],
    },
    sticker: `Çok yakında / ${club.semester} / `,
  },

  notFound: {
    title: `Sayfa bulunamadı | ${club.name}`,
    lead: "Bu sayfayı algılayamadık.",
    body: "Bağlantı eskimiş ya da adres yanlış yazılmış olabilir. Aradığın şey büyük ihtimalle ana sayfada.",
    home: "Ana sayfaya dön",
    projects: "Projelere göz at",
    quickLinks: "Belki şunlardan biri:",
    camera: { feed: "cam_01 / site", scanning: "aranıyor", box: "sayfa 0.00", empty: "nesne bulunamadı", chip: "0 sonuç" },
  },
};
