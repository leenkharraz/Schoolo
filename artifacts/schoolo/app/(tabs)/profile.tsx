import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
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

import { type Booking, useApp } from "@/context/AppContext";
import { getScheduleSlots, type AppointmentSlot } from "@/data/reviews";
import { useColors } from "@/hooks/useColors";
import { useAppearanceMode, type AppearanceMode } from "@/store/theme";

const ACCOUNT_CITIES = ["Jeddah", "Riyadh", "Dammam"];
const CURRICULA = ["Any", "Saudi National", "British", "American", "IB", "Indian"];
const PREF_LANGUAGES = ["None", "French", "Spanish", "Mandarin", "German", "Portuguese"];
const ACTIVITIES = ["Football", "Basketball", "Swimming", "Tennis", "Arts & Crafts", "Music", "Drama", "Robotics", "Chess", "Coding", "Quran"];
const GRADES = ["KG1", "KG2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SCHOOL_TYPES = ["any", "private", "international"];
const DISTANCES = [2, 5, 10, 20, 50];
const APP_LANGUAGES = ["English", "Arabic", "Hindi", "French", "Spanish"];

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

function StatusBadge({ status }: { status: Booking["status"] }) {
  const colors = useColors();
  const map = {
    upcoming: { bg: "#EEF9EE", text: "#16a34a", label: "Upcoming" },
    updated: { bg: "#EEF5FF", text: "#2563eb", label: "Updated" },
    cancelled: { bg: "#FEE2E2", text: "#dc2626", label: "Cancelled" },
    completed: { bg: colors.muted, text: colors.mutedForeground, label: "Completed" },
  };
  const s = map[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.statusBadgeText, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser, bookings, cancelBooking, updateBooking, appLanguage, setAppLanguage } = useApp();
  const [appearanceMode, setAppearanceMode] = useAppearanceMode();
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [activeBookingTab, setActiveBookingTab] = useState<"upcoming" | "past">("upcoming");
  const [modifyBookingId, setModifyBookingId] = useState<string | null>(null);
  const [modifySlot, setModifySlot] = useState<AppointmentSlot | null>(null);

  const scheduleSlots = getScheduleSlots();

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

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming" || b.status === "updated");
  const pastBookings = bookings.filter((b) => b.status === "cancelled" || b.status === "completed");
  const displayedBookings = activeBookingTab === "upcoming" ? upcomingBookings : pastBookings;

  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleConfirmModify = () => {
    if (modifyBookingId && modifySlot) {
      updateBooking(modifyBookingId, {
        date: modifySlot.date,
        time: modifySlot.time,
        status: "updated",
      });
      setModifyBookingId(null);
      setModifySlot(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const appearanceOptions: { value: AppearanceMode; label: string; icon: string }[] = [
    { value: "light", label: "Light", icon: "sunny-outline" },
    { value: "dark", label: "Dark", icon: "moon-outline" },
    { value: "device", label: "Device", icon: "phone-portrait-outline" },
  ];

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

        {/* ── ACCOUNT ─────────────────────────────────────────────────────── */}
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
              <View style={styles.pillRow}>
                {ACCOUNT_CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    onPress={() => setDraft((p) => ({ ...p, city }))}
                    style={[styles.pill, { backgroundColor: draft.city === city ? colors.primary : colors.muted, borderRadius: 999 }]}
                  >
                    <Text style={[styles.pillText, { color: draft.city === city ? "#FFF" : colors.foreground }]}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={[styles.fieldText, { color: colors.foreground }]}>{user.city}</Text>
            )}
          </FieldRow>
        </View>

        {/* ── SCHOOL PREFERENCES ──────────────────────────────────────────── */}
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
                  {PREF_LANGUAGES.map((l) => (
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
                        backgroundColor: draft.preferredActivities.includes(act) ? colors.muted : colors.muted,
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

        {/* ── BOOKINGS ─────────────────────────────────────────────────────── */}
        <SectionHeader title="BOOKINGS" icon="calendar-outline" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, overflow: "hidden" }]}>
          <View style={[styles.tabRow, { backgroundColor: colors.muted }]}>
            {(["upcoming", "past"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveBookingTab(tab)}
                style={[styles.tabBtn, { backgroundColor: activeBookingTab === tab ? colors.card : "transparent", borderRadius: colors.radius - 4 }]}
              >
                <Text style={[styles.tabBtnText, { color: activeBookingTab === tab ? colors.foreground : colors.mutedForeground, fontWeight: activeBookingTab === tab ? "700" : "500" }]}>
                  {tab === "upcoming" ? `Upcoming (${upcomingBookings.length})` : `Past (${pastBookings.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {displayedBookings.length === 0 ? (
            <View style={styles.emptyBookings}>
              <Ionicons name="calendar-outline" size={32} color={colors.border} />
              <Text style={[styles.emptyBookingsText, { color: colors.mutedForeground }]}>
                {activeBookingTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
              </Text>
            </View>
          ) : (
            displayedBookings.map((booking, idx) => (
              <View
                key={booking.id}
                style={[
                  styles.bookingCard,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: idx < displayedBookings.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <View style={styles.bookingCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bookingSchoolName, { color: colors.foreground }]} numberOfLines={1}>{booking.schoolName}</Text>
                    <View style={styles.bookingTypeBadgeRow}>
                      <View style={[styles.bookingTypeBadge, { backgroundColor: booking.type === "visit" ? "#EEF5FF" : "#FEF0E0" }]}>
                        <Ionicons name={booking.type === "visit" ? "eye-outline" : "document-text-outline"} size={11} color={booking.type === "visit" ? "#2563eb" : colors.primary} />
                        <Text style={[styles.bookingTypeBadgeText, { color: booking.type === "visit" ? "#2563eb" : colors.primary }]}>
                          {booking.type === "visit" ? "School Visit" : "Placement Test"}
                        </Text>
                      </View>
                      <StatusBadge status={booking.status} />
                    </View>
                  </View>
                </View>
                <View style={styles.bookingMeta}>
                  <View style={styles.bookingMetaItem}>
                    <Ionicons name="calendar-outline" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.bookingMetaText, { color: colors.mutedForeground }]}>{booking.date}</Text>
                  </View>
                  <View style={styles.bookingMetaItem}>
                    <Ionicons name="time-outline" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.bookingMetaText, { color: colors.mutedForeground }]}>{booking.time}</Text>
                  </View>
                </View>
                {(booking.status === "upcoming" || booking.status === "updated") && (
                  <View style={styles.bookingActions}>
                    <TouchableOpacity
                      onPress={() => { setModifyBookingId(booking.id); setModifySlot(null); }}
                      style={[styles.bookingActionBtn, { backgroundColor: colors.muted, borderRadius: 8 }]}
                    >
                      <Ionicons name="create-outline" size={14} color={colors.foreground} />
                      <Text style={[styles.bookingActionText, { color: colors.foreground }]}>Modify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCancelBooking(booking.id)}
                      style={[styles.bookingActionBtn, { backgroundColor: "#FEE2E2", borderRadius: 8 }]}
                    >
                      <Ionicons name="close-circle-outline" size={14} color="#dc2626" />
                      <Text style={[styles.bookingActionText, { color: "#dc2626" }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* ── SETTINGS ─────────────────────────────────────────────────────── */}
        <SectionHeader title="SETTINGS" icon="settings-outline" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>

          {/* Appearance */}
          <View style={[styles.settingsRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="contrast-outline" size={16} color={colors.primary} />
              <Text style={[styles.settingsLabel, { color: colors.foreground }]}>Appearance</Text>
            </View>
            <View style={styles.appearanceOptions}>
              {appearanceOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => { setAppearanceMode(opt.value); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={[
                    styles.appearanceBtn,
                    {
                      backgroundColor: appearanceMode === opt.value ? colors.primary : colors.muted,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Ionicons name={opt.icon as any} size={13} color={appearanceMode === opt.value ? "#FFF" : colors.mutedForeground} />
                  <Text style={[styles.appearanceBtnText, { color: appearanceMode === opt.value ? "#FFF" : colors.foreground }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Language */}
          <View style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Ionicons name="language-outline" size={16} color={colors.primary} />
              <Text style={[styles.settingsLabel, { color: colors.foreground }]}>Language</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.langOptions}>
                {APP_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => { setAppLanguage(lang); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={[
                      styles.langBtn,
                      {
                        backgroundColor: appLanguage === lang ? colors.primary : colors.muted,
                        borderRadius: 999,
                      },
                    ]}
                  >
                    <Text style={[styles.langBtnText, { color: appLanguage === lang ? "#FFF" : colors.foreground }]}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Fit Score card */}
        <View style={[styles.fitCard, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.fitCardHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={[styles.fitCardTitle, { color: colors.primary }]}>How School Fit Score works</Text>
          </View>
          <Text style={[styles.fitCardBody, { color: colors.foreground }]}>
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

      {/* ── Modify Booking Modal ─────────────────────────────────────────── */}
      <Modal visible={!!modifyBookingId} transparent animationType="slide" onRequestClose={() => setModifyBookingId(null)}>
        <View style={styles.sheetOverlay}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Modify Booking</Text>
              <TouchableOpacity onPress={() => setModifyBookingId(null)}>
                <Ionicons name="close" size={22} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 8 }}>
              <Text style={[styles.slotSubtitle, { color: colors.mutedForeground }]}>Choose a new date and time:</Text>
              {scheduleSlots.map((slot) => {
                const isSelected = modifySlot?.date === slot.date && modifySlot?.time === slot.time;
                return (
                  <TouchableOpacity
                    key={`${slot.date}-${slot.time}`}
                    onPress={() => { setModifySlot(slot); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={[
                      styles.slotRow,
                      {
                        backgroundColor: isSelected ? colors.muted : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                        borderRadius: 12,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.slotDate, { color: colors.foreground }]}>{slot.date}</Text>
                      <Text style={[styles.slotTime, { color: colors.mutedForeground }]}>{slot.time}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={handleConfirmModify}
                disabled={!modifySlot}
                style={[styles.ctaPrimary, { backgroundColor: modifySlot ? colors.primary : colors.border, borderRadius: colors.radius, marginTop: 8 }]}
              >
                <Text style={styles.ctaPrimaryText}>Confirm New Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // Bookings
  tabRow: { flexDirection: "row", padding: 4, margin: 12, borderRadius: 12 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: "center" },
  tabBtnText: { fontSize: 13 },
  emptyBookings: { alignItems: "center", paddingVertical: 32, gap: 10 },
  emptyBookingsText: { fontSize: 14 },
  bookingCard: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  bookingCardTop: { flexDirection: "row", alignItems: "flex-start" },
  bookingSchoolName: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  bookingTypeBadgeRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  bookingTypeBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  bookingTypeBadgeText: { fontSize: 11, fontWeight: "600" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  bookingMeta: { flexDirection: "row", gap: 16 },
  bookingMetaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  bookingMetaText: { fontSize: 13 },
  bookingActions: { flexDirection: "row", gap: 8 },
  bookingActionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 8 },
  bookingActionText: { fontSize: 13, fontWeight: "600" },
  // Settings
  settingsRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  settingsRowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingsLabel: { fontSize: 14, fontWeight: "600" },
  appearanceOptions: { flexDirection: "row", gap: 6 },
  appearanceBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 8 },
  appearanceBtnText: { fontSize: 12, fontWeight: "600" },
  langOptions: { flexDirection: "row", gap: 8 },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7 },
  langBtnText: { fontSize: 13, fontWeight: "600" },
  // Fit card
  fitCard: { marginTop: 20, padding: 16, borderWidth: 1, gap: 8 },
  fitCardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  fitCardTitle: { fontSize: 14, fontWeight: "700" },
  fitCardBody: { fontSize: 13, lineHeight: 19 },
  // Logout
  logoutBtn: { marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderWidth: 1 },
  logoutText: { fontSize: 15, fontWeight: "600" },
  // Modify modal
  sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "85%", paddingBottom: 32 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  sheetTitle: { fontSize: 18, fontWeight: "700" },
  slotSubtitle: { fontSize: 13, marginBottom: 4 },
  slotRow: { borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center" },
  slotDate: { fontSize: 14, fontWeight: "600" },
  slotTime: { fontSize: 13, marginTop: 2 },
  ctaPrimary: { paddingVertical: 14, alignItems: "center" },
  ctaPrimaryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
