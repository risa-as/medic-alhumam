// إعدادات الاتصال بالخادم (تُقرأ من البيئة مع قيم افتراضية للتطوير).
export const config = {
  serverUrl: process.env.MEDIC_SERVER_URL ?? "http://localhost:3000",
  syncSecret: process.env.SYNC_SECRET ?? "dev-sync-secret-change-me",
};

export const apiBaseUrl = `${config.serverUrl}/api`;
