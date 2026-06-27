import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // جذر تتبّع الملفات: يخبر Next.js أن جذر المشروع هو مجلد الـ Monorepo
  // وليس مجلد apps/web فقط، ليشمل ملفات Prisma engine من packages/database
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@medic/ui", "@medic/core", "@medic/api-client", "@medic/database"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ufs.sh", pathname: "/**" },
      { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  outputFileTracingIncludes: {
    "/*": ["../../packages/database/src/generated/client/**/*"],
  },
};

export default nextConfig;
