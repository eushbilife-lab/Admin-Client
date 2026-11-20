import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export type InboxItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  source: "app" | "admin";
  audience: "admin" | "staff";
  actor: { kind: string; name: string; role: string };
  isRead: boolean;
  createdAt: string | null;
};

export type InboxQuery = {
  page?: number;
  pageSize?: number;
  status?: "all" | "unread" | "read";
  type?: string;
  source?: "" | "app" | "admin";
  q?: string;
  from?: string;
  to?: string;
};

type InboxList = {
  activities: InboxItem[];
  count: number;
  page: number;
  pageSize: number;
  unreadCount: number;
};

const quiet = { "X-Skip-Toast": "1" };

export const inboxApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInbox: build.query<InboxList, InboxQuery>({
      query: (body) => ({
        url: "/inbox/query",
        method: "POST",
        data: body,
        headers: quiet,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<InboxList>(response);
        return {
          activities: data?.activities || [],
          count: data?.count || 0,
          page: data?.page || 1,
          pageSize: data?.pageSize || 20,
          unreadCount: data?.unreadCount || 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.activities.map((item) => ({ type: "AdminInbox" as const, id: item.id })),
              { type: "AdminInbox" as const, id: "LIST" },
            ]
          : [{ type: "AdminInbox" as const, id: "LIST" }],
    }),
    markInboxRead: build.mutation<InboxItem | null, string>({
      query: (id) => ({
        url: `/inbox/${id}/read`,
        method: "PATCH",
        headers: quiet,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ activity?: InboxItem }>(response)?.activity || null,
      invalidatesTags: [{ type: "AdminInbox", id: "LIST" }],
    }),
    markAllInboxRead: build.mutation<unknown, void>({
      query: () => ({
        url: "/inbox/read-all",
        method: "POST",
        headers: quiet,
      }),
      invalidatesTags: [{ type: "AdminInbox", id: "LIST" }],
    }),
    removeInboxItem: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/inbox/${id}`,
        method: "DELETE",
        headers: quiet,
      }),
      invalidatesTags: [{ type: "AdminInbox", id: "LIST" }],
    }),
  }),
});

export const {
  useGetInboxQuery,
  useMarkInboxReadMutation,
  useMarkAllInboxReadMutation,
  useRemoveInboxItemMutation,
} = inboxApi;
