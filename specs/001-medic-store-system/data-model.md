# Data Model: نظام إدارة متجر المستلزمات الطبية

**Phase 1 output** — الكيانات وعلاقاتها وقواعد التحقق، مشتقّة من Key Entities و Functional Requirements في [spec.md](./spec.md). يُترجَم هذا لاحقًا إلى `packages/database/prisma/schema.prisma` (PostgreSQL) ومخطط SQLite المماثل للديسكتوب.

## الكيانات

### Category (فئة)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string (cuid) | PK |
| nameAr | string | اسم الفئة بالعربية، فريد |
| createdAt | DateTime | |
- **علاقات**: 1—N مع Product.

### Product (منتج)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string (cuid) | PK |
| nameAr | string | اسم المنتج |
| sku | string | باركود/رمز، فريد |
| categoryId | string | FK → Category |
| costPrice | Decimal | سعر الشراء ≥ 0 |
| salePrice | Decimal | سعر البيع ≥ 0 |
| quantity | int | الكمية الحالية ≥ 0 |
| minQuantity | int | حد التنبيه ≥ 0 |
| images | string[] | روابط صور (تُعرض دائمًا) |
| videoUrl | string? | رابط فيديو واحد اختياري (FR-029) |
| description | string? | وصف اختياري |
| isOnline | boolean | يُعرض في المتجر العام (FR-013) |
| customFields | Json | تعريف الحقول المخصّصة (FR-026)؛ مصفوفة عناصر: `{ id, name, type: "select"\|"text", options?: string[], required: boolean }` |
| createdAt/updatedAt | DateTime | |
- **قواعد**: `quantity` لا يصبح سالبًا (FR-006)؛ `isOnline=true` شرط الظهور في المتجر؛ الحقول المخصّصة سمات للطلب فقط ولا تُنشئ مخزونًا/سعرًا منفصلًا لكل متغيّر؛ الفيديو يُعرض في المتجر فقط لا في الديسكتوب (FR-030).
- **علاقات**: N—1 Category؛ 1—N SaleItem / OrderItem / StockMovement.

### StockMovement (حركة مخزون)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| productId | string | FK → Product |
| type | enum | PURCHASE \| SALE \| ADJUSTMENT \| RETURN |
| quantity | int | موجب للإدخال، يُفسَّر حسب النوع |
| reason | string? | سبب التسوية/الإرجاع |
| createdAt | DateTime | |
- **قواعد**: append-only؛ كل تغيير كمية يُسجَّل كحركة (FR-008)؛ لا حذف صامت (FR-025).

### Customer (زبون)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| name | string | |
| phone | string? | |
| createdAt | DateTime | |
- **علاقات**: 1—N Sale، 1—N Debt. الرصيد = مجموع `Debt.amount - Debt.paid` المفتوحة (محسوب).

### Sale (فاتورة بيع)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| invoiceNo | string | فريد، متسلسل |
| customerId | string? | FK → Customer (اختياري للبيع النقدي) |
| items | SaleItem[] | |
| subtotal | Decimal | مجموع البنود |
| discount | Decimal | خصم على الفاتورة |
| total | Decimal | subtotal − discount |
| paid | Decimal | المدفوع |
| remaining | Decimal | total − paid (= 0 نقدًا، > 0 آجل) |
| paymentType | enum | CASH \| CREDIT \| PARTIAL |
| userId | string | FK → User (من أنشأ الفاتورة) |
| createdAt | DateTime | |
- **قواعد**: عند `remaining > 0` يُنشأ Debt مرتبط (FR-003/FR-010)؛ إتمام الفاتورة يولّد SaleItem و StockMovement(SALE) ويخصم المخزون (FR-004).

### SaleItem (بند فاتورة)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| saleId | string | FK → Sale |
| productId | string | FK → Product |
| quantity | int | > 0 |
| unitPrice | Decimal | سعر البيع لحظة العملية (snapshot) |
| lineDiscount | Decimal | خصم البند (اختياري) |
| lineTotal | Decimal | quantity × unitPrice − lineDiscount |

### Debt (دين)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| customerId | string | FK → Customer |
| saleId | string? | FK → Sale (مصدر الدين) |
| amount | Decimal | أصل الدين |
| paid | Decimal | المسدّد التراكمي |
| status | enum | OPEN \| PARTIAL \| PAID |
| createdAt/updatedAt | DateTime | |
- **علاقات**: 1—N DebtPayment.
- **قواعد**: `status` يُشتق من paid مقابل amount (FR-012).

