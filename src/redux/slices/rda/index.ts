export { default, rdaActions, rdaSlice } from "./rdaSlice";

export interface rdaState {
  rda: any;
  rdas: any[];
  count: number;
  refresh: number;
  loading: boolean;
  refreshLoader: boolean;
  RDAOptions: any[];

}

export interface SetRdaPayload {
  rdas: any[];
}

