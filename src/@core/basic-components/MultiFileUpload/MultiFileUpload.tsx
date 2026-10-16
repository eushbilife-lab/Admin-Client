import { FileUploadOwnProps } from ".";
import ToasterService from "utils/toaster.util";
import CircleLoader from "../CircleLoader";
import { useTranslation } from "react-i18next";
import { useId } from "react";
import "./MultiFileUpload.css";

export type FileUploadProps = FileUploadOwnProps & {
  onChange?: (files: File[]) => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  id?: string;
  className?: string;
};

export default function MultiFileUpload({
  accept = [".jpg", ".jpeg", ".png"],
  maxSize = 5,
  onChange,
  loading,
  disabled,
  title,
  id,
  className = "",
}: FileUploadProps) {
  const { t } = useTranslation();
  const autoId = useId();
  const inputId = id || autoId;

  const pickFiles = (list: FileList | null) => {
    if (!list?.length) return;
    let files = Array.from(list);

    if (files.length > 5) {
      ToasterService.showError(t("You can only upload a maximum of 5 files."));
      files = files.slice(0, 5);
    }

    if (accept?.length) {
      files = files.filter((file) => {
        const type = file.name.split(".").pop()?.toLowerCase() || "";
        if (!accept.includes(`.${type}`)) {
          ToasterService.showError(`${type} not allowed!`);
          return false;
        }
        return true;
      });
    }

    if (maxSize) {
      const limit = maxSize * 1024 * 1024;
      files = files.filter((file) => {
        if (file.size > limit) {
          ToasterService.showError(`Max file size is ${maxSize} MB`);
          return false;
        }
        return true;
      });
    }

    if (files.length) onChange?.(files);
  };

  return (
    <div className={`multi-upload ${className}`.trim()}>
      <label
        htmlFor={inputId}
        className={`multi-upload__drop${disabled ? " is-disabled" : ""}`}
      >
        <span className="multi-upload__icon" aria-hidden>
          +
        </span>
        <p className="multi-upload__title">{title || t("Drop photos here or click to browse")}</p>
        <p className="multi-upload__meta">
          JPG / PNG · up to {maxSize} MB each · max 5 images
        </p>
        <input
          id={inputId}
          className="multi-upload__input"
          type="file"
          multiple
          disabled={disabled}
          accept="image/jpeg,image/jpg,image/png"
          onChange={(e) => {
            const input = e.currentTarget;
            // Capture scroll before the OS picker returns focus (avoids jump + blank space).
            const scroller = input.closest(
              ".admin-layout__content"
            ) as HTMLElement | null;
            const scrollTop = scroller?.scrollTop ?? 0;
            pickFiles(input.files);
            input.value = "";
            input.blur();
            requestAnimationFrame(() => {
              if (scroller) scroller.scrollTop = scrollTop;
            });
          }}
        />
      </label>
      {loading ? <CircleLoader /> : null}
    </div>
  );
}
