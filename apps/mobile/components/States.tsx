import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Inbox, TriangleAlert, RotateCw, type LucideProps } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { colors, spacing, font, radius } from "./theme";

export function LoadingState({ label = "جارٍ التحميل..." }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  label,
  icon: Icon = Inbox,
}: {
  label: string;
  icon?: React.ComponentType<LucideProps>;
}) {
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.borderLight }]}>
        <Icon size={34} color={colors.muted} strokeWidth={1.8} />
      </View>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.dangerLight }]}>
        <TriangleAlert size={34} color={colors.danger} strokeWidth={2} />
      </View>
      <Text style={styles.error}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retry} onPress={onRetry} activeOpacity={0.85}>
          <RotateCw size={16} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl, gap: spacing.md, backgroundColor: colors.bg },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.textSecondary, fontSize: font.base, textAlign: "center" },
  error: { color: colors.danger, fontSize: font.base, textAlign: "center", fontWeight: "600" },
  retry: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.primary },
  retryText: { color: colors.primary, fontWeight: "700", fontSize: font.sm },
});
