import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
export { default } from "./UsersFilters";
import { status } from "utils/status.util";
import PhoneInputRedux from "@core/redux-fields/PhoneInputRedux";
import { pageSize } from "utils/normalize.util";
import { phone } from "utils/validate.util";

export const fields = (t:Function) => {
  const fields: ReduxFormField[] = [
    {
      name: "currentStatus",
      label: "Status",
      component: SelectRedux,
      cellProps: { md: 2.4 },
      SelectProps: { options: status(t) },
    },
    {
      name: "firstName",
      label: "First Name",
      component: InputRedux,
      cellProps: { md: 2.4 },
    },
    {
      name: "lastName",
      label: "Last Name",
      component: InputRedux,
      cellProps: { md: 2.4 },
    },
    {
      name: "email",
      label: "Email",
      component: InputRedux,
      cellProps: { md: 2.4 },
    },
    {
      name: "phone",
      label: t("Phone"),
      validate: [phone],
      component: PhoneInputRedux,
      cellProps: { md: 2.4 },
    },
    {
      name: "page_size",
      label: "Page Size",
      normalize:pageSize,
      component: InputRedux,
      cellProps: { md: 2.4 },
    },
  ];
    return fields;
};
