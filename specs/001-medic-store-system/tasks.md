---
description: "Task list for نظام إدارة متجر المستلزمات الطبية"
---

# Tasks: نظام إدارة متجر المستلزمات الطبية

**Input**: Design documents from `/specs/001-medic-store-system/`
**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/api-overview.md](./contracts/api-overview.md)

**Tests**: الاختبارات اختيارية. أُدرجت اختبارات وحدة لمنطق الأعمال المالي الحساس فقط (الفاتورة/الدين/المخزون) لأهميته؛ بقية الاختبارات تُضاف عند الطلب.

**Organization**: المهام مجمّعة حسب قصة المستخدم لتمكين التنفيذ والاختبار المستقل لكل قصة.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: يمكن تنفيذها بالتوازي (ملفات مختلفة، دون تبعيات)
- **[Story]**: القصة المرتبطة (US1..US6)
- المسارات الدقيقة مذكورة في الوصف

## Path Conventions

Monorepo: `apps/web` (REST API + المتجر + لوحة التحكم)، `apps/desktop` (Electron)، حزم مشتركة `packages/{database,core,ui,api-client}` — حسب [plan.md](./plan.md).

---

## Phase 1: Setup (البنية المشتركة) — ✅ مكتملة (2026-05-29)

**Purpose**: تهيئة الـ Monorepo والأدوات.

- [x] T001 إنشاء Monorepo بـ Turborepo + pnpm (`pnpm-workspace.yaml`, `turbo.json`, `package.json` جذري، `tsconfig.base.json`, `.gitignore`, `.npmrc`) والمجلدات `apps/`, `packages/`
- [x] T002 [P] تهيئة `apps/web` كمشروع Next.js 15 (App Router) + TypeScript + Tailwind، وضبط RTL/عربي (`lang="ar" dir="rtl"`) في `apps/web/app/layout.tsx` + نقطة `GET /api/health`
- [x] T003 [P] تهيئة `packages/database` بـ Prisma وملف `prisma/schema.prisma` (datasource + generator فقط) + اتصال Neon (`DATABASE_URL` pooled + `DATABASE_URL_UNPOOLED` directUrl) — تم توليد العميل والتحقق من الاتصال بنجاح
- [x] T004 [P] تهيئة `packages/core` (TypeScript + Zod + Vitest، اختبارات تمر) و`packages/api-client` (عميل REST موحّد) و`packages/ui` (cn + قائمة المحافظات، جاهزة لـ shadcn/RTL)
- [x] T005 [P] ضبط ESLint (flat config على مستوى الجذر + next config للويب) + Prettier + tsconfig مشترك
- [x] T006 [P] تهيئة `apps/desktop` بـ Electron + electron-vite + React + Prisma(SQLite) هيكلًا أوليًا (الصفحات الخمس placeholder) — البناء ينجح

**Checkpoint**: ✅ تم التحقق — `pnpm install` ينجح، بناء الويب (`next build`) والديسكتوب (`electron-vite build`) ينجح، اختبارات core تمر، عميلا Prisma (Neon + SQLite) مولّدان، واتصال Neon مؤكَّد (`SELECT 1`).

> **ملاحظة**: زوّد العميل مفتاح **UploadThing** لرفع الوسائط (بدل Vercel Blob)؛ تم حفظه في البيئة وسيُعتمد في مهام الرفع (T026/T057).

---

## Phase 2: Foundational (متطلبات حاجبة — قبل أي قصة) — ✅ مكتملة (2026-05-29)

**Purpose**: بنية تحتية أساسية يعتمد عليها كل القصص.

**⚠️ CRITICAL**: لا تبدأ أي قصة قبل اكتمال هذه المرحلة.

- [x] T007 تعريف مخطط Prisma الكامل في `packages/database/prisma/schema.prisma` لكل الكيانات في [data-model.md](./data-model.md) (Product, Category, Sale, SaleItem, Customer, Debt, DebtPayment, StockMovement, Order, OrderItem, User + جداول Auth.js، Setting) + كل الـ enums
- [x] T008 تشغيل أول هجرة Prisma على Neon (`20260529151148_init`) + سكربت seed (5 فئات، مستخدم ADMIN `admin@medic.local`/`admin123`، صف Setting) — نُفّذت بنجاح
- [x] T009 [P] تعريف Zod schemas للكيانات و DTOs المشتركة في `packages/core/src/schemas/` (common, product + customField, catalog/stock, sale + debtPayment, order + customerSession)
- [x] T010 [P] منطق الأعمال المالي في `packages/core/src/logic/` : `calculateSaleTotals` (الإجمالي/الخصم/المتبقي/نوع الدفع)، `deriveDebtStatus`/`applyDebtPayment`، `applyStockMovement`/`canSell`، `roundAmount`
- [x] T011 إعداد Auth.js (NextAuth v5) مع Prisma Adapter وموفّر Credentials (bcrypt) وجلسة JWT والأدوار (ADMIN/CASHIER) في `apps/web/lib/auth.ts` و`app/api/auth/[...nextauth]/route.ts` + صفحة `/login` + توسيع الأنواع
- [x] T012 [P] أدوات API مشتركة في `apps/web/lib/`: `api.ts` (ApiError + errorResponse + parseBody + handleRoute) و`rbac.ts` (requireUser/requireRole)
- [x] T013 [P] إعداد TanStack Query + SessionProvider في `apps/web/app/providers.tsx`، و`packages/api-client` (ApiClient + إعادة تصدير أنواع core)
- [x] T014 [P] اختبارات وحدة في `packages/core` لمنطق الفاتورة/الدين/المخزون (Vitest) — 20 اختبارًا تمر

