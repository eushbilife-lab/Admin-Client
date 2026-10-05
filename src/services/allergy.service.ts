import { dynamicActions } from "redux/slices/dynamic";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { allergyActions } from "redux/slices/allergies";

const url = "/allergies";

const allergyService = {
  createMajor: async (data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create-major`, data)
    );
    if (success) {
      const { allergyCategory } = success?.data.data;
      if (!allergyCategory) {
        dispatch?.(
          allergyActions.setAllergy(allergyCategory)
        );
      }
      else{
        allergyService.getAllMajor({ page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  createMinor: async (data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create-minor`, data)
    );
    if (success) {
      const { allergySubCategory } = success?.data.data;
      if (!allergySubCategory) {
        dispatch?.(
          allergyActions.setAllergy(allergySubCategory)
        );
      }
      else{
        allergyService.getAllMinor({ page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAllMajor: async (filters: any, dispatch: Dispatch) => {
    dispatch?.(allergyActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const payload = {
      page: filters.page,
      page_size: filters.page_size,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/major-Allergy`, payload)
    );

    if (success) {
      const { allergies, count } = success?.data?.data;
      dispatch?.(
        allergyActions.setAllergies({
          allergies: allergies,
          count,
        })
      );
    }
    dispatch?.(allergyActions.setLoading(false));
    return [success, error];
  },
  getAllMinor: async (filters: any, dispatch: Dispatch) => {
    dispatch?.(allergyActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const payload = {
      page: filters.page,
      page_size: filters.page_size,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/minor-Allergy`, payload)
    );
    if (success) {
      const { allergies, count } = success?.data?.data;
      dispatch?.(
        allergyActions.setAllergies({
          allergies: allergies,
          count,
        })
      );
    }
    dispatch?.(allergyActions.setLoading(false));
    return [success, error];
  },
  updateMajor: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/update-Major`, data)
    );
    if (success) {
      const { allergyCategorys } = success?.data?.data;
      dispatch?.(
        allergyActions.setAllergy({data:allergyCategorys})
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  updateMinor: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}/update-Minor`, data)
    );
    if (success) {
      const { allergySubCatrgory } = success?.data?.data;
      dispatch?.(
        allergyActions.setAllergy({data:allergySubCatrgory})
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getOptions: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { allergies } = success?.data?.data;
      dispatch?.(
        allergyActions.setOptions({
          allergies: allergies,
        })
      );
    }
    return [success, error];
  },
};
export default allergyService;
