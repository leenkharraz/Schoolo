import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { SCHOOL_IMAGE_MAP } from "@/data/schoolImages";
import { SCHOOLS, type School } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

function FavoriteCard({
  school,
  onPress,
  onRemove,
}: {
  school: School;
  onPress: () => void;
  onRemove: () => void;
}) {
  const colors = useColors();
  const imgSrc = SCHOOL_IMAGE_MAP[school.images[0]];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <Image
        source={imgSrc}
        style={[styles.cardImage, { borderRadius: colors.radius - 2 }]}
        contentFit="cover"
      />
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onRemove();
        }}
        style={[styles.heartBtn, { backgroundColor: "rgba(255,255,255,0.9)" }]}
        hitSlop={4}
      >
        <Ionicons name="heart" size={18} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: colors.foreground }]} numberOfLines={2}>
          {school.name}
        </Text>
        <View style={styles.cardRow}>
          <Ionicons name="star" size={12} color="#F3B940" />
          <Text style={[styles.cardRating, { color: colors.foreground }]}>
            {school.rating}
          </Text>
          <Text style={[styles.cardRatingCount, { color: colors.mutedForeground }]}>
            ({school.totalRatings})
          </Text>
        </View>
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
          <Text style={[styles.cardLocation, { color: colors.mutedForeground }]} numberOfLines={1}>
            {school.location.district}, {school.location.city}
          </Text>
        </View>
        <View style={styles.cardTagRow}>
          <View style={[styles.tag, { backgroundColor: colors.muted }]}>
            <Text style={[styles.tagText, { color: colors.secondary }]}>
              {school.curriculum}
            </Text>
          </View>
          <Text style={[styles.cardFee, { color: colors.primary }]}>
            SAR {school.fees.tuition.toLocaleString()}/yr
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, toggleFavorite, addToLastSeen } = useApp();
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const favoriteSchools = SCHOOLS.filter((s) => favorites.includes(s.id));

  const handlePress = (school: School) => {
    addToLastSeen(school.id);
    router.push(`/school/${school.id}`);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + topPaddingWeb + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Favourites</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {favoriteSchools.length} saved school{favoriteSchools.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={[styles.heartIcon, { backgroundColor: "#FEE8D6" }]}>
          <Ionicons name="heart" size={18} color={colors.primary} />
        </View>
      </View>

      {favoriteSchools.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={56} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No saved schools yet
          </Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Tap the heart icon on any school to save it here for quick access.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteSchools}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 90 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavoriteCard
              school={item}
              onPress={() => handlePress(item)}
              onRemove={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  heartIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700" },
  emptySub: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  list: { padding: 16, gap: 12 },
  row: { gap: 12 },
  card: {
    flex: 1,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#132F45",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: { width: "100%", height: 130 },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { padding: 10, gap: 5 },
  cardName: { fontSize: 13, fontWeight: "700", lineHeight: 18 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardRating: { fontSize: 12, fontWeight: "600" },
  cardRatingCount: { fontSize: 11 },
  cardLocation: { fontSize: 11, flex: 1 },
  cardTagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: "600" },
  cardFee: { fontSize: 11, fontWeight: "700", marginLeft: "auto" },
});
