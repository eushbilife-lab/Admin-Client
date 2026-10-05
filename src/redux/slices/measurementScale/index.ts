export { default, measurementScaleActions, measurementScaleSlice } from "./measurementScaleSlice";

export enum MeasurementScaleValues {
  uom = "uom",
  uoc='uoc',
}
export type MeasurementScaleType = keyof typeof MeasurementScaleValues;

export interface BasicMeasurementScaleState {
  refreshLoader: boolean;
  refresh: number;
}

export interface IMeasurementScale {
  count: number;
  measurementScale: {};
  measurementScales: any[];
  loading: boolean;
  current_filters: any;
  filters: any;
  measurementScaleOptions: any[];
}

export type MeasurementScaleState = BasicMeasurementScaleState & {
  [key in MeasurementScaleValues]: IMeasurementScale;
};

export interface SetMeasurementScalePayload {
  data: {
    _id: any
  };
  type:MeasurementScaleType
}
export interface SetMeasurementScalesPayload {
  data: any[];
  count:number,
  type:MeasurementScaleType
}
export interface SetMeasurementScaleLoading {
  type: MeasurementScaleType;
  loading: boolean;
}

export interface SetMeasurementScaleOptionsPayload{
  dynamics: any[];
  type:MeasurementScaleType
}

export interface SetPagePayload{
  page :number,
  type:MeasurementScaleType
}