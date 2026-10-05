export { default, dynamicActions, dynamicSlice } from "./dynamicSlice";

export enum DynmicsValues {
  manufacturer = "manufacturer",
  brand='brand',
  attribute='attribute'  
}
export type DynamicType = keyof typeof DynmicsValues;

export interface BasicDynamicState {
  refreshLoader: boolean;
  refresh: number;
}

export interface IDynamics {
  count: number;
  dynamic: {};
  dynamics: any[];
  loading: boolean;
  current_filters: any;
  filters: any;
  dynamicOptions: any[];
}

export type DynamicState = BasicDynamicState & {
  [key in DynmicsValues]: IDynamics;
};

export interface SetDynamicPayload {
  data: {
    _id: any
  };
  type:DynamicType
}
export interface SetDynamicsPayload {
  data: any[];
  count:number,
  type:DynamicType
}
export interface SetdynamicLoading {
  type: DynamicType;
  loading: boolean;
}

export interface SetdynamicOptionsPayload{
  dynamics: any[];
  type:DynamicType
}

export interface SetPagePayload{
  page :number,
  type:DynamicType
}