import { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Pressable, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChartColumnBig, Wallet, TrendingUp, TrendingDown, Coins, ReceiptText, Users,
  CreditCard, Smartphone, Trophy, Percent, Boxes, Layers, PackageX, CalendarX, Hourglass, Tag, ListFilter, X, Check, CalendarDays
} from "lucide-react-native";
import { api } from "../../../lib/api";
import { colors, fmt, fmtMoney, spacing, font, radius, shadow, gradients } from "../../../components/theme";
import { Screen, Hero, SectionTitle } from "../../../components/ui";
import { ErrorState } from "../../../components/States";

/* ─────────── أنواع ─────────── */
interface PeriodTotals {
  totalRevenue: number; totalCount: number; totalProfit: number;
  avgOrder: number; expensesTotal: number; netProfit: number; discountsGiven: number;
}
interface Financial {
  totalRevenue: number; totalProfit: number; netProfit: number; expensesTotal: number;
  totalCount: number; avgOrder: number; margin: number | null; discountsGiven: number;
  previous: PeriodTotals;
  series: Array<{ date: string; revenue: number; profit: number; count: number }>;
  topProducts: Array<{ productId: string; nameAr: string; totalQty: number; totalRevenue: number; totalProfit: number }>;
  byUser: Array<{ name: string; revenue: number; count: number }>;
  byPaymentType: Array<{ type: string; label: string; revenue: number; count: number }>;
  byPlatform: Array<{ platform: string; label: string; revenue: number; count: number }>;
}
interface Inventory {
  stockValueCost: number; stockValueRetail: number; potentialProfit: number; totalUnits: number; totalSkus: number;
  lowStockCount: number; lowStock: Array<{ id: string; nameAr: string; sku: string; quantity: number; minQuantity: number }>;
  deadStockCount: number; deadStockValue: number; deadStock: Array<{ id: string; nameAr: string; sku: string; quantity: number; value: number }>;
  expiringCount: number; expiringValue: number; expiredCount: number;
  expiring: Array<{ id: string; nameAr: string; sku: string; remaining: number; value: number; expiryDate: string; daysLeft: number }>;
  byCategory: Array<{ name: string; cost: number; retail: number; units: number; potential: number }>;
}

type Tab = "financial" | "inventory";
export type DateRangeKey = "today" | "yesterday" | "7" | "thisMonth" | "lastMonth" | "custom";
const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "today", label: "اليوم" },
  { key: "yesterday", label: "أمس" },
  { key: "7", label: "آخر 7 أيام" },
  { key: "thisMonth", label: "هذا الشهر" },
  { key: "lastMonth", label: "الشهر الماضي" },
  { key: "custom", label: "مخصص" },
];

function delta(cur: number, prev: number): number | null {
  if (!prev) return null;
  return Math.round(((cur - prev) / Math.abs(prev)) * 100);
}

