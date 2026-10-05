import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Input from "../Input";
import dayjs from "dayjs";

export default function TimePickerViewRenderers({
  onChange,
  editable,
  InputFieldProps,
  value: { date: value = "" },
  ...rest
}: any) {
  const [open, setOpen] = React.useState(false);
  const InputProps = {
    autoComplete: "off",
    InputLabelProps: { shrink: true },
    // onClick: () => setOpen(true),
    onKeyDown: (e: any) => {
      if (!editable) e.preventDefault();
    },
    error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
    helperText: InputFieldProps?.helperText
      ? InputFieldProps?.helperText
      : undefined,
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={["TimePicker"]}> */}
      <TimePicker
        open={open}
        value={dayjs(value)}
        ampm={false}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        label={rest.label || "With Time Clock"}
        onChange={(date) =>
          onChange?.({ date: date ? `${date}` : "", error: false })
        }
        onAccept={(date) =>
          onChange?.({ date: date ? `${date}` : "", error: false })
        }
        onError={(reason, date) => {
          if (!reason) return;
          onChange?.({ date: date ? `${date}` : "", error: true });
        }}
        {...rest}
        viewRenderers={{
          hours: renderTimeViewClock,
          minutes: renderTimeViewClock,
        }}
        slotProps={{
          textField: {
            size: InputFieldProps.size || "medium",
            onClick: () => setOpen(true),
            error: InputFieldProps?.helperText ? InputFieldProps?.error : false,
            helperText: InputFieldProps?.helperText
              ? InputFieldProps?.helperText
              : undefined,
          },
        }}
      />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}
