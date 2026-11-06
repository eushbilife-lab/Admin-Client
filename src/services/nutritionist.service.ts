import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/nutritionist-requests";

const nutritionistService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/get-All`, data));
  },
  update: async (id: string, data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.patch(`${url}/${id}`, data));
  },
};

export default nutritionistService;
