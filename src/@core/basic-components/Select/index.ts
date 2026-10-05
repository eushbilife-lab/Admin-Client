// import { Id } from "@reduxjs/toolkit/dist/tsHelpers";

export { default } from "./Select";
export interface SelectOption {
  value: string;
  label: string;
  data?: any;
  dataUnit?:any
  dataId?:any
  key?:any
}
export interface SelectOwnProps {
  options?: SelectOption[];
  disabledOnUpdate?: boolean;
}
