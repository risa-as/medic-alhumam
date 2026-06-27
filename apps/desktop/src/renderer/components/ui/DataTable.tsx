import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  deletingId?: string | null;
  rowClassName?: (row: T) => string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading = false,
  emptyMessage = "لا توجد بيانات",
  deletingId,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 1, whiteSpace: "nowrap" }}>#</th>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr className="empty-row">
              <td colSpan={columns.length + 1}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span className="spinner spinner-dark" />
                  جارٍ التحميل...
                </div>
              </td>
            </tr>
          )}
          {!loading && rows.map((row, index) => {
            const isDeleting = deletingId === row.id;
            const extra = rowClassName ? rowClassName(row) : "";
            return (
              <tr
                key={row.id}
                className={[isDeleting ? "row-deleting" : "", extra].filter(Boolean).join(" ")}
              >
                <td style={{ whiteSpace: "nowrap", color: "var(--color-text-muted)", fontSize: 12 }}>{index + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            );
          })}
          {!loading && rows.length === 0 && (
            <tr className="empty-row">
              <td colSpan={columns.length + 1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Inbox size={30} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
                  {emptyMessage}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
