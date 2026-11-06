import type { AppDispatch } from "redux/store";
import { allergyApi } from "redux/api/allergy/allergyApi";
import { allergyActions } from "redux/slices/allergies";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const allergyService = {
  createMajor: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const allergyCategory = await d(
        allergyApi.endpoints.createMajorAllergy.initiate(data)
      ).unwrap();
      if (!allergyCategory) {
        d(allergyActions.setAllergy(allergyCategory));
      } else {
        allergyService.getAllMajor({ page: 1, page_size: 3 }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { allergyCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  createMinor: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const allergySubCategory = await d(
        allergyApi.endpoints.createMinorAllergy.initiate(data)
      ).unwrap();
      if (!allergySubCategory) {
        d(allergyActions.setAllergy(allergySubCategory));
      } else {
        allergyService.getAllMinor({ page: 1, page_size: 3 }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { allergySubCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAllMajor: async (filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(allergyActions.setLoading(true));
    try {
      const { allergies, count } = await d(
        allergyApi.endpoints.getAllMajorAllergies.initiate(filters, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        allergyActions.setAllergies({
          allergies,
          count,
        })
      );
      return [{ data: { data: { allergies, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(allergyActions.setLoading(false));
    }
  },

  getAllMinor: async (filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(allergyActions.setLoading(true));
    try {
      const { allergies, count } = await d(
        allergyApi.endpoints.getAllMinorAllergies.initiate(filters, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        allergyActions.setAllergies({
          allergies,
          count,
        })
      );
      return [{ data: { data: { allergies, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(allergyActions.setLoading(false));
    }
  },

  updateMajor: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const allergyCategorys = await d(
        allergyApi.endpoints.updateMajorAllergy.initiate({ id, data })
      ).unwrap();
      d(allergyActions.setAllergy({ data: allergyCategorys }));
      d(modalActions.closeModal());
      return [{ data: { data: { allergyCategorys } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  updateMinor: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const allergySubCatrgory = await d(
        allergyApi.endpoints.updateMinorAllergy.initiate({ id, data })
      ).unwrap();
      d(allergyActions.setAllergy({ data: allergySubCatrgory }));
      d(modalActions.closeModal());
      return [{ data: { data: { allergySubCatrgory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getOptions: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { allergies } = await d(
        allergyApi.endpoints.getAllergyOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        allergyActions.setOptions({
          allergies,
        })
      );
      return [{ data: { data: { allergies } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default allergyService;
