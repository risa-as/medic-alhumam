import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stethoscope, Mail, Lock, Eye, EyeOff, TriangleAlert } from "lucide-react-native";
import { useAuth } from "../../store/auth";
import { Button } from "../../components/ui";
import { colors, gradients, spacing, radius, font, shadow } from "../../components/theme";

export default function LoginScreen() {
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  async function submit() {
    if (!email.trim() || !password) {
      setError("أدخل البريد وكلمة المرور");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      // التوجيه يتكفّل به الـ root layout بعد تحديث user
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* الترويسة المتدرّجة */}
        <LinearGradient colors={gradients.primary} style={[styles.header, { paddingTop: insets.top + spacing.xxxl }]}>
          <View style={styles.logo}>
            <Stethoscope size={40} color={colors.white} strokeWidth={2} />
          </View>
          <Text style={styles.brand}>المستلزمات الطبية</Text>
          <Text style={styles.brandSub}>نظام إدارة المتجر</Text>
        </LinearGradient>

        {/* البطاقة */}
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.title}>تسجيل الدخول</Text>
            <Text style={styles.subtitle}>أدخل بياناتك للمتابعة</Text>

            <Text style={styles.label}>البريد الإلكتروني</Text>
            <View style={styles.field}>
              <Mail size={18} color={colors.muted} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="name@medic.local"
                placeholderTextColor={colors.muted}
              />
            </View>

            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.field}>
              <Lock size={18} color={colors.muted} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!show}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                onSubmitEditing={submit}
              />
              <TouchableOpacity onPress={() => setShow((s) => !s)} hitSlop={10}>
                {show ? <EyeOff size={18} color={colors.muted} strokeWidth={2} /> : <Eye size={18} color={colors.muted} strokeWidth={2} />}
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <TriangleAlert size={15} color={colors.danger} strokeWidth={2.2} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button title="تسجيل الدخول" onPress={submit} loading={loading} size="lg" style={{ marginTop: spacing.xl }} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingBottom: spacing.xxxl + spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: colors.white, fontSize: font.xxl, fontWeight: "800", marginTop: spacing.lg },
  brandSub: { color: "rgba(255,255,255,0.82)", fontSize: font.base, marginTop: 4 },

  body: { paddingHorizontal: spacing.lg, marginTop: -spacing.xxxl },
  card: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.xxl, ...shadow.lg },
  title: { fontSize: font.xl, fontWeight: "800", textAlign: "right", color: colors.text },
  subtitle: { fontSize: font.sm, color: colors.textSecondary, textAlign: "right", marginTop: 2, marginBottom: spacing.lg },

  label: { fontSize: font.sm, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md, textAlign: "right", fontWeight: "600" },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg,
  },
  input: { flex: 1, paddingVertical: 13, fontSize: font.base, textAlign: "right", color: colors.text },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  errorText: { color: colors.danger, fontSize: font.sm, flex: 1, textAlign: "right", fontWeight: "600" },
});
