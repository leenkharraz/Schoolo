import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, type ChatMessage } from "@/context/AppContext";
import { SCHOOLS } from "@/data/schools";
import { useColors } from "@/hooks/useColors";

const QUICK_CHIPS = [
  "What is the best school for my budget?",
  "Which school is closest to me?",
  "Does this school support special needs?",
  "What are the school fees?",
  "Can I book a school visit?",
  "What curriculum does this school offer?",
  "Schools with siblings discount",
  "British curriculum under SAR 60K",
];

function generateResponse(text: string, userName: string, budgetMax: number, city: string, specialNeeds: boolean): string {
  const lower = text.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("مرحبا")) {
    return `Hello${userName ? ` ${userName}` : ""}! I'm Schoolo's AI advisor. I can help you find the perfect school in ${city || "Saudi Arabia"}. What are your priorities — budget, curriculum, location, or special features?`;
  }

  if (lower.includes("book") || lower.includes("visit") || lower.includes("appointment") || lower.includes("schedule")) {
    const topSchool = SCHOOLS[0];
    return `To book a school visit, open any school's profile and tap the **"Schedule Visit"** button in the school detail screen.\n\nI recommend starting with:\n• **${topSchool.name}** — open days are typically held on Sundays and Mondays between 9AM–12PM.\n\nWould you like me to find the schools with the most upcoming open days?`;
  }

  if (lower.includes("sibling") || lower.includes("discount")) {
    const schools = SCHOOLS.filter((s) => s.siblingsDiscount).slice(0, 4);
    return `Great news — ${schools.length} schools offer siblings discounts:\n\n${schools.map((s) => `• **${s.name}** — ${s.siblingsDiscountPercent}% off for siblings`).join("\n")}\n\nThe best deal is at Indian International School Riyadh (30% off). Want to see the full cost breakdown for enrolling two children?`;
  }

  if (lower.includes("special need") || lower.includes("learning support") || lower.includes("disability")) {
    const schools = SCHOOLS.filter((s) => s.specialNeeds);
    return `Schools with dedicated **Special Needs Support** in our database:\n\n${schools.map((s) => `• **${s.name}** — ${s.curriculum} curriculum, ${s.location.city}`).join("\n")}\n\nI recommend calling each school to discuss your child's specific requirements, as support programmes vary. All these schools have a dedicated learning support department. Would you like their contact details?`;
  }

  if (lower.includes("british") || lower.includes("igcse") || lower.includes("a-level")) {
    const schools = SCHOOLS.filter((s) => s.curriculum === "British");
    return `I found ${schools.length} **British curriculum** schools for you:\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.rating}⭐ · ${s.location.city}`).join("\n")}\n\nBritish schools offer IGCSE and A-Level pathways recognised by UK, US, and international universities. Which city are you looking in?`;
  }

  if (lower.includes("american") || lower.includes("ap ") || lower.includes("ap course")) {
    const schools = SCHOOLS.filter((s) => s.curriculum === "American");
    return `Here are the **American curriculum** schools:\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.rating}⭐`).join("\n")}\n\nAmerican schools offer Advanced Placement (AP) courses and prepare students for US university admissions.`;
  }

  if (lower.includes("ib") || lower.includes("international baccalaureate")) {
    return `For the **IB (International Baccalaureate)** curriculum, King's International School in Riyadh is the top choice:\n\n• **King's International School** — SAR 55,000/yr · 4.6⭐\n  Full IB continuum: PYP → MYP → Diploma\n  Recognised by 2,000+ universities in 75 countries\n\nShall I tell you more about their fees, facilities, or how to apply?`;
  }

  if (lower.includes("curriculum") || lower.includes("offer")) {
    return `Saudi schools offer several curricula:\n\n📚 **Saudi National** — Arabic/Islamic focus, affordable (SAR 18K–22K/yr)\n🇬🇧 **British** — IGCSE & A-Levels (SAR 72K–78K/yr)\n🇺🇸 **American** — AP courses, US university prep (SAR 38K–68K/yr)\n🌍 **IB** — International Baccalaureate, global recognition (SAR 55K/yr)\n🇮🇳 **Indian (CBSE)** — Affordable, large community (SAR 15K/yr)\n\nWhich curriculum interests you most?`;
  }

  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable") || lower.includes("best school for my budget")) {
    const myBudget = budgetMax || 70000;
    const affordable = SCHOOLS.filter((s) => s.fees.tuition <= myBudget).sort((a, b) => b.fitScore - a.fitScore).slice(0, 4);
    return `Based on your budget of **SAR ${myBudget.toLocaleString()}/year**, here are the best matches:\n\n${affordable.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.fitScore}% match · ${s.rating}⭐`).join("\n")}\n\nNote: Total annual cost including transport & activities is typically 20–30% higher than tuition alone.`;
  }

  if (lower.includes("near") || lower.includes("closest") || lower.includes("distance") || lower.includes("closest to me")) {
    const nearest = [...SCHOOLS].sort((a, b) => a.location.distance - b.location.distance).slice(0, 4);
    return `The **closest schools** to your location in ${city || "Riyadh"}:\n\n${nearest.map((s) => `• **${s.name}** — 📍 ${s.location.distance} km away · ${s.curriculum}`).join("\n")}\n\nThe nearest is **${nearest[0].name}** at just ${nearest[0].location.distance} km. Would you like directions or to book a visit?`;
  }

  if (lower.includes("fee") || lower.includes("cost") || lower.includes("price") || lower.includes("how much")) {
    const myBudget = budgetMax || 70000;
    return `Here's a quick fee breakdown for our top schools:\n\n• **SAR 15K–25K/yr**: Saudi National & Indian curriculum\n• **SAR 38K–55K/yr**: American & IB curriculum\n• **SAR 65K–80K/yr**: Premium American & British\n\nTotal annual cost (tuition + transport + uniform + activities) is typically:\n• Budget: SAR 22K–35K\n• Mid-range: SAR 50K–70K\n• Premium: SAR 85K–110K\n\nYour current budget is set to **SAR ${myBudget.toLocaleString()}**. Want me to find matching schools?`;
  }

  if (lower.includes("jeddah")) {
    const schools = SCHOOLS.filter((s) => s.location.city === "Jeddah");
    return `Schools available in **Jeddah** (${schools.length} found):\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.curriculum} · ${s.rating}⭐`).join("\n")}\n\nJeddah has excellent American and British international schools. Which curriculum interests you?`;
  }

  if (lower.includes("riyadh")) {
    const schools = SCHOOLS.filter((s) => s.location.city === "Riyadh");
    return `Schools in **Riyadh** (${schools.length} available):\n\n${schools.slice(0, 5).map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.curriculum} · ${s.rating}⭐`).join("\n")}\n\nWould you like to filter by curriculum, budget, or district?`;
  }

  if (lower.includes("best") || lower.includes("top") || lower.includes("rated")) {
    const top = [...SCHOOLS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    return `🏆 **Top-rated schools** in Saudi Arabia:\n\n${top.map((s, i) => `${i + 1}. **${s.name}** — ${s.rating}⭐ (${s.totalRatings} reviews) · ${s.location.city}`).join("\n")}\n\nHighest rated is **${top[0].name}** at ${top[0].rating}/5 with ${top[0].totalRatings} reviews. Want to see their full profile?`;
  }

  if (lower.includes("payment") || lower.includes("installment") || lower.includes("term")) {
    return `Most Saudi schools offer flexible payment options:\n\n💳 **Full Year**: Pay once annually (sometimes a small discount)\n📅 **Per Term**: 3 payments (Sept, Jan, Apr)\n🗓️ **Monthly**: 10 or 12 monthly instalments\n\nCheck the **Fees & Costs** section on each school's profile page for specific payment options. Would you like to see the fees for a specific school?`;
  }

  // Default
  const topSchools = [...SCHOOLS].sort((a, b) => b.fitScore - a.fitScore).slice(0, 3);
  return `Based on ${userName ? "your profile" : "average preferences"} in **${city || "Riyadh"}**, here are my top recommendations:\n\n${topSchools.map((s, i) => `${i + 1}. **${s.name}**\n   ${s.curriculum} · SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.fitScore}% match`).join("\n\n")}\n\nWould you like to know more about any of these schools, or shall I refine the search?`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm Schoolo AI, your personal school advisor 🎓\n\nI use your profile and preferences to help you find the ideal school in Saudi Arabia.\n\nAsk me about curricula, fees, locations, payment options, special needs support, siblings discounts, or how to book a visit.",
  timestamp: Date.now() - 1000,
};

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const colors = useColors();
  const isUser = msg.role === "user";

  return (
    <View
      style={[
        styles.bubble,
        isUser
          ? { alignSelf: "flex-end", backgroundColor: colors.primary, borderBottomRightRadius: 4 }
          : { alignSelf: "flex-start", backgroundColor: colors.card, borderBottomLeftRadius: 4, borderColor: colors.border, borderWidth: 1 },
        { borderRadius: colors.radius },
      ]}
    >
      <Text style={[styles.bubbleText, { color: isUser ? "#FFF" : colors.foreground }]}>
        {msg.content}
      </Text>
      <Text style={[styles.bubbleTime, { color: isUser ? "rgba(255,255,255,0.6)" : colors.mutedForeground }]}>
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatMessages, addChatMessage, clearChat, user } = useApp();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);
  const topPaddingWeb = Platform.OS === "web" ? 67 : 0;

  const allMessages = chatMessages.length > 0 ? chatMessages : [WELCOME_MESSAGE];

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setInputText("");
    setIsTyping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      const response = generateResponse(trimmed, user.name, user.budgetMax, user.city, user.specialNeeds);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      });
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { paddingTop: insets.top + topPaddingWeb + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}
      >
        <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="sparkles" size={18} color="#FFF" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Schoolo AI</Text>
          <Text style={[styles.headerSub, { color: isTyping ? colors.primary : colors.success }]}>
            {isTyping ? "Typing…" : "Online · School Advisor"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => { clearChat(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }} hitSlop={8}>
          <Feather name="refresh-ccw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          data={[...allMessages].reverse()}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[styles.messageList, { paddingBottom: 12 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          ListHeaderComponent={
            isTyping ? (
              <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={[styles.typingDots, { color: colors.mutedForeground }]}>• • •</Text>
              </View>
            ) : null
          }
        />

        {chatMessages.length === 0 && (
          <View style={styles.chipsContainer}>
            <Text style={[styles.chipsLabel, { color: colors.mutedForeground }]}>Suggested questions</Text>
            <View style={styles.chipsRow}>
              {QUICK_CHIPS.map((chip) => (
                <TouchableOpacity
                  key={chip}
                  onPress={() => sendMessage(chip)}
                  style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: 999 }]}
                >
                  <Text style={[styles.chipText, { color: colors.secondary }]} numberOfLines={1}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderRadius: 999 }]}
            placeholder="Ask your questions…"
            placeholderTextColor={colors.mutedForeground}
            value={inputText}
            onChangeText={setInputText}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(inputText)}
          />
          <TouchableOpacity
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : colors.border, borderRadius: 999 }]}
          >
            <Ionicons name="arrow-up" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub: { fontSize: 12, fontWeight: "500" },
  messageList: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  bubble: { maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontSize: 11, alignSelf: "flex-end" },
  typingBubble: { alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 10, marginBottom: 10, borderWidth: 1 },
  typingDots: { fontSize: 18, letterSpacing: 4 },
  chipsContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  chipsLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "500" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
});
