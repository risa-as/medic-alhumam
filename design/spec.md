# مواصفة إعادة التصميم الشامل — نظام المستلزمات الطبية

## 1. الهدف

إعادة تصميم كاملة لجميع صفحات التطبيقين (Web Dashboard + Desktop Electron) بحيث يصبح للنظام هوية بصرية موحدة واحترافية، مع إعادة ترتيب العناصر وطريقة عرضها، وليس فقط تغيير الألوان.

---

## 2. قيود التصميم (غير قابلة للتفاوض)

| القيد | القيمة |
|-------|--------|
| `border-radius` أقصى | **5px** لجميع العناصر (كروت، أزرار، مدخلات، نوافذ، badges) |
| `border-radius` أدنى | **0px** — يُستخدم أقل من 5px حيث يناسب (مثل: فواصل الجداول) |
| الاتجاه | RTL دائماً |
| الخط الأساسي | "Segoe UI"، Tahoma، system-ui |

---

## 3. نظام التصميم (Design System)

### 3.1 لوحة الألوان

```
/* ألوان أساسية */
--color-primary:        #1A5276   /* أزرق طبي داكن — الأزرار الرئيسية، active nav */
--color-primary-hover:  #154360   /* hover على الأزرار الرئيسية */
--color-primary-light:  #D6EAF8   /* خلفية badges، highlights */

/* خلفيات */
--color-bg:             #F0F4F8   /* خلفية الصفحة */
--color-surface:        #FFFFFF   /* الكروت، الجداول، النوافذ */
--color-sidebar:        #0D2137   /* الـ Sidebar */
--color-sidebar-hover:  #1A3A52   /* hover في الـ Sidebar */
--color-sidebar-active: #1A5276   /* العنصر النشط في الـ Sidebar */

/* الحدود */
--color-border:         #D5DCE8
--color-border-light:   #EAF0F6

/* النصوص */
--color-text:           #0D1B2A   /* النص الرئيسي */
--color-text-secondary: #5A6A7E   /* النص الثانوي */
--color-text-muted:     #94A3B8   /* النص المعتم */

/* الحالات */
--color-success:        #1A7F5A
--color-success-light:  #D1FAE5
--color-danger:         #B91C1C
--color-danger-light:   #FEE2E2
--color-warning:        #B45309
--color-warning-light:  #FEF3C7
--color-info:           #1D4ED8
--color-info-light:     #DBEAFE
```

### 3.2 الظلال

```
--shadow-sm:   0 1px 3px rgba(13,27,42,0.08)
--shadow-md:   0 2px 8px rgba(13,27,42,0.10)
--shadow-lg:   0 4px 16px rgba(13,27,42,0.14)
```

### 3.3 المسافات

الوحدة الأساسية: **4px**. القيم المسموح بها: 4، 8، 12، 16، 20، 24، 32، 48px.

---

## 4. المكونات الأساسية المشتركة

### 4.1 زر `<Btn>` — موحد لجميع الصفحات

**المتغيرات (variants):**

| variant | الخلفية | النص | حالة hover |
|---------|---------|------|------------|
| `primary` | `#1A5276` | أبيض | `#154360` |
| `secondary` | `#FFFFFF` | `#0D1B2A` | `#F0F4F8` — border: `#D5DCE8` |
| `danger` | `#B91C1C` | أبيض | `#991B1B` |
| `ghost` | transparent | `#5A6A7E` | `#F0F4F8` |
| `success` | `#1A7F5A` | أبيض | `#166549` |

**الأحجام:**

| size | padding | font-size |
|------|---------|-----------|
| `sm` | 6px 12px | 12px |
| `md` (default) | 8px 16px | 14px |
| `lg` | 12px 24px | 15px |

**حالة الانتظار (loading):**
- يظهر spinner دوّار قبل النص
- النص يتحول: "إنشاء" → "جارٍ الإنشاء..." | "حفظ" → "جارٍ الحفظ..." | "تعديل" → "جارٍ التعديل..."
- الزر يُعطَّل (`disabled`) ويصبح `opacity: 0.7`
- لا يتغير الحجم — الـ spinner صغير (14px) ويحل محل أيقونة إن وُجدت

