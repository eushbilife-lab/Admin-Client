import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectLevel3 from "@core/api-components/SelectLevel3";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { status } from "utils/status.util";
import { pageSize } from "utils/normalize.util";
export { default } from "./Level4Filters";
export const fields = (t:Function) => {
  const fields: ReduxFormField[] = [
    {
      name: "level3",
      label: "Level 3",
      component: SelectLevel3,
      cellProps: { md: 3 },
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
      cellProps: { md: 3 },
    },
    {
      name: "status",
      label: "Status",
      component: SelectRedux,
      cellProps: { md: 3 },
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
