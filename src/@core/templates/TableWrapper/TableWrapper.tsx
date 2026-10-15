import { Card } from "@mui/material";

export default function TableWrapper({ children }: any) {
  return (
    <Card
      className="admin-table data-table__shell"
      sx={{
        boxShadow: "none",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--border-radius-md)",
        backgroundColor: "var(--color-paper)",
        overflow: "hidden",
      }}
    >
      {children}
    </Card>
  );
}
