import { useEffect, useRef, type ReactNode } from "react";
import "./CatalogToolbar.css";

export type CatalogSortOption = { value: string; label: string };
export type CatalogChip = {
  id: string;
  label: string;
  count?: number;
};

type Props = {
  hint?: string;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  sort?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: CatalogSortOption[];
  chips?: CatalogChip[];
  activeChip?: string;
  onChipChange?: (id: string) => void;
  meta?: ReactNode;
  actions?: ReactNode;
  enableSearchShortcut?: boolean;
};

export default function CatalogToolbar({
  hint,
  search,
  onSearchChange,
  searchPlaceholder = "Search… (⌘K)",
  searchAriaLabel = "Search",
  sort,
  onSortChange,
  sortOptions,
  chips,
  activeChip = "all",
  onChipChange,
  meta,
  actions,
  enableSearchShortcut = true,
}: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!enableSearchShortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableSearchShortcut]);

  return (
    <div>
      {hint ? <p className="catalog-hint">{hint}</p> : null}

      <div className="catalog-toolbar">
        <div className="catalog-search-wrap">
          <input
            ref={searchRef}
            className="catalog-search"
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={searchAriaLabel}
          />
          {search ? (
            <button
              type="button"
              className="catalog-search-clear"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
            >
              ×
            </button>
          ) : null}
        </div>

        {sortOptions?.length && onSortChange ? (
          <select
            className="catalog-select"
            value={sort || sortOptions[0].value}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : null}

        {actions ? <div className="catalog-actions">{actions}</div> : null}
      </div>

      {(meta || chips?.length) && (
        <div className="catalog-meta">
          {meta}
          {chips?.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`catalog-pill${activeChip === chip.id ? " is-active" : ""}`}
              onClick={() => onChipChange?.(chip.id)}
            >
              {chip.count != null ? `${chip.label} (${chip.count})` : chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CatalogMetaPill({
  children,
  warn,
}: {
  children: ReactNode;
  warn?: boolean;
}) {
  return (
    <span
      className={`catalog-pill catalog-pill--static${warn ? " catalog-pill--warn" : ""}`}
    >
      {children}
    </span>
  );
}
