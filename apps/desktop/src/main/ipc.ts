import { ipcMain, app } from "electron";
import {
  listLocalProducts,
  findLocalProductByBarcode,
  createLocalSale,
  listLocalSales,
  getLocalSale,
  type PosSaleInput,
  type SalesFilter,
} from "./sales";
import { syncNow, getSyncStatus, testConnection } from "./sync";
import { fetchDebtsFromServer, payCustomerDebtOnServer } from "./debts";
import { readLocalConfig, writeLocalConfig } from "./local-config";
import { config } from "./config";
import { login, logout, getCurrentUser } from "./auth";
import { getDashboardStats } from "./dashboard";
import { fetchCustomers, searchLocalCustomers, fetchCustomerDetail, createCustomer, updateCustomer, deleteCustomer } from "./customers";
import {
  fetchCategoriesFromServer,
  createProductOnServer,
  updateProductOnServer,
  deleteProductOnServer,
  purchaseStockOnServer,
  type ProductCreateInput,
  type ProductUpdateInput,
} from "./products";
import { uploadProductMedia, type UploadFileInput } from "./uploads";

/** يسجّل قنوات IPC التي يستدعيها العرض (renderer). */
export function registerIpc(): void {
  ipcMain.handle("products:list", (_e, query?: string) => listLocalProducts(query));
  ipcMain.handle("products:findByBarcode", (_e, barcode: string) =>
    findLocalProductByBarcode(barcode),
  );
  // الفاتورة تُنسب للمستخدم الفعّال لحظة الإنشاء (FR-047)
  ipcMain.handle("sales:create", (_e, input: PosSaleInput) =>
    createLocalSale(input, getCurrentUser()?.id),
  );
  ipcMain.handle("sales:list", (_e, filter?: SalesFilter) => listLocalSales(filter));
  ipcMain.handle("sales:get", (_e, id: string) => getLocalSale(id));
  ipcMain.handle("sync:now", () => syncNow());
  ipcMain.handle("sync:status", () => getSyncStatus());
  ipcMain.handle("sync:testConnection", (_e, serverUrl: string, syncSecret: string) =>
    testConnection(serverUrl, syncSecret),
  );
  // معلومات التطبيق والنظام (للعرض في الإعدادات)
  ipcMain.handle("app:info", () => ({
    version: app.getVersion(),
    electron: process.versions.electron,
    platform: process.platform,
    userDataPath: app.getPath("userData"),
  }));
  ipcMain.handle("debts:list", (_e, status?: string) => fetchDebtsFromServer(status));
  ipcMain.handle("debts:payCustomer", (_e, customerId: string, amount: number) => payCustomerDebtOnServer(customerId, amount));
  ipcMain.handle("settings:getLocal", () => ({
    serverUrl: config.serverUrl,
    syncSecret: config.syncSecret,
    ...readLocalConfig(),
  }));
  ipcMain.handle("settings:saveLocal", (_e, cfg: { serverUrl?: string; syncSecret?: string }) => {
    writeLocalConfig(cfg);
    return { ok: true };
  });
  // المصادقة (FR-052)
  ipcMain.handle("auth:login", (_e, email: string, password: string) => login(email, password));
  ipcMain.handle("auth:logout", () => {
    logout();
    return { ok: true };
  });
  ipcMain.handle("auth:current", () => getCurrentUser());
  ipcMain.handle("dashboard:stats", () => getDashboardStats());
  // الزبائن (تتطلب اتصالًا)
  ipcMain.handle("customers:list",   (_e, q?: string) => fetchCustomers(q));
  ipcMain.handle("customers:searchLocal", (_e, q?: string) => searchLocalCustomers(q));
  ipcMain.handle("customers:detail", (_e, id: string) => fetchCustomerDetail(id));
  ipcMain.handle("customers:create", (_e, name: string, phone?: string, address?: string) => createCustomer(name, phone, address));
  ipcMain.handle("customers:update", (_e, id: string, name: string, phone?: string, address?: string) => updateCustomer(id, name, phone, address));
  ipcMain.handle("customers:delete", (_e, id: string) => deleteCustomer(id));
  // إدارة المخزون عبر web API (ADMIN فقط)
  ipcMain.handle("categories:list", () => fetchCategoriesFromServer());
  ipcMain.handle("products:create", (_e, input: ProductCreateInput) => createProductOnServer(input));
  ipcMain.handle("products:update", (_e, id: string, input: ProductUpdateInput) => updateProductOnServer(id, input));
  ipcMain.handle("products:delete", (_e, id: string) => deleteProductOnServer(id));
  ipcMain.handle("products:purchase", (_e, productId: string, quantity: number, costPrice: number) =>
    purchaseStockOnServer(productId, quantity, costPrice),
  );
  // رفع صور/فيديو المنتجات (ADMIN، أونلاين) عبر نقطة /api/uploads
  ipcMain.handle("uploads:media", (_e, kind: "image" | "video", files: UploadFileInput[]) =>
    uploadProductMedia(kind, files),
  );
}
