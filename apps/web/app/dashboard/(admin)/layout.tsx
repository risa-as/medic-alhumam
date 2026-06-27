import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * حارس صفحات الإدارة (route group لا يغيّر الـ URL).
 * يحجب CASHIER عن: الرئيسية (KPIs)، الزبائن، الديون، الإعدادات، المستخدمون — حتى عبر الرابط مباشرة (FR-044).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") redirect("/dashboard/inventory");
  return <>{children}</>;
}
