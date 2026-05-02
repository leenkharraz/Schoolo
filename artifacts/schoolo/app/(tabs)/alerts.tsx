import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, type Alert } from "@/context/AppContext";
import { getSchoolById } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

const ALERT_ICONS: Record<Alert["type"], { name: string; color: string; bg: string }> = {
  open_day: { name: "calendar", color: "#32667F", bg: "#EEF5FA" },
  deadline: { name: "clock", color: "#EA8B33", bg: "#FEF1E3" },
  match: { name: "sparkles", color: "#22c55e", bg: "#EDFBF3" },
  fee_update: { name: "trending-up", color: "#EAA23A", bg: "#FEF7E7" },
  new_school: { name: "star", color: "#F3B940", bg: "#FFFBEB" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  return `${days}d ago`;
}

function AlertCard({ alert }: { alert: Alert }) {
  const colors = useColors();
  const router = useRouter();
  const { markAlertRead } = useApp();
  const meta = ALERT_ICONS[alert.type];
  const school = alert.schoolId ? getSchoolById(alert.schoolId) : null;

  const handlePress = () => {
    markAlertRead(alert.id);
    if (alert.schoolId) {
      router.push(`/school/${alert.schoolId}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[
        styles.alertCard,
        {
          backgroundColor: alert.read ? colors.card : colors.muted,
          borderRadius: colors.radius,
          borderColor: colors.border,
          borderLeftColor: alert.read ? colors.border : colors.primary,
        },
      ]}
    >
      <View style={[styles.alertIcon, { backgroundColor: meta.bg, borderRadius: 12 }]}>
        <Feather name={meta.name as any} size={18} color={meta.color} />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertTitleRow}>
          <Text
            style={[
              styles.alertTitle,
              { color: colors.foreground, fontWeight: alert.read ? "600" : "700" },
            ]}
            numberOfLines={1}
          >
            {alert.title}
          </Text>
          {!alert.read && (
            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text style={[styles.alertBody, { color: colors.mutedForeground }]} numberOfLines={2}>
          {alert.body}
        </Text>
        <View style={styles.alertFooter}>
          {school && (
            <Text style={[styles.alertSchool, { color: colors.secondary }]}>
              {school.name}
            </Text>
          )}
          <Text style={[styles.alertTime, { color: colors.mutedForeground }]}>
            {timeAgo(alert.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { alerts, unreadAlertCount } = useApp();
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const unread = alerts.filter((a) => !a.read);
  const read = alerts.filter((a) => a.read);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top + topPaddingWeb + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Alerts</Text>
          {unreadAlertCount > 0 && (
            <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
              {unreadAlertCount} unread notification{unreadAlertCount !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <View style={[styles.headerBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="notifications" size={16} color="#FFF" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        {unread.length > 0 && (
          <>
            <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>NEW</Text>
            {unread.map((a) => <AlertCard key={a.id} alert={a} />)}
          </>
        )}
        {read.length > 0 && (
          <>
            <Text style={[styles.groupLabel, { color: colors.mutedForeground, marginTop: 20 }]}>EARLIER</Text>
            {read.map((a) => <AlertCard key={a.id} alert={a} />)}
          </>
        )}
        {alerts.length === 0 && (
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              No alerts yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              We'll notify you about new schools, deadlines, and open days.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 20, gap: 10 },
  groupLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 },
  alertCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  alertIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  alertContent: { flex: 1, gap: 3 },
  alertTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  alertTitle: { flex: 1, fontSize: 14 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  alertBody: { fontSize: 13, lineHeight: 18 },
  alertFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  alertSchool: { fontSize: 12, fontWeight: "600" },
  alertTime: { fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "600" },
  emptySub: { fontSize: 14, textAlign: "center", paddingHorizontal: 40, lineHeight: 20 },
});
