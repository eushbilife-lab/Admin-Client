import * as XLSX from "xlsx";

// Modified exportTable to handle both single-sheet and multi-sheet logic based on the file_name
export const exportTable = (
	data: any[] | { data: any[]; options: any; sheetName: string }[], // Adjusted to support both types of input
	options: any,
	file_name: string
) => {
	const workbook = XLSX.utils.book_new();

	if (file_name === "Revenues") {
		// Multi-sheet logic for 'revenue' file
		(data as { data: any[]; options: any; sheetName: string }[]).forEach(
			(dataSet) => {
				const { data, options, sheetName } = dataSet;

				// Prepare sheet data for each dataset
				const sheet_data: any[] = [];
				for (const el of data) {
					let obj: any = {};
					for (const key in options) {
						if (Object.prototype.hasOwnProperty.call(options, key)) {
							const element = options[key];
							if (element) obj[key] = el[key];
						}
					}
					sheet_data.push(obj);
				}

				// Convert data to worksheet and append to workbook
				const worksheet = XLSX.utils.json_to_sheet(sheet_data);
				XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
			}
		);
	} else {
		// Single-sheet logic for any other file
		const sheet_data: any[] = [];

		for (const el of data as any[]) {
			let obj: any = {};
			for (const key in options) {
				if (Object.prototype.hasOwnProperty.call(options, key)) {
					const element = options[key];
					if (element) obj[key] = el[key];
				}
			}
			sheet_data.push(obj);
		}

		const worksheet = XLSX.utils.json_to_sheet(sheet_data);
		XLSX.utils.book_append_sheet(workbook, worksheet, "data");
	}

	// Write the workbook to a file
	XLSX.writeFile(workbook, `${file_name}.xlsx`);
};