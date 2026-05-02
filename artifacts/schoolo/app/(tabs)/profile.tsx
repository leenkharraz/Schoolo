import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar", "Mecca", "Medina", "Tabuk"];
const CURRICULA = ["Any", "Saudi National", "British", "American", "IB", "Indian"];

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{title}</Text>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={[styles.fieldRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useApp();
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleSave = () => {
    updateUser({ ...draft, isLoggedIn: true });
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleLogout = () => {
    updateUser({ isLoggedIn: false, name: "", phone: "" });
    setDraft((prev) => ({ ...prev, isLoggedIn: false, name: "", phone: "" }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
        <TouchableOpacity
          onPress={() => (editing ? handleSave() : setEditing(true))}
          style={[
            styles.editBtn,
            {
              backgroundColor: editing ? colors.primary : colors.muted,
              borderRadius: 999,
            },
          ]}
        >
          <Text
            style={[
              styles.editBtnText,
              { color: editing ? colors.primaryForeground : colors.foreground },
            ]}
          >
            {editing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {user.isLoggedIn ? (
            <>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                {user.name || "Schoolo Parent"}
              </Text>
              <Text style={[styles.userSub, { color: colors.mutedForeground }]}>
                {user.city} · {user.childrenCount} child{user.childrenCount !== 1 ? "ren" : ""}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.userName, { color: colors.foreground }]}>
                Set up your profile
              </Text>
              <Text style={[styles.userSub, { color: colors.mutedForeground }]}>
                Help us find the best schools for your family
              </Text>
            </>
          )}
        </View>

        {/* Account */}
        <SectionHeader title="ACCOUNT" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <FieldRow label="Full Name">
            {editing ? (
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={draft.name}
                onChangeText={(v) => setDraft((p) => ({ ...p, name: v }))}
                placeholder="Your name"
                placeholderTextColor={colors.mutedForeground}
              />
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.name || "Not set"}
              </Text>
            )}
          </FieldRow>
          <FieldRow label="Phone">
            {editing ? (
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={draft.phone}
                onChangeText={(v) => setDraft((p) => ({ ...p, phone: v }))}
                placeholder="+966 5X XXX XXXX"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.phone || "Not set"}
              </Text>
            )}
          </FieldRow>
          <FieldRow label="City">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {CITIES.map((city) => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => setDraft((p) => ({ ...p, city }))}
                      style={[
                        styles.pill,
                        {
                          backgroundColor: draft.city === city ? colors.primary : colors.muted,
                          borderRadius: 999,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: draft.city === city ? "#FFF" : colors.foreground },
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.city}</Text>
            )}
          </FieldRow>
        </View>

        {/* School Preferences */}
        <SectionHeader title="SCHOOL PREFERENCES" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <FieldRow label="Number of Children">
            {editing ? (
              <View style={styles.counterRow}>
                {[1, 2, 3, 4, "5+"].map((n) => (
                  <TouchableOpacity
                    key={String(n)}
                    onPress={() =>
                      setDraft((p) => ({
                        ...p,
                        childrenCount: typeof n === "number" ? n : 5,
                      }))
                    }
                    style={[
                      styles.counter,
                      {
                        backgroundColor:
                          draft.childrenCount === (typeof n === "number" ? n : 5)
                            ? colors.primary
                            : colors.muted,
                        borderRadius: 8,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          draft.childrenCount === (typeof n === "number" ? n : 5)
                            ? "#FFF"
                            : colors.foreground,
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.childrenCount}
              </Text>
            )}
          </FieldRow>

          <FieldRow label="Annual Budget (SAR)">
            {editing ? (
              <View>
                <Text style={[styles.budgetLabel, { color: colors.primary }]}>
                  Up to SAR {draft.budgetMax.toLocaleString()}
                </Text>
                <View style={styles.budgetButtons}>
                  {[20000, 40000, 60000, 80000, 100000].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      onPress={() => setDraft((p) => ({ ...p, budgetMax: amt }))}
                      style={[
                        styles.budgetBtn,
                        {
                          backgroundColor:
                            draft.budgetMax === amt ? colors.primary : colors.muted,
                          borderRadius: 8,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: draft.budgetMax === amt ? "#FFF" : colors.foreground,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {amt >= 1000 ? `${amt / 1000}K` : amt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                SAR {user.budgetMax.toLocaleString()}
              </Text>
            )}
          </FieldRow>

          <FieldRow label="Curriculum">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {CURRICULA.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setDraft((p) => ({ ...p, preferredCurriculum: c }))}
                      style={[
                        styles.pill,
                        {
                          backgroundColor:
                            draft.preferredCurriculum === c ? colors.primary : colors.muted,
                          borderRadius: 999,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          {
                            color: draft.preferredCurriculum === c ? "#FFF" : colors.foreground,
                          },
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.preferredCurriculum}
              </Text>
            )}
          </FieldRow>

          <FieldRow label="Special Needs Support">
            <Switch
              value={editing ? draft.specialNeeds : user.specialNeeds}
              onValueChange={(v) =>
                editing && setDraft((p) => ({ ...p, specialNeeds: v }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </FieldRow>
        </View>

        {/* School Fit Score explanation */}
        <View
          style={[
            styles.fitCard,
            { backgroundColor: "#FEF0E0", borderColor: "#F5D6B0", borderRadius: colors.radius },
          ]}
        >
          <View style={styles.fitCardHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={[styles.fitCardTitle, { color: colors.primary }]}>School Fit Score</Text>
          </View>
          <Text style={[styles.fitCardBody, { color: colors.navy }]}>
            Your School Fit Score is calculated using your budget, preferred curriculum, city, number of children, and special needs requirements. Schools are ranked from 0–100% match.
          </Text>
        </View>

        {/* Logout / Login */}
        {user.isLoggedIn ? (
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
          >
            <Feather name="log-out" size={16} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.loginBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          >
            <Text style={styles.loginBtnText}>Save Profile &amp; Start</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  editBtn: { paddingHorizontal: 16, paddingVertical: 7 },
  editBtnText: { fontSize: 14, fontWeight: "600" },
  content: { padding: 20, gap: 6 },
  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFF", fontSize: 26, fontWeight: "700" },
  userName: { fontSize: 20, fontWeight: "700" },
  userSub: { fontSize: 14 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  card: { borderWidth: 1, overflow: "hidden" },
  fieldRow: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: { fontSize: 13, width: 130 },
  fieldValue: { flex: 1 },
  fieldText: { fontSize: 14, fontWeight: "500" },
  input: { fontSize: 14, flex: 1 },
  pillRow: { flexDirection: "row", gap: 8, flexWrap: "nowrap" },
  pill: { paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, fontWeight: "600" },
  counterRow: { flexDirection: "row", gap: 6 },
  counter: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  budgetLabel: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  budgetButtons: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  budgetBtn: { paddingHorizontal: 12, paddingVertical: 7 },
  fitCard: { marginTop: 20, padding: 16, borderWidth: 1, gap: 8 },
  fitCardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  fitCardTitle: { fontSize: 14, fontWeight: "700" },
  fitCardBody: { fontSize: 13, lineHeight: 19 },
  logoutBtn: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
  },
  logoutText: { fontSize: 15, fontWeight: "600" },
  loginBtn: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
