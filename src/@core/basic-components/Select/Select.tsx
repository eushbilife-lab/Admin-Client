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
    color: "var(--text-secondary)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--color-science)",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-paper)",
    borderRadius: "8px",
    minHeight: 44,
    fontSize: "0.875rem",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border-color)",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-leaf)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-science)",
    borderWidth: 1.5,
  },
  "& .MuiSelect-select": {
    padding: "11px 14px",
    minHeight: "unset !important",
    height: "auto !important",
  },
  "& .Mui-disabled": {
    backgroundColor: "var(--color-canvas)",
    cursor: "not-allowed",
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

  return (
    <CssTextField
      select
      fullWidth
      InputLabelProps={rest.InputLabelProps}
      label={label ? t(`${label}`) : undefined}
      variant="outlined"
      SelectProps={{
        MenuProps: {
          sx: {
            maxHeight: 320,
            "& .MuiPaper-root": { borderRadius: "12px", marginTop: "6px" },
            "& .MuiMenuItem-root": { fontSize: "0.875rem", padding: "10px 14px" },
          },
        },
      }}
      {...rest}
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
