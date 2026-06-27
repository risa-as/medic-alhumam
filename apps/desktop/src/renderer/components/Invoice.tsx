import type { LocalSale } from "../types";

const fmt = (n: number) => n.toLocaleString("ar-IQ");

const PAYMENT_LABEL: Record<string, string> = {
  CASH: "نقد",
  CREDIT: "آجل (دين)",
  PARTIAL: "دفع جزئي",
};

/** عرض فاتورة قابل للطباعة (يُستخدم في الإتمام وإعادة الطباعة). */
export function Invoice({ sale }: { sale: LocalSale }) {
  return (
    <div className="invoice">
      <h2>متجر المستلزمات الطبية</h2>
      <div className="invoice-meta">
        <span>فاتورة: {sale.invoiceNo}</span>
        <span>{new Date(sale.createdAt).toLocaleString("ar-IQ")}</span>
      </div>
      {sale.customerName && <div>الزبون: {sale.customerName}</div>}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((it) => (
            <tr key={it.id}>
              <td>{it.nameAr}</td>
              <td>{it.quantity}</td>
              <td>{fmt(it.unitPrice)}</td>
              <td>{fmt(it.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="invoice-totals">
        <div>المجموع الفرعي: {fmt(sale.subtotal)}</div>
        {sale.discount > 0 && <div>الخصم: {fmt(sale.discount)}</div>}
        <div>الإجمالي: {fmt(sale.total)}</div>
        <div>المدفوع: {fmt(sale.paid)}</div>
        {sale.remaining > 0 && <div>المتبقّي: {fmt(sale.remaining)}</div>}
        <div>طريقة الدفع: {PAYMENT_LABEL[sale.paymentType] ?? sale.paymentType}</div>
      </div>
      <button className="no-print" onClick={() => window.print()}>
        طباعة
      </button>
    </div>
  );
}
