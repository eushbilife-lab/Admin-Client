export { default, roleActions, roleslice } from "./roleSlice";

export interface roleState {
    Role: any;
    Roles: any[];
    roleOptions: any[];
    filters: any;
    count: number;
    refresh: number;
    loading: boolean;
    current_filters: any;
    refreshLoader: boolean;
  }
  
  export interface SetRoleItemsPayload{
    Roles: any[];
    count: number;
  }
  export interface SetRoleOptionsPayload{
    Roles: any[];
  }