# مهام إعادة التصميم الشامل

> المرجع: `design/spec.md`
> الترتيب: كل مرحلة تعتمد على ما قبلها — لا تبدأ مرحلة قبل اكتمال السابقة.

---

## المرحلة 1 — نظام التصميم (Design Tokens)

### T-01 — إعداد Tailwind للـ Web
**الملف:** `apps/web/tailwind.config.ts`
- إضافة custom colors (primary، surface، app-bg، sidebar، border، txt) حسب § 9 من الـ spec
- إعادة تعريف `borderRadius`: أقصى قيمة `lg`, `xl`, `2xl` = 5px
- إضافة custom shadows (sm، DEFAULT، lg)
- إضافة custom fonts

### T-02 — إنشاء CSS Variables للـ Web
**الملف:** `apps/web/app/globals.css`
- استبدال المحتوى بـ CSS custom properties حسب § 3.1 من الـ spec
- إضافة Animations: `spin`، `fadeIn`، `scaleIn` حسب § 7.3
- إضافة `.spinner` class
- إضافة `.modal-overlay` و `.modal-box` animation classes

### T-03 — إنشاء CSS Variables وملف Styles للـ Desktop
**الملف:** `apps/desktop/src/renderer/styles.css`
- استبدال الملف بالكامل بنظام جديد يشمل:
  - CSS custom properties (نفس قيم الـ Web)
  - Reset أساسي
  - Layout: `.app`، `.sidebar`، `.content`
  - Animations: spin، fadeIn، scaleIn
  - `.spinner` class

---

## المرحلة 2 — المكونات المشتركة — Web

### T-04 — إنشاء مكوّن `<Btn>`
**الملف:** `apps/web/components/ui/Btn.tsx` (ملف جديد)
- Props: `variant` (primary|secondary|danger|ghost|success)، `size` (sm|md|lg)، `loading`، `loadingText`، `onClick`، `type`، `disabled`، `className`، `children`
- عند `loading=true`: يعرض `.spinner` + `loadingText` (أو النص الافتراضي) ويُعطَّل الزر
- border-radius: 4px لجميع المتغيرات
- Transition: 150ms ease-out على background/opacity

### T-05 — إنشاء مكوّن `<DeleteDialog>`
**الملف:** `apps/web/components/ui/DeleteDialog.tsx` (ملف جديد)
- Props: `open`، `itemName`، `onConfirm`، `onCancel`، `loading`
- Modal: 360px، border-radius: 5px
- Animations: overlay fadeIn 150ms، box scaleIn 200ms
- زر التأكيد: `<Btn variant="danger" loading={loading}>`

### T-06 — إنشاء مكوّن `<DataTable>`
**الملف:** `apps/web/components/ui/DataTable.tsx` (ملف جديد)
- Props: `columns` (key، label، render?)، `rows`، `loading`، `emptyMessage`
- Wrapper: border، border-radius: 5px، overflow: hidden
- thead: bg `#F0F4F8`، border-bottom 2px
- tbody rows: hover transition 120ms، delete animation class support (`data-deleting`)

### T-07 — إنشاء مكوّن `<PageHeader>`
**الملف:** `apps/web/components/ui/PageHeader.tsx` (ملف جديد)
- Props: `title`، `subtitle?`، `breadcrumb?`، `actions?` (ReactNode)
- Layout حسب § 4.4 من الـ spec

### T-08 — إنشاء مكوّن `<StatusBadge>`
**الملف:** `apps/web/components/ui/StatusBadge.tsx` (ملف جديد)
- Props: `status` (success|warning|info|danger|neutral)، `label`
- border-radius: 3px، padding: 2px 8px
- الألوان حسب § 4.6 من الـ spec

### T-09 — إنشاء مكوّن `<StatCard>`
**الملف:** `apps/web/components/ui/StatCard.tsx` (ملف جديد)
- Props: `label`، `value`، `accentColor` (hex)، `icon?`
- border-radius: 5px، border-right: 3px solid accentColor
- Layout حسب § 4.7 من الـ spec

