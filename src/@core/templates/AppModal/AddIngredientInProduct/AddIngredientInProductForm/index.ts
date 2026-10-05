import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import InputRedux from "@core/redux-fields/InputRedux";

export { default } from "./AddIngredientInProductForm";


export const fields: ReduxFormField[] = [
  {
    name: "name",
    label: "Name",
    component: InputRedux,
    cellProps: { md: 12 },
  },
];
