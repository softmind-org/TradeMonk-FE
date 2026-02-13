import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ModalContext = createContext(undefined);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [width, setWidth] = useState(null);

  const openModal = useCallback((node, modalWidth = null) => {
    setContent(node);
    setWidth(modalWidth);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setWidth(null);
  }, []);

  // Lock body scroll while modal is open (and avoid layout shift)
  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // calculate scrollbar width (to prevent layout jump)
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({
      isOpen,
      content,
      width,
      openModal,
      closeModal,
      setContent, // optional: update current modal content without closing
    }),
    [isOpen, content, width, openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