**حالة الحذف:**
- زر `danger` يفتح `<DeleteDialog>` عند الضغط
- لا يُنفَّذ الحذف مباشرةً أبداً

**border-radius:** 4px دائماً.

---

### 4.2 نافذة تأكيد الحذف `<DeleteDialog>`

**الهيكل:**
```
[overlay: rgba(13,27,42,0.55)]
  └─ [modal: 360px، border-radius: 5px، bg: white]
       ├─ [أيقونة تحذير حمراء كبيرة: 48px، مركزة]
       ├─ [عنوان: "تأكيد الحذف"]
       ├─ [نص: "هل أنت متأكد من حذف «{اسم العنصر}»؟ لا يمكن التراجع عن هذا الإجراء."]
       └─ [أزرار: "إلغاء" (secondary) + "نعم، احذف" (danger + loading)]
```

**الحركة:**
- عند الفتح: overlay يظهر بـ `fade-in` (150ms) + modal يظهر بـ `scale 0.92→1.0` (200ms)
- عند تنفيذ الحذف بنجاح: يُغلق الـ dialog + الصف/العنصر يختفي بـ `fade-out + height→0` (250ms)

---

### 4.3 جدول البيانات `<DataTable>`

**الهيكل:**
```
[wrapper: border: 1px solid #D5DCE8، border-radius: 5px، overflow: hidden]
  ├─ [thead: bg: #F0F4F8، border-bottom: 2px solid #D5DCE8]
  │    └─ [th: padding: 10px 12px، font-size: 12px، font-weight: 600، color: #5A6A7E، text-align: right]
  └─ [tbody]
       └─ [tr: border-bottom: 1px solid #EAF0F6، bg: white]
            ├─ [tr:hover bg: #F7F9FC]  — انتقال 120ms
            └─ [td: padding: 10px 12px، font-size: 13px]
```

**صف الإجراءات:**
- الأزرار: `ghost` صغيرة مع أيقونة فقط، تظهر بوضوح عند hover على الصف
- ترتيب: تعديل (أزرق) | حذف (أحمر) | إجراءات أخرى

**صف فارغ:** رسالة نصية في المنتصف، أيقونة اختيارية، `color: #94A3B8`.

---

### 4.4 رأس الصفحة `<PageHeader>`

```
[container: margin-bottom: 24px]
  ├─ [breadcrumb: font-size: 12px، color: #94A3B8] (اختياري)
  ├─ [row: flex، justify-between، align-center]
  │    ├─ [title: font-size: 20px، font-weight: 700، color: #0D1B2A]
  │    └─ [actions: flex gap-8px] — أزرار الإجراءات الرئيسية
  └─ [subtitle: font-size: 13px، color: #5A6A7E] (اختياري)
```

---

### 4.5 حقول الإدخال `<Input>` / `<Select>`

```
border: 1px solid #D5DCE8
border-radius: 4px
padding: 8px 12px
font-size: 13px
color: #0D1B2A
background: #FFFFFF
transition: border-color 150ms

:focus → border-color: #1A5276، outline: none
:disabled → background: #F0F4F8، color: #94A3B8
```

---

### 4.6 Badge الحالة `<StatusBadge>`

```
border-radius: 3px
padding: 2px 8px
font-size: 11px
font-weight: 600
```

| الحالة | النص | bg | لون النص |
|---------|------|----|----------|
| نشط/مكتمل/مسدّد | — | `#D1FAE5` | `#1A7F5A` |
| جزئي/قيد المعالجة | — | `#FEF3C7` | `#B45309` |
| مفتوح/جديد | — | `#DBEAFE` | `#1D4ED8` |
| ملغي/محذوف | — | `#FEE2E2` | `#B91C1C` |

---

### 4.7 بطاقة الإحصائية `<StatCard>`

```
[card: bg: white، border: 1px solid #D5DCE8، border-radius: 5px، padding: 20px]
  ├─ [border-right: 3px solid {لون الإحصائية}]  ← الحد الجانبي الملون
  ├─ [label: font-size: 12px، color: #5A6A7E، margin-bottom: 4px]
  └─ [value: font-size: 22px، font-weight: 700، color: #0D1B2A]
```

