import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@medic/ui", "@medic/core", "@medic/api-client", "@medic/database"],
  images: {
    // مضيفو UploadThing: الصيغة الجديدة <appId>.ufs.sh والقديمة utfs.io
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
