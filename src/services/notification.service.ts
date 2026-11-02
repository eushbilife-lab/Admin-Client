import http from "./http.service";
import Promisable from "./promisable.service";
import { loaderActions } from "redux/slices/loader";
import { notificationActions } from "redux/slices/notification";
import { modalActions } from "redux/slices/modal";
import { Dispatch } from "@reduxjs/toolkit";
import ImageService from "./image.service";

const url = "/notifications";

export type SendNotificationPayload = {
  title: string;
  body: string;
  link?: string;
  image?: string;
  audience: "all" | "user" | "recent" | "newsletter";
  email?: string;
  priority?: "update" | "deal" | "urgent";
  channel?: "inbox" | "push" | "both";
  promoId?: string;
  promoCode?: string;
  media?: File | Blob | string;
};

const NotificationService = {
  getStatus: async () => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/status`));
  },

  getAudience: async (segment: string, email = "") => {
    http.setJWT();
    return Promisable.asPromise(
      http.post(`${url}/audience`, { segment, email })
    );
  },

  send: async (data: SendNotificationPayload, dispatch?: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage();

    let success: any;
    let error: any;

    if (data.media && typeof data.media !== "string") {
      const formData = new FormData();
      const imageLink = await ImageService.getImageFileFromBlob({
        blob: data.media,
        name: (data.media as File).name || "notification.jpg",
        type: (data.media as File).type || "image/jpeg",
      });
      formData.append("media", imageLink);
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("content", data.body);
      formData.append("link", data.link || "");
      formData.append("url", data.link || "");
      formData.append("audience", data.audience);
      formData.append("email", data.email || "");
      formData.append("priority", data.priority || "update");
      formData.append("channel", data.channel || "both");
      if (data.promoId) formData.append("promoId", data.promoId);
      if (data.promoCode) formData.append("promoCode", data.promoCode);

      [success, error] = await Promisable.asPromise(
        http.post(`${url}/send`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
    } else {
      const payload = {
        title: data.title,
        body: data.body,
        link: data.link || "",
        image: typeof data.media === "string" ? data.media : data.image || "",
        audience: data.audience,
        email: data.email || "",
        priority: data.priority || "update",
        channel: data.channel || "both",
        promoId: data.promoId || "",
        promoCode: data.promoCode || "",
      };
      [success, error] = await Promisable.asPromise(
        http.post(`${url}/send`, payload)
      );
    }

    if (success) {
      const broadcast =
        success.data?.data?.broadcast || success.data?.data?.notification;
      if (broadcast) {
        dispatch?.(notificationActions.addNotification(broadcast));
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  /** @deprecated legacy alias */
  addNotification: async (data: any, _navigate: any, dispatch?: Dispatch) => {
    return NotificationService.send(
      {
        title: data.title,
        body: data.content || data.body,
        link: data.url || data.link,
        media: data.media,
        audience: data.audience || "all",
        email: data.email,
        priority: data.priority || (data.promoCode ? "deal" : "update"),
        channel: data.channel || "both",
        promoId: data.promoId,
        promoCode: data.promoCode,
      },
      dispatch
    );
  },

  remove: async (id: string, dispatch?: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) dispatch?.(notificationActions.refresh());
    return [success, error];
  },

  getAllNotifications: async (data: any, dispatch?: Dispatch) => {
    dispatch?.(notificationActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );

    if (success) {
      const { notifications, broadcasts, totalCount } = success.data.data;
      dispatch?.(
        notificationActions.setNotifications({
          notifications: notifications || broadcasts || [],
          count: totalCount,
        })
      );
    }

    dispatch?.(notificationActions.setLoading(false));
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
    } else {
      dispatch?.(notificationActions.setNotification({ data: "Not Found" }));
    }
    dispatch?.(loaderActions.setLoading(false));
    return [success, error];
  },

  updateNotification: async () => {
    return [
      null,
      { response: { data: { message: "Broadcasts cannot be edited — send a new one." } } },
    ];
  },
};

export default NotificationService;
