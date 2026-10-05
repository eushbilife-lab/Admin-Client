import ComboBox from "@core/basic-components/ComboBox";

export default function ComboBoxRedux({
  input,
  label,
  InputProps,
  handleBlur,
  handleFocus,
  ComboBoxProps,
  meta: { error, touched, invalid },
  ...rest
}: any) {
  const { onChange, ...inputRest } = input;
  return (
    <ComboBox
      {...ComboBoxProps}
      {...rest}
      value={input?.value ? input?.value || [] : ComboBoxProps?.multiple ? [] : null}
      onChange={(_e, value) => onChange(value)}
      InputProps={{
        label,
        ...InputProps,
        ...inputRest,
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
