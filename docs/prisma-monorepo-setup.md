# كيف نُنظّم Prisma داخل monorepo — بنية مشروع medic

هذا الدليل يشرح **البنية الفعلية المعتمدة في مشروعنا** (monorepo باسم `medic`)، ليتمكّن
مساعد ذكي يعمل على نظام آخر (هو أيضًا monorepo) من بناء نفس البنية بالضبط.

> ملاحظة مهمة: لا تعتمد على افتراض "كل تطبيق يحمل Prisma خاصته". هذا غير دقيق.
> بنيتنا **هجينة**: حزمة قاعدة بيانات مشتركة + Prisma محلي داخل تطبيق واحد فقط.

---

## 1) الفكرة الجوهرية

عندنا **مصدرا بيانات مختلفان**، فلكلٍّ منهما معاملة مختلفة:

| الطبقة | قاعدة البيانات | أين يعيش Prisma | من يستهلكه |
|--------|----------------|------------------|------------|
| الخادم المركزي | PostgreSQL (Neon) | **حزمة مشتركة** `packages/database` | `apps/web` (وأي مستهلك خادمي) عبر `workspace:*` |
| سطح المكتب | SQLite محلي (offline-first) | **داخل التطبيق** `apps/desktop/prisma` | `apps/desktop` فقط |

القاعدة العملية لاتخاذ القرار في أي نظام:

- **تطبيقات تتشارك نفس قاعدة البيانات** ⇐ ضَع Prisma في **حزمة مشتركة** واحدة يستوردها الجميع
  (مصدر حقيقة واحد للمخطط وللمايقريشن وللعميل المولَّد).
- **تطبيق له قاعدة بيانات مختلفة جذريًّا/دورة حياة مختلفة** (مثل SQLite محلي للديسكتوب)
  ⇐ أعطِه **Prisma محليًّا داخله** لأنه لا معنى لمشاركته مخططًا مع البقية.

> الجذر **لا يحتوي** على Prisma إطلاقًا (لا اعتماد، لا schema). الجذر فقط ينسّق ويفوّض.

---

## 2) إعداد الـ workspace في الجذر

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`.npmrc`:
```ini
auto-install-peers=true
strict-peer-dependencies=false
```

`package.json` (الجذر) — **بلا Prisma**، فقط أدوات البناء + سكربتات تفويض:
```json
{
  "name": "medic",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "db:generate": "pnpm --filter @medic/database generate",
    "db:migrate": "pnpm --filter @medic/database migrate",
    "db:seed": "pnpm --filter @medic/database seed"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "^5.6.3"
  },
  "engines": { "node": ">=20" }
}
```

