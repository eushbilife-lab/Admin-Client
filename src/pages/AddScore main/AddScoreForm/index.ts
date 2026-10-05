import SelectHNSSProductCategory from "@core/api-components/SelectHNSSProductCategory";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import { required } from "utils/validate.util";
export { default } from "./AddScoreForm";

  export const ScoreFields= (t:any):ReduxFormField[] => [
    {
      name: "HNSSProductCategoryID",
      label: "HNSS Product Categories",
      validate: [required],
      component: SelectHNSSProductCategory,
      cellProps: { md: 6 },
    },
    {
      name: "isPositive",
      label: "Nutrition Type",
      validate: [required],
      component: ComboBoxRedux,
      cellProps: { md:6 },
      ComboBoxProps: {
        multiple: true,
        options:[
            {label:t("positive"),value:"positive"},
            {label:t("negative"),value:"negative"}
        ]
      },
    },
  ];

