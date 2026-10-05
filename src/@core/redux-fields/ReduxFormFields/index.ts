import { Grid } from "@mui/material";
import { InputProps } from "@core/basic-components/Input/Input";
import { SelectProps } from "@core/basic-components/Select/Select";
import { RadioGroupProps } from "@core/basic-components/RadioGroup";
import { DatePickerProps } from "@core/basic-components/DatePicker";
import { TimePickerProps } from "@core/basic-components/TimePicker";
import { ComboBoxProps } from "@core/basic-components/ComboBox/ComboBox";
import { DateRangePickerProps } from "@core/basic-components/DateRangePicker";
import { PhoneInputProps } from "@core/basic-components/PhoneInput/PhoneInput";
import { FileUploadProps } from "@core/basic-components/FileUpload/FileUpload";
import { CheckBoxProps } from "@core/basic-components/BaseCheckbox/BaseCheckbox";
import { PageSizeProps } from "@core/api-components/PageSize";
export { default } from "./ReduxFormFields";

export type CellProps = React.ComponentProps<typeof Grid>;

type Normalizer = (
  value: any,
  previousValue?: any,
  allValues?: any,
  previousAllValues?: any
) => any;

type Validator = (value: any, allValues?: any, props?: any, name?: any) => any;

interface CommonFieldProps {
  name: string;
  label: string;
  cellProps?: CellProps;
  component: React.ElementType;
  upperLayout?: boolean
  // isUpdateMode?:boolean
}

type FieldProps = CommonFieldProps & {
  hideError?: boolean;

  InputProps?: InputProps;
  SelectProps?: SelectProps;
  PageSizeProps?: PageSizeProps;
  ComboBoxProps?: ComboBoxProps;
  CheckBoxProps?: CheckBoxProps;
  RadioGroupProps?: RadioGroupProps;
  PhoneInputProps?: PhoneInputProps;
  DatePickerProps?: DatePickerProps;
  TimePickerProps?: TimePickerProps;
  FileUploadProps?: FileUploadProps;
  DateRangePickerProps?: DateRangePickerProps;

  normalize?: Normalizer | undefined;
  validate?: Validator | Validator[] | undefined;

  fieldsArray?: never;
  reduxFormComponent?: never;
  heading?: string; 
};

type CommonFormSectionFieldArrayProps = {
  validate?: never;
  normalize?: never;
  hideError?: never;
  cell?: any;
  addMore?: boolean;
  title?: string;
  InputProps?: never;
  SelectProps?: never;
  PageSizeProps?: never;
  ComboBoxProps?: never;
  CheckBoxProps?: never;
  RadioGroupProps?: never;
  PhoneInputProps?: never;
  DatePickerProps?: never;
  TimePickerProps?: never;
  FileUploadProps?: never;
  fieldsArray: ReduxFormField[];
};

type FormSectionProps = CommonFieldProps &
  CommonFormSectionFieldArrayProps & {
    reduxFormComponent: "FormSection";
  };

  type FieldArrayProps = CommonFieldProps &
  CommonFormSectionFieldArrayProps & {
    reduxFormComponent: "FieldArray";
  };

export type ReduxFormField = FieldProps | FormSectionProps | FieldArrayProps;

export interface ReduxFormFieldProps {
  member?: string;
  fields: ReduxFormField[];
}
