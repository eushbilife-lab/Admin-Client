import { productActions } from "redux/slices/product";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";
import ImageService from "./image.service";
import { modalActions } from "redux/slices/modal";

const url = "/products";

const productService = {
  create: async (data: any, navigate: NavigateFunction, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { product } = success?.data?.data;
      dispatch?.(productActions.setProduct(product));
    }
    dispatch?.(productActions.setLoading(false));
    return success ? [success, error, success?.data?.data?.product] : [success, error];
  },

  getAll: async (data: any, dispatch: Dispatch) => {
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/query`, { ...data, isDelete: false })
    );
    if (success) {
      const { products, totalCount } = success?.data?.data;
      dispatch?.(
        productActions.setProducts({ products, count: totalCount })
      );
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(productActions.setProduct(success.data.data.product));
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  /** Pass `navigate` to leave the page after success; pass `null` to stay. */
  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction | null,
    dispatch: Dispatch
  ) => {
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      dispatch?.(productActions.setProduct(success.data.data.updatedProduct));
      navigate?.("/products");
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  updateImage: async (
    id: string,
    files: any[],
    prevImages: string[],
    dispatch: Dispatch
  ) => {
    if (!files?.length) return [null, null];
    const imageFiles = await Promise.all(
      files.map((file: any) =>
        ImageService.getImageFileFromBlob({
          blob: file,
          name: file.name,
          type: file.type,
        })
      )
    );
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("productImages", file));

    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { previousImages: JSON.stringify(prevImages) },
      })
    );
    if (success) {
      dispatch?.(productActions.setProduct(success.data.data.updatedProduct));
      dispatch?.(productActions.refresh());
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  updateStatus: async (id: string, data: any, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/status`, data)
    );
    if (success) {
      const { updatedStatus } = success.data.data;
      dispatch?.(productActions.setProduct(updatedStatus));
      dispatch(productActions.removeProduct(updatedStatus._id));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  keepImages: async (id: string, productImages: string[], dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/gallery`, { productImages })
    );
    if (success) {
      dispatch?.(productActions.setProduct(success.data.data.updatedProduct));
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  updateProductImage: async (id: string, data: any, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/image`, data)
    );
    if (success) {
      dispatch?.(
        productActions.setProduct(success.data.data.updatedProductImage)
      );
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) {
      dispatch(productActions.removeProduct(id));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
};

export default productService;
