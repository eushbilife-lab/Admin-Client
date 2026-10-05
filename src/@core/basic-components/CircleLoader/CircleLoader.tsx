import { Box, CircularProgress } from "@mui/material";

export default function CircleLoader(props: any) {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
        background: "rgba(31, 31, 31, 0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "var(--color-science)" }} {...props} />
    </Box>
  );
}
