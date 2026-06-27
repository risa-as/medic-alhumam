import { useState, useCallback, useMemo } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { Bell, Boxes, ClipboardCheck, TriangleAlert, PackageX, CircleCheck } from "lucide-react-native";
import { api } from "../../../lib/api";
import { colors, fmt, spacing, font, radius, shadow } from "../../../components/theme";
import { Hero } from "../../../components/ui";
import { LoadingState, EmptyState, ErrorState } from "../../../components/States";

interface AlertProduct {
  id: string;
  nameAr: string;
  quantity: number;
  minQuantity: number;
}

interface Summary {
  lowStockAlerts: AlertProduct[];
  pendingOrders: number;
  reviewCount: number;
}

type Severity = "out" | "low";
const SEV: Record<Severity, { label: string; color: string; bg: string; icon: typeof PackageX }> = {
  out: { label: "نفد المخزون", color: colors.danger, bg: colors.dangerLight, icon: PackageX },
  low: { label: "مخزون منخفض", color: colors.warning, bg: colors.warningLight, icon: TriangleAlert },
};

export default function AlertsScreen() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await api.get<Summary>("/dashboard/summary");
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر التحميل");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const low = useMemo(() => data?.lowStockAlerts ?? [], [data]);

  // تقسيم حسب الخطورة: نفد أولًا، ثم منخفض — كلٌّ مرتّب بحسب حجم النقص
  const sections = useMemo(() => {
    const byDeficit = (a: AlertProduct, b: AlertProduct) => (b.minQuantity - b.quantity) - (a.minQuantity - a.quantity);
    const out = low.filter((p) => p.quantity < 1).sort(byDeficit);
    const lowOnly = low.filter((p) => p.quantity >= 1).sort(byDeficit);
    const s: { severity: Severity; data: AlertProduct[] }[] = [];
    if (out.length) s.push({ severity: "out", data: out });
    if (lowOnly.length) s.push({ severity: "low", data: lowOnly });
    return s;
  }, [low]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); void load(); }} />;

  const outCount = low.filter((p) => p.quantity < 1).length;
  const lowCount = low.length - outCount;

  return (
    <View style={styles.container}>
      <Hero title="التنبيهات" subtitle="ما يحتاج انتباهك الآن" icon={Bell} compact />

      <SectionList
        sections={sections}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); void load(); }}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View>
            {/* ملخّص عمليّ */}
            <View style={styles.summaryRow}>
              <SummaryCard num={data?.pendingOrders ?? 0} label="طلبات جديدة" icon={Boxes} tint={colors.info} bg={colors.infoLight} />
              <SummaryCard num={data?.reviewCount ?? 0} label="تسويات للمراجعة" icon={ClipboardCheck} tint={colors.warning} bg={colors.warningLight} />
            </View>

            {/* شريط حالة المخزون */}
            <View style={styles.stockBar}>
              <View style={styles.stockBarSide}>
                <View style={[styles.dot, { backgroundColor: colors.danger }]} />
                <Text style={styles.stockBarText}>نفد: <Text style={[styles.stockBarNum, { color: colors.danger }]}>{fmt(outCount)}</Text></Text>
              </View>
              <View style={styles.stockBarSep} />
              <View style={styles.stockBarSide}>
                <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                <Text style={styles.stockBarText}>منخفض: <Text style={[styles.stockBarNum, { color: colors.warning }]}>{fmt(lowCount)}</Text></Text>
              </View>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => {
          const sev = SEV[(section as { severity: Severity }).severity];
          const SecIcon = sev.icon;
          return (
            <View style={styles.secHead}>
              <View style={[styles.secIcon, { backgroundColor: sev.bg }]}>
                <SecIcon size={15} color={sev.color} strokeWidth={2.3} />
              </View>
              <Text style={[styles.secTitle, { color: sev.color }]}>{sev.label}</Text>
              <View style={[styles.secCount, { backgroundColor: sev.bg }]}>
                <Text style={[styles.secCountText, { color: sev.color }]}>{fmt((section as { data: AlertProduct[] }).data.length)}</Text>
              </View>
            </View>
          );
        }}
        renderItem={({ item, section }) => (
          <AlertCard item={item} severity={(section as { severity: Severity }).severity} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState label="المخزون كافٍ لجميع المنتجات ✓" icon={CircleCheck} />
          </View>
        }
      />
    </View>
  );
}