### T-10 — إنشاء مكوّن `<InputField>`
**الملف:** `apps/web/components/ui/InputField.tsx` (ملف جديد)
- Props: `label?`، `error?`، وباقي خصائص `<input>` و `<select>`
- border-radius: 4px، focus ring: `#1A5276`
- حالة disabled، حالة error (border أحمر)

### T-11 — تصدير المكونات من index
**الملف:** `apps/web/components/ui/index.ts` (ملف جديد)
- export جميع المكونات من T-04 إلى T-10

---

## المرحلة 3 — إعادة تصميم الـ Web Layout

### T-12 — إعادة تصميم Sidebar — Web
**الملف:** `apps/web/app/dashboard/layout.tsx`
- تطبيق تصميم الـ Sidebar حسب § 5 من الـ spec
- Brand section: أيقونة + اسم المتجر
- Nav items: border-radius: 4px، active state بـ border-right وخلفية مميزة
- User section: avatar بـ initials + اسم + دور + زر خروج
- استبدال `<Link>` classes بالألوان الجديدة

---

## المرحلة 4 — إعادة تصميم صفحات الـ Web

### T-13 — صفحة المخزون — Web
**الملفات:** `apps/web/app/dashboard/inventory/page.tsx`، `inventory/ProductForm.tsx`
- استبدال header بـ `<PageHeader>`
- استبدال الجدول بـ `<DataTable>`
- استبدال أزرار الإجراءات بـ `<Btn>` موحّد
- إضافة `<DeleteDialog>` عوضاً عن `confirm()`
- إضافة delete animation على الصف
- نموذج الشراء: modal مخصص (360px) عوضاً عن `prompt()`
- نموذج الإضافة/التعديل (ProductForm): إعادة تصميم الداخل بـ `<InputField>` و `<Btn>`
- `<StatusBadge>` للنواقص

### T-14 — صفحة الطلبات — Web
**الملف:** `apps/web/app/dashboard/orders/page.tsx`
- `<PageHeader>` + زر "إضافة طلب يدوي"
- pill buttons للفلترة بالحالة
- `<DataTable>` مع `<StatusBadge>` للحالة ومصدر الطلب
- إعادة تصميم ManualOrderModal: sections واضحة + `<InputField>` + `<Btn>`
- `<DeleteDialog>` لإلغاء الطلب

### T-15 — صفحة الزبائن — Web
**الملف:** `apps/web/app/dashboard/customers/page.tsx`
- بطاقات الزبائن: border-radius: 5px، active state واضح
- لوحة التفاصيل: `<PageHeader>` صغير + `<StatCard>` للرصيد + `<DataTable>` للديون والفواتير
- Modal إضافة زبون: `<InputField>` + `<Btn>` موحّد

### T-16 — صفحة الديون — Web
**الملف:** `apps/web/app/dashboard/debts/page.tsx`
- `<PageHeader>`
- 3 `<StatCard>` في صف (إجمالي / مسدّد / متبقّي)
- pill buttons موحّدة للفلترة
- `<DataTable>` مع `<StatusBadge>`
- Modal السداد: `<InputField>` + `<Btn>`

### T-17 — صفحة التقارير — Web
**الملف:** `apps/web/app/dashboard/reports/page.tsx`
- `<PageHeader>`
- بطاقة الفلترة: Surface (bg white، border، border-radius: 5px)
- 3 `<StatCard>` موحّدة
- بطاقة الرسم البياني: Surface بـ border-radius: 5px
- جداول المنتجات والموظفين: `<DataTable>`

### T-18 — صفحة الإعدادات — Web
**الملف:** `apps/web/app/dashboard/settings/page.tsx`
- `<PageHeader>`
- قسم البيانات: Surface بـ border-radius: 5px
- `<InputField>` لجميع الحقول
- زر الحفظ: `<Btn variant="primary" loading={...}>`
- رسالة النجاح: `<StatusBadge status="success">`

### T-19 — صفحة المستخدمين — Web
**الملف:** `apps/web/app/dashboard/users/page.tsx`
- `<PageHeader>` + زر "إضافة مستخدم"
- `<DataTable>` مع `<StatusBadge>` للدور
- Modal إضافة/تعديل: `<InputField>` + `<Btn>`
- `<DeleteDialog>`

