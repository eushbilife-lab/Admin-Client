export { default, imageActions, imagesSlice } from "./imagesSlice";

export enum imageValues {
  product_certificate='product_certificate'  
}
export type imageType = keyof typeof imageValues;

export interface BasicImageState {
  refreshLoader: boolean;
  refresh: number;
}

export interface IImage {
  count: number;
  image: {};
  images: any[];
  loading: boolean;
  current_filters: any;
  filters: any;
  imageOptions: any[];
}

export type imageState = BasicImageState & {
  [key in imageValues]: IImage;
};

export interface SetImagePayload {
  data: {
    _id: any
  };
  type:imageType
}
export interface SetimagesPayload {
  data: any[];
  count:number,
  type:imageType
}
export interface SetImageLoading {
  type: imageType;
  loading: boolean;
}

export interface SetImageOptionsPayload{
  images: any[];
  type:imageType
}

export interface SetPagePayload{
  page :number,
  type:imageType
}