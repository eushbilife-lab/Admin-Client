import { useAppDispatch, useAppSelector } from "redux/hooks";
import nutritionService from "services/nutrition.service";
import { nutritionActions } from "redux/slices/nutrition";
import {
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TableWrapper from "@core/templates/TableWrapper";
import TableLoader from "@core/templates/TableLoader";
import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import "../Nutrition.css";

type NutrientRow = {
  _id?: string;
  name: string;
  key?: string;
};

type SortMode = "az" | "za" | "newest";
type GroupFilter = "all" | "macros" | "vitamins" | "minerals" | "other" | "new";

const MACRO_RE =
  /^(calories|energy|kcal|protein|proteins|fat|fats|total_fat|carb|carbs|carbohydrate|carbohydrates|fiber|fibre|sugar|sugars)/i;
const VITAMIN_RE = /vitamin|vit[_-\s]?[a-z0-9]|retinol|folate|folic|niacin|riboflavin|thiamin|biotin|choline/i;
const MINERAL_RE =
  /calcium|iron|zinc|magnesium|sodium|potassium|phosphorus|selenium|copper|manganese|iodine|chloride|mineral/i;

function classify(row: NutrientRow): Exclude<GroupFilter, "all" | "new"> {
  const blob = `${row.key || ""} ${row.name || ""}`;
  if (MACRO_RE.test(blob)) return "macros";
  if (VITAMIN_RE.test(blob)) return "vitamins";
  if (MINERAL_RE.test(blob)) return "minerals";
  return "other";
}

function normalizeName(name: string) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function snapshot(rows: NutrientRow[]) {
  return JSON.stringify(
    rows.map((r) => ({
      _id: r._id || "",
      name: String(r.name || "").trim(),
    }))
  );
}

type Props = {
  onSubmit: (rows: NutrientRow[]) => Promise<void> | void;
};

export default function AddNutritionForm({ onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const { nutritions, loading } = useAppSelector((state) => state.nutrition);
  const [rows, setRows] = useState<NutrientRow[]>([]);
  const [baseline, setBaseline] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("az");
  const [group, setGroup] = useState<GroupFilter>("all");
  const [saving, setSaving] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nutritionService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
    };
  }, [dispatch]);

  useEffect(() => {
    const list = Array.isArray(nutritions) ? nutritions : [];
    const cloned = JSON.parse(JSON.stringify(list)) as NutrientRow[];
    setRows(cloned);
    setBaseline(snapshot(cloned));
  }, [nutritions]);

  const dirty = snapshot(rows) !== baseline;
  const emptyNames = rows.some((r) => !String(r.name || "").trim());
  const hasDuplicates = useMemo(() => {
    const seen = new Set<string>();
    for (const r of rows) {
      const n = normalizeName(r.name);
      if (!n) continue;
      if (seen.has(n)) return true;
      seen.add(n);
    }
    return false;
  }, [rows]);
  const canSave = dirty && !emptyNames && !hasDuplicates && !saving;
  const newCount = rows.filter((r) => !r._id).length;

  const nameCounts = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => {
      const n = normalizeName(r.name);
      if (!n) return;
      map.set(n, (map.get(n) || 0) + 1);
    });
    return map;
  }, [rows]);

  const groupCounts = useMemo(() => {
    const counts = { macros: 0, vitamins: 0, minerals: 0, other: 0, new: 0 };
    rows.forEach((r) => {
      if (!r._id) counts.new += 1;
      counts[classify(r)] += 1;
    });
    return counts;
  }, [rows]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows.map((row, index) => ({ row, index }));

    if (group === "new") {
      list = list.filter(({ row }) => !row._id);
    } else if (group !== "all") {
      list = list.filter(({ row }) => classify(row) === group);
    }

    if (q) {
      list = list.filter(({ row }) => {
        const name = String(row.name || "").toLowerCase();
        const key = String(row.key || "").toLowerCase();
        return name.includes(q) || key.includes(q);
      });
    }

    list = [...list].sort((a, b) => {
      if (sort === "newest") {
        const aNew = a.row._id ? 1 : 0;
        const bNew = b.row._id ? 1 : 0;
        if (aNew !== bNew) return aNew - bNew;
      }
      const an = String(a.row.name || "").toLowerCase();
      const bn = String(b.row.name || "").toLowerCase();
      const cmp = an.localeCompare(bn);
      return sort === "za" ? -cmp : cmp;
    });

    return list;
  }, [rows, search, sort, group]);

  const addNutrient = useCallback(() => {
    setRows((prev) => [{ name: "", key: "" }, ...prev]);
    setGroup("all");
    setSearch("");
    setTimeout(() => {
      const first = document.querySelector(
        ".nutrients-row-input"
      ) as HTMLInputElement | null;
      first?.focus();
    }, 0);
  }, []);

  const removeNutrient = (index: number) => {
    const row = rows[index];
    if (row?._id) {
      const ok = window.confirm(
        `Remove “${row.name || "this nutrient"}” from the library? Products that reference it may break.`
      );
      if (!ok) return;
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNameChange = (value: string, index: number) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, name: value } : row))
    );
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSubmit(rows);
    } finally {
      setSaving(false);
    }
  };

  const resetLocal = () => {
    const list = Array.isArray(nutritions) ? nutritions : [];
    const cloned = JSON.parse(JSON.stringify(list)) as NutrientRow[];
    setRows(cloned);
    setBaseline(snapshot(cloned));
    setSearch("");
    setGroup("all");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, canSave]);

  if (loading && !rows.length) {
    return (
      <div>
        <p className="nutrients-hint">
          Search, filter, and edit the nutrient library used on product labels and
          health scores. Keys are generated on save from the nutrient name.
        </p>
        <TableWrapper>
          <TableContainer>
            <Table aria-label="Nutrients loading" sx={adminTableSx}>
              <TableLoader rows={10} coloumns={3} showHeader />
            </Table>
          </TableContainer>
        </TableWrapper>
      </div>
    );
  }

  return (
    <div>
      <p className="nutrients-hint">
        Search, filter, and edit the nutrient library used on product labels and
        health scores. Keys are generated on save from the nutrient name.
      </p>

      <div className="nutrients-toolbar">
        <div className="nutrients-search-wrap">
          <input
            ref={searchRef}
            className="nutrients-search"
            type="search"
            placeholder="Search by name or key… (⌘K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search nutrients"
          />
          {search ? (
            <button
              type="button"
              className="nutrients-search-clear"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          ) : null}
        </div>

        <select
          className="nutrients-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          aria-label="Sort nutrients"
        >
          <option value="az">Sort A–Z</option>
          <option value="za">Sort Z–A</option>
          <option value="newest">New rows first</option>
        </select>

        <div className="nutrients-actions">
          <Button type="button" variant="outlined" onClick={addNutrient}>
            Add nutrient
          </Button>
          {dirty ? (
            <Button type="button" variant="text" onClick={resetLocal}>
              Discard
            </Button>
          ) : null}
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={!canSave}
          >
            {saving ? "Saving…" : "Save library"}
          </Button>
        </div>
      </div>

      <div className="nutrients-meta">
        <span className="nutrients-pill nutrients-pill--static">
          {rows.length} total
        </span>
        <span className="nutrients-pill nutrients-pill--static">
          {visible.length} showing
        </span>
        {newCount > 0 ? (
          <span className="nutrients-pill nutrients-pill--warn nutrients-pill--static">
            {newCount} unsaved new
          </span>
        ) : null}
        {dirty ? (
          <span className="nutrients-pill nutrients-pill--warn nutrients-pill--static">
            Unsaved changes
          </span>
        ) : null}
        {hasDuplicates ? (
          <span className="nutrients-pill nutrients-pill--warn nutrients-pill--static">
            Fix duplicate names
          </span>
        ) : null}

        {(
          [
            ["all", "All"],
            ["macros", `Macros (${groupCounts.macros})`],
            ["vitamins", `Vitamins (${groupCounts.vitamins})`],
            ["minerals", `Minerals (${groupCounts.minerals})`],
            ["other", `Other (${groupCounts.other})`],
            ["new", `New (${groupCounts.new})`],
          ] as [GroupFilter, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`nutrients-pill${group === id ? " is-active" : ""}`}
            onClick={() => setGroup(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <TableWrapper>
        <TableContainer>
          <Table aria-label="Nutrient library" sx={adminTableSx}>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: 56 }}>#</StyledTableCell>
                <StyledTableCell>Nutrient name</StyledTableCell>
                <StyledTableCell>Key</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCellAction>Action</StyledTableCellAction>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={5}>
                    <div className="nutrients-empty">
                      <strong>
                        {search || group !== "all"
                          ? "No nutrients match"
                          : "No nutrients yet"}
                      </strong>
                      {search || group !== "all"
                        ? "Try another search or clear filters."
                        : "Click “Add nutrient” to start the library."}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                visible.map(({ row, index }, i) => {
                  const n = normalizeName(row.name);
                  const isDup = Boolean(n && (nameCounts.get(n) || 0) > 1);
                  const isNew = !row._id;
                  const type = classify(row);
                  return (
                    <StyledTableRow key={row._id || `new-${index}`}>
                      <StyledTableCell>{i + 1}</StyledTableCell>
                      <StyledTableCell>
                        <input
                          className={`nutrients-row-input${
                            !String(row.name || "").trim() || isDup
                              ? " is-invalid"
                              : ""
                          }`}
                          value={row.name || ""}
                          placeholder="e.g. Total carbohydrate"
                          onChange={(e) =>
                            handleNameChange(e.target.value, index)
                          }
                          aria-label={`Nutrient name ${index + 1}`}
                        />
                        {isNew ? (
                          <span className="nutrients-badge nutrients-badge--new">
                            New
                          </span>
                        ) : null}
                        {isDup ? (
                          <span className="nutrients-badge nutrients-badge--dup">
                            Duplicate
                          </span>
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`nutrients-key${
                            row.key ? "" : " is-empty"
                          }`}
                          title={row.key || "Generated on save"}
                        >
                          {row.key || "auto on save"}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <span className="nutrients-pill nutrients-pill--static">
                          {type}
                        </span>
                      </StyledTableCell>
                      <StyledTableCellAction>
                        <Button
                          type="button"
                          color="error"
                          size="small"
                          onClick={() => removeNutrient(index)}
                        >
                          Remove
                        </Button>
                      </StyledTableCellAction>
                    </StyledTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </div>
  );
}
