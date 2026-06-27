import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Banknote,
  CreditCard,
  CalendarClock,
  CircleCheck,
  X,
  PackageX,
  Package,
  ScanLine,
  User,
  Search,
  type LucideProps,
} from "lucide-react-native";
import { api } from "../../../lib/api";
import { colors, fmt, fmtMoney, spacing, font, radius, shadow, gradients } from "../../../components/theme";
import { Hero, SearchInput, Button } from "../../../components/ui";
import { BarcodeScannerModal } from "../../../components/BarcodeScanner";
import { LoadingState } from "../../../components/States";

interface Product {
  id: string;
  nameAr: string;
  sku: string;
  salePrice: number;
  quantity: number;
}

interface CartLine {
  productId: string;
  nameAr: string;
  unitPrice: number;
  quantity: number;
  available: number;
}

type Method = "CASH" | "CARD" | "CREDIT";
const METHODS: { key: Method; label: string; icon: React.ComponentType<LucideProps>; color: string }[] = [
  { key: "CASH", label: "نقدي", icon: Banknote, color: colors.success },
  { key: "CARD", label: "بطاقة", icon: CreditCard, color: colors.primary },
  { key: "CREDIT", label: "آجل", icon: CalendarClock, color: colors.warning },
];

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance?: number;
}

