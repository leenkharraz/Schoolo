import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
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
  "Best rated schools near me",
  "Schools with siblings discount",
  "British curriculum under SAR 60K",
  "Special needs support available",
];

function generateResponse(text: string, userName: string, budgetMax: number, city: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("مرحبا")) {
    return `Hello${userName ? ` ${userName}` : ""}! I'm Schoolo's AI assistant. I can help you find the perfect school in ${city || "Saudi Arabia"}. What are your priorities — budget, curriculum, location, or special features?`;
  }

  if (lower.includes("sibling") || lower.includes("discount")) {
    const schools = SCHOOLS.filter((s) => s.siblingsDiscount).slice(0, 3);
    return `Great news — ${schools.length} schools in our database offer siblings discounts:\n\n${schools.map((s) => `• **${s.name}** — ${s.siblingsDiscountPercent}% off for siblings (${s.curriculum})`).join("\n")}\n\nThe highest sibling discount is at Indian International School Riyadh at 30%. Would you like more details on any of these?`;
  }

  if (lower.includes("british") || lower.includes("igcse") || lower.includes("a-level")) {
    const schools = SCHOOLS.filter((s) => s.curriculum === "British");
    return `I found ${schools.length} British curriculum schools for you:\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr, ${s.rating}⭐ (${s.location.city})`).join("\n")}\n\nBritish schools in Saudi Arabia follow the National Curriculum of England and typically offer IGCSE and A-Level pathways. Which city are you looking in?`;
  }

  if (lower.includes("american") || lower.includes("ap ") || lower.includes("ap courses")) {
    const schools = SCHOOLS.filter((s) => s.curriculum === "American");
    return `Here are the American curriculum schools available:\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr, ${s.rating}⭐`).join("\n")}\n\nAmerican schools offer Advanced Placement (AP) courses and prepare students for US university admissions. Would you like to know about specific schools?`;
  }

  if (lower.includes("ib") || lower.includes("international baccalaureate")) {
    const schools = SCHOOLS.filter((s) => s.curriculum === "IB");
    return `For the IB (International Baccalaureate) curriculum, King's International School in Riyadh is the top choice:\n\n• **King's International School** — SAR 55,000/yr, 4.6⭐\n  Full IB continuum: PYP, MYP, and Diploma\n\nIB is highly regarded by universities worldwide and develops well-rounded students. Shall I tell you more?`;
  }

  if (lower.includes("special needs") || lower.includes("learning support") || lower.includes("disability")) {
    const schools = SCHOOLS.filter((s) => s.specialNeeds);
    return `Schools with special needs support in our database:\n\n${schools.map((s) => `• **${s.name}** — ${s.curriculum}, ${s.location.city}`).join("\n")}\n\nI recommend calling the school directly to discuss your child's specific requirements, as support programmes vary. Would you like contact information?`;
  }

  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable") || lower.includes("inexpensive")) {
    const affordable = SCHOOLS.filter((s) => s.fees.tuition <= 30000).sort((a, b) => a.fees.tuition - b.fees.tuition);
    return `Most affordable schools (under SAR 30,000/yr):\n\n${affordable.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr, ${s.rating}⭐`).join("\n")}\n\nRemember to factor in transport, uniform, and activities which can add SAR 5,000–12,000 annually.`;
  }

  if (lower.includes("near") || lower.includes("closest") || lower.includes("distance")) {
    const nearest = [...SCHOOLS].sort((a, b) => a.location.distance - b.location.distance).slice(0, 4);
    return `The closest schools to you in ${city || "Riyadh"}:\n\n${nearest.map((s) => `• **${s.name}** — ${s.location.distance}km away, ${s.curriculum}`).join("\n")}\n\nDistance data is estimated. Would you like to filter by a specific area?`;
  }

  if (lower.includes("jeddah")) {
    const schools = SCHOOLS.filter((s) => s.location.city === "Jeddah");
    return `Schools available in Jeddah:\n\n${schools.map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr, ${s.curriculum}, ${s.rating}⭐`).join("\n")}\n\nJeddah has excellent American and British international schools. Which curriculum interests you?`;
  }

  if (lower.includes("riyadh")) {
    const schools = SCHOOLS.filter((s) => s.location.city === "Riyadh");
    return `Schools in Riyadh (${schools.length} available):\n\n${schools.slice(0, 5).map((s) => `• **${s.name}** — SAR ${s.fees.tuition.toLocaleString()}/yr, ${s.curriculum}, ${s.rating}⭐`).join("\n")}\n\nWould you like me to filter these by curriculum, budget, or district?`;
  }

  if (lower.includes("best") || lower.includes("top") || lower.includes("rated")) {
    const top = [...SCHOOLS].sort((a, b) => b.rating - a.rating).slice(0, 4);
    return `Top-rated schools in Saudi Arabia:\n\n${top.map((s, i) => `${i + 1}. **${s.name}** — ${s.rating}⭐ (${s.totalRatings} reviews), ${s.location.city}`).join("\n")}\n\nHighest rated is **${top[0].name}** at ${top[0].rating}/5. Want to see detailed profiles?`;
  }

  if (lower.includes("cost") || lower.includes("fee") || lower.includes("price") || lower.includes("how much")) {
    const maxBudget = budgetMax || 70000;
    const matching = SCHOOLS.filter((s) => s.fees.tuition <= maxBudget);
    return `Based on your budget of up to SAR ${maxBudget.toLocaleString()}/year, I found ${matching.length} schools.\n\nRemember, total yearly cost includes:\n• Tuition fees\n• Registration fee (one-time)\n• Uniform: SAR 800–3,200\n• Transport: SAR 3,500–9,500\n• Activities: SAR 1,000–4,200\n\nWould you like me to calculate the full cost for a specific school?`;
  }

  // Default smart response
  const topSchools = [...SCHOOLS].sort((a, b) => b.fitScore - a.fitScore).slice(0, 3);
  return `Based on ${userName ? `your profile` : "average preferences"} in ${city || "Riyadh"}, here are my top recommendations:\n\n${topSchools.map((s, i) => `${i + 1}. **${s.name}**\n   ${s.curriculum} · SAR ${s.fees.tuition.toLocaleString()}/yr · ${s.fitScore}% match`).join("\n\n")}\n\nWould you like to know more about any of these schools, or shall I refine the search?`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm Schoolo AI, your personal school advisor. I use your profile and preferences to help you find the ideal school for your child in Saudi Arabia.\n\nYou can ask me about specific curricula, budgets, locations, special needs support, or sibling discounts.",
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
      <Text
        style={[
          styles.bubbleText,
          { color: isUser ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {msg.content}
      </Text>
      <Text
        style={[
          styles.bubbleTime,
          { color: isUser ? "rgba(255,255,255,0.6)" : colors.mutedForeground },
        ]}
      >
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
      const response = generateResponse(trimmed, user.name, user.budgetMax, user.city);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
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
        <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="sparkles" size={18} color="#FFF" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Schoolo AI</Text>
          <Text style={[styles.headerSub, { color: colors.success }]}>
            {isTyping ? "Typing…" : "Online"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => { clearChat(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
          hitSlop={8}
        >
          <Feather name="refresh-ccw" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={[...allMessages].reverse()}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: 12 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          ListHeaderComponent={
            isTyping ? (
              <View
                style={[
                  styles.typingBubble,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
                ]}
              >
                <Text style={[styles.typingDots, { color: colors.mutedForeground }]}>
                  • • •
                </Text>
              </View>
            ) : null
          }
        />

        {/* Quick chips */}
        {chatMessages.length === 0 && (
          <View style={styles.chipsRow}>
            {QUICK_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                onPress={() => sendMessage(chip)}
                style={[
                  styles.chip,
                  { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: 999 },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.secondary }]} numberOfLines={1}>
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.muted,
                color: colors.foreground,
                borderRadius: 999,
              },
            ]}
            placeholder="Ask about any school…"
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
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.border,
                borderRadius: 999,
              },
            ]}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub: { fontSize: 12, fontWeight: "500" },
  messageList: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontSize: 11, alignSelf: "flex-end" },
  typingBubble: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  typingDots: { fontSize: 18, letterSpacing: 4 },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "500" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
