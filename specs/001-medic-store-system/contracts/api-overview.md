# API Contracts (REST): نظام إدارة متجر المستلزمات الطبية

**Phase 1 output** — عقود REST API التي تخدمها `apps/web/app/api/*`. كل المدخلات/المخرجات تُتحقَّق بـ Zod schemas من `packages/core`. المصادقة عبر Auth.js؛ المسارات الإدارية تتطلب دور `ADMIN`/`CASHIER` حسب الموضّح.

## اتفاقيات عامة
- الأساس: `/api`
- الترميز: JSON، تواريخ ISO 8601، مبالغ كسلاسل Decimal.
- الأخطاء: `{ "error": { "code": string, "message": string, "details"?: any } }` مع رموز HTTP قياسية (400, 401, 403, 404, 409, 422, 500).
- الترقيم: `?page=&pageSize=` مع `{ data, total, page, pageSize }`.
- التفويض: ترويسة جلسة Auth.js (cookie) أو Bearer لجهاز الديسكتوب.

## المصادقة (Auth.js)
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET/POST | `/api/auth/[...nextauth]` | تدفّقات Auth.js (تسجيل دخول/خروج/جلسة) | عام |
| GET | `/api/auth/session` | الجلسة الحالية والدور | مُصادَق |

## المنتجات والفئات
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/products` | قائمة المنتجات (فلترة: `categoryId`, `q`, `lowStock`, `online`) | مُصادَق |
| POST | `/api/products` | إنشاء منتج | ADMIN |
| GET | `/api/products/:id` | تفاصيل منتج | مُصادَق |
| PATCH | `/api/products/:id` | تعديل منتج (سعر/علامة الإنترنت/...) | ADMIN |
| DELETE | `/api/products/:id` | حذف/أرشفة منتج | ADMIN |
| GET | `/api/categories` | قائمة الفئات | مُصادَق |
| POST | `/api/categories` | إنشاء فئة | ADMIN |

## المخزون
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/stock-movements` | سجل الحركات (فلترة بالمنتج/النوع/التاريخ) | مُصادَق |
| POST | `/api/stock-movements` | تسجيل حركة (PURCHASE/ADJUSTMENT/RETURN) وتحديث الكمية | ADMIN/CASHIER |
| GET | `/api/inventory/alerts` | المنتجات تحت حد التنبيه (FR-009) | مُصادَق |

## البيع (نقطة البيع)
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| POST | `/api/sales` | إنشاء فاتورة (بنود + دفع) → يخصم المخزون ويولّد دينًا عند الحاجة | ADMIN/CASHIER |
| GET | `/api/sales` | قائمة الفواتير (فلترة بالتاريخ/الزبون) | مُصادَق |
| GET | `/api/sales/:id` | تفاصيل فاتورة (لإعادة الطباعة) | مُصادَق |
- **جسم POST /api/sales** (مختصر): `{ customerId?, items: [{ productId, quantity, unitPrice, lineDiscount? }], discount?, paid, paymentType }`
- **يتحقق**: توفّر الكميات (409 عند النقص)، اتساق المبالغ.

