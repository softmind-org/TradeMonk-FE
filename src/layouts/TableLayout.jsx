import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import GenericTable from "../components/Table/index";
import Pagination from "../components/Pagination/index";

const TableLayout = ({
  title,
  actionButton,
  columns,
  data,
  loading = false,
  queryParams = { page: 1 },
  totalPages = 1,
  onPageChange = () => {},
  onSearch = () => {},
  totalItems,

  // visibility toggles
  showSearch = true,
  showCategories = true,

  // Optional: Select Outlet
  showSelectOutlet = false,
  outletValue = "Select Outlet",
  onOutletChange = () => {},
  outletOptions = ["POS", "Webshop", "POS/Webshop"],

  // footer label override
  entityLabel = "items",

  // 🔹 optional report filter dropdown
  showFilters = false,
  filters = [],
  activeFilter = "",
  onFilterChange = () => {},

  // 🔹 dark mode
  dark = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [internalFilter, setInternalFilter] = useState(
    filters[0] || "All"
  );

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearchTerm(v);
    onSearch?.(v);
  };

  const currentFilter = activeFilter || internalFilter;

  const handleFilterChange = (value) => {
    setInternalFilter(value);
    onFilterChange?.(value);
  };

  const pageSize = data?.length || 0;
  const start = pageSize ? (queryParams.page - 1) * pageSize + 1 : 0;
  const end = pageSize ? (queryParams.page - 1) * pageSize + pageSize : 0;

  // ── Theme tokens ──
  const t = dark
    ? {
        section: "rounded-2xl border border-white/5 bg-[#111C2E] px-5 py-6",
        titleText: "text-[18px] font-bold text-white",
        searchIcon: "text-muted-foreground",
        searchInput:
          "w-full rounded-lg border border-white/10 bg-[#0B1220] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#D4A017] transition-colors",
      }
    : {
        section:
          "rounded-2xl border border-[#EFEFEF] bg-white px-5 py-6",
        titleText: "text-[18px] font-bold text-[#2E2E2E]",
        searchIcon: "text-[#8A8A8A]",
        searchInput:
          "w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1D50AB]/30",
      };

  return (
    <section
      className={t.section}
      style={dark ? {} : { boxShadow: "0px 0px 5.5px 0px #00000040" }}
    >
      {/* ===== Top Bar ===== */}
      <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-center md:justify-start">
        {title ? (
          <h2 className={`whitespace-nowrap ${t.titleText}`}>
            {title}
          </h2>
        ) : null}

        <div className="flex items-center w-full gap-3 md:w-auto">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 md:w-[360px] lg:ml-3">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${t.searchIcon}`} />
              <input
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search items..."
                className={t.searchInput}
              />
            </div>
          )}

          {/* 🔹 Filter dropdown */}
          {showFilters && filters.length > 0 && (
            <div className="relative">
              <select
                value={currentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="appearance-none rounded-md border bg-white 
                           border-[var(--Colors-Border-border-primary,#D5D7DA)]
                           py-2.5 pl-3 pr-8 text-sm text-[#5D6679] 
                           shadow-sm focus:ring-0"
              >
                {filters.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
              />
            </div>
          )}

          {/* All Categories pill */}
          {showCategories && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#1D50AB] px-4 py-2.5 text-sm text-white"
            >
              All Categories
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Optional: Select Outlet */}
          {showSelectOutlet && (
            <div className="relative">
              <select
                value={outletValue}
                onChange={(e) => onOutletChange(e.target.value)}
                className="appearance-none rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-4 pr-9 text-sm text-[#2E2E2E] shadow-sm focus:ring-2 focus:ring-[#1D50AB]/30"
              >
                <option value="Select Outlet" disabled>
                  Select Outlet
                </option>
                {outletOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
            </div>
          )}

          {/* Extra actions slot */}
          {actionButton}
        </div>
      </div>

      {/* ===== Table ===== */}
      <GenericTable columns={columns} data={data} loading={loading} stickyHeader dark={dark} />

      {/* ===== Footer / Pagination row ===== */}
      <div className="flex flex-col items-start gap-3 md:justify-between md:items-center md:flex-row">
        {totalPages > 1 && (
          <Pagination
            currentPage={queryParams.page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showFirstLast={true}
            size="icon"
            variant="outline"
          />
        )}
      </div>
    </section>
  );
};

export default TableLayout;
