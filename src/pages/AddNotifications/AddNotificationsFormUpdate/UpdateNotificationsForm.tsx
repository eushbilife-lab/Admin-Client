import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { notificationActions } from "redux/slices/notification";
import NotificationService from "services/notification.service";

export default function UpdateNotificationsForm({ id }: any) {
  const form = "AddNotificationsForm";
  const dispatch = useAppDispatch();
  const { notification } = useAppSelector((state) => state.notification);

  useEffect(() => {
    NotificationService.getNotification(id || "",dispatch);
    return () => {
      dispatch(notificationActions.setNotification(null));
    };
  }, [id, dispatch]);
  
  useEffect(() => {
    if (!notification) return;

    const { title, url, media, content} = notification;
    dispatch(change(form, "title", title));
    dispatch(change(form, "media", media));
    dispatch(change(form, "url", url || ""));
    dispatch(change(form, "content",content));
    
  }, [notification, dispatch]);

  return null;
}
