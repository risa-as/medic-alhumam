import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import {
  FileText, Image as ImageIcon, Settings, Wallet, Package, Globe, Camera, Clapperboard,
  Check, AlertTriangle, ArrowRight, RefreshCw, ScanBarcode, ScanLine, Search, Pencil, Truck, Trash2, Inbox, X,
} from "lucide-react";
import { PageHeader, StatusBadge, DeleteDialog, Btn } from "../components/ui";
import type { LocalProduct, Category, ProductCreateInput, ProductUpdateInput } from "../types";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

/* ══════════════════════════════════════════
   MiniStat
══════════════════════════════════════════ */
function MiniStat({
  label, value, color, icon,
}: { label: string; value: number | string; color: string; icon: ReactNode }) {
  return (
    <div
      className="stat-card"
      style={{ borderRight: `3px solid ${color}`, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}
    >
      <div
        style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: `${color}18`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>{value}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Toast
══════════════════════════════════════════ */
function Toast({ msg, type }: { msg: string; type: "success" | "danger" }) {
  return (
    <div
      className={`alert alert-${type}`}
      style={{
        position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 1100, minWidth: 300, boxShadow: "var(--shadow-lg)",
        animation: "scaleIn 200ms ease-out",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center" }}>{type === "success" ? <Check size={16} strokeWidth={3} /> : <AlertTriangle size={16} />}</span>
      <span>{msg}</span>
    </div>
  );
}

/* ══════════════════════════════════════════
   نموذج المنتج — بطاقة مقسّمة قابلة لإعادة الاستخدام
══════════════════════════════════════════ */
function FormSection({
  icon, title, children,
}: { icon: ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: "1px solid var(--color-border-light)", background: "var(--color-surface-2)" }}>
        <span style={{ color: "var(--color-primary)", display: "inline-flex" }}>{icon}</span>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)" }}>{title}</p>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

/* زر رفع وسائط (صور/فيديو) — يقرأ الملفات ويرفعها عبر main → /api/uploads */
function MediaUpload({
  icon, label, hint, accept, multiple, uploading, onPick,
}: {
  icon: ReactNode; label: string; hint: string; accept: string;
  multiple?: boolean; uploading: boolean;
  onPick: (files: FileList | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        disabled={uploading}
        onChange={e => { onPick(e.target.files); if (inputRef.current) inputRef.current.value = ""; }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "18px 12px", textAlign: "center",
          border: "2px dashed var(--color-border)", borderRadius: "var(--radius)",
          background: uploading ? "var(--color-primary-light)" : "transparent",
          color: "var(--color-text)", cursor: uploading ? "wait" : "pointer",
          fontFamily: "inherit", transition: "all 150ms",
        }}
        onMouseOver={e => { if (!uploading) { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.background = "var(--color-primary-light)"; } }}
        onMouseOut={e => { if (!uploading) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.background = "transparent"; } }}
      >
        {uploading ? (
          <>
            <span className="spinner spinner-dark" />
            <span style={{ fontSize: 11, color: "var(--color-primary)" }}>جارٍ الرفع...</span>
          </>
        ) : (
          <>
            <span style={{ color: "var(--color-primary)", display: "inline-flex" }}>{icon}</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)" }}>{label}</p>
              <p style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{hint}</p>
            </div>
          </>
        )}
      </button>
    </div>
  );
}

interface CustomFieldRow {
  id: string;
  name: string;
  type: "select" | "text";
  optionsText: string;
  required: boolean;
}

interface CreateFormProps {
  categories: Category[];
  initialSku?: string;
  onSave: (input: ProductCreateInput) => Promise<void>;
  onCancel: () => void;
}

function CreateForm({ categories, initialSku = "", onSave, onCancel }: CreateFormProps) {
  const [nameAr, setNameAr]           = useState("");
  const [sku, setSku]                 = useState(initialSku);
  const [categoryId, setCategoryId]   = useState(categories[0]?.id ?? "");
  const [costPrice, setCostPrice]     = useState("");
  const [salePrice, setSalePrice]     = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [quantity, setQuantity]       = useState("0");
  const [minQuantity, setMinQuantity] = useState("0");
  const [isOnline, setIsOnline]       = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages]           = useState<string[]>([]);
  const [videoUrl, setVideoUrl]       = useState<string | undefined>(undefined);
  const [customFields, setCustomFields] = useState<CustomFieldRow[]>([]);
  const [uploading, setUploading]     = useState<"image" | "video" | null>(null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const costNum    = Number(costPrice);
  const saleNum    = Number(salePrice);
  const compareNum = Number(compareAtPrice);
  const margin = saleNum > 0 && costNum > 0 ? Math.round(((saleNum - costNum) / saleNum) * 100) : null;
  const discountPct = compareNum > saleNum && saleNum > 0 ? Math.round(((compareNum - saleNum) / compareNum) * 100) : null;

  /* رفع الصور/الفيديو عبر القناة الآمنة (main → /api/uploads) */
  async function handleUpload(kind: "image" | "video", fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    setUploading(kind); setError(null);
    try {
      const payload = await Promise.all(
        files.map(async f => ({ name: f.name, type: f.type, data: await f.arrayBuffer() })),
      );
      const urls = await window.medic.uploadProductMedia(kind, payload);
      if (kind === "image") setImages(prev => [...prev, ...urls]);
      else setVideoUrl(urls[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر رفع الملف");
    } finally {
      setUploading(null);
    }
  }

  function addCustomField() {
    setCustomFields(prev => [...prev, { id: crypto.randomUUID(), name: "", type: "select", optionsText: "", required: false }]);
  }
  function updateCustomField(id: string, patch: Partial<CustomFieldRow>) {
    setCustomFields(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));
  }
  function removeCustomField(id: string) {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) { setError("يجب اختيار فئة"); return; }
    // تحقّق خفيف من الحقول المخصّصة (الخادم يتحقق أيضًا)
    for (const f of customFields) {
      if (!f.name.trim()) { setError("اسم الحقل المخصّص مطلوب"); return; }
      if (f.type === "select" && f.optionsText.split(/[،,]/).map(s => s.trim()).filter(Boolean).length === 0) {
        setError(`حقل القائمة «${f.name}» يتطلب قيمة واحدة على الأقل`); return;
      }
    }
    setSaving(true); setError(null);
    try {
      await onSave({
        nameAr: nameAr.trim(), sku: sku.trim(), categoryId,
        costPrice: costNum, salePrice: saleNum,
        compareAtPrice: compareAtPrice.trim() === "" ? null : compareNum,
        quantity: Number(quantity), minQuantity: Number(minQuantity),
        isOnline, description: description.trim() || undefined,
        images, videoUrl,
        customFields: customFields.map(f => ({
          id: f.id, name: f.name.trim(), type: f.type, required: f.required,
          options: f.type === "select"
            ? f.optionsText.split(/[،,]/).map(s => s.trim()).filter(Boolean)
            : undefined,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* عنوان */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>إضافة منتج جديد</h2>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>أدخل بيانات المنتج الجديد</p>
      </div>

      {/* تخطيط بعمودين */}
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>

        {/* ═══ العمود الرئيسي ═══ */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>

          {/* البيانات الأساسية */}
          <FormSection icon={<FileText size={16} />} title="البيانات الأساسية">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">اسم المنتج *</label>
                <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} required className="input-field" placeholder="مثال: ضمادة طبية" autoFocus />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">الرمز / الباركود *</label>
                  <input type="text" value={sku} onChange={e => setSku(e.target.value)} required className="input-field" placeholder="مثال: MED-001" style={initialSku ? { borderColor: "var(--color-success)", background: "var(--color-success-light)" } : undefined} />
                  {initialSku && <p className="form-hint" style={{ color: "var(--color-success)", display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={13} strokeWidth={3} /> تمّت تعبئته من الباركود الممسوح</p>}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">الفئة *</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="input-field">
                    {categories.length === 0
                      ? <option value="">لا توجد فئات — تحقق من الاتصال</option>
                      : categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الوصف (اختياري)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" rows={2} placeholder="وصف مختصر للمنتج..." style={{ resize: "vertical" }} />
              </div>
            </div>
          </FormSection>

          {/* الصور والوسائط */}
          <FormSection icon={<ImageIcon size={16} />} title="الصور والوسائط">
            {(images.length > 0 || videoUrl) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {images.map((u, i) => (
                  <div key={u} style={{ position: "relative", width: 64, height: 64, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                    <img src={u} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => setImages(images.filter(x => x !== u))} title="حذف" style={mediaRemoveBtnStyle}><X size={14} /></button>
                    {i === 0 && (
                      <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(26,82,118,0.85)", color: "#fff", fontSize: 9, textAlign: "center", padding: "1px 0" }}>رئيسية</span>
                    )}
                  </div>
                ))}
                {videoUrl && (
                  <div style={{ position: "relative", width: 64, height: 64, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--color-border)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clapperboard size={22} style={{ color: "var(--color-text-muted)" }} />
                    <button type="button" onClick={() => setVideoUrl(undefined)} title="حذف" style={mediaRemoveBtnStyle}><X size={14} /></button>
                  </div>
                )}
              </div>
            )}
            {images.length === 0 && !videoUrl && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius)", background: "var(--color-bg)", padding: "16px 0", marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>لم يتم رفع وسائط بعد</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <MediaUpload icon={<Camera size={22} />} label="رفع صور المنتج" hint="JPG، PNG، WEBP — حتى 4MB، بحد أقصى 5" accept="image/*" multiple uploading={uploading === "image"} onPick={fl => handleUpload("image", fl)} />
              <MediaUpload icon={<Clapperboard size={22} />} label="رفع فيديو المنتج" hint="MP4، MOV — حتى 64MB، فيديو واحد" accept="video/*" uploading={uploading === "video"} onPick={fl => handleUpload("video", fl)} />
            </div>
          </FormSection>

          {/* الحقول المخصّصة */}
          <FormSection icon={<Settings size={16} />} title="الحقول المخصّصة">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {customFields.map(f => (
                <div key={f.id} style={{ display: "grid", gridTemplateColumns: "3fr 2fr 4fr auto auto", alignItems: "center", gap: 8, padding: 8, border: "1px solid var(--color-border-light)", borderRadius: "var(--radius)", background: "var(--color-bg)" }}>
                  <input value={f.name} onChange={e => updateCustomField(f.id, { name: e.target.value })} placeholder="اسم الحقل (مثل: اللون)" className="input-field" style={{ fontSize: 12 }} />
                  <select value={f.type} onChange={e => updateCustomField(f.id, { type: e.target.value as "select" | "text" })} className="input-field" style={{ fontSize: 12 }}>
                    <option value="select">قائمة</option>
                    <option value="text">نص حر</option>
                  </select>
                  <input value={f.optionsText} onChange={e => updateCustomField(f.id, { optionsText: e.target.value })} placeholder={f.type === "select" ? "أحمر، أزرق، أخضر..." : "—"} disabled={f.type !== "select"} className="input-field" style={{ fontSize: 12, opacity: f.type === "select" ? 1 : 0.5 }} />
                  <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                    <input type="checkbox" checked={f.required} onChange={e => updateCustomField(f.id, { required: e.target.checked })} />
                    إلزامي
                  </label>
                  <button type="button" onClick={() => removeCustomField(f.id)} title="حذف" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", border: "none", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--color-danger)", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>×</button>
                </div>
              ))}
              {customFields.length === 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius)", padding: "14px 0" }}>
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>لا توجد حقول مخصّصة</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <Btn type="button" variant="secondary" size="sm" onClick={addCustomField}>+ إضافة حقل</Btn>
            </div>
          </FormSection>
        </div>

        {/* ═══ العمود الجانبي ═══ */}
        <div style={{ width: 270, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* التسعير */}
          <FormSection icon={<Wallet size={16} />} title="التسعير">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">سعر الشراء (د.ع) *</label>
                <input type="number" min={0} step="0.01" value={costPrice} onChange={e => setCostPrice(e.target.value)} required className="input-field" placeholder="0" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">سعر البيع (د.ع) *</label>
                <input type="number" min={0} step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} required className="input-field" placeholder="0" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">السعر قبل الخصم (د.ع)</label>
                <input type="number" min={0} step="0.01" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} className="input-field" placeholder="اتركه فارغًا إن لا يوجد خصم" />
              </div>
              {discountPct !== null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "var(--radius)", padding: "8px 12px", fontSize: 12, background: "#FFE4E6", color: "#E11D48" }}>
                  <span>نسبة الخصم في المتجر</span>
                  <span style={{ fontWeight: 700 }}>-{discountPct}%</span>
                </div>
              )}
              {margin !== null && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "var(--radius)", padding: "8px 12px", fontSize: 12,
                  background: margin >= 20 ? "#D1FAE5" : margin >= 10 ? "#FEF3C7" : "#FEE2E2",
                  color: margin >= 20 ? "#1A7F5A" : margin >= 10 ? "#B45309" : "#B91C1C" }}>
                  <span>هامش الربح</span>
                  <span style={{ fontWeight: 700 }}>{margin}%</span>
                </div>
              )}
            </div>
          </FormSection>

          {/* المخزون */}
          <FormSection icon={<Package size={16} />} title="المخزون">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الكمية الأولية</label>
                <input type="number" min={0} value={quantity} onChange={e => setQuantity(e.target.value)} className="input-field" placeholder="0" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">حد التنبيه</label>
                <input type="number" min={0} value={minQuantity} onChange={e => setMinQuantity(e.target.value)} className="input-field" placeholder="0" />
              </div>
            </div>
          </FormSection>

          {/* المتجر الإلكتروني */}
          <FormSection icon={<Globe size={16} />} title="المتجر الإلكتروني">
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <span style={{ position: "relative", display: "inline-block", width: 36, height: 20, flexShrink: 0, marginTop: 2 }}>
                <input type="checkbox" checked={isOnline} onChange={e => setIsOnline(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: isOnline ? "var(--color-primary)" : "var(--color-border)", transition: "all 150ms" }} />
                <span style={{ position: "absolute", top: 2, right: isOnline ? "auto" : 2, left: isOnline ? 2 : "auto", width: 14, height: 14, borderRadius: 999, background: "#fff", boxShadow: "var(--shadow-xs)", transition: "all 150ms" }} />
              </span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)" }}>عرض في المتجر</p>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>يظهر للزبائن عبر الإنترنت</p>
              </div>
            </label>
          </FormSection>

          {/* معاينة سريعة */}
          {nameAr && (
            <div style={{ borderRadius: "var(--radius)", border: "1px solid var(--color-primary-mid)", background: "var(--color-primary-light)", padding: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: "var(--color-primary)", marginBottom: 8 }}>معاينة البطاقة</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>{nameAr}</p>
              {sku && <code style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{sku}</code>}
              {saleNum > 0 && <p style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: "var(--color-primary)" }}>{fmt(saleNum)} د.ع</p>}
            </div>
          )}
        </div>
      </div>

      {/* شريط الإجراءات السفلي */}
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "var(--radius)", border: "1px solid var(--color-border)", background: "var(--color-surface)", boxShadow: "var(--shadow-sm)", padding: "14px 18px" }}>
        <div>
          {error && (
            <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-danger)" }}>
              <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" type="button" onClick={onCancel} disabled={saving}>إلغاء</Btn>
          <Btn variant="primary" type="submit" loading={saving} loadingText="جارٍ الحفظ..." disabled={uploading !== null}>
            إضافة المنتج
          </Btn>
        </div>
      </div>
    </form>
  );
}

