import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { SetproductPayload } from ".";
import { config } from "config";
import { ProductState } from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: ProductState = {
  count: 0,
  products: [], 
  product: {},
  loading: false,
  current_filters: {},
  refreshLoader: false,
  productOptions: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.products = [];
      state.productOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    setProducts: (state, action: PayloadAction<SetproductPayload>) => {
      const { count, products } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      let options: SelectOption[] = [];
      products.forEach(({ _id, name, status }: any) =>
        options.push({ value: _id, label: name + " " + status })
      );
      state.products = products;
      state.productOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.refreshLoader = true;
    },
    setCurrentFilters: (state, action) => {
      state.current_filters = action.payload;
    },
    resetFilters: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters = initialState.filters;
      state.current_filters = initialState.current_filters;
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product._id !== action.payload);
      state.count -= 1;
    },
  },
});

const productReducer = productSlice.reducer;

export const productActions = productSlice.actions;
export default productReducer;
