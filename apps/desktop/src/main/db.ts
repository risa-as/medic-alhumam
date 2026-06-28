import { app } from "electron";
import * as path from "path";
import { PrismaClient } from "../../generated/prisma";

// قاعدة البيانات المحلية تُخزَّن في مجلد بيانات المستخدم (قابل للكتابة)
// مثال: C:\Users\...\AppData\Roaming\@medic\desktop\medic-local.db
const dbPath = path.join(app.getPath("userData"), "medic-local.db");
process.env.DATABASE_URL = `file:${dbPath}`;

export const db = new PrismaClient({
  datasources: {
    db: { url: `file:${dbPath}` },
  },
});
