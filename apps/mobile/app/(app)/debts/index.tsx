import { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ClipboardList,
  HandCoins,
  Wallet,
  CheckCircle2,
  ChevronDown,
  Phone,
  ReceiptText,
  X,
  TriangleAlert,
} from "lucide-react-native";
import { api } from "../../../lib/api";
import { colors, fmt, fmtMoney, spacing, font, radius, shadow, gradients } from "../../../components/theme";
import { Screen, Hero, SearchInput } from "../../../components/ui";
import { LoadingState, ErrorState, EmptyState } from "../../../components/States";

interface DebtInvoice {
  id: string;
  invoiceNo: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  createdAt: string;
}
interface CustomerDebtGroup {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
  invoiceCount: number;
  invoices: DebtInvoice[];
}
interface DebtsResponse {
  data: CustomerDebtGroup[];
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
}

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "مفتوح", color: colors.danger, bg: colors.dangerLight },
  PARTIAL: { label: "جزئي", color: colors.warning, bg: colors.warningLight },
  PAID: { label: "مسدّد", color: colors.success, bg: colors.successLight },
};

const FILTERS = [
  { key: "", label: "الكل" },
  { key: "OPEN", label: "مفتوح" },
  { key: "PARTIAL", label: "جزئي" },
  { key: "PAID", label: "مسدّد" },
];

function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, color: colors.muted, bg: colors.borderLight };
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Text style={[styles.pillText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function DebtsScreen() {
  const [data, setData] = useState<DebtsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paying, setPaying] = useState<CustomerDebtGroup | null>(null);

  const load = useCallback(
    async (st: string, term: string, silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (st) params.set("status", st);
        if (term.trim()) params.set("search", term.trim());
        const qs = params.toString();
        const res = await api.get<DebtsResponse>(`/debts${qs ? `?${qs}` : ""}`);
        setData(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "تعذّر تحميل الديون");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  // جلب أوّلي فوري (مع مؤشّر تحميل)، ثم بحث/فلترة مؤجّلان وصامتان
  const firstRef = useRef(true);
  useEffect(() => {
    const delay = firstRef.current ? 0 : 250;
    const t = setTimeout(() => {
      void load(status, search, !firstRef.current);
      firstRef.current = false;
    }, delay);
    return () => clearTimeout(t);
  }, [status, search, load]);

  const groups = data?.data ?? [];

  return (
    <Screen
      scroll
      padded={false}
      refreshing={refreshing}
      onRefresh={() => { setRefreshing(true); void load(status, search, true); }}
      header={<Hero title="دفتر الديون" subtitle="متابعة مديونيات الزبائن" icon={ClipboardList} />}
    >
      <View style={styles.body}>
        {/* بطاقة إجمالي المتبقّي */}
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.totalCard}>
          <View style={styles.totalIcon}>
            <HandCoins size={22} color={colors.white} strokeWidth={2.2} />
          </View>
          <Text style={styles.totalLabel}>إجمالي المتبقّي على الزبائن</Text>
          <Text style={styles.totalValue}>{fmtMoney(data?.totalRemaining ?? 0)}</Text>
        </LinearGradient>

        {/* مؤشّران */}
        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.dangerLight }]}>
              <Wallet size={18} color={colors.danger} strokeWidth={2.2} />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{fmtMoney(data?.totalAmount ?? 0)}</Text>
            <Text style={styles.kpiLabel}>إجمالي الديون</Text>
          </View>
          <View style={styles.kpi}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.successLight }]}>
              <CheckCircle2 size={18} color={colors.success} strokeWidth={2.2} />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{fmtMoney(data?.totalPaid ?? 0)}</Text>
            <Text style={styles.kpiLabel}>إجمالي المسدّد</Text>
          </View>
        </View>

        {/* بحث */}
        <View style={{ marginTop: spacing.lg }}>
          <SearchInput value={search} onChangeText={setSearch} placeholder="بحث باسم الزبون أو الهاتف..." />
        </View>

        {/* فلاتر الحالة */}
        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const active = status === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filter, active && styles.filterActive]}
                onPress={() => setStatus(f.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterText, active && { color: colors.white }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* القائمة */}
        {loading ? (
          <View style={{ paddingVertical: 40 }}><LoadingState /></View>
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load(status, search)} />
        ) : groups.length === 0 ? (
          <View style={{ paddingVertical: 30 }}>
            <EmptyState label="لا توجد ديون" icon={ClipboardList} />
          </View>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            {groups.map((g) => (
              <DebtCard
                key={g.id}
                group={g}
                open={expanded === g.id}
                onToggle={() => setExpanded(expanded === g.id ? null : g.id)}
                onPay={() => setPaying(g)}
              />
            ))}
          </View>
        )}
      </View>

      {/* مودال السداد */}
      <PayModal
        group={paying}
        onClose={() => setPaying(null)}
        onPaid={() => { setPaying(null); void load(status, search, true); }}
      />
    </Screen>
  );
}

