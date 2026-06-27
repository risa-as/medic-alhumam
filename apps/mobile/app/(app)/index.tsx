import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShoppingCart,
  Package,
  ChartColumnBig,
  Bell,
  Settings,
  Wallet,
  ReceiptText,
  TriangleAlert,
  Boxes,
  Trophy,
  ClipboardList,
  LayoutGrid,
  ChevronLeft,
  type LucideProps,
} from "lucide-react-native";
import { api } from "../../lib/api";
import { useAuth } from "../../store/auth";
import { colors, fmt, fmtMoney, spacing, font, radius, shadow, gradients, ROLE_LABEL } from "../../components/theme";
import { Screen, Hero, SectionTitle, Card } from "../../components/ui";
import { LoadingState, ErrorState } from "../../components/States";

interface MySales {
  count: number;
  totalRevenue: number;
}

interface AdminSummary {
  todayRevenue: number;
  todayCount: number;
  pendingOrders: number;
  lowStockAlerts: unknown[];
  topProducts: Array<{ nameAr: string; totalQty: number }>;
}

interface Action {
  label: string;
  icon: React.ComponentType<LucideProps>;
  href: Href;
  tint: string;
  bg: string;
}

export default function HomeScreen() {
  const user = useAuth((s) => s.user);
  const isAdmin = user?.role === "ADMIN";
  const router = useRouter();

  const [mine, setMine] = useState<MySales | null>(null);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const mineRes = await api.get<MySales>("/sales?mine=1&period=today");
      setMine(mineRes);
      if (isAdmin) {
        const s = await api.get<AdminSummary>("/dashboard/summary");
        setSummary(s);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر التحميل");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const today = new Date().toLocaleDateString("ar-IQ", { weekday: "long", day: "numeric", month: "long" });

  const actions: Action[] = [
    { label: "نقطة البيع", icon: ShoppingCart, href: "/(app)/pos", tint: colors.primary, bg: colors.primaryLight },
    { label: "المخزون", icon: Package, href: "/(app)/inventory", tint: colors.info, bg: colors.infoLight },
    ...(isAdmin
      ? ([
          { label: "الديون", icon: ClipboardList, href: "/(app)/debts", tint: colors.danger, bg: colors.dangerLight },
          { label: "التقارير", icon: ChartColumnBig, href: "/(app)/reports", tint: colors.success, bg: colors.successLight },
          { label: "التنبيهات", icon: Bell, href: "/(app)/alerts", tint: colors.warning, bg: colors.warningLight },
        ] as Action[])
      : []),
    { label: "الإعدادات", icon: Settings, href: "/(app)/settings", tint: colors.textSecondary, bg: colors.borderLight },
  ];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); void load(); }} />;

  // القيمة المميّزة: مبيعات المتجر (مدير) أو إيراد الموظف
  const featureValue = isAdmin ? (summary?.todayRevenue ?? 0) : (mine?.totalRevenue ?? 0);
  const featureCount = isAdmin ? (summary?.todayCount ?? 0) : (mine?.count ?? 0);

  return (
    <Screen
      scroll
      padded={false}
      refreshing={refreshing}
      onRefresh={() => { setRefreshing(true); void load(); }}
      header={<Hero title={`مرحبًا، ${user?.name ?? ""}`} subtitle={`${ROLE_LABEL[user?.role ?? ""] ?? ""} • ${today}`} icon={Wallet} />}
    >
      <View style={styles.body}>
        {/* ── بطاقة مميّزة (متدرّجة) ── */}
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.feature}>
          <View style={styles.featureTop}>
            <View style={styles.featureBadge}>
              <Wallet size={18} color={colors.white} strokeWidth={2.2} />
            </View>
            <Text style={styles.featureLabel}>{isAdmin ? "مبيعات المتجر اليوم" : "إيراد مبيعاتي اليوم"}</Text>
          </View>
          <Text style={styles.featureValue} numberOfLines={1} adjustsFontSizeToFit>{fmtMoney(featureValue)}</Text>
          <View style={styles.featurePills}>
            <View style={styles.featurePill}>
              <ReceiptText size={13} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.featurePillText}>{fmt(featureCount)} فاتورة</Text>
            </View>
            {isAdmin && summary && (
              <View style={styles.featurePill}>
                <Boxes size={13} color={colors.white} strokeWidth={2.2} />
                <Text style={styles.featurePillText}>{fmt(summary.pendingOrders)} طلب جديد</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ── إحصاءات ثانوية (المدير) ── */}
        {isAdmin && summary && (
          <View style={styles.statRow}>
            <MiniStat label="مبيعاتي اليوم" value={fmtMoney(mine?.totalRevenue ?? 0)} icon={Wallet} tint={colors.primary} bg={colors.primaryLight} />
            <MiniStat label="تنبيهات النقص" value={fmt(summary.lowStockAlerts.length)} icon={TriangleAlert} tint={colors.danger} bg={colors.dangerLight} />
          </View>
        )}

        {/* ── الأكثر مبيعًا اليوم (المدير) ── */}
        {isAdmin && summary?.topProducts[0] && (
          <Card style={styles.topCard} accent={colors.warning}>
            <View style={styles.topIcon}>
              <Trophy size={22} color={colors.warning} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topLabel}>الأكثر مبيعًا</Text>
              <Text style={styles.topName} numberOfLines={1}>{summary.topProducts[0].nameAr}</Text>
            </View>
            <View style={styles.topQty}>
              <Text style={styles.topQtyNum}>{fmt(summary.topProducts[0].totalQty)}</Text>
              <Text style={styles.topQtyUnit}>قطعة</Text>
            </View>
          </Card>
        )}

        {/* ── إجراءات سريعة ── */}
        <View style={{ marginTop: spacing.lg }}>
          <SectionTitle title="إجراءات سريعة" icon={LayoutGrid} />
          <View style={styles.grid}>
            {actions.map((a) => (
              <TouchableOpacity key={a.label} style={styles.tile} activeOpacity={0.85} onPress={() => router.push(a.href)}>
                <View style={[styles.tileIcon, { backgroundColor: a.bg }]}>
                  <a.icon size={22} color={a.tint} strokeWidth={2.2} />
                </View>
                <Text style={styles.tileLabel} numberOfLines={1}>{a.label}</Text>
                <ChevronLeft size={16} color={colors.muted} strokeWidth={2.2} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

function MiniStat({ label, value, icon: Icon, tint, bg }: { label: string; value: string; icon: React.ComponentType<LucideProps>; tint: string; bg: string }) {
  return (
    <View style={styles.mini}>
      <View style={[styles.miniIcon, { backgroundColor: bg }]}>
        <Icon size={18} color={tint} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.miniValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={styles.miniLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.md },

  // البطاقة المميّزة
  feature: { borderRadius: radius.lg, padding: spacing.xl, ...shadow.md },
  featureTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  featureBadge: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  featureLabel: { color: "rgba(255,255,255,0.9)", fontSize: font.sm, fontWeight: "600" },
  featureValue: { color: colors.white, fontSize: font.display, fontWeight: "800", marginTop: spacing.md, textAlign: "right" },
  featurePills: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  featurePill: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.16)", paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  featurePillText: { color: colors.white, fontSize: font.xs, fontWeight: "700" },

  // إحصاءات مصغّرة
  statRow: { flexDirection: "row", gap: spacing.md },
  mini: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, ...shadow.sm },
  miniIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  miniValue: { fontSize: font.md, fontWeight: "800", color: colors.text, textAlign: "right" },
  miniLabel: { fontSize: font.xs, color: colors.textSecondary, textAlign: "right", marginTop: 1 },

  // الأكثر مبيعًا
  topCard: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  topIcon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.warningLight, alignItems: "center", justifyContent: "center" },
  topLabel: { fontSize: font.xs, color: colors.textSecondary, textAlign: "center" },
  topName: { fontSize: font.md, fontWeight: "800", color: colors.text, textAlign: "center", marginTop: 2 },
  topQty: { alignItems: "center" },
  topQtyNum: { fontSize: font.lg, fontWeight: "800", color: colors.warning },
  topQtyUnit: { fontSize: font.xs, color: colors.textSecondary },

  // إجراءات سريعة
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: {
    width: "47.5%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  tileIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  tileLabel: { flex: 1, fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "right" },
});
