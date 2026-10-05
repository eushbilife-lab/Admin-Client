import type { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import http from "./http.service";
import type{ Dispatch } from "@reduxjs/toolkit";
import { draftProductActions } from "redux/slices/draftProduct";
import { modalActions } from "redux/slices/modal";

const url = "/draft-products";

const draftProductService = {
  create: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(draftProductActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { product } = success?.data?.data;
      dispatch?.(draftProductActions.setDraftProduct(product));
      if (product?._id) navigate("/products");
    }
    dispatch?.(draftProductActions.setLoading(false));
    return [success, error];
  },
  getAll: async (data: any,dispatch:Dispatch) => {
    dispatch?.(draftProductActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/query`, data)
    );
    if (success) {
      const { products, totalCount } = success?.data?.data;
      dispatch?.(
        draftProductActions.setDraftProducts({ draftProducts: products, count: totalCount })
      );
    }
    dispatch?.(draftProductActions.setLoading(false));
    return [success, error];
  },
  get: async (id: string,dispatch:Dispatch) => {
    dispatch?.(draftProductActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { product } = success.data.data;
      dispatch?.(draftProductActions.setDraftProduct(product));
    } else {
      dispatch?.(draftProductActions.setDraftProduct({ data: "Not Found" }))
    };
    dispatch?.(draftProductActions.setLoading(false));
    return [success, error];
  },
  update: async (id: string, data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(draftProductActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { updatedDraftProduct } = success.data.data;
      dispatch?.(draftProductActions.setDraftProduct(updatedDraftProduct));
      navigate("/products");
    }
    if(error) dispatch?.(draftProductActions.setLoading(false));
    return [success, error];
  },
  remove: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(draftProductActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(http.delete(`${url}/${id}`));
    if (success) {
      dispatch(draftProductActions.removeDraftProduct(id));
      // productService.getAll({ page: 1, page_size: 3 },dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(draftProductActions.setLoading(false));
    return [success, error];
  },
}  
export default draftProductService;
