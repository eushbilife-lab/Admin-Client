import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from "react-i18next";

interface CheckBoxOwnProps {
  label?: string | number | React.ReactElement;
  FormControlLabelProps?: Omit<
    React.ComponentProps<typeof FormControlLabel>,
    "control"
  >;
}

export type CheckBoxProps = CheckBoxOwnProps &
  React.ComponentProps<typeof Checkbox>;

export default function BaseCheckbox({
  label = "",
  FormControlLabelProps,
  ...rest
}: CheckBoxProps) {
  const { t } = useTranslation();
  return (
    <FormControlLabel
      control={<Checkbox {...rest}  />}
      {...FormControlLabelProps}
      label={t(`${label}`)}
    />
  );
}
