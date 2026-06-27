# تطبيق الهاتف — متجر المستلزمات الطبية

تطبيق React Native (Expo + Expo Router) يستهلك نفس REST API المركزي عبر JWT.

## المتطلبات

- Node.js 22، pnpm، حساب Expo (لـ EAS Build)
- جهاز Android/iOS أو محاكي + تطبيق **Expo Go** (للتطوير السريع) أو Development Build

## التشغيل (تطوير)

```bash
# من جذر المونوريبو
pnpm install

# تشغيل خادم التطوير
pnpm --filter @medic/mobile start
# ثم امسح رمز QR بتطبيق Expo Go، أو اضغط a (أندرويد) / i (iOS)
```

> **مهم**: اضبط عنوان الخادم من شاشة **الإعدادات** داخل التطبيق إلى عنوان IP الخاص بجهاز الخادم
> (مثل `http://192.168.1.10:3000`) — `localhost` لا يصل من الهاتف. القيمة الافتراضية في `app.json > extra.defaultServerUrl`.

## المصادقة

- تسجيل الدخول عبر `POST /api/auth/token` → يُخزَّن JWT في `expo-secure-store`.
- يُرسَل التوكن في ترويسة `Authorization: Bearer` لكل طلب.
- عند 401 (انتهاء الجلسة) يُمسح التوكن ويُعاد التوجيه لتسجيل الدخول.

## الصلاحيات (حسب الدور)

| الصفحة | CASHIER | ADMIN |
|---|---|---|
| الرئيسية (مبيعاتي اليوم) | ✅ | ✅ (+ مؤشرات المتجر) |
| نقطة البيع (online) | ✅ | ✅ |
| المخزون (بلا سعر الشراء) | ✅ | ✅ (+ سعر الشراء) |
| الإعدادات | ✅ | ✅ |
| التقارير | ❌ | ✅ |
| التنبيهات | ❌ | ✅ |

> `costPrice` يُفلتر على **الخادم** (FR-041)، فلا يصل للموظف أصلًا.

## البناء (APK تجريبي)

```bash
npm i -g eas-cli
eas login
eas build --profile preview --platform android
# عدّل EXPO_PUBLIC_DEFAULT_SERVER_URL في eas.json إلى عنوان الخادم الإنتاجي
```

## ملاحظات

- **online-only** — لا تخزين محلي/offline على الهاتف (بخلاف الديسكتوب).
- التقارير تستخدم أشرطة View بسيطة (بلا مكتبة رسوم native) لتقليل التبعيات.
