import { InputProps } from "@core/basic-components/Input/Input";
import { DateTimePickerProps as BaseDateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";

export { default } from "./DateTimePicker";

export interface DateTimePickerOwnProps {
  editable?: boolean;
  InputFieldProps: InputProps;
  value: { date: any; error: boolean };
}

export type DateTimePickerProps = DateTimePickerOwnProps &
  Omit<BaseDateTimePickerProps<Date>, "renderInput">;
