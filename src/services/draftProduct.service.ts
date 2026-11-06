import type { AppDispatch } from "redux/store";
import type { NavigateFunction } from "react-router-dom";
import { draftProductApi } from "redux/api/draftProduct/draftProductApi";
import { draftProductActions } from "redux/slices/draftProduct";
import { modalActions } from "redux/slices/modal";
import { resolveDispatch } from "redux/api/runEndpoint";

function dispatchOr(d?: AppDispatch) {
  return resolveDispatch(d);
}

const draftProductService = {
  create: async (data: any, navigate: NavigateFunction, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(draftProductActions.setLoading(true));
    try {
      const product = await d(
        draftProductApi.endpoints.createDraftProduct.initiate(data)
      ).unwrap();
      d(draftProductActions.setDraftProduct(product));
      if (product?._id) navigate("/products");
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(draftProductActions.setLoading(false));
    }
  },

  getAll: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(draftProductActions.setLoading(true));
    try {
      const result = await d(
        draftProductApi.endpoints.getAllDraftProducts.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        draftProductActions.setDraftProducts({
          draftProducts: result.products,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(draftProductActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(draftProductActions.setLoading(true));
    try {
      const product = await d(
        draftProductApi.endpoints.getDraftProduct.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      d(draftProductActions.setDraftProduct(product));
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      d(draftProductActions.setDraftProduct({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(draftProductActions.setLoading(false));
    }
  },

  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction,
    dispatch: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(draftProductActions.setLoading(true));
    try {
      const updatedDraftProduct = await d(
        draftProductApi.endpoints.updateDraftProduct.initiate({ id, data })
      ).unwrap();
      d(draftProductActions.setDraftProduct(updatedDraftProduct));
      navigate("/products");
      return [{ data: { data: { updatedDraftProduct } } }, null];
    } catch (error) {
      d(draftProductActions.setLoading(false));
      return [null, error];
    }
  },

  remove: async (id: string, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(draftProductActions.setLoading(true));
    try {
      await d(
        draftProductApi.endpoints.removeDraftProduct.initiate(id)
      ).unwrap();
      d(draftProductActions.removeDraftProduct(id));
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(draftProductActions.setLoading(false));
    }
  },
};

export default draftProductService;
