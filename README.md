# 🔬 PANTreat: Karbon Elyaf Termokimyasal Ön İşlem & Tekno-Ekonomik Dijital İkiz Platformu

Bu uygulama, **TÜBİTAK 1071 / IraSME** uluslararası Ar-Ge çağrısı kapsamında hazırlanan **"PANTreat: Termokimyasal ön işlem kullanarak karbon elyaf maliyetlerini düşürmek için bir üretim teknolojisinin geliştirilmesi"** projesinin tüm mühendislik hesaplamalarını, kinetik modellerini ve iş paketlerini içeren etkileşimli bir simülasyon ve analiz platformudur.

---

## 🎯 Projenin Bilimsel ve Endüstriyel Hedefleri

- **Zaman Tasarrufu**: Konvansiyonel 4 fırınlı (120 dakika) stabilizasyon sürecinden 1. Fırının atlanmasıyla sürenin **92 dakikaya (%25+ azalma)** indirilmesi.
- **Enerji Tasarrufu**: Stabilizasyon fırınlarının enerji tüketiminde **%20 net MWh tasarrufu**.
- **Maliyet Azaltımı**: Toplam karbon elyaf maliyetinde **%10 düşüş** (1.500 ton/yıl kapasitede tesis başına **3.750.000 € / Yıl** brüt kazanç).
- **Mekanik İyileşme**: Karbon elyaf çekme dayanımı ve elastisite modülünde **%10 artış**.
- **$CO_2$ Emisyon Azaltımı**: Yıllık **2.000+ Ton $CO_2$** salınımının engellenmesi.

---

## 📂 Proje Dizin Yapısı

```
pantreat-app/
├── index.html              # Ana kontrol paneli, 5 modüllü arayüz ve şematik hat akışı
├── style.css               # Endüstriyel cam panel (glassmorphism) stilleri ve responsive düzen
├── README.md               # Teknik dokümantasyon ve kullanım kılavuzu
└── js/
    ├── config.js           # Proje sabitleri, konsorsiyum ortakları, WP1-WP8 verileri
    ├── simulator.js        # Termal stabilizasyon kinetiği, DSC entalpi ve S(%) simülasyonu
    ├── economics.js        # Tekno-ekonomik maliyet, enerji tüketimi ve CO2 emisyon hesap motoru
    ├── bioCoating.js       # Marmara & BCD ESBO/AESBO/TDI-HEMA stokiyometri ve UV kürleme motoru
    ├── plantTwin.js        # Dozajlama, filtreleme ve tahrik sistemi dijital ikiz simülasyonu
    └── app.js              # Sekme geçişleri, Chart.js grafik yönetimi ve dışa aktarım
```

---

## 🧩 Uygulama Modülleri

### 1. 🔬 Termal Stabilizasyon & Kinetik Simülatörü
- Ön işlem kimyasalları ($KMnO_4$, $N_2$, $H_2O_2$, Biyo-çözelti), hat hızı (0-5 m/dk pilot / 10-20 m/dk endüstriyel), gerdirme oranı (%0-15) ve banyo sıcaklığı (40-90 °C) parametreleri.
- 1. Fırın bypass seçeneği ile Geleneksel vs PANTreat $S(\%)$ stabilizasyon derecesi ve sıcaklık profili karşılaştırması.

### 2. 📊 Tekno-Ekonomik Maliyet & $CO_2$ Analizörü
- 1.500 ton/yıl endüstriyel üretim hattı bazında kg başına maliyet düşüşü (2.50 €/kg), net yıllık kazanç (3.36 M€) ve yatırım amortisman süresi (3.4 Ay).
- Geleneksel vs PANTreat maliyet bileşenleri dağılım grafiği.

### 3. 🧪 Biyo-Bazlı Kaplama & ESBO Stokiyometrisi (Marmara Üniversitesi & BCD)
- Epoksidize Soya Yağı (ESBO) + Akrilik Asit (AA) + TDI-HEMA Adduct reaksiyon stokiyometrisi.
- UV foto-kürlenme dozu ($mJ/cm^2$), jel oranı (%96+), kalem sertliği (3H) ve korozyon dayanım skoru.

### 4. ⚙️ Modüler Tesis Dijital İkizi (3WIN & Herberger)
- Omega sürücülü hat gerilimi, cam kimyasal banyo, otomatik dozaj pompası, pH, iletkenlik ($mS/cm$), bulanıklık ($NTU$) ve filtre basınç farkı canlı telemetrisi.

### 5. 🤝 Konsorsiyum & İş Paketleri Yönetimi (TÜBİTAK/IraSME WP1 - WP8)
- 7 ortak (RWTH Aachen ITA, 3WIN, Herberger, BCD, Marmara Üniversitesi, ONEJOON, DowAksa).
- 168.9 Kişi-Ay (Person-Months) efor dağılımı, teslimatlar (D1.1 - D8.1) ve kilometre taşları (M1 - M4).

---

## 🚀 Nasıl Çalıştırılır?

1. `pantreat-app/index.html` dosyasına çift tıklayarak herhangi bir modern web tarayıcısında açabilirsiniz.
2. Veya bir yerel HTTP sunucusu ile çalıştırmak isterseniz:
   ```bash
   cd pantreat-app
   python -m http.server 8081
   ```
   tarayıcınızdan `http://localhost:8081` adresine gidin.
