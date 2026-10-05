export { default, draftProductActions, draftProductSlice } from "./draftProductSlice";

export interface DraftProductState {
  draftProduct: any;
  draftProducts: any[];
  draftProductOptions: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetDraftProductPayload {
  draftProducts: any[];
  count: number;
}

export interface SetDraftProductOptionsPayload {
  draftProducts: any[];
}
