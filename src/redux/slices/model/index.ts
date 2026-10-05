export { default, modelActions, modelSlice } from "./modelSlice";

export interface ModelState {
	model: any;
	models: any[];
	loading: boolean;
}
