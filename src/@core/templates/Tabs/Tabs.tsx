import { Box } from "@mui/system";
import { TabPanelProps, TabsProps } from ".";
import ReplayIcon from "@mui/icons-material/Replay";
import {
	IconButton,
	Tab,
	Tabs as BaseTabs,
	Typography,
} from "@mui/material";

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ pt: 2, pb: 2 }}>
					<Typography component={"div"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default function sTabs({
	value,
	tabs,
	onChange,
	onRefresh,
	showRefresh,
}: TabsProps) {
	return (
		<div style={{ position: "relative" }}>
			{showRefresh && (
				<IconButton
					edge="end"
					aria-label="refresh"
					onClick={() => onRefresh?.()}
					sx={{
						zIndex: 2,
						right: "12px",
						cursor: "pointer",
						position: "absolute",
						top: { xs: "-33px", sm: "5px" },
					}}
				>
					<ReplayIcon color="primary" />
				</IconButton>
			)}
			<Box
				sx={{
					borderBottom: "1px solid var(--border-color)",
					"& .MuiTabs-indicator": {
						height: 3,
						borderRadius: "3px 3px 0 0",
					},
					"& .MuiButtonBase-root": {
						padding: "10px 16px",
						minWidth: "unset",
						fontWeight: 700,
						fontSize: "0.875rem",
					},
				}}
			>
				<BaseTabs
					value={value}
					variant="scrollable"
					aria-label="admin tabs"
					onChange={(_e, tab) => onChange(tab)}
				>
					{tabs.map(({ label, icon }: any, index: any) => (
						<Tab
							key={index}
							label={label}
							icon={icon || null}
							iconPosition="start"
							sx={{ textTransform: "none" }}
							{...a11yProps(index)}
						/>
					))}
				</BaseTabs>
			</Box>

			{tabs.map(({ element }: any, index: number) => (
				<TabPanel value={value} index={index} key={index}>
					{element}
				</TabPanel>
			))}
		</div>
	);
}
