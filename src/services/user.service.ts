import http from "./http.service";
import Promisable from "./promisable.service";
import { userActions } from "redux/slices/user";
import { Dispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

const url = "/users";

const UserService = {
  getAllUsers: async (data: any,dispatch:Dispatch) => {
    dispatch?.(userActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/query`, data)
    );
    if (success) {
      const { users, totalCount } = success?.data?.data;
      dispatch?.(
        userActions.setUsers({ users: users, count: totalCount })
      );
    }
    dispatch?.(userActions.setLoading(false));
    return [success, error];
  },
  getUser: async (id: any ,dispatch:Dispatch) => {
    dispatch?.(userActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { user } = success?.data?.data;
      dispatch?.(
        userActions.setUser(user)
      );
    }
    dispatch?.(userActions.setLoading(false));
    return [success, error];
  },
  updateUser:async (id:any,data:any,navigate:NavigateFunction,dispatch:Dispatch) => {
    dispatch?.(userActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`,data)
    );
    if (success) {
      const { user } = success?.data?.data;
      dispatch?.(userActions.setUser(user));
      navigate("/users")
    }
    dispatch?.(userActions.setLoading(false));
    return [success, error];
  },
};

export default UserService;
