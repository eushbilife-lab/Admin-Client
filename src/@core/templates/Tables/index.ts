import { TableRow, TableCell, tableCellClasses } from "@mui/material";
import { styled } from "@mui/system";

export { default } from "./Tables";

export const adminTableSx = {
  minWidth: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  "& .MuiTableCell-root": {
    borderBottom: "1px solid var(--border-color)",
    padding: "15px 16px",
    textAlign: "left",
  },
  "& .MuiTableHead .MuiTableCell-root": {
    background: "linear-gradient(180deg, var(--color-canvas) 0%, #eef4e0 100%)",
    fontSize: "0.72rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    fontWeight: 700,
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 2,
    borderBottom: "1px solid color-mix(in srgb, var(--color-leaf) 18%, var(--border-color))",
    paddingTop: "14px",
    paddingBottom: "14px",
  },
  "& .MuiTableBody .MuiTableRow-root": {
    transition: "background-color 140ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  "& .MuiTableBody .MuiTableRow-root:hover": {
    backgroundColor: "rgba(245, 249, 235, 0.85)",
  },
  "& .MuiTableBody .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: "none",
  },
};

export const StyledTableRow = styled(TableRow)({
  background: "var(--color-paper)",
  "&:hover": {
    background: "rgba(245, 249, 235, 0.85)",
  },
});

export const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    color: "var(--text-secondary)",
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "var(--color-ink)",
    verticalAlign: "middle",
  },
});

export const StyledTableCell_vertical = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    paddingTop: 0,
    color: "var(--color-ink)",
    fontWeight: 800,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "var(--color-ink)",
    verticalAlign: "baseline",
  },
});

export const StyledTableCellAction = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    color: "var(--text-secondary)",
    fontWeight: 700,
    textAlign: "right",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
});
