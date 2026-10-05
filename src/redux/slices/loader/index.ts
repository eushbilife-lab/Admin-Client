export { default, loaderActions, loaderSlice } from "./loaderSlice";

export interface LoaderState {
  loading: boolean[];
  imgLoading: boolean;
  combo: boolean;
  select: boolean;
}

export type fieldsType = "combo" | "select";
