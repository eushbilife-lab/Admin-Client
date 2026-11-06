import { PhoneInputOwnProps } from ".";
import "react-phone-input-2/lib/material.css";
import PhoneInputImport from "react-phone-input-2";
import "./PhoneInput.css";

/** Vite/ESM often wraps CJS default as `{ default: Component }`. */
const BasePhoneInput: any =
  typeof PhoneInputImport === "function"
    ? PhoneInputImport
    : (PhoneInputImport as any)?.default;

export type PhoneInputProps = PhoneInputOwnProps & Record<string, any>;

export default function PhoneInput({
  id,
  name,
  error,
  onChange,
  helperText,
  ...rest
}: PhoneInputProps) {
  if (typeof BasePhoneInput !== "function") {
    return (
      <p className="phone-input-helper-text">Phone input failed to load.</p>
    );
  }

  return (
    <>
      <BasePhoneInput
        enableSearch
        country="pk"
        inputProps={{ id, name }}
        dropdownClass="phone-input-dropdown"
        containerClass={`phone-input ${error ? "phone-input-error" : ""}`}
        onChange={(value: string, data: any, e: any, formattedValue: string) => {
          onChange?.(value, data, e, formattedValue);
        }}
        {...rest}
      />
      {helperText ? (
        <p className="phone-input-helper-text">{helperText}</p>
      ) : null}
    </>
  );
}
