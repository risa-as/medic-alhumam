import { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Package, PackageX, TriangleAlert, CircleCheck, ScanLine, Truck, X, Plus,
  Pencil, Trash2, Coins, ChevronLeft,
} from "lucide-react-native";
import { api } from "../../../lib/api";
import { useAuth } from "../../../store/auth";
import { colors, fmt, fmtMoney, spacing, font, radius, shadow } from "../../../components/theme";
import { Hero, SearchInput, Button } from "../../../components/ui";
import { BarcodeScannerModal } from "../../../components/BarcodeScanner";
import { ProductSheet, type FullProduct } from "../../../components/ProductSheet";
import { LoadingState, EmptyState, ErrorState } from "../../../components/States";

interface Product {
  id: string;
  nameAr: string;
  sku: string;
  salePrice: number;
  costPrice?: number; // غائب للـ CASHIER (مفلتر على الخادم — FR-041)
  quantity: number;
  minQuantity: number;
}

type Filter = "all" | "low" | "out";
type SheetState = { mode: "create"; sku: string } | { mode: "edit"; product: FullProduct } | null;

function stockStatus(p: Product) {
  if (p.quantity < 1) return { label: "نفد", color: colors.danger, bg: colors.dangerLight, icon: PackageX };
  if (p.quantity <= p.minQuantity) return { label: "منخفض", color: colors.warning, bg: colors.warningLight, icon: TriangleAlert };
  return { label: "متوفر", color: colors.success, bg: colors.successLight, icon: CircleCheck };
}

