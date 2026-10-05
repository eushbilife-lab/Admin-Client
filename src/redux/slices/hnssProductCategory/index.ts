export {
  default,
  hnssProductCategoryActions,
  hnssProductCategorySlice,
} from "./hnssProductCategorySlice";

export interface HNSSProductCategoriesState {
  hnssProductCategory: any;
  hnssProductCategories: any[];
  hnssProductCategoryOptions: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetHNSSProductCategoriesItemsPayload {
  hnssProductCategories: any[];
  count: number;
}
export interface SetHnssProductCategoryOptionsPayload {
  hnssProductCategories: any[];
}
