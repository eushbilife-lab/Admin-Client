import type { AppDispatch } from "redux/store";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { NavigateFunction } from "react-router-dom";
import { scoreApi } from "redux/api/score/scoreApi";
import ToasterService from "utils/toaster.util";
import { resolveDispatch } from "redux/api/runEndpoint";

function dispatchOr(d?: AppDispatch) {
  return resolveDispatch(d);
}

const scoreService = {
  create: async (data: any, navigate: NavigateFunction, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(scoreCalculationActions.setLoading(true));
    try {
      const result = await d(
        scoreApi.endpoints.createScore.initiate(data)
      ).unwrap();
      ToasterService.showSuccess("Health score created");
      navigate("/scores");
      return [{ data: { data: result } }, null];
    } catch (error: any) {
      ToasterService.showError(
        error?.response?.data?.message || error?.data?.message || "Could not create score"
      );
      return [null, error];
    } finally {
      d(scoreCalculationActions.setLoading(false));
    }
  },

  getAll: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(scoreCalculationActions.setLoading(true));
    try {
      const result = await d(
        scoreApi.endpoints.getAllScores.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        scoreCalculationActions.setScoreCalculations({
          scoreCalculations: result.requiredHNSS || [],
          count: result.totalCount || 0,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(scoreCalculationActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(scoreCalculationActions.setLoading(true));
    try {
      const scoreData = await d(
        scoreApi.endpoints.getScore.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(scoreCalculationActions.setScore(scoreData || {}));
      return [{ data: { data: { scoreData } } }, null];
    } catch (error) {
      d(scoreCalculationActions.setScore({}));
      ToasterService.showError("Score not found");
      return [null, error];
    } finally {
      d(scoreCalculationActions.setLoading(false));
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
    d(scoreCalculationActions.setLoading(true));
    try {
      const result = await d(
        scoreApi.endpoints.updateScore.initiate({ id, data })
      ).unwrap();
      ToasterService.showSuccess("Health score updated");
      navigate("/scores");
      return [{ data: { data: result } }, null];
    } catch (error: any) {
      ToasterService.showError(
        error?.response?.data?.message || error?.data?.message || "Could not update score"
      );
      return [null, error];
    } finally {
      d(scoreCalculationActions.setLoading(false));
    }
  },
};

export default scoreService;
