import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { hnssProductCategoryActions } from "redux/slices/hnssProductCategory";

const url = "/hnss-product-categories";

const hnssProductCategoryService = {
  getOptions: async (data: any, dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { HNSSCategories } = success?.data?.data;
      dispatch?.(
        hnssProductCategoryActions?.setOptions({
          hnssProductCategories: HNSSCategories,
        })
      );
    }
    return [success, error];
  },
};
export default hnssProductCategoryService;
