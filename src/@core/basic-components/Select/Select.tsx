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
    color: "var(--color-leaf-deep)",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-paper)",
    borderRadius: 12,
    minHeight: 48,
    fontSize: "0.875rem",
    transition:
      "box-shadow 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 160ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border-color)",
  },
  "& .MuiOutlinedInput-root:hover": {
    backgroundColor: "#fcfdf9",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "color-mix(in srgb, var(--color-leaf) 55%, #c7c7c7)",
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "0 0 0 3px var(--focus-ring)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-leaf)",
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
