import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";

export { default } from "./AddMajorFoodIntoleranceForm";

export const fields=(t:Function): ReduxFormField[] => [
  {
    name: "status",
    label: t("Is Active"),
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "en.name",
    label: "Name",
    component: InputRedux,
    cellProps: { md: 12 },
    // 
  },
];
