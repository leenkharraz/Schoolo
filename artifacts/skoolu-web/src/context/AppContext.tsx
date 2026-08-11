import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTheme } from "next-themes";

export interface ChildProfile {
  name: string;
  birthdate: string;
  gender: string;
  grade: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  preferredCurriculum: string;
  childrenCount: number;
  childAge: number;
  childGrade: string;
  specialNeeds: boolean;
  preferredLanguage: string;
  preferredActivities: string[];
  distanceMax: number;
  preferredSchoolType: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  children: ChildProfile[];
}

export interface Booking {
  id: string;
  schoolId: string;
  schoolName: string;
  type: "visit" | "placement_test";
  date: string;
  time: string;
  status: "upcoming" | "updated" | "cancelled" | "completed";
  createdAt: number;
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
  type: "deadline" | "new_school" | "open_day" | "fee_update" | "match" | "booking" | "booking_update" | "booking_cancel";
}

type SortOrder = "featured" | "price_asc" | "price_desc" | "rating";

interface AppState {
  user: UserProfile;
  favorites: string[];
  lastSeen: string[];
  chatMessages: ChatMessage[];
  alerts: Alert[];
  bookings: Booking[];
  activeFilter: string;
  sortOrder: SortOrder;
  selectedCity: string;
  appLanguage: string;
}

