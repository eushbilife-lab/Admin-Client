import Input from "../Input";
import { ComboBoxOwnProps } from ".";
import Autocomplete from "@mui/material/Autocomplete";
import { Chip, Avatar } from "@mui/material";
import { useAppSelector } from "redux/hooks";
import { optionId, optionLabel } from "utils/selectOption.util";

export type ComboBoxProps = ComboBoxOwnProps &
  Omit<React.ComponentProps<typeof Autocomplete>, "renderInput">;

export default function ComboBox({
  disabled,
  options = [],
  ChipProps,
  InputProps,
  ...rest
}: ComboBoxProps) {
  const loading = useAppSelector((state) => state.loader.combo);

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-input": {
          backgroundColor: "transparent !important",
          padding: "4px 6px !important",
        },
        "& .MuiOutlinedInput-root": {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
        "& .MuiAutocomplete-endAdornment": {
          right: 10,
        },
      }}
      loading={loading}
      {...rest}
      options={options || []}
      getOptionLabel={(option: any) => {
        if (option == null) return "";
        if (typeof option === "string") return option;
        return optionLabel(option.label ?? option.name ?? option, "");
      }}
      isOptionEqualToValue={(option: any, value: any) => {
        const a = optionId(option);
        const b = optionId(value);
        return a != null && b != null && a === b;
      }}
      disabled={disabled}
      renderTags={
        rest.multiple
          ? (tagOptions: any[], getTagProps) =>
              tagOptions.map((tag: any, index: number) => (
                <Chip
                  label={optionLabel(tag?.label ?? tag, "")}
                  avatar={tag?.url ? <Avatar src={tag.url} /> : undefined}
                  variant="filled"
                  size="small"
                  sx={{
                    backgroundColor: "var(--color-leaf-soft)",
                    color: "var(--color-leaf-deep)",
                    fontWeight: 700,
                    borderRadius: "8px",
                    border: "1px solid color-mix(in srgb, var(--color-leaf) 25%, transparent)",
                  }}
                  {...getTagProps({ index })}
                  {...ChipProps}
                  key={optionId(tag) || index}
                />
              ))
          : undefined
      }
      renderOption={(props, option: any) => {
        const { key, ...optionProps } = props as any;
        return (
          <li key={key} {...optionProps}>
            {option?.url ? (
              <Avatar
                src={option.url}
                sx={{ width: 28, height: 28, mr: 1.25, display: "inline-flex" }}
              />
            ) : null}
            {optionLabel(option?.label ?? option?.name ?? option, "")}
          </li>
        );
      }}
      componentsProps={{
        paper: {
          sx: {
            borderRadius: "14px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 12px 32px rgba(10, 10, 10, 0.12)",
            mt: 0.75,
          },
        },
      }}
      renderInput={(params) => (
        <Input
          {...params}
          {...InputProps}
          inputProps={{
            autoComplete: "new-password",
            form: { autoComplete: "off" },
            ...params.inputProps,
            ...InputProps?.inputProps,
          }}
        />
      )}
    />
  );
}
