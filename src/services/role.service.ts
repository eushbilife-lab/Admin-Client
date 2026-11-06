import type { AppDispatch } from "redux/store";
import { NavigateFunction } from "react-router-dom";
import { roleActions } from "redux/slices/role";
import { roleApi } from "redux/api/role/roleApi";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const roleService = {
  createRole: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(roleActions.setLoading(true));
    try {
      const userByRole = await d(
        roleApi.endpoints.createRole.initiate(data)
      ).unwrap();
      d(roleActions.setRole(userByRole));
      navigate("/roles");
      return [{ data: { data: { userByRole } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(roleActions.setLoading(false));
    }
  },

  getAllRoles: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(roleActions.setLoading(true));
    try {
      const result = await d(
        roleApi.endpoints.getAllRoles.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(roleActions.setRoles(result));
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(roleActions.setLoading(false));
    }
  },

  getRole: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(roleActions.setLoading(true));
    try {
      const userByRole = await d(
        roleApi.endpoints.getRole.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(roleActions.setRole(userByRole));
      return [{ data: { data: { userByRole } } }, null];
    } catch (error) {
      d(roleActions.setRole({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(roleActions.setLoading(false));
    }
  },

  updateRole: async (
    id: string,
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const updateUsersByRole = await d(
        roleApi.endpoints.updateRole.initiate({ id, data })
      ).unwrap();
      d(roleActions.setRole(updateUsersByRole));
      navigate("/roles");
      return [{ data: { data: { updateUsersByRole } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default roleService;
