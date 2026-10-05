

import { useState } from "react";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material";


const CssDateRangePicker = styled(DateRangePicker)({
  ".MuiInputBase-input": {
    backgroundColor: "#fbfbfb",
    borderRadius: "4px",
    padding: "14.5px 14px",
    height: "1.08rem !important",
    minHeight: "1.08rem !important"

  },
});

export default function BasicDatePicker({
  onChange,
  editable,
  InputFieldProps,
  value: { date: value = "" },
  ...rest
}: any) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <CssDateRangePicker
        localeText={{ start: t("Start"), end: t("End") }}
        label="Basic date picker"
        open={open}
        value={value}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(date: any) => {
          onChange?.({
            error: ["", ""],
            date: date,
          });
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
}
