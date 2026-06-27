/**
 * ينسخ ملفات محرك Prisma (engine binaries) من مجلد التوليد المخصص
 * في packages/database إلى مجلد src/generated/client داخل apps/web
 * حتى يتمكن Prisma من إيجادها في حزمة Vercel Serverless Function.
 *
 * Prisma يبحث في /var/task/apps/web/src/generated/client وهو داخل Root Directory
 */
const fs = require("fs");
const path = require("path");

const generatedDir = path.resolve(__dirname, "../../../packages/database/src/generated/client");
const targetDir = path.resolve(__dirname, "../src/generated/client");

if (!fs.existsSync(generatedDir)) {
  console.log("⚠ Generated client dir not found at:", generatedDir);
  console.log("  Listing parent:", path.dirname(generatedDir));
  try {
    console.log("  Contents:", fs.readdirSync(path.dirname(generatedDir)));
  } catch (e) {
    console.log("  Parent does not exist either.");
  }
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(generatedDir);
let copied = 0;

for (const file of files) {
  const src = path.join(generatedDir, file);
  const dst = path.join(targetDir, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dst);
    copied++;
  }
}

console.log(`✔ Copied ${copied} Prisma client files from ${generatedDir}`);
console.log(`  → to ${targetDir}`);
console.log(`  Engine files:`, files.filter(f => f.includes("engine") || f.includes("libquery")));
