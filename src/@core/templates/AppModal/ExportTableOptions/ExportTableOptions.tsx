import { exportTable } from "utils/export.util";
import TableOptionsForm from "./TableOptionsForm";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";

export default function ExportTableOptions() {
	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.modal.data);
	const loading = useAppSelector((state) => state.modal.loading);
	const { file_name, table_data = [] } = data;

	const handleSubmit = async (values: any) => {

		exportTable(table_data, values, file_name);

		dispatch(modalActions.closeModal());
	};

	return (
		<div style={{ position: "relative" }}>
			<h2>Export Table</h2>
			<p>
				{loading
					? "Loading Data"
					: table_data.length > 0
						? "Select coloumns you want to export"
						: "No data to export"}
			</p>
			<TableOptionsForm onSubmit={handleSubmit} />
		</div>
	);
}
