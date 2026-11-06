import type { AppDispatch } from "redux/store";
import { hnssProductCategoryApi } from "redux/api/hnssProductCategory/hnssProductCategoryApi";
import { hnssProductCategoryActions } from "redux/slices/hnssProductCategory";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const hnssProductCategoryService = {
  getOptions: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { hnssProductCategories: HNSSCategories } = await d(
        hnssProductCategoryApi.endpoints.getHnssProductCategoryOptions.initiate(
          data,
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        hnssProductCategoryActions?.setOptions({
          hnssProductCategories: HNSSCategories,
        })
      );
      return [{ data: { data: { HNSSCategories } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default hnssProductCategoryService;
