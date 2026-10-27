/**
 * Marota City — T104 / T105
 * Source: public/projects/marota-city/T104-T105.pdf (49 pages, Arabic).
 *
 * Every figure below is taken from the brochure; `pdfPage` records where.
 * No prices, delivery dates, availability or total unit counts — none are published.
 * Construction status ("under construction") was confirmed by the company.
 */
import type { Localized, Project, ProjectFloor, ProjectMedia, ProjectUnit } from "../types";
import manifest from "./media.json";

type MediaName = keyof typeof manifest;

const media = (name: MediaName, alt: Localized, caption?: Localized, fit?: ProjectMedia["fit"]): ProjectMedia => ({
  ...manifest[name],
  alt,
  caption,
  fit,
});

// ── Floors ──────────────────────────────────────────────────────────────

const apt = (number: string, area: number): ProjectUnit => ({ number, area, type: "apartment" });
const duplex = (number: string, area: number): ProjectUnit => ({ number, area, type: "duplex" });

const ordinalAr = [
  "", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر",
  "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر", "السادس عشر", "السابع عشر",
  "الثامن عشر", "التاسع عشر", "العشرون", "الحادي والعشرون", "الثاني والعشرون",
];

const plans = (id: string, labelAr: string, labelEn: string) => ({
  plan2d: media(`plan-${id}-2d` as MediaName, {
    ar: `المسقط الأفقي — ${labelAr}`,
    en: `Floor plan — ${labelEn}`,
  }),
  plan3d: media(`plan-${id}-3d` as MediaName, {
    ar: `منظور ثلاثي الأبعاد — ${labelAr}`,
    en: `3D axonometric — ${labelEn}`,
  }),
});

const basement = (n: 1 | 2 | 3 | 4, parking: number, pages: number[]): ProjectFloor => {
  const ar = `القبو ${ordinalAr[n]}`;
  const en = `Basement ${n}`;
  return {
    id: `b${n}`,
    level: -n,
    short: { ar: `ق${n}`, en: `B${n}` },
    label: { ar, en },
    group: "basements",
    parking,
    ...plans(`b${n}`, ar, en),
    pdfPages: pages,
  };
};

// Residential floors 3–20, units exactly as listed in the brochure (plot T104)
const residential: [number, number, ProjectUnit[], number?][] = [
  [3, 27, [apt("1", 283), apt("2", 252), apt("3", 234)]],
  [4, 28, [apt("4", 277), apt("5", 251), apt("6", 229)]],
  [5, 29, [apt("7", 276), apt("8", 252), apt("9", 228)]],
  [6, 30, [apt("10", 275), apt("11", 256), apt("12", 229)]],
  [7, 31, [apt("13", 275), apt("14", 252), apt("15", 229)]],
  [8, 32, [apt("16", 304), apt("17", 257), duplex("18", 194)]],
  [9, 33, [duplex("18", 193), apt("19", 301), apt("20", 257)]],
  [10, 34, [apt("21", 300), apt("22", 258), duplex("23", 194)]],
  // The heading on p.35 says "4 apartments" but lists three units — flagged for confirmation
  [11, 35, [duplex("23", 192), apt("24", 296), apt("25", 257)], 4],
  [12, 36, [apt("26", 295), apt("27", 258), duplex("28", 193)]],
  [13, 37, [duplex("28", 200), apt("29", 293), apt("30", 251)]],
  [14, 38, [apt("31", 311), duplex("32", 218), duplex("33", 224)]],
  [15, 39, [duplex("32", 217), duplex("33", 223), apt("34", 308)]],
  [16, 40, [apt("35", 368), apt("36", 376)]],
  [17, 41, [apt("37", 327), apt("38", 334)]],
  [18, 42, [apt("39", 327), apt("40", 334)]],
  [19, 43, [apt("41", 290), apt("42", 295)]],
  [20, 44, [apt("43", 270), apt("44", 278)]],
];

