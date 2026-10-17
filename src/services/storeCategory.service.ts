import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/store-categories";

const storeCategoryService = {
  getAll: async (data: any = {}) => {
    http.setJWT();
    return Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
  },

  create: async (data: any) => {
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/create`, data));
  },

  update: async (id: string, data: any) => {
    http.setJWT();
    return Promisable.asPromise(http.patch(`${url}/${id}`, data));
  },

  remove: async (id: string) => {
    http.setJWT();
    return Promisable.asPromise(http.delete(`${url}/${id}`));
  },
};

export default storeCategoryService;
