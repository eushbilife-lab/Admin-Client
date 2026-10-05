export { default, foodIntoleranceActions, foodIntoleranceSlice } from "./foodIntoleranceSlice";


export interface IFoodIntolerance {
  count: number;
  foodIntolerance: {};
  foodIntolerances: any[];
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  current_filters: any;
  filters: any;
  foodIntoleranceOptions: any[];
}

export interface SetFoodIntolerancesPayload {
  foodIntolerances: any[];
  count: number;
}
export interface SetFoodIntoleranceOptionsPayload {
  foodIntolerances: any[];
}
export interface SetFoodIntolerancePayload {
  data: {
    _id: any
  };
}