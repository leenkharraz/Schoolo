import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar"];
const GRADES = ["KG1", "KG2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const CURRICULA = ["Any", "Saudi National", "British", "American", "IB", "Indian"];
const LANGUAGES = ["None", "French", "Spanish", "Mandarin", "German", "Portuguese"];
const ACTIVITIES = ["Football", "Basketball", "Swimming", "Tennis", "Cricket", "Badminton", "Arts & Crafts", "Music", "Drama", "Robotics", "Chess", "Quran Memorisation", "Coding", "Science Club", "MUN"];
const SCHOOL_TYPES = [
  { id: "any", label: "Any", icon: "apps-outline" },
  { id: "private", label: "Private", icon: "school-outline" },
  { id: "international", label: "International", icon: "globe-outline" },
];
const DISTANCES = [
  { value: 2, label: "< 2 km", sub: "Walking distance" },
  { value: 5, label: "< 5 km", sub: "Short drive" },
  { value: 10, label: "< 10 km", sub: "Moderate drive" },
  { value: 20, label: "< 20 km", sub: "Any area" },
  { value: 50, label: "Any", sub: "No limit" },
];
const BUDGETS = [
  { value: 20000, label: "Up to SAR 20K", sub: "Budget friendly" },
  { value: 40000, label: "Up to SAR 40K", sub: "Moderate" },
  { value: 60000, label: "Up to SAR 60K", sub: "Mid-range" },
  { value: 80000, label: "Up to SAR 80K", sub: "Premium" },
  { value: 120000, label: "SAR 80K+", sub: "Elite" },
];
const AGES = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

interface Step {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
}

const STEPS: Step[] = [
  { key: "city", title: "Which city are you in?", subtitle: "We'll show you the most relevant schools", icon: "location-outline" },
  { key: "age", title: "Your child's age & grade", subtitle: "This helps us find age-appropriate schools", icon: "people-outline" },
  { key: "budget", title: "Annual school budget", subtitle: "Select your comfortable yearly spend on fees", icon: "wallet-outline" },
  { key: "curriculum", title: "Preferred curriculum", subtitle: "Choose the educational system that fits your goals", icon: "book-outline" },
  { key: "language", title: "Preferred third language", subtitle: "Beyond Arabic and English", icon: "language-outline" },
  { key: "activities", title: "Preferred activities", subtitle: "Select all activities you'd like the school to offer", icon: "trophy-outline" },
  { key: "specialNeeds", title: "Special Needs Support", subtitle: "Do you require specialist learning support?", icon: "heart-circle-outline" },
  { key: "distance", title: "Maximum distance from home", subtitle: "How far are you willing to travel?", icon: "navigate-outline" },
  { key: "schoolType", title: "School type preference", subtitle: "Choose your preferred school category", icon: "business-outline" },
];

function OptionChip({
  label,
  selected,
  onPress,
  sub,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  sub?: string;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={() => { onPress(); Haptics.selectionAsync(); }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          borderRadius: 12,
        },
      ]}
    >
      {selected && <Ionicons name="checkmark-circle" size={15} color="#FFF" />}
      <View>
        <Text style={[styles.chipLabel, { color: selected ? "#FFF" : colors.foreground }]}>{label}</Text>
        {sub && <Text style={[styles.chipSub, { color: selected ? "rgba(255,255,255,0.8)" : colors.mutedForeground }]}>{sub}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateUser } = useApp();
  const topPad = Platform.OS === "web" ? 67 : 0;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    city: "Riyadh",
    childAge: 8,
    childGrade: "Grade 3",
    budgetMax: 60000,
    preferredCurriculum: "Any",
    preferredLanguage: "None",
    preferredActivities: [] as string[],
    specialNeeds: false,
    distanceMax: 10,
    preferredSchoolType: "any",
  });

  const currentStep = STEPS[step];
  const progress = (step + 1) / STEPS.length;

  const progressWidth = useSharedValue(progress);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const goNext = () => {
    if (step < STEPS.length - 1) {
      progressWidth.value = withSpring((step + 2) / STEPS.length);
      setStep((s) => s + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      handleFinish();
    }
  };

  const goBack = () => {
    if (step > 0) {
      progressWidth.value = withSpring(step / STEPS.length);
      setStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  const handleFinish = () => {
    updateUser({ ...answers, hasCompletedOnboarding: true });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/");
  };

  const setActivity = (act: string) => {
    setAnswers((prev) => {
      const exists = prev.preferredActivities.includes(act);
      return {
        ...prev,
        preferredActivities: exists
          ? prev.preferredActivities.filter((a) => a !== act)
          : [...prev.preferredActivities, act],
      };
    });
  };

  const renderStepContent = () => {
    switch (currentStep.key) {
      case "city":
        return (
          <View style={styles.optionsGrid}>
            {CITIES.map((c) => (
              <OptionChip
                key={c}
                label={c}
                selected={answers.city === c}
                onPress={() => setAnswers((p) => ({ ...p, city: c }))}
              />
            ))}
          </View>
        );

      case "age":
        return (
          <View style={{ gap: 20 }}>
            <View>
              <Text style={[styles.subLabel, { color: colors.mutedForeground }]}>Child's Age</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.ageRow}>
                  {AGES.map((age) => (
                    <TouchableOpacity
                      key={age}
                      onPress={() => { setAnswers((p) => ({ ...p, childAge: age })); Haptics.selectionAsync(); }}
                      style={[
                        styles.ageChip,
                        {
                          backgroundColor: answers.childAge === age ? colors.primary : colors.card,
                          borderColor: answers.childAge === age ? colors.primary : colors.border,
                          borderRadius: 10,
                        },
                      ]}
                    >
                      <Text style={[styles.ageText, { color: answers.childAge === age ? "#FFF" : colors.foreground }]}>
                        {age}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View>
              <Text style={[styles.subLabel, { color: colors.mutedForeground }]}>Current Grade / Year</Text>
              <View style={styles.optionsGrid}>
                {GRADES.map((g) => (
                  <OptionChip
                    key={g}
                    label={g}
                    selected={answers.childGrade === g}
                    onPress={() => setAnswers((p) => ({ ...p, childGrade: g }))}
                  />
                ))}
              </View>
            </View>
          </View>
        );

      case "budget":
        return (
          <View style={{ gap: 10 }}>
            {BUDGETS.map((b) => (
              <OptionChip
                key={b.value}
                label={b.label}
                sub={b.sub}
                selected={answers.budgetMax === b.value}
                onPress={() => setAnswers((p) => ({ ...p, budgetMax: b.value }))}
              />
            ))}
          </View>
        );

      case "curriculum":
        return (
          <View style={styles.optionsGrid}>
            {CURRICULA.map((c) => (
              <OptionChip
                key={c}
                label={c}
                selected={answers.preferredCurriculum === c}
                onPress={() => setAnswers((p) => ({ ...p, preferredCurriculum: c }))}
              />
            ))}
          </View>
        );

      case "language":
        return (
          <View style={styles.optionsGrid}>
            {LANGUAGES.map((l) => (
              <OptionChip
                key={l}
                label={l}
                selected={answers.preferredLanguage === l}
                onPress={() => setAnswers((p) => ({ ...p, preferredLanguage: l }))}
              />
            ))}
          </View>
        );

      case "activities":
        return (
          <View style={{ gap: 6 }}>
            <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
              Select all that apply ({answers.preferredActivities.length} selected)
            </Text>
            <View style={styles.optionsGrid}>
              {ACTIVITIES.map((a) => (
                <OptionChip
                  key={a}
                  label={a}
                  selected={answers.preferredActivities.includes(a)}
                  onPress={() => setActivity(a)}
                />
              ))}
            </View>
          </View>
        );

      case "specialNeeds":
        return (
          <View style={{ gap: 14 }}>
            {[
              { value: false, label: "No, not required", sub: "Standard education", icon: "checkmark-circle-outline" },
              { value: true, label: "Yes, required", sub: "Show schools with dedicated support", icon: "heart-circle-outline" },
            ].map((opt) => (
              <TouchableOpacity
                key={String(opt.value)}
                onPress={() => { setAnswers((p) => ({ ...p, specialNeeds: opt.value })); Haptics.selectionAsync(); }}
                style={[
                  styles.bigOption,
                  {
                    backgroundColor: answers.specialNeeds === opt.value ? "#FEF0E0" : colors.card,
                    borderColor: answers.specialNeeds === opt.value ? colors.primary : colors.border,
                    borderRadius: 14,
                  },
                ]}
              >
                <Ionicons name={opt.icon as any} size={28} color={answers.specialNeeds === opt.value ? colors.primary : colors.mutedForeground} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bigOptionLabel, { color: answers.specialNeeds === opt.value ? colors.foreground : colors.foreground }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.bigOptionSub, { color: colors.mutedForeground }]}>{opt.sub}</Text>
                </View>
                {answers.specialNeeds === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case "distance":
        return (
          <View style={{ gap: 10 }}>
            {DISTANCES.map((d) => (
              <OptionChip
                key={d.value}
                label={d.label}
                sub={d.sub}
                selected={answers.distanceMax === d.value}
                onPress={() => setAnswers((p) => ({ ...p, distanceMax: d.value }))}
              />
            ))}
          </View>
        );

      case "schoolType":
        return (
          <View style={{ gap: 14 }}>
            {SCHOOL_TYPES.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => { setAnswers((p) => ({ ...p, preferredSchoolType: t.id })); Haptics.selectionAsync(); }}
                style={[
                  styles.bigOption,
                  {
                    backgroundColor: answers.preferredSchoolType === t.id ? "#FEF0E0" : colors.card,
                    borderColor: answers.preferredSchoolType === t.id ? colors.primary : colors.border,
                    borderRadius: 14,
                  },
                ]}
              >
                <Ionicons name={t.icon as any} size={28} color={answers.preferredSchoolType === t.id ? colors.primary : colors.mutedForeground} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bigOptionLabel, { color: colors.foreground }]}>{t.label}</Text>
                </View>
                {answers.preferredSchoolType === t.id && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + topPad + 12 }]}>
        <TouchableOpacity onPress={goBack} style={[styles.backBtn, { backgroundColor: colors.muted, borderRadius: 999 }]}>
          <Ionicons name="arrow-back" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.stepCounter, { color: colors.mutedForeground }]}>
            Step {step + 1} of {STEPS.length}
          </Text>
        </View>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.progressFill, { backgroundColor: colors.primary }, progressStyle]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutLeft.duration(180)} key={step}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepIcon, { backgroundColor: "#FEF0E0" }]}>
              <Ionicons name={currentStep.icon as any} size={26} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{currentStep.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{currentStep.subtitle}</Text>
          </View>
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Navigation */}
      <View style={[styles.navBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          onPress={goNext}
          style={[styles.nextBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Text style={styles.nextBtnText}>
            {step === STEPS.length - 1 ? "Find My Schools ✨" : "Continue"}
          </Text>
          {step < STEPS.length - 1 && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  stepCounter: { fontSize: 13, fontWeight: "500" },
  skipText: { fontSize: 13, fontWeight: "500" },
  progressTrack: { height: 4, marginHorizontal: 20, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 0 },
  stepHeader: { alignItems: "center", gap: 8, marginBottom: 28 },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepTitle: { fontSize: 24, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  stepSub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  chipLabel: { fontSize: 14, fontWeight: "600" },
  chipSub: { fontSize: 11, marginTop: 1 },
  subLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 },
  ageRow: { flexDirection: "row", gap: 8 },
  ageChip: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  ageText: { fontSize: 14, fontWeight: "700" },
  bigOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderWidth: 2,
  },
  bigOptionLabel: { fontSize: 16, fontWeight: "700" },
  bigOptionSub: { fontSize: 13, marginTop: 2 },
  helpText: { fontSize: 13 },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  nextBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
