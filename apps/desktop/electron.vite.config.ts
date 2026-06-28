import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { config as loadEnv } from "dotenv";

// قراءة ملف .env من مجلد التطبيق وتضمين القيم وقت البناء
const env = loadEnv({ path: resolve(__dirname, ".env") });
const MEDIC_SERVER_URL = env.parsed?.MEDIC_SERVER_URL ?? "http://localhost:3000";
const SYNC_SECRET = env.parsed?.SYNC_SECRET ?? "dev-sync-secret-change-me";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ["@medic/core", "@medic/api-client"] })],
    define: {
      // تضمين عنوان الخادم ومفتاح المزامنة كثوابت وقت البناء
      "process.env.MEDIC_SERVER_URL": JSON.stringify(MEDIC_SERVER_URL),
      "process.env.SYNC_SECRET": JSON.stringify(SYNC_SECRET),
    },
    build: {
      outDir: "out/main",
      lib: { entry: resolve(__dirname, "src/main/index.ts") },
      rollupOptions: {
        external: [/generated\/prisma/],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ["@medic/core", "@medic/api-client"] })],
    build: {
      outDir: "out/preload",
      lib: { entry: resolve(__dirname, "src/preload/index.ts") },
    },
  },
  renderer: {
    root: resolve(__dirname, "src/renderer"),
    define: {
      // تضمين عنوان الخادم كثابت وقت البناء في واجهة المستخدم
      "import.meta.env.MEDIC_SERVER_URL": JSON.stringify(MEDIC_SERVER_URL),
    },
    build: {
      outDir: resolve(__dirname, "out/renderer"),
      rollupOptions: {
        input: resolve(__dirname, "src/renderer/index.html"),
      },
    },
    plugins: [react()],
  },
});

