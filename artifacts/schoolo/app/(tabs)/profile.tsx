import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
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

const CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar", "Mecca", "Medina"];
const CURRICULA = ["Any", "Saudi National", "British", "American", "IB", "Indian"];
const LANGUAGES = ["None", "French", "Spanish", "Mandarin", "German", "Portuguese"];
const ACTIVITIES = ["Football", "Basketball", "Swimming", "Tennis", "Arts & Crafts", "Music", "Drama", "Robotics", "Chess", "Coding", "Quran"];
const GRADES = ["KG1", "KG2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SCHOOL_TYPES = ["any", "private", "international"];
const DISTANCES = [2, 5, 10, 20, 50];

function SectionHeader({ title, icon }: { title: string; icon?: string }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeaderRow}>
      {icon && <Ionicons name={icon as any} size={13} color={colors.mutedForeground} />}
      <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{title}</Text>
    </View>
  );
}

function FieldRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.fieldRow, { borderBottomColor: last ? "transparent" : colors.border, borderBottomWidth: last ? 0 : 1 }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={styles.fieldValue}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
    updateUser({ isLoggedIn: false, name: "", phone: "", email: "", hasCompletedOnboarding: false });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/login");
  };

  const toggleActivity = (act: string) => {
    const exists = draft.preferredActivities.includes(act);
    setDraft((p) => ({
      ...p,
      preferredActivities: exists ? p.preferredActivities.filter((a) => a !== act) : [...p.preferredActivities, act],
    }));
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + topPaddingWeb + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
        <TouchableOpacity
          onPress={() => (editing ? handleSave() : setEditing(true))}
          style={[styles.editBtn, { backgroundColor: editing ? colors.primary : colors.muted, borderRadius: 999 }]}
        >
          <Text style={[styles.editBtnText, { color: editing ? "#FFF" : colors.foreground }]}>
            {editing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {user.name || "Schoolo Parent"}
          </Text>
          <Text style={[styles.userSub, { color: colors.mutedForeground }]}>
            {user.city} · {user.childrenCount} child{user.childrenCount !== 1 ? "ren" : ""}
            {user.preferredCurriculum !== "Any" ? ` · ${user.preferredCurriculum}` : ""}
          </Text>
        </View>

        {/* Account */}
        <SectionHeader title="ACCOUNT" icon="person-outline" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <FieldRow label="Full Name">
            {editing ? (
              <TextInput style={[styles.input, { color: colors.foreground }]} value={draft.name} onChangeText={(v) => setDraft((p) => ({ ...p, name: v }))} placeholder="Your full name" placeholderTextColor={colors.mutedForeground} autoCapitalize="words" />
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.name || "Not set"}</Text>
            )}
          </FieldRow>

          <FieldRow label="Phone">
            {editing ? (
              <TextInput style={[styles.input, { color: colors.foreground }]} value={draft.phone} onChangeText={(v) => setDraft((p) => ({ ...p, phone: v }))} placeholder="+966 5X XXX XXXX" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" />
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.phone || "Not set"}</Text>
            )}
          </FieldRow>

          <FieldRow label="Email">
            {editing ? (
              <TextInput style={[styles.input, { color: colors.foreground }]} value={draft.email} onChangeText={(v) => setDraft((p) => ({ ...p, email: v }))} placeholder="your@email.com" placeholderTextColor={colors.mutedForeground} keyboardType="email-address" autoCapitalize="none" />
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.email || "Not set"}</Text>
            )}
          </FieldRow>

          <FieldRow label="City" last>
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {CITIES.map((city) => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => setDraft((p) => ({ ...p, city }))}
                      style={[styles.pill, { backgroundColor: draft.city === city ? colors.primary : colors.muted, borderRadius: 999 }]}
                    >
                      <Text style={[styles.pillText, { color: draft.city === city ? "#FFF" : colors.foreground }]}>{city}</Text>
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
        <SectionHeader title="SCHOOL PREFERENCES" icon="school-outline" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>

          <FieldRow label="Number of Children">
            {editing ? (
              <View style={styles.counterRow}>
                {[1, 2, 3, 4, "5+"].map((n) => (
                  <TouchableOpacity
                    key={String(n)}
                    onPress={() => setDraft((p) => ({ ...p, childrenCount: typeof n === "number" ? n : 5 }))}
                    style={[styles.counter, { backgroundColor: draft.childrenCount === (typeof n === "number" ? n : 5) ? colors.primary : colors.muted, borderRadius: 8 }]}
                  >
                    <Text style={{ color: draft.childrenCount === (typeof n === "number" ? n : 5) ? "#FFF" : colors.foreground, fontWeight: "600", fontSize: 14 }}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.childrenCount}</Text>
            )}
          </FieldRow>

          <FieldRow label="Child Grade">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {GRADES.map((g) => (
                    <TouchableOpacity key={g} onPress={() => setDraft((p) => ({ ...p, childGrade: g }))}
                      style={[styles.pill, { backgroundColor: draft.childGrade === g ? colors.primary : colors.muted, borderRadius: 999 }]}
                    >
                      <Text style={[styles.pillText, { color: draft.childGrade === g ? "#FFF" : colors.foreground }]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.childGrade || "Not set"}</Text>
            )}
          </FieldRow>

          <FieldRow label="Annual Budget">
            {editing ? (
              <View>
                <Text style={[styles.budgetLabel, { color: colors.primary }]}>Up to SAR {draft.budgetMax.toLocaleString()}</Text>
                <View style={styles.budgetButtons}>
                  {[20000, 40000, 60000, 80000, 120000].map((amt) => (
                    <TouchableOpacity key={amt} onPress={() => setDraft((p) => ({ ...p, budgetMax: amt }))}
                      style={[styles.budgetBtn, { backgroundColor: draft.budgetMax === amt ? colors.primary : colors.muted, borderRadius: 8 }]}
                    >
                      <Text style={{ color: draft.budgetMax === amt ? "#FFF" : colors.foreground, fontSize: 12, fontWeight: "600" }}>
                        {amt >= 1000 ? `${amt / 1000}K` : amt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>SAR {user.budgetMax.toLocaleString()}</Text>
            )}
          </FieldRow>

          <FieldRow label="Curriculum">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {CURRICULA.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setDraft((p) => ({ ...p, preferredCurriculum: c }))}
                      style={[styles.pill, { backgroundColor: draft.preferredCurriculum === c ? colors.primary : colors.muted, borderRadius: 999 }]}
                    >
                      <Text style={[styles.pillText, { color: draft.preferredCurriculum === c ? "#FFF" : colors.foreground }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.preferredCurriculum}</Text>
            )}
          </FieldRow>

          <FieldRow label="Max Distance">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {DISTANCES.map((d) => (
                    <TouchableOpacity key={d} onPress={() => setDraft((p) => ({ ...p, distanceMax: d }))}
                      style={[styles.pill, { backgroundColor: draft.distanceMax === d ? colors.primary : colors.muted, borderRadius: 999 }]}
                    >
                      <Text style={[styles.pillText, { color: draft.distanceMax === d ? "#FFF" : colors.foreground }]}>
                        {d === 50 ? "Any" : `< ${d}km`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.distanceMax === 50 ? "No limit" : `< ${user.distanceMax} km`}
              </Text>
            )}
          </FieldRow>

          <FieldRow label="Third Language">
            {editing ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {LANGUAGES.map((l) => (
                    <TouchableOpacity key={l} onPress={() => setDraft((p) => ({ ...p, preferredLanguage: l }))}
                      style={[styles.pill, { backgroundColor: draft.preferredLanguage === l ? colors.primary : colors.muted, borderRadius: 999 }]}
                    >
                      <Text style={[styles.pillText, { color: draft.preferredLanguage === l ? "#FFF" : colors.foreground }]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.preferredLanguage || "None"}</Text>
            )}
          </FieldRow>

          <FieldRow label="School Type">
            {editing ? (
              <View style={styles.pillRow}>
                {SCHOOL_TYPES.map((t) => (
                  <TouchableOpacity key={t} onPress={() => setDraft((p) => ({ ...p, preferredSchoolType: t }))}
                    style={[styles.pill, { backgroundColor: draft.preferredSchoolType === t ? colors.primary : colors.muted, borderRadius: 999 }]}
                  >
                    <Text style={[styles.pillText, { color: draft.preferredSchoolType === t ? "#FFF" : colors.foreground }]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {(user.preferredSchoolType ?? "any").charAt(0).toUpperCase() + (user.preferredSchoolType ?? "any").slice(1)}
              </Text>
            )}
          </FieldRow>

          <FieldRow label="Special Needs Support">
            <Switch
              value={editing ? draft.specialNeeds : user.specialNeeds}
              onValueChange={(v) => editing && setDraft((p) => ({ ...p, specialNeeds: v }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </FieldRow>

          <FieldRow label="Preferred Activities" last>
            {editing ? (
              <View style={styles.activityGrid}>
                {ACTIVITIES.map((act) => (
                  <TouchableOpacity
                    key={act}
                    onPress={() => toggleActivity(act)}
                    style={[
                      styles.actChip,
                      {
                        backgroundColor: draft.preferredActivities.includes(act) ? "#FEF0E0" : colors.muted,
                        borderColor: draft.preferredActivities.includes(act) ? colors.primary : colors.border,
                        borderRadius: 8,
                      },
                    ]}
                  >
                    <Text style={[styles.actChipText, { color: draft.preferredActivities.includes(act) ? colors.primary : colors.foreground }]}>
                      {act}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>
                {user.preferredActivities.length > 0 ? user.preferredActivities.join(", ") : "None set"}
              </Text>
            )}
          </FieldRow>
        </View>

        {/* Fit Score explanation */}
        <View style={[styles.fitCard, { backgroundColor: "#FEF0E0", borderColor: "#F5D6B0", borderRadius: colors.radius }]}>
          <View style={styles.fitCardHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={[styles.fitCardTitle, { color: colors.primary }]}>How School Fit Score works</Text>
          </View>
          <Text style={[styles.fitCardBody, { color: colors.navy }]}>
            Your Fit Score is calculated from your budget, preferred curriculum, city, distance preference, number of children, activities, and Special Needs Support requirements. Schools are ranked from 0–100% match.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 1 },
  headerTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  editBtn: { paddingHorizontal: 16, paddingVertical: 7 },
  editBtnText: { fontSize: 14, fontWeight: "600" },
  content: { padding: 20, gap: 6 },
  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 6 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: 26, fontWeight: "700" },
  userName: { fontSize: 20, fontWeight: "700" },
  userSub: { fontSize: 14, textAlign: "center" },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 20, marginBottom: 8 },
  sectionHeader: { fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  card: { borderWidth: 1, overflow: "hidden" },
  fieldRow: { paddingHorizontal: 16, paddingVertical: 13, flexDirection: "row", alignItems: "center" },
  fieldLabel: { fontSize: 13, width: 130, flexShrink: 0 },
  fieldValue: { flex: 1 },
  fieldText: { fontSize: 14, fontWeight: "500" },
  input: { fontSize: 14, flex: 1 },
  pillRow: { flexDirection: "row", gap: 8, flexWrap: "nowrap" },
  pill: { paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, fontWeight: "600" },
  counterRow: { flexDirection: "row", gap: 6 },
  counter: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  budgetLabel: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  budgetButtons: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  budgetBtn: { paddingHorizontal: 12, paddingVertical: 7 },
  activityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  actChip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  actChipText: { fontSize: 12, fontWeight: "500" },
  fitCard: { marginTop: 20, padding: 16, borderWidth: 1, gap: 8 },
  fitCardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  fitCardTitle: { fontSize: 14, fontWeight: "700" },
  fitCardBody: { fontSize: 13, lineHeight: 19 },
  logoutBtn: { marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderWidth: 1 },
  logoutText: { fontSize: 15, fontWeight: "600" },
});
