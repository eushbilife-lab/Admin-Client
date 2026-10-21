import { Card } from "@mui/material";

export default function TableWrapper({ children }: any) {
  return (
    <Card
      className="admin-table data-table__shell"
      sx={{
        boxShadow:
          "0 1px 2px rgba(10, 10, 10, 0.04), 0 10px 28px rgba(10, 10, 10, 0.045)",
        border: "1px solid color-mix(in srgb, var(--color-leaf) 12%, var(--border-color))",
        borderRadius: "16px",
        backgroundColor: "var(--color-paper)",
        overflow: "hidden",
        transition: "box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          boxShadow:
            "0 2px 4px rgba(10, 10, 10, 0.05), 0 14px 36px rgba(10, 10, 10, 0.06)",
        },
      }}
    >
      {children}
    </Card>
  );
}
