import storeOrderReducer, { storeOrderActions } from "./storeOrderSlice";

export interface IStoreOrderState {
  count: number;
  order: any;
  orders: any[];
  loading: boolean;
  refresh: number;
  filters: { page: number; page_size: number };
}

export type SetStoreOrdersPayload = {
  orders: any[];
  count: number;
};

export { storeOrderActions };
export default storeOrderReducer;
