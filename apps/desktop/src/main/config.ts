// إعدادات الاتصال بالخادم.
// process.env.MEDIC_SERVER_URL تُستبدل بقيمتها الحرفية وقت البناء عبر Vite define.
// القيمة تأتي من ملف .env في apps/desktop/.env
const BUILT_IN_SERVER_URL = process.env.MEDIC_SERVER_URL ?? "http://localhost:3000";
const BUILT_IN_SYNC_SECRET = process.env.SYNC_SECRET ?? "dev-sync-secret-change-me";

export const config = {
  serverUrl: BUILT_IN_SERVER_URL,
  syncSecret: BUILT_IN_SYNC_SECRET,
};

export const apiBaseUrl = `${config.serverUrl}/api`;
