import { getToken, clearToken } from "./secure";
import { getServerUrl } from "./server";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let onUnauthorized: (() => void) | null = null;

/** يُسجّل معالجًا يُستدعى عند 401 (إعادة التوجيه لتسجيل الدخول) — FR-038. */
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

/**
 * طلب موثّق للـ REST API المركزي (Bearer JWT).
 * يبني العنوان من إعداد الخادم ويُرفق التوكن تلقائيًا؛ يعالج 401 بمسح التوكن.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const [baseUrl, token] = await Promise.all([getServerUrl(), getToken()]);
  const res = await fetch(`${baseUrl}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401) {
    await clearToken();
    onUnauthorized?.();
    throw new ApiError(401, "انتهت الجلسة، يرجى تسجيل الدخول من جديد");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new ApiError(res.status, body?.error?.message ?? `خطأ ${res.status}`);
  }

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    apiRequest<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

export interface PickedFile {
  uri: string;
  name: string;
  type: string;
}

/**
 * يرفع وسائط المنتج (صور/فيديو) عبر `POST /api/uploads` (multipart + Bearer JWT).
 * نترك fetch يضبط ترويسة multipart/boundary تلقائيًا (لا نضع Content-Type).
 */
export async function uploadMedia(kind: "image" | "video", files: PickedFile[]): Promise<string[]> {
  const [baseUrl, token] = await Promise.all([getServerUrl(), getToken()]);
  const form = new FormData();
  form.append("kind", kind);
  for (const f of files) {
    // في React Native يُمرّر الملف ككائن { uri, name, type }
    form.append("files", { uri: f.uri, name: f.name, type: f.type } as unknown as Blob);
  }
  const res = await fetch(`${baseUrl}/api/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (res.status === 401) {
    await clearToken();
    onUnauthorized?.();
    throw new ApiError(401, "انتهت الجلسة، يرجى تسجيل الدخول من جديد");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new ApiError(res.status, body?.error?.message ?? `تعذّر رفع الملف (${res.status})`);
  }
  const data = (await res.json()) as { urls: string[] };
  return data.urls;
}
