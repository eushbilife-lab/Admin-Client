import type { AppDispatch } from "redux/store";
import { imagesApi } from "redux/api/images/imagesApi";
import { imageActions } from "redux/slices/images";
import { modalActions } from "redux/slices/modal";
import ImageService from "./image.service";
import { resolveDispatch } from "redux/api/runEndpoint";

function dispatchOr(d?: AppDispatch) {
  return resolveDispatch(d);
}

const imagesService = {
  getOptions: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const images = await d(
        imagesApi.endpoints.getImageOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        imageActions.setOptions({
          images,
          type: data?.type,
        })
      );
      return [{ data: { data: { images } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  create: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const check = await ImageService.getImageFileFromBlob({
        blob: data.url,
        name: data.url.name,
        type: data.url.type,
      });
      const formData = new FormData();
      formData.append("url", check);
      formData.append("name", String(data.name || "").trim());
      formData.append("type", data.type);

      const image = await d(
        imagesApi.endpoints.createImage.initiate(formData)
      ).unwrap();
      if (!image) {
        d(imageActions.setImage({ type: image?.type, data: image }));
      } else {
        imagesService.getAll(image?.type, { page: 1, page_size: 20 }, dispatch);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { image } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAll: async (type: any, filters: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(imageActions.setLoading({ type, loading: true }));
    try {
      const result = await d(
        imagesApi.endpoints.getAllImages.initiate(
          { type, filters },
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        imageActions.setImages({
          data: result.image,
          type,
          count: result.count,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(imageActions.setLoading({ type, loading: false }));
    }
  },

  get: async (data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const images = await d(
        imagesApi.endpoints.getImages.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        imageActions.setOptions({
          images,
          type: data?.type,
        })
      );
      return [{ data: { data: { images } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  update: async (id: string, data: any, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const formData = new FormData();
      if (data.url && typeof data.url !== "string" && data.url.blob) {
        const check = await ImageService.getImageFileFromBlob({
          blob: data.url,
          name: data.url.name,
          type: data.url.type,
        });
        formData.append("url", check);
      }
      formData.append("name", String(data.name || "").trim());
      formData.append("type", data.type);
      if (data.previousImageUrl) {
        formData.append("previousImageUrl", data.previousImageUrl);
      }

      const images = await d(
        imagesApi.endpoints.updateImage.initiate({ id, formData })
      ).unwrap();
      d(imageActions.setImage({ type: data.type, data: images }));
      d(modalActions.closeModal());
      return [{ data: { data: { images } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  remove: async (id: string, dispatch: AppDispatch, type: string, filters: any) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(imageActions.setLoading({ type: "product_certificate", loading: true }));
    try {
      await d(imagesApi.endpoints.removeImage.initiate(id)).unwrap();

      let currentPage = filters.page;
      const [fetchSuccess]: any = await imagesService.getAll(
        type,
        { ...filters },
        dispatch
      );
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
        await imagesService.getAll(
          type,
          { ...filters, page: currentPage },
          dispatch
        );
      }
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(imageActions.setLoading({ type: "product_certificate", loading: false }));
    }
  },
};

export default imagesService;
