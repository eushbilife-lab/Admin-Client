import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type RolesListData = {
  usersByRoles: any[];
  totalCount: number;
};

export const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query<
      { Roles: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/admins/get-all-roles",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<RolesListData>(response);
        return {
          Roles: data?.usersByRoles || [],
          count: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.Roles.map(({ _id }: any) => ({
                type: "Role" as const,
                id: _id,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    getRole: build.query<any, string>({
      query: (id) => ({ url: `/admins/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ userByRole: any }>(response)?.userByRole,
      providesTags: (_r, _e, id) => [{ type: "Role", id }],
    }),

    createRole: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/admins/create-user",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ userByRole: any }>(response)?.userByRole,
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: build.mutation<any, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/admins/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updateUsersByRole: any }>(response)?.updateUsersByRole,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useLazyGetAllRolesQuery,
  useGetRoleQuery,
  useLazyGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = roleApi;
