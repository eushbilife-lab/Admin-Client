import ComboBox from "@core/basic-components/ComboBox";

/** Props that must not reach MUI Autocomplete / DOM. */
const STRIP = new Set([
  "cascadeParent",
  "validate",
  "normalize",
  "format",
  "parse",
  "warn",
  "withRef",
  "forwardRef",
  "immutableProps",
  "cellProps",
  "reduxFormComponent",
  "fieldsArray",
  "upperLayout",
  "FileUploadProps",
  "SelectProps",
  "PageSizeProps",
  "heading",
]);

export default function ComboBoxRedux({
  input,
  label,
  InputProps,
  handleBlur,
  handleFocus,
  ComboBoxProps,
  meta: { error, touched, invalid } = {} as any,
  options,
  disabled,
  ...rest
}: any) {
  const { onChange, value, name, onBlur, onFocus } = input || {};

  const cleanRest: Record<string, any> = {};
  for (const [key, val] of Object.entries(rest || {})) {
    if (!STRIP.has(key)) cleanRest[key] = val;
  }

  const isMultiple = Boolean(ComboBoxProps?.multiple);
  const resolvedOptions = options ?? ComboBoxProps?.options ?? [];
  const resolvedValue = (() => {
    if (value === undefined || value === null || value === "") {
      return isMultiple ? [] : null;
    }
    return value;
  })();

  return (
    <ComboBox
      {...ComboBoxProps}
      {...cleanRest}
      name={name}
      options={resolvedOptions}
      disabled={disabled ?? ComboBoxProps?.disabled}
      value={resolvedValue}
      onChange={(_e: any, next: any) => onChange?.(next)}
      InputProps={{
        label,
        ...InputProps,
        helperText: touched && invalid && error,
        error: Boolean(touched && invalid && error),
        onBlur: (e: any) => {
          handleBlur?.(e);
          onBlur?.(e);
        },
        onFocus: (e: any) => {
          handleFocus?.(e);
          onFocus?.(e);
        },
      }}
    />
  );
}
