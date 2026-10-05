export { default, userActions, userSlice } from "./userSlice";

export interface SetUsersPayload {
	users: any[];
	count: number;
}

export interface UserState {
  user: any;
  users: any[];
  userOptions: any[];
  filters: any;
  count: number;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}
