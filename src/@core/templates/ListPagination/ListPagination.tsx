import { MenuItem, Pagination, TextField } from "@mui/material";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

type Props = {
  count: number;
  page: number;
  pageSize: number;
  disabled?: boolean;
  label?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
};

export default function ListPagination({
  count,
  page,
  pageSize,
  disabled,
  label = "items",
  onPageChange,
  onPageSizeChange,
  className = "list-pagination",
}: Props) {
  const size = Math.max(1, Number(pageSize) || 10);
  const total = Math.max(0, Number(count) || 0);
  const pages = Math.max(1, Math.ceil(total / size) || 1);
  const safePage = Math.min(Math.max(1, Number(page) || 1), pages);
  const from = total === 0 ? 0 : (safePage - 1) * size + 1;
  const to = Math.min(safePage * size, total);

  if (total <= 0) return null;

  return (
    <div className={className}>
      <div className="list-pagination__meta">
        <span>
          Showing <strong>{from}</strong>–<strong>{to}</strong> of{" "}
          <strong>{total}</strong> {label}
        </span>
        {onPageSizeChange ? (
          <TextField
            select
            size="small"
            label="Per page"
            value={size}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="list-pagination__size"
            InputLabelProps={{ shrink: true }}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </div>
      <Pagination
        variant="outlined"
        color="primary"
        shape="rounded"
        size="medium"
        page={safePage}
        count={pages}
        disabled={disabled}
        siblingCount={2}
        boundaryCount={1}
        showFirstButton
        showLastButton
        onChange={(_e, next) => onPageChange(next)}
      />
    </div>
  );
}
