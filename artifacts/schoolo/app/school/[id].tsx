import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { getReviews, getReviewSummary, getScheduleSlots, type AppointmentSlot, type Review } from "@/data/reviews";
import { SCHOOL_IMAGE_MAP } from "@/data/schoolImages";
import { getSchoolById } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FACILITY_IMAGE_MAP: Record<string, string> = {
  Pool: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=300&h=200&fit=crop",
  Lab: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop",
  Library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
  Cafeteria: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=300&h=200&fit=crop",
  Mosque: "https://images.unsplash.com/photo-1548013146-72479768bada?w=300&h=200&fit=crop",
  Computer: "https://images.unsplash.com/photo-1588702547923-7408028a12fd?w=300&h=200&fit=crop",
  Court: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
  Field: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&h=200&fit=crop",
  Pitch: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300&h=200&fit=crop",
  Gymnasium: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
  Gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop",
  Theatre: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=300&h=200&fit=crop",
  Auditorium: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop",
  "Art Studio": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop",
  "Art Room": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=200&fit=crop",
  Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&h=200&fit=crop",
  Design: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
  Recording: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=200&fit=crop",
  Performing: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=300&h=200&fit=crop",
  Sports: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
};

function getFacilityImageUri(facility: string): string {
  for (const [key, url] of Object.entries(FACILITY_IMAGE_MAP)) {
    if (facility.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop";
}

function getSchoolInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type PaymentMode = "annual" | "term" | "monthly";
type ApplyStep = 1 | 2 | 3;

// ─── Small helpers ─────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children, actionLabel, onAction }: {
  title: string; icon: string; children: React.ReactNode; actionLabel?: string; onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      <View style={styles.sectionCardHeader}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
        <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{title}</Text>
        {actionLabel && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
            <Text style={[styles.sectionActionText, { color: colors.primary }]}>{actionLabel}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= Math.floor(rating) ? "star" : i - rating < 1 ? "star-half" : "star-outline"} size={size} color="#F3B940" />
      ))}
    </View>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const colors = useColors();
  return (
    <View style={styles.ratingBarRow}>
      <Text style={[styles.ratingBarLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.ratingBarTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.ratingBarFill, { width: `${(value / 5) * 100}%`, backgroundColor: colors.primary }]} />
      </View>
      <Text style={[styles.ratingBarValue, { color: colors.foreground }]}>{value.toFixed(1)}</Text>
    </View>
  );
}

