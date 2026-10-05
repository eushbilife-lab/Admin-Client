import { productActions } from "redux/slices/product";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";
import ImageService from "./image.service";
import { modalActions } from "redux/slices/modal";

const url = "/products";

const productService = {
  create: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { product } = success?.data?.data;
      dispatch?.(productActions.setProduct(product));
      if (product._id) navigate(`/update-product/${product._id}`);
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
  getAll: async (data: any,dispatch:Dispatch) => {
    const updatedData={
      ...data,
      isDelete:false
    }
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/query`, updatedData)
    );
    if (success) {
      const { products, totalCount } = success?.data?.data;
      dispatch?.(
        productActions.setProducts({ products: products, count: totalCount })
      );
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
  get: async (id: string,dispatch:Dispatch) => {
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { product } = success.data.data;
      dispatch?.(productActions.setProduct(product));
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
  update: async (id: string, data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    dispatch?.(productActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { updatedProduct } = success.data.data;
      dispatch?.(productActions.setProduct(updatedProduct));
      navigate("/products");
    }
    if(error)
    dispatch?.(productActions.setLoading(false));
  
    return [success, error];
  },
  updateImage: async (id: string, files: any, prevImages: string[], navigate: NavigateFunction, dispatch: Dispatch) => {
    // Convert new images to file objects
    const imageFiles = await Promise.all(
      files.map((file: any) =>
        ImageService.getImageFileFromBlob({
          blob: file,
          name: file.name, 
          type: file.type,
        })
      )
    );
    let formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("productImages", file); 
    });
    http.setJWT();
    http.setLanguage()
    dispatch?.(productActions.setLoading(true));  
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { previousImages: JSON.stringify(prevImages) } 
      })
    );
    if (success) {
      const { updatedProduct } = success.data.data;
      dispatch?.(productActions.setProduct(updatedProduct));
      dispatch?.(productActions.refresh());
    }
  
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
  updateStatus: async (id: string, data: any,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
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
  updateProductImage: async (id: string, data: any,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/image`, data)
    );
    if (success) {
      const { updatedProductImage } = success.data.data;
      dispatch?.(productActions.setProduct(updatedProductImage));
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
  remove: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(productActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(http.delete(`${url}/${id}`));
    if (success) {
      dispatch(productActions.removeProduct(id));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(productActions.setLoading(false));
    return [success, error];
  },
}  
export default productService;