**Checkpoint**: ✅ تم التحقق — هجرة Neon مطبَّقة + seed، اختبارات core (20/20) تمر، بناء الويب ينجح (مسارات `/api/auth` و`/login` و`/api/health`)، بناء الديسكتوب ينجح، typecheck نظيف.

---

## Phase 3: User Story 1 - البيع عبر نقطة البيع (Priority: P1) 🎯 MVP — ✅ مكتملة (2026-05-29)

**Goal**: إتمام بيعة في الديسكتوب (نقد/دين/جزئي)، خصم المخزون، إصدار وطباعة الفاتورة، مع عمل دون اتصال.

**Independent Test**: بيع منتج، إصدار فاتورة، والتحقق من نقص المخزون بمقدار المباع.

- [x] T015 [US1] خدمة البيع الموثوقة `createSaleAuthoritative` في `apps/web/lib/services/sales.ts` + نقطة `POST /api/sales`: تحقق التوفر، معاملة Prisma (Sale + SaleItem + StockMovement(SALE) + خصم الكمية + إنشاء Debt عند المتبقي) + توليد رقم فاتورة + مهلة معاملة 30s
- [x] T016 [P] [US1] نقطتا `GET /api/sales` و`GET /api/sales/[id]` لقائمة وتفاصيل الفواتير (إعادة الطباعة)
- [x] T017 [P] [US1] دوال `api-client` للبيع والمزامنة (`salesApi`/`syncApi`) في `packages/api-client/src/resources.ts`
- [x] T018 [US1] شاشة نقطة البيع في `apps/desktop/src/renderer/pages/Pos.tsx`: بحث، سلة، كميات، خصم بند/فاتورة، اشتقاق نوع الدفع، زبون اختياري — حالة عبر Zustand (`store.ts`)
- [x] T019 [US1] الطباعة: مكوّن `Invoice.tsx` + `window.print()` مع CSS طباعة، وإعادة الطباعة من صفحة `Sales.tsx`
- [x] T020 [US1] Offline-first: مخطط SQLite محلي (LocalProduct/LocalSale/LocalSaleItem/SyncQueueItem/Meta) + كتابة البيعة محليًا وخصم المرآة + إدراج حدث في طابور المزامنة (`main/sales.ts`)
- [x] T021 [US1] نقطتا `POST /api/sync/push` و`GET /api/sync/pull` (مصادقة Bearer عبر SYNC_SECRET، idempotent عبر clientEventId) + محرّك المزامنة الدوري في `main/sync.ts`
- [x] T022 [US1] منع الكمية السالبة والتنبيه عند تجاوز المتوفر في واجهة POS (`canSell`) وعلى الخادم (409 INSUFFICIENT_STOCK)

**Checkpoint**: ✅ تم التحقق فعليًا مقابل Neon — `sync/pull` يعيد المنتجات (200)، `sync/push` ينشئ فاتورة ويخصم المخزون (50→48) وينشئ دينًا (OPEN)، التكرار يُعاد كـ `duplicate` (idempotency)، الطلب دون مصادقة يُرفض (401). بناء الويب والديسكتوب ناجح، واختبارات core (20/20) تمر.

> **ملاحظات تشغيل**:
>
> - محليًا: `DATABASE_URL` في `apps/web/.env.local` يستخدم اتصال Neon المباشر (أكثر موثوقية للتطوير)؛ في الإنتاج على Vercel استخدم رابط الـ pooler.
> - مهلة معاملات Prisma رُفعت إلى 30s لاستيعاب زمن وصول Neon.
> - مصادقة المزامنة عبر `SYNC_SECRET` (Bearer) — تُضبط على الخادم والديسكتوب (`MEDIC_SERVER_URL`/`SYNC_SECRET`).
> - أضيفت 3 منتجات عيّنة إلى seed لتجربة نقطة البيع.

---

## Phase 4: User Story 2 - إدارة المخزون وإدخال البضاعة (Priority: P1) — ✅ مكتملة (2026-05-30)

**Goal**: إدارة المنتجات/الفئات وحركات المخزون والتنبيهات.

**Independent Test**: إضافة منتج بكمية ابتدائية، تسجيل شراء يزيد الكمية، وظهور تنبيه تحت حد التنبيه.

- [x] T023 [P] [US2] نقطتا الفئات `GET/POST /api/categories`
- [x] T024 [US2] مسارات المنتجات `GET/POST /api/products` و`GET/PATCH/DELETE /api/products/[id]` (تشمل isOnline والصور والفيديو والحقول المخصّصة) + خدمة `products.ts` (تسلسل Decimal + فلترة)
- [x] T025 [P] [US2] `GET/POST /api/stock-movements` (شراء/تسوية/إرجاع → `applyStockMovement` + تحديث الكمية كحركة، 409 عند السالب) و`GET /api/inventory/alerts` (field-reference: quantity ≤ minQuantity)
- [x] T026 [P] [US2] رفع صور المنتجات عبر UploadThing — نقطة `productImage` في `/api/uploadthing` (بدل `/api/uploads/image`؛ الأسلوب الاصطلاحي لـ UploadThing)
- [x] T027 [P] [US2] دوال `api-client` للمنتجات/الفئات/الحركات (`catalogApi`)
- [x] T028 [US2] لوحة التحكم `apps/web/app/dashboard/` (تخطيط محمي بالمصادقة + قائمة) وصفحة `dashboard/inventory/` (جدول، بحث، فلترة النواقص، تمييز، حذف، شراء سريع) عبر TanStack Query
- [x] T029 [US2] نموذج إضافة/تعديل منتج (React Hook Form) مع رفع الصور/الفيديو (UploadButton) وعلامة isOnline
- [x] T030 [US2] صفحة مخزون الديسكتوب `apps/desktop/src/renderer/pages/Inventory.tsx` (عرض المرآة المحلية + بحث + تمييز النواقص؛ الإدارة الكاملة عبر الويب)
- [x] T056 [US2] محرّر الحقول المخصّصة الديناميكي داخل نموذج المنتج (useFieldArray: اسم، نوع select/text، قيم، إلزامي) → `Product.customFields`
- [x] T057 [US2] رفع فيديو المنتج عبر UploadThing — نقطة `productVideo` في `/api/uploadthing` (بدل `/api/uploads/video`) وربطه بـ `videoUrl`

