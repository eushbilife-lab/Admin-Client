import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";

export { default } from "./AddFoodTypeForm";

export const fields: ReduxFormField[] = [
  {
    name: "status",
    label: "Is Active",
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "en.name",
    label: "Name",
    component: InputRedux,
    cellProps: { md: 12 },
  },
];
