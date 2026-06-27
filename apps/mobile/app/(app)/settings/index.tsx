import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  ShieldCheck,
  BadgeCheck,
  Info,
  Smartphone,
  LogOut,
  Save,
} from "lucide-react-native";
import { api } from "../../../lib/api";
import { useAuth } from "../../../store/auth";
import { colors, gradients, ROLE_LABEL, spacing, font, radius, shadow } from "../../../components/theme";
import { Screen, Hero, SectionTitle, Button, type IconType } from "../../../components/ui";

export default function SettingsScreen() {
  const { user, logout, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);

  const dirty = name.trim() !== (user?.name ?? "").trim() && name.trim().length > 0;

  async function saveName() {
    if (!dirty) return;
    setSavingName(true);
    try {
      const updated = await api.patch<{ id: string; name: string; email: string; role: "ADMIN" | "CASHIER" }>("/me", { name: name.trim() });
      setUser(updated);
      Alert.alert("نجاح", "تم تحديث الاسم");
    } catch (e) {
      Alert.alert("خطأ", e instanceof Error ? e.message : "تعذّر الحفظ");
    } finally {
      setSavingName(false);
    }
  }

  function confirmLogout() {
    Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج من الحساب؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "خروج", style: "destructive", onPress: () => void logout() },
    ]);
  }

  const initials = (user?.name ?? "؟").trim().charAt(0);
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const roleLabel = user ? ROLE_LABEL[user.role] : "";

  return (
    <Screen scroll padded={false} header={<Hero title="الإعدادات" subtitle="حسابك وإعدادات التطبيق" icon={SettingsIcon} />}>
      <View style={styles.body}>
        {/* بطاقة الملف الشخصي — لافتة متدرّجة */}
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName} numberOfLines={1}>{user?.name}</Text>
          {!!user?.email && <Text style={styles.profileEmail} numberOfLines={1}>{user.email}</Text>}
          <View style={styles.roleBadge}>
            <BadgeCheck size={13} color={colors.white} strokeWidth={2.4} />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </LinearGradient>

        {/* تعديل الاسم */}
        <SectionTitle title="الملف الشخصي" icon={User} />
        <View style={styles.card}>
          <Text style={styles.label}>الاسم</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="اسمك" placeholderTextColor={colors.muted} />
          <Button title="حفظ الاسم" icon={Save} onPress={saveName} loading={savingName} disabled={!dirty} size="md" style={{ marginTop: spacing.md }} />
        </View>

        {/* معلومات الحساب */}
        <SectionTitle title="معلومات الحساب" icon={ShieldCheck} />
        <View style={styles.card}>
          <InfoRow icon={Mail} label="البريد الإلكتروني" value={user?.email ?? "—"} tint={colors.info} tintBg={colors.infoLight} />
          <View style={styles.divider} />
          <InfoRow icon={ShieldCheck} label="الصلاحية" value={roleLabel} tint={colors.primary} tintBg={colors.primaryLight} />
        </View>

        {/* حول التطبيق */}
        <SectionTitle title="حول التطبيق" icon={Info} />
        <View style={styles.card}>
          <InfoRow icon={Smartphone} label="إصدار التطبيق" value={version} tint={colors.success} tintBg={colors.successLight} />
          <View style={styles.divider} />
          <InfoRow icon={Info} label="النظام" value="نظام المستلزمات الطبية" tint={colors.textSecondary} tintBg={colors.borderLight} />
        </View>

        {/* تسجيل الخروج */}
        <TouchableOpacity style={styles.logout} onPress={confirmLogout} activeOpacity={0.85}>
          <LogOut size={18} color={colors.danger} strokeWidth={2.2} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>نظام المستلزمات الطبية © 2026</Text>
      </View>
    </Screen>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  tint,
  tintBg,
}: {
  icon: IconType;
  label: string;
  value: string;
  tint: string;
  tintBg: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: tintBg }]}>
        <Icon size={17} color={tint} strokeWidth={2.2} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },

  profile: { borderRadius: radius.xl, padding: spacing.xl, alignItems: "center", marginBottom: spacing.lg, ...shadow.md },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontSize: font.xxl, fontWeight: "800" },
  profileName: { fontSize: font.lg, fontWeight: "800", color: colors.white, marginTop: spacing.md },
  profileEmail: { fontSize: font.sm, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  roleText: { color: colors.white, fontSize: font.xs, fontWeight: "800" },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.sm },

  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.xs },
  infoIcon: { width: 38, height: 38, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  infoTexts: { flex: 1 },
  infoLabel: { fontSize: font.xs, color: colors.muted, textAlign: "left" },
  infoValue: { fontSize: font.sm, color: colors.text, fontWeight: "700", marginTop: 2, textAlign: "left" },
  divider: { height: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },

  label: { fontSize: font.sm, color: colors.textSecondary, marginBottom: 6, textAlign: "left", fontWeight: "600" },
  input: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: font.base, color: colors.text, textAlign: "left" },

  logout: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.dangerLight, borderRadius: radius.md, paddingVertical: spacing.lg, marginTop: spacing.xs },
  logoutText: { color: colors.danger, fontSize: font.base, fontWeight: "800" },

  footer: { textAlign: "center", color: colors.muted, fontSize: font.xs, marginTop: spacing.xl },
});
