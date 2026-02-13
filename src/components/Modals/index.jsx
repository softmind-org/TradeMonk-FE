// src/components/Modals/index.jsx
import { useEffect } from "react";
import { useModal } from "../../context/modal";

const Modal = () => {
  const { isOpen, content, width, closeModal } = useModal();
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay (covers whole app; blur + dim) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Centered container (prevents overlay click bubbling) */}
      <div
        className="relative z-10 grid min-h-full p- place-items-center"
        onClick={closeModal}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="w-full rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          style={{ maxWidth: width ? `${width}px` : "540px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scroll inside if content is tall */}
          <div className="max-h-[80vh] overflow-y-auto lg:p-9 md:p-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
