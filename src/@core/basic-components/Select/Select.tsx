import { SelectOwnProps } from ".";
import { useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "redux/hooks";

export type SelectProps = SelectOwnProps &
  React.ComponentProps<typeof TextField>;

const CssTextField = styled(TextField)({
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "var(--input-label)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--color-leaf-deep)",
  },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    fontSize: "0.8125rem",
    fontWeight: 700,
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "var(--input-radius)",
    minHeight: "var(--fluid-control-h)",
    fontSize: "var(--input-font-size)",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    boxShadow: "var(--input-shadow)",
    transition:
      "box-shadow 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--input-border)",
    borderWidth: 1.5,
  },
  "& .MuiOutlinedInput-root:hover": {
    backgroundColor: "var(--input-bg-hover)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--input-border-hover)",
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "0 0 0 3px var(--focus-ring)",
    backgroundColor: "var(--input-bg)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-leaf)",
    borderWidth: 1.5,
  },
  "& .MuiSelect-select": {
    padding: "12px 14px",
    minHeight: "unset !important",
    height: "auto !important",
    color: "var(--input-text)",
    fontWeight: 500,
  },
  "& .Mui-disabled": {
    backgroundColor: "var(--color-canvas)",
    cursor: "not-allowed",
    boxShadow: "none",
  },
});

export default function Select({
  disabled,
  disabledOnUpdate,
  options = [],
  label,
  ...rest
}: SelectProps) {
  const { id } = useParams();
  const { t } = useTranslation();
  const loading = useAppSelector((state) => state.loader.select);

  const { SelectProps: userSelectProps, ...fieldRest } = rest as any;

  return (
    <CssTextField
      select
      fullWidth
      InputLabelProps={fieldRest.InputLabelProps}
      label={label ? t(`${label}`) : undefined}
      variant="outlined"
      {...fieldRest}
      SelectProps={{
        MenuProps: {
          sx: {
            maxHeight: 340,
            "& .MuiPaper-root": {
              borderRadius: "14px",
              marginTop: "6px",
              border: "1px solid var(--border-color)",
              boxShadow: "0 12px 32px rgba(10, 10, 10, 0.12)",
            },
            "& .MuiMenuItem-root": {
              fontSize: "0.875rem",
              padding: "10px 14px",
              borderRadius: "10px",
              margin: "2px 8px",
            },
          },
        },
        ...(userSelectProps || {}),
      }}
      disabled={(disabledOnUpdate && Boolean(id)) || disabled || loading}
    >
      {options.map(({ value, label: optionLabel }, index) => (
        <MenuItem key={`${value}-${index}`} value={value}>
          {optionLabel}
        </MenuItem>
      ))}
    </CssTextField>
  );
}