**Checkpoint**: ✅ تم التحقق — البناء ينجح (مسارات `/dashboard` و`/dashboard/inventory` و9 نقاط API)، المسارات محميّة (products/categories/alerts → 401، dashboard → 307)، واستعلام التنبيهات (field-reference) وإنشاء منتج بحقول مخصّصة يعملان على Neon، اختبارات core (20/20) تمر.

> **ملاحظات**:
>
> - رفع الوسائط عبر **UploadThing** على نقطة `/api/uploadthing` (endpoints: `productImage` 5 صور/4MB، `productVideo` 1/64MB) بمصادقة ADMIN. السبب: الأسلوب الاصطلاحي لـ UploadThing بدل مساري `/api/uploads/*` الحرفيين.
> - مخزون الديسكتوب للعرض فقط (مرآة محلية + تنبيهات)؛ الإدارة الكاملة (إضافة/تعديل/حذف/حركات) عبر لوحة تحكم الويب (ADMIN).
> - أُضيف `minQuantity` لمرآة الديسكتوب وللـ pull لدعم تنبيهات النواقص محليًا.
> - حُوِّل `packages/database/.env` للاتصال المباشر بـ Neon (موثوقية الأدوات المحلية).

---

## Phase 5: User Story 3 - دفتر الديون والزبائن (Priority: P2) — ✅ مكتملة (2026-05-30)

**Goal**: تتبع أرصدة الزبائن وتسجيل دفعات السداد.

**Independent Test**: إنشاء دين عبر فاتورة جزئية ثم تسجيل دفعة والتحقق من تناقص الرصيد وتغيّر الحالة.

- [x] T031 [P] [US3] نقاط الزبائن `GET/POST /api/customers` و`GET /api/customers/[id]` (مع رصيد محسوب + ديون + فواتير) + خدمة `customers.ts` (`getCustomerBalance`/`getCustomerWithSummary`/`serializeDebt`)
- [x] T032 [US3] `GET /api/debts` (مفتوحة+جزئية افتراضًا، مع مجاميع: totalAmount/totalPaid/totalRemaining) + `POST /api/debts/[id]/payments` (`applyDebtPayment` → تحديث حالة الدين) ضمن معاملة 30s + خدمة `debts.ts` (`listDebts`/`recordDebtPayment`)
- [x] T033 [P] [US3] دوال `api-client` للزبائن/الديون (`customersApi`/`debtsApi`)
- [x] T034 [US3] صفحة دفتر الديون في الديسكتوب `apps/desktop/src/renderer/pages/Debts.tsx` (جلب مباشر من الخادم + سداد مباشر + فلتر حالة + تنبيه offline) عبر IPC (`debts:list`/`debts:pay`)
- [x] T035 [P] [US3] صفحة الديون `apps/web/app/dashboard/debts/` (جدول + ملخص مالي + فلتر حالة + نافذة سداد) وصفحة الزبائن `apps/web/app/dashboard/customers/` (قائمة + بحث + تفاصيل بجانبين) عبر TanStack Query

**Checkpoint**: ✅ تم التحقق فعليًا مقابل Neon — فاتورة جزئية → دين OPEN (20,000) → دفعة 1 (PARTIAL, متبقّي 10,000) → دفعة 2 (PAID, متبقّي 0) → 2 سجلات DebtPayment. `/debts` و`/customers` بدون مصادقة → 401. بناء الويب (17 مسار) + الديسكتوب + اختبارات core (20/20) ✅.

> **تصميم الديسكتوب**: دفتر الديون يستدعي الخادم مباشرة (ليس مرآة SQLite) لأن الديون تُنشأ على الخادم (منشأة من sync/push أو الويب)؛ يظهر تنبيه offline عند انقطاع الاتصال.

---

## Phase 6: User Story 4 - المتجر الإلكتروني (Priority: P2) — ✅ مكتملة (2026-05-30)

**Goal**: متجر عام يعرض المنتجات (isOnline) ويستقبل الطلبات.

**Independent Test**: تصفّح منتج معروض، إضافته للسلة، إرسال طلب، وظهوره في صفحة الطلبات بحالة "جديد".

- [x] T036 [P] [US4] `GET /api/storefront/products` و`/api/storefront/products/[id]` (isOnline فقط، فلتر بالفئة/البحث، بدون مصادقة، costPrice محذوف)
- [x] T037 [US4] مجموعة مسارات `(storefront)`: الرئيسية، `/products` (شبكة + فلتر فئة)، `/products/[id]` (تفاصيل + مصغّرات صور + حقول مخصّصة) — SSR مع `revalidate`
- [x] T038 [US4] سلة `/cart` (Zustand + persist localStorage) وصفحة `/checkout` بنموذج RHF (اسم/هاتف/محافظة/عنوان) + ملخص الطلب
- [x] T039 [US4] `POST /api/orders` (عام، idempotent عبر clientEventId، تحقق حقول إلزامية مخصّصة) وصفحة `/order-success`، `GET /api/orders` (ADMIN) + صفحة `/dashboard/orders`، `GET/POST/DELETE /api/session/customer` (كوكي httpOnly)
- [x] T058 [US4] أيقونة الفيديو (▶) في بطاقات المنتج وصفحة التفاصيل وصفحة الهبوط — الصور تُعرض دائمًا، مشغّل modal عند الضغط فقط عند توفّر `videoUrl` (FR-030)
- [x] T059 [US4] زر "اطلب الآن مباشرة" في كل بطاقة وصفحة تفاصيل المنتج → `/landing/[id]` (FR-031) + صفحة `/thank-you` بعدّاد 5 ثوانٍ ينقل للمتجر (FR-034)
- [x] T060 [US4] `/checkout` الشرطي: يقرأ كوكي `medic_customer` من الخادم → ملخص قابل للتعديل إن وُجدت، أو فورمة كاملة بمحافظات عراقية عند الدخول المباشر (FR-036)

