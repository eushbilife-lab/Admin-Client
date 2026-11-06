import type { AppDispatch } from "redux/store";
import { productActions } from "redux/slices/product";
import { NavigateFunction } from "react-router-dom";
import ImageService from "./image.service";
import { modalActions } from "redux/slices/modal";
import { productApi } from "redux/api/product/productApi";
import { resolveDispatch } from "redux/api/runEndpoint";

const productService = {
  create: async (data: any, navigate: NavigateFunction, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const product = await d(
        productApi.endpoints.createProduct.initiate(data)
      ).unwrap();
      d(productActions.setProduct(product));
      return [{ data: { data: { product } } }, null, product];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  getAll: async (data: any, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const result = await d(
        productApi.endpoints.getAllProducts.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        productActions.setProducts({
          products: result.products,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const product = await d(
        productApi.endpoints.getProduct.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(productActions.setProduct(product));
      return [{ data: { data: { product } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction | null,
    dispatch: AppDispatch
  ) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const updatedProduct = await d(
        productApi.endpoints.updateProduct.initiate({ id, data })
      ).unwrap();
      d(productActions.setProduct(updatedProduct));
      navigate?.("/products");
      return [{ data: { data: { updatedProduct } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  updateImage: async (
    id: string,
    files: any[],
    prevImages: string[],
    dispatch: AppDispatch
  ) => {
    if (!files?.length) return [null, null];
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    const imageFiles = await Promise.all(
      files.map((file: any) =>
        ImageService.getImageFileFromBlob({
          blob: file,
          name: file.name,
          type: file.type,
        })
      )
    );
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("productImages", file));

    d(productActions.setLoading(true));
    try {
      const updatedProduct = await d(
        productApi.endpoints.updateProductImages.initiate({
          id,
          formData,
          previousImages: prevImages,
        })
      ).unwrap();
      d(productActions.setProduct(updatedProduct));
      d(productActions.refresh());
      return [{ data: { data: { updatedProduct } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  updateStatus: async (id: string, data: any, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const updatedStatus = await d(
        productApi.endpoints.updateProductStatus.initiate({ id, data })
      ).unwrap();
      d(productActions.setProduct(updatedStatus));
      d(productActions.removeProduct(updatedStatus._id));
      d(modalActions.closeModal());
      return [{ data: { data: { updatedStatus } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  keepImages: async (
    id: string,
    productImages: string[],
    dispatch: AppDispatch
  ) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const updatedProduct = await d(
        productApi.endpoints.keepProductImages.initiate({
          id,
          productImages,
        })
      ).unwrap();
      d(productActions.setProduct(updatedProduct));
      return [{ data: { data: { updatedProduct } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  updateProductImage: async (id: string, data: any, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      const updatedProductImage = await d(
        productApi.endpoints.updateProductImage.initiate({ id, data })
      ).unwrap();
      d(productActions.setProduct(updatedProductImage));
      return [{ data: { data: { updatedProductImage } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },

  remove: async (id: string, dispatch: AppDispatch) => {
    const d = resolveDispatch(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(productActions.setLoading(true));
    try {
      await d(productApi.endpoints.removeProduct.initiate(id)).unwrap();
      d(productActions.removeProduct(id));
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(productActions.setLoading(false));
    }
  },
};

export default productService;
