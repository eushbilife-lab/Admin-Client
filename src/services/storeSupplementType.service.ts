import { storeSupplementTypeApi } from "redux/api/storeSupplementType/storeSupplementTypeApi";
import { getAppDispatch } from "utils/dispatch.util";

const storeSupplementTypeService = {
  getAll: async (data: any = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storeSupplementTypeApi.endpoints.getAllStoreSupplementTypes.initiate(
          data,
          { forceRefetch: true }
        )
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storeSupplementTypeService;