function AlertCard({ item, severity }: { item: AlertProduct; severity: Severity }) {
  const sev = SEV[severity];
  const Icon = sev.icon;
  const deficit = Math.max(0, item.minQuantity - item.quantity);
  const pct = item.minQuantity > 0 ? Math.min(100, Math.max(item.quantity > 0 ? 6 : 0, (item.quantity / item.minQuantity) * 100)) : 0;
  return (
    <View style={[styles.alert, { borderRightColor: sev.color }]}>
      <View style={[styles.alertIcon, { backgroundColor: sev.bg }]}>
        <Icon size={18} color={sev.color} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.alertName} numberOfLines={1}>{item.nameAr}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: sev.color }]} />
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaMuted}>الحد الأدنى {fmt(item.minQuantity)}</Text>
          {deficit > 0 && (
            <View style={[styles.deficit, { backgroundColor: sev.bg }]}>
              <Text style={[styles.deficitText, { color: sev.color }]}>نقص {fmt(deficit)}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.qtyWrap}>
        <Text style={[styles.qty, { color: sev.color }]}>{fmt(item.quantity)}</Text>
        <Text style={styles.qtyUnit}>متبقّي</Text>
      </View>
    </View>
  );
}

function SummaryCard({ num, label, icon: Icon, tint, bg }: { num: number; label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; tint: string; bg: string }) {
  return (
    <View style={styles.sumCard}>
      <View style={[styles.sumIcon, { backgroundColor: bg }]}>
        <Icon size={20} color={tint} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sumNum}>{fmt(num)}</Text>
        <Text style={styles.sumLabel} numberOfLines={1}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  // ملخّص
  summaryRow: { flexDirection: "row", gap: spacing.md },
  sumCard: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, ...shadow.sm },
  sumIcon: { width: 42, height: 42, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  sumNum: { fontSize: font.xl, fontWeight: "800", color: colors.text, textAlign: "right" },
  sumLabel: { fontSize: font.xs, color: colors.textSecondary, textAlign: "right", marginTop: 1 },

  // شريط حالة المخزون
  stockBar: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.md, marginTop: spacing.md, ...shadow.sm },
  stockBarSide: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  stockBarSep: { width: 1, height: 24, backgroundColor: colors.borderLight },
  dot: { width: 8, height: 8, borderRadius: 4 },
  stockBarText: { fontSize: font.sm, color: colors.textSecondary, fontWeight: "600" },
  stockBarNum: { fontWeight: "800", fontSize: font.base },

  // ترويسة القسم
  secHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.lg, marginBottom: spacing.sm },
  secIcon: { width: 26, height: 26, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  secTitle: { flex: 1, fontSize: font.md, fontWeight: "800", textAlign: "right" },
  secCount: { minWidth: 26, paddingHorizontal: 8, height: 22, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  secCountText: { fontSize: font.xs, fontWeight: "800" },

  // بطاقة تنبيه
  alert: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderRightWidth: 4, ...shadow.sm },
  alertIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  alertName: { fontSize: font.base, fontWeight: "700", color: colors.text, textAlign: "center" },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.borderLight, overflow: "hidden", marginTop: 8 },
  fill: { height: 6, borderRadius: 3 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  metaMuted: { fontSize: font.xs, color: colors.muted },
  deficit: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  deficitText: { fontSize: font.xs, fontWeight: "800" },
  qtyWrap: { alignItems: "center", minWidth: 48 },
  qty: { fontSize: font.xl, fontWeight: "800" },
  qtyUnit: { fontSize: 10, color: colors.muted, marginTop: -2 },

  emptyWrap: { paddingTop: spacing.xxl },
});
