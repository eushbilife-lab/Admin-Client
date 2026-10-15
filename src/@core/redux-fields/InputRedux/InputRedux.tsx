import Input from "@core/basic-components/Input";

export default function InputRedux({
  input,
  InputProps,
  handleBlur,
  handleFocus,
  hint,
  meta: { error, touched, invalid } = {} as any,
  ...rest
}: any) {
  const showError = Boolean(touched && invalid && error);
  return (
    <Input
      {...InputProps}
      {...rest}
      {...input}
      helperText={showError ? error : hint || InputProps?.helperText || ""}
      error={showError}
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
