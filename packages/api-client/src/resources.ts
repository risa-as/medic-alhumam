import type { ApiClient } from "./index";
import type {
  SaleCreateInput,
  SaleSyncEvent,
  ProductCreateInput,
  ProductUpdateInput,
  CategoryCreateInput,
  StockMovementCreateInput,
  CustomerCreateInput,
  OrderCreateInput,
  CustomerSession,
} from "@medic/core";

/** دوال المتجر العام (بدون مصادقة). */
export function storefrontApi(client: ApiClient) {
  return {
    listProducts: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return client.get<{ data: unknown[] }>(`/storefront/products${qs}`);
    },
    getProduct: (id: string) => client.get<unknown>(`/storefront/products/${id}`),
  };
}

/** دوال الطلبات. */
export function ordersApi(client: ApiClient) {
  return {
    create: (input: OrderCreateInput) => client.post<unknown>("/orders", input),
    list: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return client.get<{ data: unknown[] }>(`/orders${qs}`);
    },
  };
}

/** دوال جلسة الزبون (كوكي). */
export function sessionApi(client: ApiClient) {
  return {
    get: () => client.get<CustomerSession | null>("/session/customer"),
    save: (data: CustomerSession) => client.post<{ ok: boolean }>("/session/customer", data),
    clear: () => client.delete<{ ok: boolean }>("/session/customer"),
  };
}

/** دوال الطلبات الكاملة (تشمل الإدارة). */
export function ordersFullApi(client: ApiClient) {
  return {
    list: (params?: { source?: string; status?: string }) => {
      const qs = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
      return client.get<{ data: unknown[] }>(`/orders${qs}`);
    },
    get: (id: string) => client.get<unknown>(`/orders/${id}`),
    create: (input: OrderCreateInput) => client.post<unknown>("/orders", input),
    updateStatus: (id: string, status: string) =>
      client.patch<unknown>(`/orders/${id}/status`, { status }),
  };
}

/** دوال موارد الزبائن والديون. */
export function customersApi(client: ApiClient) {
  return {
    list: (q?: string) =>
      client.get<{ data: unknown[] }>(`/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    get: (id: string) => client.get<unknown>(`/customers/${id}`),
    create: (input: CustomerCreateInput) => client.post<unknown>("/customers", input),
  };
}

export function debtsApi(client: ApiClient) {
  return {
    list: (status?: "OPEN" | "PARTIAL" | "PAID") =>
      client.get<{
        data: unknown[];
        totalAmount: number;
        totalPaid: number;
        totalRemaining: number;
      }>(`/debts${status ? `?status=${status}` : ""}`),
    pay: (id: string, amount: number) =>
      client.post<unknown>(`/debts/${id}/payments`, { amount }),
  };
}

/** دوال موارد المنتجات والفئات والمخزون. */
export function catalogApi(client: ApiClient) {
  return {
    listProducts: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
      return client.get<{ data: unknown[] }>(`/products${qs}`);
    },
    getProduct: (id: string) => client.get<unknown>(`/products/${id}`),
    createProduct: (input: ProductCreateInput) => client.post<unknown>("/products", input),
    updateProduct: (id: string, input: ProductUpdateInput) =>
      client.patch<unknown>(`/products/${id}`, input),
    deleteProduct: (id: string) => client.delete<{ ok: boolean }>(`/products/${id}`),

    listCategories: () => client.get<{ data: unknown[] }>("/categories"),
    createCategory: (input: CategoryCreateInput) => client.post<unknown>("/categories", input),

    listMovements: (productId?: string) =>
      client.get<{ data: unknown[] }>(`/stock-movements${productId ? `?productId=${productId}` : ""}`),
    createMovement: (input: StockMovementCreateInput) =>
      client.post<unknown>("/stock-movements", input),

    alerts: () => client.get<{ data: unknown[] }>("/inventory/alerts"),
  };
}

/** دوال موارد البيع. */
export function salesApi(client: ApiClient) {
  return {
    create: (input: SaleCreateInput & { customerName?: string; customerPhone?: string }) =>
      client.post<unknown>("/sales", input),
    list: () => client.get<{ data: unknown[] }>("/sales"),
    get: (id: string) => client.get<unknown>(`/sales/${id}`),
  };
}

/** دوال موارد المزامنة (يستخدمها تطبيق سطح المكتب). */
export function syncApi(client: ApiClient) {
  return {
    push: (events: SaleSyncEvent[]) =>
      client.post<{ results: Array<{ clientEventId: string; status: string; saleId?: string }> }>(
        "/sync/push",
        { events },
      ),
    pull: (since?: string) =>
      client.get<{
        serverTime: string;
        products: Array<{
          id: string;
          nameAr: string;
          sku: string;
          salePrice: number;
          quantity: number;
          minQuantity: number;
          isOnline: boolean;
          updatedAt: string;
        }>;
      }>(`/sync/pull${since ? `?since=${encodeURIComponent(since)}` : ""}`),
  };
}
