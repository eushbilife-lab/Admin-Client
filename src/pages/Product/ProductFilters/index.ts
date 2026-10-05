import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectLevel1 from "@core/api-components/SelectLevel1";
import SelectLevel2 from "@core/api-components/SelectLevel2";
import SelectLevel3 from "@core/api-components/SelectLevel3";
import SelectLevel4 from "@core/api-components/SelectLevel4";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { levels, status } from "utils/status.util";
import { pageSize } from "utils/normalize.util";
import SelectHNSSProductCategory from "@core/api-components/SelectHNSSProductCategory";
export { default } from "./ProductFilters";

export const fields = (
  { statusDisabled }: { statusDisabled?: boolean } = {},
  t: Function
) => {
  const fields: ReduxFormField[] = [
    {
      name: "doc_number",
      label: "ID",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "productName",
      label: "Product Name",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "barcode",
      label: "Barcode",
      component: InputRedux,
      cellProps: { md: 3 },
    },
    {
      name: "status",
      label: "Status",
      component: SelectRedux,
      cellProps: { md: 3 },
      SelectProps: { options: status(t), disabled: statusDisabled },
    },
    {
      name: "level1_id",
      label: "Level 1",
      component: SelectLevel1,
      cellProps: { md: 3 },
      SelectProps: { options: levels(t) },
    },
    {
      name: "level2_id",
      label: "Level 2",
      component: SelectLevel2,
      cellProps: { md: 3 },
      SelectProps: { options: levels(t) },
    },
    {
      name: "level3_id",
      label: "Level 3",
      component: SelectLevel3,
      cellProps: { md: 3 },
      SelectProps: { options: levels(t) },
    },
    {
      name: "level4_id",
      label: "Level 4",
      component: SelectLevel4,
      cellProps: { md: 3 },
      SelectProps: { options: levels(t) },
    },
    {
      name: "HNSSProductCategory",
      label: "HNSS Product Categories",
      component: SelectHNSSProductCategory,
      cellProps: { md: 3 },
      SelectProps: { options: levels(t) },
    },
    {
      name: "page_size",
      label: "Page Size",
      normalize: pageSize,
      component: InputRedux,
      cellProps: { md: 3 },
    },
  ];
  return fields;
};
