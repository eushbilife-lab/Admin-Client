// import { Box } from "@mui/system";
// import { TabPanelProps, TabsProps } from ".";
// import ReplayIcon from "@mui/icons-material/Replay";
// import { IconButton, Tab, Tabs as BaseTabs, Typography } from "@mui/material";
// // import Theme from "theme";
// import Button from "@core/basic-components/Button";

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ pt: 2, pb: 2 }}>
//           <Typography component={"div"}>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// export default function Tabs({
//   value,
//   tabs,
//   onChange,
//   onRefresh,
//   showRefresh,
//   btn,
//   btnTitle,
//   onBtnClick,
// }: TabsProps) {
//   return (
//     <div style={{ position: "relative" }}>
//       {showRefresh && (
//         <IconButton
//           edge="end"
//           aria-label="refresh"
//           onClick={() => onRefresh?.()}
//           sx={{
//             zIndex: 2,
//             right: "12px",
//             cursor: "pointer",
//             position: "absolute",
//             top: { xs: "-33px", sm: "5px" },
//           }}
//         >
//           <ReplayIcon color="primary" />
//         </IconButton>
//       )}
//       <Box sx={{ mt: 1 }}>
//         <BaseTabs
//           value={value}
//           sx={{
//             background: "white",
//             borderRadius: 1,
//             alignItems: "center",
//             "& .MuiTabs-indicator": {
//               display: "none",
//             },
//             "& .Mui-selected": {
//               backgroundColor: Theme.palette.primary.main,
//               color: `#ffff !important`,
//             },
//             "& .MuiTab-root": {
//               minWidth: 65,
//               minHeight: 38,
//               paddingTop: Theme.spacing(1.5),
//               paddingBottom: Theme.spacing(1.5),
//               borderRadius: 1,
//               [Theme.breakpoints.up("sm")]: { minWidth: 130 },
//             },
//           }}
//           variant="scrollable"
//           aria-label="basic tabs example"
//           onChange={(_e, tab) => onChange(tab)}
//         >
//           {tabs.map(({ label }: any, index: any) => (
//             <Tab
//               key={index}
//               label={label}
//               sx={{ textTransform: "capitalize" }}
//               {...a11yProps(index)}
//             />
//           ))}
//           {btn && (
//             <Button
//               type="button"
//               variant="outlined"
//               onClick={onBtnClick}
//               sx={{ ml: "auto", mr: 1 }}
//             >
//               {btnTitle}
//             </Button>
//           )}
//         </BaseTabs>
//       </Box>

//       {tabs.map(({ element }: any, index: number) => (
//         <TabPanel value={value} index={index} key={index}>
//           {element}
//         </TabPanel>
//       ))}
//     </div>
//   );
// }

import React from 'react'

const TabsButtons = () => {
  return (
    <div>TabsButtons</div>
  )
}

export default TabsButtons