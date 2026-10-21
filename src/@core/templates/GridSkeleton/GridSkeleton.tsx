import { Box, Skeleton } from "@mui/material";

type GridSkeletonProps = {
  cards?: number;
  /** CSS grid template, e.g. repeat(auto-fill, minmax(220px, 1fr)) */
  columns?: string;
};

export default function GridSkeleton({
  cards = 8,
  columns = "repeat(auto-fill, minmax(220px, 1fr))",
}: GridSkeletonProps) {
  return (
    <Box
      aria-busy="true"
      sx={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: 2,
        width: "100%",
      }}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            border:
              "1px solid color-mix(in srgb, var(--color-leaf) 12%, var(--border-color, #d8ddd4))",
            backgroundColor: "var(--color-paper, #fff)",
          }}
        >
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={140}
            sx={{
              bgcolor: "color-mix(in srgb, var(--color-leaf) 8%, #ecefe9)",
            }}
          />
          <Box sx={{ p: 1.75, display: "grid", gap: 1 }}>
            <Skeleton
              animation="wave"
              variant="rounded"
              height={12}
              width="32%"
              sx={{ borderRadius: "999px" }}
            />
            <Skeleton animation="wave" variant="rounded" height={18} width="78%" />
            <Skeleton animation="wave" variant="rounded" height={14} width="55%" />
            <Skeleton animation="wave" variant="rounded" height={16} width="40%" />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