### T-20 — الصفحة الرئيسية Dashboard — Web
**الملف:** `apps/web/app/dashboard/(admin)/page.tsx`
- `<PageHeader>` مع ترحيب
- 4 `<StatCard>` في صف
- بطاقتا آخر الطلبات + آخر الفواتير كـ `<DataTable>` مصغّرة

---

## المرحلة 5 — المكونات المشتركة — Desktop

### T-21 — إنشاء مكونات UI للـ Desktop
**الملفات الجديدة داخل:** `apps/desktop/src/renderer/components/ui/`

- `Btn.tsx`: نفس منطق T-04 لكن بـ inline styles أو CSS classes من `styles.css`
- `DeleteDialog.tsx`: نفس منطق T-05
- `DataTable.tsx`: نفس منطق T-06
- `PageHeader.tsx`: نفس منطق T-07
- `StatusBadge.tsx`: نفس منطق T-08
- `StatCard.tsx`: نفس منطق T-09
- `InputField.tsx`: نفس منطق T-10

---

## المرحلة 6 — إعادة تصميم الـ Desktop Layout والصفحات

### T-22 — إعادة تصميم App Layout + Sidebar — Desktop
**الملف:** `apps/desktop/src/renderer/App.tsx`
- تطبيق تصميم Sidebar حسب § 5 من الـ spec
- Brand section: شعار + اسم المتجر
- Nav items: بـ CSS classes جديدة
- Sync section: حالة الاتصال كـ `<StatusBadge>` + زر مزامنة
- User section: avatar + اسم + دور + logout

### T-23 — صفحة تسجيل الدخول — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Login.tsx`
- إزالة جميع `borderRadius` الكبيرة
- بطاقة النموذج: **border-radius: 5px** فقط
- استخدام `<InputField>` و `<Btn>` الجديدَين

### T-24 — صفحة نقطة البيع (POS) — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Pos.tsx`
- لوحة المنتجات: شبكة 3 أعمدة، كل بطاقة border-radius: 5px
- بطاقة المنتج: اسم + سعر + كمية، تمييز المنخفض والمنعدم
- لوحة الفاتورة: `<DataTable>` مبسّط + ملخص مميّز + حقول الزبون قابلة للطي
- زر "إتمام البيع": `<Btn variant="primary" size="lg" loading={...}>`

### T-25 — صفحة الفواتير (Sales) — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Sales.tsx`
- `<PageHeader>`
- `<DataTable>` مع `<StatusBadge>` للمزامنة

### T-26 — صفحة المخزون — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Inventory.tsx`
- `<PageHeader>`
- إشعار informational (border-radius: 4px)
- `<DataTable>` مع تمييز النواقص

### T-27 — صفحة الديون — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Debts.tsx`
- 3 `<StatCard>` موحّدة
- pill buttons للفلترة
- `<DataTable>` مع `<StatusBadge>`
- Modal السداد: `<InputField>` + `<Btn>`

### T-28 — صفحة الإعدادات — Desktop
**الملف:** `apps/desktop/src/renderer/pages/Settings.tsx`
- قسم المزامنة: Surface + `<StatusBadge>` + `<Btn>`
- قسم الطابعة: Surface منفصل

---

## المرحلة 7 — المراجعة والتوحيد النهائي

### T-29 — مراجعة border-radius
- فحص جميع الملفات المعدّلة
- التأكد من عدم وجود أي قيمة `border-radius` تتجاوز **5px**
- تحديد `tailwind.config.ts` لتجميد القيم الكبيرة

### T-30 — مراجعة التأثيرات
- التحقق من وجود loading state على جميع أزرار: إنشاء/حفظ/تعديل في كلا التطبيقين
- التحقق من وجود `<DeleteDialog>` بدلاً من `confirm()` في جميع مواقع الحذف
- التحقق من delete animation على الصفوف

### T-31 — توحيد الألوان
- مراجعة أي قيم hex مكتوبة مباشرةً في الكود
- استبدالها بـ CSS variables أو Tailwind custom colors حسب التطبيق

### T-32 — اختبار RTL
- التحقق من `direction: rtl` على جميع الصفحات
- التحقق من `text-align: right` على الجداول
- التحقق من Sidebar border في الجانب الصحيح (right border للعنصر النشط في RTL)