const mediaRemoveBtnStyle: React.CSSProperties = {
  position: "absolute", top: 2, left: 2, width: 18, height: 18,
  display: "flex", alignItems: "center", justifyContent: "center",
  border: "none", borderRadius: "var(--radius-sm)",
  background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 13, lineHeight: 1,
  cursor: "pointer",
};

interface EditFormProps {
  product: LocalProduct;
  onSave: (input: ProductUpdateInput) => Promise<void>;
  onCancel: () => void;
}

function EditForm({ product, onSave, onCancel }: EditFormProps) {
  const [nameAr, setNameAr]           = useState(product.nameAr);
  const [sku, setSku]                 = useState(product.sku);
  const [salePrice, setSalePrice]     = useState(String(product.salePrice));
  const [minQuantity, setMinQuantity] = useState(String(product.minQuantity));
  const [isOnline, setIsOnline]       = useState(product.isOnline);
  const [description, setDescription] = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await onSave({
        nameAr: nameAr.trim(), sku: sku.trim(),
        salePrice: Number(salePrice), minQuantity: Number(minQuantity),
        isOnline, description: description.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">اسم المنتج *</label>
          <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} required className="input-field" autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">الباركود / الرمز *</label>
          <input type="text" value={sku} onChange={e => setSku(e.target.value)} required className="input-field" />
        </div>

        <div className="form-group">
          <label className="form-label">سعر البيع *</label>
          <input type="number" min={0} step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} required className="input-field" />
        </div>

        <div className="form-group">
          <label className="form-label">حد تنبيه النقص</label>
          <input type="number" min={0} value={minQuantity} onChange={e => setMinQuantity(e.target.value)} className="input-field" />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">الوصف (اختياري)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" rows={2} placeholder="اتركه فارغًا للإبقاء على الوصف الحالي..." style={{ resize: "vertical" }} />
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id="isOnlineEdit" checked={isOnline} onChange={e => setIsOnline(e.target.checked)} style={{ width: 15, height: 15, cursor: "pointer" }} />
          <label htmlFor="isOnlineEdit" style={{ fontSize: 13, color: "var(--color-text)", cursor: "pointer" }}>
            نشر في المتجر الإلكتروني
          </label>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: 14 }}>
          <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <Btn variant="secondary" type="button" onClick={onCancel} disabled={saving}>إلغاء</Btn>
        <Btn variant="primary" type="submit" loading={saving} loadingText="جارٍ الحفظ...">
          حفظ التعديلات
        </Btn>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════
   الصفحة الرئيسية
