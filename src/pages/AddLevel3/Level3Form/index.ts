import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import CheckBoxRedux from "@core/redux-fields/CheckboxRedux"
import SelectLevel2 from "@core/api-components/SelectLevel2";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
export { default } from "./Level3Form";

export const fields=(t:Function): ReduxFormField[] => [
	{
		name: "status",
		label: "Is Active",
		component: CheckBoxRedux,
		cellProps: { lg: 12 },
		InputProps: { type: "checkbox" },
	},
	{
		name: "level2",
		label: "Level 2",
		component: SelectLevel2,
		validate: [required],
		cellProps: { lg: 8 },
		ComboBoxProps: {
		  multiple: false,
		  freeSolo: false,
		  options: [],
		},
		heading:t("Level 2")
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
