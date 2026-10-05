import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import SelectCategoriesInAllergies from "@core/api-components/SelectCategoriesInAllergies";
import SelectFooIntolerance from "@core/api-components/SelectFooIntolerance";

export { default } from "./AddMinorFoodIntoleranceForm";

export const fields=(t:Function): ReduxFormField[] =>[
  {
    name: "status",
    label: t("Is Active"),
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "majorFoodIntoleranceID",
    label: t("Categories"),
    component: SelectFooIntolerance,
    validate: [required],
    cellProps: { md: 12 },
    heading:t("Categories")
  },
  {
    name: "en.name",
    label: "Name",
    component: InputRedux,
    cellProps: { md: 12 },
    // 
  },
];
