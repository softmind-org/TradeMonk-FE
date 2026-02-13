import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Error } from "@/assets/svgs";

/**
 * Reusable delete-confirm modal
 *
 * Props:
 * - subject: string             // e.g. "Receipt" (used in title & confirm button)
 * - message?: string            // optional custom message
 * - onConfirm: () => Promise<any> | void
 * - onClose: () => void
 * - confirmText?: string        // override "Delete <subject>"
 * - cancelText?: string         // default "Cancel"
 */
export default function WarningModal({
  subject = "Item",
  message,
  onConfirm,
  onClose,
  confirmText,
  cancelText = "Cancel",
}) {
  const [isLoading, setIsLoading] = useState(false);

  const title = `Delete ${subject}`;
  const body =
    message || `Are you sure you want to delete this ${subject.toLowerCase()}?`;
  const confirmLabel = confirmText || `Delete ${subject}`;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm?.();
    } finally {
      setIsLoading(false);
      onClose?.();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="warn-title"
      className="w-full max-w-[520px] rounded-2xl bg-white "
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-red-50">
        <img
          src= {Error}
          alt="Error"
          className="w-[126px] max-w-[126px]"
        />      
      </div>

      {/* Title & text */}
      <h2 id="warn-title" className="text-center text-[18px] font-semibold text-[#2E2E2E]">
        {title}
      </h2>
      <p className="mt-2 text-center text-[14px] text-[#545454]">{body}</p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-full border border-[#E5E7EB] bg-white px-6 py-2.5 text-[#2E2E2E] disabled:opacity-60"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="rounded-full bg-[#C90000] px-6 py-2.5 font-medium text-white hover:brightness-110 disabled:opacity-60"
        >
          {isLoading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </div>
  );
}
