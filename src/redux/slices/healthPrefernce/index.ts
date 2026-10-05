export { default, healthPrefernceActions, healthPrefernceSlice } from "./healthPrefernceSlice";

export enum healthPrefernceValues {
  allergies = "allergies",
  health_issues = "health_issues",
  health_issue = "health_issue",
  food_concern = "food_concern",
  diet = "diet",
  target = "target",
  exercise_level = "exercise_level",
  temporary_concerns = "temporary_concerns",
}
export type healthPrefernceType = keyof typeof healthPrefernceValues;

export interface BasicHealthPrefernceState {
  refreshLoader: boolean;
  refresh: number;
}

export interface IHealthPrefernce {
  count: number;
  hp: {};
  hps: any[];
  loading: boolean;
  current_filters: any;
  filters: any;
  hpOptions: any[];
}

export type healthPrefernceState = BasicHealthPrefernceState & {
  [key in healthPrefernceValues]: IHealthPrefernce;
};

export interface SetHealthPreferncePayload {
  data: {
    _id: any
  };
  type:healthPrefernceType
}
export interface SetHealthPreferncesPayload {
  data: any[];
  count:number,
  type:healthPrefernceType
}
export interface SetHealthPrefernceLoading {
  type: healthPrefernceType;
  loading: boolean;
}

export interface SetHealthPrefernceOptionsPayload{
  healthPreferences: any[];
  type:healthPrefernceType
}

export interface SetPagePayload{
  page :number,
  type:healthPrefernceType
}