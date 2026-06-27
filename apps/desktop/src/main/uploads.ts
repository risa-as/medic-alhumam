import { apiBaseUrl } from "./config";
import { getCurrentUser } from "./auth";

/** ملف وارد من العرض (renderer) لرفعه: الاسم + نوع MIME + بايتاته. */
export interface UploadFileInput {
  name: string;
  type: string;
  data: ArrayBuffer | Uint8Array;
}

async function apiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: { message?: string } };
    return body.error?.message ?? `خطأ ${res.status}`;
  } catch {
    return `خطأ ${res.status}`;
  }
}

/**
 * يرفع صور/فيديو المنتجات عبر نقطة الويب `POST /api/uploads` (مصادقة Bearer).
 * يُرجع روابط الملفات المرفوعة. يعمل أونلاين فقط (يتطلب توكن تسجيل دخول أونلاين).
 */
export async function uploadProductMedia(
  kind: "image" | "video",
  files: UploadFileInput[],
): Promise<string[]> {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("رفع الوسائط يتطلب اتصالًا بالإنترنت — يُرجى تسجيل الدخول أونلاين");
  if (!files.length) return [];

  const form = new FormData();
  form.set("kind", kind);
  for (const f of files) {
    const part = (f.data instanceof Uint8Array
      ? f.data.buffer.slice(f.data.byteOffset, f.data.byteOffset + f.data.byteLength)
      : f.data) as ArrayBuffer;
    form.append("files", new Blob([part], { type: f.type }), f.name);
  }

  // لا نضبط Content-Type يدويًا: fetch يضيف حدود multipart تلقائيًا.
  const res = await fetch(`${apiBaseUrl}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${user.token}` },
    body: form,
  });
  if (!res.ok) throw new Error(await apiError(res));
  const data = (await res.json()) as { urls: string[] };
  return data.urls;
}
