import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import CheckBoxRedux from "@core/redux-fields/CheckboxRedux"
import SelectLevel1 from "@core/api-components/SelectLevel1";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
export { default } from "./Level2Form";

export const fields=(t:Function): ReduxFormField[] => [
	{
		name: "status",
		label: "Is Active",
		component: CheckBoxRedux,
		cellProps: { lg: 12 },
		InputProps: { type: "checkbox" },
	},
	{
		name: "level1",
		label: t("Level 1"),
		component: SelectLevel1,
		validate: [required],
		cellProps: { lg: 8 },
		ComboBoxProps: {
		  multiple: false,
		  freeSolo: false,
		  options: [],
		},
		heading:t("Level 1")
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
