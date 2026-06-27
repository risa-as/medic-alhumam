import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const SERVER_KEY = "medic_server_url";

/** IP جهاز التطوير من مضيف Metro (Expo Go) — مثل "192.168.0.172" من "192.168.0.172:8081". */
function devHostFromMetro(): string | null {
  const c = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    expoGoConfig?: { debuggerHost?: string };
  };
  const hostUri = c.expoConfig?.hostUri ?? c.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(":")[0]?.trim();
  return host && host !== "localhost" && host !== "127.0.0.1" ? host : null;
}

function defaultServerUrl(): string {
  // 1) من ملف .env — EXPO_PUBLIC_API_URL هو عنوان الـ API الكامل (بدّل بين الخادمين من هناك).
  //    قد يتضمّن "/api"؛ نُزيلها هنا لأن طبقة الطلب (lib/api) تُلحق "/api" تلقائيًّا.
  const env = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (env) return env.replace(/\/+$/, "").replace(/\/api$/, "");

  // 2) التطوير في Expo Go بلا .env: اشتقّ IP جهاز التطوير من مضيف Metro
  //    حتى يصل الهاتف إلى خادم الويب عبر الشبكة المحلية ("localhost" على الهاتف = الهاتف نفسه).
  const host = devHostFromMetro();
  if (host) return `http://${host}:3000`;

  // 3) حلّ أخير: إعداد app.json أو localhost.
  return (Constants.expoConfig?.extra?.defaultServerUrl as string) ?? "http://localhost:3000";
}

/** عنوان الخادم المركزي القابل للضبط من الإعدادات. */
export async function getServerUrl(): Promise<string> {
  const saved = await AsyncStorage.getItem(SERVER_KEY);
  return saved ?? defaultServerUrl();
}

export async function setServerUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(SERVER_KEY, url.replace(/\/$/, ""));
}
