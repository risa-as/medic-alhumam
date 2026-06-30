"use client";

import type { ReactNode } from "react";

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
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse whitespace-nowrap text-sm">
        <thead className="border-b-2 border-border bg-app-bg">
          <tr>
            <th className="w-px whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold text-txt-secondary">#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  "px-3 py-2.5 text-right text-xs font-semibold text-txt-secondary",
                  col.className ?? "",
                ].join(" ")}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length + 1} className="py-8 text-center text-txt-muted">
                <span className="spinner spinner-dark" />
                <span className="mr-2">جارٍ التحميل...</span>
              </td>
            </tr>
          )}

          {!loading &&
            rows.map((row, index) => {
              const isDeleting = deletingId === row.id;
              const extra = rowClassName ? rowClassName(row) : "";
              return (
                <tr
                  key={row.id}
                  className={[
                    "border-b border-border-light bg-surface transition-colors duration-100",
                    "last:border-b-0 hover:bg-[#F7F9FC]",
                    isDeleting ? "row-deleting" : "",
                    extra,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs text-txt-muted">{index + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className={["px-3 py-2.5 text-txt", col.className ?? ""].join(" ")}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              );
            })}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="py-8 text-center text-txt-muted">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
