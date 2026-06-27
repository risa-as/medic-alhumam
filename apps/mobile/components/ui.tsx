// مكتبة مكوّنات واجهة موحّدة للموبايل — نظام تصميم عصري بهوية النظام.
import type { ReactNode } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
  type StyleProp,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, X, type LucideProps } from "lucide-react-native";
import { colors, spacing, radius, font, shadow, gradients } from "./theme";

export type IconType = React.ComponentType<LucideProps>;

/* ─────────────── Screen ─────────────── */
export function Screen({
  children,
  scroll = false,
  padded = true,
  refreshing,
  onRefresh,
  style,
  contentStyle,
  header,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** ترويسة ثابتة أعلى الشاشة خارج منطقة التمرير (لا تتمرّر مع المحتوى). */
  header?: ReactNode;
}) {
  const pad = padded ? { padding: spacing.lg } : null;
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[pad, { paddingBottom: spacing.xxxl }, contentStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, pad]}>{children}</View>
  );
  return (
    <View style={[styles.screen, style]}>
      {header}
      {body}
    </View>
  );
}

/* ─────────────── Hero (ترويسة متدرّجة مستوية بعنوان موسّط) ─────────────── */
export function Hero({
  title,
  subtitle,
  icon: Icon,
  right,
  compact = false,
  topInset = true,
}: {
  title: string;
  subtitle?: string;
  icon?: IconType;
  right?: ReactNode;
  compact?: boolean;
  topInset?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={gradients.primary}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.hero,
        compact && styles.heroCompact,
        topInset && { paddingTop: insets.top + spacing.sm },
      ]}
    >
      {/* إجراء اختياري (يُثبّت في الزاوية دون أن يزيح توسيط العنوان) */}
      {right ? <View style={[styles.heroAction, { top: (topInset ? insets.top : 0) + spacing.sm }]}>{right}</View> : null}

      {/* أيقونة صغيرة + عنوان في صفّ موسّط — ترويسة مدمجة موحّدة */}
      <View style={styles.heroRow}>
        {Icon && (
          <View style={styles.heroIcon}>
            <Icon size={18} color={colors.white} strokeWidth={2.4} />
          </View>
        )}
        <Text style={styles.heroTitle} numberOfLines={1}>{title}</Text>
      </View>
      {!!subtitle && <Text style={styles.heroSubtitle} numberOfLines={1}>{subtitle}</Text>}
    </LinearGradient>
  );
}

/* ─────────────── Card ─────────────── */
export function Card({
  children,
  style,
  onPress,
  accent,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accent?: string;
}) {
  const inner = (
    <View style={[styles.card, accent ? { borderRightWidth: 4, borderRightColor: accent } : null, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

/* ─────────────── StatCard ─────────────── */
export function StatCard({
  label,
  value,
  icon: Icon,
  tint = colors.primary,
  tintBg = colors.primaryLight,
  style,
}: {
  label: string;
  value: string;
  icon?: IconType;
  tint?: string;
  tintBg?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.statCard, style]}>
      {Icon && (
        <View style={[styles.statIcon, { backgroundColor: tintBg }]}>
          <Icon size={20} color={tint} strokeWidth={2.2} />
        </View>
      )}
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ─────────────── Button ─────────────── */
type Variant = "primary" | "secondary" | "danger" | "success" | "ghost";
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  full = true,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: IconType;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || loading;
  const pad = size === "sm" ? 9 : size === "lg" ? 16 : 13;
  const fs = size === "sm" ? font.sm : font.base;
  const fg =
    variant === "ghost" ? colors.primary : variant === "secondary" ? colors.text : colors.white;

  const content = (
    <View style={[styles.btnInner, { paddingVertical: pad }]}>
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {Icon && <Icon size={fs + 3} color={fg} strokeWidth={2.2} />}
          <Text style={[styles.btnText, { color: fg, fontSize: fs }]}>{title}</Text>
        </>
      )}
    </View>
  );

  const base: StyleProp<ViewStyle> = [
    styles.btn,
    full && { alignSelf: "stretch" },
    isDisabled && { opacity: 0.55 },
    style,
  ];

  if (variant === "primary") {
    return (
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} disabled={isDisabled} style={base}>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnFill}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const bg =
    variant === "danger"
      ? colors.danger
      : variant === "success"
        ? colors.success
        : variant === "secondary"
          ? colors.borderLight
          : "transparent";
  const borderStyle =
    variant === "ghost"
      ? { borderWidth: 1.5, borderColor: colors.primary }
      : variant === "secondary"
        ? { borderWidth: 1, borderColor: colors.border }
        : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[base, styles.btnFill, { backgroundColor: bg }, borderStyle]}
    >
      {content}
    </TouchableOpacity>
  );
}

