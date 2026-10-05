import { useTranslation } from "react-i18next";
import { RadioGroupProps } from ".";
import {
  Radio,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup as BaseRadioGroup,
} from "@mui/material";

export default function RadioGroup({
  label = "",
  values = [],
  ...rest
}: RadioGroupProps) {
  //@ts-ignore
  const error = rest?.meta?.touched && rest?.meta?.error == "Required";
  const { t } = useTranslation();
  return (
    <FormControl>
      <FormLabel id={`radio-group-${label.toLowerCase()}`}>{label} </FormLabel>
      <BaseRadioGroup
        row
        name="radio-group"
        aria-labelledby={`radio-group-${label.toLowerCase()}`}
        {...rest}
      >
        {values.map(({ value, label }, i) => (
          <FormControlLabel
            key={i}
            sx={{ color: error ? "#b72136" : "" }}
            value={value}
            label={t(label)}
            control={<Radio sx={{ color: error ? "#b72136" : "" }} />}
          />
        ))}
      </BaseRadioGroup>
    </FormControl>
  );
}
