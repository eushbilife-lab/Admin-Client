import PhoneInput from "@core/basic-components/PhoneInput";

export default function PhoneInputRedux({
  id,
  input,
  label,
  handleBlur,
  handleFocus,
  PhoneInputProps,
  meta: { error, touched, invalid },
}: any) {
  const rawValue = input?.value;
  const value =
    typeof rawValue === "string"
      ? rawValue
      : rawValue?.value || rawValue?.number || "";

  return (
    <PhoneInput
      {...PhoneInputProps}
      id={id}
      name={input?.name}
      specialLabel={label || "Phone"}
      value={value}
      helperText={touched && invalid && error}
      error={touched && invalid && error && true}
      onBlur={(e: any) => {
        handleBlur?.(e);
        e.preventDefault();
      }}
      onFocus={(e: any) => {
        handleFocus?.(e);
        e.preventDefault();
      }}
      onChange={(value: any, data: any, _e: any, formattedValue: any) => {
        input.onChange({
          value,
          data: {
            countryCode: data?.countryCode,
            dialCode: data?.dialCode,
            name: data?.name,
          },
          formattedValue,
        });
      }}
    />
  );
}
