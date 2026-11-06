import type { AppDispatch } from "redux/store";
import { rdaApi } from "redux/api/rda/rdaApi";
import { rdaActions } from "redux/slices/rda";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const rdaService = {
  update: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(rdaActions.setLoading(true));
    try {
      const rdas = await d(rdaApi.endpoints.updateRda.initiate(data)).unwrap();
      d(rdaActions.setRdas({ rdas }));
      return [{ data: { data: { rdas } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(rdaActions.setLoading(false));
    }
  },

  getAll: async (dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(rdaActions.setLoading(true));
    try {
      const Rdas = await d(
        rdaApi.endpoints.getAllRdas.initiate(undefined, { forceRefetch: true })
      ).unwrap();
      d(rdaActions.setRdas({ rdas: Rdas }));
      return [{ data: { data: { Rdas } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(rdaActions.setLoading(false));
    }
  },
};

export default rdaService;
