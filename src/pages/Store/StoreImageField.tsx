import { useId, useState } from "react";
import { IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import storeUploadService from "services/storeUpload.service";
import ToasterService from "utils/toaster.util";
import "./Store.css";

type Props = {
  label: string;
  /** Single image URL (controlled). */
  value?: string;
  onChange?: (url: string) => void;
  /** Multi image URLs (controlled). When set, component is multi-select. */
  values?: string[];
  onChangeMany?: (urls: string[]) => void;
  multiple?: boolean;
  helperText?: string;
  folder?: string;
  /** Exact pixel size required before upload (e.g. store banners). */
  requiredWidth?: number;
  requiredHeight?: number;
};

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const MAX_MB = 5;

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      URL.revokeObjectURL(url);
      resolve({ width, height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export default function StoreImageField({
  label,
  value = "",
  onChange,
  values,
  onChangeMany,
  multiple = false,
  helperText,
  folder = "store",
  requiredWidth,
  requiredHeight,
}: Props) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const isMulti = multiple || Boolean(onChangeMany);
  const list = isMulti ? values || [] : value ? [value] : [];
  const sizeHint =
    requiredWidth && requiredHeight
      ? ` · exact ${requiredWidth} × ${requiredHeight} px`
      : "";

  const pick = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    let files = Array.from(fileList);
    if (!isMulti) files = files.slice(0, 1);
    else files = files.slice(0, 5);

    const allowed: File[] = [];
    for (const file of files) {
      if (file.size > MAX_MB * 1024 * 1024) {
        ToasterService.showError(`Max file size is ${MAX_MB} MB`);
        continue;
      }
      if (requiredWidth && requiredHeight) {
        try {
          const { width, height } = await readImageSize(file);
          if (width !== requiredWidth || height !== requiredHeight) {
            ToasterService.showError(
              `Image must be exactly ${requiredWidth} × ${requiredHeight} px (got ${width} × ${height})`
            );
            continue;
          }
        } catch {
          ToasterService.showError("Could not read image dimensions");
          continue;
        }
      }
      allowed.push(file);
    }
    if (!allowed.length) return;

    setUploading(true);
    const urls = await storeUploadService.upload(allowed, folder);
    setUploading(false);
    if (!urls.length) return;

    if (isMulti) {
      const next = [...(values || []), ...urls];
      onChangeMany?.(next);
      if (!value && urls[0]) onChange?.(urls[0]);
    } else {
      onChange?.(urls[0]);
    }
    ToasterService.showSuccess(
      urls.length === 1 ? "Image uploaded" : `${urls.length} images uploaded`
    );
  };

  const removeAt = (index: number) => {
    if (isMulti) {
      const next = (values || []).filter((_, i) => i !== index);
      onChangeMany?.(next);
      if (value && list[index] === value) {
        onChange?.(next[0] || "");
      }
      return;
    }
    onChange?.("");
  };

  const setPrimary = (url: string) => {
    onChange?.(url);
  };

  return (
    <div className="store-image-field">
      <div className="store-image-field__head">
        <span>{label}</span>
        {helperText ? <small>{helperText}</small> : null}
      </div>

      <label
        htmlFor={inputId}
        className={`store-image-field__drop${uploading ? " is-busy" : ""}`}
      >
        <span>{uploading ? "Uploading…" : isMulti ? "Upload images" : "Upload image"}</span>
        <small>
          JPG / PNG / WebP · up to {MAX_MB} MB{isMulti ? " · max 5" : ""}
          {sizeHint}
        </small>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          multiple={isMulti}
          disabled={uploading}
          onChange={(e) => {
            const input = e.currentTarget;
            void pick(input.files);
            input.value = "";
          }}
        />
      </label>

      {list.length ? (
        <div className="store-image-field__grid">
          {list.map((url, index) => (
            <figure
              key={`${url}-${index}`}
              className={`store-image-field__thumb${
                !isMulti || url === value ? " is-primary" : ""
              }`}
            >
              <img src={url} alt="" />
              <div className="store-image-field__actions">
                {isMulti && onChange && url !== value ? (
                  <button type="button" onClick={() => setPrimary(url)}>
                    Set primary
                  </button>
                ) : null}
                <IconButton size="small" onClick={() => removeAt(index)} aria-label="Remove image">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  );
}
