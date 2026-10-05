import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import {
  PickerChangeHandlerContext,
  DateValidationError,
} from "@mui/x-date-pickers";

import { DatePickerProps } from ".";
import dayjs from "dayjs";

export default function BasicDatePicker({
  onChange,
  editable,
  InputFieldProps,
  value: { date: value = null, error = false },
  size,
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const InputProps = {
    autoComplete: "off",
    InputLabelProps: { shrink: true },
    // ...InputFieldProps,
    onClick: () => setOpen(true),
    onKeyDown: (e: any) => {
      if (!editable) e.preventDefault();
    },
    error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
    helperText: InputFieldProps?.helperText
      ? InputFieldProps?.helperText
      : undefined,
  };
  const formatDate = (date: any): any => {
    return date.isValid() ? dayjs(date).toDate() : "";
  };
  const handleDate = (
    data: PickerChangeHandlerContext<DateValidationError>
  ) => {
    const formattedDate: any = formatDate(data);
    onChange?.({ date: formattedDate ? `${formattedDate}` : "", error: false });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={["DatePicker"]}> */}
      <DatePicker
        sx={{ width: "100%" }}
        open={open}
        value={value}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(date: any) => handleDate(date)}
        onAccept={(date: any) => handleDate(date)}
        onError={(reason: any, date: any) => {
          if (!reason) return;
          handleDate(date);
        }}
        {...rest}
        slotProps={{
          textField: {
            size: InputFieldProps.size || "medium",
            onClick: () => setOpen(true),
            error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
            helperText: InputFieldProps?.helperText
              ? InputFieldProps?.helperText
              : undefined,
              sx: {
                height: "47px", // Reducing height
                "& .MuiInputBase-root": {
                  height: "47px", 
                },
                "& .MuiInputBase-input": {
                  // padding: "4px 8px", // Reducing padding inside input
                },
              },
          },
        }}
      />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}
