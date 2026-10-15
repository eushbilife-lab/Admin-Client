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
          padding: "3px 4px !important",
        },
        "& .MuiOutlinedInput-root": {
          paddingTop: "6px",
          paddingBottom: "6px",
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
                    backgroundColor: "var(--color-canvas)",
                    color: "var(--color-ink)",
                    fontWeight: 700,
                    borderRadius: "6px",
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
                sx={{ width: 28, height: 28, mr: 1, display: "inline-flex" }}
              />
            ) : null}
            {optionLabel(option?.label ?? option?.name ?? option, "")}
          </li>
        );
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
