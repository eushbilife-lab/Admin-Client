import ToasterService from "utils/toaster.util";
import http from "./http.service";
import Promisable from "./promisable.service";

export const ImageService = {
  getImageFileFromBlob: async ({ blob, name, type }: any) => {
    const response = await fetch(blob.blob);
    const data = await response.blob();
    return new File([data], name, {type: response.headers.get("content-type") || type});
  },
  uploadFile: async (data: any, folder?: any) => {
    let img = await ImageService.getImageFileFromBlob(data);
    http.setJWT();
    // http.setMultiPart();
    let formData = new FormData();
    formData.append("file", img);
    const [success, error]: any = await Promisable.asPromise(
      http.post(`/uploads/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    if (success && success?.data?.data?.url) {
      return success?.data?.data?.url[0].path;
    } else ToasterService.showError(`${error?.errorMessage}`);
  },
  uploadFiles: async (files: File[], folder?: string) => {
    try {
      const imageFiles = await Promise.all(
        files.map((file) =>
          ImageService.getImageFileFromBlob({
            blob: file,
            name: file.name,
            type: file.type,
          })
        )
      );
      http.setJWT();
      let formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append("file", file); 
      });
      const [success, error]: any = await Promisable.asPromise(
        http.post(`/uploads/uploads`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
      if (success && success?.data?.data?.uploadedFilePaths) {
        console.log("🚀 ~ uploadFiles: ~ success:", success)
        const uploadedImages = success.data.data.uploadedFilePaths; // ✅ Extract URLs
        console.log("🚀 ~ uploadFiles: ~ uploadedImages:", uploadedImages)
        return uploadedImages;
      } else {
        ToasterService.showError(`${error?.errorMessage}`);
        return [];
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return [];
    }
  }, 
}
export default ImageService;