/* ─────────────── بطاقة زبون قابلة للتوسيع ─────────────── */
function DebtCard({
  group,
  open,
  onToggle,
  onPay,
}: {
  group: CustomerDebtGroup;
  open: boolean;
  onToggle: () => void;
  onPay: () => void;
}) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHead} activeOpacity={0.8} onPress={onToggle}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{group.customerName.slice(0, 2)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName} numberOfLines={1}>{group.customerName}</Text>
          <View style={styles.cardMetaRow}>
            {!!group.customerPhone && (
              <View style={styles.metaItem}>
                <Phone size={12} color={colors.muted} strokeWidth={2} />
                <Text style={styles.metaText}>{group.customerPhone}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <ReceiptText size={12} color={colors.muted} strokeWidth={2} />
              <Text style={styles.metaText}>{fmt(group.invoiceCount)} فاتورة</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 5 }}>
          <Text style={styles.cardRemaining}>{fmt(group.remaining)}</Text>
          <StatusPill status={group.status} />
        </View>
        <ChevronDown
          size={18}
          color={colors.muted}
          strokeWidth={2.4}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.detail}>
          {group.invoices.map((inv) => (
            <View key={inv.id} style={styles.invRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.invNo}>#{inv.invoiceNo ?? "—"}</Text>
                <Text style={styles.invDate}>
                  {new Date(inv.createdAt).toLocaleDateString("ar-IQ", { year: "numeric", month: "2-digit", day: "2-digit" })}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 3 }}>
                <Text style={styles.invRemaining}>{fmtMoney(inv.remaining)}</Text>
                <StatusPill status={inv.status} />
              </View>
            </View>
          ))}

          {group.status !== "PAID" && (
            <TouchableOpacity style={styles.payBtn} activeOpacity={0.88} onPress={onPay}>
              <HandCoins size={17} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.payBtnText}>تسجيل دفعة سداد</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

/* ─────────────── مودال السداد ─────────────── */
function PayModal({
  group,
  onClose,
  onPaid,
}: {
  group: CustomerDebtGroup | null;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (group) { setAmount(String(group.remaining)); setError(null); }
  }, [group]);

  async function submit() {
    if (!group) return;
    const value = Number(amount);
    if (!value || value <= 0) { setError("أدخل مبلغًا صحيحًا"); return; }
    setLoading(true);
    setError(null);
    try {
      await api.post(`/customers/${group.customerId}/debt-payments`, { amount: value });
      onPaid();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تسجيل الدفعة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={!!group} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>تسجيل دفعة سداد</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={20} color={colors.muted} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          {group && (
            <>
              <View style={styles.payInfo}>
                <Text style={styles.payCustomer}>{group.customerName}</Text>
                <Text style={styles.payRemaining}>
                  إجمالي المتبقّي ({fmt(group.invoiceCount)} فاتورة):{" "}
                  <Text style={{ color: colors.danger, fontWeight: "800" }}>{fmtMoney(group.remaining)}</Text>
                </Text>
                <Text style={styles.payHint}>تُوزَّع الدفعة على فواتير الزبون بدءًا من الأقدم.</Text>
              </View>

              <Text style={styles.inputLabel}>مبلغ الدفعة</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />

              {error && (
                <View style={styles.errorBox}>
                  <TriangleAlert size={15} color={colors.danger} strokeWidth={2} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.confirm, (loading || !amount) && { opacity: 0.6 }]}
                activeOpacity={0.88}
                onPress={submit}
                disabled={loading || !amount}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <CheckCircle2 size={18} color={colors.white} strokeWidth={2.2} />
                    <Text style={styles.confirmText}>تأكيد السداد</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.lg },

  totalCard: { borderRadius: radius.lg, padding: spacing.xl, alignItems: "flex-start", ...shadow.md },
  totalIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center", marginBottom: spacing.sm,
  },
  totalLabel: { color: "rgba(255,255,255,0.85)", fontSize: font.sm, fontWeight: "600" },
  totalValue: { color: colors.white, fontSize: font.xxl, fontWeight: "800", marginTop: 4 },

  kpiRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  kpi: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, alignItems: "flex-start", ...shadow.sm },
  kpiIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  kpiValue: { fontSize: font.md, fontWeight: "800", color: colors.text },
  kpiLabel: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },

  filters: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  filter: { flex: 1, paddingVertical: 9, borderRadius: radius.md, backgroundColor: colors.card, alignItems: "center", ...shadow.sm },
  filterActive: { backgroundColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: font.sm, fontWeight: "700" },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, ...shadow.sm, overflow: "hidden" },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: colors.primary, fontWeight: "800", fontSize: font.base },
  cardName: { fontSize: font.md, fontWeight: "800", color: colors.text, textAlign: "right" },
  cardMetaRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginTop: 4, justifyContent: "flex-start" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: font.xs, color: colors.muted },
  cardRemaining: { fontSize: font.lg, fontWeight: "800", color: colors.danger },

  detail: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  invRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  invNo: { fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "right" },
  invDate: { fontSize: font.xs, color: colors.muted, marginTop: 2, textAlign: "right" },
  invRemaining: { fontSize: font.sm, fontWeight: "800", color: colors.danger },

  payBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    backgroundColor: colors.success, borderRadius: radius.md, paddingVertical: 13, marginTop: spacing.lg,
  },
  payBtnText: { color: colors.white, fontWeight: "800", fontSize: font.base },

  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill },
  pillText: { fontSize: font.xs, fontWeight: "800" },

  // مودال السداد
  sheetOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.55)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, paddingBottom: spacing.xxxl, ...shadow.lg },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: "center", marginBottom: spacing.lg },
  sheetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.lg },
  sheetTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text },

  payInfo: { backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  payCustomer: { fontSize: font.md, fontWeight: "800", color: colors.text, textAlign: "right" },
  payRemaining: { fontSize: font.sm, color: colors.textSecondary, marginTop: 6, textAlign: "right" },
  payHint: { fontSize: font.xs, color: colors.muted, marginTop: 6, textAlign: "right" },

  inputLabel: { fontSize: font.sm, color: colors.textSecondary, marginBottom: 6, textAlign: "right", fontWeight: "600" },
  input: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: font.lg, fontWeight: "800",
    color: colors.text, textAlign: "center",
  },

  errorBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.dangerLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  errorText: { color: colors.danger, fontSize: font.sm, fontWeight: "600", flex: 1, textAlign: "right" },

  confirm: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
    backgroundColor: colors.success, borderRadius: radius.md, paddingVertical: 15, marginTop: spacing.lg,
  },
  confirmText: { color: colors.white, fontWeight: "800", fontSize: font.md },
});
