import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

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
  devices?: unknown;
};

type NotificationsListData = {
  notifications?: any[];
  broadcasts?: any[];
  totalCount: number;
};

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotificationStatus: build.query<unknown, void>({
      query: () => ({ url: "/notifications/status", method: "GET" }),
      transformResponse: (response: unknown) => unwrapData(response),
    }),

    getNotificationAudience: build.mutation<
      unknown,
      { segment: string; email?: string }
    >({
      query: ({ segment, email = "" }) => ({
        url: "/notifications/audience",
        method: "POST",
        data: { segment, email },
      }),
      transformResponse: (response: unknown) => unwrapData(response),
    }),

    getAllNotifications: build.query<
      { notifications: any[]; count: number },
      Record<string, unknown>
    >({
      query: (body) => ({ url: "/notifications", method: "POST", data: body }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<NotificationsListData>(response);
        return {
          notifications: data?.notifications || data?.broadcasts || [],
          count: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map(({ _id }: any) => ({
                type: "Notification" as const,
                id: _id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),

    getNotification: build.query<any, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ notification: any }>(response)?.notification,
      providesTags: (_r, _e, id) => [{ type: "Notification", id }],
    }),

    sendNotification: build.mutation<any, SendNotificationPayload | FormData>({
      query: (data) => ({
        url: "/notifications/send",
        method: "POST",
        data,
        ...(data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {}),
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ broadcast?: any; notification?: any }>(response);
        return data?.broadcast || data?.notification;
      },
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),

    removeNotification: build.mutation<unknown, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetNotificationStatusQuery,
  useGetNotificationAudienceMutation,
  useGetAllNotificationsQuery,
  useLazyGetAllNotificationsQuery,
  useGetNotificationQuery,
  useSendNotificationMutation,
  useRemoveNotificationMutation,
} = notificationApi;
