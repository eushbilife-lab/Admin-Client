import { ModelState } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ModelState = {
	models: [],
	model: null,
	loading: true,
};

export const modelSlice = createSlice({
	name: "model",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		addModel: (state, action) => {
			state.models.unshift(action.payload);
		},
		updateModel: (state, action) => {
			const { id, model } = action.payload;
			state.models.every(({ _id }, i) => {
				if (id === _id) {
					state.models[i] = model;
					return false;
				}
				return true;
			});
		},
		setModel: (state, action) => {
			state.model = action.payload;
		},
		setModels: (state, action) => {
			state.models = action.payload;
		},
	},
});

const modelReducer = modelSlice.reducer;

export const modelActions = modelSlice.actions;
export default modelReducer;
