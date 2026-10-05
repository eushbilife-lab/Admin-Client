import TimePicker from "@core/basic-components/TimePicker";
import { useTranslation } from "react-i18next";

export default function TimePickerRedux({
  input,
  label,
  InputProps,
  handleBlur,
  handleFocus,
  TimePickerProps,
  meta: { error, touched, invalid },
  ...rest
}: any) {
  const { onChange, ...inputRest } = input;
  const { t } = useTranslation();
  return (
    <TimePicker
      {...TimePickerProps}
      {...rest}
      value={input.value}
      label={t(label)}
      onChange={onChange}
      InputFieldProps={{
        ...TimePickerProps?.InputFieldProps,
        ...InputProps,
        ...inputRest,
        label: t(label),
        helperText: touched && invalid && error,
        error: touched && invalid && error && true,
        onBlur: (e: any) => {
          handleBlur?.(e);
          e.preventDefault();
        },
        onFocus: (e: any) => {
          handleFocus?.(e);
          e.preventDefault();
        },
      }}
    />
  );
}
