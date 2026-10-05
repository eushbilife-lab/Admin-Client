import { Card } from "@mui/material";

export default function TableWrapper({ children }: any) {
  return (
    <Card
      className="admin-table"
      sx={{
        boxShadow: "none",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        backgroundColor: "var(--color-paper)",
        overflow: "hidden",
      }}
    >
      {children}
    </Card>
  );
}
