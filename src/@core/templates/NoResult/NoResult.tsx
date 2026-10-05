import { TableBody } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../Tables";
import { useTranslation } from "react-i18next";

export default function NoResult({ message }: any) {
	const {t}=useTranslation()
	return (
		<TableBody>
			<StyledTableRow>
				<StyledTableCell align="center">
					<div
						style={{
							minHeight: "50vh",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<h3>{t("Sorry! No results found")} :&#40;</h3>
						<p style={{ margin: 0 }}>{message}.</p>
					</div>
				</StyledTableCell>
			</StyledTableRow>
		</TableBody>
	);
}
