import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { ReportsNav } from "./_components/ReportsNav";
import { PeriodFilter } from "./_components/PeriodFilter";
import { TimeWindowFilter } from "./_components/TimeWindowFilter";

// لوحة قيادة المالك ديناميكية دائمًا (محميّة بالمصادقة وتعتمد على معاملات الرابط)
export const dynamic = "force-dynamic";

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader title="لوحة القيادة" subtitle="نظرة شاملة على أداء المتجر المالي وصحّة المخزون" />
      <Suspense fallback={null}>
        <ReportsNav />
        <PeriodFilter />
        <TimeWindowFilter />
      </Suspense>
      {children}
    </div>
  );
}
