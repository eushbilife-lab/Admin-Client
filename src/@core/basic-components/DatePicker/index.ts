import { InputProps } from "@core/basic-components/Input/Input";
import { DatePickerProps as BaseDatePickerProps } from "@mui/x-date-pickers";
import {
  PickerChangeHandlerContext,
  DateValidationError,
} from "@mui/x-date-pickers";
export { default } from "./DatePicker";

export interface DatePickerOwnProps {
  disableFuture?: boolean;
  size?: "small" | "medium";
  editable?: boolean;
  InputFieldProps: InputProps;
  value: { date: any; error: boolean };
  onChange: (data: any) => void;
}

export type DatePickerProps = DatePickerOwnProps &
  Omit<BaseDatePickerProps<Date>, "renderInput">;
