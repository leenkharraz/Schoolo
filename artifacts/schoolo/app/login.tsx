import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const topPad = Platform.OS === "web" ? 67 : 0;

  if (user.isLoggedIn) {
    router.replace(user.hasCompletedOnboarding ? "/" : "/onboarding");
    return null;
  }

  const handleLogin = () => {
    if (!email.trim()) { setError("Please enter your email or username."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      updateUser({ isLoggedIn: true, email: email.trim(), name: user.name || email.split("@")[0] });
      setLoading(false);
      if (user.hasCompletedOnboarding) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    }, 900);
  };

  const handleSignup = () => {
    if (!signupName.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password.trim() || password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      updateUser({ isLoggedIn: true, email: email.trim(), name: signupName.trim(), phone: signupPhone.trim() });
      setLoading(false);
      router.replace("/onboarding");
    }, 900);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      updateUser({ isLoggedIn: true, name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` });
      setLoading(false);
      if (user.hasCompletedOnboarding) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + topPad + 24, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoBlock}>
            <Image
              source={require("../assets/images/schoolo-logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <Text style={[styles.headline, { color: colors.foreground }]}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </Text>
          <Text style={[styles.subheadline, { color: colors.mutedForeground }]}>
            {mode === "login"
              ? "Sign in to find the perfect school for your child"
              : "Join thousands of Saudi parents on Schoolo"}
          </Text>

          {/* Tab Toggle */}
          <View style={[styles.tabRow, { backgroundColor: colors.muted, borderRadius: 12 }]}>
            {(["login", "signup"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => { setMode(t); setError(""); }}
                style={[
                  styles.tab,
                  {
                    backgroundColor: mode === t ? colors.card : "transparent",
                    borderRadius: 10,
                    shadowColor: mode === t ? "#000" : "transparent",
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: mode === t ? 2 : 0,
                  },
                ]}
              >
                <Text style={[styles.tabText, { color: mode === t ? colors.primary : colors.mutedForeground, fontWeight: mode === t ? "700" : "500" }]}>
                  {t === "login" ? "Log In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === "signup" && (
              <>
                <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
                  <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="Full Name"
                    placeholderTextColor={colors.mutedForeground}
                    value={signupName}
                    onChangeText={setSignupName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
                  <Ionicons name="call-outline" size={18} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="Phone (+966 5X XXX XXXX)"
                    placeholderTextColor={colors.mutedForeground}
                    value={signupPhone}
                    onChangeText={setSignupPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Email address"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: "#FEE2E2", borderRadius: 8 }]}>
                <Ionicons name="warning-outline" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {mode === "login" && (
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={mode === "login" ? handleLogin : handleSignup}
              disabled={loading}
              style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: loading ? 0.8 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryBtnText}>{mode === "login" ? "Log In" : "Create Account"}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              onPress={() => handleSocialLogin("Google")}
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <View style={styles.socialIconG}>
                <Text style={styles.socialIconText}>G</Text>
              </View>
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSocialLogin("Apple")}
              style={[styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            >
              <Feather name="smartphone" size={18} color={colors.foreground} />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Apple / iCloud</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle mode link */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>
                {mode === "login" ? "Sign Up" : "Log In"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 0 },
  logoBlock: { alignItems: "center", marginBottom: 24 },
  logo: { width: 180, height: 72 },
  headline: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, textAlign: "center" },
  subheadline: { fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 24, lineHeight: 20 },
  tabRow: { flexDirection: "row", padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 14 },
  form: { gap: 12 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10 },
  errorText: { color: "#DC2626", fontSize: 13, flex: 1 },
  forgotRow: { alignSelf: "flex-end" },
  forgotText: { fontSize: 13, fontWeight: "600" },
  primaryBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderWidth: 1,
  },
  socialIconG: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EA4335",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIconText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  socialBtnText: { fontSize: 13, fontWeight: "600" },
  switchRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  switchText: { fontSize: 14 },
  switchLink: { fontSize: 14, fontWeight: "700" },
});
