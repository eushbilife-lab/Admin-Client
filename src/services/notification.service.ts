import http from "./http.service";
import Promisable from "./promisable.service";
import { NavigateFunction } from "react-router-dom";
import { loaderActions } from "redux/slices/loader";
import { getAppDispatch } from "utils/dispatch.util";
import { notificationActions } from "redux/slices/notification";
import { modalActions } from "redux/slices/modal";
import { Dispatch } from "@reduxjs/toolkit";
import ImageService from "./image.service";

const url = "/notifications";

const NotificationService = {
  addNotification: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: Dispatch
  ) => {
    dispatch?.(modalActions.setLoading(true));
	let formData = new FormData();
	const folder = "notifications";
	if (data.media){
    const imageLink = await ImageService.getImageFileFromBlob({
      blob: data.media,
      name: data.media.name,
      type: data.media.type,
    });
    formData.append("media", imageLink);
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("url", data.url || "");
	}
else{
	formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("url", data.url || "");
}
	http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${folder}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
    if (success) {
      const { notification } = success.data.data;
      dispatch?.(notificationActions.addNotification(notification));
	  navigate("/notifications")
      dispatch?.(modalActions.closeModal());
    }

    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  updateNotification: async (
    id: string,
    data: any,
    navigate?: NavigateFunction,
    dispatch?: Dispatch
  ) => {
    console.log("🚀 ~ data:", data);
    dispatch?.(loaderActions.setLoading(true));

    let formData = new FormData();
    const folder = "notifications";

    if (data.media && typeof data.media !== "string") {
        // If `data.media` is a file, process and upload it
        const imageLink = await ImageService.getImageFileFromBlob({
          blob: data.media,
          name: data.media.name,
          type: data.media.type,
        });
        formData.append("media", imageLink);
    } 
    // Append other fields
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("url", data.url || "");

    http.setJWT();
    http.setLanguage();

    const [success, error]: any = await Promisable.asPromise(
      http.put(`${url}/${id}/${folder}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    if (success) {
      const { notification } = success.data.data;
      dispatch?.(notificationActions.updateNotification({ id, notification }));
      navigate?.("/notifications");
    }

    dispatch?.(loaderActions.setLoading(false));
    return [success, error];
  },

  getNotification: async (id: string, dispatch?: Dispatch) => {
    dispatch?.(loaderActions.setLoading(true));

    http.setJWT();

    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );

    if (success) {
      const { notification } = success.data.data;
      dispatch?.(notificationActions.setNotification(notification));
    } else
      dispatch?.(notificationActions.setNotification({ data: "Not Found" }));

    dispatch?.(loaderActions.setLoading(false));
    return [success, error];
  },
  getAllNotifications: async (data: any, dispatch?: Dispatch) => {
    dispatch?.(notificationActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );

    if (success) {
      const { notifications, totalCount } = success.data.data;
      dispatch?.(
        notificationActions.setNotifications({
          notifications,
          count: totalCount,
        })
      );
    }

    dispatch?.(notificationActions.setLoading(false));
    return [success, error];
  },
};

export default NotificationService;
