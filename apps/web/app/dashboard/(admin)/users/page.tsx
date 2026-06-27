"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { X, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { Btn, DataTable, DeleteDialog, PageHeader, StatusBadge, InputField, SelectField, type Column } from "@/components/ui";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CASHIER";
  createdAt: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "CASHIER";
}

function UserModal({ user, onClose, onDone }: { user?: User; onClose: () => void; onDone: () => void }) {
  const isEdit = !!user;
  const { register, handleSubmit, formState: { errors } } = useForm<UserForm>({
    defaultValues: {
      name:     user?.name  ?? "",
      email:    user?.email ?? "",
      password: "",
      role:     user?.role  ?? "CASHIER",
    },
  });
  const [err, setErr]       = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(v: UserForm) {
    setLoading(true);
    setErr(null);
    try {
      if (isEdit) {
        const body: Record<string, unknown> = { name: v.name, email: v.email, role: v.role };
        if (v.password) body.password = v.password;
        await apiFetch(`/users/${user!.id}`, { method: "PATCH", body: JSON.stringify(body) });
      } else {
        await apiFetch("/users", { method: "POST", body: JSON.stringify(v) });
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
          <h3 className="text-base font-bold text-txt">
            {isEdit ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-txt-muted transition-colors hover:bg-app-bg hover:text-txt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <InputField
            label="الاسم"
            required
            error={errors.name?.message}
            {...register("name", { required: "الاسم مطلوب" })}
          />
          <InputField
            label="البريد الإلكتروني"
            type="email"
            required
            error={errors.email?.message}
            {...register("email", { required: "البريد مطلوب" })}
          />
          <InputField
            label={isEdit ? "كلمة المرور الجديدة (اتركها فارغة للإبقاء)" : "كلمة المرور"}
            type="password"
            required={!isEdit}
            error={errors.password?.message}
            {...register("password", { required: isEdit ? false : "كلمة المرور مطلوبة" })}
          />
          <SelectField label="الدور" required {...register("role")}>
            <option value="CASHIER">موظف (كاشير)</option>
            <option value="ADMIN">مدير النظام</option>
          </SelectField>

          {err && (
            <div className="rounded border border-state-danger-light bg-state-danger-light px-3 py-2 text-xs text-state-danger">
              {err}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Btn variant="secondary" fullWidth type="button" onClick={onClose} disabled={loading}>
              إلغاء
            </Btn>
            <Btn
              variant="primary"
              fullWidth
              type="submit"
              loading={loading}
              loadingText={isEdit ? "جارٍ الحفظ..." : "جارٍ الإنشاء..."}
            >
              {isEdit ? "حفظ التعديلات" : "إضافة"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const qc = useQueryClient();
  const [modal, setModal]           = useState<"new" | User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deletingId, setDeletingId]  = useState<string | null>(null);

  const usersQ = useQuery({
    queryKey: ["users"],
    queryFn: () => apiFetch<{ data: User[] }>("/users"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      setDeleteTarget(null);
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  const users = usersQ.data?.data ?? [];

  const columns: Column<User>[] = [
    { key: "name",  label: "الاسم",  render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", label: "البريد", render: (u) => <span className="text-txt-secondary">{u.email}</span> },
    {
      key: "role",
      label: "الدور",
      render: (u) => (
        <StatusBadge
          status={u.role === "ADMIN" ? "info" : "neutral"}
          label={u.role === "ADMIN" ? "مدير" : "موظف"}
        />
      ),
    },
    {
      key: "createdAt",
      label: "تاريخ الإنشاء",
      render: (u) => <span className="text-txt-muted">{new Date(u.createdAt).toLocaleDateString("ar-IQ")}</span>,
    },
    {
      key: "actions",
      label: "إجراءات",
      render: (u) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setModal(u)}
            title="تعديل"
            aria-label="تعديل"
            className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary-light"
          >
            <Pencil className="h-[15px] w-[15px]" />
          </button>
          <button
            onClick={() => setDeleteTarget(u)}
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
        title="إدارة المستخدمين"
        subtitle="حسابات الموظفين والمديرين"
        actions={
          <Btn variant="primary" onClick={() => setModal("new")}>
            + إضافة مستخدم
          </Btn>
        }
      />

      <DataTable
        columns={columns}
        rows={users}
        loading={usersQ.isLoading}
        emptyMessage="لا يوجد مستخدمون"
        deletingId={deletingId}
      />

      {/* Modal إضافة/تعديل */}
      {(modal === "new" || (modal && typeof modal === "object")) && (
        <UserModal
          user={modal === "new" ? undefined : (modal as User)}
          onClose={() => setModal(null)}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["users"] });
            setModal(null);
          }}
        />
      )}

      {/* DeleteDialog */}
      <DeleteDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name ?? ""}
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
