export { default, level4Actions, level4Slice } from "./level4Slice";

export interface Level4State {
  level4: any;
  levels4: any[];
  level4Options: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetLevel4Payload {
  levels4: any[];
  count: number;
}

export interface SetLevel4OptionsPayload{
  levels4: any[];
}
