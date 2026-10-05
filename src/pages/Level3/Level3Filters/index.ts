import InputRedux from "@core/redux-fields/InputRedux";
import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectRedux from "@core/redux-fields/SelectRedux";
import SelectLevel2 from "@core/api-components/SelectLevel2";
import { status } from "utils/status.util";
import { pageSize } from "utils/normalize.util";
export { default } from "./Level3Filters";
export const fields = (t: Function) => {
  const fields: ReduxFormField[] = [
    {
      name: "level2",
      label: "Level 2",
      component: SelectLevel2,
      cellProps: { md:3},
      ComboBoxProps: {
        multiple: false,
        freeSolo: false,
        options: [],
      },
    },
    {
      name: "name",
      label: "Name",
      component: InputRedux,
      cellProps: { md:3 },
    },
    {
      name: "status",
      label: "Status",
      component: SelectRedux,
      cellProps: { md:3 },
      SelectProps: { options: status(t) },
    },
    {
      name: "page_size",
      label: "Page Size",
      normalize:pageSize,
      component: InputRedux,
      cellProps: { md: 3 },
    },
  ];
  return fields;
};
