"use client";

import { Btn } from "./Btn";

interface DeleteDialogProps {
  open: boolean;
  itemName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDialog({ open, itemName, loading = false, onConfirm, onCancel }: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(13,27,42,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div className="modal-box bg-surface rounded-lg shadow-lg p-7 w-[360px] max-w-[calc(100vw-32px)]">
        {/* أيقونة التحذير */}
        <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-state-danger-light">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#B91C1C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* النص */}
        <h3 className="mb-2 text-center text-base font-bold text-txt">تأكيد الحذف</h3>
        <p className="text-center text-sm leading-relaxed text-txt-secondary">
          هل أنت متأكد من حذف{" "}
          <span className="font-semibold text-txt">«{itemName}»</span>؟
          <br />
          لا يمكن التراجع عن هذا الإجراء.
        </p>

        {/* الأزرار */}
        <div className="mt-6 flex gap-2">
          <Btn variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            إلغاء
          </Btn>
          <Btn
            variant="danger"
            fullWidth
            loading={loading}
            loadingText="جارٍ الحذف..."
            onClick={onConfirm}
          >
            نعم، احذف
          </Btn>
        </div>
      </div>
    </div>
  );
}
