/**
 * PANTreat Platform - Global Configuration & Consortium Database
 * Derived from TÜBİTAK / IraSME Application Form
 */

const PANTREAT_CONFIG = {
  project: {
    acronym: "PANTreat",
    titleTr: "Termokimyasal ön işlem kullanarak karbon elyaf maliyetlerini düşürmek için bir üretim teknolojisinin geliştirilmesi",
    titleEn: "Development of a production technology to reduce carbon fiber costs using thermochemical pretreatment",
    call: "IraSME / TÜBİTAK 1071 Uluslararası Ortaklı Ar-Ge",
    durationMonths: 24,
    totalBudget: 1083657,
    requestedFunding: 650613,
    baselineCapacityTpa: 1500, // 1500 tons/year
    baselinePricePerKg: 25.0,  // 25 €/kg
    baselineCostReductionPercent: 10.0, // 10%
    targetEnergyReductionPercent: 20.0, // 20%
    targetTimeReductionPercent: 25.0,   // 25% (120 min -> 92 min)
    targetMechanicalGainPercent: 10.0,  // 10% tensile strength & modulus
    annualSavingsEuro: 3750000          // 3.75 Million €/year
  },

  partners: [
    {
      id: 1,
      country: "Almanya",
      flag: "🇩🇪",
      name: "RWTH Aachen Üniversitesi Tekstil Mühendisliği Enstitüsü (ITA)",
      shortName: "ITA",
      type: "RTO (Araştırma Enstitüsü)",
      pi: "Tim Röding",
      budget: 219948,
      requested: 219948,
      effortPM: 32.7,
      roleDescription: "Proje koordinasyonu, laboratuvar ön işlem deneyleri, elyaf karakterizasyonu (gazpiknometri, TGA, WAXD, çekme testi), stabilizasyon/karbonizasyon adaptasyonu ve tekno-ekonomik maliyet hesaplama aracı."
    },
    {
      id: 2,
      country: "Almanya",
      flag: "🇩🇪",
      name: "3WIN Maschinenbau GmbH",
      shortName: "3WIN",
      type: "KOBİ (SME)",
      pi: "Daniel Kaußen",
      budget: 367653,
      requested: 165444,
      effortPM: 34.7,
      roleDescription: "Tesis teknolojisi liderliği, 3 adet omega sürücülü tahrik sistemi, temperleme ünitesi, infrared/konveksiyon kurutma ve egzoz davlumbazı tasarımı, endüstriyel ölçekleme konsepti (WP8 lideri)."
    },
    {
      id: 3,
      country: "Almanya",
      flag: "🇩🇪",
      name: "Herberger Wasseraufbereitung GmbH",
      shortName: "HW",
      type: "KOBİ (SME)",
      pi: "Thomas Henzler",
      budget: 396056,
      requested: 178225,
      effortPM: 43.4,
      roleDescription: "İşleme ünitesi (proses ünitesi) liderliği, pH/iletkenlik/bulanıklık sensörlü kimyasal ölçüm ve dozajlama sistemi, kimyasal geri dönüşüm ve elyaf filtrasyon devresi (WP5 lideri)."
    },
    {
      id: 4,
      country: "Türkiye",
      flag: "🇹🇷",
      name: "BCD",
      shortName: "BCD",
      type: "KOBİ (SME)",
      pi: "Barış Doğan",
      budget: 55000,
      requested: 42000,
      effortPM: 30.6,
      roleDescription: "Kimyasallara ve bükülmeye dayanıklı fiber kılavuzlama şasisi, rulmanlı yönlendirme makaraları mekanik üretimi, yüzey pürüzlendirme ve biyo-bazlı kaplama uygulaması (WP4 ortak lideri)."
    },
    {
      id: 5,
      country: "Türkiye",
      flag: "🇹🇷",
      name: "Marmara Üniversitesi Tekstil Mühendisliği Bölümü",
      shortName: "Marmara",
      type: "RTO (Üniversite)",
      pi: "Prof. Dr. Erhan Sancak",
      budget: 45000,
      requested: 45000,
      effortPM: 27.5,
      roleDescription: "Soya fasulyesi yağından (ESBO) biyo-bazlı UV foto-kürlenebilir poliüretan (AESBO + TDI-HEMA) kaplama sentezi, DSC, FTIR, SEM yapısal analizleri ve korozyon direnci testleri."
    },
    {
      id: 6,
      country: "Almanya",
      flag: "🇩🇪",
      name: "ONEJOON GmbH",
      shortName: "ONEJOON",
      type: "İlişkili Ortak (Büyük Ölçekli)",
      pi: "Lars Meinecke",
      budget: 0,
      requested: 0,
      effortPM: 0,
      roleDescription: "Endüstriyel fırın ve karbonizasyon sistemleri uzmanlığı, tesis tasarımı ve fırın entegrasyonu danışmanlığı."
    },
    {
      id: 7,
      country: "Türkiye",
      flag: "🇹🇷",
      name: "DowAksa Advanced Composites",
      shortName: "DowAksa",
      type: "İlişkili Ortak (Büyük Ölçekli)",
      pi: "Hatice Eyvaz",
      budget: 0,
      requested: 0,
      effortPM: 0,
      roleDescription: "Dünyanın önde gelen karbon elyaf üreticisi olarak endüstriyel ölçekleme, öncül lif tedariği ve ticari validasyon."
    }
  ],

  workPackages: [
    {
      id: "WP1",
      title: "Spesifikasyon Profilinin Tanımı",
      startMonth: 1,
      endMonth: 4,
      duration: 4,
      lead: "3WIN",
      effortPM: 16.5,
      deliverables: ["D1.1 - Şartname sayfası (Ay 4)"],
      description: "Ön arıtma tesisi gereksinimlerinin belirlenmesi, 2 adet ticari PAN prekürsörünün seçilmesi ve kıyaslama (benchmark) sürecinin tanımlanması."
    },
    {
      id: "WP2",
      title: "Ön Arıtma Yöntemi Seçimi (Laboratuvar)",
      startMonth: 2,
      endMonth: 7,
      duration: 6,
      lead: "ITA",
      effortPM: 6.3,
      deliverables: ["D2.1 - Laboratuvar sonuçları ve seçilen 2 ön arıtma yöntemi (Ay 7)"],
      description: "4 farklı ön işlem yönteminin (N2, KMnO4, H2O2, biyo-çözelti) laboratuvar ölçeğinde taranması, DSC/FTIR/TGA ile 2 en iyi yöntemin seçilmesi."
    },
    {
      id: "WP3",
      title: "Modüler Ön Arıtma Tesisi Temel Bileşenleri",
      startMonth: 4,
      endMonth: 12,
      duration: 9,
      lead: "3WIN",
      effortPM: 26.7,
      deliverables: ["D3.1 - Tahrik sistemi ve taban çerçevesi (Ay 11)", "D3.2 - Cam banyo konteyneri, temperleme, kurutma ve egzoz sistemi (Ay 12)"],
      description: "3 omega sürücülü tahrik ünitesi (0-5 m/dk), cam banyo kabı, ısıtma ceketi/akış ısıtıcısı ve egzoz davlumbazının imalatı."
    },
    {
      id: "WP4",
      title: "Modüler Fiber Kılavuz ve Biyo-Kaplama Sistemi",
      startMonth: 4,
      endMonth: 12,
      duration: 9,
      lead: "BCD & Marmara",
      effortPM: 15.7,
      deliverables: ["D4.1 - Fiber yönlendirme taban şasisi (Ay 11)", "D4.2 - Biyo-bazlı foto-kürlenebilir kaplama sistemi (Ay 12)"],
      description: "BCD tarafından yönlendirme makaralı şasinin üretimi; Marmara tarafından ESBO+AA+TDI-HEMA biyo-kaplamanın sentezlenip parçalara uygulanması."
    },
    {
      id: "WP5",
      title: "Modüler İşlem / Dozajlama Ünitesinin Geliştirilmesi",
      startMonth: 4,
      endMonth: 13,
      duration: 10,
      lead: "HW",
      effortPM: 33.35,
      deliverables: ["D5.1 - Kimyasal ölçüm ve sensör sistemi (Ay 11)", "D5.2 - Besleme, geri dönüş ve filtrasyon ünitesi (Ay 13)"],
      description: "pH/iletkenlik tabanlı kimyasal konsantrasyon ölçümü, otomatik dozajlama pompaları ve kopan elyaf filamentlerini süzen filtrasyon sistemi."
    },
    {
      id: "WP6",
      title: "Komple Ön Arıtma Tesisinin Montajı ve Sürekli Proses",
      startMonth: 11,
      endMonth: 16,
      duration: 6,
      lead: "ITA",
      effortPM: 24.45,
      deliverables: ["D6.1 - Ön arıtma tesisi test protokolü (Ay 15)", "D6.2 - Sürekli ön arıtma proses parametreleri (Ay 16)"],
      description: "Tüm alt bileşenlerin ITA'da birleştirilmesi, PAN lifleri ile hat hızı, sıcaklık, gerdirme ve banyo konsantrasyonunun kalibrasyonu."
    },
    {
      id: "WP7",
      title: "Kısaltılmış Termal Dönüşüm Süreci ve Maliyet Hesabı",
      startMonth: 14,
      endMonth: 24,
      duration: 11,
      lead: "ITA",
      effortPM: 16.9,
      deliverables: ["D7.1 - Kısaltılmış stabilizasyon proses protokolü (Ay 24)", "D7.2 - Enerji ve kg karbon elyaf maliyet analizi (Ay 24)"],
      description: "1. Fırın bölümünün atlanması (%25 zaman, %20 enerji tasarrufu), mekanik testler ve 1.500 t/yıl için tekno-ekonomik maliyet hesaplama aracı."
    },
    {
      id: "WP8",
      title: "Endüstriyel Ölçek İçin Konsept Geliştirme",
      startMonth: 19,
      endMonth: 24,
      duration: 6,
      lead: "3WIN",
      effortPM: 29.0,
      deliverables: ["D8.1 - 10-20 m/dk ve 175 eşzamanlı lif için endüstriyel uygulama konsepti (Ay 24)"],
      description: "DowAksa ve ONEJOON desteğiyle prosesin büyük ölçekli üretim hatlarına entegrasyonu ve 175 çekici (tow) kapasiteli tasarım."
    }
  ],

  milestones: [
    { id: "M1", month: 4, wp: "WP1", title: "Gereksinim Şartnamesi Tanımlandı", status: "Tamamlandı" },
    { id: "M2", month: 13, wp: "WP2-5", title: "Tüm Tesis Alt Bileşenlerinin Üretimi Tamamlandı", status: "Tamamlandı" },
    { id: "M3", month: 16, wp: "WP6", title: "Komple Tesis Montajı & Sürekli Proses Validasyonu", status: "Devam Ediyor" },
    { id: "M4", month: 24, wp: "WP7-8", title: "Stabilizasyon Süresinde %25 & Enerjide %20 Tasarruf Doğrulandı", status: "Hedef" }
  ]
};
