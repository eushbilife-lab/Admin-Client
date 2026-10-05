import Input from "../Input";
import { ComboBoxOwnProps } from ".";
import Autocomplete from "@mui/material/Autocomplete";
import { Chip, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useAppSelector } from "redux/hooks";

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
      getOptionLabel={(option: any) => option.label || ""}
      isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
      disabled={disabled}
      renderTags={
        rest.multiple
          ? (tagOptions: any[], getTagProps) =>
              tagOptions.map(({ label, url }: any, index: number) => (
                <Chip
                  label={label}
                  avatar={url ? <Avatar src={url} /> : undefined}
                  variant="filled"
                  size="small"
                  sx={{ backgroundColor: "var(--color-canvas)", color: "var(--color-ink)", fontWeight: 700, borderRadius: "6px" }}
                  {...getTagProps({ index })}
                  {...ChipProps}
                  key={index}
                />
              ))
          : undefined
      }
      renderOption={(props, option: any) => {
        const { key, ...restProps } = props;
        return (
          <ListItem key={key} {...restProps} sx={{ py: 1, px: 1.5 }}>
            {option.url && (
              <ListItemAvatar>
                <Avatar src={option.url} />
              </ListItemAvatar>
            )}
            <ListItemText primary={option.label} primaryTypographyProps={{ fontSize: "0.875rem" }} />
          </ListItem>
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
