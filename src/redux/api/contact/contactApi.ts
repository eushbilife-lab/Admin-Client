import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

const skipToast = { headers: { "X-Skip-Toast": "1" } };

type ContactsListData = {
  requests?: any[];
  count?: number;
};

export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContactOverview: build.query<
      { stats?: Record<string, number> } | null,
      void
    >({
      query: () => ({
        url: "/contacts/overview",
        method: "GET",
        ...skipToast,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ stats?: Record<string, number> }>(response) || null,
      providesTags: [{ type: "Contact", id: "OVERVIEW" }],
    }),

    getContactNumbers: build.query<unknown, void>({
      query: () => ({
        url: "/contact-numbers",
        method: "GET",
        ...skipToast,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      providesTags: [{ type: "Contact", id: "NUMBERS" }],
    }),

    setContactNumbers: build.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/contact-numbers",
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "Contact", id: "NUMBERS" }],
    }),

    getAllContacts: build.query<
      { requests: any[]; count: number },
      { filters: Record<string, unknown>; type: string }
    >({
      query: ({ filters, type }) => ({
        url: `/contacts/${type}`,
        method: "POST",
        data: filters,
        ...skipToast,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ContactsListData>(response);
        return {
          requests: data?.requests || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result, _e, { type }) =>
        result
          ? [
              ...result.requests.map(({ _id }: any) => ({
                type: "Contact" as const,
                id: _id,
              })),
              { type: "Contact", id: `LIST_${type}` },
            ]
          : [{ type: "Contact", id: `LIST_${type}` }],
    }),

    deleteContactRequest: build.mutation<any, { type: string; id: string }>({
      query: ({ id }) => ({
        url: `/contacts/update-status/${id}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{
          contact?: any;
          updatedContact?: any;
        }>(response);
        return data?.contact || data?.updatedContact;
      },
      invalidatesTags: (_r, _e, { type, id }) => [
        { type: "Contact", id },
        { type: "Contact", id: `LIST_${type}` },
        { type: "Contact", id: "OVERVIEW" },
      ],
    }),

    replyToContactTicket: build.mutation<
      { ticket?: any; emailSent?: boolean; message?: string },
      {
        type: string;
        id: string;
        response: string;
        close?: boolean;
      }
    >({
      query: ({ id, response, close = true }) => ({
        url: `/contacts/reply/${id}`,
        method: "POST",
        data: { response, close: close !== false },
      }),
      transformResponse: (response: unknown) => {
        const envelope = response as { data?: unknown; message?: string };
        const data = unwrapData<{ ticket?: any; emailSent?: boolean }>(
          response
        );
        return {
          ticket: data?.ticket,
          emailSent: data?.emailSent,
          message: envelope?.message,
        };
      },
      invalidatesTags: (_r, _e, { type, id }) => [
        { type: "Contact", id },
        { type: "Contact", id: `LIST_${type}` },
        { type: "Contact", id: "OVERVIEW" },
      ],
    }),
  }),
});

export const {
  useGetContactOverviewQuery,
  useLazyGetContactOverviewQuery,
  useGetContactNumbersQuery,
  useLazyGetContactNumbersQuery,
  useSetContactNumbersMutation,
  useGetAllContactsQuery,
  useLazyGetAllContactsQuery,
  useDeleteContactRequestMutation,
  useReplyToContactTicketMutation,
} = contactApi;
