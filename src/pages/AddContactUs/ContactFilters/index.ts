import PageSize from "@core/api-components/PageSize";
import DateRangePickerRedux from "@core/redux-fields/DateRangePickerRedux";
import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import { ContactType } from "redux/slices/contact";
import { pageSize } from "utils/normalize.util";
import { dateRangeFilter } from "utils/validate.util";

export { default } from "./ContactFilters";
export interface ContactFiltersProps {
	type: ContactType;
}
export const fields: ReduxFormField[] = [

	{
		name: "date",
		label: "Date",
		validate: [dateRangeFilter],
		component: DateRangePickerRedux,
		cellProps: { md: 6 },
		DateRangePickerProps: {
			onChange: () => {},
			InputFieldProps: {},
			value: { date: ["", ""], error: ["", ""] },
		},
	},
	{
		name: "page_size",
		label: "Page Size",
		normalize: pageSize,
		component: PageSize,
		cellProps: { sm: 6, md: 3 },
		PageSizeProps: { form: "ContactFiltersForm" },
	},
];
