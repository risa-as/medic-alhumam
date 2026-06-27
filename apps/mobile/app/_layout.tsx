import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text, StyleSheet, I18nManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stethoscope } from "lucide-react-native";
import { useAuth } from "../store/auth";
import { setUnauthorizedHandler } from "../lib/api";
import { colors, gradients, font, spacing } from "../components/theme";

// تطبيق عربي بالكامل — نفرض اتجاه RTL على كل المنصّات بصرف النظر عن لغة الجهاز.
// المكوّنات مكتوبة بترتيب منطقي (الأيقونة أوّلًا) + textAlign:"right"، فينقلب التخطيط
// إلى يمين‑يسار بشكل صحيح تلقائيًّا. يُطبَّق عند الإقلاع البارد (وقد يلزم إعادة فتح مرّة).
I18nManager.allowRTL(true);
// مهم: نُعطّل التبديل التلقائي لـ left/right في RTL حتى يبقى textAlign:"right" يمينًا فعليًّا
// (الجهة القائدة في العربية)؛ بدونه يُقلب RN كل النصوص إلى اليسار.
I18nManager.swapLeftAndRightInRTL(false);
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
}

export default function RootLayout() {
  const { user, initializing, restore, setUser } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    void restore();
  }, []);

  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <>
        <StatusBar style="light" />
        <LinearGradient colors={gradients.primary} style={styles.splash}>
          <View style={styles.logo}>
            <Stethoscope size={42} color={colors.white} strokeWidth={2} />
          </View>
          <Text style={styles.brand}>المستلزمات الطبية</Text>
          <ActivityIndicator color={colors.white} style={{ marginTop: spacing.xl }} />
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: colors.white, fontSize: font.xl, fontWeight: "800", marginTop: spacing.md },
});
