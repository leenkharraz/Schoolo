import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { SCHOOL_IMAGE_MAP } from "@/data/schoolImages";
import { getSchoolById } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function FeeRow({
  label,
  amount,
  highlight,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.feeRow,
        {
          backgroundColor: highlight ? colors.muted : "transparent",
          borderRadius: highlight ? 10 : 0,
          paddingHorizontal: highlight ? 12 : 0,
        },
      ]}
    >
      <Text
        style={[
          styles.feeLabel,
          { color: highlight ? colors.foreground : colors.mutedForeground, fontWeight: highlight ? "700" : "500" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.feeAmount,
          { color: highlight ? colors.primary : colors.foreground, fontWeight: highlight ? "800" : "600" },
        ]}
      >
        SAR {amount.toLocaleString()}
      </Text>
    </View>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <View style={styles.sectionCardHeader}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
        <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Chip({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

export default function SchoolDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorites, toggleFavorite } = useApp();
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const school = getSchoolById(id ?? "");
  const isFav = favorites.includes(id ?? "");

  if (!school) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.mutedForeground }}>School not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary, marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = school.images.map((key) => SCHOOL_IMAGE_MAP[key]);
  const totalCostSiblings = showCalculator
    ? school.siblingsDiscount
      ? Math.round(school.fees.totalEstimate * 2 * (1 - school.siblingsDiscountPercent / 100))
      : school.fees.totalEstimate * 2
    : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Image Gallery */}
        <View style={styles.gallery}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(idx);
            }}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={{ width: SCREEN_WIDTH, height: 300 }}
                contentFit="cover"
              />
            )}
          />
          <LinearGradient
            colors={["rgba(19,47,69,0.6)", "transparent"]}
            style={styles.galleryTopGrad}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />

          {/* Back + Fav buttons */}
          <View
            style={[
              styles.galleryControls,
              { paddingTop: insets.top + topPaddingWeb + 8 },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.navy} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleFavorite(school.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.circleBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={20}
                color={isFav ? colors.primary : colors.navy}
              />
            </TouchableOpacity>
          </View>

          {/* Dot indicators */}
          {images.length > 1 && (
            <View style={styles.dotRow}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: i === activeImageIndex ? colors.primary : "rgba(255,255,255,0.5)",
                      width: i === activeImageIndex ? 18 : 7,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* School Identity */}
          <View style={styles.identityBlock}>
            <View style={styles.identityTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.schoolName, { color: colors.foreground }]}>
                  {school.name}
                </Text>
                <Text style={[styles.schoolNameAr, { color: colors.mutedForeground }]}>
                  {school.nameAr}
                </Text>
              </View>
              <View style={[styles.fitBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.fitBadgeText}>{school.fitScore}%</Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= Math.floor(school.rating) ? "star" : "star-outline"}
                  size={16}
                  color="#F3B940"
                />
              ))}
              <Text style={[styles.ratingText, { color: colors.foreground }]}>
                {school.rating}
              </Text>
              <Text style={[styles.ratingCount, { color: colors.mutedForeground }]}>
                ({school.totalRatings} reviews)
              </Text>
            </View>

            <View style={styles.badgeRow}>
              <Chip label={school.curriculum} color={colors.navy} bg={colors.muted} />
              <Chip
                label={school.type === "international" ? "International" : "Private"}
                color={colors.secondary}
                bg="#EEF5FA"
              />
              <Chip label={school.location.city} color={colors.primary} bg="#FEF0E0" />
              <Chip label={school.grades} color="#555" bg="#F5F5F5" />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {school.location.district}, {school.location.city} · {school.location.distance}km
                </Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                  {school.studentCount.toLocaleString()} students · Est. {school.established}
                </Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.foreground }]}>
              {school.description}
            </Text>
          </View>

          {/* Fit Score bar */}
          <View style={[styles.fitScoreCard, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <View style={styles.fitScoreTop}>
              <Text style={[styles.fitScoreLabel, { color: colors.foreground }]}>School Fit Score</Text>
              <Text style={[styles.fitScoreValue, { color: colors.primary }]}>
                {school.fitScore}%
              </Text>
            </View>
            <View style={[styles.fitScoreBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.fitScoreFill,
                  { width: `${school.fitScore}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <Text style={[styles.fitScoreSub, { color: colors.mutedForeground }]}>
              Based on your budget, curriculum preference, and location
            </Text>
          </View>

          {/* Fees */}
          <SectionCard title="Fees & Costs" icon="wallet-outline">
            <View style={styles.feeList}>
              <FeeRow label="Annual Tuition" amount={school.fees.tuition} />
              <FeeRow label="Registration Fee" amount={school.fees.registration} />
              <FeeRow label="Uniform" amount={school.fees.uniform} />
              <FeeRow label="Transport (optional)" amount={school.fees.transport} />
              <FeeRow label="Activities" amount={school.fees.activities} />
              <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
              <FeeRow label="Total Estimated/Year" amount={school.fees.totalEstimate} highlight />
            </View>

            {/* What If Calculator */}
            <TouchableOpacity
              onPress={() => {
                setShowCalculator((v) => !v);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.calcToggle,
                { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 10 },
              ]}
            >
              <Feather name="calculator" size={16} color={colors.primary} />
              <Text style={[styles.calcToggleText, { color: colors.primary }]}>
                "What If" Cost Calculator
              </Text>
              <Ionicons
                name={showCalculator ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>

            {showCalculator && (
              <View style={[styles.calcBox, { backgroundColor: "#FFF8F0", borderColor: "#F5D6B0", borderRadius: 10 }]}>
                <Text style={[styles.calcTitle, { color: colors.foreground }]}>
                  2 Children Enrolled
                </Text>
                <View style={styles.feeList}>
                  <FeeRow label="Child 1 (full fees)" amount={school.fees.totalEstimate} />
                  {school.siblingsDiscount ? (
                    <>
                      <FeeRow
                        label={`Child 2 (${school.siblingsDiscountPercent}% sibling discount)`}
                        amount={Math.round(school.fees.totalEstimate * (1 - school.siblingsDiscountPercent / 100))}
                      />
                      <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
                      <FeeRow
                        label="Combined Total/Year"
                        amount={totalCostSiblings!}
                        highlight
                      />
                      <Text style={[styles.calcSaving, { color: colors.success }]}>
                        You save SAR {(school.fees.totalEstimate * 2 - totalCostSiblings!).toLocaleString()} with sibling discount
                      </Text>
                    </>
                  ) : (
                    <>
                      <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
                      <FeeRow label="Combined Total/Year" amount={school.fees.totalEstimate * 2} highlight />
                      <Text style={[styles.calcSaving, { color: colors.mutedForeground }]}>
                        No sibling discount available at this school
                      </Text>
                    </>
                  )}
                </View>
              </View>
            )}
          </SectionCard>

          {/* Curriculum */}
          <SectionCard title="Curriculum & Academics" icon="school-outline">
            <Text style={[styles.curriculumName, { color: colors.primary }]}>
              {school.curriculum} Curriculum
            </Text>
            <Text style={[styles.curriculumDesc, { color: colors.mutedForeground }]}>
              {school.curriculum === "British"
                ? "Follows the National Curriculum of England. Students typically complete IGCSE (Year 10–11) and A-Levels (Year 12–13). Widely recognised by UK, US, and international universities."
                : school.curriculum === "American"
                ? "Offers an American-style education with Advanced Placement (AP) courses in upper grades. Graduates are well-prepared for admission to universities in the USA and worldwide."
                : school.curriculum === "IB"
                ? "The International Baccalaureate offers the PYP (ages 3–12), MYP (ages 11–16), and Diploma Programme (ages 16–19). Recognised by over 2,000 universities in 75 countries."
                : school.curriculum === "Indian"
                ? "Follows the CBSE (Central Board of Secondary Education) curriculum. Excellent for families planning to return to India or seeking affordable, high-quality education."
                : "The Saudi National Curriculum, endorsed by the Ministry of Education, emphasises Arabic, Islamic studies, and Science. Strong preparation for Saudi universities."}
            </Text>
            <View style={styles.langRow}>
              <Feather name="globe" size={13} color={colors.mutedForeground} />
              <Text style={[styles.langText, { color: colors.mutedForeground }]}>
                Languages: {school.languages.join(" · ")}
              </Text>
            </View>
            {school.accreditation.length > 0 && (
              <View style={styles.accredRow}>
                {school.accreditation.map((acc) => (
                  <View key={acc} style={[styles.accredChip, { backgroundColor: "#EEF5FA" }]}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.secondary} />
                    <Text style={[styles.accredText, { color: colors.secondary }]}>{acc}</Text>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          {/* Facilities */}
          <SectionCard title="Facilities" icon="business-outline">
            <View style={styles.facilityGrid}>
              {school.facilities.map((f) => (
                <View
                  key={f}
                  style={[styles.facilityChip, { backgroundColor: colors.muted, borderRadius: 10 }]}
                >
                  <Ionicons
                    name={
                      f.includes("Pool") ? "water-outline" :
                      f.includes("Lab") ? "flask-outline" :
                      f.includes("Library") ? "book-outline" :
                      f.includes("Mosque") ? "moon-outline" :
                      f.includes("Court") || f.includes("Field") || f.includes("Pitch") ? "football-outline" :
                      f.includes("Cafeteria") ? "restaurant-outline" :
                      f.includes("Theatre") || f.includes("Auditorium") ? "mic-outline" :
                      f.includes("Gym") ? "barbell-outline" :
                      "checkmark-circle-outline"
                    }
                    size={14}
                    color={colors.primary}
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
                <View
                  key={e}
                  style={[styles.facilityChip, { backgroundColor: "#FEF0E0", borderRadius: 10 }]}
                >
                  <Text style={[styles.facilityText, { color: colors.primary }]}>{e}</Text>
                </View>
              ))}
            </View>
          </SectionCard>

          {/* Siblings Discount */}
          {school.siblingsDiscount && (
            <View
              style={[
                styles.siblingCard,
                { backgroundColor: "#EDFBF3", borderColor: "#B8EDD4", borderRadius: colors.radius },
              ]}
            >
              <View style={styles.siblingHeader}>
                <Ionicons name="people" size={18} color="#16a34a" />
                <Text style={[styles.siblingTitle, { color: "#15803d" }]}>
                  Siblings Discount Available
                </Text>
              </View>
              <Text style={[styles.siblingBody, { color: "#166534" }]}>
                Enrol two or more children and receive a {school.siblingsDiscountPercent}% discount on the second child's fees. This can save your family up to SAR{" "}
                {Math.round(school.fees.totalEstimate * school.siblingsDiscountPercent / 100).toLocaleString()} per year.
              </Text>
            </View>
          )}

          {/* Special Needs */}
          {school.specialNeeds && (
            <View
              style={[
                styles.siblingCard,
                { backgroundColor: "#EEF5FA", borderColor: "#B8D4E8", borderRadius: colors.radius },
              ]}
            >
              <View style={styles.siblingHeader}>
                <Ionicons name="heart-circle-outline" size={18} color="#1d4ed8" />
                <Text style={[styles.siblingTitle, { color: "#1d4ed8" }]}>
                  Special Needs Support
                </Text>
              </View>
              <Text style={[styles.siblingBody, { color: "#1e40af" }]}>
                This school has a dedicated learning support department. Contact the admissions office to discuss your child's specific requirements.
              </Text>
            </View>
          )}

          {/* Location */}
          <SectionCard title="Location" icon="map-outline">
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.muted, borderRadius: 10 }]}>
              <Ionicons name="map" size={32} color={colors.border} />
              <Text style={[styles.mapText, { color: colors.mutedForeground }]}>
                {school.location.district}, {school.location.city}
              </Text>
              <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>
                {school.location.distance}km from your location
              </Text>
            </View>
          </SectionCard>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.cta,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 8,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.ctaSecondary,
            { borderColor: colors.primary, borderRadius: colors.radius },
          ]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <Text style={[styles.ctaSecondaryText, { color: colors.primary }]}>Schedule Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaPrimary, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
        >
          <Text style={styles.ctaPrimaryText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gallery: { position: "relative", height: 300 },
  galleryTopGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  galleryControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dotRow: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: { height: 7, borderRadius: 4 },
  body: { padding: 20, gap: 16 },
  identityBlock: { gap: 10 },
  identityTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  schoolName: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5, lineHeight: 30 },
  schoolNameAr: { fontSize: 14, marginTop: 2 },
  fitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    flexShrink: 0,
  },
  fitBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 15, fontWeight: "700", marginLeft: 4 },
  ratingCount: { fontSize: 13 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  chipText: { fontSize: 12, fontWeight: "600" },
  metaRow: { flexDirection: "row" },
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
  sectionCardTitle: { fontSize: 16, fontWeight: "700" },
  feeList: { gap: 10 },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  feeLabel: { fontSize: 14 },
  feeAmount: { fontSize: 14 },
  feeDivider: { height: 1, marginVertical: 4 },
  calcToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  calcToggleText: { flex: 1, fontSize: 14, fontWeight: "600" },
  calcBox: { padding: 14, borderWidth: 1, gap: 10, marginTop: 4 },
  calcTitle: { fontSize: 14, fontWeight: "700" },
  calcSaving: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  curriculumName: { fontSize: 16, fontWeight: "700" },
  curriculumDesc: { fontSize: 14, lineHeight: 20 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  langText: { fontSize: 13 },
  accredRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  accredChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  accredText: { fontSize: 12, fontWeight: "600" },
  facilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  facilityText: { fontSize: 12, fontWeight: "500" },
  siblingCard: { padding: 16, borderWidth: 1, gap: 8 },
  siblingHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  siblingTitle: { fontSize: 15, fontWeight: "700" },
  siblingBody: { fontSize: 13, lineHeight: 19 },
  mapPlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mapText: { fontSize: 15, fontWeight: "600" },
  mapSub: { fontSize: 13 },
  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  ctaSecondary: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaSecondaryText: { fontSize: 15, fontWeight: "700" },
  ctaPrimary: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimaryText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
