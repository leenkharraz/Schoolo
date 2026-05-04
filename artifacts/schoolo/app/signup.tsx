import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

import { useApp, type ChildProfile } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CITIES = ["Jeddah", "Riyadh", "Dammam"];
const CHILDREN_COUNTS = [1, 2, 3, 4, 5];
const GENDERS = ["Male", "Female"];
const GRADES = [
  "Pre-K", "KG1", "KG2",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];
const CURRICULA = ["Any", "American", "British", "IB", "Saudi National", "Indian"];
const LANGUAGES = ["None", "French", "Spanish", "Mandarin", "German"];
const BUDGET_OPTIONS = [
  { label: "Under SAR 30K", value: 30000 },
  { label: "SAR 30K–60K", value: 60000 },
  { label: "SAR 60K–90K", value: 90000 },
  { label: "SAR 90K+", value: 130000 },
];
const DISTANCE_OPTIONS = [
  { label: "2 km", value: 2 },
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
  { label: "Any", value: 50 },
];
const SCHOOL_TYPES = [
  { label: "Any", value: "any" },
  { label: "Private", value: "private" },
  { label: "International", value: "international" },
];
const ACTIVITY_OPTIONS = [
  "Football", "Swimming", "Basketball", "Robotics",
  "Art Club", "Drama", "Debate Club", "Music",
  "Quran Memorisation", "Science Fair", "MUN", "Chess",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <Text style={[sectionStyles.title, { color: colors.foreground }]}>{children}</Text>
  );
}

