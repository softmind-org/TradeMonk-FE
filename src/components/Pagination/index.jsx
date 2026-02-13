import React, { useEffect, useState } from "react";
import Button from "../ui/Button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  size = "icon",
  variant = "outline",
}) => {
  const [maxVisiblePages, setMaxVisiblePages] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setMaxVisiblePages(window.innerWidth < 640 ? 3 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVisiblePages = () => {
    let pages = [];
    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      if (end === totalPages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 pt-3">
      {showFirstLast && (
        <Button
          size={size}
          variant={variant}
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="hidden sm:flex "
        >
          {"<<"}
        </Button>
      )}

      <Button
        size={size}
        variant={variant}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {"<"}
      </Button>

      {visiblePages.map((page) => (
        <Button
          key={page}
          size={size}
          variant={page === currentPage ? "default" : variant}
          onClick={() => onPageChange(page)}
          className={`${
            page === currentPage ? "pointer-events-none" : ""
          } text-black`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Button>
      ))}

      <Button
        size={size}
        variant={variant}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {">"}
      </Button>

      {showFirstLast && (
        <Button
          size={size}
          variant={variant}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:flex"
        >
          {">>"}
        </Button>
      )}
    </nav>
  );
};

export default Pagination;
