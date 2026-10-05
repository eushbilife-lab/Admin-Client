import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdViewList } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import useDebouncedValue from "hooks/useDebouncedValue";
import { filterCommands, type AdminCommand } from "constants/adminCommands";
import { searchCatalog, type CatalogHit } from "services/dashboard.service";
import "./CommandPalette.css";

type PaletteRow =
  | { kind: "command"; item: AdminCommand }
  | { kind: "food"; item: CatalogHit };

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.user?.role);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [foods, setFoods] = useState<CatalogHit[]>([]);
  const debounced = useDebouncedValue(query, 240);

  const commands = useMemo(() => {
    const found = filterCommands(query, role);
    const term = query.trim();
    if (term.length < 2) return found;
    return [
      {
        id: "search-catalog",
        label: `Search catalog for “${term}”`,
        hint: "Open matching foods in the catalog",
        href: `/products?q=${encodeURIComponent(term)}`,
        keywords: term,
        group: "Catalog",
        icon: MdViewList,
        kind: "page" as const,
      },
      ...found,
    ];
  }, [query, role]);

  const groupedCommands = useMemo(() => {
    return commands.reduce<Record<string, AdminCommand[]>>((acc, item) => {
      acc[item.group] = acc[item.group] || [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [commands]);

  const rows: PaletteRow[] = useMemo(() => {
    const foodRows: PaletteRow[] = foods.map((item) => ({ kind: "food", item }));
    const commandRows: PaletteRow[] = ([] as AdminCommand[])
      .concat(...Object.values(groupedCommands))
      .map((item) => ({ kind: "command" as const, item }));
    return [...foodRows, ...commandRows];
  }, [foods, groupedCommands]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setFoods([]);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    searchCatalog(debounced).then((hits) => {
      if (alive) setFoods(hits);
    });
    return () => {
      alive = false;
    };
  }, [debounced, open]);

  useEffect(() => {
    setActive(0);
  }, [query, foods.length]);

  const go = useCallback(
    (row?: PaletteRow) => {
      const target = row || rows[active];
      if (!target) return;
      onClose();
      if (target.kind === "food") {
        navigate(`/update-product/${target.item._id}`);
        return;
      }
      navigate(target.item.href);
    },
    [active, navigate, onClose, rows]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => Math.min(value + 1, Math.max(rows.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        go();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, open, rows.length]);

  if (!open) return null;

  let cursor = foods.length;

  return (
    <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search Eushbi Life">
      <button type="button" className="command-palette__backdrop" onClick={onClose} aria-label="Close search" />
      <div className="command-palette__panel">
        <label className="command-palette__search">
          <MdSearch size={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search foods, RDA, scores, allergies…"
          />
          <kbd>esc</kbd>
        </label>
        <div className="command-palette__results">
          {foods.length > 0 ? (
            <section>
              <p className="command-palette__group">Foods</p>
              {foods.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  className={`command-palette__row${active === index ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go({ kind: "food", item })}
                >
                  <img src={item.productImages?.[0] || item.image || item.image_url || "/EushbiLife.png"} alt="" />
                  <span>
                    <strong>{item.productName || "Untitled food"}</strong>
                    <em>{item.brand || item.barcode || "Open product"}</em>
                  </span>
                </button>
              ))}
            </section>
          ) : null}

          {Object.entries(groupedCommands).map(([group, items]) => (
            <section key={group}>
              <p className="command-palette__group">{group}</p>
              {items.map((item) => {
                const index = cursor;
                cursor += 1;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`command-palette__row${active === index ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go({ kind: "command", item })}
                  >
                    <span className="command-palette__icon">
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <em>{item.hint}</em>
                    </span>
                  </button>
                );
              })}
            </section>
          ))}

          {rows.length === 0 ? <p className="command-palette__empty">Nothing matches that search.</p> : null}
        </div>
      </div>
    </div>
  );
}