---

## 5. تصميم الـ Sidebar (كلا التطبيقين)

```
[sidebar: width: 220px، bg: #0D2137، color: white، flex-direction: column]
  ├─ [brand: padding: 20px 16px 16px، border-bottom: 1px solid rgba(255,255,255,0.08)]
  │    ├─ [logo/icon: 32px، bg: #1A5276، border-radius: 5px، margin-bottom: 8px]
  │    └─ [store-name: font-size: 14px، font-weight: 700]
  │
  ├─ [nav: flex-1، padding: 12px 8px، gap: 2px]
  │    └─ [nav-item: padding: 9px 12px، border-radius: 4px، font-size: 13px، font-weight: 500]
  │         ├─ [:hover: bg: #1A3A52]
  │         └─ [.active: bg: #1A5276، border-right: 3px solid #5BA4CF]
  │              (في حالة RTL: border-left للتمييز)
  │
  └─ [user-section: padding: 12px 8px، border-top: 1px solid rgba(255,255,255,0.08)]
       ├─ [avatar: 32px circle، bg: #1A5276، initials، font-size: 12px]
       ├─ [name: font-size: 12px، font-weight: 600]
       ├─ [role: font-size: 11px، color: rgba(255,255,255,0.5)]
       └─ [logout-btn: ghost صغير، icon + "خروج"]
```

---

## 6. الصفحات — المتطلبات التفصيلية

### 6.1 Web — Dashboard Layout

**الحالي:** `flex min-h-screen` بسيط، sidebar بلا أيقونات، main بـ `p-6`.

**الجديد:**
- Sidebar حسب مواصفة § 5
- Main: `background: #F0F4F8، padding: 24px، overflow-y: auto`
- كل صفحة تبدأ بـ `<PageHeader>`

---

### 6.2 Web — صفحة المخزون (Inventory)

**الحالي:** جدول مع أزرار نصية ملونة مضمّنة، نموذج يحل محل الصفحة بالكامل.

**الجديد:**
- `<PageHeader>` عنوان "المخزون" + زر "+ إضافة منتج" (primary)
- شريط الفلترة: `<Input>` بحث + toggle "النواقص فقط" (كـ pill button)
- `<DataTable>` بالأعمدة: الاسم، الرمز، الفئة، سعر البيع، الكمية، حد التنبيه، متاح في الإنترنت، إجراءات
- صف الكمية المنخفضة: خلفية `#FEF3C7` + `<StatusBadge>` "نقص" باللون البرتقالي
- نموذج الإضافة/التعديل: يفتح في **Drawer** من اليمين (لا يحل محل الصفحة) — width: 480px، bg: white، shadow-lg، border-radius: 0 (Drawer ملاصق للحافة)
- الحذف: `<DeleteDialog>`
- شراء كمية: modal صغير (لا prompt نظام)

---

### 6.3 Web — صفحة الطلبات (Orders)

**الحالي:** جدول مع فلاتر وmodal إضافة يدوية.

**الجديد:**
- `<PageHeader>` + شريط فلترة أفقي (حالة الطلب كـ pill buttons)
- `<DataTable>` مع `<StatusBadge>` للحالة
- Modal إضافة يدوي: 500px، منظّم في sections (معلومات العميل / المنتج)
- تغيير الحالة: dropdown صغير في الجدول أو modal منفصل

---

### 6.4 Web — صفحة الزبائن (Customers)

**الحالي:** لوحتان جانبيتان (قائمة + تفاصيل).

**الجديد:**
- يُحتفظ بالتخطيط اللوحتين لكنه يُعاد تصميمه:
  - القائمة اليسرى: بطاقات Customers بـ border-radius: 5px، hover واضح، active مميّز بلون border
  - اللوحة اليمنى: `<PageHeader>` صغير مع اسم الزبون + رصيده البارز + جداول الديون والفواتير كـ `<DataTable>`
- زر "+ جديد": يفتح modal 360px

---