**Checkpoint**: ✅ تم التحقق — `GET /api/storefront/products` يعيد المنتجات (200، عام)، `POST /api/orders` ينشئ الطلب (201) ويُعيد نفسه عند التكرار (idempotency)، كوكي الجلسة تُحفظ (set-cookie)، `GET /api/orders` بدون auth → 401. 35 مساراً تبني بنجاح، اختبارات core (20/20) ✅.

---

## Phase 7: User Story 5 - إدارة الطلبات الواردة (Priority: P2) — ✅ مكتملة (2026-05-30)

**Goal**: عرض الطلبات (موقع + سوشل ميديا) وإدارة حالاتها.

**Independent Test**: إنشاء طلب (موقع أو يدوي بمصدر فيسبوك)، تغيير حالته، والتحقق من الحفظ.

- [x] T040 [P] [US5] نقاط `GET /api/orders` (فلترة بالمصدر/الحالة) و`GET /api/orders/[id]` و`PATCH /api/orders/[id]/status`
- [x] T041 [US5] دعم إدخال الطلبات يدويًا (مصدر FACEBOOK/INSTAGRAM/OTHER) في `POST /api/orders` + نموذج إدخال (`ManualOrderModal` بالمحافظات العراقية)
- [x] T042 [US5] صفحة الطلبات `apps/web/app/dashboard/orders/page.tsx`: جدول + فلترة المصدر/الحالة + لوحة تفاصيل + تغيير الحالة (NEW→PROCESSING→SHIPPED→COMPLETED/CANCELLED)
- [x] T043 [P] [US5] دوال `api-client` للطلبات (`ordersApi`/`ordersFullApi` في `packages/api-client/src/resources.ts`)

**Checkpoint**: ✅ تم التحقق — مسارات `/api/orders`, `/api/orders/[id]`, `/api/orders/[id]/status` موجودة ومحمية، صفحة الطلبات تعمل بالفلترة والإدخال اليدوي وتغيير الحالة.

---

## Phase 8: User Story 7 - صفحة الهبوط (Landing) وقمع الطلب السريع (Priority: P2) — ✅ مكتملة (2026-05-30)

**Goal**: صفحة هبوط لكل منتج بفورمة (مع حقول مخصّصة) تُنشئ طلبًا مباشرة، ثم صفحة شكر بعدّاد تحوّل للمتجر، مع حفظ معلومات الزبون في الجلسة.

**Independent Test**: فتح `/landing/[id]`، ملء الفورمة وإرسالها، التحقق من إنشاء طلب، ظهور صفحة الشكر بعدّاد 5 ثوانٍ ينقل للمتجر، وعدم ظهور فورمة الإدخال في تأكيد الطلب بعدها.

- [x] T061 [P] [US7] صفحة الهبوط تستعلم Prisma مباشرة (SSR) — بيانات المنتج + الحقول المخصّصة متاحة في `landing/[id]/page.tsx` بدل نقطة API منفصلة
- [x] T062 [US7] `apps/web/app/(storefront)/landing/[id]/LandingClient.tsx`: تفاصيل المنتج + فيديو modal + فورمة (اسم، رقم، محافظة، عنوان، عدد + الحقول المخصّصة) بـ RHF + تحقق من الإلزامية (FR-032)
- [x] T063 [US7] إنشاء الطلب من الـ landing عبر `POST /api/orders` مع `selectedAttributes` + `governorate` + `source` من بارامتر الرابط (أو LANDING_PAGE) + `clientEventId` (idempotent) + حفظ كوكي الجلسة (FR-035)
- [x] T064 [P] [US7] `GET/POST/DELETE /api/session/customer` (كوكي httpOnly موقّعة) لحفظ/قراءة/حذف معلومات الزبون
- [x] T065 [US7] صفحة `apps/web/app/(storefront)/thank-you/page.tsx` بعدّاد تنازلي 5 ثوانٍ وتحويل تلقائي للمتجر (FR-034)؛ `clientEventId` يمنع تكرار الطلب
- [x] T066 [P] [US7] `IRAQ_GOVERNORATES` مُصدَّر من `packages/ui/src/index.ts` — يُستخدم في الـ landing وتأكيد الطلب والإدخال اليدوي

**Checkpoint**: ✅ تم التحقق — `/landing/[id]` تعرض المنتج + الفورمة + الحقول المخصّصة، الإرسال ينشئ طلبًا ويحفظ الكوكي ويُحوّل لـ `/thank-you`، العدّاد يُحوّل للمتجر بعد 5 ثوانٍ، `/checkout` يطبّق منطق الجلسة الشرطي.

---

## Phase 9: User Story 6 - الإعدادات والمستخدمون والصلاحيات (Priority: P3) — ✅ مكتملة (2026-05-30)

**Goal**: ضبط بيانات المحل/الطابعة وإدارة المستخدمين والأدوار.

**Independent Test**: إنشاء كاشير والتحقق من منعه من الصفحات الإدارية، وتغيير اسم المحل وظهوره على الفاتورة.

