// data/products.ts
import { Language } from './translations';

export type LocalizedText = { [key in Language]?: string };
export type LocalizedList = { [key in Language]?: string[] };

export interface Product {
  id: string;
  sku: string;
  category: 'collagen' | 'complexes' | 'vitamins' | 'amino';
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string;
  weight: string;
  sticks: number;
  stickWeight: string;
  badges: LocalizedList;
  composition: LocalizedList;
  basePriceUZS: number; // Единая базовая цена в сумах
  subscriptionDiscount: number;
}

export function tText(text: LocalizedText | undefined, lang: Language = 'ru'): string {
  if (!text) return '';
  return text[lang] || text.ru || text.en || '';
}

export function tList(list: LocalizedList | undefined, lang: Language = 'ru'): string[] {
  if (!list) return [];
  return list[lang] || list.ru || list.en || [];
}

export const PRODUCTS: Product[] = [
  // 1. COLLAGEN KOMPLEX (Тёмная коробка 336 г)
  {
    id: "collagen-komplex-box",
    sku: "AG-CK-336-BOX",
    category: "complexes",
    title: {
      ru: "Collagen Komplex (Box Edition)",
      en: "Collagen Komplex (Box Edition)",
      tr: "Collagen Komplex (Kutu Serisi)",
      uz: "Collagen Komplex (Quti nashri)",
      de: "Collagen Komplex (Box Edition)"
    },
    subtitle: {
      ru: "Усиленный комплекс — 30 стиков по 11.2 г (336 г)",
      en: "Enhanced Beauty Formula — 30 sticks of 11.2g (336g)",
      tr: "Güçlendirilmiş Güzellik Formülü — 30 saşe x 11.2g (336g)",
      uz: "Kuchaytirilgan go'zallik majmuasi — 30 stik 11.2g (336g)",
      de: "Verstärkte Beauty-Formel — 30 Sticks à 11,2g (336g)"
    },
    image: "/images/products/collagen-komplex-box.jpg",
    weight: "336 г",
    sticks: 30,
    stickWeight: "11.2 г",
    badges: {
      ru: ["336 г / 30 стиков", "HALAL", "GMP & HACCP", "10 000 мг Пептиды"],
      en: ["336g / 30 sticks", "HALAL", "GMP & HACCP", "10,000 mg Peptides"],
      tr: ["336g / 30 saşe", "HALAL", "GMP & HACCP", "10.000 mg Peptit"],
      uz: ["336g / 30 stik", "HALAL", "GMP & HACCP", "10 000 mg Peptidlar"],
      de: ["336g / 30 Sticks", "HALAL", "GMP & HACCP", "10.000 mg Peptide"]
    },
    composition: {
      ru: [
        "Пептиды коллагена (I и III тип) — 10 000 мг",
        "Гиалуроновая кислота — 120 мг",
        "Витамин C — 150 мг + Коэнзим Q10 — 100 мг",
        "Биотин (B7) — 5000 мкг + Витамин E — 12 мг",
        "Цинк — 10 мг + Селен — 70 мкг",
        "30 порционных саше по 11.2 г"
      ],
      en: [
        "Collagen Peptides (Type I & III) — 10,000 mg",
        "Hyaluronic Acid — 120 mg",
        "Vitamin C — 150 mg + Coenzyme Q10 — 100 mg",
        "Biotin (B7) — 5000 mcg + Vitamin E — 12 mg",
        "Zinc — 10 mg + Selenium — 70 mcg",
        "30 single-serve sachets of 11.2 g"
      ],
      tr: [
        "Kolajen Peptitleri (Tip I ve III) — 10.000 mg",
        "Hyaluronik Asit — 120 mg",
        "C Vitamini — 150 mg + Koenzim Q10 — 100 mg",
        "Biyotin (B7) — 5000 mcg + E Vitamini — 12 mg",
        "Çinko — 10 mg + Selenyum — 70 mcg",
        "30 adet 11.2 g saşe"
      ],
      uz: [
        "Kollagen peptidlar (I va III tur) — 10 000 mg",
        "Gialuron kislotasi — 120 mg",
        "C vitamini — 150 mg + Koenzim Q10 — 100 mg",
        "Biotin (B7) — 5000 mkg + E vitamini — 12 mg",
        "Sink — 10 mg + Selen — 70 mkg",
        "30 dona 11.2 g stiklar"
      ],
      de: [
        "Kollagenpeptide (Typ I & III) — 10.000 mg",
        "Hyaluronsäure — 120 mg",
        "Vitamin C — 150 mg + Coenzyme Q10 — 100 mg",
        "Biotin (B7) — 5000 mcg + Vitamin E — 12 mg",
        "Zink — 10 mg + Selen — 70 mcg",
        "30 Einzelportione-Sachets à 11,2 g"
      ]
    },
    basePriceUZS: 435000,
    subscriptionDiscount: 10
  },

  // 2. BEAUTY COLLAGEN (Светлая коробка 300 г)
  {
    id: "beauty-collagen-box",
    sku: "AG-BC-300-BOX",
    category: "collagen",
    title: {
      ru: "Beauty Collagen (Box Edition)",
      en: "Beauty Collagen (Box Edition)",
      tr: "Beauty Collagen (Kutu Serisi)",
      uz: "Beauty Collagen (Quti nashri)",
      de: "Beauty Collagen (Box Edition)"
    },
    subtitle: {
      ru: "100% чистые пептиды — 30 стиков по 10 г (300 г)",
      en: "100% Pure Bovine Peptides — 30 sticks of 10g (300g)",
      tr: "%100 Saf Sığır Kolajen Peptitleri — 30 saşe x 10g (300g)",
      uz: "100% sof qoramol kollagen peptidlari — 30 stik 10g (300g)",
      de: "100% reine Rinderkollagen-Peptide — 30 Sticks à 10g (300g)"
    },
    image: "/images/products/beauty-collagen-box.jpg",
    weight: "300 г",
    sticks: 30,
    stickWeight: "10 г",
    badges: {
      ru: ["300 г / 30 стиков", "100% Bovine", "HALAL Certified", "Sugar Free"],
      en: ["300g / 30 sticks", "100% Bovine", "HALAL Certified", "Sugar Free"],
      tr: ["300g / 30 saşe", "%100 Sığır", "HALAL Sertifikalı", "Şekersiz"],
      uz: ["300g / 30 stik", "100% Qoramol", "HALAL Sertifikatlangan", "Shakarsiz"],
      de: ["300g / 30 Sticks", "100% Rind", "HALAL Zertifiziert", "Zuckerfrei"]
    },
    composition: {
      ru: [
        "100% гидролизованные пептиды говяжьего коллагена (Тип I & III)",
        "9.2 г белка и всего 36 ккал в одном стике (10 г)",
        "Аминокислотный профиль: Глицин (23г/100г), Пролин, Аланин",
        "Без сахара, без ГМО и синтетических ароматизаторов",
        "30 порционных стиков по 10 г"
      ],
      en: [
        "100% Hydrolyzed Bovine Collagen Peptides (Type I & III)",
        "9.2 g Protein and only 36 kcal per stick (10 g)",
        "Rich Amino Acid Profile: Glycine (23g/100g), Proline, Alanine",
        "Sugar-Free, Non-GMO & No artificial flavors",
        "30 single-serve sticks of 10 g"
      ],
      tr: [
        "%100 Hidrolize Sığır Kolajen Peptitleri (Tip I ve III)",
        "Saşe başına 9.2 g Protein ve sadece 36 kcal (10 g)",
        "Zengin Amino Asit Profili: Glisin, Prolin, Alanin",
        "Şekersiz, GDO'suz ve yapay aroma içermez",
        "30 adet 10 g saşe"
      ],
      uz: [
        "100% gidrolizlangan qoramol kollagen peptidlari (I va III tur)",
        "Bitta stikda 9.2 g oqsil va atigi 36 kkal (10 g)",
        "Boy aminokislotalar profili: Glitsin, Prolin, Alanin",
        "Shakarsiz, GMOsiz va xushbo'ylagichlarsiz",
        "30 dona 10 g stiklar"
      ],
      de: [
        "100% Hydrolysierte Rinderkollagen-Peptide (Typ I & III)",
        "9,2 g Protein und nur 36 kcal pro Stick (10 g)",
        "Reiches Aminosäurenprofil: Glycin, Prolin, Alanin",
        "Zuckerfrei, ohne Gentechnik & ohne künstliche Aromen",
        "30 Portionssticks à 10 g"
      ]
    },
    basePriceUZS: 390000,
    subscriptionDiscount: 10
  },

  // 3. Collagen Beauty Complex (Банка 336 г)
  {
    id: "beauty-complex-tin",
    sku: "AG-BC-336-TIN",
    category: "complexes",
    title: {
      ru: "Collagen Beauty Complex (Банка)",
      en: "Collagen Beauty Complex (Jar)",
      tr: "Collagen Beauty Complex (Kavanoz)",
      uz: "Collagen Beauty Complex (Banka)",
      de: "Collagen Beauty Complex (Dose)"
    },
    subtitle: {
      ru: "Классический формат банки для домашнего курса",
      en: "Classic jar format for daily home routine",
      tr: "Evde günlük kullanım için klasik kavanoz formatı",
      uz: "Uyda har kuni foydalanish uchun klassik banka",
      de: "Klassische Dose für die tägliche Anwendung zu Hause"
    },
    image: "/images/products/komplex-collagen-tin.jpg",
    weight: "336 г",
    sticks: 30,
    stickWeight: "11.2 г",
    badges: {
      ru: ["336 г", "Sugar Free", "GMP Quality"],
      en: ["336 g", "Sugar Free", "GMP Quality"],
      tr: ["336 g", "Şekersiz", "GMP Kalitesi"],
      uz: ["336 g", "Shakarsiz", "GMP Sifati"],
      de: ["336 g", "Zuckerfrei", "GMP Qualität"]
    },
    composition: {
      ru: [
        "Пептиды коллагена (I и III тип) — 10 000 мг",
        "Гиалуроновая кислота — 120 мг + Витамин C — 150 мг",
        "Коэнзим Q10 — 100 мг + Биотин B7 — 5000 мкг",
        "Цинк, Селен, Витамин E"
      ],
      en: [
        "Collagen Peptides (Type I & III) — 10,000 mg",
        "Hyaluronic Acid — 120 mg + Vitamin C — 150 mg",
        "Coenzyme Q10 — 100 mg + Biotin B7 — 5000 mcg",
        "Zinc, Selenium, Vitamin E"
      ],
      tr: [
        "Kolajen Peptitleri (Tip I ve III) — 10.000 mg",
        "Hyaluronik Asit — 120 mg + C Vitamini — 150 mg",
        "Koenzim Q10 — 100 mg + Biyotin B7 — 5000 mcg",
        "Çinko, Selenyum, E Vitamini"
      ],
      uz: [
        "Kollagen peptidlar (I va III tur) — 10 000 mg",
        "Gialuron kislotasi — 120 mg + C vitamini — 150 mg",
        "Koenzim Q10 — 100 mg + Biotin B7 — 5000 mkg",
        "Sink, Selen, E vitamini"
      ],
      de: [
        "Kollagenpeptide (Typ I & III) — 10.000 mg",
        "Hyaluronsäure — 120 mg + Vitamin C — 150 mg",
        "Coenzym Q10 — 100 mg + Biotin B7 — 5000 mcg",
        "Zink, Selen, Vitamin E"
      ]
    },
    basePriceUZS: 420000,
    subscriptionDiscount: 10
  },

  // 4. 100% Pure Collagen (Банка 300 г)
  {
    id: "pure-collagen-tin",
    sku: "AG-PC-300-TIN",
    category: "collagen",
    title: {
      ru: "100% Pure Collagen (Банка)",
      en: "100% Pure Collagen (Jar)",
      tr: "100% Pure Collagen (Kavanoz)",
      uz: "100% Pure Collagen (Banka)",
      de: "100% Pure Collagen (Dose)"
    },
    subtitle: {
      ru: "Чистый гидролизованный коллаген для суставов и тонуса",
      en: "Pure hydrolyzed collagen for joint and skin elasticity",
      tr: "Eklemler ve cilt esnekliği için saf hidrolize kolajen",
      uz: "Bo'g'imlar va teri tonusi uchun sof gidrolizlangan kollagen",
      de: "Reines hydrolysiertes Kollagen für Gelenke und Haut"
    },
    image: "/images/products/pure-collagen-tin.jpg",
    weight: "300 г",
    sticks: 30,
    stickWeight: "10 г",
    badges: {
      ru: ["300 г", "High Absorption", "Joints & Bones"],
      en: ["300 g", "High Absorption", "Joints & Bones"],
      tr: ["300 g", "Yüksek Emilim", "Eklem & Kemik"],
      uz: ["300 g", "Yuqori so'rilish", "Bo'g'imlar & Süyaklar"],
      de: ["300 g", "Hohe Absorption", "Gelenke & Knochen"]
    },
    composition: {
      ru: [
        "100% чистый гидролизованный коллаген высокого усвоения (до 98%)",
        "Без сахара, без ГМО и ароматизаторов",
        "Полный профиль аминокислот для суставов, связок и мышц"
      ],
      en: [
        "100% Pure Hydrolyzed Collagen with high bioavailability (up to 98%)",
        "Sugar-Free, Non-GMO and Unflavored",
        "Complete amino acid profile for joints, ligaments and muscles"
      ],
      tr: [
        "%98 yüksek biyoyararlanımlı %100 Saf Hidrolize Kolajen",
        "Şekersiz, GDO'suz ve aromasız",
        "Eklem, bağ ve kaslar için tam amino asit profili"
      ],
      uz: [
        "Yuqori so'rilish darajasiga ega (98% gacha) 100% sof gidrolizlangan kollagen",
        "Shakarsiz, GMOsiz va xushbo'ylagichlarsiz",
        "Bo'g'imlar va mushaklar uchun to'liq aminokislota profili"
      ],
      de: [
        "100% reines hydrolysiertes Kollagen mit hoher Bioverfügbarkeit (bis 98%)",
        "Zuckerfrei, ohne Gentechnik und geschmacksneutral",
        "Vollständiges Aminosäurenprofil für Gelenke und Muskeln"
      ]
    },
    basePriceUZS: 370000,
    subscriptionDiscount: 10
  }
];