export default function InventoryScreen() {
  const isAdmin = useAuth((s) => s.user?.role === "ADMIN");
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // الباركود
  const [scanOpen, setScanOpen] = useState(false);
  const scanLock = useRef(false);

  // إضافة دفعة (شحنة)
  const [target, setTarget] = useState<Product | null>(null);
  const [bQty, setBQty] = useState("");
  const [bCost, setBCost] = useState("");
  const [bNote, setBNote] = useState("");
  const [saving, setSaving] = useState(false);

  // إنشاء/تعديل منتج
  const [sheet, setSheet] = useState<SheetState>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);

  // إجراءات المنتج + الحذف
  const [actionTarget, setActionTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (q = "") => {
    setError(null);
    try {
      const res = await api.get<{ data: Product[] }>(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setProducts(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر التحميل");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(query);
    }, [load]),
  );

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  }

  function openBatch(p: Product) {
    setActionTarget(null);
    setTarget(p);
    setBQty("");
    setBCost(p.costPrice != null ? String(p.costPrice) : "");
    setBNote("");
  }

  async function openEdit(p: Product) {
    setEditLoadingId(p.id);
    try {
      const full = await api.get<FullProduct>(`/products/${p.id}`);
      setActionTarget(null);
      setSheet({ mode: "edit", product: full });
    } catch (e) {
      flash(e instanceof Error ? e.message : "تعذّر جلب بيانات المنتج");
    } finally {
      setEditLoadingId(null);
    }
  }

  async function handleScan(code: string) {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanOpen(false);
    try {
      const res = await api.get<{ data: Product[] }>(`/products?q=${encodeURIComponent(code)}`);
      const match = res.data.find((p) => p.sku?.toLowerCase() === code.toLowerCase());
      if (match) openBatch(match);
      else setSheet({ mode: "create", sku: code }); // باركود غير مسجّل → إنشاء منتج
    } catch {
      flash("تعذّر البحث عن المنتج");
    } finally {
      setTimeout(() => { scanLock.current = false; }, 700);
    }
  }

  async function submitBatch() {
    if (!target) return;
    const qty = parseInt(bQty, 10);
    const cost = Number(bCost);
    if (!qty || qty <= 0) return flash("أدخل كمية صحيحة");
    if (bCost.trim() === "" || !(cost >= 0)) return flash("أدخل سعر الشراء");

    setSaving(true);
    try {
      await api.post("/stock-movements", {
        productId: target.id,
        type: "PURCHASE",
        quantity: qty,
        costPrice: cost,
        ...(bNote.trim() ? { reason: bNote.trim() } : {}),
      });
      const name = target.nameAr;
      setTarget(null);
      flash(`أُضيفت دفعة (${fmt(qty)} قطعة) إلى ${name}`);
      void load(query);
    } catch (e) {
      flash(e instanceof Error ? e.message : "تعذّر إضافة الدفعة");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.del(`/products/${deleteTarget.id}`);
      const name = deleteTarget.nameAr;
      setDeleteTarget(null);
      flash(`حُذف المنتج: ${name}`);
      void load(query);
    } catch (e) {
      flash(e instanceof Error ? e.message : "تعذّر الحذف — قد يكون للمنتج مبيعات");
    } finally {
      setDeleting(false);
    }
  }

  const stats = useMemo(() => {
    const total = products.length;
    const low = products.filter((p) => p.quantity <= p.minQuantity).length;
    const out = products.filter((p) => p.quantity < 1).length;
    const value = isAdmin ? products.reduce((s, p) => s + (p.costPrice ?? 0) * p.quantity, 0) : null;
    return { total, low, out, value };
  }, [products, isAdmin]);

  const shown = useMemo(() => {
    if (filter === "low") return products.filter((p) => p.quantity <= p.minQuantity);
    if (filter === "out") return products.filter((p) => p.quantity < 1);
    return products;
  }, [products, filter]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => { setLoading(true); void load(query); }} />;

  return (
    <View style={styles.container}>
      <Hero title="المخزون" subtitle="إدارة المنتجات والمخزون" icon={Package} compact />

      {/* ── إحصاءات (صفّ ثابت — بلا تمرير حتى لا تُقصّ) ── */}
      <View style={styles.statsWrap}>
        <View style={styles.statsRow}>
          <Stat icon={Package} label="إجمالي" value={fmt(stats.total)} tint={colors.primary} bg={colors.primaryLight} />
          <Stat icon={TriangleAlert} label="نواقص" value={fmt(stats.low)} tint={colors.warning} bg={colors.warningLight} />
          <Stat icon={PackageX} label="نفد" value={fmt(stats.out)} tint={colors.danger} bg={colors.dangerLight} />
        </View>
        {stats.value != null && (
          <View style={styles.valueBar}>
            <View style={styles.valueIcon}><Coins size={18} color={colors.success} strokeWidth={2.2} /></View>
            <Text style={styles.valueLabel}>قيمة المخزون (بالتكلفة)</Text>
            <Text style={styles.valueVal}>{fmtMoney(stats.value)}</Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchInput value={query} placeholder="بحث بالاسم أو الباركود..." onChangeText={(t) => { setQuery(t); void load(t); }} />
          </View>
          {isAdmin && (
            <>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => { scanLock.current = false; setScanOpen(true); }}>
                <ScanLine size={22} color={colors.white} strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, styles.addBtn]} activeOpacity={0.85} onPress={() => setSheet({ mode: "create", sku: "" })}>
                <Plus size={24} color={colors.white} strokeWidth={2.6} />
              </TouchableOpacity>
            </>
          )}
        </View>
        {isAdmin && <Text style={styles.hintLine}>اضغط على منتج للإجراءات (تعديل/دفعة/حذف) · امسح باركودًا جديدًا لإضافة منتج.</Text>}
        <View style={styles.filters}>
          <FilterChip label="الكل" active={filter === "all"} onPress={() => setFilter("all")} />
          <FilterChip label={`نواقص (${fmt(stats.low)})`} active={filter === "low"} onPress={() => setFilter("low")} tone="warning" />
          <FilterChip label={`نفد (${fmt(stats.out)})`} active={filter === "out"} onPress={() => setFilter("out")} tone="danger" />
        </View>
      </View>

      <FlatList
        data={shown}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => { setRefreshing(true); void load(query); }}
        ListEmptyComponent={<EmptyState label={filter === "all" ? "لا توجد منتجات" : "لا عناصر في هذا الفلتر ✓"} icon={filter === "all" ? Package : CircleCheck} />}
        renderItem={({ item }) => {
          const s = stockStatus(item);
          const Wrapper: any = isAdmin ? TouchableOpacity : View;
          return (
            <Wrapper style={styles.card} {...(isAdmin ? { activeOpacity: 0.85, onPress: () => setActionTarget(item) } : {})}>
              <View style={[styles.icon, { backgroundColor: s.bg }]}>
                <s.icon size={20} color={s.color} strokeWidth={2.2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{item.nameAr}</Text>
                <Text style={styles.sku}>{item.sku}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.price}>{fmtMoney(item.salePrice)}</Text>
                  {item.costPrice != null && <Text style={styles.cost}>كلفة {fmtMoney(item.costPrice)}</Text>}
                </View>
              </View>
              <View style={styles.right}>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                  <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                </View>
                <Text style={styles.qty}>{fmt(item.quantity)}</Text>
                <Text style={styles.qtyUnit}>قطعة</Text>
              </View>
            </Wrapper>
          );
        }}
      />

      {/* توست */}
      {toast && (
        <View style={[styles.toast, { bottom: insets.bottom + 24 }]} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* ماسح الباركود */}
      <BarcodeScannerModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        onScan={handleScan}
        title="مسح باركود المنتج"
        hint="وجّه الكاميرا نحو الباركود"
      />

      {/* مودال إنشاء/تعديل منتج */}
      <ProductSheet
        visible={sheet != null}
        mode={sheet?.mode ?? "create"}
        initialSku={sheet?.mode === "create" ? sheet.sku : ""}
        product={sheet?.mode === "edit" ? sheet.product : undefined}
        onClose={() => setSheet(null)}
        onSaved={(name) => { const wasEdit = sheet?.mode === "edit"; setSheet(null); flash(wasEdit ? `حُفظت تعديلات: ${name}` : `أُضيف المنتج: ${name}`); void load(query); }}
      />

      {/* مودال إجراءات المنتج */}
      <Modal visible={!!actionTarget} animationType="fade" transparent onRequestClose={() => setActionTarget(null)}>
        <TouchableOpacity style={styles.centerOverlay} activeOpacity={1} onPress={() => setActionTarget(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.actionCard}>
            <Text style={styles.actionTitle} numberOfLines={1}>{actionTarget?.nameAr}</Text>
            <Text style={styles.actionSub}>{actionTarget?.sku} · {fmt(actionTarget?.quantity ?? 0)} قطعة</Text>

            <ActionRow icon={Pencil} label="تعديل المنتج" tint={colors.primary} bg={colors.primaryLight} loading={editLoadingId === actionTarget?.id} onPress={() => actionTarget && openEdit(actionTarget)} />
            <ActionRow icon={Truck} label="إضافة دفعة (شحنة)" tint={colors.success} bg={colors.successLight} onPress={() => actionTarget && openBatch(actionTarget)} />
            <ActionRow icon={Trash2} label="حذف المنتج" tint={colors.danger} bg={colors.dangerLight} onPress={() => { const t = actionTarget; setActionTarget(null); setDeleteTarget(t); }} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* تأكيد الحذف */}
      <Modal visible={!!deleteTarget} animationType="fade" transparent onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.centerOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}><Trash2 size={26} color={colors.danger} strokeWidth={2} /></View>
            <Text style={styles.confirmTitle}>حذف المنتج؟</Text>
            <Text style={styles.confirmText}>سيُحذف «{deleteTarget?.nameAr}» نهائيًّا. لا يمكن التراجع.</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity style={[styles.confirmBtn, styles.cancelBtn]} onPress={() => setDeleteTarget(null)} disabled={deleting} activeOpacity={0.85}>
                <Text style={styles.cancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.delBtn]} onPress={confirmDelete} disabled={deleting} activeOpacity={0.85}>
                {deleting ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={styles.delText}>حذف</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* مودال إضافة دفعة */}
      <Modal visible={!!target} animationType="slide" transparent onRequestClose={() => setTarget(null)}>
        <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setTarget(null)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <View style={styles.sheetIcon}>
                  <Truck size={20} color={colors.primary} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>إضافة دفعة</Text>
                  <Text style={styles.sheetSub} numberOfLines={1}>{target?.nameAr}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setTarget(null)} hitSlop={10}>
                <X size={22} color={colors.textSecondary} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.curRow}>
                <Text style={styles.curLabel}>الكمية الحالية</Text>
                <Text style={styles.curVal}>{fmt(target?.quantity ?? 0)} قطعة</Text>
              </View>

              <View style={styles.fieldsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>الكمية المضافة *</Text>
                  <TextInput style={styles.input} value={bQty} onChangeText={setBQty} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>سعر الشراء (للقطعة) *</Text>
                  <TextInput style={styles.input} value={bCost} onChangeText={setBCost} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
                </View>
              </View>

              <Text style={styles.label}>ملاحظة (اختياري)</Text>
              <TextInput style={styles.input} value={bNote} onChangeText={setBNote} placeholder="رقم الفاتورة أو المورّد..." placeholderTextColor={colors.muted} />

              {!!bQty && parseInt(bQty, 10) > 0 && (
                <View style={styles.preview}>
                  <Text style={styles.previewText}>الكمية بعد الإضافة</Text>
                  <Text style={styles.previewVal}>{fmt((target?.quantity ?? 0) + (parseInt(bQty, 10) || 0))} قطعة</Text>
                </View>
              )}

              <Button title="إضافة الدفعة" icon={Plus} onPress={submitBatch} loading={saving} size="lg" style={{ marginTop: spacing.lg }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function Stat({ icon: Icon, label, value, tint, bg }: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string; value: string; tint: string; bg: string }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Icon size={16} color={tint} strokeWidth={2.2} />
      </View>
      <Text style={styles.statVal} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.statLbl} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function ActionRow({ icon: Icon, label, tint, bg, onPress, loading }: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; label: string; tint: string; bg: string; onPress: () => void; loading?: boolean }) {
  return (
    <TouchableOpacity style={styles.actionRow} activeOpacity={0.8} onPress={onPress} disabled={loading}>
      <View style={[styles.actionIcon, { backgroundColor: bg }]}>
        {loading ? <ActivityIndicator size="small" color={tint} /> : <Icon size={18} color={tint} strokeWidth={2.2} />}
      </View>
      <Text style={[styles.actionLabel, { color: tint }]}>{label}</Text>
      <ChevronLeft size={18} color={colors.muted} strokeWidth={2.2} />
    </TouchableOpacity>
  );
}