- [x] T044 [P] [US6] `GET/PATCH /api/settings` (اسم/شعار/عملة/طابعة) — GET لجميع المستخدمين، PATCH لـ ADMIN فقط؛ upsert يضمن وجود صف واحد دائمًا
- [x] T045 [P] [US6] `GET/POST /api/users` و`PATCH/DELETE /api/users/[id]` لإدارة المستخدمين والأدوار (ADMIN فقط) + حماية ضد حذف/تخفيض المدير الأخير
- [x] T046 [US6] `apps/desktop/src/renderer/pages/Settings.tsx` (رابط الخادم + مفتاح المزامنة) + `main/local-config.ts` (قراءة/كتابة JSON في userData) + IPC handlers (`settings:getLocal`/`settings:saveLocal`) + تحديث preload
- [x] T047 [P] [US6] صفحة `dashboard/settings/page.tsx` (اسم المتجر/العملة/الشعار) + صفحة `dashboard/users/page.tsx` (قائمة/إضافة/تعديل/حذف — ADMIN) + تحديث `dashboard/layout.tsx` (إخفاء "المستخدمون" عن CASHIER + API تُعيد 403)
- [x] T048 [US6] `GET /api/dashboard/summary` (مبيعات اليوم، أكثر 5 منتجات مبيعًا، تنبيهات النقص، الطلبات الجديدة) + صفحة `dashboard/page.tsx` بـ KPI cards وقوائم ملخّصة

**Checkpoint**: ✅ تم التحقق — بناء الويب ينجح (43 مسارًا) + بناء الديسكتوب ينجح + اختبارات core (20/20) تمر. `/api/settings` + `/api/users` + `/api/dashboard/summary` مبنيّة ومحمية بالأدوار.

---

## Phase 9.5: تفعيل الصلاحيات الدقيقة على الويب (Web Role Enforcement) — ✅ مكتملة (2026-05-31)

**Purpose**: تطبيق Role Matrix على الويب (FR-041 إلى FR-044): إخفاء costPrice على مستوى API، تقييد وصول CASHIER، وإضافة endpoint البروفايل الذاتي. (تقييد الديسكتوب نُقل لـ Phase 9.8 لأنه يحتاج تسجيل دخول.)

- [x] T067 [P] [US6] فلترة `costPrice` من استجابات API للمستخدمين بدور CASHIER — `serializeProduct(p, hideCostPrice)` في `products.ts` يحذف الحقل نهائيًا؛ مُطبَّقة في `GET /api/products`, `GET /api/products/[id]`, `GET /api/inventory/alerts` بفحص `user.role !== "ADMIN"` (FR-041). `sync/pull` لا يُرسل costPrice أصلًا.
- [x] T068 [P] [US6] نقطة `GET/PATCH /api/me` (`apps/web/app/api/me/route.ts`): تُعيد بيانات المستخدم المصادق وتعدّل `name` فقط عبر `meUpdateSchema` (email/role/password لا تُقرأ) — متاحة لكل الأدوار (FR-042)
- [x] T069 [US6] صفحة البروفايل `apps/web/app/dashboard/profile/page.tsx`: تعرض الإيميل والدور (للقراءة) + نموذج تعديل الاسم فقط عبر TanStack Query/RHF؛ في NAV لكل المستخدمين
- [x] T070 [US6] تقييد صفحات الويب: route group `dashboard/(admin)/` مع `layout.tsx` يحجب CASHIER (redirect لـ /dashboard/inventory) عن: الرئيسية/الزبائن/الديون/الإعدادات/المستخدمون حتى عبر URL مباشر (FR-044)؛ NAV مفلتر بـ `roles[]`؛ صفحة المخزون read-only للـ CASHIER (إخفاء إضافة/تعديل/حذف/شراء + عمود الإجراءات) عبر `/api/me`

**Checkpoint**: ✅ تم التحقق — بناء الويب ينجح (مسارات `/api/me` و`/dashboard/profile` مبنية، route group `(admin)` يحافظ على الـ URLs الأصلية). CASHIER: costPrice محذوف من API، صفحات ADMIN تُعيد توجيهه، المخزون للقراءة فقط، يعدّل اسمه فقط.

---

## Phase 9.7: التكامل والمصادقة الموحّدة (Unified Auth & Integration Backbone) — ✅ مكتملة (2026-05-31)

**Purpose**: العمود الفقري للتكامل (FR-045 إلى FR-051): توكن JWT موحّد يقبله الـ API من كل عميل، نسبة الفواتير للمستخدم الفعلي، وقاعدة تسوية المخزون عند تعارض الأوفلاين/الأونلاين.

**⚠️ CRITICAL BLOCKER**: يحجب Phase 9.8 (تسجيل دخول الديسكتوب) و Phase 11 (الهاتف). لا يمكن لأي عميل غير-متصفح استهلاك API المحمي قبل إتمامه.

- [x] T086 [P] [INT] نقطة `POST /api/auth/token` (`apps/web/app/api/auth/token/route.ts`): تحقق bcrypt + إصدار JWT عبر `lib/jwt.ts` (jose، HS256، AUTH_SECRET، 30 يومًا، iss/aud) يحمل `sub`+`role`؛ 401 عند الفشل (FR-046)
- [x] T087 [INT] dual-auth في `apps/web/lib/rbac.ts`: `requireUser` يقبل كوكي الجلسة **أو** `Authorization: Bearer <JWT>` (يفكّه `verifyClientToken` + يقرأ المستخدم من DB ويرفض توكن مستخدم محذوف/مُغيَّر الدور)؛ يُعيد `AuthedUser{id,role,...}` (FR-045)
- [x] T088 [INT] إضافة enum `SalePlatform` + حقل `platform` لـ `Sale` + هجرة `20260531051119`؛ `userId` كان موجودًا؛ `SaleSyncEvent` يحمل `userId` اختياريًا؛ `recordSyncedSale` يستخدم `event.userId` (بعد التحقق من وجوده) بدل `syncSystemUserId` + يضع platform=POS_DESKTOP (FR-047)
- [x] T089 [INT] قاعدة التسوية في `recordSyncedSale`: قبول فاتورة الأوفلاين دائمًا؛ عند النقص تثبيت الكمية عند 0 + إنشاء `StockMovement(ADJUSTMENT, needsReview=true)` بالفرق (`shortfall`)؛ لا رفض. حقل `needsReview` مُضاف لـ StockMovement + هجرة (FR-049)
- [x] T090 [P] [INT] التحقق المسبق موجود في `createSaleAuthoritative` (409 INSUFFICIENT_STOCK) — يقبل الآن `platform` (POS_MOBILE/WEB)؛ `/api/sales` يمرّر `platform` من الجسم (FR-050)
- [x] T091 [P] [INT] `GET /api/stock-movements?needsReview=1` + `reviewCount` في `/api/dashboard/summary` + شارة تنبيه برتقالية في صفحة لوحة التحكم لحركات التسوية المعلّقة