export default function ReportsScreen() {
  const [tab, setTab] = useState<Tab>("financial");
  const [days, setDays] = useState<DateRangeKey>("thisMonth");
  const [fin, setFin] = useState<Financial | null>(null);
  const [inv, setInv] = useState<Inventory | null>(null);
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [customFrom, setCustomFrom] = useState(new Date());
  const [customTo, setCustomTo] = useState(new Date());
  const [appliedCustomDates, setAppliedCustomDates] = useState({ from: new Date(), to: new Date() });
  const [pickerMode, setPickerMode] = useState<"from" | "to" | null>(null);

  const loadFin = useCallback(async (d: DateRangeKey, cFrom?: Date, cTo?: Date, isRefresh = false) => {
    setBusy(true); setError(null);
    if (!isRefresh) setFin(null);
    try {
      const now = new Date();
      let fromStr = "";
      let toStr = now.toISOString();

      if (d === "today") {
        fromStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      } else if (d === "yesterday") {
        const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        fromStr = y.toISOString();
        toStr = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, -1).toISOString();
      } else if (d === "7") {
        fromStr = new Date(now.getTime() - 7 * 86400000).toISOString();
      } else if (d === "thisMonth") {
        fromStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      } else if (d === "lastMonth") {
        fromStr = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        toStr = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString();
      } else if (d === "custom" && cFrom && cTo) {
        fromStr = new Date(cFrom.getFullYear(), cFrom.getMonth(), cFrom.getDate()).toISOString();
        toStr = new Date(cTo.getFullYear(), cTo.getMonth(), cTo.getDate(), 23, 59, 59, 999).toISOString();
      } else {
        fromStr = new Date(now.getTime() - 30 * 86400000).toISOString();
      }

      setFin(await api.get<Financial>(`/reports/financial?from=${fromStr}&to=${toStr}&groupBy=day`));
    } catch (e) { setError(e instanceof Error ? e.message : "تعذّر التحميل"); }
    finally { setBusy(false); setRefreshing(false); }
  }, []);

  const loadInv = useCallback(async (isRefresh = false) => {
    setBusy(true); setError(null);
    if (!isRefresh) setInv(null);
    try { setInv(await api.get<Inventory>("/reports/inventory")); }
    catch (e) { setError(e instanceof Error ? e.message : "تعذّر التحميل"); }
    finally { setBusy(false); setRefreshing(false); }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (tab === "financial") void loadFin(days, appliedCustomDates.from, appliedCustomDates.to, false);
      else void loadInv(false);
    }, [tab, days, appliedCustomDates, loadFin, loadInv]),
  );

  function onRefresh() {
    setRefreshing(true);
    if (tab === "financial") void loadFin(days, appliedCustomDates.from, appliedCustomDates.to, true);
    else void loadInv(true);
  }

  const activeData = tab === "financial" ? fin : inv;

  return (
    <Screen
      scroll
      padded={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      header={
        <>
          <Hero title="التقارير" subtitle="الأداء المالي وصحّة المخزون" icon={ChartColumnBig} compact />
          <View style={styles.tabsBar}>
            <TabBtn label="المالية" icon={Wallet} active={tab === "financial"} onPress={() => setTab("financial")} />
            <TabBtn label="المخزون" icon={Boxes} active={tab === "inventory"} onPress={() => setTab("inventory")} />
            {tab === "financial" && (
              <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterOpen(true)}>
                <CalendarDays size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </>
      }
    >
      <View style={styles.body}>
        {busy && !activeData ? (
          <View style={styles.loadingPad}><ActivityIndicator size="large" color={colors.primary} /></View>
        ) : error && !activeData ? (
          <ErrorState message={error} onRetry={() => (tab === "financial" ? void loadFin(days) : void loadInv())} />
        ) : tab === "financial" && fin ? (
          <FinancialView data={fin} days={days} onDays={setDays} />
        ) : tab === "inventory" && inv ? (
          <InventoryView data={inv} />
        ) : null}
      </View>
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayBg} onPress={() => setFilterOpen(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setFilterOpen(false)} activeOpacity={0.8}>
                <X size={20} color={colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>تحديد الفترة الزمنية</Text>
              <View style={{ width: 36 }} />
            </View>
            {RANGES.map((r) => {
              const active = days === r.key;
              return (
                <View key={r.key}>
                  <TouchableOpacity
                    style={[styles.modalOption, active && styles.modalOptionActive]}
                    onPress={() => {
                      setDays(r.key);
                      if (r.key !== "custom") setFilterOpen(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.modalOptionText, active && styles.modalOptionTextActive]}>{r.label}</Text>
                    {active ? <Check size={20} color={colors.primary} strokeWidth={3} /> : <View style={{ width: 20 }} />}
                  </TouchableOpacity>
                  {r.key === "custom" && active && (
                    <View style={styles.customDateContainer}>
                      <View style={styles.customDateRow}>
                        <TouchableOpacity style={styles.customDateBtn} onPress={() => setPickerMode("from")}>
                          <Text style={styles.customDateLabel}>مـن (From)</Text>
                          <Text style={styles.customDateValue}>{`${customFrom.getFullYear()}-${String(customFrom.getMonth() + 1).padStart(2, '0')}-${String(customFrom.getDate()).padStart(2, '0')}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.customDateBtn} onPress={() => setPickerMode("to")}>
                          <Text style={styles.customDateLabel}>إلـى (To)</Text>
                          <Text style={styles.customDateValue}>{`${customTo.getFullYear()}-${String(customTo.getMonth() + 1).padStart(2, '0')}-${String(customTo.getDate()).padStart(2, '0')}`}</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.applyBtn} onPress={() => {
                        setAppliedCustomDates({ from: customFrom, to: customTo });
                        setFilterOpen(false);
                      }}>
                        <Text style={styles.applyBtnText}>تطبيق الفلتر</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
      {pickerMode && (
        <DateTimePicker
          value={pickerMode === "from" ? customFrom : customTo}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setPickerMode(null);
            if (date) {
              if (pickerMode === "from") setCustomFrom(date);
              else setCustomTo(date);
            }
          }}
        />
      )}
    </Screen>
  );
}

/* ═════════════ التبويب المالي ═════════════ */
function FinancialView({ data, days, onDays }: { data: Financial; days: DateRangeKey; onDays: (d: DateRangeKey) => void }) {
  const maxRevenue = data.series.reduce((m, s) => Math.max(m, s.revenue), 0);
  const netD = delta(data.netProfit, data.previous.netProfit);
  const revD = delta(data.totalRevenue, data.previous.totalRevenue);
  const avgD = delta(data.avgOrder, data.previous.avgOrder);
  const topByProfit = [...data.topProducts].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 5);
  const maxProfit = topByProfit[0]?.totalProfit || 1;
  const maxUser = Math.max(1, ...data.byUser.map((u) => u.revenue));

  return (
    <>
      {/* صافي الربح — البطاقة الرئيسية */}
      <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroKpi}>
        <View style={styles.heroKpiTop}>
          <Text style={styles.heroKpiLabel}>صافي الربح (بعد المصاريف)</Text>
          <Delta value={netD} onLight />
        </View>
        <Text style={styles.heroKpiValue} numberOfLines={1} adjustsFontSizeToFit>{fmtMoney(data.netProfit)}</Text>
        <Text style={styles.heroKpiSub}>هامش {data.margin != null ? `${data.margin}%` : "—"} · ربح البضاعة {fmtMoney(data.totalProfit)}</Text>
      </LinearGradient>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <Kpi label="الإيرادات" value={fmtMoney(data.totalRevenue)} icon={Wallet} tint={colors.primary} bg={colors.primaryLight} d={revD} />
        <Kpi label="المصاريف" value={fmtMoney(data.expensesTotal)} icon={Coins} tint={colors.warning} bg={colors.warningLight} />
      </View>
      <View style={[styles.kpiRow, { marginTop: spacing.md }]}>
        <Kpi label="متوسط الفاتورة" value={fmtMoney(data.avgOrder)} icon={ReceiptText} tint={colors.info} bg={colors.infoLight} d={avgD} />
        <Kpi label="الخصومات" value={fmtMoney(data.discountsGiven)} icon={Percent} tint={colors.danger} bg={colors.dangerLight} />
      </View>

      {/* اتجاه الإيراد */}
      <View style={styles.section}>
        <SectionTitle title="اتجاه الإيراد اليومي" icon={ChartColumnBig} />
        <View style={styles.card}>
          {data.series.length === 0 ? (
            <Text style={styles.muted}>لا توجد مبيعات في الفترة</Text>
          ) : (
            data.series.slice(-14).map((s) => (
              <View key={s.date} style={styles.barRow}>
                <Text style={styles.barDate}>{s.date.slice(5)}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${maxRevenue ? Math.max((s.revenue / maxRevenue) * 100, 2) : 0}%` }]} />
                </View>
                <Text style={styles.barValue}>{fmt(s.revenue)}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* حسب الموظف */}
      {data.byUser.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="مبيعات الموظفين" icon={Users} />
          <View style={styles.card}>
            {data.byUser.map((u, i) => (
              <View key={u.name + i} style={[styles.userRow, i > 0 && styles.rowDivider]}>
                <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{u.name.slice(0, 2)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName} numberOfLines={1}>{u.name}</Text>
                  <View style={styles.userTrack}>
                    <View style={[styles.userFill, { width: `${Math.max(4, (u.revenue / maxUser) * 100)}%` }]} />
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.userRevenue}>{fmtMoney(u.revenue)}</Text>
                  <Text style={styles.userCount}>{fmt(u.count)} فاتورة</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* حسب طريقة الدفع */}
      {data.byPaymentType.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="حسب طريقة الدفع" icon={CreditCard} />
          <View style={styles.card}>
            {data.byPaymentType.map((p, i) => (
              <View key={p.type} style={[styles.listRow, i > 0 && styles.rowDivider]}>
                <Text style={styles.listLabel}>{p.label}</Text>
                <View>
                  <Text style={[styles.listValue, { textAlign: "left" }]}>{fmtMoney(p.revenue)}</Text>
                  <Text style={{ fontSize: font.xs, color: colors.muted, marginTop: 2, textAlign: "left" }}>{fmt(p.count)} عملية</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* حسب المنصّة */}
      {data.byPlatform.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="حسب المنصّة" icon={Smartphone} />
          <View style={styles.card}>
            {data.byPlatform.map((p, i) => (
              <View key={p.platform} style={[styles.listRow, i > 0 && styles.rowDivider]}>
                <Text style={styles.listLabel}>{p.label}</Text>
                <View>
                  <Text style={[styles.listValue, { textAlign: "left" }]}>{fmtMoney(p.revenue)}</Text>
                  <Text style={{ fontSize: font.xs, color: colors.muted, marginTop: 2, textAlign: "left" }}>{fmt(p.count)} عملية</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* أعلى المنتجات ربحًا */}
      <View style={styles.section}>
        <SectionTitle title="أعلى المنتجات ربحًا" icon={Trophy} />
        <View style={styles.card}>
          {topByProfit.length === 0 ? (
            <Text style={styles.muted}>لا بيانات</Text>
          ) : (
            topByProfit.map((p, i) => (
              <View key={p.productId} style={[styles.rankRow, i > 0 && styles.rowDivider]}>
                <View style={[styles.rank, i === 0 && { backgroundColor: colors.warning }]}>
                  <Text style={[styles.rankText, i === 0 && { color: colors.white }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankName} numberOfLines={1}>{p.nameAr}</Text>
                  <View style={styles.userTrack}>
                    <View style={[styles.userFill, { width: `${Math.max(4, (p.totalProfit / maxProfit) * 100)}%`, backgroundColor: colors.success }]} />
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.rankProfit}>+{fmt(p.totalProfit)}</Text>
                  <Text style={styles.userCount}>{fmt(p.totalQty)} قطعة</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </>
  );
}

/* ═════════════ تبويب المخزون ═════════════ */
function InventoryView({ data }: { data: Inventory }) {
  return (
    <>
      {/* قيمة المخزون */}
      <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroKpi}>
        <View style={styles.heroKpiTop}>
          <Text style={styles.heroKpiLabel}>قيمة المخزون (بالتكلفة)</Text>
          <View style={styles.invBadge}><Boxes size={13} color={colors.white} strokeWidth={2.2} /><Text style={styles.invBadgeText}>{fmt(data.totalUnits)} وحدة</Text></View>
        </View>
        <Text style={styles.heroKpiValue} numberOfLines={1} adjustsFontSizeToFit>{fmtMoney(data.stockValueCost)}</Text>
        <Text style={styles.heroKpiSub}>ربح محتمل {fmtMoney(data.potentialProfit)} · {fmt(data.totalSkus)} صنف</Text>
      </LinearGradient>

      {/* بطاقات الصحّة */}
      <View style={styles.kpiRow}>
        <Kpi label="بضاعة راكدة" value={fmt(data.deadStockCount)} sub={fmtMoney(data.deadStockValue)} icon={PackageX} tint={data.deadStockCount ? colors.warning : colors.muted} bg={colors.warningLight} />
        <Kpi label="قرب الانتهاء" value={fmt(data.expiringCount)} sub={fmtMoney(data.expiringValue)} icon={CalendarX} tint={data.expiringCount ? colors.danger : colors.muted} bg={colors.dangerLight} />
      </View>
      <View style={[styles.kpiRow, { marginTop: spacing.md }]}>
        <Kpi label="نواقص المخزون" value={fmt(data.lowStockCount)} sub="تحت حد التنبيه" icon={Hourglass} tint={data.lowStockCount ? colors.danger : colors.muted} bg={colors.dangerLight} />
        <Kpi label="القيمة بالبيع" value={fmtMoney(data.stockValueRetail)} sub={`${fmt(data.totalSkus)} صنف`} icon={Layers} tint={colors.primary} bg={colors.primaryLight} />
      </View>

      {/* قرب انتهاء الصلاحية */}
      {data.expiring.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title={`قرب انتهاء الصلاحية (${fmt(data.expiringCount)})`} icon={CalendarX} />
          <View style={styles.card}>
            {data.expiring.slice(0, 8).map((e, i) => {
              const expired = e.daysLeft < 0;
              const c = expired ? colors.danger : e.daysLeft <= 14 ? colors.danger : colors.warning;
              return (
                <View key={e.id} style={[styles.invRow, i > 0 && styles.rowDivider]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invName} numberOfLines={1}>{e.nameAr}</Text>
                    <Text style={styles.invMeta}>{fmt(e.remaining)} وحدة · {fmtMoney(e.value)}</Text>
                  </View>
                  <View style={[styles.daysBadge, { backgroundColor: expired ? colors.dangerLight : colors.warningLight }]}>
                    <Text style={[styles.daysText, { color: c }]}>{expired ? "منتهٍ" : `${fmt(e.daysLeft)} يوم`}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* بضاعة راكدة */}
      {data.deadStock.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title={`بضاعة راكدة (${fmt(data.deadStockCount)})`} icon={PackageX} />
          <View style={styles.card}>
            {data.deadStock.slice(0, 8).map((d, i) => (
              <View key={d.id} style={[styles.invRow, i > 0 && styles.rowDivider]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invName} numberOfLines={1}>{d.nameAr}</Text>
                  <Text style={styles.invMeta}>{fmt(d.quantity)} قطعة بلا مبيعات</Text>
                </View>
                <Text style={styles.invValue}>{fmtMoney(d.value)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* حسب الفئة */}
      {data.byCategory.length > 0 && (
        <View style={styles.section}>
          <SectionTitle title="قيمة المخزون حسب الفئة" icon={Tag} />
          <View style={styles.card}>
            {data.byCategory.slice(0, 8).map((c, i) => (
              <View key={c.name + i} style={[styles.invRow, i > 0 && styles.rowDivider]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invName} numberOfLines={1}>{c.name}</Text>
                  <Text style={styles.invMeta}>{fmt(c.units)} وحدة</Text>
                </View>
                <Text style={styles.invValue}>{fmtMoney(c.cost)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

/* ─────────── مكوّنات مساعدة ─────────── */
function TabBtn({ label, icon: Icon, active, onPress }: { label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={onPress} activeOpacity={0.85}>
      <Icon size={17} color={active ? colors.primary : colors.muted} strokeWidth={2.3} />
      <Text style={[styles.tabBtnText, active && { color: colors.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Delta({ value, onLight }: { value: number | null; onLight?: boolean }) {
  if (value == null) return null;
  const up = value >= 0;
  const bg = onLight ? (up ? "rgba(255,255,255,0.2)" : "rgba(185,28,28,0.4)") : up ? colors.successLight : colors.dangerLight;
  const fg = onLight ? colors.white : up ? colors.success : colors.danger;
  return (
    <View style={[styles.delta, { backgroundColor: bg }]}>
      {up ? <TrendingUp size={12} color={fg} strokeWidth={2.4} /> : <TrendingDown size={12} color={fg} strokeWidth={2.4} />}
      <Text style={[styles.deltaText, { color: fg }]}>{Math.abs(value)}%</Text>
    </View>
  );
}

function Kpi({ label, value, sub, icon: Icon, tint, bg, d }: { label: string; value: string; sub?: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; tint: string; bg: string; d?: number | null }) {
  return (
    <View style={styles.kpi}>
      <View style={styles.kpiTop}>
        <View style={[styles.kpiIcon, { backgroundColor: bg }]}><Icon size={18} color={tint} strokeWidth={2.2} /></View>
        {d != null && <Delta value={d} />}
      </View>
      <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      {!!sub && <Text style={styles.kpiSub} numberOfLines={1}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },
  loadingPad: { paddingVertical: 70, alignItems: "center" },

  tabsBar: { flexDirection: "row", gap: spacing.sm, backgroundColor: colors.card, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight, alignItems: "center" },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: radius.md, backgroundColor: colors.bg },
  tabBtnActive: { backgroundColor: colors.primaryLight },
  tabBtnText: { fontSize: font.sm, fontWeight: "700", color: colors.muted },
  filterBtn: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },

  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalOverlayBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.xl, paddingBottom: spacing.xxl, ...shadow.lg },
  modalHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: "center", marginBottom: spacing.lg },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl },
  modalTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  
  modalOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.sm, backgroundColor: colors.bg },
  modalOptionActive: { backgroundColor: colors.primaryLight, borderWidth: 1.5, borderColor: "rgba(26, 82, 118, 0.15)" },
  modalOptionText: { fontSize: font.md, fontWeight: "700", color: colors.textSecondary },
  modalOptionTextActive: { color: colors.primary, fontWeight: "800" },

  customDateContainer: { backgroundColor: colors.bg, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.sm, marginTop: 4, borderWidth: 1, borderColor: colors.borderLight },
  customDateRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  customDateBtn: { flex: 1, backgroundColor: colors.card, padding: spacing.md, borderRadius: radius.md, alignItems: "center", ...shadow.sm },
  customDateLabel: { fontSize: font.xs, color: colors.textSecondary, marginBottom: 4 },
  customDateValue: { fontSize: font.sm, fontWeight: "700", color: colors.text },
  applyBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: "center" },
  applyBtnText: { color: colors.white, fontSize: font.sm, fontWeight: "700" },

  heroKpi: { borderRadius: radius.lg, padding: spacing.xl, ...shadow.md },
  heroKpiTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroKpiLabel: { color: "rgba(255,255,255,0.85)", fontSize: font.sm, fontWeight: "600" },
  heroKpiValue: { color: colors.white, fontSize: font.xxl, fontWeight: "800", marginTop: spacing.sm, textAlign: "right" },
  heroKpiSub: { color: "rgba(255,255,255,0.8)", fontSize: font.xs, marginTop: 4 },
  invBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  invBadgeText: { color: colors.white, fontSize: font.xs, fontWeight: "700" },

  delta: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  deltaText: { fontSize: font.xs, fontWeight: "800" },

  kpiRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  kpi: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, ...shadow.sm },
  kpiTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  kpiIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  kpiValue: { fontSize: font.lg, fontWeight: "800", color: colors.text, textAlign: "right" },
  kpiLabel: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2, textAlign: "right" },
  kpiSub: { fontSize: font.xs, color: colors.muted, marginTop: 1, textAlign: "right" },

  section: { marginTop: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, ...shadow.sm },
  muted: { color: colors.textSecondary, fontSize: font.sm, textAlign: "center", paddingVertical: spacing.md },

  barRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm, gap: spacing.sm },
  barDate: { fontSize: font.xs, color: colors.muted, width: 38, textAlign: "right" },
  barTrack: { flex: 1, height: 16, backgroundColor: colors.borderLight, borderRadius: radius.sm, overflow: "hidden" },
  barFill: { height: 16, backgroundColor: colors.primary, borderRadius: radius.sm },
  barValue: { fontSize: font.xs, color: colors.text, width: 64, textAlign: "right", fontWeight: "600" },

  rowDivider: { borderTopWidth: 1, borderTopColor: colors.borderLight },
  listRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm },
  listLabel: { fontSize: font.sm, color: colors.text, flex: 1, textAlign: "right", fontWeight: "600" },
  listValue: { fontSize: font.sm, color: colors.textSecondary, fontWeight: "700" },

  userRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  userAvatarText: { fontSize: font.xs, fontWeight: "800", color: colors.primary },
  userName: { fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "left" },
  userTrack: { height: 5, backgroundColor: colors.borderLight, borderRadius: 3, overflow: "hidden", marginTop: 5 },
  userFill: { height: 5, borderRadius: 3, backgroundColor: colors.primary },
  userRevenue: { fontSize: font.sm, fontWeight: "800", color: colors.text },
  userCount: { fontSize: font.xs, color: colors.muted, marginTop: 1 },

  rankRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  rank: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.borderLight, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: font.xs, fontWeight: "800", color: colors.textSecondary },
  rankName: { fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "left" },
  rankProfit: { fontSize: font.sm, fontWeight: "800", color: colors.success },

  invRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md },
  invName: { fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "left" },
  invMeta: { fontSize: font.xs, color: colors.muted, textAlign: "left", marginTop: 2 },
  invValue: { fontSize: font.sm, fontWeight: "800", color: colors.text },
  daysBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  daysText: { fontSize: font.xs, fontWeight: "800" },
});