const floors: ProjectFloor[] = [
  basement(4, 84, [13, 14]),
  basement(3, 81, [15, 16]),
  basement(2, 74, [17, 18]),
  basement(1, 56, [19, 20]),
  {
    id: "f00",
    level: 0,
    short: { ar: "أ", en: "G" },
    label: { ar: "الطابق الأرضي", en: "Ground floor" },
    group: "commercial",
    description: {
      ar: "محلات تجارية، ومداخل للأبراج السكنية، ومداخل للمكاتب التجارية من الجهة الغربية.",
      en: "Retail shops, entrances to the residential towers, and entrances to the commercial offices from the west side.",
    },
    ...plans("f00", "الطابق الأرضي", "Ground floor"),
    pdfPages: [21, 22],
  },
  {
    id: "f01",
    level: 1,
    short: { ar: "1", en: "1" },
    label: { ar: "الطابق الأول", en: "First floor" },
    group: "commercial",
    description: {
      ar: "مكاتب وشركات تجارية بمساحات مختلفة بما يخدم رغبة المالك.",
      en: "Offices and commercial companies in a range of sizes, arranged to suit the owner’s needs.",
    },
    ...plans("f01", "الطابق الأول", "First floor"),
    pdfPages: [23, 24],
  },
  {
    id: "f02",
    level: 2,
    short: { ar: "2", en: "2" },
    label: { ar: "الطابق الثاني — تقني", en: "Second floor — technical" },
    group: "technical",
    description: { ar: "طابق تقني.", en: "Technical floor." },
    ...plans("f02", "الطابق الثاني التقني", "Second (technical) floor"),
    pdfPages: [25, 26],
  },
  ...residential.map(([n, page, units, stated]): ProjectFloor => {
    const id = `f${String(n).padStart(2, "0")}`;
    const ar = `الطابق ${ordinalAr[n]}`;
    const en = `Floor ${n}`;
    return {
      id,
      level: n,
      short: { ar: String(n), en: String(n) },
      label: { ar, en },
      group: "residential",
      units,
      statedUnitCount: stated,
      ...plans(id, ar, en),
      pdfPages: [page],
    };
  }),
  {
    id: "f21",
    level: 21,
    short: { ar: "21", en: "21" },
    label: { ar: "الطابق الحادي والعشرون — تقني", en: "Floor 21 — technical" },
    group: "technical",
    description: { ar: "طابق تقني.", en: "Technical floor." },
    ...plans("f21", "الطابق الحادي والعشرون", "Floor 21"),
    pdfPages: [45],
  },
  {
    id: "f22",
    level: 22,
    short: { ar: "سطح", en: "R" },
    label: { ar: "طابق السطح", en: "Roof level" },
    group: "technical",
    description: {
      ar: "يحوي مشالح ودوشات للجنسين، ومسبحًا لكل برج خاصًا بسكان الأبراج.",
      en: "Changing rooms and showers for men and women, and a swimming pool for each tower, reserved for residents.",
    },
    ...plans("f22", "طابق السطح", "Roof level"),
    pdfPages: [46, 11],
  },
];

// ── Project ─────────────────────────────────────────────────────────────

const hero = media(
  "render-towers-sky",
  { ar: "تصوّر معماري لبرجي المشروع T104 وT105 في ماروتا سيتي", en: "Architectural rendering of towers T104 and T105 in Marota City" },
  { ar: "البرجان من مستوى الشارع", en: "The two towers from street level" },
);

