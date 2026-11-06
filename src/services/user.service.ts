import type { AppDispatch } from "redux/store";
import { userApi } from "redux/api/user/userApi";
import { userActions } from "redux/slices/user";
import { NavigateFunction } from "react-router-dom";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const UserService = {
  getAllUsers: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(userActions.setLoading(true));
    try {
      const result = await d(
        userApi.endpoints.getAllUsers.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        userActions.setUsers({
          users: result.users,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(userActions.setLoading(false));
    }
  },

  getUser: async (id: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(userActions.setLoading(true));
    try {
      const user = await d(
        userApi.endpoints.getUser.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(userActions.setUser(user));
      return [{ data: { data: { user } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(userActions.setLoading(false));
    }
  },

  updateUser: async (
    id: any,
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(userActions.setLoading(true));
    try {
      const user = await d(
        userApi.endpoints.updateUser.initiate({ id, data })
      ).unwrap();
      d(userActions.setUser(user));
      navigate("/users");
      return [{ data: { data: { user } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(userActions.setLoading(false));
    }
  },

  suspendUser: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const user = await d(userApi.endpoints.suspendUser.initiate(id)).unwrap();
      if (user) d(userActions.setUser(user));
      d(userActions.refresh());
      return [{ data: { data: { user } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  removeUser: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      await d(userApi.endpoints.removeUser.initiate(id)).unwrap();
      d(userActions.deleteUserById(id));
      d(userActions.setUser(null));
      d(userActions.refresh());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default UserService;
