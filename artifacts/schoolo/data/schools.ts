import type { SchoolImageKey } from "./schoolImages";

export interface School {
  id: string;
  name: string;
  nameAr: string;
  rating: number;
  totalRatings: number;
  images: SchoolImageKey[];
  type: "private" | "international";
  curriculum: string;
  location: {
    city: string;
    district: string;
    distance: number;
  };
  fees: {
    tuition: number;
    registration: number;
    uniform: number;
    transport: number;
    activities: number;
    totalEstimate: number;
  };
  facilities: string[];
  specialNeeds: boolean;
  siblingsDiscount: boolean;
  siblingsDiscountPercent: number;
  extracurriculars: string[];
  grades: string;
  studentCount: number;
  established: number;
  languages: string[];
  description: string;
  fitScore: number;
  gender: "boys" | "girls" | "mixed";
  accreditation: string[];
  color: string;
  feeCategory: string;
  tags: string[];
  contact: {
    phone: string;
    email: string;
    admissionsEmail?: string;
    website?: string;
  };
  registrationOpenDate: string;
  busService: boolean;
  studentType: "Boys Only" | "Girls Only" | "Mixed" | "Separate Boys and Girls Campuses";
}

export const SCHOOLS: School[] = [
  // ── JEDDAH ──────────────────────────────────────────────────────────────────
  {
    id: "j1",
    name: "Dar Al Rowad International Schools",
    nameAr: "مدارس دار الرواد الدولية",
    rating: 4.5,
    totalRatings: 218,
    images: ["s1", "s2", "s3"],
    type: "private",
    curriculum: "American / National",
    location: { city: "Jeddah", district: "Al Rawdah", distance: 3.2 },
    fees: {
      tuition: 50000,
      registration: 3000,
      uniform: 2000,
      transport: 6000,
      activities: 2000,
      totalEstimate: 55000,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 15,
    extracurriculars: ["Football", "Basketball", "Art Club", "Science Fair", "Quran Memorisation"],
    grades: "KG – Grade 12",
    studentCount: 1800,
    established: 1998,
    languages: ["English", "Arabic"],
    description: "A well-known private school offering balanced academics with a focus on discipline and foundational education.",
    fitScore: 72,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#EA8B33",
    feeCategory: "40K–60K",
    tags: ["Mid-range", "Value", "Private"],
    contact: {
      phone: "+966126531000",
      email: "info@darrowad.edu.sa",
      admissionsEmail: "admissions@darrowad.edu.sa",
      website: "www.darrowad.edu.sa",
    },
    registrationOpenDate: "1 April 2026",
    busService: true,
    studentType: "Separate Boys and Girls Campuses",
  },
  {
    id: "j2",
    name: "American International School of Jeddah",
    nameAr: "المدرسة الأمريكية الدولية بجدة",
    rating: 4.8,
    totalRatings: 312,
    images: ["s2", "s3", "s4"],
    type: "international",
    curriculum: "American / AP",
    location: { city: "Jeddah", district: "Al Mohammadiyah", distance: 8.0 },
    fees: {
      tuition: 92500,
      registration: 8000,
      uniform: 3000,
      transport: 10000,
      activities: 5000,
      totalEstimate: 100000,
    },
    facilities: ["Olympic Pool", "Science Labs", "Tennis Courts", "Library", "Cafeteria", "Mosque", "Theatre", "Recording Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 12,
    extracurriculars: ["Swimming", "Tennis", "Theatre", "Film Club", "Robotics", "MUN", "DECA", "AP Studio Art"],
    grades: "Pre-K – Grade 12",
    studentCount: 2100,
    established: 1972,
    languages: ["English", "Arabic", "Spanish"],
    description: "A premium international school offering an American curriculum with strong academic preparation and university pathways.",
    fitScore: 82,
    gender: "mixed",
    accreditation: ["AdvancED", "Middle States"],
    color: "#32667F",
    feeCategory: "80K+",
    tags: ["Premium", "International", "AP"],
    contact: {
      phone: "+966126870444",
      email: "info@aisj.edu.sa",
      admissionsEmail: "admissions@aisj.edu.sa",
      website: "www.aisj.edu.sa",
    },
    registrationOpenDate: "15 March 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "j3",
    name: "British International School of Jeddah",
    nameAr: "المدرسة البريطانية الدولية بجدة",
    rating: 4.7,
    totalRatings: 276,
    images: ["s3", "s4", "s5"],
    type: "international",
    curriculum: "British",
    location: { city: "Jeddah", district: "Al Mohammadiyah", distance: 6.5 },
    fees: {
      tuition: 85000,
      registration: 7000,
      uniform: 3000,
      transport: 9000,
      activities: 4000,
      totalEstimate: 90000,
    },
    facilities: ["Heated Pool", "Astroturf Pitch", "Science Labs", "Library", "Cafeteria", "Mosque", "Performing Arts Centre"],
    specialNeeds: true,
    siblingsDiscount: false,
    siblingsDiscountPercent: 0,
    extracurriculars: ["Rugby", "Swimming", "Drama", "Orchestra", "Debating", "Duke of Edinburgh", "Community Service"],
    grades: "Pre-K – Grade 12",
    studentCount: 1650,
    established: 1979,
    languages: ["English", "Arabic", "French"],
    description: "A premium British school known for structured academics, international exposure, and a strong school community.",
    fitScore: 80,
    gender: "mixed",
    accreditation: ["BSO", "CIS", "BSME"],
    color: "#132F45",
    feeCategory: "80K+",
    tags: ["Premium", "British", "International"],
    contact: {
      phone: "+966126650200",
      email: "info@bisj.edu.sa",
      admissionsEmail: "admissions@bisj.edu.sa",
      website: "www.bisj.edu.sa",
    },
    registrationOpenDate: "1 March 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "j4",
    name: "Jeddah Knowledge International School",
    nameAr: "مدرسة جدة المعرفة الدولية",
    rating: 4.6,
    totalRatings: 189,
    images: ["s4", "s5", "s1"],
    type: "international",
    curriculum: "American",
    location: { city: "Jeddah", district: "Al Zahra", distance: 4.2 },
    fees: {
      tuition: 60000,
      registration: 4000,
      uniform: 2500,
      transport: 7000,
      activities: 3000,
      totalEstimate: 65000,
    },
    facilities: ["Swimming Pool", "Science Labs", "Sports Courts", "Library", "Cafeteria", "Mosque", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 10,
    extracurriculars: ["Football", "Swimming", "Robotics", "Art Club", "MUN", "Science Club", "Chess"],
    grades: "KG – Grade 12",
    studentCount: 1200,
    established: 2005,
    languages: ["English", "Arabic", "French"],
    description: "An international school offering strong academic programs with a balanced focus on curriculum, facilities, and student development.",
    fitScore: 75,
    gender: "mixed",
    accreditation: ["AdvancED", "Ministry of Education KSA"],
    color: "#EAA23A",
    feeCategory: "60K–80K",
    tags: ["International", "Academic"],
    contact: {
      phone: "+966126782100",
      email: "info@jkis.edu.sa",
      admissionsEmail: "admissions@jkis.edu.sa",
      website: "www.jkis.edu.sa",
    },
    registrationOpenDate: "1 April 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "j5",
    name: "Al Waha International School",
    nameAr: "مدرسة الواحة الدولية",
    rating: 4.3,
    totalRatings: 142,
    images: ["s5", "s1", "s2"],
    type: "private",
    curriculum: "American",
    location: { city: "Jeddah", district: "Al Andalus", distance: 3.8 },
    fees: {
      tuition: 25000,
      registration: 2000,
      uniform: 1500,
      transport: 5000,
      activities: 1500,
      totalEstimate: 28000,
    },
    facilities: ["Sports Courts", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 20,
    extracurriculars: ["Football", "Basketball", "Art Club", "Quran Memorisation", "Science Fair"],
    grades: "KG – Grade 12",
    studentCount: 950,
    established: 2010,
    languages: ["English", "Arabic"],
    description: "A more affordable private school option offering core academic programs in English and Arabic.",
    fitScore: 62,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#32667F",
    feeCategory: "20K–30K",
    tags: ["Budget", "Private"],
    contact: {
      phone: "+966126340900",
      email: "info@alwahais.edu.sa",
      website: "www.alwahais.edu.sa",
    },
    registrationOpenDate: "1 May 2026",
    busService: false,
    studentType: "Separate Boys and Girls Campuses",
  },

  // ── RIYADH ───────────────────────────────────────────────────────────────────
  {
    id: "r1",
    name: "American International School Riyadh",
    nameAr: "المدرسة الأمريكية الدولية بالرياض",
    rating: 4.9,
    totalRatings: 398,
    images: ["s1", "s3", "s5"],
    type: "international",
    curriculum: "American / IB",
    location: { city: "Riyadh", district: "Al Nakheel", distance: 4.5 },
    fees: {
      tuition: 102500,
      registration: 9000,
      uniform: 3500,
      transport: 11000,
      activities: 5000,
      totalEstimate: 110000,
    },
    facilities: ["Olympic Pool", "Science Labs", "Tennis Courts", "Library", "Cafeteria", "Mosque", "Black Box Theatre", "Design & Technology Lab", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 10,
    extracurriculars: ["Swimming", "Tennis", "Robotics", "MUN", "AP Studio Art", "Debate Club", "Orchestra", "Community Service"],
    grades: "Pre-K – Grade 12",
    studentCount: 2800,
    established: 1963,
    languages: ["English", "Arabic", "Spanish", "French"],
    description: "A highly regarded international school with strong academic standards and global university preparation.",
    fitScore: 90,
    gender: "mixed",
    accreditation: ["AdvancED", "NEASC", "CIS"],
    color: "#EA8B33",
    feeCategory: "80K+",
    tags: ["Elite", "International", "IB"],
    contact: {
      phone: "+966114820555",
      email: "info@aisr.edu.sa",
      admissionsEmail: "admissions@aisr.edu.sa",
      website: "www.aisr.edu.sa",
    },
    registrationOpenDate: "1 February 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "r2",
    name: "British International School Riyadh",
    nameAr: "المدرسة البريطانية الدولية بالرياض",
    rating: 4.7,
    totalRatings: 334,
    images: ["s2", "s4", "s1"],
    type: "international",
    curriculum: "British",
    location: { city: "Riyadh", district: "Al Malqa", distance: 7.2 },
    fees: {
      tuition: 90000,
      registration: 8000,
      uniform: 3000,
      transport: 10000,
      activities: 5000,
      totalEstimate: 100000,
    },
    facilities: ["Swimming Pool", "Science Labs", "Tennis Courts", "Library", "Cafeteria", "Mosque", "Theatre", "Art Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 10,
    extracurriculars: ["Cricket", "Swimming", "Theatre", "Orchestra", "Debate", "Photography", "Coding Club"],
    grades: "Pre-K – Grade 12",
    studentCount: 2100,
    established: 1982,
    languages: ["English", "Arabic", "French"],
    description: "A leading British curriculum school serving international and local families with strong academic pathways.",
    fitScore: 85,
    gender: "mixed",
    accreditation: ["BSO", "CIS"],
    color: "#32667F",
    feeCategory: "80K+",
    tags: ["Premium", "British", "International"],
    contact: {
      phone: "+966114554800",
      email: "info@bisr.edu.sa",
      admissionsEmail: "admissions@bisr.edu.sa",
      website: "www.bisr.edu.sa",
    },
    registrationOpenDate: "1 March 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "r3",
    name: "Advanced Learning Schools",
    nameAr: "مدارس التعلم المتقدم",
    rating: 4.5,
    totalRatings: 267,
    images: ["s3", "s5", "s2"],
    type: "private",
    curriculum: "American",
    location: { city: "Riyadh", district: "Al Olaya", distance: 2.8 },
    fees: {
      tuition: 52500,
      registration: 3500,
      uniform: 2500,
      transport: 7000,
      activities: 2500,
      totalEstimate: 60000,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Computer Lab", "Art Room"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 20,
    extracurriculars: ["Football", "Basketball", "Art Club", "Science Club", "Chess", "Scouting"],
    grades: "KG – Grade 12",
    studentCount: 1500,
    established: 2003,
    languages: ["English", "Arabic"],
    description: "A solid mid-range school offering strong academics and a stable private school environment.",
    fitScore: 74,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#EAA23A",
    feeCategory: "40K–60K",
    tags: ["Mid-range", "Private"],
    contact: {
      phone: "+966114321700",
      email: "info@als.edu.sa",
      admissionsEmail: "admissions@als.edu.sa",
      website: "www.als.edu.sa",
    },
    registrationOpenDate: "15 April 2026",
    busService: true,
    studentType: "Separate Boys and Girls Campuses",
  },
  {
    id: "r4",
    name: "SEK International School Riyadh",
    nameAr: "مدرسة سيك الدولية بالرياض",
    rating: 4.6,
    totalRatings: 198,
    images: ["s4", "s1", "s3"],
    type: "international",
    curriculum: "IB",
    location: { city: "Riyadh", district: "Al Mohammadiah", distance: 5.6 },
    fees: {
      tuition: 85000,
      registration: 7000,
      uniform: 3000,
      transport: 9000,
      activities: 4000,
      totalEstimate: 90000,
    },
    facilities: ["Swimming Pool", "Science Labs", "Sports Courts", "Library", "Cafeteria", "Mosque", "Design & Technology Lab", "Art Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 15,
    extracurriculars: ["Swimming", "Football", "CAS Projects", "Model UN", "Photography", "Community Service", "Trilingual Club"],
    grades: "Pre-K – Grade 12",
    studentCount: 1100,
    established: 2011,
    languages: ["English", "Arabic", "Spanish"],
    description: "A modern IB school focused on international learning, inquiry-based education, and multilingual development.",
    fitScore: 82,
    gender: "mixed",
    accreditation: ["IBO", "CIS"],
    color: "#132F45",
    feeCategory: "80K+",
    tags: ["IB", "Premium", "International"],
    contact: {
      phone: "+966114789300",
      email: "info@sek-riyadh.edu.sa",
      admissionsEmail: "admissions@sek-riyadh.edu.sa",
      website: "www.sek-riyadh.edu.sa",
    },
    registrationOpenDate: "1 March 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "r5",
    name: "Al Faris International School",
    nameAr: "مدرسة الفارس الدولية",
    rating: 4.2,
    totalRatings: 163,
    images: ["s5", "s2", "s4"],
    type: "private",
    curriculum: "American",
    location: { city: "Riyadh", district: "Al Faisaliah", distance: 1.4 },
    fees: {
      tuition: 25000,
      registration: 2000,
      uniform: 1500,
      transport: 5000,
      activities: 1500,
      totalEstimate: 28000,
    },
    facilities: ["Sports Field", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 25,
    extracurriculars: ["Football", "Basketball", "Quran Memorisation", "Science Fair", "Art Club"],
    grades: "KG – Grade 12",
    studentCount: 1100,
    established: 2007,
    languages: ["English", "Arabic"],
    description: "A budget-conscious international school option offering English-based education at a more accessible cost.",
    fitScore: 58,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#32667F",
    feeCategory: "20K–30K",
    tags: ["Budget", "International"],
    contact: {
      phone: "+966114210600",
      email: "info@alfaris.edu.sa",
      website: "www.alfaris.edu.sa",
    },
    registrationOpenDate: "1 May 2026",
    busService: false,
    studentType: "Separate Boys and Girls Campuses",
  },

  // ── DAMMAM ───────────────────────────────────────────────────────────────────
  {
    id: "d1",
    name: "ISG Dammam",
    nameAr: "مدرسة ISG الدولية بالدمام",
    rating: 4.7,
    totalRatings: 224,
    images: ["s1", "s4", "s2"],
    type: "international",
    curriculum: "American",
    location: { city: "Dammam", district: "Al Faisaliah", distance: 6.8 },
    fees: {
      tuition: 80000,
      registration: 6000,
      uniform: 3000,
      transport: 9000,
      activities: 4000,
      totalEstimate: 85000,
    },
    facilities: ["Swimming Pool", "Science Labs", "Sports Courts", "Library", "Cafeteria", "Mosque", "Auditorium", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 12,
    extracurriculars: ["Swimming", "Football", "Robotics", "Debate Club", "MUN", "Community Service"],
    grades: "Pre-K – Grade 12",
    studentCount: 1400,
    established: 1985,
    languages: ["English", "Arabic", "Spanish"],
    description: "A well-known international school offering American-style education and a diverse student community.",
    fitScore: 76,
    gender: "mixed",
    accreditation: ["AdvancED", "Ministry of Education KSA"],
    color: "#EA8B33",
    feeCategory: "60K–80K",
    tags: ["International", "American"],
    contact: {
      phone: "+966138321500",
      email: "info@isgdammam.edu.sa",
      admissionsEmail: "admissions@isgdammam.edu.sa",
      website: "www.isgdammam.edu.sa",
    },
    registrationOpenDate: "1 March 2026",
    busService: true,
    studentType: "Mixed",
  },
  {
    id: "d2",
    name: "Dhahran British Grammar School",
    nameAr: "مدرسة الظهران البريطانية",
    rating: 4.6,
    totalRatings: 187,
    images: ["s2", "s5", "s3"],
    type: "international",
    curriculum: "British",
    location: { city: "Dammam", district: "Dhahran", distance: 12.3 },
    fees: {
      tuition: 80000,
      registration: 6000,
      uniform: 3000,
      transport: 9000,
      activities: 4000,
      totalEstimate: 85000,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Theatre", "Art Studio"],
    specialNeeds: false,
    siblingsDiscount: false,
    siblingsDiscountPercent: 0,
    extracurriculars: ["Cricket", "Rugby", "Drama", "Orchestra", "Debating", "Duke of Edinburgh"],
    grades: "Pre-K – Grade 12",
    studentCount: 1200,
    established: 1976,
    languages: ["English", "Arabic", "French"],
    description: "A long-established British school serving families in the Eastern Province with structured academic programs.",
    fitScore: 79,
    gender: "mixed",
    accreditation: ["BSO", "CIS"],
    color: "#32667F",
    feeCategory: "60K–80K",
    tags: ["British", "International"],
    contact: {
      phone: "+966138940200",
      email: "info@dbgs.edu.sa",
      admissionsEmail: "admissions@dbgs.edu.sa",
      website: "www.dbgs.edu.sa",
    },
    registrationOpenDate: "15 March 2026",
    busService: false,
    studentType: "Mixed",
  },
  {
    id: "d3",
    name: "Al Hussan International School",
    nameAr: "مدرسة الحصان الدولية",
    rating: 4.4,
    totalRatings: 156,
    images: ["s3", "s1", "s4"],
    type: "private",
    curriculum: "American",
    location: { city: "Dammam", district: "Al Shati", distance: 4.1 },
    fees: {
      tuition: 42500,
      registration: 3000,
      uniform: 2000,
      transport: 6000,
      activities: 2000,
      totalEstimate: 50000,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 15,
    extracurriculars: ["Football", "Basketball", "Swimming", "Art Club", "Scout", "Science Club"],
    grades: "KG – Grade 12",
    studentCount: 1000,
    established: 2002,
    languages: ["English", "Arabic"],
    description: "A strong regional private school offering international education with good academic value.",
    fitScore: 70,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#EAA23A",
    feeCategory: "40K–60K",
    tags: ["Value", "Private", "International"],
    contact: {
      phone: "+966138560400",
      email: "info@alhussan.edu.sa",
      admissionsEmail: "admissions@alhussan.edu.sa",
      website: "www.alhussan.edu.sa",
    },
    registrationOpenDate: "1 April 2026",
    busService: true,
    studentType: "Separate Boys and Girls Campuses",
  },
  {
    id: "d4",
    name: "Al Manahil Private School",
    nameAr: "مدرسة المناهل الخاصة",
    rating: 4.1,
    totalRatings: 98,
    images: ["s4", "s2", "s5"],
    type: "private",
    curriculum: "Saudi National",
    location: { city: "Dammam", district: "Al Nuzha", distance: 2.5 },
    fees: {
      tuition: 21500,
      registration: 2000,
      uniform: 1500,
      transport: 5000,
      activities: 1000,
      totalEstimate: 25000,
    },
    facilities: ["Sports Field", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 20,
    extracurriculars: ["Football", "Quran Memorisation", "Art Club", "Science Fair"],
    grades: "KG – Grade 12",
    studentCount: 750,
    established: 2008,
    languages: ["Arabic", "English"],
    description: "A budget private school focused on accessible education, core academics, and basic school services.",
    fitScore: 52,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#132F45",
    feeCategory: "20K–30K",
    tags: ["Budget", "Private"],
    contact: {
      phone: "+966138270100",
      email: "info@almanahil.edu.sa",
      website: "www.almanahil.edu.sa",
    },
    registrationOpenDate: "1 May 2026",
    busService: false,
    studentType: "Separate Boys and Girls Campuses",
  },
  {
    id: "d5",
    name: "Future International School Dammam",
    nameAr: "مدرسة المستقبل الدولية بالدمام",
    rating: 4.4,
    totalRatings: 134,
    images: ["s5", "s3", "s1"],
    type: "private",
    curriculum: "American",
    location: { city: "Dammam", district: "Al Badiyah", distance: 5.9 },
    fees: {
      tuition: 55000,
      registration: 3500,
      uniform: 2500,
      transport: 7000,
      activities: 2500,
      totalEstimate: 60000,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Swimming Pool", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 18,
    extracurriculars: ["Football", "Swimming", "Robotics", "Art", "Debate Club", "Scout"],
    grades: "KG – Grade 12",
    studentCount: 900,
    established: 2009,
    languages: ["English", "Arabic"],
    description: "A growing private school offering English-based education, steady academics, and accessible fee options.",
    fitScore: 65,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#EAA23A",
    feeCategory: "40K–60K",
    tags: ["Mid-range", "International"],
    contact: {
      phone: "+966138415800",
      email: "info@futureis-dammam.edu.sa",
      admissionsEmail: "admissions@futureis-dammam.edu.sa",
      website: "www.futureis-dammam.edu.sa",
    },
    registrationOpenDate: "15 April 2026",
    busService: true,
    studentType: "Separate Boys and Girls Campuses",
  },
];

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
}

export function calculateFitScore(
  school: School,
  user: {
    city: string;
    budgetMax: number;
    preferredCurriculum: string;
    distanceMax: number;
    specialNeeds: boolean;
    preferredLanguage: string;
  }
): number {
  let score = 30;

  if (school.location.city === user.city) score += 20;
  else if (user.city === "All") score += 10;

  if (school.fees.tuition <= user.budgetMax) score += 20;
  else if (school.fees.tuition <= user.budgetMax * 1.2) score += 8;

  if (user.preferredCurriculum === "Any") score += 15;
  else if (school.curriculum.includes(user.preferredCurriculum)) score += 20;
  else score += 5;

  if (school.location.distance <= user.distanceMax) score += 10;
  else if (school.location.distance <= user.distanceMax * 1.5) score += 4;

  if (!user.specialNeeds || school.specialNeeds) score += 5;

  if (
    user.preferredLanguage === "None" ||
    school.languages.some((l) => l.toLowerCase().includes(user.preferredLanguage.toLowerCase()))
  )
    score += 5;

  return Math.min(100, Math.max(0, score));
}

export function filterSchools(
  schools: School[],
  filter: string,
  searchQuery: string,
  maxBudget?: number
): School[] {
  let result = [...schools];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.curriculum.toLowerCase().includes(q) ||
        s.location.district.toLowerCase().includes(q)
    );
  }

  switch (filter) {
    case "nearest":
      result.sort((a, b) => a.location.distance - b.location.distance);
      break;
    case "budget":
      result = result.filter((s) => s.fees.tuition <= (maxBudget || 40000));
      result.sort((a, b) => a.fees.tuition - b.fees.tuition);
      break;
    case "private":
      result = result.filter((s) => s.type === "private");
      break;
    case "international":
      result = result.filter((s) => s.type === "international");
      break;
    case "siblings":
      result = result.filter((s) => s.siblingsDiscount);
      break;
    case "specialNeeds":
      result = result.filter((s) => s.specialNeeds);
      break;
    default:
      result.sort((a, b) => b.fitScore - a.fitScore);
  }

  return result;
}
