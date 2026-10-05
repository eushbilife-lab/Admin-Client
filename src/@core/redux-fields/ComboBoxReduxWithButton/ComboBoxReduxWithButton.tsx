import ComboBoxWithButton from "@core/basic-components/ComboBoxWithButton";

export default function ComboBoxReduxWithButton({
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
    <ComboBoxWithButton
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
