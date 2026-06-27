import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { ApiError, handleRoute } from "@/lib/api";
import { requireRole } from "@/lib/rbac";

/**
 * نقطة رفع وسائط المنتجات للعملاء غير-المتصفح (الديسكتوب/الهاتف) عبر `Authorization: Bearer`.
 * المتصفح يرفع مباشرةً عبر `/api/uploadthing` (جلسة كوكي)، أمّا الديسكتوب فلا يملك كوكيز
 * فيرفع هنا: نتحقق من الدور (ADMIN) عبر dual-auth ثم نرفع بـ UTApi (يقرأ UPLOADTHING_TOKEN من البيئة).
 */
const utapi = new UTApi();

const LIMITS = {
  image: { maxSize: 8 * 1024 * 1024, maxCount: 5, prefix: "image/", label: "صورة" },
  video: { maxSize: 64 * 1024 * 1024, maxCount: 1, prefix: "video/", label: "فيديو" },
} as const;

export function POST(req: Request) {
  return handleRoute(async () => {
    await requireRole("ADMIN");

    const form = await req.formData();
    const kind = String(form.get("kind") ?? "");
    const limit = LIMITS[kind as keyof typeof LIMITS];
    if (!limit) throw new ApiError(400, "BAD_KIND", "نوع وسائط غير مدعوم");

    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) throw new ApiError(400, "NO_FILES", "لا توجد ملفات للرفع");
    if (files.length > limit.maxCount)
      throw new ApiError(400, "TOO_MANY", `الحد الأقصى ${limit.maxCount} ${limit.label}`);

    for (const f of files) {
      if (!f.type.startsWith(limit.prefix))
        throw new ApiError(400, "BAD_TYPE", `الملف "${f.name}" ليس ${limit.label} صالحة`);
      if (f.size > limit.maxSize)
        throw new ApiError(400, "TOO_LARGE", `الملف "${f.name}" يتجاوز الحجم المسموح`);
    }

    const results = await utapi.uploadFiles(files);
    const urls = results.map((r) => {
      if (r.error || !r.data) throw new ApiError(502, "UPLOAD_FAILED", r.error?.message ?? "فشل رفع الملف");
      return r.data.ufsUrl;
    });

    return NextResponse.json({ urls });
  });
}