### DebtPayment (دفعة سداد)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| debtId | string | FK → Debt |
| amount | Decimal | > 0 |
| userId | string | من سجّل الدفعة |
| createdAt | DateTime | append-only (FR-025) |

### Order (طلب وارد)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| orderNo | string | فريد |
| items | OrderItem[] | |
| customerName | string | |
| customerPhone | string | |
| governorate | string | المحافظة (FR-032) |
| customerAddress | string? | |
| source | enum | WEBSITE \| LANDING_PAGE \| FACEBOOK \| INSTAGRAM \| OTHER (FR-015/FR-033) |
| clientEventId | string? | فريد لمنع تكرار الطلب عند إعادة الإرسال/التحميل (FR-033) |
| status | enum | NEW \| PROCESSING \| SHIPPED \| COMPLETED \| CANCELLED (FR-016) |
| total | Decimal | |
| createdAt/updatedAt | DateTime | |

### OrderItem (بند طلب)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| orderId | string | FK → Order |
| productId | string | FK → Product |
| quantity | int | > 0 (العدد) |
| unitPrice | Decimal | snapshot |
| selectedAttributes | Json | القيم المختارة للحقول المخصّصة كنسخة لحظية، مثل `{ "اللون": "أحمر", "القياس": "متوسط" }` (FR-028) |

### User (مستخدم)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| name | string | |
| email | string | فريد (تسجيل الدخول) |
| passwordHash | string | |
| role | enum | ADMIN \| CASHIER (FR-021) |
| createdAt | DateTime | |
- (+ جداول Auth.js: Account/Session/VerificationToken عبر Prisma Adapter).

### Setting (إعداد)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK (صف مفرد) |
| storeName | string | |
| logoUrl | string? | |
| currency | string | افتراضي "IQD" |
| printerConfig | Json | إعداد الطابعة/شكل الفاتورة |
| updatedAt | DateTime | |

### CustomerSession (جلسة زبون — حالة جلسة لا كيان قاعدة بيانات)
معلومات الزبون المحفوظة في **كوكي جلسة موقّعة** بعد المرور بصفحة الـ landing، لتعبئة/تخطّي فورمة تأكيد الطلب (FR-035/FR-036).
| الحقل | النوع | ملاحظات |
|------|------|---------|
| name | string | |
| phone | string | |
| governorate | string | |
| address | string? | |
- لا تُخزَّن في PostgreSQL؛ تُدار عبر كوكي الجلسة على الخادم (Next.js). معلومات الطلب الفعلية تبقى محفوظة في Order/OrderItem.

### SyncQueueItem (عنصر طابور مزامنة — محلي على الديسكتوب فقط)
| الحقل | النوع | ملاحظات |
|------|------|---------|
| id | string | PK |
| entity | string | sale \| debtPayment \| stockMovement ... |
| payload | Json | الحدث المراد دفعه |
| status | enum | PENDING \| SYNCED \| FAILED |
| createdAt | DateTime | |
- يُستهلك بواسطة `/api/sync` (push/pull).

## مخطط العلاقات (مختصر)

```text
Category 1───N Product 1───N SaleItem N───1 Sale N───1 Customer
                   │                          │            │
                   ├──N StockMovement         └──1 Debt 1──N DebtPayment
                   └──N OrderItem N───1 Order
User 1───N Sale / DebtPayment
Setting (مفرد)
```

## قواعد سلامة عابرة
- كل عملية تغيّر المخزون تمر عبر StockMovement (تتبّع كامل).
- العمليات المالية (Sale, DebtPayment, StockMovement) append-only — التصحيح بحركة معاكسة لا بالحذف.
- الكميات لا تكون سالبة؛ البيع يتحقق من التوفر قبل الإتمام.
- المبالغ Decimal دائمًا.
- قيم الحقول المخصّصة تُحفظ كنسخة لحظية في OrderItem ولا تتأثر بتعديل تعريف الحقول في Product لاحقًا.
- إنشاء الطلب idempotent عبر `clientEventId` لمنع التكرار من صفحة الـ landing/الشكر.
