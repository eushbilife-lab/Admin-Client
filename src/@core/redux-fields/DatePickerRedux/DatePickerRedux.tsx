import DatePicker from "@core/basic-components/DatePicker";
import { useTranslation } from "react-i18next";

export default function DatePickerRedux({
  input,
  label,
  InputProps,
  handleBlur,
  handleFocus,
  DatePickerProps,
  meta: { error, touched, invalid },
  ...rest
}: any) {
  const { onChange, ...inputRest } = input;
  const { t } = useTranslation();
  return (
    <DatePicker
      {...DatePickerProps}
      {...input}
      {...rest}
      label={t(label)}
      value={input.value}
      onChange={onChange}
      InputFieldProps={{
        variant: "outlined",
        ...InputProps,
        ...inputRest,
        label: t(label),
        helperText: touched && invalid && error,
        error: touched && invalid && error && true,
        onBlur: (e) => {
          handleBlur?.(e);
          e.preventDefault();
        },
        onFocus: (e) => {
          handleFocus?.(e);
          e.preventDefault();
        },
      }}
    />
  );
}
