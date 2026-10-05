import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  IImage,
  imageState,
  imageType,
  SetImageLoading,
  SetImageOptionsPayload,
  SetImagePayload,
  SetimagesPayload,
  SetPagePayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialImages: IImage = {
  count: 0,
  image: {},
  images: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  imageOptions: [],
};

const initialState: imageState = {
  refreshLoader: false,
  refresh: 0,
  product_certificate: initialImages,
};

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<SetImageLoading>) => {
      const { type, loading } = action.payload;
      state[type].loading = loading;
    },
    setImage: (state, action: PayloadAction<SetImagePayload>) => {
      const { type, data } = action.payload;
      const existingIndex = state[type].images?.findIndex(
        (item) => item._id === data._id
      );
      if (existingIndex !== -1) {
        state[type].images[existingIndex] = data;
      } else {
        state[type].images.unshift(data);
      }
    },
    setImages: (state, action: PayloadAction<SetimagesPayload>) => {
      const { data, type, count } = action.payload;
      state[type].count = count;
      state[type].images = data;
      state.refreshLoader = false;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state, action: PayloadAction<imageType>) => {
      const type = action.payload;
      state[type].filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetImageOptionsPayload>) => {
      const { images, type } = action.payload;
      const options: SelectOption[] = images?.map(({ value, label, url }: any) => ({
        value: value,
        label: label,
        url:url    
      }));
      state[type].imageOptions = options;
    },
    setPage: (state, action: PayloadAction<SetPagePayload>) => {
      const { type, page } = action.payload;
      state[type].filters.page = page;
      state.refresh += 1;
      state.refreshLoader = true;
    },
    removeImage: (state, action: PayloadAction<{ type: imageType; id: string }>) => {
      const { type, id } = action.payload;
      state[type].images = state[type].images.filter((image: any) => image._id !== id);
      state[type].count -= 1;
    },
    
  },
});

const imagesReducer = imagesSlice.reducer;

export const imageActions = imagesSlice.actions;
export default imagesReducer;
