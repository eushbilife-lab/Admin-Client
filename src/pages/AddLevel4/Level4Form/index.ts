import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import CheckBoxRedux from "@core/redux-fields/CheckboxRedux"
import SelectLevel3 from "@core/api-components/SelectLevel3";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import SelectHNSSProductCategory from "@core/api-components/SelectHNSSProductCategory";
export { default } from "./Level4Form";

export const fields=(t:Function): ReduxFormField[] => [
	{
		name: "status",
		label: "Is Active",
		component: CheckBoxRedux,
		cellProps: { lg: 12 },
		InputProps: { type: "checkbox" },
	},
	{
		name: "HNSSProductCategoryID",
		label: "HNSS Product Category",
		component: SelectHNSSProductCategory,
		validate: [required],
		cellProps: { lg: 4},
		ComboBoxProps: {
		  multiple: false,
		  freeSolo: false,
		  options: [],
		},
		// heading:t("Level 3")
	  },
	{
		name: "level3",
		label: "Level 3",
		component: SelectLevel3,
		validate: [required],
		cellProps: { lg: 4},
		ComboBoxProps: {
		  multiple: false,
		  freeSolo: false,
		  options: [],
		},
		heading:t("Level 3")
	  },
	{
		name: "en.name",
		label: "Name",
		component: InputRedux,
		cellProps: { lg: 8 },
		InputProps: { type: "text" },
		// 
	},

];