### 6.5 Web — صفحة الديون (Debts)

**الحالي:** جدول مع filter buttons + modal سداد.

**الجديد:**
- `<PageHeader>` + 3 `<StatCard>` (إجمالي / مسدّد / متبقّي) في صف أفقي
- filter buttons: pill style موحّد
- `<DataTable>` مع `<StatusBadge>` + زر "سداد" (success، sm)
- Modal السداد: 380px، منظّم

---

### 6.6 Web — صفحة التقارير (Reports)

**الحالي:** بطاقات `rounded-xl` مختلطة مع الباقي.

**الجديد:**
- `<PageHeader>` "تقارير المبيعات"
- شريط الفلترة: كـ `<Surface>` (bg: white، border، border-radius: 5px، padding: 16px) مع حقول التاريخ وpill buttons التجميع
- 3 `<StatCard>` موحدة
- بطاقة الرسم البياني: Surface بـ border-radius: 5px
- جداول أكثر المنتجات وحسب الموظف: `<DataTable>`

---

### 6.7 Web — صفحة الإعدادات (Settings)

**الحالي:** نموذج في بطاقة `rounded-xl`.

**الجديد:**
- `<PageHeader>`
- قسم البيانات: Surface بـ border-radius: 5px + عنوان قسم مع فاصل
- حقول: `<Input>` و`<Select>` موحدة
- زر الحفظ: primary + loading state
- رسالة النجاح: `<StatusBadge>` أو alert صغير بـ border-radius: 4px

---

### 6.8 Web — صفحة المستخدمين (Users)

**الجديد:**
- `<PageHeader>` + زر "إضافة مستخدم"
- `<DataTable>` (اسم، بريد، دور، حالة)
- إضافة/تعديل: modal 400px
- حذف: `<DeleteDialog>`

---

### 6.9 Web — الرئيسية / Dashboard (Admin Home)

**الجديد:**
- `<PageHeader>` "مرحباً، {اسم المستخدم}"
- صف 4 `<StatCard>` (مبيعات اليوم، الطلبات الجديدة، نواقص المخزون، الديون المفتوحة)
- بطاقتا آخر الطلبات + آخر الفواتير كـ `<DataTable>` مصغّرة (5 صفوف)

---

### 6.10 Desktop — تسجيل الدخول (Login)

**الحالي:** نموذج مركزي بـ `border-radius: 16` (مخالف).

**الجديد:**
- خلفية الصفحة: `#F0F4F8`
- بطاقة النموذج: 380px، **border-radius: 5px**، shadow-md، padding: 32px
- أعلى النموذج: أيقونة/شعار + اسم النظام (font-size: 18px، font-weight: 700) + subtitle
- حقول: `<Input>` موحد
- زر تسجيل الدخول: primary، full-width، loading state

---

### 6.11 Desktop — نقطة البيع (POS)

**الحالي:** لوحتان بـ CSS خام، قائمة منتجات بـ buttons بلا تصميم.

**الجديد:**
- **لوحة المنتجات (يسار ~55%):**
  - `<Input>` بحث بالكامل
  - شبكة 3 أعمدة من بطاقات المنتج: كل بطاقة `border-radius: 5px`، تحتوي اسم المنتج + السعر + الكمية المتوفرة
  - بطاقة ناقصة الكمية: حافة علوية بلون تحذيري
  - بطاقة محذوفة الكمية: `opacity: 0.5`، `cursor: not-allowed`
  
- **لوحة الفاتورة (يمين ~45%):**
  - عنوان "الفاتورة الحالية" + عدد الأصناف
  - `<DataTable>` مبسّط للسلع (صنف، كمية input، خصم input، الإجمالي، حذف)
  - قسم الملخص: background مميّز (`#F0F4F8`)، المجموع / الإجمالي / المتبقي بارزان
  - حقول الزبون: في accordion/collapsible (مخفية بالافتراضي)
  - زر "إتمام البيع": primary، full-width، lg، loading state

---

### 6.12 Desktop — الفواتير (Sales)

**الحالي:** جدول بسيط بـ CSS class.

