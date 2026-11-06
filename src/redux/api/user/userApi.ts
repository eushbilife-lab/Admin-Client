import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type UsersListData = {
  users: any[];
  totalCount: number;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query<UsersListData, Record<string, unknown>>({
      query: (body) => ({ url: "/users/query", method: "POST", data: body }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<UsersListData>(response);
        return {
          users: data?.users || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }: any) => ({
                type: "User" as const,
                id: _id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getUser: build.query<any, string>({
      query: (id) => ({ url: `/users/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ user: any }>(response)?.user,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    updateUser: build.mutation<any, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ user: any }>(response)?.user,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    suspendUser: build.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}/suspend`, method: "POST" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ user: any }>(response)?.user,
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    removeUser: build.mutation<unknown, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useSuspendUserMutation,
  useRemoveUserMutation,
} = userApi;
