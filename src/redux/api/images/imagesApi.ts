import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ImageOptionsData = {
  images: any[];
};

type ImagesListData = {
  image: any[];
  count: number;
};

export type GetAllImagesArgs = {
  type: string;
  filters: {
    page: number;
    page_size: number;
    name?: string;
    status?: string;
  };
};

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getImageOptions: build.query<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/images/get-Options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<ImageOptionsData>(response)?.images || [],
    }),

    createImage: build.mutation<any, FormData>({
      query: (formData) => ({
        url: "/images/certificate",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ image: any }>(response)?.image,
      invalidatesTags: [{ type: "Image", id: "LIST" }],
    }),

    getAllImages: build.query<
      { image: any[]; count: number },
      GetAllImagesArgs
    >({
      query: ({ type, filters }) => {
        const payload = {
          type,
          page: filters.page,
          page_size: filters.page_size,
          isDelete: false,
          ...(filters.name ? { name: filters.name } : {}),
          ...(filters.status ? { status: filters.status } : {}),
        };
        return {
          url: "/images/get-All-images",
          method: "POST",
          data: payload,
        };
      },
      transformResponse: (response: unknown) => {
        const data = unwrapData<ImagesListData>(response);
        return {
          image: data?.image || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.image.map(({ _id }: any) => ({
                type: "Image" as const,
                id: _id,
              })),
              { type: "Image", id: "LIST" },
            ]
          : [{ type: "Image", id: "LIST" }],
    }),

    getImages: build.query<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/images/get-Options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<ImageOptionsData>(response)?.images || [],
    }),

    updateImage: build.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/images/${id}/certificate`,
        method: "PATCH",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ images: any }>(response)?.images,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Image", id },
        { type: "Image", id: "LIST" },
      ],
    }),

    removeImage: build.mutation<unknown, string>({
      query: (id) => ({ url: `/images/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Image", id },
        { type: "Image", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetImageOptionsQuery,
  useLazyGetImageOptionsQuery,
  useCreateImageMutation,
  useGetAllImagesQuery,
  useLazyGetAllImagesQuery,
  useGetImagesQuery,
  useLazyGetImagesQuery,
  useUpdateImageMutation,
  useRemoveImageMutation,
} = imagesApi;
