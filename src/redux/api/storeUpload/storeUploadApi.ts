import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

function asUrlList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const anyItem = item as { path?: string; url?: string };
        return String(anyItem.path || anyItem.url || "").trim();
      }
      return "";
    })
    .filter(Boolean);
}

export const storeUploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadStoreImages: build.mutation<
      string[],
      { files: File[]; folder?: string }
    >({
      query: ({ files, folder = "store" }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("file", file));
        return {
          url: `/uploads/uploads?folder=${encodeURIComponent(folder)}`,
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      },
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ uploadedFilePaths?: unknown }>(response);
        return asUrlList(data?.uploadedFilePaths);
      },
    }),

    uploadStoreImage: build.mutation<
      string | null,
      { file: File; folder?: string }
    >({
      query: ({ file, folder = "store" }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/uploads/uploads?folder=${encodeURIComponent(folder)}`,
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      },
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ uploadedFilePaths?: unknown }>(response);
        const urls = asUrlList(data?.uploadedFilePaths);
        return urls[0] || null;
      },
    }),
  }),
});

export const {
  useUploadStoreImagesMutation,
  useUploadStoreImageMutation,
} = storeUploadApi;
