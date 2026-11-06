import type { AppDispatch } from "redux/store";
import { measurementScaleApi } from "redux/api/measurementScale/measurementScaleApi";
import { measurementScaleActions } from "redux/slices/measurementScale";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const MeasurementScaleService = {
  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const measurementScale = await d(
        measurementScaleApi.endpoints.createMeasurementScale.initiate(data)
      ).unwrap();
      if (!measurementScale) {
        d(
          measurementScaleActions.setMeasurementScale({
            type: measurementScale?.type,
            data: measurementScale,
          })
        );
      } else {
        MeasurementScaleService.getAll(
          measurementScale?.type,
          { page: 1, page_size: 3 },
          d
        );
      }
      d(modalActions.closeModal());
      return [{ data: { data: { measurementScale } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAll: async (type: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(measurementScaleActions.setLoading({ type, loading: true }));
    try {
      const { UOM, count } = await d(
        measurementScaleApi.endpoints.getAllMeasurementScales.initiate(
          {
            type,
            page: filters.page,
            page_size: filters.page_size,
            ...(filters.name ? { name: filters.name } : {}),
            ...(filters.status ? { status: filters.status } : {}),
          },
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        measurementScaleActions.setMeasurementScales({
          data: UOM,
          type,
          count,
        })
      );
      return [{ data: { data: { UOM, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(measurementScaleActions.setLoading({ type, loading: false }));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const uom = await d(
        measurementScaleApi.endpoints.updateMeasurementScale.initiate({
          id,
          data,
        })
      ).unwrap();
      d(
        measurementScaleActions.setMeasurementScale({ type: uom.type, data: uom })
      );
      d(modalActions.closeModal());
      return [{ data: { data: { uom } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getOptions: async (payload: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { uom, count } = await d(
        measurementScaleApi.endpoints.getMeasurementScaleOptions.initiate(
          payload,
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        measurementScaleActions.setOptions({
          data: uom,
          count,
          type: payload?.type,
        })
      );
      return [{ data: { data: { uom, count } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  remove: async (
    id: string,
    dispatch?: AppDispatch,
    type?: any,
    filters?: any
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(measurementScaleActions.setLoading({ type, loading: true }));
    try {
      await d(
        measurementScaleApi.endpoints.removeMeasurementScale.initiate(id)
      ).unwrap();
      let currentPage = filters.page;
      const [fetchSuccess]: any = await MeasurementScaleService.getAll(
        type,
        { ...filters },
        d
      );
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
        await MeasurementScaleService.getAll(
          type,
          { ...filters, page: currentPage },
          d
        );
      }
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(measurementScaleActions.setLoading({ type, loading: false }));
    }
  },
};

export default MeasurementScaleService;
