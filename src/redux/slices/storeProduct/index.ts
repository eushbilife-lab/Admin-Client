import storeProductReducer, { storeProductActions } from "./storeProductSlice";

export interface IStoreProductState {
  count: number;
  product: any;
  products: any[];
  loading: boolean;
  refresh: number;
  filters: { page: number; page_size: number };
}

export type SetStoreProductsPayload = {
  products: any[];
  count: number;
};

export { storeProductActions };
export default storeProductReducer;
