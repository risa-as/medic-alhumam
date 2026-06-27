/**
 * ينسخ ملفات محرك Prisma (engine binaries) من مجلد التوليد المخصص
 * في packages/database إلى مجلد .prisma/client داخل apps/web
 * حتى يتمكن Vercel من إيجادها في حزمة الـ Serverless Function.
 */
const fs = require("fs");
const path = require("path");

const generatedDir = path.resolve(__dirname, "../../../packages/database/src/generated/client");
const targetDir = path.resolve(__dirname, "../.prisma/client");

if (!fs.existsSync(generatedDir)) {
  console.log("⚠ Generated client dir not found, skipping engine copy.");
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(generatedDir);
let copied = 0;

for (const file of files) {
  // نسخ ملفات المحرك الثنائية + schema + ملفات التعريف
  if (
    file.includes("engine") ||
    file.includes("libquery") ||
    file === "schema.prisma" ||
    file.endsWith(".d.ts") ||
    file.endsWith(".js") ||
    file.endsWith(".mjs") ||
    file.endsWith(".cjs")
  ) {
    const src = path.join(generatedDir, file);
    const dst = path.join(targetDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dst);
      copied++;
    }
  }
}

console.log(`✔ Copied ${copied} Prisma client files to ${targetDir}`);
