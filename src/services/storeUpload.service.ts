import type { AppDispatch } from "redux/store";
import { storeUploadApi } from "redux/api/storeUpload/storeUploadApi";
import ToasterService from "utils/toaster.util";
import { getAppDispatch } from "utils/dispatch.util";

/**
 * Upload store images to Spaces via Admin `/uploads/uploads`.
 * Returns public CDN URLs ready to save on the product.
 */
const storeUploadService = {
  upload: async (files: File[], folder = "store"): Promise<string[]> => {
    if (!files?.length) return [];
    const d = getAppDispatch();
    if (!d) {
      ToasterService.showError("Store not ready");
      return [];
    }
    try {
      const urls = await d(
        storeUploadApi.endpoints.uploadStoreImages.initiate({ files, folder })
      ).unwrap();
      if (urls.length) return urls;
      ToasterService.showError("Image upload failed");
      return [];
    } catch (error: any) {
      ToasterService.showError(
        error?.data?.message || error?.message || "Image upload failed"
      );
      return [];
    }
  },

  uploadOne: async (file: File, folder = "store"): Promise<string | null> => {
    if (!file) return null;
    const d = getAppDispatch();
    if (!d) {
      ToasterService.showError("Store not ready");
      return null;
    }
    try {
      return await d(
        storeUploadApi.endpoints.uploadStoreImage.initiate({ file, folder })
      ).unwrap();
    } catch (error: any) {
      ToasterService.showError(
        error?.data?.message || error?.message || "Image upload failed"
      );
      return null;
    }
  },
};

export default storeUploadService;
