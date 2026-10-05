export { default, allergyActions, allergySlice } from "./allergiesSlice";


export interface IAllergy {
  count: number;
  allergy: {};
  allergies: any[];
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  current_filters: any;
  filters: any;
  allergyOptions: any[];
}

export interface SetAllergiesPayload {
  allergies: any[];
  count: number;
}
export interface SetAllergyOptionsPayload {
  allergies: any[];
}
export interface SetAllergyPayload {
  data: {
    _id: any
  };
}