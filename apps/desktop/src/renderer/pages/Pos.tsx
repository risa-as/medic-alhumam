import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Package, AlertTriangle, Pill, Tag, Check, Banknote, Loader2, User, X, Pencil,
  FolderOpen, ScanBarcode, Search, Receipt, ShoppingCart, Pause, CreditCard, CalendarClock,
  UserPlus,
} from "lucide-react";
import { useCart, type HeldInvoice } from "../store";
import { ReceiptModal, type PayMethod } from "../components/ReceiptModal";
import type { LocalProduct, LocalSale } from "../types";

const fmt    = (n: number) => n.toLocaleString("ar-IQ");
const fmtIQD = (n: number) => `${n.toLocaleString("ar-IQ")} د.ع`;

/* ══════════════════════════════════════
   بطاقة المنتج
══════════════════════════════════════ */
function ProductCard({
  product, qtyInCart, onAdd,
}: {
  product: LocalProduct;
  qtyInCart: number;
  onAdd: () => void;
}) {
  const low   = product.quantity > 0 && product.quantity <= product.minQuantity;
  const empty = product.quantity <= 0;
  const [pressed, setPressed] = useState(false);

  function handleClick() {
    if (empty) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 120);
    onAdd();
  }

  return (
    <button
      onClick={handleClick}
      disabled={empty}
      style={{
        background: empty
          ? "#F8FAFC"
          : qtyInCart > 0
            ? "linear-gradient(160deg, #EAF2F9 0%, #D6EAF8 100%)"
            : "var(--color-surface)",
        border: `1.5px solid ${
          empty ? "var(--color-border-light)"
            : qtyInCart > 0 ? "#9DC4DD"
            : low ? "#FDE68A"
            : "var(--color-border)"
        }`,
        borderRadius: "var(--radius)",
        padding: "9px 8px",
        cursor: empty ? "not-allowed" : "pointer",
        textAlign: "right",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        position: "relative",
        opacity: empty ? 0.5 : 1,
        transform: pressed ? "scale(0.96)" : "scale(1)",
        transition: "transform 100ms ease, box-shadow 150ms ease, border-color 150ms ease",
        boxShadow: qtyInCart > 0 ? "0 0 0 3px rgba(26,82,118,0.1)" : "var(--shadow-xs)",
      }}
    >
      {/* badge الكمية في السلة */}
      {qtyInCart > 0 && (
        <span style={{
          position: "absolute", top: -6, left: -6,
          width: 20, height: 20, borderRadius: "50%",
          background: "var(--color-primary)", color: "#fff",
          fontSize: 10, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(26,82,118,0.4)",
          border: "2px solid #fff",
          zIndex: 1,
        }}>
          {qtyInCart}
        </span>
      )}

      {/* badge نفد / نقص */}
      {(low || empty) && (
        <span style={{
          position: "absolute", top: 6, left: 6,
          fontSize: 9, fontWeight: 700,
          background: empty ? "#FEF2F2" : "#FFFBEB",
          color: empty ? "#DC2626" : "#D97706",
          padding: "1px 5px", borderRadius: 3,
        }}>
          {empty ? "نفد" : "نقص"}
        </span>
      )}

      {/* أيقونة */}
      <div style={{
        width: 30, height: 30, borderRadius: "var(--radius)",
        background: empty ? "#F1F5F9" : low ? "#FEF3C7" : qtyInCart > 0 ? "#D6EAF8" : "#EAF2F9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {empty ? <Package size={15} style={{ color: "#64748B" }} /> : low ? <AlertTriangle size={15} style={{ color: "#B45309" }} /> : <Pill size={15} style={{ color: "var(--color-primary)" }} />}
      </div>

      {/* الاسم */}
      <p style={{
        fontSize: 11, fontWeight: 600, color: empty ? "var(--color-text-muted)" : "var(--color-text)",
        lineHeight: 1.3, textAlign: "right",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        minHeight: 28,
      }}>
        {product.nameAr}
      </p>

      {/* السعر */}
      <p style={{
        fontSize: 13, fontWeight: 800,
        color: empty ? "var(--color-text-muted)" : qtyInCart > 0 ? "var(--color-primary)" : "var(--color-text)",
        letterSpacing: "-0.03em", lineHeight: 1,
      }}>
        {fmt(product.salePrice)}
        <span style={{ fontSize: 9, fontWeight: 400, color: "var(--color-text-muted)", marginRight: 3 }}>د.ع</span>
      </p>

      {/* المخزون */}
      <p style={{ fontSize: 9.5, color: low ? "#D97706" : "var(--color-text-muted)", fontWeight: low ? 600 : 400 }}>
        {empty ? "غير متوفر" : `متوفر: ${product.quantity}`}
      </p>
    </button>
  );
}

/* ══════════════════════════════════════
   سطر العربة — تصميم جديد
══════════════════════════════════════ */
function CartRow({
  index, name, unitPrice, quantity, lineTotal, available,
  onQtyChange, onPriceChange, onRemove,
}: {
  index: number; name: string; unitPrice: number; quantity: number;
  lineTotal: number; available: number;
  onQtyChange: (n: number) => void; onPriceChange: (n: number) => void; onRemove: () => void;
}) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput]     = useState(String(unitPrice));
  const priceRef                        = useRef<HTMLInputElement>(null);

  function openPriceEdit() {
    setPriceInput(String(unitPrice));
    setEditingPrice(true);
    setTimeout(() => { priceRef.current?.select(); }, 30);
  }

  function commitPrice() {
    const v = Number(priceInput);
    if (!isNaN(v) && v >= 0) onPriceChange(v);
    setEditingPrice(false);
  }

  function onPriceKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") commitPrice();
    if (e.key === "Escape") setEditingPrice(false);
  }

  return (
    <div style={{
      padding: "10px 14px 10px 12px",
      borderBottom: "1px solid var(--color-border-light)",
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      {/* رقم الصنف */}
      <span style={{
        minWidth: 20, height: 20, borderRadius: 3,
        background: "var(--color-primary-light)", color: "var(--color-primary)",
        fontSize: 10, fontWeight: 800, display: "flex",
        alignItems: "center", justifyContent: "center",
        marginTop: 2, flexShrink: 0,
      }}>
        {index}
      </span>

      {/* المحتوى */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* الاسم */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", lineHeight: 1.35, marginBottom: 7 }}>
          {name}
        </p>

        {/* السعر × الكمية + الإجمالي */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>

          {/* سعر الوحدة — قابل للتعديل بالنقر */}
          {editingPrice ? (
            <input
              ref={priceRef}
              type="number" min={0} value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={onPriceKeyDown}
              style={{
                width: 80, padding: "3px 6px", borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--color-primary)",
                boxShadow: "0 0 0 3px rgba(26,82,118,0.12)",
                fontSize: 12, outline: "none", fontFamily: "inherit",
                color: "var(--color-primary)", fontWeight: 700,
                background: "#EAF2F9", textAlign: "center",
              }}
            />
          ) : (
            <button
              onClick={openPriceEdit}
              title="انقر لتعديل السعر"
              style={{
                background: "none", border: "1px dashed transparent",
                borderRadius: "var(--radius-sm)", cursor: "pointer",
                fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)",
                fontFamily: "inherit", padding: "2px 5px",
                transition: "all 140ms", whiteSpace: "nowrap",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.background = "var(--color-primary-light)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.background = "none";
              }}
            >
              {fmt(unitPrice)}
            </button>
          )}

          <span style={{ fontSize: 10, color: "#CBD5E1" }}>×</span>

          {/* أزرار الكمية */}
          <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-sm)",
            overflow: "hidden", flexShrink: 0,
          }}>
            <button
              onClick={() => onQtyChange(quantity - 1)}
              disabled={quantity <= 1}
              style={{
                width: 24, height: 24, border: "none", background: "#F8FAFC",
                cursor: quantity <= 1 ? "not-allowed" : "pointer",
                fontSize: 15, fontWeight: 700, lineHeight: 1,
                color: quantity <= 1 ? "#CBD5E1" : "var(--color-text)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 100ms", flexShrink: 0,
              }}
              onMouseOver={e => { if (quantity > 1) e.currentTarget.style.background = "#E2E8F0"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#F8FAFC"; }}
            >−</button>

            <span style={{
              width: 28, textAlign: "center", fontSize: 12, fontWeight: 700,
              color: "var(--color-text)", lineHeight: "24px",
              borderRight: "1px solid var(--color-border-light)",
              borderLeft: "1px solid var(--color-border-light)",
            }}>
              {quantity}
            </span>

            <button
              onClick={() => onQtyChange(quantity + 1)}
              disabled={quantity >= available}
              style={{
                width: 24, height: 24, border: "none", background: "#F8FAFC",
                cursor: quantity >= available ? "not-allowed" : "pointer",
                fontSize: 15, fontWeight: 700, lineHeight: 1,
                color: quantity >= available ? "#CBD5E1" : "var(--color-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 100ms", flexShrink: 0,
              }}
              onMouseOver={e => { if (quantity < available) e.currentTarget.style.background = "#EAF2F9"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#F8FAFC"; }}
            >+</button>
          </div>

          {/* الإجمالي */}
          <span style={{
            fontSize: 13, fontWeight: 800, color: "var(--color-text)",
            letterSpacing: "-0.02em", marginRight: "auto", whiteSpace: "nowrap",
          }}>
            {fmt(lineTotal)} <span style={{ fontSize: 10, fontWeight: 400, color: "var(--color-text-muted)" }}>د.ع</span>
          </span>
        </div>
      </div>

      {/* زر الحذف */}
      <button
        onClick={onRemove}
        style={{
          width: 22, height: 22, borderRadius: 3, border: "none", flexShrink: 0,
          cursor: "pointer", background: "transparent",
          color: "#CBD5E1", fontSize: 16, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 120ms", marginTop: 1, lineHeight: 1,
        }}
        onMouseOver={e => { e.currentTarget.style.background = "var(--color-danger-light)"; e.currentTarget.style.color = "var(--color-danger)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
      ><X size={16} /></button>
    </div>
  );
}

/* ══════════════════════════════════════
   حقل رقمي مدمج (الخصم / المدفوع)
══════════════════════════════════════ */
function CompactNumberField({
  icon, label, value, onChange, active, activeColor, activeBg, badge,
}: {
  icon: ReactNode; label: string; value: number; onChange: (n: number) => void;
  active: boolean; activeColor: string; activeBg: string; badge?: ReactNode;
}) {
  /* حالة نصية محلية للتحكّم الكامل بالعرض — تتفادى بقاء أصفار بادئة مثل «0500»
     التي يتعذّر على حقل number المضبوط إعادة ضبطها لأن Number("0500") === 500. */
  const [text, setText] = useState(value ? String(value) : "0");
  useEffect(() => { setText(value ? String(value) : "0"); }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // أرقام فقط + إزالة الأصفار البادئة
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    setText(raw);
    onChange(raw === "" ? 0 : Number(raw));
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 10px", borderRadius: "var(--radius)",
      border: `1.5px solid ${active ? activeColor : "var(--color-border)"}`,
      background: active ? activeBg : "var(--color-surface)",
      transition: "all 150ms", minWidth: 0,
    }}>
      <span style={{ display: "flex", flexShrink: 0, color: active ? activeColor : "var(--color-text-muted)" }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", flexShrink: 0 }}>{label}</span>
      <input
        type="text" inputMode="numeric"
        value={text}
        onChange={handleChange}
        onKeyDown={e => e.stopPropagation()}
        onFocus={e => {
          const el = e.currentTarget;
          // نقل المؤشر إلى نهاية الرقم حتى تُضاف الأرقام الجديدة في النهاية لا في البداية
          requestAnimationFrame(() => { const n = el.value.length; el.setSelectionRange(n, n); });
          const p = el.parentElement; if (p) { p.style.borderColor = "var(--color-primary)"; p.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.08)"; }
        }}
        onBlur={e => { const p = e.currentTarget.parentElement; if (p) { p.style.borderColor = active ? activeColor : "var(--color-border)"; p.style.boxShadow = "none"; } }}
        style={{
          flex: 1, minWidth: 0, width: "100%", border: "none", outline: "none",
          background: "transparent", textAlign: "left",
          fontSize: 14, fontWeight: 700, fontFamily: "inherit",
          color: active ? activeColor : "var(--color-text)",
        }}
      />
      {badge && <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 700, color: activeColor, display: "inline-flex", alignItems: "center", gap: 2 }}>{badge}</span>}
    </div>
  );
}

/* ══════════════════════════════════════
   CartFields — خصم + مدفوع + الزبون
══════════════════════════════════════ */
interface CartFieldsProps {
  discount: number; paid: number; total: number;
  customerName: string; customerPhone: string;
  onDiscountChange: (n: number) => void; onPaidChange: (n: number) => void;
  onCustomerName: (v: string) => void; onCustomerPhone: (v: string) => void;
}

function CartFields({
  discount, paid, total,
  customerName, customerPhone,
  onDiscountChange, onPaidChange,
  onCustomerName, onCustomerPhone,
}: CartFieldsProps) {
  const [custQuery,    setCustQuery]    = useState(customerName);
  const [suggestions,  setSuggestions]  = useState<Array<{ id: string; name: string; phone: string | null; address: string | null }>>([]);
  const [showDrop,     setShowDrop]     = useState(false);
  const [searching,    setSearching]    = useState(false);
  const [searchError,  setSearchError]  = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const paidFull = paid >= total && total > 0;

  /* عند مسح العربة أو تصفير اسم الزبون خارجيًا، نُصفّر حقل البحث */
  useEffect(() => { if (!customerName) setCustQuery(""); }, [customerName]);

  /* بحث في الزبائن من المرآة المحلية (SQLite) — يعمل دون اتصال، تُحدَّث بالمزامنة */
  useEffect(() => {
    if (!custQuery.trim()) { setSuggestions([]); setSearchError(null); return; }
    const t = setTimeout(async () => {
      setSearching(true); setSearchError(null);
      try {
        const data = await window.medic.searchLocalCustomers(custQuery);
        setSuggestions(data.slice(0, 6));
      } catch (e) {
        setSuggestions([]);
        setSearchError(e instanceof Error ? e.message : "تعذّر جلب الزبائن المسجّلين");
      }
      setSearching(false);
    }, 200);
    return () => clearTimeout(t);
  }, [custQuery]);

  /* إغلاق dropdown عند النقر خارجه */
  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  function selectCustomer(c: { name: string; phone: string | null }) {
    onCustomerName(c.name);
    onCustomerPhone(c.phone ?? "");
    setCustQuery(c.name);
    setShowDrop(false);
    setSuggestions([]);
  }

  function clearCustomer() {
    onCustomerName(""); onCustomerPhone("");
    setCustQuery(""); setSuggestions([]);
  }

  const hasCustomer = !!customerName.trim();

  return (
    <div className="pos-fields-section" style={{ gap: 8 }}>

      {/* ── خصم + مدفوع (حقول مدمجة) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <CompactNumberField
          icon={<Tag size={13} />} label="الخصم"
          value={discount} onChange={onDiscountChange}
          active={discount > 0} activeColor="var(--color-danger)" activeBg="#FEF2F2"
        />
        <CompactNumberField
          icon={<Banknote size={13} />} label="المدفوع"
          value={paid} onChange={onPaidChange}
          active={paidFull} activeColor="var(--color-success)" activeBg="#ECFDF5"
          badge={paidFull ? (<><Check size={10} strokeWidth={3} /> مكتمل</>) : undefined}
        />
      </div>

      {/* ── الزبون (بدون ترويسة لتوفير المساحة) ── */}
      <div>
        {hasCustomer ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "6px 10px",
            background: "linear-gradient(135deg, #EAF2F9, #D6EAF8)",
            border: "1.5px solid #9DC4DD",
            borderRadius: "var(--radius)",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "linear-gradient(135deg, #1A5276, #4A90BC)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
              {customerName.slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary)", lineHeight: 1.3 }}>{customerName}</p>
              {customerPhone && (
                <p style={{ fontSize: 10, color: "#2E6E96", marginTop: 1 }}>{customerPhone}</p>
              )}
            </div>
            <button
              onClick={clearCustomer}
              title="إلغاء الاختيار"
              style={{
                width: 22, height: 22, borderRadius: "50%", border: "none", flexShrink: 0,
                cursor: "pointer", background: "rgba(26,82,118,0.12)",
                color: "var(--color-primary)", fontSize: 13, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 130ms",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--color-danger)"; e.currentTarget.style.color = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(26,82,118,0.12)"; e.currentTarget.style.color = "var(--color-primary)"; }}
            ><X size={16} /></button>
          </div>
        ) : (
          /* البحث + Dropdown */
          <div ref={dropRef} style={{ position: "relative" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, pointerEvents: "none", color: "var(--color-text-muted)" }}>
                {searching ? <Loader2 size={13} style={{ animation: "spin 0.7s linear infinite" }} /> : <User size={13} />}
              </span>
              <input
                type="text"
                value={custQuery}
                placeholder="اسم الزبون (مطلوب للبيع الآجل)"
                onChange={e => { setCustQuery(e.target.value); setShowDrop(true); }}
                onFocus={e => { setShowDrop(true); e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.08)"; }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                  /* عند المغادرة: إذا كتب المستخدم اسمًا يدويًا بدون اختيار من القائمة، نُثبّته */
                  const v = custQuery.trim();
                  if (v) onCustomerName(v);
                }}
                onKeyDown={e => {
                  e.stopPropagation();
                  if (e.key === "Enter") { const v = custQuery.trim(); if (v) { onCustomerName(v); setShowDrop(false); } }
                  if (e.key === "Escape") { setShowDrop(false); }
                }}
                style={{
                  width: "100%", padding: "8px 34px 8px 10px",
                  borderRadius: "var(--radius)", border: "1.5px solid var(--color-border)",
                  fontSize: 12, fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box", transition: "border-color 150ms, box-shadow 150ms",
                  background: "var(--color-surface)", color: "var(--color-text)",
                }}
              />
              {custQuery && (
                <button
                  onMouseDown={e => { e.preventDefault(); clearCustomer(); }}
                  style={{
                    position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-text-muted)", fontSize: 13, padding: 2,
                  }}
                ><X size={13} /></button>
              )}
              </div>
              {/* زر إضافة زبون جديد (مدمج بجانب البحث) */}
              <button
                title="إضافة زبون جديد"
                onClick={() => setShowQuickAdd(true)}
                style={{
                  width: 38, flexShrink: 0, borderRadius: "var(--radius)",
                  background: "var(--color-primary-light)", border: "1.5px solid var(--color-primary-mid)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--color-primary)", transition: "all 130ms",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                onMouseOut={e => { e.currentTarget.style.background = "var(--color-primary-light)"; e.currentTarget.style.color = "var(--color-primary)"; }}
              ><UserPlus size={16} /></button>
            </div>

            {/* قائمة الاقتراحات + الإدخال اليدوي — تظهر ما دام هناك نص بحث */}
            {showDrop && custQuery.trim() && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, left: 0,
                background: "var(--color-surface)", border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)",
                zIndex: 500, overflow: "hidden",
              }}>
                {/* ترويسة — فقط عند وجود نتائج */}
                {suggestions.length > 0 && (
                  <div style={{ padding: "6px 12px", borderBottom: "1px solid var(--color-border-light)", background: "#FAFBFC" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      زبائن مسجّلون
                    </span>
                  </div>
                )}
                {suggestions.map(c => (
                  <button
                    key={c.id}
                    onMouseDown={e => { e.preventDefault(); selectCustomer(c); }}
                    style={{
                      width: "100%", textAlign: "right", padding: "9px 12px",
                      display: "flex", alignItems: "center", gap: 10,
                      background: "transparent", border: "none",
                      borderBottom: "1px solid var(--color-border-light)",
                      cursor: "pointer", fontFamily: "inherit", transition: "background 120ms",
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = "var(--color-primary-light)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #E2E8F0, #CBD5E1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)",
                    }}>
                      {c.name.slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}>{c.name}</p>
                      {c.phone && <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{c.phone}</p>}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--color-primary)", fontWeight: 600 }}>اختيار</span>
                  </button>
                ))}

                {/* حالة البحث / لا نتيجة / تعذّر الجلب — عند غياب الاقتراحات */}
                {suggestions.length === 0 && (
                  <div style={{
                    padding: "8px 12px", fontSize: 11, lineHeight: 1.5,
                    color: searchError ? "var(--color-danger)" : "var(--color-text-muted)",
                    display: "flex", alignItems: "center", gap: 6,
                    borderBottom: "1px solid var(--color-border-light)",
                  }}>
                    {searching ? (
                      <><Loader2 size={13} style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }} /> جارٍ البحث...</>
                    ) : searchError ? (
                      <><AlertTriangle size={13} style={{ flexShrink: 0 }} /> تعذّر جلب الزبائن المسجّلين (تحقّق من الاتصال) — يمكنك إضافة الاسم يدويًّا</>
                    ) : (
                      <>لا يوجد زبون مطابق</>
                    )}
                  </div>
                )}

                {/* إدخال يدوي — متاح دائمًا ما دام هناك نص (يعمل أوفلاين) */}
                <button
                  onMouseDown={e => { e.preventDefault(); onCustomerName(custQuery.trim()); setShowDrop(false); }}
                  style={{
                    width: "100%", textAlign: "right", padding: "9px 12px",
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent", border: "none",
                    cursor: "pointer", fontFamily: "inherit", transition: "background 120ms",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "var(--color-primary-light)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Pencil size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    استخدام &nbsp;<strong style={{ color: "var(--color-text)" }}>"{custQuery.trim()}"</strong>&nbsp; كزبون
                  </span>
                </button>
              </div>
            )}

            {/* حقل الهاتف — يظهر بعد كتابة الاسم */}
            {custQuery.trim() && !showDrop && (
              <div style={{ marginTop: 6 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 4 }}>الهاتف (اختياري)</label>
                <input
                  type="tel" value={customerPhone}
                  onChange={e => onCustomerPhone(e.target.value)}
                  placeholder="07X XXXX XXXX"
                  onKeyDown={e => e.stopPropagation()}
                  style={{
                    width: "100%", padding: "7px 10px", borderRadius: "var(--radius)",
                    border: "1.5px solid var(--color-border)", fontSize: 12,
                    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal إضافة زبون جديد ── */}
      {showQuickAdd && (
        <QuickAddCustomerModal
          onSave={async (name, phone, address) => {
            const c = await window.medic.createCustomer(name, phone || undefined, address || undefined);
            onCustomerName(c.name);
            onCustomerPhone(c.phone ?? "");
            setCustQuery(c.name);
            setShowQuickAdd(false);
          }}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   Modal إضافة زبون سريع من POS
══════════════════════════════════════ */
function QuickAddCustomerModal({
  onSave, onClose,
}: { onSave: (name: string, phone: string, address: string) => Promise<void>; onClose: () => void }) {
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [address, setAddress] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setError(null);
    try {
      await onSave(name.trim(), phone.trim(), address.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: "var(--radius)",
    border: "1.5px solid var(--color-border)", fontSize: 13,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color 150ms, box-shadow 150ms",
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget && !saving) onClose(); }}
      style={{ zIndex: 1050 }}
    >
      <div className="modal-box" style={{ width: 400 }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "var(--radius)",
              background: "var(--color-primary-light)", border: "1px solid var(--color-primary-mid)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)",
            }}><User size={16} /></div>
            <p className="modal-title">إضافة زبون جديد</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* الاسم */}
            <div className="form-group">
              <label className="form-label">الاسم <span style={{ color: "var(--color-danger)" }}>*</span></label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                required autoFocus placeholder="اسم الزبون"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* الهاتف */}
            <div className="form-group">
              <label className="form-label">رقم الهاتف</label>
              <input
                value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="07X XXXX XXXX" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* العنوان */}
            <div className="form-group">
              <label className="form-label">العنوان</label>
              <input
                value={address} onChange={e => setAddress(e.target.value)}
                placeholder="المنطقة، الشارع، رقم المنزل..."
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.1)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginTop: 14 }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button" onClick={onClose} disabled={saving}
              style={{
                flex: 1, padding: "10px", borderRadius: "var(--radius)",
                border: "1.5px solid var(--color-border)", background: "var(--color-surface)",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                color: "var(--color-text-secondary)", transition: "all 150ms",
              }}
            >إلغاء</button>
            <button
              type="submit" disabled={saving || !name.trim()}
              style={{
                flex: 1, padding: "10px", borderRadius: "var(--radius)", border: "none",
                background: saving || !name.trim()
                  ? "#9DC4DD"
                  : "linear-gradient(135deg, #154360, #2E6E96)",
                fontSize: 13, fontWeight: 700, cursor: saving || !name.trim() ? "not-allowed" : "pointer",
                color: "#fff", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 150ms",
              }}
            >
              {saving && <span className="spinner" style={{ width: 12, height: 12 }} />}
              {saving ? "جارٍ الحفظ..." : "إضافة الزبون"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   زر دفع — إتمام مباشر حسب الطريقة
══════════════════════════════════════ */
function PayButton({
  icon, label, hint, color, busy, disabled, onClick,
}: {
  icon: ReactNode; label: string; hint: string;
  color: string;
  busy: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 8px", borderRadius: "var(--radius)", border: "none",
        background: disabled && !busy ? "#CBD5E1" : color,
        color: "#fff", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        transition: "filter 150ms", minHeight: 45,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.08)"; }}
      onMouseOut={e => { e.currentTarget.style.filter = "none"; }}
    >
      {busy
        ? <span className="spinner" style={{ width: 16, height: 16 }} />
        : icon}
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "-0.01em" }}>{label}</span>
        <span style={{ fontSize: 8.5, fontWeight: 500, opacity: 0.85 }}>{hint}</span>
      </span>
    </button>
  );
}