function FeeRow({ label, amount, highlight }: { label: string; amount: number; highlight?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.feeRow, {
      backgroundColor: highlight ? colors.muted : "transparent",
      borderRadius: highlight ? 10 : 0,
      paddingHorizontal: highlight ? 12 : 0,
    }]}>
      <Text style={[styles.feeLabel, { color: highlight ? colors.foreground : colors.mutedForeground, fontWeight: highlight ? "700" : "500" }]}>
        {label}
      </Text>
      <Text style={[styles.feeAmount, { color: highlight ? colors.primary : colors.foreground, fontWeight: highlight ? "800" : "600" }]}>
        SAR {amount.toLocaleString()}
      </Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function SchoolDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorites, toggleFavorite, addBooking } = useApp();

  const school = getSchoolById(id ?? "");
  const isFav = favorites.includes(id ?? "");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("annual");
  const [showCalculator, setShowCalculator] = useState(false);
  const [galleryModalIndex, setGalleryModalIndex] = useState<number | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [slotBooked, setSlotBooked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState<ApplyStep>(1);
  const [applyForm, setApplyForm] = useState({
    studentName: "", dob: "", gender: "Male", currentGrade: "", parentName: "", parentPhone: "", parentEmail: "", agreedToTnC: false,
  });
  const [applySlot, setApplySlot] = useState<AppointmentSlot | null>(null);
  const [applyDone, setApplyDone] = useState(false);

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  if (!school) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.mutedForeground }}>School not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = school.images.map((key) => SCHOOL_IMAGE_MAP[key]);
  const reviews = getReviews(school.id);
  const summary = getReviewSummary(school.id, school.rating);
  const scheduleSlots = getScheduleSlots();

  const getFeeByMode = (base: number): number => {
    if (paymentMode === "term") return Math.round(base / 3);
    if (paymentMode === "monthly") return Math.round(base / 10);
    return base;
  };
  const modeSuffix = paymentMode === "term" ? "/term" : paymentMode === "monthly" ? "/month" : "/year";

  const totalCostSiblings = school.siblingsDiscount
    ? Math.round(school.fees.totalEstimate * 2 * (1 - school.siblingsDiscountPercent / 100))
    : school.fees.totalEstimate * 2;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* Image Gallery */}
        <View style={styles.gallery}>
          <FlatList
            data={images}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.92} onPress={() => setGalleryModalIndex(index)}>
                <Image source={item} style={{ width: SCREEN_WIDTH, height: 300 }} contentFit="cover" />
              </TouchableOpacity>
            )}
          />
          <LinearGradient colors={["rgba(19,47,69,0.6)", "transparent"]} style={styles.galleryTopGrad} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} />
          <View style={[styles.galleryControls, { paddingTop: insets.top + topPaddingWeb + 8 }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}>
              <Ionicons name="arrow-back" size={20} color={colors.navy} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { toggleFavorite(school.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
            >
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={isFav ? colors.primary : colors.navy} />
            </TouchableOpacity>
          </View>
          {images.length > 1 && (
            <View style={styles.dotRow}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i === activeImageIndex ? colors.primary : "rgba(255,255,255,0.5)", width: i === activeImageIndex ? 18 : 7 }]} />
              ))}
            </View>
          )}
          <View style={[styles.tapHint, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
            <Ionicons name="expand-outline" size={12} color="rgba(255,255,255,0.9)" />
            <Text style={styles.tapHintText}>Tap to expand</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Identity */}
          <View style={styles.identityBlock}>
            <View style={styles.identityTop}>
              <View style={[styles.schoolLogoMini, { backgroundColor: school.color }]}>
                <Text style={styles.schoolLogoMiniText}>{getSchoolInitials(school.name)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.schoolName, { color: colors.foreground }]}>{school.name}</Text>
                <Text style={[styles.schoolNameAr, { color: colors.mutedForeground }]}>{school.nameAr}</Text>
              </View>
              <View style={[styles.fitBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.fitBadgeText}>{school.fitScore}%</Text>
              </View>
            </View>

            {/* Stars — clickable */}
            <TouchableOpacity onPress={() => setShowReviewsModal(true)} style={styles.ratingRow}>
              <StarRow rating={school.rating} size={16} />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>{school.rating}</Text>
              <Text style={[styles.ratingCount, { color: colors.mutedForeground }]}>({school.totalRatings} reviews)</Text>
              <View style={[styles.readReviewsBtn, { backgroundColor: colors.muted, borderRadius: 999 }]}>
                <Text style={[styles.readReviewsBtnText, { color: colors.primary }]}>Read</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.badgeRow}>
              <View style={[styles.chip, { backgroundColor: colors.muted }]}><Text style={[styles.chipText, { color: colors.foreground }]}>{school.curriculum}</Text></View>
              <View style={[styles.chip, { backgroundColor: "#EEF5FA" }]}><Text style={[styles.chipText, { color: colors.secondary }]}>{school.type === "international" ? "International" : "Private"}</Text></View>
              <View style={[styles.chip, { backgroundColor: "#FEF0E0" }]}><Text style={[styles.chipText, { color: colors.primary }]}>{school.location.city}</Text></View>
              <View style={[styles.chip, { backgroundColor: "#F5F5F5" }]}><Text style={[styles.chipText, { color: "#555" }]}>{school.grades}</Text></View>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {school.location.district}, {school.location.city} · <Text style={{ fontWeight: "700", color: colors.primary }}>{school.location.distance} km away</Text>
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {school.studentCount.toLocaleString()} students · Est. {school.established}
              </Text>
            </View>
            <Text style={[styles.description, { color: colors.foreground }]}>{school.description}</Text>
          </View>

          {/* Fit Score */}
          <View style={[styles.fitScoreCard, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <View style={styles.fitScoreTop}>
              <Text style={[styles.fitScoreLabel, { color: colors.foreground }]}>School Fit Score</Text>
              <Text style={[styles.fitScoreValue, { color: colors.primary }]}>{school.fitScore}%</Text>
            </View>
            <View style={[styles.fitScoreBar, { backgroundColor: colors.border }]}>
              <View style={[styles.fitScoreFill, { width: `${school.fitScore}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.fitScoreSub, { color: colors.mutedForeground }]}>Based on your budget, curriculum preference, and location</Text>
          </View>

          {/* Reviews Preview */}
          <SectionCard title="Reviews" icon="star-outline" actionLabel="View All" onAction={() => setShowReviewsModal(true)}>
            <View style={styles.reviewPreviewRow}>
              <View style={styles.reviewBigScore}>
                <Text style={[styles.reviewBigNum, { color: colors.foreground }]}>{school.rating}</Text>
                <StarRow rating={school.rating} size={16} />
                <Text style={[styles.reviewTotal, { color: colors.mutedForeground }]}>{school.totalRatings} reviews</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <RatingBar label="Environment" value={summary.environment} />
                <RatingBar label="Teaching" value={summary.teachingQuality} />
                <RatingBar label="Facilities" value={summary.facilities} />
                <RatingBar label="Price Value" value={summary.priceValue} />
              </View>
            </View>
            {reviews.slice(0, 1).map((r) => (
              <TouchableOpacity key={r.id} onPress={() => setShowReviewsModal(true)}
                style={[styles.reviewCard, { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10 }]}
              >
                <View style={styles.reviewCardTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.reviewAvatarText}>{r.authorInitials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>{r.authorName}</Text>
                    <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
                  </View>
                  <StarRow rating={r.rating} size={12} />
                </View>
                <Text style={[styles.reviewTitle, { color: colors.foreground }]}>{r.title}</Text>
                <Text style={[styles.reviewBody, { color: colors.mutedForeground }]} numberOfLines={2}>{r.body}</Text>
                <Text style={[styles.readMore, { color: colors.primary }]}>Read all {reviews.length} reviews →</Text>
              </TouchableOpacity>
            ))}
          </SectionCard>

          {/* Fees */}
          <SectionCard title="Fees & Costs" icon="wallet-outline">
            {/* Payment mode tabs */}
            <View style={[styles.paymentTabs, { backgroundColor: colors.muted, borderRadius: 10 }]}>
              {(["annual", "term", "monthly"] as PaymentMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => { setPaymentMode(m); Haptics.selectionAsync(); }}
                  style={[styles.paymentTab, { backgroundColor: paymentMode === m ? colors.card : "transparent", borderRadius: 8, shadowOpacity: paymentMode === m ? 0.06 : 0 }]}
                >
                  <Text style={[styles.paymentTabText, { color: paymentMode === m ? colors.primary : colors.mutedForeground, fontWeight: paymentMode === m ? "700" : "500" }]}>
                    {m === "annual" ? "Full Year" : m === "term" ? "Per Term" : "Monthly"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {paymentMode !== "annual" && (
              <View style={[styles.paymentNote, { backgroundColor: "#FEF0E0", borderRadius: 8 }]}>
                <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
                <Text style={[styles.paymentNoteText, { color: colors.primary }]}>
                  {paymentMode === "term" ? "3 equal payments per academic year (Sept, Jan, Apr)" : "10 monthly instalments over the academic year"}
                </Text>
              </View>
            )}

            <View style={styles.feeList}>
              <FeeRow label={`Tuition ${modeSuffix}`} amount={getFeeByMode(school.fees.tuition)} />
              {paymentMode === "annual" && <FeeRow label="Registration (one-time)" amount={school.fees.registration} />}
              {paymentMode === "annual" && <FeeRow label="Uniform" amount={school.fees.uniform} />}
              {paymentMode === "annual" && <FeeRow label="Transport (optional)" amount={school.fees.transport} />}
              {paymentMode === "annual" && <FeeRow label="Activities" amount={school.fees.activities} />}
              <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
              <FeeRow
                label={paymentMode === "annual" ? "Total Estimated/Year" : paymentMode === "term" ? "Total per Term" : "Monthly Payment"}
                amount={getFeeByMode(school.fees.totalEstimate)}
                highlight
              />
            </View>

            {/* Siblings calculator */}
            <TouchableOpacity
              onPress={() => { setShowCalculator((v) => !v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              style={[styles.calcToggle, { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10 }]}
            >
              <Feather name="calculator" size={16} color={colors.primary} />
              <Text style={[styles.calcToggleText, { color: colors.primary }]}>"What If" Cost Calculator</Text>
              <Ionicons name={showCalculator ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
            </TouchableOpacity>

            {showCalculator && (
              <View style={[styles.calcBox, { backgroundColor: "#FFF8F0", borderColor: "#F5D6B0", borderRadius: 10 }]}>
                <Text style={[styles.calcTitle, { color: colors.foreground }]}>2 Children Enrolled</Text>
                <View style={styles.feeList}>
                  <FeeRow label="Child 1 (full fees/yr)" amount={school.fees.totalEstimate} />
                  <FeeRow
                    label={school.siblingsDiscount ? `Child 2 (${school.siblingsDiscountPercent}% discount)` : "Child 2 (no discount)"}
                    amount={school.siblingsDiscount ? Math.round(school.fees.totalEstimate * (1 - school.siblingsDiscountPercent / 100)) : school.fees.totalEstimate}
                  />
                  <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
                  <FeeRow label="Combined Total/Year" amount={totalCostSiblings} highlight />
                  {school.siblingsDiscount && (
                    <Text style={[styles.calcSaving, { color: colors.success }]}>
                      You save SAR {(school.fees.totalEstimate * 2 - totalCostSiblings).toLocaleString()} with sibling discount
                    </Text>
                  )}
                </View>
              </View>
            )}
          </SectionCard>

          {/* Curriculum */}
          <SectionCard title="Curriculum & Academics" icon="school-outline">
            <Text style={[styles.curriculumName, { color: colors.primary }]}>{school.curriculum} Curriculum</Text>
            <Text style={[styles.curriculumDesc, { color: colors.mutedForeground }]}>
              {school.curriculum === "British" ? "Follows the National Curriculum of England. Students typically complete IGCSE (Year 10–11) and A-Levels (Year 12–13). Widely recognised by UK, US, and international universities."
              : school.curriculum === "American" ? "Offers an American-style education with Advanced Placement (AP) courses in upper grades. Graduates are well-prepared for admission to universities in the USA and worldwide."
              : school.curriculum === "IB" ? "The International Baccalaureate offers the PYP, MYP, and Diploma Programme. Recognised by over 2,000 universities in 75 countries."
              : school.curriculum === "Indian" ? "Follows the CBSE (Central Board of Secondary Education) curriculum. Excellent for families planning to return to India or seeking affordable, high-quality education."
              : "The Saudi National Curriculum, endorsed by the Ministry of Education, emphasises Arabic, Islamic studies, and Science."}
            </Text>
            <View style={styles.metaItem}>
              <Feather name="globe" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>Languages: {school.languages.join(" · ")}</Text>
            </View>
            {school.accreditation.length > 0 && (
              <View style={styles.badgeRow}>
                {school.accreditation.map((acc) => (
                  <View key={acc} style={[styles.accredChip, { backgroundColor: "#EEF5FA" }]}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.secondary} />
                    <Text style={[styles.accredText, { color: colors.secondary }]}>{acc}</Text>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          {/* Facilities — tappable photos */}
          <SectionCard title="Facilities" icon="business-outline">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 10, paddingBottom: 4 }}>
                {school.facilities.map((facility, i) => (
                  <TouchableOpacity key={i} activeOpacity={0.85}>
                    <Image source={{ uri: getFacilityImageUri(facility) }} style={[styles.facilityPhoto, { borderRadius: 10 }]} contentFit="cover" />
                    <View style={[styles.facilityPhotoLabel, { backgroundColor: "rgba(19,47,69,0.7)" }]}>
                      <Text style={styles.facilityPhotoLabelText} numberOfLines={1}>
                        {facility}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={[styles.facilityGrid, { marginTop: 12 }]}>
              {school.facilities.map((f) => (
                <View key={f} style={[styles.facilityChip, { backgroundColor: colors.muted, borderRadius: 10 }]}>
                  <Ionicons
                    name={
                      f.includes("Pool") ? "water-outline" : f.includes("Lab") ? "flask-outline" : f.includes("Library") ? "book-outline" :
                      f.includes("Mosque") ? "moon-outline" : f.includes("Court") || f.includes("Field") || f.includes("Pitch") ? "football-outline" :
                      f.includes("Cafeteria") ? "restaurant-outline" : f.includes("Theatre") || f.includes("Auditorium") ? "mic-outline" :
                      f.includes("Gym") ? "barbell-outline" : "checkmark-circle-outline"
                    }
                    size={13} color={colors.primary}
                  />
                  <Text style={[styles.facilityText, { color: colors.foreground }]}>{f}</Text>
                </View>
              ))}
            </View>
          </SectionCard>

          {/* Extracurriculars */}
          <SectionCard title="Extracurricular Activities" icon="trophy-outline">
            <View style={styles.facilityGrid}>
              {school.extracurriculars.map((e) => (
                <View key={e} style={[styles.facilityChip, { backgroundColor: "#FEF0E0", borderRadius: 10 }]}>
                  <Text style={[styles.facilityText, { color: colors.primary }]}>{e}</Text>
                </View>
              ))}
            </View>
          </SectionCard>

          {/* Contact Information */}
          {school.contact && (
            <SectionCard title="Contact Information" icon="call-outline">
              {school.contact.phone && (
                <View style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: school.contact.email ? 1 : 0 }]}>
                  <Ionicons name="call-outline" size={16} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.foreground }]}>{school.contact.phone}</Text>
                </View>
              )}
              {school.contact.email && (
                <View style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: school.contact.admissionsEmail || school.contact.website ? 1 : 0 }]}>
                  <Ionicons name="mail-outline" size={16} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.foreground }]}>{school.contact.email}</Text>
                </View>
              )}
              {school.contact.admissionsEmail && (
                <View style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: school.contact.website ? 1 : 0 }]}>
                  <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                  <View>
                    <Text style={[styles.contactLabel, { color: colors.mutedForeground }]}>Admissions</Text>
                    <Text style={[styles.contactText, { color: colors.foreground }]}>{school.contact.admissionsEmail}</Text>
                  </View>
                </View>
              )}
              {school.contact.website && (
                <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
                  <Ionicons name="globe-outline" size={16} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.primary }]}>{school.contact.website}</Text>
                </View>
              )}
            </SectionCard>
          )}

          {/* Schedule Visit */}
          <SectionCard title="Visit & Schedule" icon="calendar-outline" actionLabel="Book Visit" onAction={() => setShowScheduleModal(true)}>
            <Text style={[styles.scheduleInfo, { color: colors.mutedForeground }]}>
              Schedule a campus tour to meet teachers, see the facilities, and ask questions about admissions.
            </Text>
            <View style={styles.slotPreviewRow}>
              {scheduleSlots.filter((s) => s.available).slice(0, 3).map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setShowScheduleModal(true); }}
                  style={[styles.slotPreview, { backgroundColor: colors.muted, borderRadius: 10, borderColor: colors.border }]}
                >
                  <Text style={[styles.slotPreviewDate, { color: colors.foreground }]}>{slot.date}</Text>
                  <Text style={[styles.slotPreviewTime, { color: colors.primary }]}>{slot.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SectionCard>

          {/* Siblings Discount */}
          {school.siblingsDiscount && (
            <View style={[styles.infoCard, { backgroundColor: "#EDFBF3", borderColor: "#B8EDD4", borderRadius: colors.radius }]}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="people" size={18} color="#16a34a" />
                <Text style={[styles.infoCardTitle, { color: colors.foreground }]}>Siblings Discount Available</Text>
              </View>
              <Text style={[styles.infoCardBody, { color: colors.foreground }]}>
                Enrol two or more children and receive a {school.siblingsDiscountPercent}% discount on the second child's fees — saving up to SAR {Math.round(school.fees.totalEstimate * school.siblingsDiscountPercent / 100).toLocaleString()} per year.
              </Text>
            </View>
          )}

          {/* Special Needs Support */}
          {school.specialNeeds && (
            <View style={[styles.infoCard, { backgroundColor: "#EEF5FA", borderColor: "#B8D4E8", borderRadius: colors.radius }]}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="heart-circle-outline" size={18} color="#1d4ed8" />
                <Text style={[styles.infoCardTitle, { color: colors.foreground }]}>Special Needs Support</Text>
              </View>
              <Text style={[styles.infoCardBody, { color: colors.foreground }]}>
                This school has a dedicated learning support department with trained specialists. Contact the admissions team to discuss your child's specific requirements before applying.
              </Text>
            </View>
          )}

          {/* Location */}
          <SectionCard title="Location" icon="map-outline">
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.muted, borderRadius: 10 }]}>
              <Ionicons name="map" size={32} color={colors.border} />
              <Text style={[styles.mapText, { color: colors.foreground }]}>{school.location.district}, {school.location.city}</Text>
              <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>{school.location.distance} km from your location</Text>
            </View>
          </SectionCard>
        </View>
      </ScrollView>

      {/* CTA Bar */}
      <View style={[styles.cta, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          onPress={() => setShowScheduleModal(true)}
          style={[styles.ctaSecondary, { borderColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Text style={[styles.ctaSecondaryText, { color: colors.primary }]}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setShowApplyModal(true); setApplyStep(1); setApplyDone(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
          style={[styles.ctaPrimary, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Text style={styles.ctaPrimaryText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

      {/* ── Gallery Modal ──────────────────────────────────────────────────── */}
      <Modal visible={galleryModalIndex !== null} transparent animationType="fade" onRequestClose={() => setGalleryModalIndex(null)}>
        <View style={styles.galleryModal}>
          <TouchableOpacity onPress={() => setGalleryModalIndex(null)} style={styles.galleryModalClose}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          {galleryModalIndex !== null && (
            <Image source={images[galleryModalIndex]} style={styles.galleryModalImage} contentFit="contain" />
          )}
          <View style={styles.galleryModalNav}>
            {images.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setGalleryModalIndex(i)}>
                <Image source={images[i]} style={[styles.galleryThumb, { borderWidth: galleryModalIndex === i ? 2 : 0, borderColor: colors.primary }]} contentFit="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ── Reviews Modal ─────────────────────────────────────────────────── */}
      <Modal visible={showReviewsModal} transparent animationType="slide" onRequestClose={() => setShowReviewsModal(false)}>
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Reviews</Text>
              <TouchableOpacity onPress={() => setShowReviewsModal(false)}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
              {/* Summary */}
              <View style={[styles.reviewSummaryCard, { backgroundColor: colors.muted, borderRadius: 14 }]}>
                <View style={{ alignItems: "center", gap: 4 }}>
                  <Text style={[styles.reviewBigNum, { color: colors.foreground }]}>{school.rating}</Text>
                  <StarRow rating={school.rating} size={20} />
                  <Text style={[styles.reviewTotal, { color: colors.mutedForeground }]}>{school.totalRatings} reviews</Text>
                </View>
                <View style={{ flex: 1, gap: 8, paddingLeft: 16 }}>
                  <RatingBar label="School Environment" value={summary.environment} />
                  <RatingBar label="Teaching Quality" value={summary.teachingQuality} />
                  <RatingBar label="Teacher Efficiency" value={summary.teacherEfficiency} />
                  <RatingBar label="Price Value" value={summary.priceValue} />
                  <RatingBar label="Facilities" value={summary.facilities} />
                </View>
              </View>

              {/* Individual reviews */}
              {reviews.map((r) => (
                <View key={r.id} style={[styles.fullReviewCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 14 }]}>
                  <View style={styles.reviewCardTop}>
                    <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.reviewAvatarText}>{r.authorInitials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>{r.authorName}</Text>
                      <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
                    </View>
                    <StarRow rating={r.rating} size={13} />
                  </View>
                  <Text style={[styles.reviewTitle, { color: colors.foreground }]}>{r.title}</Text>
                  <Text style={[styles.reviewBody, { color: colors.mutedForeground }]}>{r.body}</Text>
                  <View style={styles.reviewTagRow}>
                    {r.tags.map((tag) => (
                      <View key={tag} style={[styles.reviewTag, { backgroundColor: "#FEF0E0" }]}>
                        <Text style={[styles.reviewTagText, { color: colors.primary }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Schedule Modal ────────────────────────────────────────────────── */}
      <Modal visible={showScheduleModal} transparent animationType="slide" onRequestClose={() => setShowScheduleModal(false)}>
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Book a Visit</Text>
              <TouchableOpacity onPress={() => { setShowScheduleModal(false); setSelectedSlot(null); setSlotBooked(false); }}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {slotBooked ? (
              <View style={{ padding: 32, alignItems: "center", gap: 16 }}>
                <View style={[styles.successIcon, { backgroundColor: "#EDFBF3" }]}>
                  <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
                </View>
                <Text style={[styles.successTitle, { color: colors.foreground }]}>Visit Booked!</Text>
                <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
                  Your visit to {school.name} is confirmed for {selectedSlot?.date} at {selectedSlot?.time}. A confirmation will be sent to you.
                </Text>
                <TouchableOpacity onPress={() => { setShowScheduleModal(false); setSelectedSlot(null); setSlotBooked(false); }}
                  style={[styles.ctaPrimary, { backgroundColor: colors.primary, borderRadius: colors.radius, paddingHorizontal: 32 }]}
                >
                  <Text style={styles.ctaPrimaryText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
                <Text style={[styles.scheduleInfo, { color: colors.mutedForeground }]}>
                  Select an available time slot to book your campus tour. Slots are first-come, first-served.
                </Text>
                {scheduleSlots.map((slot, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => slot.available && setSelectedSlot(selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? null : slot)}
                    disabled={!slot.available}
                    style={[
                      styles.slotRow,
                      {
                        backgroundColor: !slot.available ? colors.muted : selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? "#FEF0E0" : colors.card,
                        borderColor: selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? colors.primary : colors.border,
                        borderRadius: 12,
                        opacity: slot.available ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Ionicons name="calendar-outline" size={18} color={slot.available ? colors.primary : colors.mutedForeground} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.slotDate, { color: selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? "#132F45" : colors.foreground }]}>{slot.date}</Text>
                      <Text style={[styles.slotTime, { color: selectedSlot?.date === slot.date && selectedSlot?.time === slot.time ? "#5A5A5A" : colors.mutedForeground }]}>{slot.time}</Text>
                    </View>
                    {slot.available ? (
                      <View style={[styles.slotBadge, { backgroundColor: "#EDFBF3" }]}>
                        <Text style={[styles.slotBadgeText, { color: "#16a34a" }]}>Available</Text>
                      </View>
                    ) : (
                      <View style={[styles.slotBadge, { backgroundColor: colors.muted }]}>
                        <Text style={[styles.slotBadgeText, { color: colors.mutedForeground }]}>Booked</Text>
                      </View>
                    )}
                    {selectedSlot?.date === slot.date && selectedSlot?.time === slot.time && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => { if (selectedSlot) { addBooking({ id: Date.now().toString(), schoolId: school.id, schoolName: school.name, type: "visit", date: selectedSlot.date, time: selectedSlot.time, status: "upcoming", createdAt: Date.now() }); setSlotBooked(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } }}
                  disabled={!selectedSlot}
                  style={[styles.ctaPrimary, { backgroundColor: selectedSlot ? colors.primary : colors.border, borderRadius: colors.radius, marginTop: 8 }]}
                >
                  <Text style={styles.ctaPrimaryText}>Confirm Visit</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Apply Now Modal ───────────────────────────────────────────────── */}
      <Modal visible={showApplyModal} transparent animationType="slide" onRequestClose={() => setShowApplyModal(false)}>
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { backgroundColor: colors.background, maxHeight: "92%" }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
                {applyDone ? "Application Submitted" : `Apply — Step ${applyStep} of 3`}
              </Text>
              <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {/* Progress */}
            {!applyDone && (
              <View style={[styles.applyProgress, { backgroundColor: colors.muted }]}>
                {[1, 2, 3].map((s) => (
                  <View key={s} style={[styles.applyProgressStep, { backgroundColor: s <= applyStep ? colors.primary : colors.border, flex: 1 }]} />
                ))}
              </View>
            )}

            {applyDone ? (
              <View style={{ padding: 32, alignItems: "center", gap: 16 }}>
                <View style={[styles.successIcon, { backgroundColor: "#EDFBF3" }]}>
                  <Ionicons name="checkmark-circle" size={52} color="#16a34a" />
                </View>
                <Text style={[styles.successTitle, { color: colors.foreground }]}>Application Submitted!</Text>
                <Text style={[styles.successSub, { color: colors.mutedForeground, textAlign: "center" }]}>
                  Your application for {applyForm.studentName} to {school.name} has been received.{applySlot ? `\n\nPlacement test booked for ${applySlot.date} at ${applySlot.time}.` : ""} The admissions team will contact you within 3 business days.
                </Text>
                <TouchableOpacity onPress={() => setShowApplyModal(false)}
                  style={[styles.ctaPrimary, { backgroundColor: colors.primary, borderRadius: colors.radius, paddingHorizontal: 32 }]}
                >
                  <Text style={styles.ctaPrimaryText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
                {applyStep === 1 && (
                  <>
                    <Text style={[styles.applyStepTitle, { color: colors.foreground }]}>Student Details</Text>
                    {[
                      { label: "Student Full Name", key: "studentName", placeholder: "As in passport" },
                      { label: "Date of Birth", key: "dob", placeholder: "DD/MM/YYYY" },
                    ].map(({ label, key, placeholder }) => (
                      <View key={key}>
                        <Text style={[styles.applyLabel, { color: colors.mutedForeground }]}>{label}</Text>
                        <TextInput
                          style={[styles.applyInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 10 }]}
                          placeholder={placeholder}
                          placeholderTextColor={colors.mutedForeground}
                          value={(applyForm as any)[key]}
                          onChangeText={(v) => setApplyForm((p) => ({ ...p, [key]: v }))}
                        />
                      </View>
                    ))}
                    <View>
                      <Text style={[styles.applyLabel, { color: colors.mutedForeground }]}>Gender</Text>
                      <View style={styles.genderRow}>
                        {["Male", "Female"].map((g) => (
                          <TouchableOpacity key={g} onPress={() => setApplyForm((p) => ({ ...p, gender: g }))}
                            style={[styles.genderChip, { backgroundColor: applyForm.gender === g ? colors.primary : colors.muted, borderRadius: 10 }]}
                          >
                            <Text style={[styles.genderChipText, { color: applyForm.gender === g ? "#FFF" : colors.foreground }]}>{g}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View>
                      <Text style={[styles.applyLabel, { color: colors.mutedForeground }]}>Current Grade</Text>
                      <TextInput
                        style={[styles.applyInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 10 }]}
                        placeholder="e.g. Grade 4 / Year 5"
                        placeholderTextColor={colors.mutedForeground}
                        value={applyForm.currentGrade}
                        onChangeText={(v) => setApplyForm((p) => ({ ...p, currentGrade: v }))}
                      />
                    </View>

                    {/* Test criteria */}
                    <View style={[styles.criteriaCard, { backgroundColor: "#FEF0E0", borderColor: "#F5D6B0", borderRadius: 12 }]}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Ionicons name="ribbon-outline" size={16} color={colors.primary} />
                        <Text style={[styles.criteriaTitle, { color: colors.primary }]}>Placement Test Criteria</Text>
                      </View>
                      {["English proficiency assessment (60% pass mark)", "Mathematics assessment (55% pass mark)", "Interview with a school counsellor", "Previous school reports required"].map((c) => (
                        <View key={c} style={styles.criteriaRow}>
                          <Ionicons name="checkmark-outline" size={13} color={colors.primary} />
                          <Text style={[styles.criteriaText, { color: colors.navy }]}>{c}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {applyStep === 2 && (
                  <>
                    <Text style={[styles.applyStepTitle, { color: colors.foreground }]}>Book Placement Test</Text>
                    <Text style={[styles.scheduleInfo, { color: colors.mutedForeground }]}>
                      Select a date for your child's placement test. Tests are held Sunday–Thursday.
                    </Text>
                    {scheduleSlots.map((slot, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => slot.available && setApplySlot(applySlot?.date === slot.date && applySlot?.time === slot.time ? null : slot)}
                        disabled={!slot.available}
                        style={[styles.slotRow, {
                          backgroundColor: !slot.available ? colors.muted : applySlot?.date === slot.date && applySlot?.time === slot.time ? "#FEF0E0" : colors.card,
                          borderColor: applySlot?.date === slot.date && applySlot?.time === slot.time ? colors.primary : colors.border,
                          borderRadius: 12,
                          opacity: slot.available ? 1 : 0.5,
                        }]}
                      >
                        <Ionicons name="calendar-outline" size={18} color={slot.available ? colors.primary : colors.mutedForeground} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.slotDate, { color: applySlot?.date === slot.date && applySlot?.time === slot.time ? "#132F45" : colors.foreground }]}>{slot.date}</Text>
                          <Text style={[styles.slotTime, { color: applySlot?.date === slot.date && applySlot?.time === slot.time ? "#5A5A5A" : colors.mutedForeground }]}>{slot.time}</Text>
                        </View>
                        {slot.available ? (
                          <View style={[styles.slotBadge, { backgroundColor: "#EDFBF3" }]}>
                            <Text style={[styles.slotBadgeText, { color: "#16a34a" }]}>Available</Text>
                          </View>
                        ) : (
                          <View style={[styles.slotBadge, { backgroundColor: colors.muted }]}>
                            <Text style={[styles.slotBadgeText, { color: colors.mutedForeground }]}>Full</Text>
                          </View>
                        )}
                        {applySlot?.date === slot.date && applySlot?.time === slot.time && (
                          <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                    <Text style={[styles.applyOptional, { color: colors.mutedForeground }]}>
                      * Booking a test date is optional. You can confirm a date after submitting your application.
                    </Text>
                  </>
                )}

                {applyStep === 3 && (
                  <>
                    <Text style={[styles.applyStepTitle, { color: colors.foreground }]}>Parent / Guardian Details</Text>
                    {[
                      { label: "Parent / Guardian Name", key: "parentName", placeholder: "Full name", keyboard: "default" },
                      { label: "Phone Number", key: "parentPhone", placeholder: "+966 5X XXX XXXX", keyboard: "phone-pad" },
                      { label: "Email Address", key: "parentEmail", placeholder: "your@email.com", keyboard: "email-address" },
                    ].map(({ label, key, placeholder, keyboard }) => (
                      <View key={key}>
                        <Text style={[styles.applyLabel, { color: colors.mutedForeground }]}>{label}</Text>
                        <TextInput
                          style={[styles.applyInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 10 }]}
                          placeholder={placeholder}
                          placeholderTextColor={colors.mutedForeground}
                          keyboardType={keyboard as any}
                          autoCapitalize={keyboard === "default" ? "words" : "none"}
                          value={(applyForm as any)[key]}
                          onChangeText={(v) => setApplyForm((p) => ({ ...p, [key]: v }))}
                        />
                      </View>
                    ))}

                    {/* T&C */}
                    <View style={[styles.tncCard, { backgroundColor: colors.muted, borderRadius: 12 }]}>
                      <Text style={[styles.tncTitle, { color: colors.foreground }]}>Terms & Conditions</Text>
                      <Text style={[styles.tncBody, { color: colors.mutedForeground }]}>
                        By submitting this application, you confirm that all provided information is accurate. The school reserves the right to request additional documentation. Application fees are non-refundable. Admission is subject to availability and placement test results. The school is committed to providing equal opportunities to all applicants.
                      </Text>
                      <TouchableOpacity
                        onPress={() => setApplyForm((p) => ({ ...p, agreedToTnC: !p.agreedToTnC }))}
                        style={styles.tncCheckRow}
                      >
                        <View style={[styles.checkbox, { backgroundColor: applyForm.agreedToTnC ? colors.primary : colors.card, borderColor: applyForm.agreedToTnC ? colors.primary : colors.border }]}>
                          {applyForm.agreedToTnC && <Ionicons name="checkmark" size={14} color="#FFF" />}
                        </View>
                        <Text style={[styles.tncCheckText, { color: colors.foreground }]}>
                          I agree to the Terms & Conditions
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Navigation */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                  {applyStep > 1 && (
                    <TouchableOpacity
                      onPress={() => setApplyStep((s) => Math.max(1, s - 1) as ApplyStep)}
                      style={[styles.ctaSecondary, { flex: 1, borderColor: colors.border, borderRadius: colors.radius }]}
                    >
                      <Text style={[styles.ctaSecondaryText, { color: colors.foreground }]}>Back</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      if (applyStep < 3) {
                        setApplyStep((s) => (s + 1) as ApplyStep);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } else {
                        if (!applyForm.agreedToTnC) return;
                        addBooking({ id: Date.now().toString(), schoolId: school.id, schoolName: school.name, type: "placement_test", date: applySlot?.date ?? "TBD", time: applySlot?.time ?? "TBD", status: "upcoming", createdAt: Date.now() });
                        setApplyDone(true);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      }
                    }}
                    disabled={applyStep === 3 && !applyForm.agreedToTnC}
                    style={[styles.ctaPrimary, {
                      flex: 1,
                      backgroundColor: applyStep === 3 && !applyForm.agreedToTnC ? colors.border : colors.primary,
                      borderRadius: colors.radius,
                    }]}
                  >
                    <Text style={styles.ctaPrimaryText}>
                      {applyStep === 3 ? "Submit Application" : "Continue"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gallery: { position: "relative", height: 300 },
  galleryTopGrad: { position: "absolute", top: 0, left: 0, right: 0, height: 120 },
  galleryControls: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 },
  circleBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  dotRow: { position: "absolute", bottom: 36, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
  dot: { height: 7, borderRadius: 4 },
  tapHint: { position: "absolute", bottom: 12, right: 12, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  tapHintText: { color: "rgba(255,255,255,0.9)", fontSize: 10 },
  body: { padding: 20, gap: 16 },
  identityBlock: { gap: 10 },
  identityTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  schoolLogoMini: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  schoolLogoMiniText: { color: "#FFF", fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
  schoolName: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5, lineHeight: 30 },
  schoolNameAr: { fontSize: 14, marginTop: 2 },
  fitBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, flexShrink: 0 },
  fitBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  ratingText: { fontSize: 15, fontWeight: "700" },
  ratingCount: { fontSize: 13 },
  readReviewsBtn: { paddingHorizontal: 10, paddingVertical: 3, marginLeft: 4 },
  readReviewsBtnText: { fontSize: 12, fontWeight: "600" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  chipText: { fontSize: 12, fontWeight: "600" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 13 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 4 },
  fitScoreCard: { padding: 16, gap: 8 },
  fitScoreTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fitScoreLabel: { fontSize: 14, fontWeight: "600" },
  fitScoreValue: { fontSize: 22, fontWeight: "800" },
  fitScoreBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  fitScoreFill: { height: "100%", borderRadius: 4 },
  fitScoreSub: { fontSize: 12 },
  sectionCard: { borderWidth: 1, padding: 16, gap: 12 },
  sectionCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionCardTitle: { flex: 1, fontSize: 16, fontWeight: "700" },
  sectionAction: { flexDirection: "row", alignItems: "center", gap: 2 },
  sectionActionText: { fontSize: 13, fontWeight: "600" },
  reviewPreviewRow: { flexDirection: "row", gap: 12 },
  reviewBigScore: { alignItems: "center", gap: 4, width: 72 },
  reviewBigNum: { fontSize: 32, fontWeight: "800" },
  reviewTotal: { fontSize: 11, textAlign: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingBarLabel: { fontSize: 11, width: 68 },
  ratingBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  ratingBarFill: { height: "100%", borderRadius: 3 },
  ratingBarValue: { fontSize: 11, fontWeight: "600", width: 26, textAlign: "right" },
  reviewCard: { borderWidth: 1, padding: 14, gap: 8 },
  reviewCardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  reviewAuthor: { fontSize: 13, fontWeight: "700" },
  reviewDate: { fontSize: 11 },
  reviewTitle: { fontSize: 14, fontWeight: "700" },
  reviewBody: { fontSize: 13, lineHeight: 19 },
  reviewTagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  reviewTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reviewTagText: { fontSize: 11, fontWeight: "600" },
  readMore: { fontSize: 13, fontWeight: "600" },
  paymentTabs: { flexDirection: "row", padding: 4 },
  paymentTab: { flex: 1, paddingVertical: 9, alignItems: "center", shadowColor: "#000", shadowRadius: 4, elevation: 2 },
  paymentTabText: { fontSize: 13 },
  paymentNote: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: 10 },
  paymentNoteText: { flex: 1, fontSize: 12, lineHeight: 17 },
  feeList: { gap: 10 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  feeLabel: { fontSize: 14 },
  feeAmount: { fontSize: 14 },
  feeDivider: { height: 1, marginVertical: 4 },
  calcToggle: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderWidth: 1, marginTop: 4 },
  calcToggleText: { flex: 1, fontSize: 14, fontWeight: "600" },
  calcBox: { padding: 14, borderWidth: 1, gap: 10, marginTop: 4 },
  calcTitle: { fontSize: 14, fontWeight: "700" },
  calcSaving: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  curriculumName: { fontSize: 16, fontWeight: "700" },
  curriculumDesc: { fontSize: 14, lineHeight: 20 },
  facilityPhoto: { width: 130, height: 90 },
  facilityPhotoLabel: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 6, paddingVertical: 4, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  facilityPhotoLabelText: { color: "#FFF", fontSize: 10, fontWeight: "600" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  contactText: { fontSize: 14, fontWeight: "500", flex: 1 },
  contactLabel: { fontSize: 11, fontWeight: "500", marginBottom: 2 },
  facilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7 },
  facilityText: { fontSize: 12, fontWeight: "500" },
  scheduleInfo: { fontSize: 14, lineHeight: 20 },
  slotPreviewRow: { flexDirection: "row", gap: 8 },
  slotPreview: { flex: 1, padding: 10, borderWidth: 1, alignItems: "center", gap: 2 },
  slotPreviewDate: { fontSize: 11, fontWeight: "600" },
  slotPreviewTime: { fontSize: 13, fontWeight: "700" },
  infoCard: { padding: 16, borderWidth: 1, gap: 8 },
  infoCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoCardTitle: { fontSize: 15, fontWeight: "700" },
  infoCardBody: { fontSize: 13, lineHeight: 19 },
  mapPlaceholder: { height: 120, alignItems: "center", justifyContent: "center", gap: 6 },
  mapText: { fontSize: 15, fontWeight: "600" },
  mapSub: { fontSize: 13 },
  accredChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  accredText: { fontSize: 12, fontWeight: "600" },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1 },
  ctaSecondary: { flex: 1, paddingVertical: 15, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  ctaSecondaryText: { fontSize: 15, fontWeight: "700" },
  ctaPrimary: { flex: 1, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  ctaPrimaryText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  // Modals
  galleryModal: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center" },
  galleryModalClose: { position: "absolute", top: 50, right: 20, zIndex: 10, padding: 8 },
  galleryModalImage: { width: "100%", height: "70%" },
  galleryModalNav: { flexDirection: "row", justifyContent: "center", gap: 8, padding: 16 },
  galleryThumb: { width: 56, height: 40, borderRadius: 6 },
  sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "88%", minHeight: "50%" },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)" },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  reviewSummaryCard: { flexDirection: "row", padding: 16 },
  fullReviewCard: { borderWidth: 1, padding: 16, gap: 8 },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1.5 },
  slotDate: { fontSize: 14, fontWeight: "600" },
  slotTime: { fontSize: 13, marginTop: 2 },
  slotBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  slotBadgeText: { fontSize: 11, fontWeight: "600" },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 22, fontWeight: "800" },
  successSub: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  applyProgress: { flexDirection: "row", gap: 4, marginHorizontal: 20, borderRadius: 4, overflow: "hidden", height: 4, marginBottom: 4 },
  applyProgressStep: { height: 4 },
  applyStepTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  applyLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 },
  applyInput: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  genderRow: { flexDirection: "row", gap: 10 },
  genderChip: { flex: 1, paddingVertical: 12, alignItems: "center" },
  genderChipText: { fontSize: 14, fontWeight: "600" },
  criteriaCard: { borderWidth: 1, padding: 14, gap: 6 },
  criteriaTitle: { fontSize: 14, fontWeight: "700" },
  criteriaRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  criteriaText: { fontSize: 13, lineHeight: 18, flex: 1 },
  applyOptional: { fontSize: 12, fontStyle: "italic", textAlign: "center" },
  tncCard: { padding: 14, gap: 10 },
  tncTitle: { fontSize: 14, fontWeight: "700" },
  tncBody: { fontSize: 12, lineHeight: 18 },
  tncCheckRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  tncCheckText: { flex: 1, fontSize: 14, fontWeight: "500" },
});
