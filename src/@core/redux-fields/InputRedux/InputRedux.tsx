import Input from "@core/basic-components/Input";

export default function InputRedux({
  input,
  InputProps,
  handleBlur,
  handleFocus,
  meta: { error, touched, invalid, ...extra },
  ...rest
}: any) {
  return (
    <Input
      {...InputProps}
      {...rest}
      {...input}
      helperText={touched && invalid && error}
      error={touched && invalid && error && true}
      onBlur={(e) => {
        handleBlur?.(e);
        e.preventDefault();
      }}
      onFocus={(e) => {
        handleFocus?.(e);
        e.preventDefault();
      }}
    />
  );
}
