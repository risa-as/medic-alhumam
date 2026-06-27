// عميل REST موحّد تستهلكه الواجهات والديسكتوب (ولاحقًا الموبايل).
// تُضاف دوال الموارد (products, sales, orders...) في المراحل اللاحقة.

// إعادة تصدير الأنواع والمخططات المشتركة من core لاستخدامها على طرف العميل.
export * from "@medic/core";
export * from "./resources";

export interface ApiClientOptions {
  /** أساس عنوان الـ API، مثل http://localhost:3000/api */
  baseUrl: string;
  /** ترويسات افتراضية (مثل التفويض). */
  headers?: Record<string, string>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.options.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...this.options.headers,
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: ApiError } | null;
      throw Object.assign(new Error(body?.error?.message ?? res.statusText), {
        status: res.status,
        error: body?.error,
      });
    }

    return (await res.json()) as T;
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export function createApiClient(options: ApiClientOptions) {
  return new ApiClient(options);
}
