import type { AppDispatch } from "redux/store";
import { storeProductApi } from "redux/api/storeProduct/storeProductApi";
import { storeProductActions } from "redux/slices/storeProduct";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const storeProductService = {
  getAll: async (
    data: any = { page: 1, page_size: 50 },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeProductActions.setLoading(true));
    try {
      const { products, count } = await d(
        storeProductApi.endpoints.getAllStoreProducts.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        storeProductActions.setProducts({
          products: products || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { products, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeProductActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeProductActions.setLoading(true));
    try {
      const product = await d(
        storeProductApi.endpoints.getStoreProduct.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      d(storeProductActions.setProduct(product || null));
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeProductActions.setLoading(false));
    }
  },

  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeProductActions.setLoading(true));
    try {
      const product = await d(
        storeProductApi.endpoints.createStoreProduct.initiate(data)
      ).unwrap();
      d(storeProductActions.setProduct(product));
      d(storeProductActions.refresh());
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeProductActions.setLoading(false));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeProductActions.setLoading(true));
    try {
      const product = await d(
        storeProductApi.endpoints.updateStoreProduct.initiate({ id, data })
      ).unwrap();
      d(storeProductActions.setProduct(product));
      d(storeProductActions.refresh());
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeProductActions.setLoading(false));
    }
  },

  remove: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      await d(
        storeProductApi.endpoints.removeStoreProduct.initiate(id)
      ).unwrap();
      d(storeProductActions.removeProduct(id));
      d(storeProductActions.refresh());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storeProductService;
