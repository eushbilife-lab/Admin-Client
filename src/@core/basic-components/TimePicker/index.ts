import { InputProps } from "@core/basic-components/Input/Input";
import { TimePickerProps as BaseTimePickerProps } from "@mui/x-date-pickers/TimePicker";
// import { TimePickerProps as BaseTimePickerProps } from "@mui/lab";

export { default } from "./TimePicker";

export interface TimePickerOwnProps {
	editable?: boolean;
	InputFieldProps: InputProps;
	value: {
		date: any;
		error: boolean;
	};
}

export type TimePickerProps = TimePickerOwnProps &
	Omit<BaseTimePickerProps<Date>, "renderInput">;
