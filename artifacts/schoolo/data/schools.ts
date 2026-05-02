import type { SchoolImageKey } from "./schoolImages";

export interface School {
  id: string;
  name: string;
  nameAr: string;
  rating: number;
  totalRatings: number;
  images: SchoolImageKey[];
  type: "private" | "international";
  curriculum: "Saudi National" | "British" | "American" | "IB" | "Indian" | "French";
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
}

export const SCHOOLS: School[] = [
  {
    id: "1",
    name: "International School of Riyadh",
    nameAr: "المدرسة الدولية بالرياض",
    rating: 4.8,
    totalRatings: 312,
    images: ["s1", "s2", "s3"],
    type: "international",
    curriculum: "American",
    location: { city: "Riyadh", district: "Al Nakheel", distance: 3.2 },
    fees: {
      tuition: 65000,
      registration: 5000,
      uniform: 2500,
      transport: 8000,
      activities: 3000,
      totalEstimate: 83500,
    },
    facilities: ["Swimming Pool", "Science Labs", "Sports Courts", "Library", "Cafeteria", "Mosque", "Auditorium", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 15,
    extracurriculars: ["Football", "Basketball", "Swimming", "Art", "Chess", "Robotics", "Drama", "MUN"],
    grades: "KG1 – Grade 12",
    studentCount: 2400,
    established: 1968,
    languages: ["English", "Arabic"],
    description: "One of Riyadh's most prestigious international schools offering a fully accredited American curriculum with world-class facilities and a rich tradition of academic excellence.",
    fitScore: 95,
    gender: "mixed",
    accreditation: ["AdvancED", "NEASC"],
    color: "#EA8B33",
  },
  {
    id: "2",
    name: "British International School Riyadh",
    nameAr: "المدرسة البريطانية الدولية بالرياض",
    rating: 4.7,
    totalRatings: 278,
    images: ["s2", "s4", "s1"],
    type: "international",
    curriculum: "British",
    location: { city: "Riyadh", district: "Al Malqa", distance: 5.8 },
    fees: {
      tuition: 72000,
      registration: 6000,
      uniform: 3000,
      transport: 9000,
      activities: 4000,
      totalEstimate: 94000,
    },
    facilities: ["Swimming Pool", "Science Labs", "Tennis Courts", "Library", "Cafeteria", "Mosque", "Theatre", "Art Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 10,
    extracurriculars: ["Cricket", "Swimming", "Theatre", "Orchestra", "Debate", "Photography", "Coding Club"],
    grades: "FS1 – Year 13",
    studentCount: 1800,
    established: 1985,
    languages: ["English", "Arabic", "French"],
    description: "A leading British curriculum school in Riyadh providing an outstanding education from Foundation Stage through Sixth Form, with A-Level preparation and University counselling.",
    fitScore: 88,
    gender: "mixed",
    accreditation: ["BSO", "CIS"],
    color: "#32667F",
  },
  {
    id: "3",
    name: "Al Rowad International School",
    nameAr: "مدارس الرواد الدولية",
    rating: 4.6,
    totalRatings: 195,
    images: ["s3", "s1", "s5"],
    type: "private",
    curriculum: "American",
    location: { city: "Riyadh", district: "Al Olaya", distance: 2.1 },
    fees: {
      tuition: 42000,
      registration: 3500,
      uniform: 1800,
      transport: 6000,
      activities: 2500,
      totalEstimate: 55800,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Computer Lab", "Art Room"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 20,
    extracurriculars: ["Football", "Basketball", "Scouting", "Art", "Quran Club", "Science Club"],
    grades: "KG1 – Grade 12",
    studentCount: 1200,
    established: 2003,
    languages: ["English", "Arabic"],
    description: "A well-established private school blending American curriculum excellence with strong Islamic values and Arabic language instruction, ideal for Saudi families seeking balanced education.",
    fitScore: 82,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#EAA23A",
  },
  {
    id: "4",
    name: "Manarat Al Riyadh Schools",
    nameAr: "مدارس منارات الرياض",
    rating: 4.5,
    totalRatings: 421,
    images: ["s4", "s2", "s3"],
    type: "private",
    curriculum: "Saudi National",
    location: { city: "Riyadh", district: "Al Wurud", distance: 1.5 },
    fees: {
      tuition: 22000,
      registration: 2000,
      uniform: 1200,
      transport: 4500,
      activities: 1500,
      totalEstimate: 31200,
    },
    facilities: ["Sports Field", "Library", "Cafeteria", "Mosque", "Computer Lab", "Science Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 25,
    extracurriculars: ["Football", "Quran Memorisation", "Calligraphy", "Science Club", "Scouting"],
    grades: "KG1 – Grade 12",
    studentCount: 3200,
    established: 1993,
    languages: ["Arabic", "English"],
    description: "One of the most trusted Saudi National curriculum schools in Riyadh, with a strong reputation for academic rigour, Islamic education, and community values across three decades.",
    fitScore: 75,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#132F45",
  },
  {
    id: "5",
    name: "American International School Jeddah",
    nameAr: "المدرسة الأمريكية الدولية بجدة",
    rating: 4.9,
    totalRatings: 187,
    images: ["s1", "s5", "s2"],
    type: "international",
    curriculum: "American",
    location: { city: "Jeddah", district: "Al Hamra", distance: 8.4 },
    fees: {
      tuition: 68000,
      registration: 5500,
      uniform: 2800,
      transport: 8500,
      activities: 3500,
      totalEstimate: 88300,
    },
    facilities: ["Olympic Pool", "Science Labs", "Tennis Courts", "Library", "Cafeteria", "Mosque", "Black Box Theatre", "Recording Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 12,
    extracurriculars: ["Swimming", "Tennis", "Theatre", "Film Club", "Robotics", "MUN", "DECA"],
    grades: "PreK – Grade 12",
    studentCount: 1650,
    established: 1972,
    languages: ["English", "Arabic", "Spanish"],
    description: "A prestigious international school on the Jeddah Corniche offering a rigorous American curriculum from Pre-K through Grade 12 with exceptional arts, athletics, and Advanced Placement programmes.",
    fitScore: 91,
    gender: "mixed",
    accreditation: ["AdvancED", "Middle States"],
    color: "#EA8B33",
  },
  {
    id: "6",
    name: "Jeddah Prep and Grammar School",
    nameAr: "مدرسة جدة التحضيرية والقواعد",
    rating: 4.7,
    totalRatings: 143,
    images: ["s5", "s3", "s4"],
    type: "international",
    curriculum: "British",
    location: { city: "Jeddah", district: "Al Rawdah", distance: 10.2 },
    fees: {
      tuition: 78000,
      registration: 6500,
      uniform: 3200,
      transport: 9500,
      activities: 4200,
      totalEstimate: 101400,
    },
    facilities: ["Heated Pool", "Astroturf Pitch", "Science Labs", "Library", "Cafeteria", "Mosque", "Performing Arts Centre"],
    specialNeeds: true,
    siblingsDiscount: false,
    siblingsDiscountPercent: 0,
    extracurriculars: ["Rugby", "Swimming", "Drama", "Orchestra", "Debating", "Duke of Edinburgh"],
    grades: "Year 1 – Year 13",
    studentCount: 980,
    established: 1979,
    languages: ["English", "Arabic", "French"],
    description: "Jeddah's most prestigious British school offering IGCSE and A-Level programmes in a structured, disciplined environment with a focus on critical thinking and character development.",
    fitScore: 84,
    gender: "mixed",
    accreditation: ["BSO", "CIS", "BSME"],
    color: "#32667F",
  },
  {
    id: "7",
    name: "Indian International School Riyadh",
    nameAr: "المدرسة الهندية الدولية بالرياض",
    rating: 4.4,
    totalRatings: 534,
    images: ["s2", "s1", "s5"],
    type: "international",
    curriculum: "Indian",
    location: { city: "Riyadh", district: "Al Naseem", distance: 4.7 },
    fees: {
      tuition: 15000,
      registration: 1500,
      uniform: 800,
      transport: 3500,
      activities: 1000,
      totalEstimate: 21800,
    },
    facilities: ["Sports Courts", "Library", "Cafeteria", "Mosque", "Computer Lab", "Science Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 30,
    extracurriculars: ["Cricket", "Badminton", "Classical Dance", "Drawing", "Science Fair", "Quran Club"],
    grades: "LKG – Grade 12",
    studentCount: 4500,
    established: 1960,
    languages: ["English", "Hindi", "Arabic"],
    description: "The oldest and largest CBSE-affiliated school in Saudi Arabia, offering an affordable Indian curriculum education with strong academics, cultural activities and a diverse community.",
    fitScore: 70,
    gender: "mixed",
    accreditation: ["CBSE (India)", "Ministry of Education KSA"],
    color: "#F3B940",
  },
  {
    id: "8",
    name: "Saudi National School Al Faisaliah",
    nameAr: "المدرسة الوطنية السعودية الفيصلية",
    rating: 4.3,
    totalRatings: 289,
    images: ["s3", "s4", "s2"],
    type: "private",
    curriculum: "Saudi National",
    location: { city: "Riyadh", district: "Al Faisaliah", distance: 0.9 },
    fees: {
      tuition: 18000,
      registration: 1800,
      uniform: 1000,
      transport: 3800,
      activities: 1200,
      totalEstimate: 25800,
    },
    facilities: ["Sports Field", "Library", "Cafeteria", "Mosque", "Computer Lab"],
    specialNeeds: false,
    siblingsDiscount: true,
    siblingsDiscountPercent: 20,
    extracurriculars: ["Football", "Quran Memorisation", "Art Club", "Science Fair"],
    grades: "KG1 – Grade 12",
    studentCount: 1800,
    established: 2001,
    languages: ["Arabic", "English"],
    description: "A trusted neighbourhood school offering the Saudi National curriculum with enhanced English and technology programmes, serving the Al Faisaliah community for over two decades.",
    fitScore: 68,
    gender: "mixed",
    accreditation: ["Ministry of Education KSA"],
    color: "#132F45",
  },
  {
    id: "9",
    name: "New Horizon International School",
    nameAr: "مدرسة الأفق الجديد الدولية",
    rating: 4.5,
    totalRatings: 167,
    images: ["s4", "s5", "s1"],
    type: "international",
    curriculum: "American",
    location: { city: "Dammam", district: "Al Faisaliah", distance: 7.3 },
    fees: {
      tuition: 38000,
      registration: 3200,
      uniform: 1600,
      transport: 5500,
      activities: 2000,
      totalEstimate: 50300,
    },
    facilities: ["Sports Courts", "Science Labs", "Library", "Cafeteria", "Mosque", "Swimming Pool", "Gymnasium"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 18,
    extracurriculars: ["Football", "Swimming", "Robotics", "Art", "Debate Club", "Scout"],
    grades: "KG1 – Grade 12",
    studentCount: 900,
    established: 2008,
    languages: ["English", "Arabic"],
    description: "The Eastern Province's rising academic star, combining rigorous American curriculum standards with modern facilities and a strong STEM focus for the next generation of Saudi leaders.",
    fitScore: 78,
    gender: "mixed",
    accreditation: ["AdvancED", "Ministry of Education KSA"],
    color: "#EAA23A",
  },
  {
    id: "10",
    name: "King's International School",
    nameAr: "مدرسة كينغز الدولية",
    rating: 4.6,
    totalRatings: 203,
    images: ["s5", "s2", "s3"],
    type: "private",
    curriculum: "IB",
    location: { city: "Riyadh", district: "Al Mohammadiah", distance: 6.1 },
    fees: {
      tuition: 55000,
      registration: 5000,
      uniform: 2200,
      transport: 7500,
      activities: 3500,
      totalEstimate: 73200,
    },
    facilities: ["Swimming Pool", "Science Labs", "Sports Courts", "Library", "Cafeteria", "Mosque", "Design & Technology Lab", "Art Studio"],
    specialNeeds: true,
    siblingsDiscount: true,
    siblingsDiscountPercent: 15,
    extracurriculars: ["Swimming", "Football", "CAS Projects", "Model UN", "Photography", "Community Service"],
    grades: "PYP – DP (Ages 3–18)",
    studentCount: 1100,
    established: 2010,
    languages: ["English", "Arabic", "French"],
    description: "Riyadh's premier IB World School offering the complete IB continuum — PYP, MYP, and Diploma — cultivating internationally-minded, principled graduates ready for the world's top universities.",
    fitScore: 89,
    gender: "mixed",
    accreditation: ["IBO", "CIS"],
    color: "#32667F",
  },
];

export function getSchoolById(id: string): School | undefined {
  return SCHOOLS.find((s) => s.id === id);
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
    default:
      result.sort((a, b) => b.fitScore - a.fitScore);
  }

  return result;
}