/* ══════════════════════════════════════
   Modal الفواتير المعلّقة
══════════════════════════════════════ */
function HeldInvoicesModal({
  items, onRestore, onDiscard, onClose,
}: {
  items: HeldInvoice[];
  onRestore: (id: string) => void;
  onDiscard: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1050 }}
    >
      <div className="modal-box" style={{ width: 460, maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        {/* الترويسة */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "var(--radius)",
              background: "#FFFBEB", border: "1px solid #FDE68A",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#B45309",
            }}><FolderOpen size={16} /></div>
            <div>
              <p className="modal-title">الفواتير المعلّقة</p>
              <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>
                {items.length} فاتورة بانتظار الاستعادة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "none",
              cursor: "pointer", background: "var(--color-surface-2)",
              color: "var(--color-text-muted)", fontSize: 16, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          ><X size={16} /></button>
        </div>

        {/* القائمة */}
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted)" }}>
              <FolderOpen size={28} strokeWidth={1.5} style={{ marginBottom: 8 }} />
              <p style={{ fontSize: 12 }}>لا توجد فواتير معلّقة</p>
            </div>
          ) : (
            items.map((h, i) => (
              <div
                key={h.id}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  border: "1.5px solid var(--color-border)", borderRadius: "var(--radius)",
                  background: "var(--color-surface)",
                }}
              >
                {/* رقم */}
                <span style={{
                  minWidth: 22, height: 22, borderRadius: 4, flexShrink: 0,
                  background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A",
                  fontSize: 11, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>

                {/* تفاصيل */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", lineHeight: 1.3 }}>
                    {h.customerName?.trim() || "بدون زبون"}
                  </p>
                  <p style={{ fontSize: 10.5, color: "var(--color-text-muted)", marginTop: 2 }}>
                    {h.itemCount} صنف · {fmtIQD(h.total)} ·{" "}
                    {new Date(h.heldAt).toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* استعادة */}
                <button
                  onClick={() => onRestore(h.id)}
                  style={{
                    padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", flexShrink: 0,
                    background: "linear-gradient(135deg, #154360, #2E6E96)", color: "#fff",
                    fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    transition: "filter 130ms",
                  }}
                  onMouseOver={e => { e.currentTarget.style.filter = "brightness(1.07)"; }}
                  onMouseOut={e => { e.currentTarget.style.filter = "none"; }}
                >استعادة</button>

                {/* حذف */}
                <button
                  onClick={() => onDiscard(h.id)}
                  title="حذف الفاتورة المعلّقة"
                  style={{
                    width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "none", flexShrink: 0,
                    cursor: "pointer", background: "transparent",
                    color: "#CBD5E1", fontSize: 16, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 120ms",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "var(--color-danger-light)"; e.currentTarget.style.color = "var(--color-danger)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#CBD5E1"; }}
                ><X size={16} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   صفحة نقطة البيع
══════════════════════════════════════ */
export function Pos() {
  const [query, setQuery]               = useState("");
  const [products, setProducts]         = useState<LocalProduct[]>([]);
  const [lastSale, setLastSale]         = useState<LocalSale | null>(null);
  const [receiptMethod, setReceiptMethod] = useState<PayMethod>("CASH");
  const [activeMethod, setActiveMethod] = useState<PayMethod | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [scanFlash, setScanFlash]       = useState<{ text: string; type: "success" | "danger" } | null>(null);
  const [showHeld, setShowHeld]         = useState(false);
  const searchRef                       = useRef<HTMLInputElement>(null);
  const flashTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cart   = useCart();
  const totals = cart.totals();

  async function loadProducts(q = "") {
    setProducts(await window.medic.listProducts(q));
  }

  useEffect(() => { void loadProducts(); }, []);

  /* إغلاق نافذة الفواتير المعلّقة تلقائيًا عندما لا يتبقّى أيّ فاتورة */
  useEffect(() => {
    if (showHeld && cart.heldInvoices.length === 0) setShowHeld(false);
  }, [showHeld, cart.heldInvoices.length]);

  /* مسح رسالة الخطأ تلقائيًا بمجرّد اختيار زبون (مثلًا بعد تنبيه «اختر زبونًا للبيع الآجل») */
  useEffect(() => {
    if (cart.customerName.trim()) setError(null);
  }, [cart.customerName]);

  /* ── قراءة الباركود ──
     قارئ الباركود يكتب الرمز في حقل البحث ثم يرسل Enter:
     • تطابق دقيق بالباركود → يُضاف المنتج مباشرة للفاتورة.
     • تطابق وحيد ظاهر       → يُضاف هو الآخر (تسهيلًا).
     • لا يوجد / نفد المخزون → تنبيه. */
  function flashScan(text: string, type: "success" | "danger") {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setScanFlash({ text, type });
    flashTimer.current = setTimeout(() => setScanFlash(null), 2200);
  }

  function addScannedToCart(product: LocalProduct) {
    const inCart = cart.lines.find(l => l.productId === product.id)?.quantity ?? 0;
    if (product.quantity <= 0) {
      flashScan(`«${product.nameAr}» نفد من المخزون`, "danger");
      return;
    }
    if (inCart >= product.quantity) {
      flashScan(`الكمية القصوى المتوفرة من «${product.nameAr}» هي ${product.quantity}`, "danger");
      return;
    }
    cart.addProduct(product);
    flashScan(`أُضيف: ${product.nameAr}`, "success");
    setQuery("");
    void loadProducts("");
    searchRef.current?.focus();
  }

  async function handleScan(raw: string) {
    const code = raw.trim();
    if (!code) return;
    let product = await window.medic.findProductByBarcode(code);
    // احتياطي: لو لا تطابق دقيق وكانت النتائج الظاهرة منتجًا واحدًا
    if (!product && products.length === 1) product = products[0]!;
    if (!product) {
      flashScan(`لا يوجد منتج بالباركود «${code}»`, "danger");
      return;
    }
    addScannedToCart(product);
  }

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  /* تركيز البحث عند الضغط على أي حرف — إلا إذا كان الحدث صادرًا من حقل إدخال */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      /* نتحقق من مصدر الحدث (e.target) وليس activeElement
         لتفادي حالات الـ blur اللحظي أثناء إعادة الرسم */
      const src = e.target as HTMLElement;
      if (src.tagName === "INPUT" || src.tagName === "TEXTAREA" || src.tagName === "SELECT") return;
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        void loadProducts("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** يُتمّ البيع فورًا حسب طريقة الدفع المختارة ويعرض وصل البيع.
   *  - نقدي/بطاقة: تسوية كاملة الآن (المدفوع = الإجمالي).
   *  - آجل: المدفوع = الدفعة المقدّمة المُدخلة في حقل "المدفوع" (افتراضيًا 0 = دين كامل). */
  async function checkout(method: PayMethod) {
    if (cart.lines.length === 0 || saving) return;
    const total = totals.total;
    const paid  = method === "CREDIT" ? Math.min(cart.paid, total) : total;
    /* البيع الآجل يُنشئ دينًا (المتبقّي) يجب أن يُنسب لزبون — امنع الإتمام دون اختيار زبون */
    if (method === "CREDIT" && paid < total && !cart.customerName.trim()) {
      setError("اختر زبونًا للبيع الآجل — لا يمكن تسجيل دين دون زبون");
      return;
    }
    setSaving(true); setActiveMethod(method); setError(null);
    try {
      const sale = await window.medic.createSale({
        items: cart.lines.map(l => ({ productId: l.productId, quantity: l.quantity, unitPrice: l.unitPrice, lineDiscount: l.lineDiscount })),
        discount: cart.discount, paid,
        customerName: cart.customerName || undefined,
        customerPhone: cart.customerPhone || undefined,
      });
      setReceiptMethod(method);
      setLastSale(sale);
      cart.clear();
      await loadProducts(query);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر إتمام البيع");
    } finally {
      setSaving(false); setActiveMethod(null);
    }
  }

  const cartMap = new Map(cart.lines.map(l => [l.productId, l.quantity]));

  /* ── الشاشة الرئيسية ── */
  return (
    <div className="pos-layout">

      {/* وصف نتيجة المسح */}
      {scanFlash && (
        <div
          className={`alert alert-${scanFlash.type}`}
          style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            zIndex: 1100, minWidth: 280, boxShadow: "var(--shadow-lg)",
            animation: "scaleIn 200ms ease-out",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center" }}>{scanFlash.type === "success" ? <ScanBarcode size={16} /> : <AlertTriangle size={16} />}</span>
          <span>{scanFlash.text}</span>
        </div>
      )}

      {/* ══════════ لوحة المنتجات ══════════ */}
      <div className="pos-products-panel">

        {/* شريط البحث */}
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", color: "var(--color-text-muted)",
          }}><Search size={15} /></span>
          <input
            ref={searchRef}
            type="search"
            placeholder="امسح الباركود أو ابحث بالاسم... (اضغط أي حرف)"
            value={query}
            onChange={e => { setQuery(e.target.value); void loadProducts(e.target.value); }}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void handleScan(e.currentTarget.value); } }}
            style={{
              width: "100%", padding: "10px 42px 10px 36px",
              borderRadius: "var(--radius)", border: "1.5px solid var(--color-border)",
              fontSize: 13, fontFamily: "inherit", outline: "none",
              background: "var(--color-surface)", color: "var(--color-text)",
              transition: "border-color 150ms, box-shadow 150ms",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,82,118,0.1)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); void loadProducts(""); searchRef.current?.focus(); }}
              style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-text-muted)", fontSize: 14, padding: 2,
              }}
            ><X size={13} /></button>
          )}
        </div>

        {/* شريط المعلومات */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 2px" }}>
          <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            {products.length} منتج {query ? `لـ "${query}"` : ""}
          </span>
          {cart.lines.length > 0 && (
            <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 600 }}>
              {cart.lines.length} صنف في الفاتورة
            </span>
          )}
        </div>

        {/* شبكة المنتجات */}
        <div className="pos-product-grid">
          {products.length === 0 && (
            <div style={{
              gridColumn: "1/-1", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, padding: "60px 0", color: "var(--color-text-muted)",
            }}>
              <Package size={44} strokeWidth={1.5} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>
                {query ? `لا توجد نتائج لـ "${query}"` : "لا توجد منتجات — شغّل المزامنة لجلبها"}
              </p>
            </div>
          )}
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              qtyInCart={cartMap.get(p.id) ?? 0}
              onAdd={() => cart.addProduct(p)}
            />
          ))}
        </div>
      </div>

      {/* ══════════ لوحة الفاتورة ══════════ */}
      <div className="pos-cart-panel">

        {/* ── Header ── */}
        <div className="pos-cart-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "var(--radius-sm)",
              background: "var(--color-primary-light)", border: "1px solid var(--color-primary-mid)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)",
            }}><Receipt size={15} /></div>
            <div>
              <p className="pos-cart-title">الفاتورة الحالية</p>
              <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 1 }}>
                {new Date().toLocaleDateString("ar-IQ", { weekday: "short", day: "numeric", month: "short" })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {cart.lines.length > 0 && (
              <span style={{
                background: "var(--color-primary)", color: "#fff",
                fontSize: 10, fontWeight: 800,
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {cart.lines.length}
              </span>
            )}

            {/* الفواتير المعلّقة — متاح دائمًا ما دامت هناك فواتير محفوظة */}
            {cart.heldInvoices.length > 0 && (
              <button
                onClick={() => setShowHeld(true)}
                title="عرض الفواتير المعلّقة واستعادتها"
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#FFFBEB", border: "1px solid #FDE68A",
                  borderRadius: "var(--radius-sm)", cursor: "pointer",
                  fontSize: 10, color: "#B45309", fontWeight: 700,
                  padding: "3px 8px", fontFamily: "inherit", transition: "all 150ms",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#FEF3C7"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#FFFBEB"; }}
              >
                <FolderOpen size={12} /> معلّقة
                <span style={{
                  background: "#F59E0B", color: "#fff", borderRadius: 8,
                  fontSize: 9, fontWeight: 800, padding: "0 5px", minWidth: 14,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cart.heldInvoices.length}
                </span>
              </button>
            )}

            {/* تعليق الفاتورة الحالية */}
            {cart.lines.length > 0 && (
              <button
                onClick={() => cart.holdCurrent()}
                title="تعليق الفاتورة الحالية وبدء فاتورة جديدة"
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "var(--color-primary-light)", border: "1px solid var(--color-primary-mid)",
                  borderRadius: "var(--radius-sm)", cursor: "pointer",
                  fontSize: 10, color: "var(--color-primary)", fontWeight: 700,
                  padding: "3px 8px", fontFamily: "inherit", transition: "all 150ms",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "#fff"; }}
                onMouseOut={e => { e.currentTarget.style.background = "var(--color-primary-light)"; e.currentTarget.style.color = "var(--color-primary)"; }}
              ><Pause size={12} /> تعليق</button>
            )}

            {cart.lines.length > 0 && (
              <button
                onClick={() => cart.clear()}
                style={{
                  background: "none", border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)", cursor: "pointer",
                  fontSize: 10, color: "var(--color-text-muted)",
                  padding: "3px 8px", fontFamily: "inherit", transition: "all 150ms",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--color-danger)"; e.currentTarget.style.color = "var(--color-danger)"; e.currentTarget.style.background = "var(--color-danger-light)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.background = "none"; }}
              >مسح الكل</button>
            )}
          </div>
        </div>

        {/* ── قائمة الأصناف ── */}
        <div className="pos-cart-body">
          {cart.lines.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", gap: 10,
              color: "var(--color-text-muted)", userSelect: "none",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--color-surface-2)", border: "2px dashed var(--color-border)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)",
              }}><ShoppingCart size={24} /></div>
              <p style={{ fontSize: 12, fontWeight: 500 }}>الفاتورة فارغة</p>
              <p style={{ fontSize: 11, color: "#CBD5E1" }}>اضغط على منتج لإضافته</p>
            </div>
          ) : (
            cart.lines.map((l, idx) => (
              <CartRow
                key={l.productId}
                index={idx + 1}
                name={l.nameAr}
                unitPrice={l.unitPrice}
                quantity={l.quantity}
                lineTotal={totals.lines[idx]?.lineTotal ?? 0}
                available={l.available}
                onQtyChange={n => cart.setQuantity(l.productId, n)}
                onPriceChange={n => cart.setUnitPrice(l.productId, n)}
                onRemove={() => cart.removeLine(l.productId)}
              />
            ))
          )}
        </div>

        {/* ── خصم + مدفوع + زبون (ثابت دائمًا) ── */}
        <CartFields
          discount={cart.discount}
          paid={cart.paid}
          total={totals.total}
          customerName={cart.customerName}
          customerPhone={cart.customerPhone}
          onDiscountChange={cart.setDiscount}
          onPaidChange={cart.setPaid}
          onCustomerName={cart.setCustomerName}
          onCustomerPhone={cart.setCustomerPhone}
        />

        {/* ── الملخص والإجمالي (بطاقة مدمجة) ── */}
        <div className="pos-cart-footer">
          <div style={{
            background: "var(--color-surface-2)", border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius)", padding: "8px 12px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--color-text-secondary)" }}>
              <span>المجموع الفرعي</span>
              <span style={{ fontWeight: 600 }}>{fmtIQD(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--color-success)" }}>
                <span>الخصم الكلي</span>
                <span style={{ fontWeight: 700 }}>− {fmtIQD(totals.discount)}</span>
              </div>
            )}
            {/* الإجمالي البارز */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 1, paddingTop: 6, borderTop: "1px solid var(--color-border)",
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-text)" }}>الإجمالي</span>
              <span style={{ fontSize: 21, fontWeight: 800, color: "var(--color-primary)", letterSpacing: "-0.04em" }}>
                {fmt(totals.total)}<span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-muted)", marginRight: 3 }}>د.ع</span>
              </span>
            </div>
            {totals.remaining > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5 }}>
                <span style={{ color: "var(--color-danger)" }}>المتبقّي (دين)</span>
                <span style={{ fontWeight: 700, color: "var(--color-danger)" }}>{fmtIQD(totals.remaining)}</span>
              </div>
            )}
          </div>

          {/* خطأ */}
          {error && (
            <div style={{
              background: "var(--color-danger-light)", border: "1px solid #FECACA",
              borderRadius: "var(--radius)", padding: "8px 10px",
              fontSize: 11, color: "var(--color-danger)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* أزرار الدفع — إتمام مباشر (مُعطّلة عند فراغ السلة) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <PayButton
              icon={<Banknote size={16} />} label="نقدي" hint="دفع كامل"
              color="#2F855A"
              busy={activeMethod === "CASH"} disabled={saving || cart.lines.length === 0}
              onClick={() => checkout("CASH")}
            />
            <PayButton
              icon={<CreditCard size={16} />} label="بطاقة" hint="دفع كامل"
              color="#1A5276"
              busy={activeMethod === "CARD"} disabled={saving || cart.lines.length === 0}
              onClick={() => checkout("CARD")}
            />
            <PayButton
              icon={<CalendarClock size={16} />} label="آجل" hint="دين / لاحقًا"
              color="#B45309"
              busy={activeMethod === "CREDIT"} disabled={saving || cart.lines.length === 0}
              onClick={() => checkout("CREDIT")}
            />
          </div>
        </div>
      </div>

      {/* ══════════ وصل البيع المنبثق ══════════ */}
      {lastSale && (
        <ReceiptModal
          sale={lastSale}
          method={receiptMethod}
          onClose={() => setLastSale(null)}
        />
      )}

      {/* ══════════ نافذة الفواتير المعلّقة ══════════ */}
      {showHeld && (
        <HeldInvoicesModal
          items={cart.heldInvoices}
          onRestore={id => { cart.restoreHeld(id); setShowHeld(false); }}
          onDiscard={id => cart.discardHeld(id)}
          onClose={() => setShowHeld(false)}
        />
      )}
    </div>
  );
}
