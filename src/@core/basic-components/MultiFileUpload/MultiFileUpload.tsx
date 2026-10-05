import Input from "../Input";
import { FileUploadOwnProps } from ".";
import ToasterService from "utils/toaster.util";
import InputLabel from "@mui/material/InputLabel";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { config } from "config";
import CircleLoader from "../CircleLoader";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { formLoaderActions } from "redux/slices/formLoader";
export type FileUploadProps = FileUploadOwnProps &
  React.ComponentProps<typeof Input>;

export default function MultiFileUpload({
  value,
  accept,
  maxSize,
  onChange,
  loading,
  sx,
  uploadIcon = true,
  multiple = false,
  ...rest
}: FileUploadProps & { onChange: any; rest?: any; loading?: boolean }) {
  const { t } = useTranslation();
  const reset = useAppSelector((state) => state.formLoader.reset);
  const dispatch = useAppDispatch();
  const [previews, setPreviews] = useState<any[]>([]);

  useEffect(() => {
    if (reset) {
      dispatch?.(formLoaderActions.setReset(false));
      setPreviews([]);
    }
  }, [reset, dispatch]);

  return (
    <Box>
      <InputLabel
        htmlFor={rest.id}
        sx={{
          cursor: "pointer",
          width: rest.width || "100%",
          minHeight: "240px",
          height: "100%",
          // marginTop: "15px",
          borderRadius: "4px",
          border: "1px solid #0000002e",
          position: "relative",
          fontSize: "14px",
          ...sx,
        }}
      >
        {previews.length > 0 && (
          <Grid container spacing={2}>
            {previews.map((preview, index) => (
              <Grid item md={3}>
                <img
                  key={index}
                  src={preview}
                  alt=""
                  style={{
                    height: "100%",
                    maxHeight: "240px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {previews?.length == 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "240px",
              // fontWeight: 500,
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0, padding: 0 }}>
                {rest.title || "Upload here"}
              </h4>
              {t("Max size 5 MB")} <br /> {t("acceptable jpg, jpeg, png")}
            </div>
          </Box>
        )}

        {loading && <CircleLoader />}
        <div hidden>
          <input
            type="file"
            id={rest.id}
            hidden
            disabled={previews?.length >= 4}
            capture={"environment"}
            multiple
            accept="image/jpg, image/jpeg, image/png"
            onChange={(e: any) => {
              let files = Array.from(e.target.files);
              if (files?.length > 5) {
                ToasterService.showError(
                  t("You can only upload a maximum of 5 files.")
                );
                return null;
              }
              if (accept) {
                files = files.filter((file: any) => {
                  let types = file.name.split(".");
                  let type = types[types.length - 1].toLowerCase();
                  if (!accept.includes(`.${type}`)) {
                    ToasterService.showError(`${type} not allowed!`);
                    return false;
                  }
                  return true;
                });
              }
              if (maxSize) {
                const size = maxSize * 1024 * 1024;
                files = files.filter((file: any) => {
                  if (file.size > size) {
                    ToasterService.showError(`Max file size is ${maxSize} MB`);
                    return false;
                  }
                  return true;
                });
              }

              // const previewUrls = files.map((file: any) =>
              //   URL.createObjectURL(file)
              // );
              // setPreviews(previewUrls);
              onChange(files);
            }}
          />
        </div>
      </InputLabel>
    </Box>
  );
}