**الجديد:**
- `<PageHeader>` + إحصائية صغيرة (عدد الفواتير غير المزامنة)
- `<DataTable>` مع عمود حالة المزامنة كـ `<StatusBadge>`
- زر "عرض/طباعة": ghost sm

---

### 6.13 Desktop — المخزون (Desktop Inventory)

**الحالي:** جدول بسيط مع ملاحظة "يُدار من الويب".

**الجديد:**
- `<PageHeader>` + إشعار informational (أزرق، border-radius: 4px): "المخزون يُدار من لوحة التحكم"
- `<Input>` بحث
- `<DataTable>` مع تمييز النواقص

---

### 6.14 Desktop — دفتر الديون (Desktop Debts)

مطابق للـ Web Debts في التصميم، مع نفس الـ StatCards والـ DataTable والـ Modal.

---

### 6.15 Desktop — الإعدادات (Desktop Settings)

**الجديد:**
- قسم المزامنة: Surface بـ border-radius: 5px
  - حالة الاتصال: `<StatusBadge>` + آخر مزامنة
  - زر "مزامنة الآن": primary + loading
- قسم الطابعة: Surface منفصل

---

## 7. تأثيرات الحركة والتفاعل

### 7.1 حالة الانتظار (Loading State)

```css
/* Spinner — SVG دوّار، 14px، stroke: currentColor */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
  margin-left: 6px;  /* RTL: margin-right */
  vertical-align: middle;
}
```

### 7.2 تأثير الحذف

```
1. المستخدم يضغط "حذف" → يفتح <DeleteDialog>
2. المستخدم يؤكد → الزر يصبح loading
3. بعد نجاح الـ API:
   a. يُغلق الـ dialog
   b. الصف في الجدول: 
      - transition: background 200ms → #FEE2E2
      - بعد 200ms: transition: opacity 200ms → 0، height → 0، padding → 0
      - بعد 400ms: يُزال من الـ DOM
```

### 7.3 انتقالات عامة

```css
/* hover على الأزرار والبطاقات */
transition: all 150ms ease-out;

/* فتح النوافذ */
.modal-overlay { animation: fadeIn 150ms ease-out; }
.modal-box { animation: scaleIn 200ms ease-out; }

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes scaleIn { from { transform: scale(0.93); opacity: 0 } to { transform: scale(1); opacity: 1 } }
```

---

## 8. ملف CSS الموحّد — Desktop

يُستبدل `styles.css` الحالي بملف جديد شامل يحتوي:
- Custom properties (CSS variables)
- Reset أساسي
- Layout classes (.app, .sidebar, .content)
- Component classes (.btn, .data-table, .stat-card, .modal, .badge, .input, إلخ)
- Animations

---

## 9. Tailwind Config — Web

يُضاف إلى `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#1A5276', hover: '#154360', light: '#D6EAF8' },
      surface: '#FFFFFF',
      'app-bg': '#F0F4F8',
      sidebar: { DEFAULT: '#0D2137', hover: '#1A3A52', active: '#1A5276' },
      border: { DEFAULT: '#D5DCE8', light: '#EAF0F6' },
      txt: { DEFAULT: '#0D1B2A', secondary: '#5A6A7E', muted: '#94A3B8' },
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '3px',
      md: '5px',
      lg: '5px',   // أقصى مسموح — 5px
      xl: '5px',   // يُعاد تعريفها لتلتزم بالحد
      '2xl': '5px',
    },
    boxShadow: {
      sm: '0 1px 3px rgba(13,27,42,0.08)',
      DEFAULT: '0 2px 8px rgba(13,27,42,0.10)',
      lg: '0 4px 16px rgba(13,27,42,0.14)',
    },
  },
}
```

---

## 10. ما لا يتغيّر

- منطق الأعمال (API routes، IPC handlers، قاعدة البيانات)
- أسماء المكونات الكبيرة (`ProductForm`، `Invoice`، إلخ) — يُعاد تصميم داخلها فقط
- نظام المصادقة والصلاحيات
- نظام المزامنة
- واجهة المتجر الإلكتروني (Storefront) — خارج نطاق هذه المرحلة
