import { app, BrowserWindow } from "electron";
import { join } from "path";
import { registerIpc } from "./ipc";
import { startSyncLoop } from "./sync";
import { restoreSession } from "./auth";
import { db } from "./db";

/**
 * ينشئ جداول SQLite مباشرةً عبر SQL إذا لم تكن موجودة.
 * هذا أكثر موثوقية من prisma migrate في تطبيقات Electron المحزومة
 * لأنه لا يعتمد على prisma CLI binary.
 */
async function initDatabase(): Promise<void> {
  try {
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LocalProduct" (
        "id"          TEXT NOT NULL PRIMARY KEY,
        "nameAr"      TEXT NOT NULL,
        "sku"         TEXT NOT NULL UNIQUE,
        "salePrice"   REAL NOT NULL,
        "quantity"    INTEGER NOT NULL DEFAULT 0,
        "minQuantity" INTEGER NOT NULL DEFAULT 0,
        "isOnline"    INTEGER NOT NULL DEFAULT 0,
        "updatedAt"   TEXT NOT NULL
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LocalUser" (
        "id"           TEXT NOT NULL PRIMARY KEY,
        "name"         TEXT NOT NULL,
        "email"        TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "role"         TEXT NOT NULL,
        "updatedAt"    TEXT NOT NULL
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LocalCustomer" (
        "id"        TEXT NOT NULL PRIMARY KEY,
        "name"      TEXT NOT NULL,
        "phone"     TEXT,
        "address"   TEXT,
        "balance"   REAL NOT NULL DEFAULT 0,
        "updatedAt" TEXT NOT NULL
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LocalSale" (
        "id"            TEXT NOT NULL PRIMARY KEY,
        "clientEventId" TEXT NOT NULL UNIQUE,
        "invoiceNo"     TEXT NOT NULL,
        "userId"        TEXT,
        "customerName"  TEXT,
        "customerPhone" TEXT,
        "subtotal"      REAL NOT NULL,
        "discount"      REAL NOT NULL DEFAULT 0,
        "total"         REAL NOT NULL,
        "paid"          REAL NOT NULL DEFAULT 0,
        "remaining"     REAL NOT NULL DEFAULT 0,
        "paymentType"   TEXT NOT NULL,
        "priceEdited"   INTEGER NOT NULL DEFAULT 0,
        "synced"        INTEGER NOT NULL DEFAULT 0,
        "createdAt"     TEXT NOT NULL
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LocalSaleItem" (
        "id"           TEXT NOT NULL PRIMARY KEY,
        "saleId"       TEXT NOT NULL,
        "productId"    TEXT NOT NULL,
        "nameAr"       TEXT NOT NULL,
        "quantity"     INTEGER NOT NULL,
        "unitPrice"    REAL NOT NULL,
        "lineDiscount" REAL NOT NULL DEFAULT 0,
        "lineTotal"    REAL NOT NULL,
        FOREIGN KEY ("saleId") REFERENCES "LocalSale"("id") ON DELETE CASCADE
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SyncQueueItem" (
        "id"            TEXT NOT NULL PRIMARY KEY,
        "clientEventId" TEXT NOT NULL UNIQUE,
        "payload"       TEXT NOT NULL,
        "status"        TEXT NOT NULL DEFAULT 'PENDING',
        "attempts"      INTEGER NOT NULL DEFAULT 0,
        "lastError"     TEXT,
        "createdAt"     TEXT NOT NULL
      )
    `);
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Meta" (
        "key"   TEXT NOT NULL PRIMARY KEY,
        "value" TEXT NOT NULL
      )
    `);
    console.log("[db] Tables initialized successfully.");
  } catch (err) {
    console.error("[db] Failed to initialize tables:", err);
  }
}


function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "نظام إدارة المتجر — نقطة البيع",
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env["ELECTRON_RENDERER_URL"];
  if (devServerUrl) {
    void win.loadURL(devServerUrl);
  } else {
    void win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(async () => {
  await initDatabase();
  restoreSession();
  registerIpc();
  createWindow();
  startSyncLoop();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
