import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { imageActions } from "redux/slices/images";
import { NavigateFunction } from "react-router-dom";
import { modalActions } from "redux/slices/modal";
import ImageService from "./image.service";

const url = "/images";

const imagesService = {
  getOptions: async (data: any, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { images } = success?.data?.data;
      dispatch?.(
        imageActions.setOptions({
          images: images,
          type: data?.type,
        })
      );
    }
    return [success, error];
  },
  create: async (data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
   const check = await ImageService.getImageFileFromBlob({
      blob: data.url,
      name: data.url.name,
      type: data.url.type,
    });
    let formData = new FormData();
    formData.append("url", check);
    formData.append("name", data.name);
    formData.append("type", data.type);
    const folder = "certificate";
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${folder}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
    if (success) {
      const { image } = success?.data?.data;
      if(!image){
        dispatch?.(
          imageActions.setImage({ type: image?.type, data: image })
        )
      }else{
        imagesService.getAll(image?.type, { page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAll: async (type: any, filters: any, dispatch: Dispatch) => {
    dispatch?.(imageActions.setLoading({ type, loading: true }));
    http.setJWT();
    const payload = {
      type,
      page: filters.page,
      page_size: filters.page_size,
      isDelete:false
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All-images`, payload)
    );
    if (success) {
      const { image, count } = success?.data?.data;
      dispatch?.(
        imageActions.setImages({
          data: image,
          type,
          count,
        })
      );
    }
    dispatch?.(imageActions.setLoading({ type, loading: false }));
    return [success, error];
  },
  get: async (data:any, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { images } = success?.data?.data;
      dispatch?.(
        imageActions.setOptions({
          images: images,
          type: data?.type,
        })
      );
    }
    return [success, error];
  },
  update: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
   const check = await ImageService.getImageFileFromBlob({
      blob: data.url,
      name: data.url.name,
      type: data.url.type,
    });
    let formData = new FormData();
    formData.append("url", check);
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("previousImageUrl", data.previousImageUrl);
    const folder = "certificate";
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/${folder}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
    if (success) {
      const { images } = success?.data?.data;
      dispatch?.(imageActions.setImage({ type: data.type, data: images }));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  remove: async (id: string, dispatch: Dispatch, type: string, filters: any) => {
    http.setJWT();
    http.setLanguage();
  
    dispatch?.(imageActions.setLoading({ type: "product_certificate", loading: true }));
  
    const [success, error]: any = await Promisable.asPromise(http.delete(`${url}/${id}`));
  
    if (success) {
      let currentPage = filters.page;
      const [fetchSuccess]: any = await imagesService.getAll(type, { ...filters }, dispatch);
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
     await imagesService.getAll(type, { ...filters, page: currentPage }, dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(imageActions.setLoading({ type: "product_certificate", loading: false }));
  
    return [success, error];
  },
  
  
};
export default imagesService;
