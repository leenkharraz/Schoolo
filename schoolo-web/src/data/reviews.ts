export interface Review {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  tags: string[];
}

export interface ReviewSummary {
  overall: number;
  totalCount: number;
  environment: number;
  teachingQuality: number;
  teacherEfficiency: number;
  priceValue: number;
  facilities: number;
  breakdown: { stars: number; count: number }[];
}

const ALL_REVIEWS: Record<string, Review[]> = {
  // ── Jeddah ──────────────────────────────────────────────────────────────────
  j1: [
    {
      id: "j1-1",
      authorName: "Mohammed Al-Ghamdi",
      authorInitials: "MG",
      rating: 5,
      date: "March 2025",
      title: "Great value school in Jeddah",
      body: "Dar Al Rowad offers an excellent American/National curriculum at a balanced cost. The 15% sibling discount was a major factor for our family. Teachers are dedicated and the facilities meet all expectations.",
      tags: ["Great Value", "Siblings Discount"],
    },
    {
      id: "j1-2",
      authorName: "Nora Al-Otaibi",
      authorInitials: "NO",
      rating: 4,
      date: "February 2025",
      title: "Good school with strong discipline",
      body: "The school has a clear focus on discipline and foundational learning. My son has improved significantly in both Arabic and English. New science labs were recently opened and class sizes are manageable.",
      tags: ["Discipline", "Academic Focus"],
    },
  ],
  j2: [
    {
      id: "j2-1",
      authorName: "Lisa Chen",
      authorInitials: "LC",
      rating: 5,
      date: "March 2025",
      title: "Top-tier American school in Jeddah",
      body: "The AP programme here is exceptional — last year's class achieved the highest AP scores in the region. The college counselling team secured admissions to MIT, Stanford, and Yale for three of our graduates.",
      tags: ["AP Excellence", "University Prep"],
    },
    {
      id: "j2-2",
      authorName: "Carlos Rivera",
      authorInitials: "CR",
      rating: 5,
      date: "February 2025",
      title: "Incredible arts and sports programmes",
      body: "Beyond academics, the school has outstanding arts and athletics facilities. The recording studio, black box theatre, and Olympic-sized pool are used daily. My children are thriving here in ways I never expected.",
      tags: ["Arts Programme", "Sports Facilities"],
    },
    {
      id: "j2-3",
      authorName: "Fatima Al-Dosari",
      authorInitials: "FA",
      rating: 4,
      date: "January 2025",
      title: "Worth every riyal",
      body: "Fees are high but the value is undeniable. The special needs support team is exceptional and the diversity — over 40 nationalities — makes it a truly global environment for our daughter.",
      tags: ["Special Needs Support", "Diverse Community"],
    },
  ],
  j3: [
    {
      id: "j3-1",
      authorName: "William Fraser",
      authorInitials: "WF",
      rating: 5,
      date: "March 2025",
      title: "Finest British school in Jeddah",
      body: "Having moved from the UK, BISJ exceeded all expectations. IGCSE results are consistently above the global average and A-Level outcomes are exceptional. The pastoral care rivals the best UK independent schools.",
      tags: ["British Curriculum", "IGCSE Excellence"],
    },
    {
      id: "j3-2",
      authorName: "Mona Al-Zahrani",
      authorInitials: "MZ",
      rating: 4,
      date: "January 2025",
      title: "Strong community and excellent academics",
      body: "My daughter achieved 3 A*s in A-Levels after 6 years at BISJ. The Sixth Form university preparation programme is incredible — she received offers from King's College London and the University of Edinburgh.",
      tags: ["A-Level Excellence", "University Prep"],
    },
  ],
  j4: [
    {
      id: "j4-1",
      authorName: "Omar Abdullah",
      authorInitials: "OA",
      rating: 5,
      date: "February 2025",
      title: "Balanced academics and facilities",
      body: "Jeddah Knowledge International offers a genuinely international environment. The American curriculum is delivered well, facilities are excellent, and the multilingual environment — English, Arabic, and French — is a huge benefit.",
      tags: ["International", "Multilingual"],
    },
    {
      id: "j4-2",
      authorName: "Sarah Thompson",
      authorInitials: "ST",
      rating: 4,
      date: "March 2025",
      title: "Great choice for our family",
      body: "Very happy with the education quality. The school invests heavily in student development, not just academics. Robotics club and MUN programme are standouts. The 10% sibling discount helps with costs.",
      tags: ["Student Development", "Activities"],
    },
  ],
  j5: [
    {
      id: "j5-1",
      authorName: "Sultan Al-Harbi",
      authorInitials: "SH",
      rating: 4,
      date: "March 2025",
      title: "Great neighbourhood school, affordable fees",
      body: "Al Waha is 5 minutes from our home and delivers solid academics in English and Arabic. Teachers are caring and the 20% sibling discount is the best I've seen. Perfect for families on a budget.",
      tags: ["Affordable", "Convenient Location"],
    },
  ],

  // ── Riyadh ───────────────────────────────────────────────────────────────────
  r1: [
    {
      id: "r1-1",
      authorName: "Ahmed Al-Rashidi",
      authorInitials: "AA",
      rating: 5,
      date: "March 2025",
      title: "Exceptional — the best international school in Riyadh",
      body: "Our son has been enrolled for 3 years and the transformation in his confidence and academic performance has been remarkable. Teachers are dedicated, facilities are world-class. The IB and AP programmes helped him gain admission to a top US university.",
      tags: ["Academic Excellence", "Great Teachers"],
    },
    {
      id: "r1-2",
      authorName: "Sarah Thompson",
      authorInitials: "ST",
      rating: 5,
      date: "February 2025",
      title: "Best international school in Saudi Arabia",
      body: "The diversity here is incredible — my daughter has classmates from 40+ countries. Administration is responsive, the counselling team is outstanding for university applications, and the school genuinely prepares students for a global future.",
      tags: ["Diverse Community", "University Prep"],
    },
    {
      id: "r1-3",
      authorName: "Khalid Mansour",
      authorInitials: "KM",
      rating: 4,
      date: "January 2025",
      title: "High fees, but absolutely worth it",
      body: "The value you get in return — qualified teachers, excellent facilities, and a strong alumni network — makes it worthwhile. The special needs support team is also very professional and caring.",
      tags: ["Good Value", "Special Needs Support"],
    },
  ],
  r2: [
    {
      id: "r2-1",
      authorName: "James Harrington",
      authorInitials: "JH",
      rating: 5,
      date: "March 2025",
      title: "Outstanding British education in Riyadh",
      body: "BISR exceeded all expectations — the curriculum perfectly mirrors what you'd find at a top UK independent school, and the teaching staff are predominantly British-trained. A seamless transition from the UK.",
      tags: ["British Curriculum", "Qualified Teachers"],
    },
    {
      id: "r2-2",
      authorName: "Mona Al-Zahrani",
      authorInitials: "MZ",
      rating: 5,
      date: "January 2025",
      title: "A-Level results speak for themselves",
      body: "My daughter achieved 3 A*s after 7 years at BISR. The Sixth Form university preparation programme is incredible — she received offers from Cambridge, Edinburgh, and AUC. Worth every riyal.",
      tags: ["A-Level Excellence", "University Prep"],
    },
    {
      id: "r2-3",
      authorName: "Omar Abdullah",
      authorInitials: "OA",
      rating: 4,
      date: "February 2025",
      title: "Excellent quality, minor logistical issues",
      body: "The academic quality is top-notch. The only drawback is the traffic and parking situation during drop-off — it can take 20 minutes to get in and out. Otherwise, outstanding.",
      tags: ["Great Teachers", "Traffic Issues"],
    },
  ],
  r3: [
    {
      id: "r3-1",
      authorName: "Abdullah Bin Saad",
      authorInitials: "AB",
      rating: 4,
      date: "March 2025",
      title: "Solid mid-range school with real value",
      body: "Advanced Learning Schools delivers a consistent American curriculum at a very reasonable price point. The 20% sibling discount is excellent and teachers are enthusiastic. Class sizes are manageable.",
      tags: ["Great Value", "Siblings Discount"],
    },
    {
      id: "r3-2",
      authorName: "Hessa Al-Mutairi",
      authorInitials: "HM",
      rating: 4,
      date: "January 2025",
      title: "Good school, improving every year",
      body: "The school has been investing in facilities. New science labs were recently opened and the sports courts renovated. The parent community is engaged and school events throughout the year are wonderful.",
      tags: ["Improving Facilities", "Good Community"],
    },
  ],
  r4: [
    {
      id: "r4-1",
      authorName: "Emma Walsh",
      authorInitials: "EW",
      rating: 5,
      date: "March 2025",
      title: "The IB changed my daughter's life",
      body: "SEK is one of the few genuine IB schools in Riyadh. My daughter completed the IB Diploma with 41/45 points, gaining admission to UCL and the University of Amsterdam. The trilingual environment is an added bonus.",
      tags: ["IB Excellence", "Global Recognition"],
    },
    {
      id: "r4-2",
      authorName: "Rami Khalil",
      authorInitials: "RK",
      rating: 4,
      date: "January 2025",
      title: "Genuinely international community",
      body: "Over 50 nationalities represented here. The cultural diversity is real, not token — students celebrate Eid, Christmas, Diwali, and more together. The IB philosophy of international-mindedness is genuinely lived.",
      tags: ["Diverse Community", "IB Values"],
    },
  ],
  r5: [
    {
      id: "r5-1",
      authorName: "Priya Menon",
      authorInitials: "PM",
      rating: 4,
      date: "March 2025",
      title: "Best budget option in Riyadh",
      body: "Al Faris delivers solid English-based education at an accessible price. The 25% sibling discount is the best I've seen. Teachers are caring and the school community is welcoming.",
      tags: ["Affordable", "Sibling Discount"],
    },
  ],

  // ── Dammam ───────────────────────────────────────────────────────────────────
  d1: [
    {
      id: "d1-1",
      authorName: "Dana Al-Qahtani",
      authorInitials: "DQ",
      rating: 5,
      date: "March 2025",
      title: "Outstanding American school in the Eastern Province",
      body: "ISG Dammam is transforming education in the region. The robotics lab is state-of-the-art, the STEM competitions team has won regional awards three years running, and the diverse student community is exceptional.",
      tags: ["STEM Focus", "Diverse Community"],
    },
    {
      id: "d1-2",
      authorName: "Khalid Al-Bahrani",
      authorInitials: "KB",
      rating: 4,
      date: "February 2025",
      title: "Great for expat families in Dammam",
      body: "We moved from the US and ISG made the transition seamless. The American curriculum is familiar and the English, Arabic, and Spanish trilingual offer is excellent for our children's future.",
      tags: ["American Curriculum", "Expat Friendly"],
    },
  ],
  d2: [
    {
      id: "d2-1",
      authorName: "William Fraser",
      authorInitials: "WF",
      rating: 5,
      date: "March 2025",
      title: "A historic British institution in Dhahran",
      body: "Dhahran British Grammar School has served the Eastern Province for decades. The discipline, academic standards, and pastoral care rival the best UK schools. IGCSE results are consistently above the global average.",
      tags: ["British Curriculum", "Heritage School"],
    },
  ],
  d3: [
    {
      id: "d3-1",
      authorName: "Sultan Al-Harbi",
      authorInitials: "SH",
      rating: 4,
      date: "March 2025",
      title: "Great regional school, excellent value",
      body: "Al Hussan is the best international-style school in Dammam for the price. The 15% sibling discount helped our family significantly. Teachers are experienced and the American curriculum is well-delivered.",
      tags: ["Value", "Sibling Discount"],
    },
  ],
  d4: [
    {
      id: "d4-1",
      authorName: "Ahmed Bin Nasser",
      authorInitials: "AN",
      rating: 4,
      date: "February 2025",
      title: "Affordable and reliable",
      body: "Al Manahil delivers core academics at an affordable price. The national curriculum is strong, the Quran programme is excellent, and the 20% sibling discount makes it accessible for families with multiple children.",
      tags: ["Affordable", "National Curriculum"],
    },
  ],
  d5: [
    {
      id: "d5-1",
      authorName: "Nora Al-Otaibi",
      authorInitials: "NO",
      rating: 4,
      date: "March 2025",
      title: "A growing school with improving facilities",
      body: "Future International is investing in its campus — the new swimming pool and gymnasium are excellent additions. The 18% sibling discount is generous and the special needs support team is attentive.",
      tags: ["Growing School", "Special Needs Support"],
    },
  ],
};

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "default-1",
    authorName: "Parent Review",
    authorInitials: "PR",
    rating: 4,
    date: "2025",
    title: "Good school",
    body: "Overall a positive experience. Would recommend to other families.",
    tags: [],
  },
];

