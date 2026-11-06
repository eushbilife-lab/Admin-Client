import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/meal-plans";

const mealPlanService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/get-All`, data));
  },
  getOne: async (id: string) => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/${id}`));
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

export default mealPlanService;