interface AppContextValue extends AppState {
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleFavorite: (schoolId: string) => void;
  addToLastSeen: (schoolId: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  setActiveFilter: (filter: string) => void;
  setSortOrder: (sort: SortOrder) => void;
  setSelectedCity: (city: string) => void;
  markAlertRead: (id: string) => void;
  unreadAlertCount: number;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  setAppLanguage: (lang: string) => void;
}

const DEFAULT_USER: UserProfile = {
  name: "",
  phone: "",
  email: "",
  city: "Riyadh",
  budgetMin: 10000,
  budgetMax: 70000,
  preferredCurriculum: "Any",
  childrenCount: 1,
  childAge: 8,
  childGrade: "Grade 3",
  specialNeeds: false,
  preferredLanguage: "None",
  preferredActivities: [],
  distanceMax: 10,
  preferredSchoolType: "any",
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  children: [],
};

const DEFAULT_ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Open Day: American International School Riyadh",
    body: "Join us for an Open Day on Thursday 15 May at 10:00 AM. Meet teachers and tour the campus.",
    timestamp: Date.now() - 3600000,
    read: false,
    schoolId: "r1",
    type: "open_day",
  },
  {
    id: "a2",
    title: "Enrollment Deadline: British International School Riyadh",
    body: "BISR closes enrollment for the 2025–2026 academic year on 1 June.",
    timestamp: Date.now() - 86400000,
    read: false,
    schoolId: "r2",
    type: "deadline",
  },
  {
    id: "a3",
    title: "New School Match Found",
    body: "SEK International School Riyadh matches your preferences — IB curriculum with multilingual programmes.",
    timestamp: Date.now() - 172800000,
    read: true,
    schoolId: "r4",
    type: "match",
  },
  {
    id: "a4",
    title: "Fee Update: Jeddah Knowledge International",
    body: "Jeddah Knowledge International has announced updated fees for the 2025–2026 academic year.",
    timestamp: Date.now() - 259200000,
    read: true,
    schoolId: "j4",
    type: "fee_update",
  },
  {
    id: "a5",
    title: "Open Day: Al Waha International School",
    body: "Al Waha International School is hosting a Parent Open Day — come see the campus and meet the principal.",
    timestamp: Date.now() - 432000000,
    read: false,
    schoolId: "j5",
    type: "open_day",
  },
];

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = "skoolu_state_v3";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: DEFAULT_USER,
    favorites: [],
    lastSeen: [],
    chatMessages: [],
    alerts: DEFAULT_ALERTS,
    bookings: [],
    activeFilter: "all",
    sortOrder: "featured",
    selectedCity: "All",
    appLanguage: "English",
  });
  const [loaded, setLoaded] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setState((prev) => ({
          ...prev,
          user: { ...DEFAULT_USER, ...saved.user },
          favorites: saved.favorites || [],
          lastSeen: saved.lastSeen || [],
          chatMessages: saved.chatMessages || [],
          alerts: saved.alerts || DEFAULT_ALERTS,
          bookings: saved.bookings || [],
          selectedCity: saved.selectedCity || "All",
          appLanguage: saved.appLanguage || "English",
        }));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const save = useCallback((next: AppState) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: next.user,
        favorites: next.favorites,
        lastSeen: next.lastSeen,
        chatMessages: next.chatMessages,
        alerts: next.alerts,
        bookings: next.bookings,
        selectedCity: next.selectedCity,
        appLanguage: next.appLanguage,
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

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setState((prev) => ({ ...prev, sortOrder }));
  }, []);

  const setSelectedCity = useCallback((city: string) => {
    setState((prev) => {
      const next = { ...prev, selectedCity: city };
      save(next);
      return next;
    });
  }, [save]);

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

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => {
      const bookings = [...prev.bookings, booking];
      const newAlert: Alert = {
        id: `booking-${booking.id}`,
        title: `${booking.type === "visit" ? "Visit Booked" : "Test Booked"}: ${booking.schoolName}`,
        body: `Your ${booking.type === "visit" ? "school visit" : "placement test"} is confirmed for ${booking.date} at ${booking.time}.`,
        timestamp: Date.now(),
        read: false,
        schoolId: booking.schoolId,
        type: "booking",
      };
      const alerts = [newAlert, ...prev.alerts];
      const next = { ...prev, bookings, alerts };
      save(next);
      return next;
    });
  }, [save]);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setState((prev) => {
      const bookings = prev.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      );
      const booking = prev.bookings.find((b) => b.id === id);
      let alerts = prev.alerts;
      if (booking && (updates.date || updates.time)) {
        const updateAlert: Alert = {
          id: `booking-update-${id}-${Date.now()}`,
          title: `Booking Rescheduled: ${booking.schoolName}`,
          body: `Your booking has been moved to ${updates.date ?? booking.date} at ${updates.time ?? booking.time}.`,
          timestamp: Date.now(),
          read: false,
          schoolId: booking.schoolId,
          type: "booking_update",
        };
        alerts = [updateAlert, ...prev.alerts];
      }
      const next = { ...prev, bookings, alerts };
      save(next);
      return next;
    });
  }, [save]);

  const cancelBooking = useCallback((id: string) => {
    setState((prev) => {
      const bookings = prev.bookings.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as const } : b
      );
      const booking = prev.bookings.find((b) => b.id === id);
      let alerts = prev.alerts;
      if (booking) {
        const cancelAlert: Alert = {
          id: `booking-cancel-${id}-${Date.now()}`,
          title: `Booking Cancelled: ${booking.schoolName}`,
          body: `Your ${booking.type === "visit" ? "school visit" : "placement test"} on ${booking.date} at ${booking.time} has been cancelled.`,
          timestamp: Date.now(),
          read: false,
          schoolId: booking.schoolId,
          type: "booking_cancel",
        };
        alerts = [cancelAlert, ...prev.alerts];
      }
      const next = { ...prev, bookings, alerts };
      save(next);
      return next;
    });
  }, [save]);

  const setAppLanguage = useCallback((lang: string) => {
    setState((prev) => {
      const next = { ...prev, appLanguage: lang };
      save(next);
      return next;
    });
  }, [save]);

  const unreadAlertCount = state.alerts.filter((a) => !a.read).length;

  if (!loaded) return null;

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
        setSortOrder,
        setSelectedCity,
        markAlertRead,
        unreadAlertCount,
        addBooking,
        updateBooking,
        cancelBooking,
        setAppLanguage,
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
