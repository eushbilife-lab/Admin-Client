import type { AppDispatch } from "redux/store";
import { dynamicApi } from "redux/api/dynamic/dynamicApi";
import { dynamicActions } from "redux/slices/dynamic";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const dynamicService = {
  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const dynamic = await d(
        dynamicApi.endpoints.createDynamic.initiate(data)
      ).unwrap();
      const type = dynamic?.type || data?.type;
      if (dynamic) {
        d(dynamicActions.setDynamic({ type: dynamic.type, data: dynamic }));
      }
      if (type) {
        dynamicService.getAllDynamics(type, { page: 1, page_size: 20 }, d);
        dynamicService.getOptions({ type, status: "active" }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { dynamic } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAllDynamics: async (type: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(dynamicActions.setLoading({ type, loading: true }));
    try {
      const result = await d(
        dynamicApi.endpoints.getAllDynamics.initiate(
          {
            type,
            page: filters.page,
            page_size: filters.page_size,
            ...(filters.name ? { name: filters.name } : {}),
          },
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        dynamicActions.setDynamics({
          data: result.dynamic,
          type,
          count: result.count,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(dynamicActions.setLoading({ type, loading: false }));
    }
  },

  updateDynamic: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const dynamics = await d(
        dynamicApi.endpoints.updateDynamic.initiate({ id, data })
      ).unwrap();
      const type = dynamics?.type || data?.type;
      if (dynamics) {
        d(
          dynamicActions.setDynamic({ type: dynamics.type, data: dynamics })
        );
      }
      if (type) {
        dynamicService.getOptions({ type, status: "active" }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { dynamics } } }, null];
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
      const dynamics = await d(
        dynamicApi.endpoints.getDynamicOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        dynamicActions.setOptions({
          dynamics,
          type: data?.type,
        })
      );
      return [{ data: { data: { dynamics } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default dynamicService;
