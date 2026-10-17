import http from "./http.service";
import Promisable from "./promisable.service";
import ToasterService from "utils/toaster.util";

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

/**
 * Upload store images to Spaces via Admin `/uploads/uploads`.
 * Returns public CDN URLs ready to save on the product.
 */
const storeUploadService = {
  upload: async (files: File[], folder = "store"): Promise<string[]> => {
    if (!files?.length) return [];
    http.setJWT();
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`/uploads/uploads?folder=${encodeURIComponent(folder)}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    if (success?.data?.data?.uploadedFilePaths) {
      const urls = asUrlList(success.data.data.uploadedFilePaths);
      if (urls.length) return urls;
    }

    ToasterService.showError(
      error?.response?.data?.message ||
        error?.message ||
        "Image upload failed"
    );
    return [];
  },

  uploadOne: async (file: File, folder = "store"): Promise<string | null> => {
    const urls = await storeUploadService.upload([file], folder);
    return urls[0] || null;
  },
};

export default storeUploadService;
