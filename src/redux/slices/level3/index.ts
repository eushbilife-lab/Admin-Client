export { default, level3Actions, level3Slice } from "./level3Slice";

export interface Level3State {
  level3: any;
  levels3: any[];
  level3Options: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetLevel3Payload {
  levels3: any[];
  count: number;
}

export interface SetLevel3OptionsPayload{
  levels3: any[];
}
