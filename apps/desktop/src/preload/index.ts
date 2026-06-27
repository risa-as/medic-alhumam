import { contextBridge, ipcRenderer } from "electron";

const api = {
  listProducts: (query?: string) => ipcRenderer.invoke("products:list", query),
  findProductByBarcode: (barcode: string) =>
    ipcRenderer.invoke("products:findByBarcode", barcode),
  createSale: (input: unknown) => ipcRenderer.invoke("sales:create", input),
  listSales: (filter?: unknown) => ipcRenderer.invoke("sales:list", filter),
  getSale: (id: string) => ipcRenderer.invoke("sales:get", id),
  syncNow: () => ipcRenderer.invoke("sync:now"),
  syncStatus: () => ipcRenderer.invoke("sync:status"),
  testConnection: (serverUrl: string, syncSecret: string) =>
    ipcRenderer.invoke("sync:testConnection", serverUrl, syncSecret),
  appInfo: () => ipcRenderer.invoke("app:info"),
  listDebts: (status?: string) => ipcRenderer.invoke("debts:list", status),
  payCustomerDebt: (customerId: string, amount: number) => ipcRenderer.invoke("debts:payCustomer", customerId, amount),
  getLocalSettings: () => ipcRenderer.invoke("settings:getLocal"),
  saveLocalSettings: (cfg: { serverUrl?: string; syncSecret?: string }) =>
    ipcRenderer.invoke("settings:saveLocal", cfg),
  login: (email: string, password: string) => ipcRenderer.invoke("auth:login", email, password),
  logout: () => ipcRenderer.invoke("auth:logout"),
  currentUser: () => ipcRenderer.invoke("auth:current"),
  getDashboardStats: () => ipcRenderer.invoke("dashboard:stats"),
  // الزبائن
  listCustomers:        (q?: string)                       => ipcRenderer.invoke("customers:list", q),
  searchLocalCustomers: (q?: string)                       => ipcRenderer.invoke("customers:searchLocal", q),
  getCustomerDetail:    (id: string)                       => ipcRenderer.invoke("customers:detail", id),
  createCustomer:       (name: string, phone?: string, address?: string)            => ipcRenderer.invoke("customers:create", name, phone, address),
  updateCustomer:       (id: string, name: string, phone?: string, address?: string) => ipcRenderer.invoke("customers:update", id, name, phone, address),
  deleteCustomer:       (id: string)                       => ipcRenderer.invoke("customers:delete", id),
  // إدارة المخزون (تتطلب اتصالًا + دور ADMIN)
  listCategories: () => ipcRenderer.invoke("categories:list"),
  createProduct: (input: unknown) => ipcRenderer.invoke("products:create", input),
  updateProduct: (id: string, input: unknown) => ipcRenderer.invoke("products:update", id, input),
  deleteProduct: (id: string) => ipcRenderer.invoke("products:delete", id),
  purchaseStock: (productId: string, quantity: number, costPrice: number) =>
    ipcRenderer.invoke("products:purchase", productId, quantity, costPrice),
  uploadProductMedia: (
    kind: "image" | "video",
    files: { name: string; type: string; data: ArrayBuffer }[],
  ) => ipcRenderer.invoke("uploads:media", kind, files),
};

contextBridge.exposeInMainWorld("medic", api);

export type MedicApi = typeof api;