function FilterChip({ label, active, onPress, tone }: { label: string; active: boolean; onPress: () => void; tone?: "warning" | "danger" }) {
  const tint = tone === "danger" ? colors.danger : tone === "warning" ? colors.warning : colors.primary;
  return (
    <TouchableOpacity style={[styles.chip, active && { backgroundColor: tint, borderColor: tint }]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  statsWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  statsRow: { flexDirection: "row", gap: spacing.sm },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: spacing.md, paddingHorizontal: spacing.xs, alignItems: "center", gap: 4, ...shadow.sm },
  statIcon: { width: 32, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: font.lg, fontWeight: "800", color: colors.text },
  statLbl: { fontSize: font.xs, color: colors.textSecondary },
  valueBar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm, ...shadow.sm },
  valueIcon: { width: 34, height: 34, borderRadius: radius.md, backgroundColor: colors.successLight, alignItems: "center", justifyContent: "center" },
  valueLabel: { flex: 1, fontSize: font.sm, color: colors.textSecondary, fontWeight: "600", textAlign: "left" },
  valueVal: { fontSize: font.md, fontWeight: "800", color: colors.success },

  controls: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.md },
  searchRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconBtn: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...shadow.sm },
  addBtn: { backgroundColor: colors.success },
  hintLine: { fontSize: font.xs, color: colors.textSecondary, textAlign: "right", marginTop: -spacing.xs },
  filters: { flexDirection: "row", gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  chipText: { fontSize: font.sm, fontWeight: "700", color: colors.textSecondary },

  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow.sm },
  icon: { width: 42, height: 42, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  name: { fontSize: font.base, fontWeight: "700", color: colors.text, textAlign: "left" },
  sku: { fontSize: font.xs, color: colors.muted, textAlign: "left", marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: 4 },
  price: { fontSize: font.sm, fontWeight: "700", color: colors.primary },
  cost: { fontSize: font.xs, color: colors.textSecondary },
  right: { alignItems: "center", gap: 2, minWidth: 56 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, marginBottom: 2 },
  badgeText: { fontSize: font.xs, fontWeight: "800" },
  qty: { fontSize: font.lg, fontWeight: "800", color: colors.text },
  qtyUnit: { fontSize: 10, color: colors.muted },

  toast: { position: "absolute", alignSelf: "center", backgroundColor: "rgba(13,27,42,0.92)", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, maxWidth: "90%" },
  toastText: { color: colors.white, fontSize: font.sm, fontWeight: "600", textAlign: "center" },

  // مودال إجراءات + تأكيد (مركزي)
  centerOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.5)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  actionCard: { width: "100%", maxWidth: 360, backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg, ...shadow.lg },
  actionTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text, textAlign: "center" },
  actionSub: { fontSize: font.sm, color: colors.textSecondary, textAlign: "center", marginTop: 2, marginBottom: spacing.md },
  actionRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, borderRadius: radius.md },
  actionIcon: { width: 38, height: 38, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  actionLabel: { flex: 1, fontSize: font.base, fontWeight: "700", textAlign: "right" },

  confirmCard: { width: "100%", maxWidth: 340, backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.xl, alignItems: "center", ...shadow.lg },
  confirmIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dangerLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  confirmTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text },
  confirmText: { fontSize: font.sm, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm, lineHeight: 20 },
  confirmBtns: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg, alignSelf: "stretch" },
  confirmBtn: { flex: 1, paddingVertical: 13, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  cancelBtn: { backgroundColor: colors.borderLight, borderWidth: 1, borderColor: colors.border },
  cancelText: { fontSize: font.base, fontWeight: "700", color: colors.text },
  delBtn: { backgroundColor: colors.danger },
  delText: { fontSize: font.base, fontWeight: "800", color: colors.white },

  // مودال الدفعة
  sheetOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, maxHeight: "88%" },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: "center", marginBottom: spacing.md },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  sheetTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  sheetIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  sheetTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text, textAlign: "right" },
  sheetSub: { fontSize: font.sm, color: colors.textSecondary, textAlign: "right", marginTop: 1 },

  curRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  curLabel: { fontSize: font.sm, color: colors.textSecondary },
  curVal: { fontSize: font.base, fontWeight: "800", color: colors.text },

  fieldsRow: { flexDirection: "row", gap: spacing.md },
  label: { fontSize: font.xs, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm, textAlign: "right", fontWeight: "600" },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: font.base, color: colors.text, textAlign: "right" },

  preview: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  previewText: { fontSize: font.sm, color: colors.primaryDark, fontWeight: "600" },
  previewVal: { fontSize: font.md, fontWeight: "800", color: colors.primaryDark },
});
