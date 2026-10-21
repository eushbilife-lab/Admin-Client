import { useMemo, useState } from "react";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import TableWrapper from "@core/templates/TableWrapper";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  countByStatus,
  filterByStatus,
  matchesSearch,
  sortByName,
  type NameSort,
  type StatusFilter,
} from "@core/templates/CatalogToolbar/catalogList.util";
import { englishName } from "utils/localizedData.util";

export type LibraryRow = {
  _id: string;
  name?: string;
  en?: { name?: string };
  status?: string;
  sign?: string;
  code?: string;
  content?: string;
};

type LibraryPanelProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  heading?: string;
  blurb?: string;
  addLabel: string;
  empty: string;
  rows: LibraryRow[];
  loading?: boolean;
  refreshLoader?: boolean;
  count?: number;
  page?: number;
  pageSize?: number;
  extraColumn?: "sign" | "ingredient";
  onAdd: () => void;
  onEdit: (row: LibraryRow) => void;
  onPage?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** When set, status chips hit the API via parent instead of filtering locally. */
  statusValue?: StatusFilter;
  onStatusChange?: (value: StatusFilter) => void;
  searchPlaceholder?: string;
  wrapPage?: boolean;
};

export default function LibraryPanel({
  kicker,
  title,
  subtitle,
  heading,
  blurb,
  addLabel,
  empty,
  rows,
  loading,
  refreshLoader,
  count = 0,
  page = 1,
  pageSize = 10,
  extraColumn,
  onAdd,
  onEdit,
  onPage,
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  searchPlaceholder = "Search… (⌘K)",
  wrapPage = false,
}: LibraryPanelProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [localStatus, setLocalStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<NameSort>("az");

  const search = onSearchChange ? searchValue ?? "" : localSearch;
  const setSearch = onSearchChange || setLocalSearch;
  const status = onStatusChange ? statusValue ?? "all" : localStatus;
  const setStatus = onStatusChange || setLocalStatus;
  const serverDriven = Boolean(onSearchChange);

  const rowName = (row: LibraryRow) =>
    englishName(row) || row.name || row.code || "";

  const statusCounts = useMemo(() => countByStatus(rows), [rows]);

  const visible = useMemo(() => {
    let list = rows;
    if (!onSearchChange) {
      list = list.filter((row) =>
        matchesSearch([rowName(row), row.code, row.content, row.sign], search)
      );
    }
    if (!onStatusChange) {
      list = filterByStatus(list, status);
    }
    return sortByName(list, rowName, sort);
  }, [rows, search, status, sort, onSearchChange, onStatusChange]);

  const body = (
    <section>
      <CatalogToolbar
        hint={blurb}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
        searchAriaLabel={searchPlaceholder}
        sort={sort}
        onSortChange={(v) => setSort(v as NameSort)}
        sortOptions={[
          { value: "az", label: "Sort A–Z" },
          { value: "za", label: "Sort Z–A" },
        ]}
        meta={
          <>
            <CatalogMetaPill>{count || rows.length} total</CatalogMetaPill>
            <CatalogMetaPill>{visible.length} showing</CatalogMetaPill>
          </>
        }
        chips={[
          { id: "all", label: "All" },
          { id: "active", label: "Active", count: statusCounts.active },
          { id: "inactive", label: "Inactive", count: statusCounts.inactive },
        ]}
        activeChip={status}
        onChipChange={(id) => setStatus(id as StatusFilter)}
        actions={
          <Button variant="contained" onClick={onAdd}>
            {addLabel}
          </Button>
        }
      />

      {heading ? (
        <h2 className="section-heading" style={{ marginBottom: 10 }}>
          {heading}
        </h2>
      ) : null}

      <TableWrapper
        refreshing={
          !!refreshLoader || (!!loading && rows.length > 0)
        }
      >
        <TableContainer sx={{ maxHeight: "70vh", overflowX: "auto" }}>
          <Table stickyHeader aria-label={heading || title || "library"} sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={extraColumn === "ingredient" ? 5 : extraColumn ? 4 : 3}
              loading={!!loading}
              length={visible.length}
              message={
                search || status !== "all" || serverDriven
                  ? search || status !== "all"
                    ? "No rows match your search or filters."
                    : empty
                  : empty
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  {extraColumn === "ingredient" ? (
                    <StyledTableCell>Code</StyledTableCell>
                  ) : null}
                  {extraColumn === "ingredient" ? (
                    <StyledTableCell>Content</StyledTableCell>
                  ) : null}
                  <StyledTableCell>Status</StyledTableCell>
                  {extraColumn === "sign" ? (
                    <StyledTableCell>Unit</StyledTableCell>
                  ) : null}
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell>
                      {englishName(row) || "Untitled"}
                    </StyledTableCell>
                    {extraColumn === "ingredient" ? (
                      <StyledTableCell>
                        <span className="catalog-key">{row.code || "—"}</span>
                      </StyledTableCell>
                    ) : null}
                    {extraColumn === "ingredient" ? (
                      <StyledTableCell>{row.content || "—"}</StyledTableCell>
                    ) : null}
                    <StyledTableCell>
                      <StatusChip
                        label={row.status || "inactive"}
                        tone={row.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    {extraColumn === "sign" ? (
                      <StyledTableCell>{row.sign || "—"}</StyledTableCell>
                    ) : null}
                    <StyledTableCellAction>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </Button>
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {count > 0 && onPage ? (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "item" : "items"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={page}
              disabled={refreshLoader}
              count={Math.max(1, Math.ceil(count / pageSize))}
              onChange={(_e, next) => onPage(next)}
            />
          </div>
        ) : null}
      </TableWrapper>
    </section>
  );

  if (!wrapPage) return body;

  return (
    <PageShell kicker={kicker} title={title || ""} subtitle={subtitle}>
      {body}
    </PageShell>
  );
}
