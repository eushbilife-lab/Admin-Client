import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import TableWrapper from "@core/templates/TableWrapper";
import {
  StyledTableCell,
  StyledTableCellAction,
  adminTableSx,
} from "@core/templates/Tables";
import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  label: string;
  width?: string | number;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
  action?: boolean;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  stickyHeader?: boolean;
};

const PAGE_SIZES = [10, 20, 50, 100];

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyMessage = "No records found.",
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  toolbar,
  stickyHeader = true,
}: DataTableProps<T>) {
  const pageCount = Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  const showSearch = typeof onSearchChange === "function";

  return (
    <Box className="data-table">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
        className="table-toolbar"
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flex: 1 }}>
          {showSearch ? (
            <TextField
              size="small"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              sx={{ minWidth: { sm: 240 }, maxWidth: 360 }}
            />
          ) : null}
          {toolbar}
        </Stack>
        {onLimitChange ? (
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel id="data-table-limit">Rows</InputLabel>
            <Select
              labelId="data-table-limit"
              label="Rows"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {PAGE_SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
      </Stack>

      <TableWrapper>
        <TableContainer sx={{ maxHeight: "70vh", overflowX: "auto" }}>
          <Table stickyHeader={stickyHeader} sx={adminTableSx} aria-label="data table">
            <TableHead>
              <TableRow>
                {columns.map((col) => {
                  const Cell = col.action ? StyledTableCellAction : StyledTableCell;
                  return (
                    <Cell key={col.id} align={col.align} sx={{ width: col.width }}>
                      {col.label}
                    </Cell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      {columns.map((col) => (
                        <StyledTableCell key={col.id}>
                          <Skeleton variant="text" height={28} />
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))
                : null}

              {!loading && error ? (
                <TableRow>
                  <StyledTableCell colSpan={columns.length}>
                    <Stack spacing={1} alignItems="flex-start" sx={{ py: 2 }}>
                      <Typography color="error">{error}</Typography>
                      {onRetry ? (
                        <button type="button" className="link-btn" onClick={onRetry}>
                          Retry
                        </button>
                      ) : null}
                    </Stack>
                  </StyledTableCell>
                </TableRow>
              ) : null}

              {!loading && !error && rows.length === 0 ? (
                <TableRow>
                  <StyledTableCell colSpan={columns.length}>
                    <Typography color="text.secondary" sx={{ py: 3 }}>
                      {emptyMessage}
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              ) : null}

              {!loading &&
                !error &&
                rows.map((row) => (
                  <TableRow key={rowKey(row)} hover>
                    {columns.map((col) => {
                      const Cell = col.action ? StyledTableCellAction : StyledTableCell;
                      return (
                        <Cell key={col.id} align={col.align}>
                          {col.render(row)}
                        </Cell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(total > 0 || onPageChange) && (
          <div className="pagination-list-bottom">
            <p>
              {total > 0
                ? `${total} ${total === 1 ? "item" : "items"}`
                : ""}
            </p>
            {onPageChange && total > 0 ? (
              <Pagination
                variant="outlined"
                color="primary"
                page={page}
                count={pageCount}
                disabled={loading}
                onChange={(_e, next) => onPageChange(next)}
              />
            ) : null}
          </div>
        )}
      </TableWrapper>
    </Box>
  );
}
