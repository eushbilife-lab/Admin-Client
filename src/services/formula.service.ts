import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/formulas";

const formulaService = {
  getActive: async () => {
    http.setJWT();
    return Promisable.asPromise(http.get(url));
  },
  getDefaults: async () => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/defaults`));
  },
  getSection: async (section: string) => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/sections/${section}`));
  },
  saveSection: async (section: string, data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.patch(`${url}/sections/${section}`, data));
  },
  replace: async (data: Record<string, unknown>) => {
    http.setJWT();
    return Promisable.asPromise(http.put(url, data));
  },
  reset: async () => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/reset`));
  },
};

export default formulaService;
