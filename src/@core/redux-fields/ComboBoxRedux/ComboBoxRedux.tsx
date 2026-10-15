import ComboBox from "@core/basic-components/ComboBox";
import { isMongoId, optionId, optionLabel } from "utils/selectOption.util";

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
  "hint",
  "input",
  "meta",
  "component",
  "props",
]);

/** Detect blur artifacts: Autocomplete input text (e.g. "Functional Food") wrongly saved as value. */
function isLabelOnlyString(value: string): boolean {
  if (isMongoId(value)) return false;
  // numbers / short codes (processing level, scores, signs) are valid
  if (/^-?\d+$/.test(value)) return false;
  if (/^[+\-]+$/.test(value)) return false;
  // Human labels usually contain spaces or letters beyond hex id length
  return /[a-zA-Z]/.test(value) && (value.includes(" ") || value.length !== 24);
}

function toFormOption(next: any) {
  if (next == null || next === "") return null;
  if (Array.isArray(next)) {
    return next.map(toFormOption).filter(Boolean);
  }
  if (typeof next === "string") {
    if (isLabelOnlyString(next)) return null;
    return { value: next, label: next };
  }
  if (typeof next === "number") {
    return { value: next, label: String(next) };
  }
  const value = optionId(next);
  if (value == null || value === "") return null;
  if (typeof value === "string" && isLabelOnlyString(value)) return null;
  return {
    value: next.value ?? next._id ?? next.id,
    label: optionLabel(next.label ?? next.name ?? next, ""),
    ...(next.code != null ? { code: next.code } : {}),
    ...(next.url != null ? { url: next.url } : {}),
  };
}

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

  const {
    options: _ignoredOptions,
    disabled: comboDisabled,
    ...safeComboBoxProps
  } = ComboBoxProps || {};

  const isMultiple = Boolean(safeComboBoxProps?.multiple);
  const resolvedOptions = Array.isArray(options) ? options : [];
  const resolvedValue = (() => {
    if (value === undefined || value === null || value === "") {
      return isMultiple ? [] : null;
    }
    if (typeof value === "string" && isLabelOnlyString(value)) {
      return isMultiple ? [] : null;
    }
    return value;
  })();

  return (
    <ComboBox
      {...safeComboBoxProps}
      {...cleanRest}
      name={name}
      options={resolvedOptions}
      disabled={disabled ?? comboDisabled}
      value={resolvedValue}
      onChange={(_e: any, next: any) => onChange?.(toFormOption(next))}
      InputProps={{
        label,
        ...InputProps,
        helperText:
          touched && invalid && error
            ? error
            : InputProps?.helperText || "",
        error: Boolean(touched && invalid && error),
        // Pass current option object — NOT the DOM event — so redux-form
        // does not replace `{ value, label }` with the typed label string.
        onBlur: (e: any) => {
          handleBlur?.(e);
          onBlur?.(value);
        },
        onFocus: (e: any) => {
          handleFocus?.(e);
          onFocus?.(value);
        },
      }}
    />
  );
}
