import { Skeleton, TableBody, TableHead, TableRow } from "@mui/material";
import {
  StyledTableRow,
  StyledTableCell,
  StyledTableCellAction,
} from "@core/templates/Tables";
import { TableLoaderProps } from ".";

const WIDTHS = ["72%", "48%", "58%", "40%", "64%", "52%", "44%", "68%"];

export default function TableLoader({
  rows = 8,
  coloumns = 4,
  showHeader = true,
}: TableLoaderProps) {
  const cols = Math.max(1, coloumns);

  return (
    <>
      {showHeader ? (
        <TableHead>
          <TableRow>
            {Array.from({ length: cols }).map((_, i) => {
              const isAction = i === cols - 1;
              const Cell = isAction ? StyledTableCellAction : StyledTableCell;
              return (
                <Cell key={`h-${i}`}>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={14}
                    width={isAction ? 48 : WIDTHS[i % WIDTHS.length]}
                    sx={{
                      bgcolor: "color-mix(in srgb, var(--color-leaf) 10%, #e8ebe6)",
                      borderRadius: "6px",
                    }}
                  />
                </Cell>
              );
            })}
          </TableRow>
        </TableHead>
      ) : null}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <StyledTableRow key={`r-${rowIndex}`}>
            {Array.from({ length: cols }).map((_, colIndex) => {
              const isAction = colIndex === cols - 1;
              const Cell = isAction ? StyledTableCellAction : StyledTableCell;
              const width =
                isAction
                  ? 56
                  : WIDTHS[(rowIndex + colIndex) % WIDTHS.length];
              return (
                <Cell key={`c-${rowIndex}-${colIndex}`}>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    height={isAction ? 28 : 16}
                    width={width}
                    sx={{
                      bgcolor:
                        rowIndex % 2 === 0
                          ? "color-mix(in srgb, var(--color-leaf) 8%, #ecefe9)"
                          : "color-mix(in srgb, var(--color-leaf) 5%, #f2f4f0)",
                      borderRadius: isAction ? "8px" : "6px",
                      maxWidth: "100%",
                    }}
                  />
                </Cell>
              );
            })}
          </StyledTableRow>
        ))}
      </TableBody>
    </>
  );
}
