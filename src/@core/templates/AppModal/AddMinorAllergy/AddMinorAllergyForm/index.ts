import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import SelectCategoriesInAllergies from "@core/api-components/SelectCategoriesInAllergies";

export { default } from "./AddMinorAllergyForm";

export const fields=(t:Function): ReduxFormField[] =>[
  {
    name: "status",
    label: t("Is Active"),
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "majorAllergyID",
    label: t("Categories"),
    component: SelectCategoriesInAllergies,
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
