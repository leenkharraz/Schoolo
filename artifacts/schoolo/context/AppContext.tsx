import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  preferredCurriculum: string;
  childrenCount: number;
  specialNeeds: boolean;
  isLoggedIn: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  schoolId?: string;
  type: "deadline" | "new_school" | "open_day" | "fee_update" | "match";
}

interface AppState {
  user: UserProfile;
  favorites: string[];
  lastSeen: string[];
  chatMessages: ChatMessage[];
  alerts: Alert[];
  activeFilter: string;
}

interface AppContextValue extends AppState {
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleFavorite: (schoolId: string) => void;
  addToLastSeen: (schoolId: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  setActiveFilter: (filter: string) => void;
  markAlertRead: (id: string) => void;
  unreadAlertCount: number;
}

const DEFAULT_USER: UserProfile = {
  name: "",
  phone: "",
  city: "Riyadh",
  budgetMin: 10000,
  budgetMax: 70000,
  preferredCurriculum: "Any",
  childrenCount: 1,
  specialNeeds: false,
  isLoggedIn: false,
};

const DEFAULT_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Open Day: International School of Riyadh",
    body: "Join us for an Open Day on Thursday 15 May at 10:00 AM. Meet teachers and tour the campus.",
    timestamp: Date.now() - 3600000,
    read: false,
    schoolId: "1",
    type: "open_day",
  },
  {
    id: "a2",
    title: "Enrollment Deadline Approaching",
    body: "British International School Riyadh closes enrollment for the 2025–2026 academic year on 1 June.",
    timestamp: Date.now() - 86400000,
    read: false,
    schoolId: "2",
    type: "deadline",
  },
  {
    id: "a3",
    title: "New School Match Found",
    body: "King's International School matches your preferences — IB curriculum with siblings discount available.",
    timestamp: Date.now() - 172800000,
    read: true,
    schoolId: "10",
    type: "match",
  },
  {
    id: "a4",
    title: "Fee Update: Al Rowad International",
    body: "Al Rowad International has announced a 5% fee increase for the 2025–2026 academic year.",
    timestamp: Date.now() - 259200000,
    read: true,
    schoolId: "3",
    type: "fee_update",
  },
  {
    id: "a5",
    title: "Sibling Discount Available",
    body: "Indian International School Riyadh offers up to 30% sibling discount — one of the highest in Riyadh.",
    timestamp: Date.now() - 432000000,
    read: false,
    schoolId: "7",
    type: "new_school",
  },
];

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "schoolo_state_v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: DEFAULT_USER,
    favorites: [],
    lastSeen: [],
    chatMessages: [],
    alerts: DEFAULT_ALERTS,
    activeFilter: "all",
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setState((prev) => ({
            ...prev,
            user: { ...DEFAULT_USER, ...saved.user },
            favorites: saved.favorites || [],
            lastSeen: saved.lastSeen || [],
            chatMessages: saved.chatMessages || [],
            alerts: saved.alerts || DEFAULT_ALERTS,
          }));
        } catch {}
      }
    });
  }, []);

  const save = useCallback((next: AppState) => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: next.user,
        favorites: next.favorites,
        lastSeen: next.lastSeen,
        chatMessages: next.chatMessages,
        alerts: next.alerts,
      })
    );
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setState((prev) => {
      const next = { ...prev, user: { ...prev.user, ...updates } };
      save(next);
      return next;
    });
  }, [save]);

  const toggleFavorite = useCallback((schoolId: string) => {
    setState((prev) => {
      const exists = prev.favorites.includes(schoolId);
      const favorites = exists
        ? prev.favorites.filter((id) => id !== schoolId)
        : [...prev.favorites, schoolId];
      const next = { ...prev, favorites };
      save(next);
      return next;
    });
  }, [save]);

  const addToLastSeen = useCallback((schoolId: string) => {
    setState((prev) => {
      const filtered = prev.lastSeen.filter((id) => id !== schoolId);
      const lastSeen = [schoolId, ...filtered].slice(0, 10);
      const next = { ...prev, lastSeen };
      save(next);
      return next;
    });
  }, [save]);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setState((prev) => {
      const chatMessages = [...prev.chatMessages, msg];
      const next = { ...prev, chatMessages };
      save(next);
      return next;
    });
  }, [save]);

  const clearChat = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, chatMessages: [] };
      save(next);
      return next;
    });
  }, [save]);

  const setActiveFilter = useCallback((filter: string) => {
    setState((prev) => ({ ...prev, activeFilter: filter }));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setState((prev) => {
      const alerts = prev.alerts.map((a) =>
        a.id === id ? { ...a, read: true } : a
      );
      const next = { ...prev, alerts };
      save(next);
      return next;
    });
  }, [save]);

  const unreadAlertCount = state.alerts.filter((a) => !a.read).length;

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateUser,
        toggleFavorite,
        addToLastSeen,
        addChatMessage,
        clearChat,
        setActiveFilter,
        markAlertRead,
        unreadAlertCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
