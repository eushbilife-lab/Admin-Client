import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import RoleService from "utils/roles.util";
export { default } from "./AddRoleForm";

export const fields=(t:Function): ReduxFormField[] => [
  {
    name: "fullName",
    label: "Name",
    validate: [required],
    component: InputRedux,
    cellProps: { md: 4 },
    InputProps: { type: "text" },
  },
  {
    name: "email",
    label: "Email",
    validate: [required],
    component: InputRedux,
    cellProps: { md: 4 },
    InputProps: { type: "text" },
  },
  {
    name: "password",
    label: "Password",
    component: InputRedux,
    cellProps: { md: 4 },
    InputProps: { type: "text" },
  },
  {
    name: "currentStatus",
    label: "Status",
    component: SelectRedux,
    validate: [required],
    cellProps: { md: 4 },
    SelectProps: { options: RoleService.getStatusOptions(t) },
  },
  {
    name: "role",
    label: "Roles",
    component: SelectRedux,
    validate: [required],
    cellProps: { md: 4 },
    SelectProps: { options: RoleService.getRolesOptions() },
  },
];
