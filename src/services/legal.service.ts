import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/legal";

const legalService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/get-All`, data));
  },
  upsert: async (data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/upsert`, data));
  },
};

export default legalService;
