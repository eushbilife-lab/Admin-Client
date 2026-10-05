import DateTimePicker from "@core/basic-components/DateTimePicker";

export default function DateTimePickerRedux({
  input,
  label,
  InputProps,
  handleBlur,
  handleFocus,
  DateTimePickerProps,
  meta: { error, touched, invalid },
  ...rest
}: any) {
  const { onChange, ...inputRest } = input;

  return (
    <DateTimePicker
      {...DateTimePickerProps}
      {...rest}
      value={input.value}
      onChange={onChange}
      InputFieldProps={{
        ...InputProps,
        ...inputRest,
        label,
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
