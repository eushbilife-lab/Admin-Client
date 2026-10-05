import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
export { default } from "./ReviewsFilters";
import { status } from "utils/status.util";
import { dateRangeFilter } from "utils/validate.util";
import DateRangePickerRedux from "@core/redux-fields/DateRangePickerRedux";
import DatePickerRedux from "@core/redux-fields/DatePickerRedux";
import { pageSize } from "utils/normalize.util";

export const fields = (t:Function) => {
  const fields: ReduxFormField[] = [
    {
      name: "doc_number",
      label: "ID",
      component: InputRedux,
      cellProps: { md: 2.8 },
    },
    {
      name: "createdAt",
      label: "Date",
      validate: [dateRangeFilter],
      component: DateRangePickerRedux,
      cellProps: { md: 6 },
      DateRangePickerProps: {
        onChange: () => {},
        InputFieldProps: {},
        value: { date: ["", ""], error: ["", ""] },
      },
    },
    {
      name: "page_size",
      label: "Page Size",
      normalize:pageSize,
      component: InputRedux,
      cellProps: { md: 3 },
    },
    // {
    //   name: "productID",
    //   label: "Product Name",
    //   component: InputRedux,
    //   cellProps: { md: 3 },
    // },
    // {
    //   name: "userID",
    //   label: "User",
    //   component: InputRedux,
    //   cellProps: { md: 3 },
    // },
    // {
    //   name: "date",
    //   label: "Date",
    //   validate: [dateRangeFilter],
    //   component: DateRangePickerRedux,
    //   cellProps: { md: 6 },
    //   DateRangePickerProps: {
    //     onChange: () => {},
    //     InputFieldProps: {},
    //     value: { date: ["", ""], error: ["", ""] },
    //   },
    // }
  ];
  return fields;
};