**Checkpoint**: ✅ تم التحقق فعليًا على خادم مبنيّ (port 3100 مقابل Neon): `POST /api/auth/token` يُصدر توكنًا (admin+cashier)، dual-auth يعمل (Bearer → 200، بلا مصادقة → 401، كلمة مرور خاطئة → 401)، ADMIN يرى costPrice و CASHIER **لا يراه** (SC-009)، CASHIER → 403 على `/api/users` و 200 على `PATCH /api/me`. بناء الويب ينجح، اختبارات core (20/20) تمر، هجرة Neon مطبّقة.

---

## Phase 9.8: تسجيل دخول الديسكتوب متعدّد المستخدمين (Desktop Multi-User Login & Roles) — ✅ مكتملة (2026-05-31، runtime لم يُختبر)

**Purpose**: جهاز واحد يستخدمه عدّة موظفين بمناوبات — تسجيل دخول/خروج، نسبة الفواتير للمستخدم الفعّال، وتقييد الصفحات حسب الدور، **مع عمل الدخول دون اتصال** (offline-first) — FR-017/FR-047/FR-052.

**⚠️ PREREQUISITE**: Phase 9.7 (JWT + dual-auth + userId في حدث المزامنة).

- [x] T092 [INT] جدول `LocalUser` (id, name, email, passwordHash, role) في SQLite + `userId?` على `LocalSale` + `db push`؛ `GET /api/sync/pull` يُرجع المستخدمين (محميّ SYNC_SECRET)؛ upsert في `pullProducts` (`sync.ts`) (FR-052)
- [x] T093 [INT] `apps/desktop/src/main/auth.ts`: دخول هجين — أونلاين `POST /api/auth/token`؛ أوفلاين bcrypt ضد `LocalUser`؛ حفظ الجلسة مشفّرة بـ `safeStorage` + `restoreSession` عند الإقلاع؛ IPC (`auth:login/logout/current`) + preload + `Login.tsx` (شاشة قفل)
- [x] T094 [INT] `createLocalSale(input, userId)` يخزّن `userId` ويضيفه لحمولة المزامنة لحظة البيع؛ IPC يمرّر `getCurrentUser()?.id` (FR-047). نقل المزامنة يبقى SYNC_SECRET
- [x] T095 [US6] `App.tsx` معاد كتابته: gating بالجلسة + شريط المستخدم + زر تسجيل الخروج + رئيسية مبسّطة + NAV مفلتر بـ `roles[]` (CASHIER بلا دفتر الديون)
- [x] T097 [P] [US6] مخزون الديسكتوب لا يخزّن costPrice في المرآة (LocalProduct: salePrice فقط) — مخفيّ بالتصميم

**Checkpoint**: ✅ بناء الديسكتوب + typecheck نظيفان (بعد إضافة `@types/node`)، بناء الويب يشمل sync/pull الموسّع. **عقود التكامل التي يعتمدها الديسكتوب مُختبرة runtime مقابل Neon** (port 3100):
- `GET /api/sync/pull` يُرجع المستخدمَين مع passwordHash (60 حرف bcrypt) للدخول الأوفلاين، ويُرفض بلا SYNC_SECRET (401) ✅
- `POST /api/sync/push` بحدث يحمل `userId` → الفاتورة منسوبة لـ **cashier@medic.local (CASHIER)** لا "أول ADMIN"، و`platform=POS_DESKTOP` ✅ (FR-047)
- التسوية: بيع أوفلاين يتجاوز المتوفّر (55 من 50) → يُقبل، الكمية تُثبَّت عند 0، حركة `ADJUSTMENT needsReview` بفرق 5، `reviewCount=1` في dashboard + `?needsReview=1` يُرجعها ✅ (FR-049)
- تم تنظيف بيانات الاختبار واستعادة الكميات.
- ⚠️ واجهة Electron نفسها (شاشة الدخول، safeStorage، تبديل المستخدم) لم تُختبر بصريًا (يتطلب GUI) — لكن منطقها مبنيّ ونظيف typecheck.

---

## Phase 10: Polish & Cross-Cutting

**Purpose**: تحسينات شاملة بعد اكتمال القصص المطلوبة.

