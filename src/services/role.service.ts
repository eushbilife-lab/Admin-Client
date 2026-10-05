import { NavigateFunction } from "react-router-dom";
import { roleActions } from "redux/slices/role";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/admins";

const roleService = {
  createRole: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    dispatch?.(roleActions.setLoading(true));
    http.setJWT();
    http.setLanguage()

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create-user`, data)
    );
    if (success) {
      const { userByRole } = success?.data?.data;
      dispatch?.(roleActions.setRole(userByRole));
      navigate("/roles");
    }
    dispatch?.(roleActions.setLoading(false));

    return [success, error];
  },
  getAllRoles: async (data: any = { all: "true" },dispatch:Dispatch) => {
    dispatch?.(roleActions.setLoading(true));
    http.setJWT();
    http.setLanguage()

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-all-roles`, data)
    );
    if (success) {
      const { usersByRoles, totalCount } = success?.data?.data;
      dispatch?.(
        roleActions.setRoles({ Roles: usersByRoles, count: totalCount })
      );
    }
    dispatch?.(roleActions.setLoading(false));
    return [success, error];
  },
  getRole: async (id: string,dispatch:Dispatch) => {
    dispatch?.(roleActions.setLoading(true));

    http.setJWT();
    http.setLanguage()

    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );

    if (success) {
      const { userByRole } = success.data.data;
      dispatch?.(roleActions.setRole(userByRole));
    } else dispatch?.(roleActions.setRole({ data: "Not Found" }));

    dispatch?.(roleActions.setLoading(false));
    return [success, error];
  },
  updateRole: async (id: string, data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()

    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { updateUsersByRole } = success.data.data;
      dispatch?.(roleActions.setRole(updateUsersByRole));
      navigate("/roles");
    }

    return [success, error];
  },
};
export default roleService;
