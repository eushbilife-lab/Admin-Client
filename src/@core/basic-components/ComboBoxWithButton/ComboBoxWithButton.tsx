import { useAppSelector, useAppDispatch } from "redux/hooks";
import { nutritionActions } from "redux/slices/nutrition";
import Autocomplete from "@mui/material/Autocomplete";
import { Chip } from "@mui/material";
import { ComboBoxOwnProps } from ".";
import Input from "../Input";
import React from "react";

export type ComboBoxProps = ComboBoxOwnProps &
  Omit<React.ComponentProps<typeof Autocomplete>, "renderInput">;

export default function ComboBoxWithButton({
  options = [],
  ChipProps,
  InputProps,
  ...rest
}: ComboBoxProps) {
  const loading = useAppSelector((state) => state.loader.combo);
  const dispatch = useAppDispatch();

  const handleInputChange = (_: any, value: string) => {
    const regex = new RegExp(value, "i");
    const match = options.some((option: any) => regex.test(option.label));
    const notFounded = !match && value.trim() !== "";
    dispatch(nutritionActions.showButton({ notFounded }));
  };

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-input": {
          backgroundColor: "transparent !important",
        },
      }}
      loading={loading}
      {...rest}
      options={options || []}
      getOptionLabel={(option: any) => option.label}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.value === value?.value
      }
      onInputChange={handleInputChange}
      renderTags={
        rest.multiple
          ? (options: any[], getTagProps) =>
              options.map(({ label }: any, index: number) => (
                <Chip
                  label={label}
                  variant="filled"
                  size="small"
                  {...getTagProps({ index })}
                  {...ChipProps}
                  key={index}
                />
              ))
          : undefined
      }
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
