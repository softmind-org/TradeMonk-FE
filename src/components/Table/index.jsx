import React, { useMemo, useState } from "react";

const get = (obj, path) => path.split(".").reduce((o, i) => o?.[i], obj);

const GenericTable = ({
  loading = false,
  data = [],
  columns = [],
  rowKey = (row, i) => row.id ?? i,
  striped = false,
  stickyHeader = true,
  emptyText = "No data available",
  dark = false,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortKey, setSortKey] = useState("");

  const handleSort = (columnKey) => {
    const newSortOrder =
      sortKey === columnKey && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortKey(columnKey);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = get(a, sortKey);
      const bValue = get(b, sortKey);
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // ── Theme tokens ──
  const theme = dark
    ? {
        headerText: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
        headerBorder: "border-b border-white/10",
        bodyText: "text-sm text-white",
        rowBg: "bg-transparent",
        rowStriped: "bg-white/[0.02]",
        rowHover: "hover:bg-white/[0.04]",
        cellBorder: "border-b border-white/5",
        emptyText: "text-muted-foreground",
        skeletonBg: "bg-white/10",
      }
    : {
        headerText: "text-[18px] font-semibold text-[#4B5563]",
        headerBorder: "border-b border-[#F2F4F7]",
        bodyText: "text-sm text-[#2E2E2E]",
        rowBg: "bg-white",
        rowStriped: "bg-[#FAFAFA]",
        rowHover: "hover:bg-[#F8F8F8]",
        cellBorder: "border-b border-[#F0F0F0]",
        emptyText: "text-[#545454]",
        skeletonBg: "bg-gray-200",
      };

  const renderSkeletonRows = () =>
    Array(8)
      .fill(null)
      .map((_, r) => (
        <tr key={`sk-${r}`}>
          {columns.map((c, i) => (
            <td
              key={`sk-${r}-${i}`}
              className={`py-5 px-5 ${c?.cellClassName || ""}`}
            >
              <div className={`w-4/5 h-4 rounded animate-pulse ${theme.skeletonBg}`} />
            </td>
          ))}
        </tr>
      ));

  return (
    <div className="relative">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full border-collapse">
          <thead className={`${stickyHeader ? "sticky top-0 z-10" : ""}`}>
            <tr>
              {columns.map((col, idx) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={idx}
                    onClick={
                      col.sortable ? () => handleSort(col.key) : undefined
                    }
                    className={`text-left px-5 py-3 ${theme.headerText} ${theme.headerBorder} ${
                      col.sortable ? "cursor-pointer select-none" : ""
                    } ${col?.headerClassName || ""}`}
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center justify-start gap-2">
                      <span className="truncate">{col.label}</span>
                      {col.sortable && isSorted && (
                        <span className="text-xs">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={theme.bodyText}>
            {loading ? (
              renderSkeletonRows()
            ) : sortedData.length > 0 ? (
              sortedData.map((row, rIdx) => (
                <tr
                  key={rowKey(row, rIdx)}
                  className={`transition-colors ${
                    striped && rIdx % 2 ? theme.rowStriped : theme.rowBg
                  } ${theme.rowHover}`}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={`${rIdx}-${cIdx}`}
                      className={`px-5 py-4 ${theme.cellBorder} ${
                        col?.cellClassName || ""
                      }`}
                      style={{ width: col.width }}
                      title={
                        col.render
                          ? ""
                          : typeof get(row, col.key) === "string"
                          ? get(row, col.key)
                          : undefined
                      }
                    >
                      {col.render ? (
                        col.render(row, rIdx)
                      ) : (
                        <div className="text-left truncate">
                          {get(row, col.key)}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-5 py-10 text-center ${theme.emptyText}`}
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
