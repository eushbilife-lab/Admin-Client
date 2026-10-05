import { Box } from "@mui/material";
import "./Chip.css";
// import { styled } from "@mui/system";

// const useStyles: any = styled((theme: any) => ({
// 	primary: {
// 		color: theme.palette.primary,
// 	},
// 	success: {
// 		color: theme.palette.success.main,
// 	},
// 	info: {
// 		color: theme.palette.info.main,
// 	},
// 	warning: {
// 		color: theme.palette.warning.main,
// 	},
// 	error: {
// 		color: theme.palette.error.main,
// 	},
// 	custom: {
// 		color: "#42818c",
// 	},
// }));
const statusCheck: any = {
  approved: "success.main",
  Verified: "primary.main",
  "Not Verified": "error.main",
};

export default function Chip({ status, ...rest }: any) {
  return (
    <Box
      component={"span"}
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        padding: "4px 0",
        whiteSpace: "nowrap",
        fontWeight: 600,
        textTransform: "capitalize",
        textAlign: "center",
        cursor: "pointer",
        color: statusCheck[status],
      }}
      {...rest}
    >
      {status === "paused" ? "on wait" : status}.
    </Box>
  );
}
