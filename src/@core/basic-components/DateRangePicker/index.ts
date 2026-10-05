import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { InputProps } from "@core/basic-components/Input/Input";
import { CellProps } from "@core/redux-fields/ReduxFormFields";

export { default } from "./DateRangePicker";

export interface DateRangePickerOwnProps {
	editable?: boolean;
	InputCellProps?: CellProps;
	InputFieldProps: InputProps;
	onChange: (date: any) => void;
	value: { date: [any, any]; error: [any, any] };
}

export type DateRangePickerProps = DateRangePickerOwnProps &
	Omit<
		React.ComponentProps<typeof DateRangePicker>,
		"renderInput" | "value"
	>;
