import SelectNutrientInProduct from "@core/api-components/SelectNutrientInProduct";
import type { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import ReduxFieldArray from "@core/redux-fields/ReduxFieldArray";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import { digitOrFloat } from "utils/normalize.util";
import SelectUOM from "@core/api-components/SelectUOM";
export { default } from "./AddRdaForm";


export const fields=(t:any): ReduxFormField[] => [
  {
    name: "rda",
    label: t("RDA"),
    component: ReduxFieldArray,
    reduxFormComponent: "FieldArray",
		upperLayout: true,
    fieldsArray: [
      {
				name: "nutrition_id",
				label: t("nutrition"),
        validate:[required],
				component: SelectNutrientInProduct,
				cellProps: { md: 4 },
			},
	  {
        name: "dailyValue",
        label: t("Value"),
        validate:[required],
        normalize:digitOrFloat,
        component: InputRedux,
        cellProps: { md: 4, lg: 4 },
      },
	  {
        name: "uom",
        label: t("Measurements"),
        component: SelectUOM,
        validate: [required],
        cellProps: { md: 4, lg: 4 },
      },
    ],
  },

];
