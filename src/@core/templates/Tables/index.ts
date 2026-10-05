import { TableRow, TableCell, tableCellClasses } from "@mui/material";
import { styled } from "@mui/system";

export { default } from "./Tables";

export const adminTableSx = {
  minWidth: "100%",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid var(--border-color)",
    padding: "15px 16px",
    textAlign: "left",
  },
  "& .MuiTableHead .MuiTableCell-root": {
    background: "var(--color-canvas)",
    fontSize: "0.78rem",
    letterSpacing: 0,
    textTransform: "none",
    color: "var(--text-secondary)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  "& .MuiTableBody .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: "none",
  },
};

export const StyledTableRow = styled(TableRow)({
  background: "var(--color-paper)",
  "&:hover": {
    background: "var(--color-canvas)",
  },
});

export const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    color: "var(--text-secondary)",
    fontWeight: 800,
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
    fontWeight: 800,
    textAlign: "right",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
});
