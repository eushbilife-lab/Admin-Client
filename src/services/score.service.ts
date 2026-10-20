import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import ToasterService from "utils/toaster.util";

const url = "/scores";

const scoreService = {
  create: async (data: any, navigate: NavigateFunction, dispatch: Dispatch) => {
    dispatch?.(scoreCalculationActions.setLoading(true));
    http.setJWT();
    http.setLanguage();

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      ToasterService.showSuccess("Health score created");
      navigate("/scores");
    } else {
      ToasterService.showError(
        error?.response?.data?.message || "Could not create score"
      );
    }
    dispatch?.(scoreCalculationActions.setLoading(false));
    return [success, error];
  },

  getAll: async (data: any, dispatch: Dispatch) => {
    dispatch?.(scoreCalculationActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { requiredHNSS, totalCount } = success?.data?.data || {};
      dispatch?.(
        scoreCalculationActions.setScoreCalculations({
          scoreCalculations: requiredHNSS || [],
          count: totalCount || 0,
        })
      );
    }
    dispatch?.(scoreCalculationActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(scoreCalculationActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { scoreData } = success.data.data || {};
      dispatch?.(scoreCalculationActions.setScore(scoreData || {}));
    } else {
      dispatch?.(scoreCalculationActions.setScore({}));
      ToasterService.showError("Score not found");
    }

    dispatch?.(scoreCalculationActions.setLoading(false));
    return [success, error];
  },

  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction,
    dispatch: Dispatch
  ) => {
    http.setJWT();
    dispatch?.(scoreCalculationActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      ToasterService.showSuccess("Health score updated");
      navigate("/scores");
    } else {
      ToasterService.showError(
        error?.response?.data?.message || "Could not update score"
      );
    }
    dispatch?.(scoreCalculationActions.setLoading(false));
    return [success, error];
  },
};

export default scoreService;
