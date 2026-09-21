import { AlertTriangle, X } from "lucide-react";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-overlay"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="confirm-dialog__close"
          onClick={onCancel}
          aria-label="Close confirmation dialog"
        >
          <X size={17} />
        </button>

        <div className="confirm-dialog__icon">
          <AlertTriangle size={20} />
        </div>

        <h2 id="confirm-title">{title}</h2>

        <p>{message}</p>

        <div className="confirm-dialog__actions">
          <button
            className="confirm-dialog__cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-dialog__confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;