/* ─────────────── Input ─────────────── */
export function Input({
  label,
  style,
  ...props
}: TextInputProps & { label?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      {!!label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

/* ─────────────── SearchInput ─────────────── */
export function SearchInput({
  value,
  onChangeText,
  placeholder,
  onClear,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onClear?: () => void;
}) {
  return (
    <View style={styles.search}>
      <Search size={18} color={colors.muted} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.searchInput}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => (onClear ? onClear() : onChangeText(""))} hitSlop={10}>
          <X size={18} color={colors.muted} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ─────────────── Badge ─────────────── */
export function Badge({
  label,
  color = colors.primary,
  bg = colors.primaryLight,
  icon: Icon,
}: {
  label: string;
  color?: string;
  bg?: string;
  icon?: IconType;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {Icon && <Icon size={12} color={color} strokeWidth={2.5} />}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

/* ─────────────── SectionTitle ─────────────── */
export function SectionTitle({
  title,
  icon: Icon,
  action,
}: {
  title: string;
  icon?: IconType;
  action?: ReactNode;
}) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionLeft}>
        {Icon && <Icon size={18} color={colors.primary} strokeWidth={2.2} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

/* ─────────────── IconCircle ─────────────── */
export function IconCircle({
  icon: Icon,
  tint = colors.primary,
  bg = colors.primaryLight,
  size = 44,
}: {
  icon: IconType;
  tint?: string;
  bg?: string;
  size?: number;
}) {
  return (
    <View style={[styles.iconCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Icon size={size * 0.46} color={tint} strokeWidth={2.2} />
    </View>
  );
}

export const Row = ({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[styles.row, style]}>{children}</View>
);

export const Muted = ({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) => (
  <Text style={[styles.muted, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  hero: {
    // ترويسة مستوية مدمجة وثابتة بمحتوى موسّط
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    ...shadow.md,
  },
  heroCompact: { paddingBottom: spacing.sm },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  heroAction: { position: "absolute", start: spacing.lg, zIndex: 2 },
  heroTitle: {
    color: colors.white,
    fontSize: font.lg,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: font.xs,
    marginTop: 5,
    textAlign: "center",
  },
  heroIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, ...shadow.sm },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "flex-start",
    ...shadow.sm,
  },
  statIcon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  statValue: { fontSize: font.xl, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },

  btn: { borderRadius: radius.md, overflow: "hidden" },
  btnFill: { borderRadius: radius.md },
  btnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingHorizontal: spacing.lg },
  btnText: { fontWeight: "700" },

  inputLabel: { fontSize: font.sm, color: colors.textSecondary, marginBottom: 6, textAlign: "right", fontWeight: "600" },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: font.base,
    color: colors.text,
    textAlign: "right",
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: font.base, color: colors.text, textAlign: "right" },

  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: "flex-start" },
  badgeText: { fontSize: font.xs, fontWeight: "700" },

  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md, marginTop: spacing.xs },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sectionTitle: { fontSize: font.md, fontWeight: "800", color: colors.text, textAlign: "right" },

  iconCircle: { alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  muted: { color: colors.textSecondary, fontSize: font.sm, textAlign: "right" },
});