## الزبائن والديون
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/customers` | قائمة/بحث الزبائن | مُصادَق |
| POST | `/api/customers` | إنشاء زبون | ADMIN/CASHIER |
| GET | `/api/customers/:id` | زبون + رصيده + معاملاته | مُصادَق |
| GET | `/api/debts` | الديون المفتوحة + المجموع (FR-011) | مُصادَق |
| POST | `/api/debts/:id/payments` | تسجيل دفعة سداد → تحديث الحالة (FR-012) | ADMIN/CASHIER |

## الطلبات (المتجر + السوشل ميديا + Landing)
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/orders` | قائمة الطلبات (فلترة بالمصدر/الحالة) | ADMIN |
| POST | `/api/orders` | إنشاء طلب (من المتجر العام، أو landing، أو يدويًا بمصدر) | عام (متجر/landing) / ADMIN (يدوي) |
| GET | `/api/orders/:id` | تفاصيل طلب | ADMIN |
| PATCH | `/api/orders/:id/status` | تغيير الحالة (NEW→PROCESSING→SHIPPED→COMPLETED/CANCELLED) | ADMIN |
- **جسم POST /api/orders** (مختصر): `{ items: [{ productId, quantity, unitPrice, selectedAttributes? }], customerName, customerPhone, governorate, customerAddress?, source?, clientEventId? }`
- **idempotency**: عند تكرار نفس `clientEventId` يُعاد الطلب نفسه دون إنشاء جديد (FR-033).
- **التحقق**: الحقول المخصّصة الإلزامية للمنتج يجب أن تُملأ في `selectedAttributes` (422 عند نقصها).
- **المصدر**: يُؤخذ `source` من بارامتر الرابط (مثل facebook) وإلا `LANDING_PAGE` لطلبات الهبوط، أو `WEBSITE` لطلبات المتجر.

## المتجر العام والـ Landing (قراءة) والجلسة
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/storefront/products` | المنتجات `isOnline=true` فقط (فلترة/بحث) | عام |
| GET | `/api/storefront/products/:id` | تفاصيل منتج للعرض (تشمل الصور، videoUrl، customFields) | عام |
| GET | `/api/storefront/landing/:id` | بيانات صفحة الهبوط لمنتج (تفاصيل + حقول مخصّصة) | عام |
| GET | `/api/session/customer` | قراءة معلومات الزبون من كوكي الجلسة (إن وُجدت) لتعبئة تأكيد الطلب | عام |
| POST | `/api/session/customer` | حفظ معلومات الزبون في كوكي جلسة موقّعة (بعد الـ landing) | عام |
- صفحة الهبوط نفسها (`/landing/[id]`) وصفحة الشكر (`/thank-you`) صفحات Next.js؛ حفظ الجلسة يتم عبر `POST /api/session/customer` أو ضمن استجابة `POST /api/orders` بضبط الكوكي.

## رفع الوسائط (إدارة)
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| POST | `/api/uploads/image` | رفع صورة منتج إلى UploadThing وإرجاع الرابط | ADMIN |
| POST | `/api/uploads/video` | رفع فيديو منتج إلى UploadThing (تحقق صيغة/حجم) وإرجاع الرابط | ADMIN |

## لوحة المعلومات والتقارير
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/dashboard/summary` | مبيعات اليوم، أكثر المنتجات مبيعًا، تنبيهات النقص (FR-023) | ADMIN |
| GET | `/api/reports/sales` | تقارير مبيعات بمدى زمني | ADMIN |

## الإعدادات
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| GET | `/api/settings` | قراءة إعدادات المحل | مُصادَق |
| PATCH | `/api/settings` | تحديث (اسم/شعار/عملة/طابعة) | ADMIN |
| GET | `/api/users` / POST / PATCH | إدارة المستخدمين والأدوار | ADMIN |

## المزامنة (الديسكتوب Offline-first)
| Method | Path | الوصف | الوصول |
|--------|------|-------|--------|
| POST | `/api/sync/push` | دفع أحداث محلية (فواتير/دفعات/حركات) كدُفعة idempotent | جهاز مُصادَق |
| GET | `/api/sync/pull` | سحب تغييرات منذ `?since=` (منتجات/أسعار/طلبات) | جهاز مُصادَق |
- **idempotency**: كل حدث يحمل `clientEventId` فريدًا لمنع التكرار عند إعادة المحاولة.
- **حسم التعارض**: الخادم مرجع المخزون؛ الأحداث المالية append-only.

## ملاحظات تصميم العقود
- تُعرَّف Zod schemas لكل جسم طلب/استجابة مرة واحدة في `packages/core` وتُعاد عبر `api-client`.
- العمليات المركّبة (إنشاء فاتورة، تسجيل دفعة) تُنفَّذ ضمن معاملة Prisma لضمان الذرّية.
