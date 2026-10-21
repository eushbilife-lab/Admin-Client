import { Box, CircularProgress } from "@mui/material";

type CircleLoaderProps = {
  /** Use inside modals / forms (relative to parent). Default: page overlay. */
  inline?: boolean;
  size?: number;
};

/**
 * Full-page / modal blocking loader for mutations (save, delete).
 * Prefer TableWrapper `refreshing` + TableLoadingWrapper for list fetches.
 */
export default function CircleLoader({
  inline = false,
  size = 36,
  ...props
}: CircleLoaderProps & Record<string, unknown>) {
  return (
    <Box
      aria-busy="true"
      aria-live="polite"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: inline ? "absolute" : "fixed",
        zIndex: 9999,
        backdropFilter: "blur(6px) saturate(1.05)",
        background: inline
          ? "rgba(255, 255, 255, 0.55)"
          : "color-mix(in srgb, var(--color-paper, #f7f8f5) 55%, rgba(20, 24, 20, 0.28))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "all",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size + 28,
          height: size + 28,
          borderRadius: "50%",
          backgroundColor:
            "color-mix(in srgb, var(--color-paper) 94%, white)",
          border:
            "1px solid color-mix(in srgb, var(--color-leaf) 16%, var(--border-color, #d8ddd4))",
          boxShadow: "0 10px 28px rgba(10, 10, 10, 0.1)",
        }}
      >
        <CircularProgress
          size={size}
          thickness={4}
          sx={{ color: "var(--color-science)" }}
          {...props}
        />
      </Box>
    </Box>
  );
}
