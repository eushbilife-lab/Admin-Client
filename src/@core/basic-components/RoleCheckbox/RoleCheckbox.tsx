import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

interface CheckBoxOwnProps {
  label?: string | number | React.ReactElement;
  FormControlLabelProps?: Omit<
    React.ComponentProps<typeof FormControlLabel>,
    "control"
  >;
}

export type CheckBoxProps = CheckBoxOwnProps &
  React.ComponentProps<typeof Checkbox>;

export default function RoleCheckbox({
  label = "",
  FormControlLabelProps,
  onChange,
  ...rest
}: CheckBoxProps) {
  return (
    <FormControlLabel
      control={<Checkbox {...rest} onChange={onChange} />}
      {...FormControlLabelProps}
      label={label}
    />
  );
}
