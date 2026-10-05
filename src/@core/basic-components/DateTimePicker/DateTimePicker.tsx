import { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DateTimePickerProps } from ".";

export default function BasicDatePicker({
  onChange,
  editable,
  InputFieldProps,
  value: { date: value = "" },
  ...rest
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const InputProps = {
    autoComplete: "off",
    InputLabelProps: { shrink: true },
    ...InputFieldProps,
    onClick: () => setOpen(true),
    onKeyDown: (e: any) => {
      if (!editable) e.preventDefault();
    },
    error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DateTimePicker
          label="Basic date picker"
          open={open}
          value={value}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={
            (date: any) => console.log("data", date)
            // onChange?.({ date: date ? `${date}` : "", error: false })
          }
          onAccept={
            (date: any) => console.log("data", date)
            // onChange?.({ date: date ? `${date}` : "", error: false })
          }
          onError={(reason: any, date: any) => {
            if (!reason) return;
           // console.log("data", date);
            // onChange?.({ date: date ? `${date}` : "", error: true });
          }}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          {...rest}
          // renderInput={(params: any) => <Input {...params} {...InputProps} />}
          // PopperProps={{ placement: "bottom-start", ...rest.PopperProps }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
