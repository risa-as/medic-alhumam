import { Trash2 } from "lucide-react";
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
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}
    >
      <div className="modal-box" style={{ width: 380, textAlign: "center" }}>
        <div className="delete-dialog-icon"><Trash2 size={22} /></div>
        <p className="delete-dialog-title">تأكيد الحذف</p>
        <p className="delete-dialog-msg">
          هل أنت متأكد من حذف<br />
          <strong style={{ color: "var(--color-text)" }}>«{itemName}»</strong>؟
          <br />
          <span style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6, display: "block" }}>
            لا يمكن التراجع عن هذا الإجراء.
          </span>
        </p>
        <div className="modal-footer">
          <Btn variant="secondary" onClick={onCancel} disabled={loading}>إلغاء</Btn>
          <Btn variant="danger" loading={loading} loadingText="جارٍ الحذف..." onClick={onConfirm}>
            نعم، احذف
          </Btn>
        </div>
      </div>
    </div>
  );
}
