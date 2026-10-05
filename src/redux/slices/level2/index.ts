export { default, level2Actions, level2Slice } from "./level2Slice";

export interface Level2State {
  level2: any;
  levels2: any[];
  level2Options: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetLevel2Payload {
  levels2: any[];
  count: number;
}

export interface SetLevel2OptionsPayload{
  levels2: any[];
}