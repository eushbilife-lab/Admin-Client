import { useState } from "react";
import { InputOwnProps } from ".";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";

export type InputProps = InputOwnProps & React.ComponentProps<typeof TextField>;

const CssTextField = styled(TextField)({
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--color-leaf)",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-paper)",
    borderRadius: "10px",
    minHeight: 48,
    fontSize: "0.875rem",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border-color)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-leaf)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-leaf)",
    borderWidth: 1.5,
  },
  "& .MuiInputBase-input": {
    padding: "11px 14px",
    height: "auto",
  },
  "& .Mui-disabled": {
    backgroundColor: "var(--color-canvas)",
    cursor: "not-allowed",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 4,
    marginTop: 6,
  },
});

export default function Input({
  showIcon,
  startAdornment,
  type,
  label,
  input,
  meta,
  readOnly,
  ...rest
}: InputProps & { input?: any; meta?: any }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  return (
    <CssTextField
      fullWidth
      size="medium"
      variant="outlined"
      label={label ? t(`${label}`) : undefined}
      {...input}
      {...rest}
      type={show && showIcon && type === "password" ? "text" : type}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
        endAdornment: showIcon && type === "password" && (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() => setShow(!show)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="toggle password visibility"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
        readOnly: readOnly,
        ...rest.InputProps,
      }}
    />
  );
}
