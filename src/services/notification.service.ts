import type { AppDispatch } from "redux/store";
import { notificationApi } from "redux/api/notification/notificationApi";
import type { SendNotificationPayload } from "redux/api/notification/notificationApi";
import { loaderActions } from "redux/slices/loader";
import { notificationActions } from "redux/slices/notification";
import { modalActions } from "redux/slices/modal";
import ImageService from "./image.service";
import { getAppDispatch } from "utils/dispatch.util";

export type { SendNotificationPayload };

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const NotificationService = {
  getStatus: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const data = await d(
        notificationApi.endpoints.getNotificationStatus.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getAudience: async (segment: string, email = "") => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const data = await d(
        notificationApi.endpoints.getNotificationAudience.initiate({
          segment,
          email,
        })
      ).unwrap();
      return [{ data: { data } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  send: async (data: SendNotificationPayload, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));

    try {
      let payload: SendNotificationPayload | FormData = data;

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
        payload = formData;
      } else {
        payload = {
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
      }

      const broadcast = await d(
        notificationApi.endpoints.sendNotification.initiate(payload)
      ).unwrap();
      if (broadcast) d(notificationActions.addNotification(broadcast));
      d(modalActions.closeModal());
      return [{ data: { data: { broadcast } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  /** @deprecated legacy alias */
  addNotification: async (data: any, _navigate: any, dispatch?: AppDispatch) => {
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

  remove: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      await d(notificationApi.endpoints.removeNotification.initiate(id)).unwrap();
      d(notificationActions.refresh());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getAllNotifications: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d?.(notificationActions.setLoading(true));
    try {
      const result = await d(
        notificationApi.endpoints.getAllNotifications.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        notificationActions.setNotifications({
          notifications: result.notifications,
          count: result.count,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d?.(notificationActions.setLoading(false));
    }
  },

  getNotification: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d?.(loaderActions.setLoading(true));
    try {
      const notification = await d(
        notificationApi.endpoints.getNotification.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      d(notificationActions.setNotification(notification));
      return [{ data: { data: { notification } } }, null];
    } catch (error) {
      d(notificationActions.setNotification({ data: "Not Found" }));
      return [null, error];
    } finally {
      d?.(loaderActions.setLoading(false));
    }
  },

  updateNotification: async () => {
    return [
      null,
      {
        response: {
          data: {
            message: "Broadcasts cannot be edited — send a new one.",
          },
        },
      },
    ];
  },
};

export default NotificationService;
