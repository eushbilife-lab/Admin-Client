import type { AppDispatch } from "redux/store";
import { processingLevelApi } from "redux/api/processingLevel/processingLevelApi";
import { processingLevelActions } from "redux/slices/processingLevel";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const processingLevelService = {
  getAll: async (filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(processingLevelActions.setLoading(true));
    try {
      const { processingLevels, count } = await d(
        processingLevelApi.endpoints.getAllProcessingLevels.initiate(filters, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        processingLevelActions.setItems({
          items: processingLevels || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { processingLevels, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(processingLevelActions.setLoading(false));
    }
  },

  getOptions: async (dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { options } = await d(
        processingLevelApi.endpoints.getProcessingLevelOptions.initiate(
          undefined,
          { forceRefetch: true }
        )
      ).unwrap();
      d(processingLevelActions.setOptions({ options }));
      return [{ data: { data: { processingLevels: options } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  create: async (data: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const result = await d(
        processingLevelApi.endpoints.createProcessingLevel.initiate(data)
      ).unwrap();
      await processingLevelService.getAll(filters, d);
      await processingLevelService.getOptions(d);
      d(modalActions.closeModal());
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  update: async (
    id: string,
    data: any,
    filters: any,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const result = await d(
        processingLevelApi.endpoints.updateProcessingLevel.initiate({
          id,
          data,
        })
      ).unwrap();
      await processingLevelService.getAll(filters, d);
      await processingLevelService.getOptions(d);
      d(modalActions.closeModal());
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  remove: async (id: string, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(processingLevelActions.setLoading(true));
    try {
      await d(
        processingLevelApi.endpoints.removeProcessingLevel.initiate(id)
      ).unwrap();
      d(processingLevelActions.removeItem(id));
      await processingLevelService.getAll(filters, d);
      await processingLevelService.getOptions(d);
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(processingLevelActions.setLoading(false));
    }
  },
};

export default processingLevelService;
