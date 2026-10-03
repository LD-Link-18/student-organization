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
      "Üniversite için bir asistandan sentetik veri üreten bir trafik simülasyonuna kadar. Her proje bir fikirle başladı ve bir öğrenci takımının elinde şekillendi.",
    pitch: "Proje öner",
    stackLabel: "Kullanılan teknolojiler",
    statusLabel: "Durum: ",
    status: { done: "Tamamlandı", progress: "Devam ediyor", prototype: "Prototip" },
    view: "Projeyi incele",
    // Description, team and status are real. PLACEHOLDER: stack, dates, highlights, sections and timeline
    // below are drafted around them; replace with the project's real details.
    items: [
      {
        slug: "koubot",
        name: "KOUBOT",
        category: "Doğal Dil İşleme",
        status: "done",
        description:
          "Üniversite için hazırlanmış, RAG tabanlı bir asistan. Öğrencilerin sorularını üniversitenin belgelerinde bulduğu kaynaklara dayanarak yanıtlıyor; dayandığı kaynağı da gösteriyor.",
        stack: ["Python", "RAG", "LLM", "Vektör veritabanı"],
        visual: "koubot",
        started: "Kasım 2025",
        overview:
          "KOUBOT, üniversiteyle ilgili soruları sohbet ederek yanıtlayan bir asistan. Bir dil modeline tek başına güvenmek yerine önce üniversitenin kendi belgelerinde ilgili bölümleri buluyor, yanıtını yalnızca bu kaynaklara dayandırıyor. Böylece cevaplar hem güncel kalıyor hem de doğrulanabiliyor.",
        highlights: [
          { value: "RAG", label: "yanıtlar üniversite belgelerine dayanıyor" },
          { value: "4", label: "kişilik takım" },
          { value: "7/24", label: "öğrencilerin sorularına açık" },
        ],
        sections: [
          {
            title: "Problem",
            body: "Öğrenciler yönetmelikleri, duyuruları ve kampüs bilgilerini birden fazla yerde, uzun belgelerin içinde arıyor. Basit bir soru için bile doğru sayfayı bulmak zaman alıyor.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Belgeler parçalara ayrılıp vektörlere dönüştürülerek bir veritabanında saklanıyor. Bir soru geldiğinde en alakalı parçalar bulunuyor ve dil modeline bağlam olarak veriliyor. Model yalnızca bu bağlamdan yanıt üretiyor ve dayandığı kaynağı gösteriyor.",
          },
          {
            title: "Neden RAG",
            body: "Dil modelleri bilmedikleri bir şeyi de akıcı biçimde anlatabilir. Yanıtları belgelere bağlamak hata riskini azaltıyor ve her cevabın nereden geldiğini denetlenebilir kılıyor.",
          },
          {
            title: "Sonuç",
            body: "Proje tamamlandı. Asistan, belge havuzuna yeni içerik eklendikçe güncel kalacak şekilde tasarlandı.",
          },
        ],
        timeline: [
          { date: "Kas 2025", text: "Fikir ve takım kuruldu" },
          { date: "Oca 2026", text: "İlk prototip: belgelerin indekslenmesi" },
          { date: "Mar 2026", text: "Öğrencilerle deneme kullanımı" },
          { date: "May 2026", text: "Proje tamamlandı" },
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
        category: "Bilgisayarlı Görü",
        status: "done",
        description:
          "Bir ekran görüntüsündeki el yazısına bakarak yazarın kim olduğunu tespit eden bir sistem. Her yazarın kendine özgü yazı tarzını öğrenip eşleştiriyor.",
        stack: ["Python", "PyTorch", "OpenCV", "CNN"],
        visual: "scribble",
        started: "Aralık 2025",
        overview:
          "ScribbleMind, bir ekran görüntüsündeki el yazısını ayıklayıp kimin yazdığını tahmin ediyor. Harflerin biçimi, eğimi, baskısı ve boşlukları gibi her yazara özgü ayrıntıları öğrenerek, bilinen yazarlar arasından en olası kişiyi güven skoruyla birlikte buluyor.",
        highlights: [
          { value: "1", label: "ekran görüntüsünden yazar tahmini" },
          { value: "CNN", label: "yazı tarzını öğrenen derin ağ" },
          { value: "4", label: "kişilik takım" },
        ],
        sections: [
          {
            title: "Problem",
            body: "El yazısı kişiye özgüdür, ama bir yazıya bakıp kimin yazdığını söylemek uzmanlık ister ve yavaştır. Dijital ortamda paylaşılan ekran görüntüleri işi daha da zorlaştırıyor: çözünürlük, ışık ve arka plan çok değişken.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Önce görüntüdeki yazı bölgeleri tespit edilip temizleniyor. Ardından bir derin öğrenme modeli her yazı parçasından yazarı tanımlayan bir iz (özellik vektörü) çıkarıyor. Bu iz bilinen yazarların izleriyle karşılaştırılıyor ve en yakın eşleşme güven skoruyla döndürülüyor.",
          },
          {
            title: "Zorluklar",
            body: "Farklı ekran boyutları, sıkıştırma ve gürültü modelin işini zorlaştırıyor. Bunun için veri çoğaltma ve ön işleme adımları sistemin önemli bir parçası haline geldi.",
          },
          {
            title: "Sonuç",
            body: "Proje tamamlandı. Sistem, bilinen yazarlar için bir ekran görüntüsünden tahmin üretebiliyor.",
          },
        ],
        timeline: [
          { date: "Ara 2025", text: "Problem tanımı ve veri toplama" },
          { date: "Şub 2026", text: "İlk model eğitildi" },
          { date: "Nis 2026", text: "Ekran görüntüleri için ön işleme ve iyileştirme" },
          { date: "Haz 2026", text: "Proje tamamlandı" },
        ],
        team: [
          { name: "Batın Dikilitaş" },
          { name: "Samet Mert Dik" },
          { name: "Zübeyde Bozkurt" },
          { name: "Cafer Berat Gülsoy" },
        ],
      },
      {
        slug: "traffic-sim",
        name: "Trafik Simülasyonu",
        category: "Simülasyon",
        status: "progress",
        description:
          "Sentetik veri üretmek için kurulan, uçtan uca kapsamlı bir trafik simülasyonu. Yol ağından araç davranışına, sensör verisinden etiketli çıktıya kadar tüm süreci tek çatı altında topluyor.",
        stack: ["Python", "Simülasyon", "Sentetik veri", "Veri etiketleme"],
        visual: "traffic",
        started: "Mart 2026",
        overview:
          "Gerçek trafik verisi toplamak pahalı, yavaş ve çoğu zaman gizlilik sorunları taşıyor. Bu proje ihtiyaç duyulan veriyi bir simülasyonda üretmeyi hedefliyor: yollar, araçlar, kavşaklar ve sensörler sanal ortamda kuruluyor, sistem de çıktısını etiketli bir veri seti olarak veriyor.",
        highlights: [
          { value: "Uçtan uca", label: "yol ağından etiketli veriye tek boru hattı" },
          { value: "Sentetik", label: "gerçek trafik verisi toplamadan üretilen veri" },
          { value: "2", label: "kişilik takım" },
        ],
        sections: [
          {
            title: "Problem",
            body: "Trafikle ilgili modeller eğitmek için çok sayıda etiketli veri gerekiyor. Gerçek dünyadan bunu toplamak hem maliyetli hem de nadir senaryolar (kaza, yoğun saat) için neredeyse imkânsız.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Simülasyon dört katmandan oluşuyor: yol ağı, araç davranışı, sensörler ve çıktı. Yollar ve kavşaklar tanımlanıyor, araçlar bu ağ üzerinde kurallara göre hareket ediyor, sanal sensörler olanları kaydediyor ve kayıtlar etiketli veri olarak dışa aktarılıyor.",
          },
          {
            title: "Şu anki durum",
            body: "Temel bileşenler kuruldu ve birbirine bağlanıyor. Takım şimdi sensör verisinin gerçekçiliğini ve senaryo çeşitliliğini artırmaya odaklanıyor.",
          },
          { title: "Sırada ne var", body: "Etiketli veri setini standart bir biçimde dışa aktarmak ve üretilen verinin başka modellerde işe yaradığını göstermek." },
        ],
        timeline: [
          { date: "Mar 2026", text: "Proje planlandı" },
          { date: "May 2026", text: "Yol ağı ve araç davranışı modeli" },
          { date: "Eyl 2026", text: "Sensör verisi üretimi" },
          { date: "Ara 2026", text: "Etiketli veri setinin dışa aktarımı (planlanıyor)" },
        ],
        team: [{ name: "Rümeysa Yeşilova" }, { name: "Ahmet Yusuf Şimşek" }],
      },
      {
        slug: "quill",
        name: "Quill",
        category: "Derin Öğrenme",
        status: "progress",
        description:
          "Uzun kitap metinlerini parçalara bölüp indeksleyen ve okuyucunun kaldığı yere kadar olan kısmı spoiler vermeden hatırlatan, RAG tabanlı bir derin öğrenme sistemi.",
        stack: ["Python", "PyTorch", "RAG", "Embedding"],
        visual: "quill",
        started: "Ağustos 2026",
        overview:
          "Uzun bir romana bir süre ara verdiğinde \"neredeydik?\" sorusu kaçınılmaz. Quill, kitabın metnini parçalara bölüp anlamlarıyla birlikte indeksliyor ve okuyucunun kaldığı yere kadar olan olayları, karakterleri ve ilişkileri hatırlatıyor. Sonrasında geçen hiçbir şeyi ifşa etmeden.",
        highlights: [
          { value: "0", label: "spoiler: kaldığın yerden sonrası modele hiç gösterilmez" },
          { value: "RAG", label: "kitaptan getirilen parçalara dayalı hatırlatma" },
          { value: "1", label: "kişilik takım" },
        ],
        sections: [
          {
            title: "Problem",
            body: "Uzun kitaplar bir dil modelinin bağlam penceresine sığmıyor. Üstelik kitabı özetletmek, okuyucunun henüz görmediği bölümleri de ele verme riski taşıyor.",
          },
          {
            title: "Nasıl çalışıyor",
            body: "Kitap bölümlere ve paragraflara ayrılıyor, her parça kitaptaki konumuyla birlikte indeksleniyor. Okuyucunun kaldığı yer belli olduğunda arama yalnızca bu konumdan önceki parçalar arasında yapılıyor; sonrası modele hiç gösterilmiyor. Spoiler koruması bu filtreyle sağlanıyor.",
          },
          {
            title: "Zorluklar",
            body: "Parçalama stratejisi sonucu doğrudan etkiliyor: çok küçük parçalar bağlamı kaybettiriyor, çok büyükler gereksiz bilgi taşıyor. Proje şu an bu dengeyi bulmaya odaklanıyor.",
          },
          { title: "Sırada ne var", body: "Karakter ve olay ilişkilerini çıkaran bir katman eklemek ve sistemi birkaç farklı kitapla denemek." },
        ],
        timeline: [
          { date: "Ağu 2026", text: "Fikir ve ilk araştırma" },
          { date: "Eyl 2026", text: "Metin parçalama ve indeksleme prototipi" },
          { date: "Kas 2026", text: "Spoiler korumalı hatırlatma testleri (planlanıyor)" },
          { date: "Oca 2027", text: "İlk demo (planlanıyor)" },
        ],
        team: [{ name: "Samet Mert Dik" }],
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
    rsvpClosed: " (şu an kapalı)",
    items: [
      {
        day: "13–15",
        month: "Eki",
        title: "Stant Haftası",
        category: "Stant",
        description:
          "Üç gün boyunca stantımızdayız. Projelerimizi yakından görmek, kulübü tanımak ve aklındaki her şeyi sormak için yanımıza uğramayı unutma!",
        place: "Umuttepe",
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
      { name: "Samet Mert Dik", focus: "doğal dil işleme", avatar: 0, href: "https://sametmertdik.com" },
      { name: "Abdullah Naim Yolaçan", focus: "robotik ve ROS 2", avatar: 1, href: "https://naimyolacan.com" },
      { name: "Batın Dikilitaş", focus: "görüntü işleme", avatar: 2, href: "https://www.linkedin.com/in/batın-dikilitaş" },
      { name: "Ahmet Yusuf Şimşek", focus: "nesnelerin interneti", avatar: 3, href: "https://www.linkedin.com/in/ahmet-yusuf-şimşek-316136326" },
      { name: "Rümeysa Yeşilova", focus: "pekiştirmeli öğrenme", avatar: 4, href: "https://www.linkedin.com/in/rümeysa-yeşilova-528917376" },
      { name: "Sudenaz Güven", focus: "görüntü işleme", avatar: 5, href: "https://www.linkedin.com/in/sudenaz-güven-bb202933b" },
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
    body: "Bir üretim gecesine gel. Bilgisayarını getir ya da getirme; boşta bir yer mutlaka vardır. Sevdiysen kal.",
    primary: "Kulübe katıl",
    secondary: "Discord'da selam ver",
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
