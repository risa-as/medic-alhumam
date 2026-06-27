/** جلب JSON من نقاط الـ API مع تمرير كوكي الجلسة ومعالجة الأخطاء. */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "include",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(body?.error?.message ?? `خطأ ${res.status}`);
  }
  return (await res.json()) as T;
}
