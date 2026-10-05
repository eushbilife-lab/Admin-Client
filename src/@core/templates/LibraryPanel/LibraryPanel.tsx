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
import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import { englishName } from "utils/localizedData.util";

export type LibraryRow = {
  _id: string;
  en?: { name?: string };
  status?: string;
  sign?: string;
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
  extraColumn?: "sign";
  onAdd: () => void;
  onEdit: (row: LibraryRow) => void;
  onPage?: (page: number) => void;
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
  wrapPage = false,
}: LibraryPanelProps) {
  const body = (
    <section>
      <div className="table-toolbar">
        <div>
          {heading ? <h2 className="section-heading">{heading}</h2> : null}
          {blurb ? <p className="section-blurb">{blurb}</p> : null}
        </div>
        <Button variant="contained" onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      <TableWrapper>
        <TableContainer>
          <Table aria-label={heading || title || "library"} sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={extraColumn ? 4 : 3}
              loading={!!loading}
              length={refreshLoader ? 0 : rows.length}
              message={empty}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  {extraColumn === "sign" ? <StyledTableCell>Unit</StyledTableCell> : null}
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell>{englishName(row) || "Untitled"}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={row.status || "inactive"}
                        tone={row.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    {extraColumn === "sign" ? <StyledTableCell>{row.sign || "—"}</StyledTableCell> : null}
                    <StyledTableCellAction>
                      <Button size="small" variant="text" onClick={() => onEdit(row)}>
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
