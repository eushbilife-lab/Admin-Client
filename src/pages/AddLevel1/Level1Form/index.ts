import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import CheckBoxRedux from "@core/redux-fields/CheckboxRedux"
import InputRedux from "@core/redux-fields/InputRedux";
export { default } from "./Level1Form";


export const fields: ReduxFormField[] = [
	{
		name: "status",
		label: "Is Active",
		component: CheckBoxRedux,
		cellProps: { lg: 12 },
		InputProps: { type: "checkbox" },
	},
	{
		name: "en.name",
		label: "Name",
		component: InputRedux,
		cellProps: { lg: 8, md: 8 },
		InputProps: { type: "text" },
		// 
	},
];
