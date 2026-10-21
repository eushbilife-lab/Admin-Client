import { Box, Card, CircularProgress } from "@mui/material";

type TableWrapperProps = {
  children: React.ReactNode;
  /** Soft overlay while paginating / filtering without tearing down rows. */
  refreshing?: boolean;
};

export default function TableWrapper({
  children,
  refreshing = false,
}: TableWrapperProps) {
  return (
    <Card
      className="admin-table data-table__shell"
      sx={{
        position: "relative",
        boxShadow:
          "0 1px 2px rgba(10, 10, 10, 0.04), 0 10px 28px rgba(10, 10, 10, 0.045)",
        border:
          "1px solid color-mix(in srgb, var(--color-leaf) 12%, var(--border-color))",
        borderRadius: "16px",
        backgroundColor: "var(--color-paper)",
        overflow: "hidden",
        transition:
          "box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease",
        "&:hover": {
          boxShadow:
            "0 2px 4px rgba(10, 10, 10, 0.05), 0 14px 36px rgba(10, 10, 10, 0.06)",
        },
      }}
    >
      {children}
      {refreshing ? (
        <Box
          aria-busy="true"
          aria-live="polite"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            pt: 6,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-paper) 72%, transparent) 0%, color-mix(in srgb, var(--color-paper) 45%, transparent) 100%)",
            backdropFilter: "saturate(1.05) blur(1.5px)",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              px: 1.75,
              py: 1,
              borderRadius: "999px",
              border:
                "1px solid color-mix(in srgb, var(--color-leaf) 18%, var(--border-color))",
              backgroundColor:
                "color-mix(in srgb, var(--color-paper) 92%, white)",
              boxShadow: "0 8px 24px rgba(10, 10, 10, 0.08)",
              pointerEvents: "none",
            }}
          >
            <CircularProgress
              size={18}
              thickness={4.5}
              sx={{ color: "var(--color-science)" }}
            />
            <Box
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: "var(--color-ink, #1f1f1f)",
              }}
            >
              Updating…
            </Box>
          </Box>
        </Box>
      ) : null}
    </Card>
  );
}
