import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { SCHOOL_IMAGE_MAP } from "@/data/schoolImages";
import { SCHOOLS, type School } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.74;
const CARD_HEIGHT = 240;

const FILTERS = [
  { id: "all", label: "All Schools" },
  { id: "nearest", label: "Nearest" },
  { id: "budget", label: "Budget Friendly" },
  { id: "private", label: "Private" },
  { id: "international", label: "International" },
  { id: "siblings", label: "Siblings Discount" },
  { id: "specialNeeds", label: "Special Needs Support" },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "rating", label: "Most Rated" },
];

const CITY_OPTIONS = ["All", "Riyadh", "Jeddah", "Dammam"];

function AnimatedHeart({ isFavorite, onPress }: { isFavorite: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(1.4, { duration: 150 }, () => {
      scale.value = withSpring(1, { duration: 150 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={style}>
      <TouchableOpacity onPress={handlePress} hitSlop={10}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#EA8B33" : "#FFFFFF"} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function SchoolCard({ school, onPress, isFavorite, onFavorite }: {
  school: School; onPress: () => void; isFavorite: boolean; onFavorite: () => void;
}) {
  const colors = useColors();
  const imgSrc = SCHOOL_IMAGE_MAP[school.images[0]];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.93}
      style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: colors.radius + 4 }]}
    >
      <Image source={imgSrc} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={["transparent", "rgba(19,47,69,0.88)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.cardTopRow}>
        <View style={[styles.fitBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.fitBadgeText}>{school.fitScore}% Match</Text>
        </View>
        <AnimatedHeart isFavorite={isFavorite} onPress={onFavorite} />
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.cardName} numberOfLines={1}>{school.name}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={12} color="#F3B940" />
          <Text style={styles.cardRating}>{school.rating}</Text>
          <Text style={styles.cardRatingCount}>({school.totalRatings})</Text>
          <View style={styles.cardDot} />
          <Ionicons name="location-outline" size={11} color="rgba(255,255,255,0.8)" />
          <Text style={styles.cardLocation}>{school.location.distance} km away</Text>
        </View>
        <View style={styles.cardTagRow}>
          <View style={[styles.cardTag, { backgroundColor: "rgba(234,162,58,0.9)" }]}>
            <Text style={styles.cardTagText}>{school.curriculum}</Text>
          </View>
          <View style={[styles.cardTag, { backgroundColor: "rgba(50,102,127,0.9)" }]}>
            <Text style={styles.cardTagText}>{school.type === "international" ? "International" : "Private"}</Text>
          </View>
          <Text style={styles.cardFee}>SAR {(school.fees.tuition / 1000).toFixed(0)}K/yr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SmallSchoolCard({ school, onPress, isFavorite, onFavorite }: {
  school: School; onPress: () => void; isFavorite: boolean; onFavorite: () => void;
}) {
  const colors = useColors();
  const imgSrc = SCHOOL_IMAGE_MAP[school.images[0]];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.smallCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}
    >
      <Image source={imgSrc} style={[styles.smallCardImage, { borderRadius: colors.radius - 4 }]} contentFit="cover" />
      <View style={styles.smallCardInfo}>
        <Text style={[styles.smallCardName, { color: colors.foreground }]} numberOfLines={1}>{school.name}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={11} color="#F3B940" />
          <Text style={[styles.smallCardRating, { color: colors.foreground }]}>{school.rating}</Text>
          <View style={styles.cardDot} />
          <Text style={[styles.smallCardSub, { color: colors.mutedForeground }]}>
            {school.location.district}, {school.location.city}
          </Text>
        </View>
        <View style={styles.cardRow}>
          <View style={[styles.smallCardTag, { backgroundColor: colors.muted }]}>
            <Text style={[styles.smallCardTagText, { color: colors.secondary }]}>{school.curriculum}</Text>
          </View>
          <View style={[styles.smallCardTag, { backgroundColor: "#EEF5FA" }]}>
            <Ionicons name="location-outline" size={10} color={colors.secondary} />
            <Text style={[styles.smallCardTagText, { color: colors.secondary }]}>{school.location.distance} km</Text>
          </View>
          <Text style={[styles.smallCardFee, { color: colors.primary }]}>
            SAR {school.fees.tuition.toLocaleString()}/yr
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onFavorite} hitSlop={8} style={styles.smallCardHeart}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? colors.primary : colors.mutedForeground} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    favorites, lastSeen, toggleFavorite, addToLastSeen,
    activeFilter, setActiveFilter, user,
    sortOrder, setSortOrder, selectedCity, setSelectedCity,
    unreadAlertCount,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const filteredSchools = useMemo(() => {
    let result = [...SCHOOLS];

    // City filter
    if (selectedCity !== "All") {
      result = result.filter((s) => s.location.city === selectedCity);
    }

    // Search
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

    // Filter chips
    switch (activeFilter) {
      case "nearest":
        result.sort((a, b) => a.location.distance - b.location.distance);
        break;
      case "budget":
        result = result.filter((s) => s.fees.tuition <= user.budgetMax);
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
    }

    // Sort order (override filter sort only for these)
    if (activeFilter === "all" || sortOrder !== "featured") {
      switch (sortOrder) {
        case "price_asc":
          result.sort((a, b) => a.fees.tuition - b.fees.tuition);
          break;
        case "price_desc":
          result.sort((a, b) => b.fees.tuition - a.fees.tuition);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          if (activeFilter === "all") result.sort((a, b) => b.fitScore - a.fitScore);
      }
    }

    return result;
  }, [activeFilter, searchQuery, user.budgetMax, selectedCity, sortOrder]);

  const topPickSchools = filteredSchools.slice(0, 8);

  const recentSchools = useMemo(() => {
    return lastSeen
      .map((id) => SCHOOLS.find((s) => s.id === id))
      .filter((s): s is School => !!s)
      .slice(0, 6);
  }, [lastSeen]);

  const handleSchoolPress = (school: School) => {
    addToLastSeen(school.id);
    router.push(`/school/${school.id}`);
  };

  const currentSortLabel = SORT_OPTIONS.find((s) => s.id === sortOrder)?.label ?? "Featured";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + topPaddingWeb + 12, paddingBottom: insets.bottom + 90 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={require("../../assets/images/schoolo-logo.png")} style={styles.logo} contentFit="contain" />
          <View style={styles.headerRight}>
            {/* City Dropdown */}
            <TouchableOpacity
              onPress={() => setShowCityModal(true)}
              style={[styles.locationChip, { backgroundColor: colors.muted, borderColor: colors.border }]}
            >
              <Ionicons name="location-sharp" size={13} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.foreground }]}>
                {selectedCity === "All" ? "All Cities" : selectedCity}
              </Text>
              <Ionicons name="chevron-down" size={12} color={colors.mutedForeground} />
            </TouchableOpacity>

            {/* Notification Bell */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/alerts")}
              style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="bell" size={20} color={colors.foreground} />
              {unreadAlertCount > 0 && (
                <View style={[styles.notifBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.notifBadgeText}>
                    {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <Text style={[styles.greeting, { color: colors.foreground }]}>
          {user.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Find the right school"}
        </Text>
        <Text style={[styles.subGreeting, { color: colors.mutedForeground }]}>
          {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} {selectedCity !== "All" ? `in ${selectedCity}` : "across Saudi Arabia"}
        </Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search schools, districts…"
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters + Sort */}
        <View style={styles.filterRow}>
          <FlatList
            data={FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => {
              const active = activeFilter === item.id;
              return (
                <TouchableOpacity
                  onPress={() => { setActiveFilter(item.id); Haptics.selectionAsync(); }}
                  style={[styles.filterChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border, borderRadius: 999 }]}
                >
                  <Text style={[styles.filterChipText, { color: active ? "#FFF" : colors.foreground }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {/* Sort button */}
          <TouchableOpacity
            onPress={() => setShowSortModal(true)}
            style={[styles.sortBtn, { backgroundColor: sortOrder !== "featured" ? colors.secondary : colors.muted, borderRadius: 999 }]}
          >
            <Ionicons name="funnel-outline" size={14} color={sortOrder !== "featured" ? "#FFF" : colors.foreground} />
          </TouchableOpacity>
        </View>

        {sortOrder !== "featured" && (
          <View style={[styles.sortIndicator, { backgroundColor: colors.muted, borderRadius: 8 }]}>
            <Ionicons name="swap-vertical-outline" size={12} color={colors.primary} />
            <Text style={[styles.sortIndicatorText, { color: colors.primary }]}>Sorted by: {currentSortLabel}</Text>
            <TouchableOpacity onPress={() => setSortOrder("featured")}>
              <Ionicons name="close-circle" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        )}

        {/* Suggested Schools */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Suggested for You</Text>
          <View style={[styles.fitInfo, { backgroundColor: colors.muted }]}>
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={[styles.fitInfoText, { color: colors.primary }]}>AI Matched</Text>
          </View>
        </View>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Based on your preferences</Text>

        {topPickSchools.length > 0 ? (
          <FlatList
            data={topPickSchools}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardsListContent}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <View style={{ marginRight: 16 }}>
                <SchoolCard
                  school={item}
                  onPress={() => handleSchoolPress(item)}
                  isFavorite={favorites.includes(item.id)}
                  onFavorite={() => toggleFavorite(item.id)}
                />
              </View>
            )}
          />
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Ionicons name="school-outline" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No schools match your current filters</Text>
            <TouchableOpacity onPress={() => { setActiveFilter("all"); setSortOrder("featured"); }}>
              <Text style={[styles.emptyLink, { color: colors.primary }]}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recently Viewed */}
        {recentSchools.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 28 }]}>Recently Viewed</Text>
            <View style={styles.recentList}>
              {recentSchools.map((school) => (
                <SmallSchoolCard
                  key={school.id}
                  school={school}
                  onPress={() => handleSchoolPress(school)}
                  isFavorite={favorites.includes(school.id)}
                  onFavorite={() => toggleFavorite(school.id)}
                />
              ))}
            </View>
          </>
        )}

        {recentSchools.length === 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 28 }]}>All Schools</Text>
            <View style={styles.recentList}>
              {SCHOOLS.slice(0, 4).map((school) => (
                <SmallSchoolCard
                  key={school.id}
                  school={school}
                  onPress={() => handleSchoolPress(school)}
                  isFavorite={favorites.includes(school.id)}
                  onFavorite={() => toggleFavorite(school.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* City Modal */}
      <Modal visible={showCityModal} transparent animationType="fade" onRequestClose={() => setShowCityModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCityModal(false)}>
          <View style={[styles.cityModal, { backgroundColor: colors.card, borderRadius: 16, borderColor: colors.border }]}>
            <Text style={[styles.cityModalTitle, { color: colors.foreground }]}>Select City</Text>
            {CITY_OPTIONS.map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => {
                  setSelectedCity(city);
                  setShowCityModal(false);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.cityOption,
                  { borderBottomColor: colors.border, backgroundColor: selectedCity === city ? "#FEF0E0" : "transparent" },
                ]}
              >
                <Ionicons
                  name={city === "All" ? "globe-outline" : "location-outline"}
                  size={18}
                  color={selectedCity === city ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.cityOptionText, { color: selectedCity === city ? colors.primary : colors.foreground, fontWeight: selectedCity === city ? "700" : "500" }]}>
                  {city === "All" ? "All Cities" : city}
                </Text>
                {selectedCity === city && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSortModal(false)}>
          <View style={[styles.cityModal, { backgroundColor: colors.card, borderRadius: 16, borderColor: colors.border }]}>
            <Text style={[styles.cityModalTitle, { color: colors.foreground }]}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => {
                  setSortOrder(opt.id as any);
                  setShowSortModal(false);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.cityOption,
                  { borderBottomColor: colors.border, backgroundColor: sortOrder === opt.id ? "#FEF0E0" : "transparent" },
                ]}
              >
                <Ionicons
                  name={
                    opt.id === "featured" ? "sparkles-outline" :
                    opt.id === "price_asc" ? "trending-down-outline" :
                    opt.id === "price_desc" ? "trending-up-outline" : "star-outline"
                  }
                  size={18}
                  color={sortOrder === opt.id ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.cityOptionText, { color: sortOrder === opt.id ? colors.primary : colors.foreground, fontWeight: sortOrder === opt.id ? "700" : "500" }]}>
                  {opt.label}
                </Text>
                {sortOrder === opt.id && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  logo: { width: 160, height: 58 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationChip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  locationText: { fontSize: 12, fontWeight: "500" },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  notifBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  notifBadgeText: { color: "#FFF", fontSize: 9, fontWeight: "700" },
  greeting: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  subGreeting: { fontSize: 14, marginTop: 3, marginBottom: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterList: { paddingRight: 8, gap: 8, marginBottom: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  sortBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sortIndicator: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, marginTop: 8, alignSelf: "flex-start" },
  sortIndicatorText: { fontSize: 12, fontWeight: "600" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 24, marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  fitInfo: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  fitInfoText: { fontSize: 11, fontWeight: "600" },
  sectionSub: { fontSize: 13, marginBottom: 14 },
  cardsListContent: { paddingLeft: 0, paddingRight: 20, marginHorizontal: -20, paddingHorizontal: 20 },
  card: { overflow: "hidden", shadowColor: "#132F45", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 6 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 12 },
  fitBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  fitBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  cardBottom: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 },
  cardName: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  cardRating: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  cardRatingCount: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  cardDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(255,255,255,0.5)" },
  cardLocation: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  cardTagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  cardTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cardTagText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  cardFee: { color: "#FFFFFF", fontSize: 12, fontWeight: "700", marginLeft: "auto" },
  emptyState: { padding: 32, alignItems: "center", gap: 8, marginVertical: 8 },
  emptyText: { fontSize: 14, textAlign: "center" },
  emptyLink: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  recentList: { gap: 10, marginTop: 12 },
  smallCard: { flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 10, gap: 12 },
  smallCardImage: { width: 76, height: 76 },
  smallCardInfo: { flex: 1, gap: 4 },
  smallCardName: { fontSize: 14, fontWeight: "700" },
  smallCardRating: { fontSize: 12, fontWeight: "600" },
  smallCardSub: { fontSize: 12 },
  smallCardTag: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  smallCardTagText: { fontSize: 11, fontWeight: "600" },
  smallCardFee: { fontSize: 12, fontWeight: "700", marginLeft: "auto" },
  smallCardHeart: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 24 },
  cityModal: { width: "100%", maxWidth: 320, borderWidth: 1, overflow: "hidden" },
  cityModalTitle: { fontSize: 16, fontWeight: "700", padding: 16, paddingBottom: 8 },
  cityOption: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  cityOptionText: { flex: 1, fontSize: 15 },
});
