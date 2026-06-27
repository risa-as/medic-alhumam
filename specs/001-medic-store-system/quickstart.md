# Quickstart: نظام إدارة متجر المستلزمات الطبية

**Phase 1 output** — خطوات إقلاع بيئة التطوير. (يُنفَّذ فعليًا ضمن مهام Setup في [tasks.md](./tasks.md).)

## المتطلبات المسبقة
- Node.js 22 LTS
- pnpm 9+ (`npm i -g pnpm`)
- حساب Neon (PostgreSQL) + حساب Vercel
- (للديسكتوب) أدوات بناء Electron حسب نظام التشغيل

## 1) تهيئة الـ Monorepo
```bash
pnpm install
```
البنية: `apps/web`, `apps/desktop`, `packages/{database,core,ui,api-client}`.

## 2) متغيّرات البيئة (`apps/web/.env`)
```env
# Neon (Postgres)
DATABASE_URL="postgresql://...neon.tech/medic?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://...neon.tech/medic?sslmode=require"   # للهجرات
# Auth.js
AUTH_SECRET="<openssl rand -base64 32>"
AUTH_URL="http://localhost:3000"
# رفع الوسائط (صور + فيديو المنتجات)
UPLOADTHING_TOKEN="..."
```

## 3) قاعدة البيانات (Prisma + Neon)
```bash
pnpm --filter @medic/database prisma migrate dev   # إنشاء الجداول على Neon
pnpm --filter @medic/database prisma db seed        # بيانات أولية: فئات + مستخدم ADMIN + إعدادات
```

## 4) تشغيل الويب (REST API + المتجر + لوحة التحكم)
```bash
pnpm --filter @medic/web dev      # http://localhost:3000
```
- المتجر العام: `/`
- لوحة التحكم: `/dashboard` (تسجيل الدخول بمستخدم الـ seed)

## 5) تشغيل تطبيق سطح المكتب (Electron)
```bash
pnpm --filter @medic/desktop dev
```
- يهيّئ قاعدة SQLite محلية عند أول تشغيل، ويضبط رابط الخادم من صفحة الإعدادات.

## 6) الاختبارات
```bash
pnpm test            # Vitest لوحدات packages/core
pnpm --filter @medic/web test:e2e   # Playwright
```

## 7) النشر (الويب)
- ربط مستودع Git بـ Vercel، ضبط متغيّرات البيئة نفسها على Vercel، وربط قاعدة Neon.
- الهجرات تُشغَّل عبر `DIRECT_URL` في خطوة البناء/الإطلاق.

## التحقق السريع (Smoke Test)
1. سجّل الدخول كـ ADMIN → أضف فئة ومنتجًا بكمية ابتدائية.
2. من الديسكتوب: نفّذ بيعة نقدية → تأكد من نقص الكمية وطباعة الفاتورة.
3. نفّذ بيعة جزئية بزبون → تأكد من ظهور الدين في دفتر الديون → سجّل دفعة سداد.
4. علّم منتجًا `isOnline` → تأكد من ظهوره في المتجر العام → أرسل طلبًا → تأكد من ظهوره في صفحة الطلبات.
5. اقطع الإنترنت عن الديسكتوب → نفّذ بيعة → أعد الاتصال → تأكد من المزامنة.