const sectionStyles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "700", marginBottom: 12, marginTop: 4 },
});

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateUser } = useApp();

  const topPad = Platform.OS === "web" ? 67 : 0;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [children, setChildren] = useState<ChildProfile[]>([]);

  const [budget, setBudget] = useState(60000);
  const [curriculum, setCurriculum] = useState("Any");
  const [language, setLanguage] = useState("None");
  const [activities, setActivities] = useState<string[]>([]);
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [distance, setDistance] = useState(10);
  const [schoolType, setSchoolType] = useState("any");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateChildrenCount = (n: number) => {
    setChildrenCount(n);
    setChildren((prev) => {
      if (n > prev.length) {
        const extras: ChildProfile[] = Array.from({ length: n - prev.length }, () => ({
          name: "", birthdate: "", gender: "", grade: "",
        }));
        return [...prev, ...extras];
      }
      return prev.slice(0, n);
    });
  };

  const updateChild = (idx: number, field: keyof ChildProfile, value: string) => {
    setChildren((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const toggleActivity = (a: string) => {
    setActivities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password.trim() || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!city) { setError("Please select your city."); return; }
    if (!childrenCount) { setError("Please select the number of children."); return; }
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (!c.name.trim()) { setError(`Please enter Child ${i + 1}'s full name.`); return; }
      if (!c.birthdate.trim()) { setError(`Please enter Child ${i + 1}'s date of birth.`); return; }
      if (!c.gender) { setError(`Please select Child ${i + 1}'s gender.`); return; }
      if (!c.grade) { setError(`Please select Child ${i + 1}'s grade.`); return; }
    }

    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      updateUser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city,
        childrenCount,
        children,
        budgetMax: budget,
        preferredCurriculum: curriculum,
        preferredLanguage: language,
        preferredActivities: activities,
        specialNeeds,
        distanceMax: distance,
        preferredSchoolType: schoolType,
        isLoggedIn: true,
        hasCompletedOnboarding: true,
      });
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    }, 900);
  };

  const inputStyle = [
    styles.input,
    { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius },
  ];

  const pillStyle = (active: boolean) => [
    styles.pill,
    {
      backgroundColor: active ? colors.primary : colors.muted,
      borderColor: active ? colors.primary : colors.border,
    },
  ];

  const pillTextStyle = (active: boolean) => [
    styles.pillText,
    { color: active ? "#FFF" : colors.foreground },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + topPad + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.muted }]} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Create Account</Text>
          <View style={{ width: 36 }} />
        </View>

        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Join thousands of Saudi parents finding the right school
        </Text>

        {/* ── Section 1: Parent Info ─────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <SectionTitle>Your Details</SectionTitle>

          {/* Name */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Full Name *</Text>
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Ionicons name="person-outline" size={17} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputInner, { color: colors.foreground }]}
              placeholder="Your full name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Phone */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Phone Number *</Text>
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Ionicons name="call-outline" size={17} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputInner, { color: colors.foreground }]}
              placeholder="+966 5X XXX XXXX"
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Email Address *</Text>
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Ionicons name="mail-outline" size={17} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputInner, { color: colors.foreground }]}
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Password *</Text>
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Ionicons name="lock-closed-outline" size={17} color={colors.mutedForeground} />
            <TextInput
              style={[styles.inputInner, { color: colors.foreground }]}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={17} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* City */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>City *</Text>
          <View style={styles.pillRow}>
            {CITIES.map((c) => (
              <TouchableOpacity key={c} onPress={() => setCity(c)} style={pillStyle(city === c)}>
                <Text style={pillTextStyle(city === c)}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Number of children */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Number of Children *</Text>
          <View style={styles.pillRow}>
            {CHILDREN_COUNTS.map((n) => (
              <TouchableOpacity key={n} onPress={() => updateChildrenCount(n)} style={pillStyle(childrenCount === n)}>
                <Text style={pillTextStyle(childrenCount === n)}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Section 2: Children Details ───────────────────────────────── */}
        {children.map((child, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <SectionTitle>Child {idx + 1}</SectionTitle>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Full Name *</Text>
            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
              <Ionicons name="person-outline" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.inputInner, { color: colors.foreground }]}
                placeholder="Child's full name"
                placeholderTextColor={colors.mutedForeground}
                value={child.name}
                onChangeText={(v) => updateChild(idx, "name", v)}
                autoCapitalize="words"
              />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Date of Birth *</Text>
            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}>
              <Ionicons name="calendar-outline" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.inputInner, { color: colors.foreground }]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.mutedForeground}
                value={child.birthdate}
                onChangeText={(v) => updateChild(idx, "birthdate", v)}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Gender *</Text>
            <View style={styles.pillRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity key={g} onPress={() => updateChild(idx, "gender", g)} style={pillStyle(child.gender === g)}>
                  <Text style={pillTextStyle(child.gender === g)}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Current Grade *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              <View style={[styles.pillRow, { flexWrap: "nowrap", paddingHorizontal: 4 }]}>
                {GRADES.map((g) => (
                  <TouchableOpacity key={g} onPress={() => updateChild(idx, "grade", g)} style={pillStyle(child.grade === g)}>
                    <Text style={pillTextStyle(child.grade === g)}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}

        {/* ── Section 3: School Preferences ─────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <SectionTitle>School Preferences</SectionTitle>

          {/* Budget */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Annual Budget</Text>
          <View style={styles.pillRow}>
            {BUDGET_OPTIONS.map((b) => (
              <TouchableOpacity key={b.value} onPress={() => setBudget(b.value)} style={pillStyle(budget === b.value)}>
                <Text style={pillTextStyle(budget === b.value)}>{b.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Curriculum */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Preferred Curriculum</Text>
          <View style={styles.pillRow}>
            {CURRICULA.map((c) => (
              <TouchableOpacity key={c} onPress={() => setCurriculum(c)} style={pillStyle(curriculum === c)}>
                <Text style={pillTextStyle(curriculum === c)}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Language */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Additional Language</Text>
          <View style={styles.pillRow}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity key={l} onPress={() => setLanguage(l)} style={pillStyle(language === l)}>
                <Text style={pillTextStyle(language === l)}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* School Type */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>School Type</Text>
          <View style={styles.pillRow}>
            {SCHOOL_TYPES.map((t) => (
              <TouchableOpacity key={t.value} onPress={() => setSchoolType(t.value)} style={pillStyle(schoolType === t.value)}>
                <Text style={pillTextStyle(schoolType === t.value)}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Distance */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Max Distance from Home</Text>
          <View style={styles.pillRow}>
            {DISTANCE_OPTIONS.map((d) => (
              <TouchableOpacity key={d.value} onPress={() => setDistance(d.value)} style={pillStyle(distance === d.value)}>
                <Text style={pillTextStyle(distance === d.value)}>{d.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Activities */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Preferred Activities</Text>
          <View style={styles.pillRow}>
            {ACTIVITY_OPTIONS.map((a) => (
              <TouchableOpacity key={a} onPress={() => toggleActivity(a)} style={pillStyle(activities.includes(a))}>
                <Text style={pillTextStyle(activities.includes(a))}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Needs */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchLabel, { color: colors.foreground }]}>Special Needs Support</Text>
              <Text style={[styles.switchSub, { color: colors.mutedForeground }]}>Only show schools with dedicated support</Text>
            </View>
            <Switch
              value={specialNeeds}
              onValueChange={setSpecialNeeds}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Error */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#FEE2E2", borderRadius: 8 }]}>
            <Ionicons name="warning-outline" size={14} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.submitBtn, { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: loading ? 0.8 : 1 }]}
        >
          <Text style={styles.submitBtnText}>{loading ? "Creating Account…" : "Create Account"}</Text>
        </TouchableOpacity>

        {/* Log In link */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 0 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  subtitle: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  card: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 4,
  },
  label: { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderWidth: 1,
    gap: 8,
  },
  inputInner: { flex: 1, fontSize: 15 },
  input: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 13, fontSize: 15 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  pillText: { fontSize: 13, fontWeight: "600" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 },
  switchLabel: { fontSize: 14, fontWeight: "600" },
  switchSub: { fontSize: 12, marginTop: 2 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: 12, marginBottom: 12 },
  errorText: { color: "#DC2626", fontSize: 13, flex: 1 },
  submitBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 8 },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: "700" },
});
