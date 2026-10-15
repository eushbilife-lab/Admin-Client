import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Thin progress bar shown briefly on client-side route changes. */
export default function RouteProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
      }}
      aria-hidden
    >
      <LinearProgress color="primary" />
    </Box>
  );
}
