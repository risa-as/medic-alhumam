// مودال منتج (إنشاء/تعديل) للهاتف — يطابق حقول فورمة الويب.
// يدعم رفع الصور/الفيديو (عبر /api/uploads) واختيار الفئة من قائمة منسدلة.
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { PackagePlus, Pencil, X, AlertTriangle, Camera, Clapperboard, ChevronDown, Check } from "lucide-react-native";
import { api, uploadMedia, type PickedFile } from "../lib/api";
import { colors, spacing, font, radius, shadow } from "./theme";

interface Category { id: string; nameAr: string }

/** بيانات المنتج الكاملة (من GET /products/[id]) لوضع التعديل. */
export interface FullProduct {
  id: string;
  nameAr: string;
  sku: string;
  categoryId: string;
  costPrice?: number;
  salePrice: number;
  compareAtPrice?: number | null;
  deliveryPrice?: number;
  quantity: number;
  minQuantity: number;
  images?: string[];
  videoUrl?: string | null;
  description?: string | null;
  isOnline?: boolean;
}

const MAX_IMAGES = 5;

export function ProductSheet({
  visible,
  mode,
  initialSku = "",
  product,
  onClose,
  onSaved,
}: {
  visible: boolean;
  mode: "create" | "edit";
  initialSku?: string;
  product?: FullProduct;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const isEdit = mode === "edit";

  const [cats, setCats] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const [nameAr, setNameAr] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [compareAt, setCompareAt] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCats = useCallback(async () => {
    setCatsLoading(true);
    try {
      const res = await api.get<{ data: Category[] }>("/categories");
      setCats(res.data);
      setCategoryId((cur) => cur || res.data[0]?.id || "");
    } catch {
      /* تُعرض رسالة لاحقًا عند غياب الفئات */
    } finally {
      setCatsLoading(false);
    }
  }, []);

  // عند الفتح: عبّئ الحقول حسب الوضع، واجلب الفئات
  useEffect(() => {
    if (!visible) return;
    if (isEdit && product) {
      setNameAr(product.nameAr);
      setSku(product.sku);
      setCategoryId(product.categoryId);
      setCostPrice(product.costPrice != null ? String(product.costPrice) : "");
      setSalePrice(String(product.salePrice));
      setCompareAt(product.compareAtPrice != null ? String(product.compareAtPrice) : "");
      setDeliveryPrice(product.deliveryPrice != null ? String(product.deliveryPrice) : "");
      setQuantity(String(product.quantity));
      setMinQuantity(String(product.minQuantity));
      setDescription(product.description ?? "");
      setIsOnline(!!product.isOnline);
      setImages(product.images ?? []);
      setVideoUrl(product.videoUrl ?? undefined);
    } else {
      setNameAr("");
      setSku(initialSku);
      setCategoryId("");
      setCostPrice("");
      setSalePrice("");
      setCompareAt("");
      setDeliveryPrice("");
      setQuantity("");
      setMinQuantity("");
      setDescription("");
      setIsOnline(false);
      setImages([]);
      setVideoUrl(undefined);
    }
    setCatOpen(false);
    setError(null);
    void loadCats();
  }, [visible, isEdit, product, initialSku, loadCats]);

  const cost = Number(costPrice);
  const sale = Number(salePrice);
  const margin = sale > 0 && cost > 0 ? Math.round(((sale - cost) / sale) * 100) : null;
  const marginColor = margin == null ? colors.muted : margin >= 20 ? colors.success : margin >= 10 ? colors.warning : colors.danger;
  const marginBg = margin == null ? colors.borderLight : margin >= 20 ? colors.successLight : margin >= 10 ? colors.warningLight : colors.dangerLight;
  const selectedCat = cats.find((c) => c.id === categoryId);

  async function pickImages() {
    if (images.length >= MAX_IMAGES) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return setError("نحتاج إذن الوصول للصور");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.7,
    });
    if (res.canceled) return;
    const files: PickedFile[] = res.assets.map((a, i) => ({
      uri: a.uri,
      name: a.fileName ?? `image_${Date.now()}_${i}.jpg`,
      type: a.mimeType ?? "image/jpeg",
    }));
    setUploadingImg(true);
    setError(null);
    try {
      const urls = await uploadMedia("image", files);
      setImages((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر رفع الصور");
    } finally {
      setUploadingImg(false);
    }
  }

  async function pickVideo() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return setError("نحتاج إذن الوصول للوسائط");
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["videos"], quality: 0.7 });
    if (res.canceled) return;
    const a = res.assets[0];
    if (!a) return;
    const file: PickedFile = { uri: a.uri, name: a.fileName ?? `video_${Date.now()}.mp4`, type: a.mimeType ?? "video/mp4" };
    setUploadingVid(true);
    setError(null);
    try {
      const urls = await uploadMedia("video", [file]);
      if (urls[0]) setVideoUrl(urls[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر رفع الفيديو");
    } finally {
      setUploadingVid(false);
    }
  }

  async function submit() {
    if (!nameAr.trim()) return setError("اسم المنتج مطلوب");
    if (!sku.trim()) return setError("الرمز/الباركود مطلوب");
    if (!categoryId) return setError("اختر فئة المنتج");
    if (!(sale > 0)) return setError("أدخل سعر بيع صحيح");
    if (costPrice.trim() === "" || !(cost >= 0)) return setError("أدخل سعر الشراء");

    setSaving(true);
    setError(null);
    const payload = {
      nameAr: nameAr.trim(),
      sku: sku.trim(),
      categoryId,
      costPrice: cost,
      salePrice: sale,
      quantity: parseInt(quantity, 10) || 0,
      minQuantity: parseInt(minQuantity, 10) || 0,
      deliveryPrice: Number(deliveryPrice) || 0,
      isOnline,
      images,
      compareAtPrice: compareAt.trim() && Number(compareAt) > 0 ? Number(compareAt) : null,
      ...(videoUrl ? { videoUrl } : {}),
      ...(description.trim() ? { description: description.trim() } : { description: "" }),
    };
    try {
      if (isEdit && product) {
        await api.patch(`/products/${product.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      onSaved(nameAr.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر حفظ المنتج");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleIcon}>
                {isEdit ? <Pencil size={20} color={colors.primary} strokeWidth={2.2} /> : <PackagePlus size={20} color={colors.primary} strokeWidth={2.2} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{isEdit ? "تعديل المنتج" : "منتج جديد"}</Text>
                <Text style={styles.sub} numberOfLines={1}>{isEdit ? product?.nameAr : "أدخل بيانات المنتج"}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <X size={22} color={colors.textSecondary} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>اسم المنتج *</Text>
            <TextInput style={styles.input} value={nameAr} onChangeText={setNameAr} placeholder="مثال: باراسيتامول 500mg" placeholderTextColor={colors.muted} />

            <Text style={styles.label}>الرمز / الباركود *</Text>
            <TextInput style={styles.input} value={sku} onChangeText={setSku} placeholder="MED-001" placeholderTextColor={colors.muted} autoCapitalize="characters" />

            {/* الفئة — Select منسدل */}
            <Text style={styles.label}>الفئة *</Text>
            {catsLoading ? (
              <View style={styles.catLoading}><ActivityIndicator color={colors.primary} /></View>
            ) : cats.length === 0 ? (
              <View style={styles.noCats}>
                <AlertTriangle size={15} color={colors.warning} strokeWidth={2} />
                <Text style={styles.noCatsText}>لا توجد فئات — أضف فئة من لوحة التحكم (الويب) أولًا.</Text>
              </View>
            ) : (
              <View>
                <TouchableOpacity style={styles.select} activeOpacity={0.85} onPress={() => setCatOpen((o) => !o)}>
                  <Text style={[styles.selectText, !selectedCat && { color: colors.muted }]}>{selectedCat?.nameAr ?? "اختر الفئة"}</Text>
                  <ChevronDown size={18} color={colors.muted} strokeWidth={2.2} style={{ transform: [{ rotate: catOpen ? "180deg" : "0deg" }] }} />
                </TouchableOpacity>
                {catOpen && (
                  <View style={styles.selectMenu}>
                    {cats.map((c, i) => {
                      const active = categoryId === c.id;
                      return (
                        <TouchableOpacity key={c.id} style={[styles.selectItem, i > 0 && styles.selectDivider]} activeOpacity={0.8} onPress={() => { setCategoryId(c.id); setCatOpen(false); }}>
                          <Text style={[styles.selectItemText, active && { color: colors.primary, fontWeight: "800" }]}>{c.nameAr}</Text>
                          {active && <Check size={16} color={colors.primary} strokeWidth={2.4} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>سعر الشراء *</Text>
                <TextInput style={styles.input} value={costPrice} onChangeText={setCostPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>سعر البيع *</Text>
                <TextInput style={styles.input} value={salePrice} onChangeText={setSalePrice} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
            </View>

            {margin != null && (
              <View style={[styles.margin, { backgroundColor: marginBg }]}>
                <Text style={[styles.marginText, { color: marginColor }]}>هامش الربح</Text>
                <Text style={[styles.marginVal, { color: marginColor }]}>{margin}%</Text>
              </View>
            )}

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>السعر قبل الخصم</Text>
                <TextInput style={styles.input} value={compareAt} onChangeText={setCompareAt} keyboardType="numeric" placeholder="اختياري" placeholderTextColor={colors.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>سعر التوصيل</Text>
                <TextInput style={styles.input} value={deliveryPrice} onChangeText={setDeliveryPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{isEdit ? "الكمية الحالية" : "الكمية الأولية"}</Text>
                <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>حد التنبيه</Text>
                <TextInput style={styles.input} value={minQuantity} onChangeText={setMinQuantity} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.muted} />
              </View>
            </View>

            {/* الوسائط */}
            <Text style={styles.label}>الصور والفيديو (اختياري)</Text>
            <View style={styles.mediaRow}>
              <TouchableOpacity style={[styles.mediaBtn, (uploadingImg || images.length >= MAX_IMAGES) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={pickImages} disabled={uploadingImg || images.length >= MAX_IMAGES}>
                {uploadingImg ? <ActivityIndicator color={colors.primary} size="small" /> : (<><Camera size={20} color={colors.primary} strokeWidth={2.2} /><Text style={styles.mediaBtnText}>صور ({images.length}/{MAX_IMAGES})</Text></>)}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mediaBtn, uploadingVid && { opacity: 0.6 }]} activeOpacity={0.85} onPress={pickVideo} disabled={uploadingVid}>
                {uploadingVid ? <ActivityIndicator color={colors.primary} size="small" /> : (<><Clapperboard size={20} color={colors.primary} strokeWidth={2.2} /><Text style={styles.mediaBtnText}>{videoUrl ? "تغيير الفيديو" : "فيديو"}</Text></>)}
              </TouchableOpacity>
            </View>

            {(images.length > 0 || videoUrl) && (
              <View style={styles.thumbs}>
                {images.map((u, i) => (
                  <View key={u} style={styles.thumb}>
                    <Image source={{ uri: u }} style={styles.thumbImg} />
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => setImages(images.filter((x) => x !== u))} hitSlop={6}>
                      <X size={12} color={colors.white} strokeWidth={2.6} />
                    </TouchableOpacity>
                    {i === 0 && <View style={styles.mainBadge}><Text style={styles.mainBadgeText}>رئيسية</Text></View>}
                  </View>
                ))}
                {videoUrl && (
                  <View style={styles.thumb}>
                    <View style={[styles.thumbImg, styles.videoThumb]}>
                      <Clapperboard size={22} color={colors.textSecondary} strokeWidth={2} />
                    </View>
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => setVideoUrl(undefined)} hitSlop={6}>
                      <X size={12} color={colors.white} strokeWidth={2.6} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <Text style={styles.label}>الوصف (اختياري)</Text>
            <TextInput style={[styles.input, { height: 70, textAlignVertical: "top" }]} value={description} onChangeText={setDescription} placeholder="وصف مختصر للمنتج" placeholderTextColor={colors.muted} multiline />

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>عرض في المتجر</Text>
                <Text style={styles.toggleSub}>يظهر للزبائن عبر الإنترنت</Text>
              </View>
              <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.white} />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <AlertTriangle size={15} color={colors.danger} strokeWidth={2} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.submit, (saving || cats.length === 0) && { opacity: 0.6 }]} onPress={submit} disabled={saving || cats.length === 0} activeOpacity={0.88}>
              {saving ? <ActivityIndicator color={colors.white} /> : (<>
                {isEdit ? <Check size={18} color={colors.white} strokeWidth={2.4} /> : <PackagePlus size={18} color={colors.white} strokeWidth={2.2} />}
                <Text style={styles.submitText}>{isEdit ? "حفظ التعديلات" : "إضافة المنتج"}</Text>
              </>)}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(13,27,42,0.45)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.lg, maxHeight: "92%" },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: "center", marginBottom: spacing.md },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  titleIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  title: { fontSize: font.lg, fontWeight: "800", color: colors.text, textAlign: "right" },
  sub: { fontSize: font.sm, color: colors.textSecondary, textAlign: "right", marginTop: 1 },

  label: { fontSize: font.xs, color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm, textAlign: "right", fontWeight: "600" },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: font.base, color: colors.text, textAlign: "right" },
  row: { flexDirection: "row", gap: spacing.md },

  select: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 13 },
  selectText: { fontSize: font.base, color: colors.text, fontWeight: "600", textAlign: "right" },
  selectMenu: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginTop: 6, overflow: "hidden", ...shadow.sm },
  selectItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingVertical: 13 },
  selectDivider: { borderTopWidth: 1, borderTopColor: colors.borderLight },
  selectItemText: { fontSize: font.base, color: colors.text, textAlign: "right" },

  catLoading: { paddingVertical: spacing.md, alignItems: "center" },
  noCats: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.warningLight, borderRadius: radius.md, padding: spacing.md },
  noCatsText: { flex: 1, fontSize: font.sm, color: colors.warning, fontWeight: "600", textAlign: "right" },

  margin: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 8, marginTop: spacing.sm },
  marginText: { fontSize: font.sm, fontWeight: "600" },
  marginVal: { fontSize: font.sm, fontWeight: "800" },

  mediaRow: { flexDirection: "row", gap: spacing.md },
  mediaBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primaryLight, borderWidth: 1.5, borderColor: colors.primary, borderStyle: "dashed", borderRadius: radius.md, paddingVertical: 14 },
  mediaBtnText: { fontSize: font.sm, fontWeight: "700", color: colors.primary },
  thumbs: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  thumb: { width: 70, height: 70, borderRadius: radius.md, overflow: "hidden", position: "relative", borderWidth: 1, borderColor: colors.border },
  thumbImg: { width: "100%", height: "100%" },
  videoThumb: { backgroundColor: colors.borderLight, alignItems: "center", justifyContent: "center" },
  thumbRemove: { position: "absolute", top: 3, start: 3, width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(13,27,42,0.7)", alignItems: "center", justifyContent: "center" },
  mainBadge: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(26,82,118,0.85)", paddingVertical: 1 },
  mainBadgeText: { color: colors.white, fontSize: 9, fontWeight: "700", textAlign: "center" },

  toggleRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, ...shadow.sm },
  toggleTitle: { fontSize: font.base, fontWeight: "700", color: colors.text, textAlign: "right" },
  toggleSub: { fontSize: font.xs, color: colors.muted, textAlign: "right", marginTop: 2 },

  errorBox: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.dangerLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  errorText: { flex: 1, color: colors.danger, fontSize: font.sm, fontWeight: "600", textAlign: "right" },

  submit: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 15, marginTop: spacing.lg, ...shadow.sm },
  submitText: { color: colors.white, fontWeight: "800", fontSize: font.md },
});
