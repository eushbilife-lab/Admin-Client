import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";

export { default } from "./AddUOMForm";

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
  {
    name: "sign",
    label: "Sign",
    component: InputRedux,
    validate: [required],
    cellProps: { md: 12 },
  },

];
