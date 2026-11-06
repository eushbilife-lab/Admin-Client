import type { AppDispatch } from "redux/store";
import { exerciseApi } from "redux/api/exercise/exerciseApi";
import { exerciseActions } from "redux/slices/exercise";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const exerciseService = {
  create: async (data: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const result = await d(
        exerciseApi.endpoints.createExercise.initiate(data)
      ).unwrap();
      exerciseService.getAll(filters, d);
      d(modalActions.closeModal());
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAll: async (
    data: any = { page: 1, page_size: 10 },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(exerciseActions.setLoading(true));
    try {
      const { exercises, count } = await d(
        exerciseApi.endpoints.getAllExercises.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        exerciseActions.setExercises({
          exercises: exercises || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { exercises, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(exerciseActions.setLoading(false));
    }
  },

  getOptions: async (
    data: any = { status: "active" },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { exercises } = await d(
        exerciseApi.endpoints.getExerciseOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(exerciseActions.setOptions({ exercises: exercises || [] }));
      return [{ data: { data: { exercises } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const exercise = await d(
        exerciseApi.endpoints.updateExercise.initiate({ id, data })
      ).unwrap();
      d(exerciseActions.setExercise({ data: exercise }));
      d(modalActions.closeModal());
      return [{ data: { data: { exercise } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  remove: async (id: string, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(exerciseActions.setLoading(true));
    try {
      await d(exerciseApi.endpoints.removeExercise.initiate(id)).unwrap();
      await exerciseService.getAll(filters, d);
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(exerciseActions.setLoading(false));
    }
  },
};

export default exerciseService;