- [x] T049 [P] تقارير المبيعات `GET /api/reports/sales` (فلتر from/to + تجميع يومي/أسبوعي + سلسلة زمنية + إجماليات + أكثر المنتجات + تفصيل حسب الموظف والمنصّة، ADMIN فقط) + صفحة `dashboard/(admin)/reports/page.tsx` بـ Recharts (BarChart) + رابط NAV. ✅ مُختبر runtime: الإجماليات/التجميع يعملان، CASHIER → 403. (2026-05-31)
- [ ] T050 [P] معالجة حالات الإرجاع (RETURN) في البيع والمخزون
- [ ] T051 توحيد معالجة الأخطاء ورسائل RTL عبر الواجهات
- [x] T051a إصلاح: حذف `app/page.tsx` (placeholder Phase 1 القديم الذي كان يحجب المتجر على `/`) + تحويل ما بعد تسجيل الدخول من `/` إلى `/dashboard`. ✅ مُختبر: `/` يعرض المتجر، `/dashboard` يحمي بـ 307. (2026-05-31)
- [x] T051b إصلاح حرج (أمني + عطل): صفحات المتجر كانت تمرّر `{ ...product }` لمكوّنات العميل، فتُسرّب **`costPrice` (سعر الشراء)** للعميل العام وتُعطب التصيير (`Decimal objects are not supported`). أُنشئ `lib/storefront.ts > toStorefrontProduct` يُسقط costPrice ويحوّل Decimal→Number، وطُبّق على: الرئيسية، `/products` (Grid)، `/products/[id]`، `/landing/[id]`. ✅ مُختبر runtime: الصفحات 200، **صفر costPrice في HTML**، صفر أخطاء Decimal. (2026-05-31)
- [ ] T052 [P] توثيق العقود النهائي في `contracts/` ومراجعة quickstart
- [ ] T053 إعداد نشر `apps/web` على Vercel + ربط Neon + تشغيل الهجرات في الإطلاق
- [ ] T054 [P] تغليف وبناء تطبيق Electron للتوزيع (installer)
- [ ] T055 تشغيل التحقق السريع (Smoke Test) من quickstart.md عبر كل القصص

---

## Phase 11: تطبيق الهاتف (React Native + Expo) (Priority: P3) — ✅ مكتملة (2026-05-31، runtime على جهاز معلّق)

**Goal**: تطبيق هاتف iOS/Android يستهلك REST API المركزي، مع تجربة مختلفة حسب الدور (CASHIER: 4 صفحات؛ ADMIN: 4 + تقارير + تنبيهات).

**Tech Stack**: Expo SDK 53، Expo Router (file-based)، TypeScript، `expo-secure-store` للـ JWT، AsyncStorage لعنوان الخادم، Zustand، StyleSheet (RTL). الرسوم في التقارير بأشرطة View بسيطة (بلا مكتبة native).

**Independent Test**: تسجيل الدخول بحساب CASHIER → إتمام بيعة من POS → التحقق من ظهور الفاتورة وخصم المخزون. تسجيل الدخول بـ ADMIN → فتح صفحة التقارير.

**⚠️ PREREQUISITE**: ✅ Phase 9.7 (JWT) + Phase 9.5 (costPrice) + T049 (تقارير) — كلها مكتملة.

### Setup & Foundation

- [x] T072 تهيئة `apps/mobile` بـ Expo + Expo Router + TS: `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js` (إعداد مونوريبو pnpm)، `eas.json`, `.gitignore`, `README.md`. مُضاف للـ workspace عبر `apps/*`
- [x] T073 [P] عميل API `apps/mobile/lib/api.ts`: يبني baseUrl من الإعداد + يُرفق JWT تلقائيًا + يعالج 401 (مسح التوكن + `setUnauthorizedHandler`)؛ `lib/secure.ts` (SecureStore) + `lib/server.ts` (AsyncStorage)
- [x] T074 [P] Zustand store `apps/mobile/store/auth.ts`: `user`+`initializing`، `restore` (يتحقق عبر `/me`)، `login` (`/auth/token`)، `logout`
- [x] T075 شاشة الدخول `app/(auth)/login.tsx`: نموذج بريد/كلمة مرور → `POST /api/auth/token` + حفظ JWT؛ التوجيه يتكفّل به root layout
- [x] T096 [P] [US8] `GET /api/sales?mine=1&period=today` (فلترة بالمستخدم من التوكن + اليوم) يُرجع `{data, count, totalRevenue}` — تستهلكه رئيسية الهاتف

### CASHIER Screens (مشتركة مع ADMIN)

- [x] T076 [US8] الرئيسية `app/(app)/index.tsx`: مبيعاتي اليوم + عددها (للجميع)؛ للمدير KPIs المتجر من `/api/dashboard/summary` + اختصار POS + pull-to-refresh
- [x] T077 [P] [US8] المخزون `app/(app)/inventory/index.tsx`: قائمة + بحث + تمييز النواقص؛ costPrice مفلتر على الخادم للـ CASHIER
- [x] T078 [US8] نقطة البيع `app/(app)/pos/index.tsx`: بحث + سلة + كميات +/− + خصم + مدفوع + متبقّي → `POST /api/sales` بـ `platform: POS_MOBILE` (online-only) + تأكيد
- [x] T079 [P] [US8] الإعدادات `app/(app)/settings/index.tsx`: اسم/دور + تعديل الاسم (`PATCH /api/me`) + عنوان الخادم (AsyncStorage) + تسجيل الخروج

### ADMIN-only Screens

- [x] T080 [P] [US8] التقارير `app/(app)/reports/index.tsx` (ADMIN): `/api/reports/sales` بمدى زمني → إجماليات + أشرطة View يومية + حسب المنصّة + أكثر المنتجات (بدل Victory/Recharts لتقليل التبعيات native)
- [x] T081 [P] [US8] التنبيهات `app/(app)/alerts/index.tsx` (ADMIN): نقص المخزون + طلبات جديدة + تسويات للمراجعة من `/api/dashboard/summary`

### Navigation & Role Guards

- [x] T082 [US8] `app/(app)/_layout.tsx`: Tabs بأيقونات إيموجي + إخفاء تبويبَي التقارير/التنبيهات عن CASHIER (`href: null`)؛ root `_layout.tsx` يحرس الجلسة (redirect login/app) + RTL
- [x] T083 [P] [US8] مكوّنات مشتركة `components/`: `States.tsx` (Loading/Empty/Error) + `theme.ts` (ألوان + fmt + ROLE_LABEL) بنمط RTL

