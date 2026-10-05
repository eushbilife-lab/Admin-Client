export { default, level1Actions, level1Slice } from "./level1Slice";

export interface Level1State {
    level1: any;
    levels1: any[];
    level1Options: any[];
    filters: any;
    count: number;
    refresh: number;
    loading: boolean;
    current_filters: any;
    refreshLoader: boolean;
  }
  
  export interface SetLevel1ItemsPayload{
    levels1: any[];
    count: number;
  }
  export interface SetLevel1OptionsPayload{
    levels1: any[];
  }