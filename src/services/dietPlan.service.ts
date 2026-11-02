import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/diet-plans";

const dietPlanService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/get-All`, data));
  },
  create: async (data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/create`, data));
  },
  update: async (id: string, data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.patch(`${url}/${id}`, data));
  },
  remove: async (id: string) => {
    http.setJWT();
    return Promisable.asPromise(http.delete(`${url}/${id}`));
  },
};

export default dietPlanService;
