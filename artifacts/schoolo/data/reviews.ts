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
  "1": [
    {
      id: "r1-1",
      authorName: "Ahmed Al-Rashidi",
      authorInitials: "AA",
      rating: 5,
      date: "March 2025",
      title: "Exceptional school — highly recommended",
      body: "Our son has been enrolled for 3 years and the transformation in his confidence and academic performance has been remarkable. Teachers are dedicated and the facilities are world-class. The AP programme really helped him get into a top US university.",
      tags: ["Academic Excellence", "Great Teachers"],
    },
    {
      id: "r1-2",
      authorName: "Sarah Thompson",
      authorInitials: "ST",
      rating: 5,
      date: "February 2025",
      title: "Best international school in Riyadh",
      body: "The diversity here is incredible — my daughter has classmates from 40+ countries. The school genuinely prepares students for a global future. Administration is responsive and the counselling team is excellent for university applications.",
      tags: ["Diverse Community", "University Prep"],
    },
    {
      id: "r1-3",
      authorName: "Khalid Mansour",
      authorInitials: "KM",
      rating: 4,
      date: "January 2025",
      title: "Great school, fees are high but worth it",
      body: "Very happy with the education quality. My only concern is the high fees, but the value you get in return — qualified teachers, excellent facilities, and a strong alumni network — makes it worthwhile. The special needs support team is also very professional.",
      tags: ["Good Value", "Special Needs Support"],
    },
    {
      id: "r1-4",
      authorName: "Fatima Al-Dosari",
      authorInitials: "FA",
      rating: 4,
      date: "December 2024",
      title: "Wonderful environment for learning",
      body: "The school environment is safe, inclusive, and stimulating. My twins love going to school every morning, which says everything. The cafeteria serves healthy meals and the after-school activities are varied and engaging.",
      tags: ["Safe Environment", "Good Facilities"],
    },
  ],
  "2": [
    {
      id: "r2-1",
      authorName: "James Harrington",
      authorInitials: "JH",
      rating: 5,
      date: "March 2025",
      title: "Outstanding British education in Saudi Arabia",
      body: "Having moved from the UK, I was nervous about maintaining educational continuity. BISR exceeded all expectations — the curriculum perfectly mirrors what you'd find at a top UK independent school, and the teaching staff are predominantly British-trained.",
      tags: ["British Curriculum", "Qualified Teachers"],
    },
    {
      id: "r2-2",
      authorName: "Mona Al-Zahrani",
      authorInitials: "MZ",
      rating: 5,
      date: "January 2025",
      title: "A-Level results are consistently impressive",
      body: "My daughter achieved 3 A*s in A-Levels after 7 years at BISR. The sixth form university preparation programme is incredible — she received offers from Cambridge, Edinburgh, and AUC. Worth every riyal.",
      tags: ["A-Level Excellence", "University Prep"],
    },
    {
      id: "r2-3",
      authorName: "Omar Abdullah",
      authorInitials: "OA",
      rating: 4,
      date: "February 2025",
      title: "Great school but parking is an issue",
      body: "The academic quality is top-notch. Teachers genuinely care about students and the pastoral support is excellent. The only drawback is the traffic and parking situation during drop-off — it can take 20 minutes to get in and out.",
      tags: ["Great Teachers", "Traffic Issues"],
    },
  ],
  "3": [
    {
      id: "r3-1",
      authorName: "Mohammed Al-Ghamdi",
      authorInitials: "MG",
      rating: 5,
      date: "March 2025",
      title: "Best value for money in Riyadh",
      body: "Al Rowad offers an excellent American curriculum at a fraction of the cost of other international schools. The 20% sibling discount was a major factor for our family — we enrolled three children and the savings are significant.",
      tags: ["Great Value", "Siblings Discount"],
    },
    {
      id: "r3-2",
      authorName: "Nora Al-Otaibi",
      authorInitials: "NO",
      rating: 4,
      date: "February 2025",
      title: "Good school with improving facilities",
      body: "The school has been investing in its facilities over the past two years. New science labs were recently opened and the sports courts were renovated. Teachers are enthusiastic and the class sizes are manageable.",
      tags: ["Improving Facilities", "Good Teachers"],
    },
  ],
  "4": [
    {
      id: "r4-1",
      authorName: "Abdullah Bin Saad",
      authorInitials: "AB",
      rating: 5,
      date: "March 2025",
      title: "The best Saudi curriculum school — period",
      body: "Manarat Al Riyadh has produced some of the Kingdom's top doctors, engineers, and lawyers. The Islamic values instilled here combined with strong academics make this the perfect choice for Saudi families who want their children rooted in their culture.",
      tags: ["Islamic Values", "Academic Rigor"],
    },
    {
      id: "r4-2",
      authorName: "Hessa Al-Mutairi",
      authorInitials: "HM",
      rating: 4,
      date: "January 2025",
      title: "Strong community and affordable fees",
      body: "We've had three children at Manarat over 12 years. The sibling discount is excellent — 25% off for each additional child. The parent community is very engaged and the school events throughout the year are wonderful.",
      tags: ["Affordable", "Strong Community"],
    },
  ],
  "5": [
    {
      id: "r5-1",
      authorName: "Lisa Chen",
      authorInitials: "LC",
      rating: 5,
      date: "March 2025",
      title: "Top-tier American school on the Jeddah Corniche",
      body: "The location is stunning and the school lives up to the view. AP results are phenomenal — last year's class had the highest AP scores in Saudi Arabia. The college counselling team secured admissions to MIT, Stanford, and Yale for three of our graduates.",
      tags: ["AP Excellence", "University Prep"],
    },
    {
      id: "r5-2",
      authorName: "Carlos Rivera",
      authorInitials: "CR",
      rating: 5,
      date: "February 2025",
      title: "Incredible arts and sports programmes",
      body: "Beyond academics, the school has outstanding arts and athletics facilities. The recording studio, black box theatre, and Olympic-sized swimming pool are used daily. My children are thriving here in ways I never expected.",
      tags: ["Arts Programme", "Sports Facilities"],
    },
  ],
  "6": [
    {
      id: "r6-1",
      authorName: "William Fraser",
      authorInitials: "WF",
      rating: 5,
      date: "March 2025",
      title: "Finest British school outside the UK",
      body: "The Jeddah Prep and Grammar School is simply outstanding. The discipline, academic standards, and pastoral care rival the best UK independent schools. IGCSE results are consistently above the global average and A-Level outcomes are exceptional.",
      tags: ["British Standard", "IGCSE Excellence"],
    },
  ],
  "7": [
    {
      id: "r7-1",
      authorName: "Priya Menon",
      authorInitials: "PM",
      rating: 4,
      date: "March 2025",
      title: "Excellent CBSE education at great value",
      body: "Indian International School has been serving the Indian community in Riyadh for over 60 years. The teachers are experienced, the CBSE curriculum is well-delivered, and the cultural festivals make our children proud of their heritage.",
      tags: ["CBSE Excellence", "Cultural Activities"],
    },
    {
      id: "r7-2",
      authorName: "Rajesh Sharma",
      authorInitials: "RS",
      rating: 5,
      date: "February 2025",
      title: "Best value school in Riyadh — 30% sibling discount!",
      body: "With three children enrolled, the 30% sibling discount saves us over SAR 9,000 per year. The academics are solid, English instruction is strong, and the school has excellent connections with Indian universities.",
      tags: ["Best Value", "Sibling Discount"],
    },
  ],
  "8": [
    {
      id: "r8-1",
      authorName: "Sultan Al-Harbi",
      authorInitials: "SH",
      rating: 4,
      date: "March 2025",
      title: "Great neighbourhood school",
      body: "Saudi National School Al Faisaliah is literally 5 minutes from our home. The teachers are caring, the Islamic studies programme is strong, and the enhanced English curriculum means our son is bilingual. Very happy with our choice.",
      tags: ["Convenient Location", "Bilingual"],
    },
  ],
  "9": [
    {
      id: "r9-1",
      authorName: "Dana Al-Qahtani",
      authorInitials: "DQ",
      rating: 5,
      date: "March 2025",
      title: "Excellent STEM focus in the Eastern Province",
      body: "New Horizon is transforming education in Dammam. The robotics lab is state-of-the-art and the STEM competitions team has won regional awards three years running. Very impressed with the quality of the science and maths faculty.",
      tags: ["STEM Focus", "Award-Winning"],
    },
  ],
  "10": [
    {
      id: "r10-1",
      authorName: "Emma Walsh",
      authorInitials: "EW",
      rating: 5,
      date: "March 2025",
      title: "The IB Diploma changed my daughter's life",
      body: "King's is the only true IB World School in central Riyadh offering the complete continuum. My daughter started in PYP at age 4 and just completed the IB Diploma with 42/45 points, gaining admission to UCL and the University of Amsterdam.",
      tags: ["IB Excellence", "Global Recognition"],
    },
    {
      id: "r10-2",
      authorName: "Rami Khalil",
      authorInitials: "RK",
      rating: 4,
      date: "January 2025",
      title: "Genuinely international community",
      body: "Over 55 nationalities represented in the school. The cultural diversity is real, not token — students celebrate Eid, Christmas, Diwali, and more together. The IB philosophy of international-mindedness is lived, not just taught.",
      tags: ["Diverse Community", "IB Values"],
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
