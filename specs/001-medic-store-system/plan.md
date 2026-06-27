# Implementation Plan: نظام إدارة متجر المستلزمات الطبية

**Branch**: `001-medic-store-system` | **Date**: 2026-05-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-medic-store-system/spec.md`

## Summary

نظام متكامل لإدارة متجر مستلزمات طبية يتكوّن من خادم مركزي (Next.js) يعمل مصدرًا وحيدًا للحقيقة، يخدم: (1) **REST API** للبيانات والعمليات، (2) **متجر إلكتروني عام** لعرض المنتجات واستقبال الطلبات، (3) **لوحة تحكم** لإدارة المنتجات والطلبات والتقارير، إضافة إلى (4) **تطبيق سطح مكتب Electron** للبيع اليومي يعمل دون اتصال (Offline-first) ويتزامن مع الخادم. البنية Monorepo تشارك المخطط (Prisma)، الأنواع، ومنطق الأعمال بين كل المنصات، وتسمح لاحقًا بإضافة تطبيق هاتف يستهلك نفس REST API.

النهج التقني: واجهات بـ Next.js 15 + React 19 + TypeScript، مكوّنات shadcn/ui + Tailwind (RTL عربي)، نماذج React Hook Form + Zod، بيانات عبر REST (Next.js Route Handlers) مع TanStack Query، تخزين PostgreSQL على **Neon** عبر Prisma، مصادقة **Auth.js (NextAuth v5)**، نشر الويب على **Vercel**. الديسكتوب Electron يحمل واجهة مبسّطة فوق قاعدة بيانات محلية (SQLite/Prisma) مع محرّك مزامنة يستدعي REST API.

## Technical Context

**Language/Version**: TypeScript 5.x، Node.js 22 LTS
**Primary Dependencies**: Next.js 15 (App Router)، React 19، Prisma 6، Auth.js (NextAuth v5)، shadcn/ui + Tailwind CSS، React Hook Form + Zod، TanStack Query، Zustand (حالة POS المحلية)، Electron 33، Turborepo + pnpm، Recharts
**Storage**: PostgreSQL على Neon (الخادم المركزي)؛ SQLite عبر Prisma (قاعدة محلية للديسكتوب، Offline-first)
**Testing**: Vitest (وحدات منطق الأعمال في packages/core)، Playwright (E2E للويب)، اختبارات عقود API عبر Vitest + supertest-style على Route Handlers
**Target Platform**: متصفحات حديثة (الويب على Vercel)؛ Windows/macOS/Linux (تطبيق Electron)؛ خادم Serverless (Vercel Functions) + Neon
**Project Type**: Monorepo (web + desktop + packages مشتركة)، مع منفذ مستقبلي لتطبيق هاتف
**Performance Goals**: تحميل صفحة المتجر < 3s لـ 100 زائر متزامن (SC-007)؛ إتمام بيعة 3 أصناف وطباعتها < 60s (SC-001)؛ مزامنة فواتير فترة عدم الاتصال خلال < 2 دقيقة (SC-002)
**Constraints**: العمل دون اتصال إلزامي لنقطة البيع (FR-018)؛ دعم RTL/عربي (FR-024)؛ الخادم المركزي مرجع المخزون عند التعارض؛ عدم حذف السجلات المالية صامتًا (FR-025)
**Scale/Scope**: فرع واحد، مئات المنتجات، آلاف الفواتير سنويًا، 6 قصص مستخدم، ~5 شاشات ديسكتوب + متجر عام + لوحة تحكم

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- لا يوجد دستور مُرسَّخ بعد (`.specify/memory/constitution.md` ما زال قالبًا). لذلك تُطبَّق مبادئ هندسية افتراضية: البساطة أولًا (YAGNI)، فصل منطق الأعمال في `packages/core` ليكون قابلًا للاختبار باستقلال، عقود API موثّقة قبل التنفيذ، وعدم تكرار الكود بين المنصات.
- **توصية**: تشغيل `/speckit.constitution` لاحقًا لترسيخ المبادئ (خصوصًا: سياسة الاختبارات، التعامل مع البيانات المالية، وقواعد المزامنة) ثم إعادة فحص هذه البوابة.
- **النتيجة المبدئية**: PASS (لا انتهاكات معروفة؛ التعقيد المعماري مبرَّر في Complexity Tracking أدناه).

## Project Structure

### Documentation (this feature)

```text
specs/001-medic-store-system/
├── plan.md              # هذا الملف (مخرج /speckit.plan)
├── research.md          # قرارات تقنية (Phase 0)
├── data-model.md        # نموذج البيانات والكيانات (Phase 1)
├── quickstart.md        # خطوات الإقلاع للمطوّر (Phase 1)
├── contracts/           # عقود REST API (Phase 1)
│   └── api-overview.md
├── spec.md              # المواصفة
└── tasks.md             # مخرج /speckit.tasks (ليس من /speckit.plan)
```

### Source Code (repository root)

```text
medic/                              # جذر الـ Monorepo (Turborepo + pnpm)
├── apps/
│   ├── web/                        # Next.js 15: REST API + المتجر + لوحة التحكم
│   │   ├── app/
│   │   │   ├── (storefront)/       # المتجر العام: /، /products، /products/[id]، /cart، /checkout
│   │   │   │                        #            + /landing/[id] (صفحة هبوط للمنتج) + /thank-you (عدّاد + تحويل)
│   │   │   ├── (dashboard)/        # لوحة التحكم: /dashboard, /orders, /products, /inventory, /customers, /debts, /reports, /settings
│   │   │   ├── api/                # REST Route Handlers (المصدر الوحيد للحقيقة)
│   │   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── sales/
│   │   │   │   ├── customers/
│   │   │   │   ├── debts/
│   │   │   │   ├── stock-movements/
│   │   │   │   ├── orders/         # إنشاء الطلب (متجر/landing/يدوي) idempotent + الحالة
│   │   │   │   ├── storefront/      # منتجات المتجر + بيانات صفحة الهبوط
│   │   │   │   ├── session/         # كوكي جلسة الزبون (حفظ/قراءة معلوماته)
│   │   │   │   ├── uploads/         # رفع صور/فيديو المنتجات لتخزين الكائنات
│   │   │   │   ├── sync/           # نقاط المزامنة للديسكتوب (push/pull)
│   │   │   │   └── auth/           # Auth.js handlers
│   │   │   └── layout.tsx          # RTL + عربي
│   │   ├── components/
│   │   └── lib/                    # auth.ts, api helpers, query client
│   │
│   └── desktop/                    # تطبيق Electron (نقطة البيع)
│       ├── electron/               # main process + preload + خدمة المزامنة
│       ├── src/                    # واجهة React: الرئيسية، POS، المخزون، دفتر الديون، الإعدادات
│       └── prisma/                 # مخطط SQLite المحلي
│
├── packages/
│   ├── database/                   # مخطط Prisma (PostgreSQL) + Prisma Client المُولَّد
│   │   └── prisma/schema.prisma
│   ├── core/                       # منطق الأعمال + أنواع TS + Zod schemas (مشترك، قابل للاختبار)
│   │   └── src/                    # حساب الفاتورة، قواعد الدين، تسويات المخزون، عقود الـ DTO
│   ├── ui/                         # مكوّنات shadcn/ui المشتركة + إعداد RTL
│   └── api-client/                 # عميل REST موحّد (fetch) تستهلكه الواجهات والديسكتوب والموبايل
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Structure Decision**: Monorepo بـ Turborepo/pnpm مع `apps/web` (يضم REST API + المتجر + لوحة التحكم) و`apps/desktop` (Electron)، وحزم مشتركة `database` و`core` و`ui` و`api-client`. هذا يجعل **الخادم مصدر الحقيقة** ويشارك المخطط والأنواع ومنطق الأعمال بين كل المنصات، ويترك مكانًا جاهزًا لإضافة `apps/mobile` لاحقًا يستهلك نفس `api-client` وعقود REST.

## Complexity Tracking

> يُملأ فقط عند وجود انتهاكات للدستور تتطلب تبريرًا. لا يوجد دستور مُرسَّخ، لكن نوثّق قرارات التعقيد المعماري الواعية:

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Monorepo بعدّة تطبيقات/حزم | مشاركة المخطط والأنواع ومنطق الأعمال بين الويب والديسكتوب (ولاحقًا الموبايل) ومنع تكرار الكود | مستودعات منفصلة تؤدي لتكرار منطق الفاتورة/الدين وانحراف الأنواع بين المنصات |
| قاعدة بيانات محلية + محرّك مزامنة في الديسكتوب | شرط Offline-first لنقطة البيع (FR-018) — المحل يجب ألا يتوقف عند انقطاع الإنترنت | الاعتماد المباشر على الخادم (Online-only) يوقف البيع عند انقطاع الشبكة وهو غير مقبول للنشاط اليومي |
| طبقة `packages/core` منفصلة لمنطق الأعمال | اختبار منطق الحسابات المالية باستقلال وإعادة استخدامه عبر REST والديسكتوب | وضع المنطق داخل كل تطبيق يصعّب الاختبار ويكرر القواعد المالية الحساسة |
