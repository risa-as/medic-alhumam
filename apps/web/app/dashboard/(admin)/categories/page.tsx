"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { X, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { Btn, DataTable, DeleteDialog, PageHeader, StatusBadge, InputField, type Column } from "@/components/ui";

interface Category {
  id: string;
  nameAr: string;
  createdAt: string;
  _count: { products: number };
}

interface CategoryForm {
  nameAr: string;
}

function CategoryModal({ category, onClose, onDone }: { category?: Category; onClose: () => void; onDone: () => void }) {
  const isEdit = !!category;
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryForm>({
    defaultValues: { nameAr: category?.nameAr ?? "" },
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(v: CategoryForm) {
    setLoading(true);
    setErr(null);
    try {
      if (isEdit) {
        await apiFetch(`/categories/${category!.id}`, { method: "PATCH", body: JSON.stringify({ nameAr: v.nameAr }) });
      } else {
        await apiFetch("/categories", { method: "POST", body: JSON.stringify({ nameAr: v.nameAr }) });
      }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="modal-box bg-surface rounded-lg shadow-lg w-[420px] max-w-[calc(100vw-32px)] p-7">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-txt">{isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}</h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <InputField
            label="اسم الفئة"
            required
            placeholder="مثال: عكازات"
            error={errors.nameAr?.message}
            {...register("nameAr", { required: "اسم الفئة مطلوب" })}
          />

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>
              إلغاء
            </Btn>
            <Btn variant="primary" fullWidth type="submit" loading={loading} loadingText={isEdit ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}>
              {isEdit ? "حفظ التعديلات" : "إضافة"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"new" | Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<{ data: Category[] }>("/categories"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setDeleteTarget(null);
      setDeletingId(null);
    },
    onError: (e) => {
      setDeletingId(null);
      setDeleteTarget(null);
      setBanner(e instanceof Error ? e.message : "تعذّر حذف الفئة");
    },
  });

  const categories = categoriesQ.data?.data ?? [];

  function requestDelete(c: Category) {
    setBanner(null);
    if (c._count.products > 0) {
      setBanner(`لا يمكن حذف «${c.nameAr}» لأنها مرتبطة بـ ${c._count.products} منتج. انقل هذه المنتجات إلى فئة أخرى أو احذفها أولًا.`);
      return;
    }
    setDeleteTarget(c);
  }

  const columns: Column<Category>[] = [
    { key: "nameAr", label: "اسم الفئة", render: (c) => <span className="font-medium">{c.nameAr}</span> },
    {
      key: "products",
      label: "عدد المنتجات",
      render: (c) => (
        <StatusBadge
          status={c._count.products > 0 ? "info" : "neutral"}
          label={`${c._count.products.toLocaleString("ar-IQ")} منتج`}
        />
      ),
    },
    {
      key: "createdAt",
      label: "تاريخ الإنشاء",
      render: (c) => <span className="text-txt-muted">{new Date(c.createdAt).toLocaleDateString("ar-IQ")}</span>,
    },
    {
      key: "actions",
      label: "إجراءات",
      render: (c) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setBanner(null); setModal(c); }}
            title="تعديل"
            aria-label="تعديل"
            className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"
          >
            <Pencil className="h-[15px] w-[15px]" />
          </button>
          <button
            onClick={() => requestDelete(c)}
            title="حذف"
            aria-label="حذف"
            className="flex h-8 w-8 items-center justify-center rounded text-state-danger transition-colors hover:bg-state-danger-light"
          >
            <Trash2 className="h-[15px] w-[15px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="إدارة الفئات"
        subtitle="فئات المنتجات التي تظهر في المتجر ولوحة المخزون"
        actions={
          <Btn variant="primary" onClick={() => { setBanner(null); setModal("new"); }}>
            + إضافة فئة
          </Btn>
        }
      />

      {banner && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded border border-state-warning-light bg-state-warning-light px-4 py-3 text-sm text-state-warning">
          <span className="inline-flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" /> {banner}</span>
          <button onClick={() => setBanner(null)} className="shrink-0 text-state-warning hover:opacity-70"><X className="h-4 w-4" /></button>
        </div>
      )}

      <DataTable
        columns={columns}
        rows={categories}
        loading={categoriesQ.isLoading}
        emptyMessage="لا توجد فئات بعد"
        deletingId={deletingId}
      />

      {(modal === "new" || (modal && typeof modal === "object")) && (
        <CategoryModal
          category={modal === "new" ? undefined : (modal as Category)}
          onClose={() => setModal(null)}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["categories"] });
            setModal(null);
          }}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.nameAr ?? ""}
        loading={deleteMut.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          deleteMut.mutate(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