══════════════════════════════════════════ */
interface InventoryProps {
  isAdmin: boolean;
}

export function Inventory({ isAdmin }: InventoryProps) {
  const [allProducts, setAllProducts] = useState<LocalProduct[]>([]);
  const [query, setQuery]             = useState("");
  const [lowOnly, setLowOnly]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [syncing, setSyncing]         = useState(false);

  // نموذج الإنشاء
  const [showCreate, setShowCreate]   = useState(false);
  const [createSku, setCreateSku]     = useState("");
  const [categories, setCategories]   = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  // قارئ الباركود
  const [barcode, setBarcode]   = useState("");
  const [scanMsg, setScanMsg]   = useState<{ text: string; type: "info" | "found" | "new" } | null>(null);
  const [scanning, setScanning] = useState(false);
  const barcodeRef = useRef<HTMLInputElement>(null);

  // نموذج التعديل
  const [editing, setEditing]         = useState<LocalProduct | null>(null);

  // حذف
  const [deleteTarget, setDeleteTarget] = useState<LocalProduct | null>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // شراء مخزون
  const [purchaseTarget, setPurchaseTarget] = useState<LocalProduct | null>(null);
  const [purchaseQty, setPurchaseQty]       = useState("10");
  const [purchaseCost, setPurchaseCost]     = useState("");
  const [purchasing, setPurchasing]         = useState(false);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "danger" } | null>(null);

  /* ─── تحميل المنتجات ─── */
  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const data = await window.medic.listProducts(q);
      setAllProducts(data);
    } catch (err) {
      console.error("listProducts failed:", err);
      showToast(err instanceof Error ? err.message : "تعذّر تحميل المنتجات", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(query); }, [query]);

  const products = lowOnly
    ? allProducts.filter(p => p.quantity <= p.minQuantity)
    : allProducts;

  const lowCount    = allProducts.filter(p => p.quantity <= p.minQuantity).length;
  const onlineCount = allProducts.filter(p => p.isOnline).length;

  /* ─── toast ─── */
  function showToast(msg: string, type: "success" | "danger") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ─── فتح نموذج الإنشاء ─── */
  async function openCreate(prefillSku = "") {
    setCreateSku(prefillSku);
    if (isAdmin && categories.length === 0) {
      setCatsLoading(true);
      const cats = await window.medic.listCategories();
      setCategories(cats);
      setCatsLoading(false);
    }
    setShowCreate(true);
  }

  /* ─── قراءة الباركود ───
     قارئ الباركود يكتب الرمز ثم يرسل Enter → نتحقق فورًا:
     • موجود  → نفتح شاشة إدخال شحنة المخزون.
     • جديد   → نفتح نافذة إضافة منتج جديد بالباركود مُعبّأً. */
  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    const code = barcode.trim();
    if (!code || scanning) return;
    setScanning(true);
    setScanMsg(null);

    // 1) البحث المحلي عن الباركود — معزول حتى لا يختلط خطؤه بخطأ فتح النموذج
    let found: LocalProduct | null;
    try {
      found = await window.medic.findProductByBarcode(code);
    } catch (err) {
      console.error("findProductByBarcode failed:", err);
      showToast(err instanceof Error ? err.message : "تعذّر قراءة الباركود", "danger");
      setScanning(false);
      return;
    }

    // 2) التوجيه: موجود → إدخال شحنة · جديد → إضافة منتج
    setBarcode("");
    try {
      if (found) {
        setScanMsg({ text: `تم العثور على «${found.nameAr}» — إدخال شحنة`, type: "found" });
        setPurchaseTarget(found);
        setPurchaseQty("10");
        setPurchaseCost("");
      } else {
        setScanMsg({ text: `باركود جديد (${code}) — إضافة منتج`, type: "new" });
        await openCreate(code);
      }
    } catch (err) {
      console.error("barcode routing failed:", err);
      showToast(err instanceof Error ? err.message : "تعذّر فتح النموذج بعد قراءة الباركود", "danger");
    } finally {
      setScanning(false);
    }
  }

  /* إعادة التركيز على حقل المسح عند إغلاق أي نافذة (جاهزية للمسح التالي) */
  useEffect(() => {
    if (isAdmin && !showCreate && !editing && !deleteTarget && !purchaseTarget) {
      barcodeRef.current?.focus();
    }
  }, [isAdmin, showCreate, editing, deleteTarget, purchaseTarget]);

  /* ─── حفظ منتج جديد ─── */
  async function handleCreate(input: ProductCreateInput) {
    await window.medic.createProduct(input);
    showToast("تم إنشاء المنتج بنجاح وتمت المزامنة", "success");
    setShowCreate(false);
    void load(query);
  }

  /* ─── حفظ تعديل ─── */
  async function handleUpdate(input: ProductUpdateInput) {
    if (!editing) return;
    await window.medic.updateProduct(editing.id, input);
    showToast("تم تحديث المنتج بنجاح", "success");
    setEditing(null);
    void load(query);
  }

  /* ─── حذف ─── */
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeletingId(deleteTarget.id);
    try {
      await window.medic.deleteProduct(deleteTarget.id);
      showToast("تم الحذف بنجاح", "success");
      setDeleteTarget(null);
      void load(query);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "فشل الحذف", "danger");
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  }

  /* ─── شراء مخزون ─── */
  async function handlePurchase() {
    if (!purchaseTarget) return;
    const qty = Number(purchaseQty);
    const cost = Number(purchaseCost);
    if (qty <= 0) return;
    if (!(cost >= 0) || purchaseCost.trim() === "") {
      showToast("يجب إدخال سعر شراء الشحنة", "danger");
      return;
    }
    setPurchasing(true);
    try {
      await window.medic.purchaseStock(purchaseTarget.id, qty, cost);
      showToast(`تمت إضافة ${qty} وحدة بنجاح`, "success");
      setPurchaseTarget(null);
      void load(query);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "فشل إضافة المخزون", "danger");
    } finally {
      setPurchasing(false);
    }
  }

  /* ─── مزامنة ─── */
  async function syncAndRefresh() {
    setSyncing(true);
    await window.medic.syncNow();
    await load(query);
    setSyncing(false);
    showToast("تمت المزامنة مع الخادم", "success");
  }

  /* ══════════════════════════════════════════
     شاشة إنشاء منتج
  ══════════════════════════════════════════ */
  if (showCreate) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <button onClick={() => setShowCreate(false)} style={{ ...breadcrumbBtnStyle, display: "inline-flex", alignItems: "center", gap: 4 }}><ArrowRight size={14} /> المخزون</button>
          <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--color-text)" }}>إضافة منتج جديد</span>
        </div>
        {catsLoading ? (
          <div className="surface" style={{ maxWidth: 660 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-muted)", padding: "20px 0" }}>
              <span className="spinner spinner-dark" />
              جارٍ تحميل الفئات...
            </div>
          </div>
        ) : (
          <CreateForm
            categories={categories}
            initialSku={createSku}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     الصفحة الرئيسية — قائمة المنتجات
  ══════════════════════════════════════════ */
  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <PageHeader
        title="المخزون"
        subtitle="إدارة المنتجات والكميات"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm" loading={syncing} loadingText="مزامنة..." onClick={syncAndRefresh}>
              <RefreshCw size={14} /> مزامنة
            </Btn>
            {isAdmin && (
              <Btn variant="primary" size="sm" onClick={() => openCreate()}>
                + إضافة منتج
              </Btn>
            )}
          </div>
        }
      />

      {/* ─── قارئ الباركود ─── */}
      {isAdmin && (
        <div
          className="surface"
          style={{ padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
        >
          <div
            style={{ width: 40, height: 40, borderRadius: "var(--radius)", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}
          >
            <ScanBarcode size={20} />
          </div>
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }}>قراءة الباركود</p>
            <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>امسح المنتج: موجود ← إدخال شحنة · جديد ← إضافة منتج</p>
          </div>

          <form onSubmit={handleScan} style={{ flex: 1, minWidth: 240, display: "flex", gap: 8 }}>
            <div className="search-wrapper" style={{ flex: 1 }}>
              <span className="search-icon"><ScanLine size={15} /></span>
              <input
                ref={barcodeRef}
                type="text"
                value={barcode}
                onChange={e => { setBarcode(e.target.value); if (scanMsg) setScanMsg(null); }}
                placeholder="امسح أو اكتب الباركود ثم اضغط Enter..."
                className="input-field"
                autoFocus
                dir="ltr"
                style={{ textAlign: "left" }}
              />
            </div>
            <Btn variant="primary" size="md" type="submit" loading={scanning} loadingText="بحث...">
              تحقّق
            </Btn>
          </form>

          {scanMsg && (
            <span
              className={`badge ${scanMsg.type === "found" ? "badge-success" : scanMsg.type === "new" ? "badge-info" : "badge-neutral"}`}
              style={{ flexShrink: 0 }}
            >
              {scanMsg.text}
            </span>
          )}
        </div>
      )}

      {/* ─── إحصائيات سريعة ─── */}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          <MiniStat label="إجمالي المنتجات" value={allProducts.length} color="#1A5276" icon={<Package size={18} />} />
          <MiniStat label="نواقص المخزون"    value={lowCount}           color="#B45309" icon={<AlertTriangle size={18} />} />
          <MiniStat label="نشط في المتجر"    value={onlineCount}        color="#1A7F5A" icon={<Globe size={18} />} />
        </div>
      )}

      {/* ─── شريط البحث والفلتر ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div className="search-wrapper" style={{ flex: 1, maxWidth: 320 }}>
          <span className="search-icon"><Search size={15} /></span>
          <input
            type="search"
            placeholder="بحث بالاسم أو الباركود..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field"
          />
        </div>

        <button
          onClick={() => setLowOnly(!lowOnly)}
          className="pill"
          style={lowOnly
            ? { background: "var(--color-warning-light)", color: "var(--color-warning)", borderColor: "var(--color-warning)" }
            : {}
          }
        >
          <AlertTriangle size={14} /> النواقص فقط
          {lowCount > 0 && (
            <span style={{ marginRight: 6, background: lowOnly ? "var(--color-warning)" : "var(--color-warning-light)", color: lowOnly ? "#fff" : "var(--color-warning)", borderRadius: "var(--radius-sm)", padding: "1px 5px", fontSize: 10, fontWeight: 700 }}>
              {lowCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── الجدول ─── */}
      <div className="data-table-wrapper" style={{ boxShadow: "var(--shadow-sm)" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 1, whiteSpace: "nowrap" }}>#</th>
              <th style={{ width: "35%" }}>المنتج</th>
              <th>الرمز</th>
              <th>سعر البيع</th>
              <th>الكمية</th>
              <th>المتجر</th>
              {isAdmin && <th style={{ width: 130 }}>إجراءات</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="empty-row">
                <td colSpan={isAdmin ? 7 : 6}>
                  <span className="spinner spinner-dark" style={{ marginLeft: 8 }} />
                  جارٍ التحميل...
                </td>
              </tr>
            )}

            {!loading && products.map((p, index) => {
              const isLow      = p.quantity <= p.minQuantity;
              const isDeleting = deletingId === p.id;
              return (
                <tr
                  key={p.id}
                  className={[
                    isLow ? "row-low-stock" : "",
                    isDeleting ? "row-deleting" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <td style={{ whiteSpace: "nowrap", color: "var(--color-text-muted)", fontSize: 12 }}>{index + 1}</td>
                  {/* اسم المنتج */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "var(--radius)", background: "#D6EAF8", color: "#1A5276", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Package size={16} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)" }}>{p.nameAr}</p>
                        <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 1 }}>
                          آخر تحديث: {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("ar-IQ") : "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* الرمز */}
                  <td>
                    <code style={{ background: "var(--color-bg)", color: "var(--color-text-secondary)", padding: "2px 7px", borderRadius: "var(--radius-sm)", fontSize: 11 }}>
                      {p.sku}
                    </code>
                  </td>

                  {/* سعر البيع */}
                  <td style={{ fontWeight: 600, fontSize: 13 }}>
                    {fmt(p.salePrice)} <span style={{ fontSize: 10, fontWeight: 400, color: "var(--color-text-muted)" }}>د.ع</span>
                  </td>

                  {/* الكمية */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: isLow ? "var(--color-warning)" : "var(--color-text)" }}>
                        {p.quantity}
                      </span>
                      {isLow && <StatusBadge status="warning" label="نقص" />}
                    </div>
                    <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 1 }}>حد: {p.minQuantity}</p>
                  </td>

                  {/* المتجر */}
                  <td>
                    {p.isOnline
                      ? <StatusBadge status="success" label="نشط" />
                      : <StatusBadge status="neutral" label="مخفي" />
                    }
                  </td>

                  {/* الإجراءات */}
                  {isAdmin && (
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <ActionBtn color="primary" title="تعديل" onClick={() => setEditing(p)}><Pencil size={15} /></ActionBtn>
                        <ActionBtn color="success" title="إضافة شحنة" onClick={() => { setPurchaseTarget(p); setPurchaseQty("10"); setPurchaseCost(""); }}><Truck size={15} /></ActionBtn>
                        <ActionBtn color="danger" title="حذف" onClick={() => setDeleteTarget(p)}><Trash2 size={15} /></ActionBtn>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {!loading && products.length === 0 && (
              <tr className="empty-row">
                <td colSpan={isAdmin ? 7 : 6}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 0" }}>
                    <Inbox size={36} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
                    <p>
                      {query
                        ? `لا توجد نتائج لـ "${query}"`
                        : lowOnly
                          ? "لا توجد منتجات ناقصة"
                          : "لا توجد منتجات — شغّل المزامنة لجلبها"
                      }
                    </p>
                    {isAdmin && !query && !lowOnly && (
                      <Btn variant="primary" size="sm" onClick={() => openCreate()}>أضف أول منتج</Btn>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── تعليق المزامنة ─── */}
      <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 10, textAlign: "center" }}>
        الإضافة والتعديل والحذف تتطلب اتصالًا بالإنترنت وتُحدَّث على الفور في موقع الويب
      </p>

      {/* ─── Modal تعديل المنتج ─── */}
      {editing && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}
        >
          <div className="modal-box modal-box-lg" style={{ maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}>
            <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: "var(--radius)", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Pencil size={17} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="modal-title">تعديل بيانات المنتج</p>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {editing.nameAr}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditing(null)} aria-label="إغلاق" title="إغلاق" style={modalCloseBtnStyle}><X size={16} /></button>
            </div>
            <EditForm
              product={editing}
              onSave={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      {/* ─── DeleteDialog ─── */}
      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.nameAr ?? ""}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ─── Modal إضافة شحنة ─── */}
      {purchaseTarget && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget && !purchasing) setPurchaseTarget(null); }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <p className="modal-title">إضافة شحنة مخزون</p>
            </div>

            {/* معلومات المنتج */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius)", border: "1px solid var(--color-border-light)", background: "var(--color-bg)", marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "#D6EAF8", color: "#1A5276", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Package size={16} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{purchaseTarget.nameAr}</p>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>الكمية الحالية: <strong>{purchaseTarget.quantity}</strong></p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الكمية المضافة</label>
                <input
                  type="number"
                  min={1}
                  value={purchaseQty}
                  onChange={e => setPurchaseQty(e.target.value)}
                  className="input-field"
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">سعر شراء الوحدة *</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={purchaseCost}
                  onChange={e => setPurchaseCost(e.target.value)}
                  className="input-field"
                  placeholder="تكلفة هذه الشحنة"
                />
              </div>
            </div>

            {Number(purchaseQty) > 0 && (
              <p style={{ fontSize: 11, color: "var(--color-success)", marginTop: -2, marginBottom: 8 }}>
                <Check size={13} strokeWidth={3} style={{ display: "inline", verticalAlign: "-2px" }} /> الكمية بعد الإضافة: {purchaseTarget.quantity + Number(purchaseQty)}
                {Number(purchaseCost) > 0 && (
                  <> · تكلفة الشحنة: {fmt(Number(purchaseCost) * Number(purchaseQty))} د.ع</>
                )}
              </p>
            )}
            {Number(purchaseCost) > 0 && purchaseTarget.salePrice > 0 && (
              <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 8 }}>
                هامش الربح للوحدة: {Math.round(((purchaseTarget.salePrice - Number(purchaseCost)) / purchaseTarget.salePrice) * 100)}%
                {Number(purchaseCost) > purchaseTarget.salePrice && (
                  <span style={{ color: "var(--color-danger)" }}> <AlertTriangle size={12} style={{ display: "inline", verticalAlign: "-1px" }} /> التكلفة أعلى من سعر البيع</span>
                )}
              </p>
            )}

            <div className="modal-footer">
              <Btn variant="secondary" onClick={() => setPurchaseTarget(null)} disabled={purchasing}>إلغاء</Btn>
              <Btn
                variant="success"
                loading={purchasing}
                loadingText="جارٍ الإضافة..."
                onClick={handlePurchase}
                disabled={Number(purchaseQty) <= 0 || purchaseCost.trim() === "" || Number(purchaseCost) < 0}
              >
                إضافة للمخزون
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────── مساعدات ──────────── */

const breadcrumbBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "6px 12px", borderRadius: "var(--radius)",
  border: "1px solid var(--color-border)", background: "var(--color-surface)",
  fontSize: 12, color: "var(--color-text-secondary)", cursor: "pointer",
  fontFamily: "inherit", transition: "all 150ms",
};

const modalCloseBtnStyle: React.CSSProperties = {
  width: 30, height: 30, flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: "var(--radius-sm)", border: "none",
  background: "var(--color-bg)", color: "var(--color-text-muted)",
  fontSize: 14, cursor: "pointer", fontFamily: "inherit",
  transition: "all 120ms",
};

function ActionBtn({
  color, onClick, children, title,
}: { color: "primary" | "success" | "danger"; onClick: () => void; children: React.ReactNode; title?: string }) {
  const colors = {
    primary: { text: "var(--color-primary)",  hover: "var(--color-primary-light)" },
    success: { text: "var(--color-success)",  hover: "var(--color-success-light)" },
    danger:  { text: "var(--color-danger)",   hover: "var(--color-danger-light)" },
  };
  const c = colors[color];
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", border: "none", background: "transparent", fontSize: 15, color: c.text, cursor: "pointer", fontFamily: "inherit", transition: "background 120ms" }}
      onMouseOver={e => (e.currentTarget.style.background = c.hover)}
      onMouseOut={e => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </button>
  );
}
