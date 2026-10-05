export { default, productActions, productSlice } from "./productSlice";

export interface ProductState {
  product: any;
  products: any[];
  productOptions: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetproductPayload {
  products: any[];
  count: number;
}

export interface SetproductOptionsPayload {
  products: any[];
}