export const marotaCity: Project = {
  slug: "marota-city-t104-t105",
  status: "published",
  order: 1,
  featured: true,

  name: { ar: "ماروتا سيتي", en: "Marota City" },
  code: "T104 / T105",
  type: { ar: "مشروع متعدد الاستخدامات — سكني وتجاري ومكاتب", en: "Mixed-use — residential, retail & offices" },
  location: { ar: "ماروتا سيتي — العقاران 104 و105", en: "Marota City — plots 104 & 105" },
  progress: { ar: "قيد التنفيذ", en: "Under construction" },
  tagline: {
    ar: "برجان سكنيان على قاعدة تجارية مشتركة في المدينة البيئية الذكية",
    en: "Two residential towers on a shared commercial podium in the smart eco-city",
  },
  summary: {
    ar: "مشروع على مقسمين من المقاسم السكنية المختلطة في ماروتا سيتي، يجمع أربعة أقبية للمواقف والخدمات، وطابقًا أرضيًا تجاريًا، وطابقًا للمكاتب، و18 طابقًا سكنيًا تضم شققًا ودوبلكسات بمساحات ونماذج مختلفة.",
    en: "A development on two mixed-use residential plots in Marota City, combining four basements for parking and services, a retail ground floor, an office floor and 18 residential floors of apartments and duplexes in a variety of sizes and layouts.",
  },
  imageryNote: {
    ar: "الصور والمخططات مأخوذة من كتيّب المشروع، وهي تصورات معمارية قد تختلف عن التنفيذ النهائي.",
    en: "Images and plans are taken from the project brochure; they are architectural visualisations and may differ from the final build.",
  },

  hero,
  card: media("render-towers-front", {
    ar: "تصوّر معماري لبرجي ماروتا سيتي T104 وT105",
    en: "Architectural rendering of the Marota City T104 and T105 towers",
  }),

  highlights: [
    { value: "18", label: { ar: "طابقًا سكنيًا", en: "residential floors" }, pdfPage: 11 },
    { value: "4", label: { ar: "أقبية", en: "basements" }, pdfPage: 11 },
    { value: "295", label: { ar: "موقف سيارات", en: "parking spaces" }, pdfPage: 11 },
  ],

  facts: [
    {
      value: "2",
      label: { ar: "مقسمان", en: "plots" },
      detail: { ar: "T104 و T105 — من المقاسم السكنية المختلطة", en: "T104 and T105 — mixed-use residential plots" },
      pdfPage: 11,
    },
    {
      value: "18",
      label: { ar: "طابقًا سكنيًا", en: "residential floors" },
      detail: { ar: "شقق ودوبلكسات بمساحات ونماذج مختلفة", en: "Apartments and duplexes in varied sizes and layouts" },
      pdfPage: 11,
    },
    {
      value: "4",
      label: { ar: "أقبية", en: "basements" },
      detail: { ar: "على كامل مساحة المقسمين", en: "Spanning the full area of both plots" },
      pdfPage: 11,
    },
    {
      value: "3,585",
      label: { ar: "م² — مساحة المقسمين", en: "m² — area of the two plots" },
      detail: { ar: "كما وردت في وصف الأقبية", en: "As stated in the basement description" },
      pdfPage: 11,
    },
    {
      value: "295",
      label: { ar: "موقف سيارات", en: "parking spaces" },
      detail: { ar: "56 للقسم التجاري و239 للقسم السكني", en: "56 commercial and 239 residential" },
      pdfPage: 11,
    },
    {
      value: "2",
      label: { ar: "طابقان تقنيان", en: "technical floors" },
      detail: { ar: "الطابق الثاني والطابق الحادي والعشرون", en: "Floors 2 and 21" },
      pdfPage: 11,
    },
    {
      value: "192–376",
      label: { ar: "م² — مساحات الوحدات", en: "m² — unit sizes" },
      detail: { ar: "وفق مخططات المقسم T104 المنشورة", en: "Per the published T104 floor plans" },
      pdfPage: 27,
    },
    {
      value: "69.35",
      label: { ar: "م — الارتفاع دون الدروة", en: "m — height excl. parapet" },
      detail: { ar: "كما ورد على غلاف الكتيّب", en: "As stated on the brochure cover" },
      pdfPage: 1,
    },
  ],

  chapters: [
    {
      id: "idea",
      eyebrow: { ar: "الفكرة", en: "The idea" },
      title: { ar: "السكن والعمل والتجارة في عنوان واحد", en: "Living, working and retail at one address" },
      body: {
        ar: [
          "يقع المشروع على المقسمين 104 و105 في ماروتا سيتي، ضمن المقاسم المصنّفة سكنية مختلطة.",
          "يجمع المشروع بين قاعدة تجارية ومكاتب في الطوابق الأولى، وطوابق سكنية تعلوها، مع خدمات مشتركة في الأقبية.",
        ],
        en: [
          "The project sits on plots 104 and 105 in Marota City, within the plots zoned for mixed residential use.",
          "It brings together a retail and office base on the lower floors with residential floors above, and shared services below ground.",
        ],
      },
      media: media("render-aerial-towers", {
        ar: "منظر علوي للبرجين ومحيطهما",
        en: "Aerial view of the two towers and their surroundings",
      }),
    },
    {
      id: "architecture",
      eyebrow: { ar: "العمارة", en: "Architecture" },
      title: { ar: "خطوط عمودية، وشرفات تتنفس", en: "Vertical lines, terraces that breathe" },
      body: {
        ar: [
          "تُظهر التصورات المعمارية برجين بواجهات تتقاطع فيها الخطوط العمودية مع الشرفات والمساحات الخضراء المعلّقة.",
          "يرتفع البرجان فوق قاعدة تجارية تنفتح على الشارع، بينما يتوّج كلَّ برج سطحٌ يضم مسبحًا خاصًا بالسكان.",
        ],
        en: [
          "The renderings show two towers whose facades interlace strong vertical lines with balconies and planted terraces.",
          "They rise from a retail podium that opens onto the street, and each tower is crowned by a roof level with a residents’ pool.",
        ],
      },
      media: media("render-aerial-terraces", {
        ar: "الشرفات والمساحات الخضراء على واجهات البرجين",
        en: "Terraces and planting along the tower facades",
      }),
    },
    {
      id: "uses",
      eyebrow: { ar: "الاستخدامات", en: "Uses" },
      title: { ar: "من الشارع إلى السطح", en: "From the street to the roof" },
      body: {
        ar: [
          "الطابق الأرضي: محلات تجارية، ومداخل للأبراج السكنية، ومداخل للمكاتب التجارية من الجهة الغربية.",
          "الطابق الأول: مكاتب وشركات تجارية بمساحات مختلفة بما يخدم رغبة المالك.",
          "18 طابقًا سكنيًا: شقق سكنية ودوبلكسات بمساحات ونماذج مختلفة، إضافة إلى طابقين تقنيين.",
          "السطح: مسبح لكل برج خاص بسكان الأبراج، مع مشالح ودوشات للجنسين.",
        ],
        en: [
          "Ground floor: retail shops, entrances to the residential towers, and entrances to the offices from the west side.",
          "First floor: offices and commercial companies in a range of sizes, arranged to suit the owner’s needs.",
          "18 residential floors: apartments and duplexes in varied sizes and layouts, plus two technical floors.",
          "Roof: a swimming pool for each tower, reserved for residents, with changing rooms and showers for men and women.",
        ],
      },
      media: media("render-plaza", {
        ar: "الساحة الأمامية والمدخل التجاري بين البرجين",
        en: "The forecourt and retail entrance between the towers",
      }),
    },
    {
      id: "below-ground",
      eyebrow: { ar: "تحت الأرض", en: "Below ground" },
      title: { ar: "أربعة أقبية تخدم المشروع بأكمله", en: "Four basements serving the whole project" },
      body: {
        ar: [
          "أربعة أقبية على كامل مساحة المقسمين تضم 295 موقف سيارات: 56 موقفًا للقسم التجاري و239 للقسم السكني.",
          "وتضم الأقبية مستودعات تجارية، وسكنًا للحارس، وخدمات المبنى كافة: مستودعات، وغرف مولدات، ومراكز تحويل، وغرف عدادات، وخزانات وقود، وغرفًا للشوديرات، وملاجئ، وخزانات مياه أرضية مشتركة.",
        ],
        en: [
          "Four basements spanning the full area of both plots hold 295 parking spaces: 56 for the commercial section and 239 for residents.",
          "They also house commercial storage, a caretaker’s residence and all building services: storerooms, generator rooms, transformer stations, meter rooms, fuel tanks, refuse-chute rooms, shelters and shared underground water tanks.",
        ],
      },
      media: media("exploded-3d", {
        ar: "منظور تفكيكي ثلاثي الأبعاد لطبقات المبنى",
        en: "Exploded 3D view of the building levels",
      }),
      mediaStyle: "cutout",
    },
  ],

  site: {
    title: { ar: "ماروتا سيتي — المدينة البيئية الذكية", en: "Marota City — the smart eco-city" },
    text: {
      ar: "يقع العقاران 104 و105 ضمن المخطط العام لماروتا سيتي، كما يوضّح مخطط الموقع الوارد في الكتيّب.",
      en: "Plots 104 and 105 lie within the Marota City master plan, as shown on the site plan in the brochure.",
    },
    plan: media("site-plan", {
      ar: "مخطط موقع العقارين 104 و105 ضمن ماروتا سيتي",
      en: "Site plan showing plots 104 and 105 within Marota City",
    }),
    panorama: media("marota-skyline", {
      ar: "منظر بانورامي تصوّري لماروتا سيتي",
      en: "Panoramic visualisation of Marota City",
    }),
  },

  gallery: [
    hero,
    media("render-towers-front", { ar: "البرجان من الواجهة الأمامية", en: "The towers from the front" }, { ar: "الواجهة الأمامية", en: "Front elevation view" }),
    media("render-street-retail", { ar: "الواجهة التجارية على مستوى الشارع", en: "The retail frontage at street level" }, { ar: "القاعدة التجارية", en: "Retail podium" }),
    media("render-aerial-terraces", { ar: "الشرفات والمساحات الخضراء من الأعلى", en: "Terraces and planting from above" }, { ar: "الشرفات الخضراء", en: "Planted terraces" }),
    media("render-plaza", { ar: "الساحة الأمامية بين البرجين", en: "The forecourt between the towers" }, { ar: "الساحة والمدخل", en: "Forecourt & entrance" }),
    media("render-entrance", { ar: "مدخل المبنى من الشارع", en: "The building entrance from the street" }, { ar: "المدخل", en: "Entrance" }),
    media("render-rooftop", { ar: "السطح والمسبح أعلى البرج", en: "The roof level and pool atop a tower" }, { ar: "السطح", en: "Roof level" }),
    media("render-aerial-towers", { ar: "منظر علوي للبرجين", en: "Aerial view of the towers" }, { ar: "منظر علوي", en: "Aerial view" }),
    media("section", { ar: "مقطع معماري للبرج", en: "Architectural section of the tower" }, { ar: "المقطع", en: "Section" }, "contain"),
    media("tower-3d", { ar: "نموذج ثلاثي الأبعاد للبرج", en: "3D model of the tower" }, { ar: "النموذج الثلاثي الأبعاد", en: "3D model" }, "contain"),
  ],

  floorGroups: [
    { id: "basements", label: { ar: "الأقبية", en: "Basements" } },
    { id: "commercial", label: { ar: "الطوابق التجارية", en: "Commercial" } },
    { id: "residential", label: { ar: "الطوابق السكنية", en: "Residential" } },
    { id: "technical", label: { ar: "التقنية والسطح", en: "Technical & roof" } },
  ],
  floors,
  floorsNote: {
    ar: "المخططات المنشورة في الكتيّب تخص المقسم T104. أرقام الوحدات ومساحاتها كما وردت فيه، وتتكرر أرقام وحدات الدوبلكس في طابقين متتاليين.",
    en: "The plans published in the brochure are for plot T104. Unit numbers and areas are as printed; duplex numbers repeat across two consecutive floors.",
  },

  documents: [
    {
      id: "brochure",
      title: { ar: "كتيّب المشروع T104 / T105", en: "Project brochure T104 / T105" },
      file: "/projects/marota-city/T104-T105.pdf",
      sizeBytes: 17_657_699,
      pageCount: 49,
      language: "ar",
      cover: media("cover", { ar: "غلاف كتيّب مشروع ماروتا سيتي", en: "Cover of the Marota City brochure" }),
    },
  ],
};
