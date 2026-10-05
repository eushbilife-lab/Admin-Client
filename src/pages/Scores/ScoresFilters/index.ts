import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
export { default } from "./ScoreFilters";
import { pageSize } from "utils/normalize.util";

export const fields = (t:Function) => {
  const fields: ReduxFormField[] = [
    {
      name: "HNSSProductCategoryID",
      label: "Product Category",
      component: SelectRedux,
      cellProps: { md: 3 },
    },
    {
      name: "productName",
      label: "Product Name",
      component: InputRedux,
      cellProps: { md: 3 },
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
