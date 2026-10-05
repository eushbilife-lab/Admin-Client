import { RadioGroupProps as BaseRadioGroupProps } from "@mui/material";
import { SelectOption } from "@core/basic-components/Select";
export { default } from "./RadioGroup";

export interface RadioGroupOwnProps {
	label?: string;
	values?: SelectOption[];
}

export type RadioGroupProps = BaseRadioGroupProps & RadioGroupOwnProps;
