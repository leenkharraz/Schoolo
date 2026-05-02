import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
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
import { SCHOOLS, filterSchools, type School } from "@/data/schools";
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
];

function AnimatedHeart({
  isFavorite,
  onPress,
}: {
  isFavorite: boolean;
  onPress: () => void;
}) {
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
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#EA8B33" : "#FFFFFF"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

function SchoolCard({
  school,
  onPress,
  isFavorite,
  onFavorite,
}: {
  school: School;
  onPress: () => void;
  isFavorite: boolean;
  onFavorite: () => void;
}) {
  const colors = useColors();
  const imgSrc = SCHOOL_IMAGE_MAP[school.images[0]];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.93}
      style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: colors.radius + 4 }]}
    >
      <Image
        source={imgSrc}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(19,47,69,0.85)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.35 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.cardTopRow}>
        <View style={[styles.fitBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.fitBadgeText}>{school.fitScore}% Match</Text>
        </View>
        <AnimatedHeart isFavorite={isFavorite} onPress={onFavorite} />
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.cardName} numberOfLines={1}>
          {school.name}
        </Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={12} color="#F3B940" />
          <Text style={styles.cardRating}>{school.rating}</Text>
          <Text style={styles.cardRatingCount}>({school.totalRatings})</Text>
          <View style={styles.cardDot} />
          <Text style={styles.cardLocation}>{school.location.district}</Text>
        </View>
        <View style={styles.cardTagRow}>
          <View style={[styles.cardTag, { backgroundColor: "rgba(234,162,58,0.9)" }]}>
            <Text style={styles.cardTagText}>{school.curriculum}</Text>
          </View>
          <View style={[styles.cardTag, { backgroundColor: "rgba(50,102,127,0.9)" }]}>
            <Text style={styles.cardTagText}>
              {school.type === "international" ? "International" : "Private"}
            </Text>
          </View>
          <Text style={styles.cardFee}>
            SAR {(school.fees.tuition / 1000).toFixed(0)}K/yr
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SmallSchoolCard({
  school,
  onPress,
  isFavorite,
  onFavorite,
}: {
  school: School;
  onPress: () => void;
  isFavorite: boolean;
  onFavorite: () => void;
}) {
  const colors = useColors();
  const imgSrc = SCHOOL_IMAGE_MAP[school.images[0]];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.smallCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <Image
        source={imgSrc}
        style={[styles.smallCardImage, { borderRadius: colors.radius - 4 }]}
        contentFit="cover"
      />
      <View style={styles.smallCardInfo}>
        <Text style={[styles.smallCardName, { color: colors.foreground }]} numberOfLines={1}>
          {school.name}
        </Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={11} color="#F3B940" />
          <Text style={[styles.smallCardRating, { color: colors.foreground }]}>
            {school.rating}
          </Text>
          <View style={styles.cardDot} />
          <Text style={[styles.smallCardSub, { color: colors.mutedForeground }]}>
            {school.location.district}, {school.location.city}
          </Text>
        </View>
        <View style={styles.cardRow}>
          <View
            style={[
              styles.smallCardTag,
              { backgroundColor: colors.muted },
            ]}
          >
            <Text style={[styles.smallCardTagText, { color: colors.secondary }]}>
              {school.curriculum}
            </Text>
          </View>
          <Text style={[styles.smallCardFee, { color: colors.primary }]}>
            SAR {school.fees.tuition.toLocaleString()}/yr
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onFavorite} hitSlop={8} style={styles.smallCardHeart}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? colors.primary : colors.mutedForeground}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, lastSeen, toggleFavorite, addToLastSeen, activeFilter, setActiveFilter, user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const filterListRef = useRef<FlatList>(null);

  const topPickSchools = useMemo(() => {
    return filterSchools(SCHOOLS, activeFilter, searchQuery, user.budgetMax).slice(0, 8);
  }, [activeFilter, searchQuery, user.budgetMax]);

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

  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + topPaddingWeb + 12,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <View style={styles.headerRight}>
            <View style={[styles.locationChip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Ionicons name="location-sharp" size={13} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.secondary }]}>
                {user.city || "Riyadh"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/alerts")}
              style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="bell" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        {user.isLoggedIn && user.name ? (
          <Text style={[styles.greeting, { color: colors.foreground }]}>
            Welcome back, {user.name.split(" ")[0]}
          </Text>
        ) : (
          <Text style={[styles.greeting, { color: colors.foreground }]}>
            Find the right school
          </Text>
        )}
        <Text style={[styles.subGreeting, { color: colors.mutedForeground }]}>
          {SCHOOLS.length} schools across Saudi Arabia
        </Text>

        {/* Search */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
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

        {/* Filters */}
        <FlatList
          ref={filterListRef}
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = activeFilter === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveFilter(item.id);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: 999,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: active ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Suggested Schools */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Suggested for You
          </Text>
          <View style={[styles.fitInfo, { backgroundColor: colors.muted }]}>
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={[styles.fitInfoText, { color: colors.primary }]}>
              AI Matched
            </Text>
          </View>
        </View>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          Based on your preferences
        </Text>

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

        {/* Recently Viewed */}
        {recentSchools.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 28 }]}>
              Recently Viewed
            </Text>
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

        {/* All Schools prompt when no recent */}
        {recentSchools.length === 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 28 }]}>
              All Schools
            </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  logo: { width: 52, height: 52 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  locationText: { fontSize: 12, fontWeight: "500" },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  subGreeting: { fontSize: 14, marginTop: 3, marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterList: { paddingRight: 20, gap: 8, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    marginBottom: 2,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  fitInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  fitInfoText: { fontSize: 11, fontWeight: "600" },
  sectionSub: { fontSize: 13, marginBottom: 14 },
  cardsListContent: { paddingLeft: 0, paddingRight: 20, marginHorizontal: -20, paddingHorizontal: 20 },
  card: {
    overflow: "hidden",
    shadowColor: "#132F45",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
  },
  fitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  fitBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cardBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  cardRating: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  cardRatingCount: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  cardDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  cardLocation: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  cardTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  cardTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardTagText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  cardFee: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: "auto",
  },
  recentList: { gap: 10, marginTop: 12 },
  smallCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  smallCardImage: { width: 76, height: 76 },
  smallCardInfo: { flex: 1, gap: 4 },
  smallCardName: { fontSize: 14, fontWeight: "700" },
  smallCardRating: { fontSize: 12, fontWeight: "600" },
  smallCardSub: { fontSize: 12 },
  smallCardTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  smallCardTagText: { fontSize: 11, fontWeight: "600" },
  smallCardFee: { fontSize: 12, fontWeight: "700", marginLeft: "auto" },
  smallCardHeart: { padding: 4 },
});