`turbo.json` — مهم: مرِّر متغيّرات البيئة الخاصة بقاعدة البيانات في `globalEnv`،
واجعل مهمّة التوليد بلا كاش:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalEnv": ["DATABASE_URL", "DATABASE_URL_UNPOOLED", "NODE_ENV"],
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**", "out/**"] },
    "dev": { "cache": false, "persistent": true },
    "generate": { "cache": false }
  }
}
```

---

## 3) الحزمة المشتركة: `packages/database` (قلب البنية)

شجرة الملفات:
```
packages/database/
├── .env                      # DATABASE_URL + DATABASE_URL_UNPOOLED (سرّية)
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma         # مخطط PostgreSQL الوحيد
│   ├── seed.ts               # بيانات أولية (tsx)
│   └── migrations/           # تاريخ المايقريشن (يُلتزَم في Git)
│       ├── 20260529151148_init/migration.sql
│       ├── ...
│       └── migration_lock.toml   # provider = "postgresql"
└── src/
    ├── index.ts              # نقطة الدخول: Singleton + إعادة تصدير
    └── generated/client/     # عميل Prisma المولَّد (output مخصّص هنا)
```

### `packages/database/package.json`
الحزمة تُصدِّر TypeScript خامًا (`src/index.ts`) بلا خطوة build — يستهلكها الـ workspace مباشرة:
```json
{
  "name": "@medic/database",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": {
    "generate": "prisma generate",
    "migrate": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio",
    "seed": "tsx prisma/seed.ts",
    "validate": "prisma validate"
  },
  "prisma": { "seed": "tsx prisma/seed.ts" },
  "dependencies": { "@prisma/client": "^6.1.0" },
  "devDependencies": {
    "prisma": "^6.1.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

### `packages/database/prisma/schema.prisma`
النقطة الحاسمة: **`output` يوجّه العميل المولَّد إلى داخل الحزمة** (`../src/generated/client`)
حتى يستورده المستهلكون عبر اسم الحزمة لا عبر مسار `node_modules`:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")   // اتصال مباشر (unpooled) للأدوات المحلية
}

// ... النماذج والـ enums هنا
```

### `packages/database/src/index.ts`
نمط Singleton لمنع تعدّد الاتصالات في وضع التطوير، **مع إعادة تصدير كل شيء** —
فيحصل المستهلك على نسخة `prisma` وكل الأنواع/الـ enums من استيراد واحد:
```ts
import { PrismaClient } from "./generated/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "./generated/client"; // الأنواع + الـ enums متاحة من "@medic/database"
```

### `packages/database/.env`
الملف السرّي يعيش **داخل الحزمة** (لأن Prisma CLI يُنفَّذ من سياقها)، لا في الجذر:
```ini
DATABASE_URL="postgresql://...neon..."          # عبر الـ pooler
DATABASE_URL_UNPOOLED="postgresql://...neon..." # مباشر، للأدوات المحلية
```

---

## 4) كيف يستهلك تطبيق الويب الحزمة المشتركة

`apps/web/package.json` — **لا schema ولا اعتماد على prisma**، فقط الحزمة:
```json
{
  "name": "@medic/web",
  "dependencies": {
    "@medic/database": "workspace:*",
    "next": "^15.1.2"
  }
}
```

داخل الكود، استيراد واحد يكفي لكل شيء:
```ts
import { prisma, Role, PaymentType } from "@medic/database";

const users = await prisma.user.findMany();
```

---

## 5) التطبيق ذو القاعدة المختلفة: `apps/desktop` (Prisma محلي)

لأن الديسكتوب يعمل offline على SQLite، يحمل Prisma **خاصته** ولا يلمس `@medic/database`:

`apps/desktop/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"   // عميل افتراضي محلي للتطبيق
}

datasource db {
  provider = "sqlite"
  url      = "file:./medic-local.db"
}

// نماذج محلية: مرآة منتجات + فواتير محلية + طابور مزامنة ...
```

`apps/desktop/package.json` — يحمل `prisma` و`@prisma/client` كاعتمادات خاصة به:
```json
{
  "name": "@medic/desktop",
  "dependencies": { "@prisma/client": "^6.1.0" },
  "devDependencies": { "prisma": "^6.1.0" }
}
```

> الموبايل (`apps/mobile`, Expo) لا يستخدم Prisma إطلاقًا — يتحدث مع الويب عبر API client.
> فليس كل تطبيق يحتاج Prisma؛ فقط من يصل لقاعدة بيانات مباشرةً.

---

## 6) كيف تُنفَّذ الأوامر (جوهر اختلاف الـ monorepo)

بما أن Prisma ليس في الجذر، فإن `pnpm prisma ...` من الجذر **يفشل**. الطرق الصحيحة:

```bash
# للقاعدة المشتركة (PostgreSQL) — عبر الفلتر باسم الحزمة:
pnpm --filter @medic/database generate
pnpm --filter @medic/database migrate          # = prisma migrate dev
pnpm --filter @medic/database migrate:deploy   # للإنتاج
pnpm --filter @medic/database studio
pnpm --filter @medic/database seed

# أو ادخل مجلد الحزمة ونفّذ مباشرة:
cd packages/database && pnpm prisma migrate deploy
```

ولمسة التوحيد (اختياري لكن مستحسن) — سكربتات في الجذر تفوّض، فتحصل على "أمر واحد":
```bash
pnpm db:generate   # ⇒ pnpm --filter @medic/database generate
pnpm db:migrate
pnpm db:seed
```

> اسم الفلتر = حقل `name` في `package.json` للحزمة/التطبيق (هنا `@medic/database`).

---

## 7) الخلاصة في أسطر

1. الجذر بلا Prisma — فقط workspace + turbo + سكربتات تفويض.
2. قاعدة مشتركة بين عدّة تطبيقات ⇐ **حزمة واحدة** `packages/<db>` فيها:
   `schema.prisma` (بـ `output` إلى `src/generated/client`) + `migrations/` + `.env` + `seed`
   + `src/index.ts` يصدّر Singleton `prisma` **و** `export *` للأنواع.
3. المستهلكون يضيفونها كـ `"@your/database": "workspace:*"` ويستوردون من اسم الحزمة.
4. تطبيق بقاعدة مختلفة جذريًّا (SQLite محلي) ⇐ Prisma خاص به داخل التطبيق.
5. نفّذ أوامر Prisma عبر `pnpm --filter <name> ...` أو من داخل مجلد الحزمة.