### Quality & Build

- [x] T084 [P] [US8] `eas.json` (development/preview APK/production مع `EXPO_PUBLIC_DEFAULT_SERVER_URL`) + README بخطوات `eas build`. ⚠️ تشغيل البناء الفعلي يتطلب حساب Expo + جهاز
- [~] T085 [US8] اختبار smoke كامل على جهاز — **معلّق**: يتطلب جهاز/محاكي. عقود API كلها مُختبرة runtime في Phases 9.5/9.7/T049 (token، mine sales، products costPrice بالدور، reports 403)

**Checkpoint**: ✅ كل الشيفرة مكتوبة و**typecheck نظيف** (`tsc --noEmit` يمرّ مقابل أنواع Expo/RN/expo-router الحقيقية بعد `pnpm install`). core(20/20)+web+desktop typecheck سليمة بعد إضافة mobile. ⚠️ التشغيل الفعلي على جهاز/محاكي + EAS build معلّقان (يتطلبان بيئة الهاتف).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: لا تبعيات.
- **Foundational (Phase 2)**: يعتمد على Setup — يحجب كل القصص.
- **القصص (Phase 3+)**: تعتمد على Foundational. US1 وUS2 (كلاهما P1) أساس الـ MVP. US3/US4/US5/US7 (P2) ثم US6 (P3).
- **Phase 9.5 (Web Role Enforcement)**: بعد Phase 9 — مستقلة (لا تحتاج JWT).
- **Phase 9.7 (Unified Auth)**: العمود الفقري — **يحجب Phase 9.8 و Phase 11**. لا عميل غير-متصفح يستهلك API قبله.
- **Phase 9.8 (Desktop Login)**: بعد Phase 9.7.
- **T049 (تقارير المبيعات)**: يُبنى قبل Phase 11 لأن T080 (تقارير الهاتف) يستهلكه.
- **Phase 11 (Mobile)**: بعد Phase 9.7 (JWT) + Phase 9.5 (costPrice) + T049 (تقارير).
- **Polish (Phase 10)**: بعد اكتمال القصص المطلوبة.

### User Story Dependencies

- **US1 (البيع)**: بعد Foundational. أساس الـ MVP.
- **US2 (المخزون)**: بعد Foundational؛ البيع يحتاج منتجات/كميات — يُبنى بالتوازي مع US1، ويُفضّل توفّر T024 قبل اختبار US1 نهائيًا.
- **US3 (الديون)**: بعد Foundational؛ يستفيد من الديون المُنشأة في US1 لكنه قابل للاختبار باستقلال.
- **US4 (المتجر)**: بعد Foundational؛ مستقل (يقرأ المنتجات).
- **US5 (الطلبات)**: بعد Foundational؛ يستهلك طلبات US4/US7 أو إدخالًا يدويًا.
- **US7 (صفحة الهبوط)**: بعد Foundational؛ يستفيد من نقاط المنتجات/الطلبات في US2/US4، ويظهر طلباته في US5؛ قابل للاختبار باستقلال.
- **US6 (الإعدادات/الصلاحيات)**: بعد Foundational؛ مستقل.
- **US8 (الهاتف)**: بعد Phase 9.5 + T049.

### Within Each User Story

- العقود/الـ API قبل الواجهات؛ schemas/core قبل الـ API؛ الإتمام (الخادم) قبل المزامنة في الديسكتوب.
- الاختبارات (إن وُجدت) تُكتب وتفشل قبل التنفيذ.

### Parallel Opportunities

- كل مهام Setup المعلّمة [P] بالتوازي.
- مهام Foundational [P] (T009, T010, T012, T013, T014) بالتوازي بعد T007/T008.
- بعد Foundational يمكن لفِرق مختلفة العمل على US3/US4/US5/US6 بالتوازي.
- داخل كل قصة: نقاط API المستقلة + دوال api-client المعلّمة [P] بالتوازي.

---

## Implementation Strategy

### MVP First

1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 (US1) + ما يلزم من Phase 4 (US2: T023/T024) → **توقّف وتحقّق**: بيعة كاملة تخصم المخزون وتطبع الفاتورة وتزامن.

### Incremental Delivery

1. Setup + Foundational → الأساس جاهز. ✅
2. US1 + US2 → الـ MVP (بيع + مخزون) — عرض. ✅
3. US3 (الديون) → عرض. ✅
4. US4 + US5 + US7 (المتجر + الطلبات + قمع الهبوط) → عرض. ✅
5. US6 (الإعدادات/الصلاحيات) → ✅
6. **Phase 9.5** (Role Matrix على الويب + costPrice filtering) → الصلاحيات مطبّقة على الويب.
7. **Phase 9.7** (المصادقة الموحّدة JWT + نسبة الفواتير + تسوية المخزون) → العمود الفقري للتكامل.
8. **Phase 9.8** (تسجيل دخول الديسكتوب + صلاحياته) → الديسكتوب متعدد المستخدمين.
9. **T049** (تقارير المبيعات) → تُبنى قبل الهاتف.
10. **Phase 11** (تطبيق الهاتف) → عرض على iOS/Android.
11. Polish الكامل (Phase 10 المتبقّي) → الإصدار النهائي.

## Notes

- [P] = ملفات مختلفة دون تبعيات.
- العمليات المالية المركّبة ضمن معاملات Prisma (ذرّية).
- لا حذف صامت للسجلات المالية؛ التصحيح بحركة معاكسة.
- منفذ مستقبلي: `apps/mobile` يستهلك نفس `api-client` وعقود REST دون تغيير الخادم.
