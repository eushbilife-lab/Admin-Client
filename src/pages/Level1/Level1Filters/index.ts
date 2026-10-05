import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { status } from "utils/status.util";
import { pageSize } from "utils/normalize.util";
export { default } from "./Level1Filters";

export const fields = (t:any) => {
  const fields: ReduxFormField[] = [
    {
      name: "name",
      label: "Name",
      component: InputRedux,
      cellProps: { lg: 4 , md:4 },
    },
    {
      name: "status",
      label: "Status",
      component: SelectRedux,
      cellProps: { lg:4, md:4 },
      SelectProps: { options: status(t) },
    },
    {
      name: "page_size",
      label: "Page Size",
      normalize:pageSize,
      component: InputRedux,
      cellProps: { md: 4 },
    },
  ];
  return fields;
};