export default function PosScreen() {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState("0");
  const [paid, setPaid] = useState("");
  const [method, setMethod] = useState<Method>("CASH");
  // ── حالة بحث الزبون ──
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [success, setSuccess] = useState<{ total: number; method: Method; remaining: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const scanLock = useRef(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const load = useCallback(async (q = "") => {
    try {
      const res = await api.get<{ data: Product[] }>(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(query);
    }, [load]),
  );

  // ── بحث مؤجّل عن الزبائن ──
  useEffect(() => {
    if (customerQuery.length < 2) {
      setCustomerResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingCustomer(true);
      try {
        const res = await api.get<{ data: Customer[] }>(`/customers?q=${encodeURIComponent(customerQuery)}`);
        setCustomerResults(res.data ?? []);
      } catch {
        setCustomerResults([]);
      } finally {
        setSearchingCustomer(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [customerQuery]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  function addToCart(p: Product) {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === p.id);
      if (existing) {
        if (existing.quantity >= p.quantity) {
          flash(`المتوفر من "${p.nameAr}" هو ${p.quantity} فقط`);
          return prev;
        }
        return prev.map((l) => (l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      if (p.quantity < 1) {
        flash(`"${p.nameAr}" غير متوفر`);
        return prev;
      }
      flash(`أُضيف: ${p.nameAr}`);
      return [...prev, { productId: p.id, nameAr: p.nameAr, unitPrice: p.salePrice, quantity: 1, available: p.quantity }];
    });
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.productId !== productId) return l;
          const q = l.quantity + delta;
          if (q > l.available) {
            flash(`المتوفر ${l.available} فقط`);
            return l;
          }
          return { ...l, quantity: q };
        })
        .filter((l) => l.quantity > 0),
    );
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    setDiscount("0");
    setPaid("");
    setSelectedCustomer(null);
    setCustomerQuery("");
    setCustomerResults([]);
    setCartOpen(false);
  }

  function handleClearCart() {
    setConfirmClearOpen(true);
  }

  async function handleBarcode(code: string) {
    if (scanLock.current) return;
    scanLock.current = true;
    setScanOpen(false);
    try {
      const res = await api.get<{ data: Product[] }>(`/products?q=${encodeURIComponent(code)}`);
      const match = res.data.find((p) => p.sku?.toLowerCase() === code.toLowerCase()) ?? res.data[0];
      if (match) {
        addToCart(match);
      } else {
        setQuery(code);
        void load(code);
        flash(`لا يوجد منتج بالباركود: ${code}`);
      }
    } catch {
      flash("تعذّر البحث عن المنتج");
    } finally {
      setTimeout(() => { scanLock.current = false; }, 700);
    }
  }

  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discountNum = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountNum);
  const itemCount = cart.reduce((s, l) => s + l.quantity, 0);
  const paidNum = method === "CREDIT" ? Number(paid) || 0 : total;
  const remaining = Math.max(0, total - paidNum);

  async function submit() {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await api.post("/sales", {
        items: cart.map((l) => ({ productId: l.productId, quantity: l.quantity, unitPrice: l.unitPrice, lineDiscount: 0 })),
        discount: discountNum,
        paid: paidNum,
        platform: "POS_MOBILE",
        ...(method === "CREDIT" && selectedCustomer ? { customerId: selectedCustomer.id, customerName: selectedCustomer.name } : {}),
      });
      setSuccess({ total, method, remaining });
      setCart([]);
      setDiscount("0");
      setPaid("");
      setSelectedCustomer(null);
      setCustomerQuery("");
      setCustomerResults([]);
      setMethod("CASH");
      setCartOpen(false);
      void load(query);
    } catch (e) {
      flash(e instanceof Error ? e.message : "تعذّر إتمام البيع");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <Hero title="نقطة البيع" subtitle="ابحث وأضف المنتجات إلى السلة" icon={ShoppingCart} compact />

      <View style={styles.searchWrap}>
        <View style={{ flex: 1 }}>
          <SearchInput value={query} placeholder="ابحث بالاسم أو الباركود..." onChangeText={(t) => { setQuery(t); void load(t); }} />
        </View>
        <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85} onPress={() => { scanLock.current = false; setScanOpen(true); }}>
          <ScanLine size={22} color={colors.white} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: cart.length > 0 ? 96 : spacing.xxl }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const out = item.quantity < 1;
          const inCart = cart.find((l) => l.productId === item.id);
          return (
            <View style={[styles.product, out && { opacity: 0.6 }, !!inCart && styles.productInCart]}>
              <TouchableOpacity style={styles.productMain} activeOpacity={0.85} onPress={() => addToCart(item)} disabled={out}>
                <View style={[styles.productIcon, { backgroundColor: out ? colors.dangerLight : colors.primaryLight }]}>
                  {out ? <PackageX size={20} color={colors.danger} strokeWidth={2} /> : <Package size={20} color={colors.primary} strokeWidth={2} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName} numberOfLines={1}>{item.nameAr}</Text>
                  <View style={styles.productMetaRow}>
                    <Text style={styles.productPrice}>{fmtMoney(item.salePrice)}</Text>
                    <View style={[styles.stockChip, { backgroundColor: out ? colors.dangerLight : colors.successLight }]}>
                      <Text style={[styles.stockChipText, { color: out ? colors.danger : colors.success }]}>{out ? "نفد" : `متوفر ${fmt(item.quantity)}`}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {inCart ? (
                <View style={styles.miniStepper}>
                  <TouchableOpacity style={styles.miniBtn} onPress={() => changeQty(item.id, -1)} hitSlop={6}>
                    <Minus size={15} color={colors.primary} strokeWidth={2.8} />
                  </TouchableOpacity>
                  <Text style={styles.miniNum}>{inCart.quantity}</Text>
                  <TouchableOpacity style={styles.miniBtn} onPress={() => changeQty(item.id, 1)} hitSlop={6}>
                    <Plus size={15} color={colors.primary} strokeWidth={2.8} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.addBtn, out && { backgroundColor: colors.border }]} onPress={() => addToCart(item)} disabled={out} activeOpacity={0.85}>
                  <Plus size={18} color={colors.white} strokeWidth={2.6} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <PackageX size={40} color={colors.muted} strokeWidth={1.6} />
            <Text style={styles.emptyText}>لا توجد منتجات مطابقة</Text>
          </View>
        }
      />

      {/* شريط السلة السفلي */}
      {cart.length > 0 && (
        <View style={[styles.cartBar, { paddingBottom: spacing.sm }]}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9} onPress={() => setCartOpen(true)}>
            <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cartBarInner}>
              <View style={styles.cartBarBadge}>
                <ShoppingCart size={18} color={colors.white} strokeWidth={2.2} />
                <Text style={styles.cartBarCount}>{itemCount}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartBarText}>عرض السلة وإتمام البيع</Text>
                <Text style={styles.cartBarSub}>{fmt(cart.length)} صنف</Text>
              </View>
              <Text style={styles.cartBarTotal}>{fmtMoney(total)}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearCartBtn} activeOpacity={0.85} onPress={handleClearCart}>
            <Trash2 size={20} color={colors.danger} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      )}

      {/* توست */}
      {toast && (
        <View style={[styles.toast, { bottom: cart.length > 0 ? 100 : 40 }]} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* مودال السلة */}
      <Modal visible={cartOpen} animationType="slide" transparent onRequestClose={() => setCartOpen(false)}>
        <KeyboardAvoidingView style={styles.sheetOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setCartOpen(false)} />
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <View style={styles.sheetTitleIcon}><ShoppingCart size={18} color={colors.primary} strokeWidth={2.2} /></View>
                <Text style={styles.sheetTitle}>السلة · {itemCount} قطعة</Text>
              </View>
              <View style={styles.sheetHeaderActions}>
                <TouchableOpacity onPress={clearCart} hitSlop={8} style={styles.clearBtn}>
                  <Trash2 size={14} color={colors.danger} strokeWidth={2.2} />
                  <Text style={styles.clearText}>تفريغ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCartOpen(false)} hitSlop={10}>
                  <X size={22} color={colors.textSecondary} strokeWidth={2.2} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {cart.map((l) => (
                <View key={l.productId} style={styles.line}>
                  <View style={{ flex: 1, alignItems: "flex-start" }}>
                    <Text style={styles.lineName} numberOfLines={1}>{l.nameAr}</Text>
                    <Text style={styles.lineUnit}>{fmtMoney(l.unitPrice)} للقطعة</Text>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepBtn} onPress={() => changeQty(l.productId, -1)}>
                      <Minus size={15} color={colors.primary} strokeWidth={2.8} />
                    </TouchableOpacity>
                    <Text style={styles.stepNum}>{l.quantity}</Text>
                    <TouchableOpacity style={styles.stepBtn} onPress={() => changeQty(l.productId, 1)}>
                      <Plus size={15} color={colors.primary} strokeWidth={2.8} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.lineTotal}>{fmtMoney(l.unitPrice * l.quantity)}</Text>
                  <TouchableOpacity onPress={() => removeLine(l.productId)} hitSlop={8}>
                    <Trash2 size={17} color={colors.danger} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* طريقة الدفع */}
            <Text style={styles.fieldTitle}>طريقة الدفع</Text>
            <View style={styles.methods}>
              {METHODS.map((m) => {
                const active = method === m.key;
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={[styles.method, active && { backgroundColor: m.color, borderColor: m.color }]}
                    onPress={() => setMethod(m.key)}
                    activeOpacity={0.85}
                  >
                    <m.icon size={18} color={active ? colors.white : m.color} strokeWidth={2.2} />
                    <Text style={[styles.methodLabel, { color: active ? colors.white : colors.textSecondary }]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* حقول الدفع */}
            <View style={styles.fieldsRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>الخصم</Text>
                <TextInput style={styles.field} value={discount} onChangeText={setDiscount} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
              {method === "CREDIT" && (
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>المدفوع الآن</Text>
                  <TextInput style={styles.field} value={paid} onChangeText={setPaid} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
                </View>
              )}
            </View>
            {method === "CREDIT" && (
              <View style={{ marginTop: spacing.sm }}>
                <Text style={styles.fieldLabel}>اسم الزبون (للدَّين)</Text>
                {selectedCustomer ? (
                  <View style={[styles.customerWrap, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}>
                    <User size={16} color={colors.primary} strokeWidth={2.2} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: font.base, fontWeight: "700", color: colors.text, textAlign: "right" }}>{selectedCustomer.name}</Text>
                      {selectedCustomer.phone ? <Text style={{ fontSize: font.xs, color: colors.textSecondary, textAlign: "right", marginTop: 1 }}>{selectedCustomer.phone}</Text> : null}
                    </View>
                    {selectedCustomer.balance != null && selectedCustomer.balance > 0 && (
                      <View style={{ backgroundColor: colors.dangerLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                        <Text style={{ fontSize: font.xs, fontWeight: "700", color: colors.danger }}>{fmtMoney(selectedCustomer.balance)}</Text>
                      </View>
                    )}
                    <TouchableOpacity onPress={() => { setSelectedCustomer(null); setCustomerQuery(""); }} hitSlop={8}>
                      <X size={18} color={colors.danger} strokeWidth={2.2} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.customerWrap}>
                      <Search size={16} color={colors.muted} strokeWidth={2.2} />
                      <TextInput
                        style={styles.customerInput}
                        value={customerQuery}
                        onChangeText={setCustomerQuery}
                        placeholder="ابحث بالاسم أو رقم الهاتف..."
                        placeholderTextColor={colors.muted}
                      />
                      {searchingCustomer && <ActivityIndicator size="small" color={colors.primary} />}
                    </View>
                    {customerResults.length > 0 && (
                      <View style={styles.customerDropdown}>
                        {customerResults.slice(0, 5).map((c) => (
                          <TouchableOpacity
                            key={c.id}
                            style={styles.customerOption}
                            activeOpacity={0.8}
                            onPress={() => {
                              setSelectedCustomer(c);
                              setCustomerQuery("");
                              setCustomerResults([]);
                            }}
                          >
                            <View style={styles.customerAvatar}>
                              <Text style={{ color: colors.primary, fontSize: font.xs, fontWeight: "900" }}>
                                {c.name.trim().charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "right" }}>{c.name}</Text>
                              {c.phone ? <Text style={{ fontSize: font.xs, color: colors.muted, textAlign: "right" }}>{c.phone}</Text> : null}
                            </View>
                            {c.balance != null && c.balance > 0 && (
                              <View style={{ backgroundColor: colors.dangerLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.pill }}>
                                <Text style={{ fontSize: 10, fontWeight: "700", color: colors.danger }}>{fmtMoney(c.balance)}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* الإجماليات */}
            <View style={styles.totals}>
              <Row label="المجموع الفرعي" value={fmtMoney(subtotal)} />
              {discountNum > 0 && <Row label="الخصم" value={`- ${fmtMoney(discountNum)}`} danger />}
              <View style={styles.totalDivider} />
              <Row label="الإجمالي" value={fmtMoney(total)} big />
              {remaining > 0 && <Row label="المتبقّي (دَين)" value={fmtMoney(remaining)} danger />}
            </View>

            <Button title={`إتمام البيع · ${fmtMoney(total)}`} icon={CircleCheck} onPress={submit} loading={submitting} size="lg" style={{ marginTop: spacing.md }} />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ماسح الباركود */}
      <BarcodeScannerModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        onScan={handleBarcode}
        title="مسح باركود المنتج"
        hint="وجّه الكاميرا نحو باركود المنتج لإضافته للسلة"
      />

      {/* مودال النجاح */}
      <Modal visible={!!success} animationType="fade" transparent onRequestClose={() => setSuccess(null)}>
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <CircleCheck size={48} color={colors.success} strokeWidth={2} />
            </View>
            <Text style={styles.successTitle}>تمت الفاتورة بنجاح</Text>
                <Text style={styles.successTotal}>{success ? fmtMoney(success.total) : ""}</Text>
            <Text style={styles.successMeta}>
              {success ? METHODS.find((m) => m.key === success.method)?.label : ""}
              {success && success.remaining > 0 ? ` · دَين ${fmtMoney(success.remaining)}` : ""}
            </Text>
            <Button title="بيع جديد" onPress={() => setSuccess(null)} size="lg" style={{ marginTop: spacing.xl }} />
          </View>
        </View>
      </Modal>

      {/* مودال تأكيد تفريغ السلة */}
      <Modal visible={confirmClearOpen} animationType="fade" transparent onRequestClose={() => setConfirmClearOpen(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={[styles.confirmIcon, { backgroundColor: colors.dangerLight }]}>
              <Trash2 size={32} color={colors.danger} strokeWidth={2.2} />
            </View>
            <Text style={styles.confirmTitle}>تفريغ السلة</Text>
            <Text style={styles.confirmMessage}>هل أنت متأكد من إلغاء تحديد جميع المنتجات وتفريغ السلة؟</Text>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                style={[styles.confirmBtn, { backgroundColor: colors.danger }]} 
                onPress={() => {
                  clearCart();
                  setConfirmClearOpen(false);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmBtnText}>تفريغ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmBtn, { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }]} 
                onPress={() => setConfirmClearOpen(false)}
                activeOpacity={0.85}
              >
                <Text style={[styles.confirmBtnText, { color: colors.textSecondary }]}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value, big, danger }: { label: string; value: string; big?: boolean; danger?: boolean }) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, big && { fontSize: font.lg, fontWeight: "800", color: colors.text }]}>{label}</Text>
      <Text style={[styles.totalValue, big && { fontSize: font.lg, color: colors.primary }, danger && { color: colors.danger }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.lg, paddingBottom: spacing.sm },
  scanBtn: { width: 46, height: 46, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...shadow.sm },

  product: { flexDirection: "row-reverse", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, paddingLeft: spacing.md, marginBottom: spacing.sm, ...shadow.sm },
  productInCart: { borderWidth: 1.5, borderColor: colors.primary },
  productMain: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: spacing.md },
  productIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  productName: { fontSize: font.base, fontWeight: "700", color: colors.text, textAlign: "center" },
  productMetaRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: spacing.sm, marginTop: 3 },
  productPrice: { fontSize: font.sm, fontWeight: "800", color: colors.primary },
  stockChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  stockChipText: { fontSize: font.xs, fontWeight: "700" },
  addBtn: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },

  miniStepper: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.primaryLight, borderRadius: radius.md, paddingHorizontal: 4, paddingVertical: 3 },
  miniBtn: { width: 28, height: 28, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", ...shadow.sm },
  miniNum: { fontSize: font.base, fontWeight: "800", color: colors.primary, minWidth: 20, textAlign: "center" },

  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: spacing.md },
  emptyText: { color: colors.textSecondary, fontSize: font.base },

  cartBar: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, backgroundColor: "transparent", flexDirection: "row", gap: spacing.sm },
  cartBarInner: { flexDirection: "row", alignItems: "center", borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md, ...shadow.lg },
  cartBarBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  cartBarCount: { color: colors.white, fontWeight: "800", fontSize: font.md },
  cartBarText: { color: colors.white, fontWeight: "800", fontSize: font.base, textAlign: "center" },
  cartBarSub: { color: "rgba(255,255,255,0.8)", fontWeight: "600", fontSize: font.xs, textAlign: "center", marginTop: 1 },
  cartBarTotal: { color: colors.white, fontWeight: "800", fontSize: font.md },
  clearCartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    ...shadow.sm,
  },

  toast: { position: "absolute", alignSelf: "center", backgroundColor: "rgba(13,27,42,0.92)", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill },
  toastText: { color: colors.white, fontSize: font.sm, fontWeight: "600" },

  sheetOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: "center", marginBottom: spacing.md },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  sheetTitleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  sheetTitleIcon: { width: 32, height: 32, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  sheetTitle: { fontSize: font.md, fontWeight: "800", color: colors.text },
  sheetHeaderActions: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.dangerLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  clearText: { fontSize: font.xs, fontWeight: "800", color: colors.danger },

  line: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  lineName: { fontSize: font.sm, fontWeight: "700", color: colors.text, textAlign: "right" },
  lineUnit: { fontSize: font.xs, color: colors.muted, textAlign: "right", marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.xs, backgroundColor: colors.bg, borderRadius: radius.sm, padding: 3 },
  stepBtn: { width: 26, height: 26, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  stepNum: { fontSize: font.sm, fontWeight: "800", color: colors.text, minWidth: 22, textAlign: "center" },
  lineTotal: { fontSize: font.sm, fontWeight: "800", color: colors.primary, minWidth: 70, textAlign: "left" },

  fieldTitle: { fontSize: font.sm, fontWeight: "700", color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.sm, textAlign: "left" },
  methods: { flexDirection: "row", gap: spacing.sm },
  method: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: spacing.md, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  methodLabel: { fontSize: font.sm, fontWeight: "700" },

  fieldsRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  fieldLabel: { fontSize: font.xs, color: colors.textSecondary, marginBottom: 4, textAlign: "left", fontWeight: "600" },
  field: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: font.base, color: colors.text, textAlign: "right" },
  customerWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md },
  customerInput: { flex: 1, paddingVertical: 10, fontSize: font.base, color: colors.text, textAlign: "right" },
  customerDropdown: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderTopWidth: 0, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md, overflow: "hidden" },
  customerOption: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: 10, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  customerAvatar: { width: 30, height: 30, borderRadius: radius.sm, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },

  totals: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md, gap: 6 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: font.sm, color: colors.textSecondary },
  totalValue: { fontSize: font.sm, fontWeight: "700", color: colors.text },
  totalDivider: { height: 1, backgroundColor: colors.borderLight, marginVertical: 4 },

  successOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.5)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  successCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.xxl, alignItems: "center", width: "100%", ...shadow.lg },
  successIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.successLight, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text, marginTop: spacing.lg },
  successTotal: { fontSize: font.xxl, fontWeight: "800", color: colors.primary, marginTop: spacing.sm },
  successMeta: { fontSize: font.sm, color: colors.textSecondary, marginTop: 4 },

  confirmOverlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.5)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  confirmCard: { backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.xl, alignItems: "center", width: "100%", maxWidth: 320, ...shadow.lg },
  confirmIcon: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" },
  confirmTitle: { fontSize: font.lg, fontWeight: "800", color: colors.text, marginTop: spacing.md, textAlign: "center" },
  confirmMessage: { fontSize: font.sm, color: colors.textSecondary, marginTop: spacing.xs, textAlign: "center", lineHeight: 20 },
  confirmActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl, width: "100%" },
  confirmBtn: { flex: 1, height: 44, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  confirmBtnText: { fontSize: font.sm, fontWeight: "700", color: colors.white },
});