export function getReviews(schoolId: string): Review[] {
  return ALL_REVIEWS[schoolId] || DEFAULT_REVIEWS;
}

export function getReviewSummary(schoolId: string, overallRating: number): ReviewSummary {
  const reviews = getReviews(schoolId);
  const count = reviews.length;
  const avg = overallRating;

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  return {
    overall: avg,
    totalCount: count,
    environment: Math.min(5, avg + 0.1),
    teachingQuality: Math.min(5, avg + 0.15),
    teacherEfficiency: avg - 0.1,
    priceValue: Math.max(3, avg - 0.5),
    facilities: Math.min(5, avg + 0.05),
    breakdown,
  };
}

export interface AppointmentSlot {
  date: string;
  day: string;
  time: string;
  available: boolean;
}

export function getScheduleSlots(): AppointmentSlot[] {
  return [
    { date: "Sun 11 May", day: "Sunday", time: "09:00 AM", available: true },
    { date: "Sun 11 May", day: "Sunday", time: "11:00 AM", available: false },
    { date: "Mon 12 May", day: "Monday", time: "10:00 AM", available: true },
    { date: "Mon 12 May", day: "Monday", time: "02:00 PM", available: true },
    { date: "Wed 14 May", day: "Wednesday", time: "09:30 AM", available: true },
    { date: "Wed 14 May", day: "Wednesday", time: "11:30 AM", available: false },
    { date: "Thu 15 May", day: "Thursday", time: "10:00 AM", available: true },
    { date: "Thu 15 May", day: "Thursday", time: "03:00 PM", available: true },
    { date: "Sun 18 May", day: "Sunday", time: "09:00 AM", available: true },
    { date: "Mon 19 May", day: "Monday", time: "01:00 PM", available: true },
  ];
}
