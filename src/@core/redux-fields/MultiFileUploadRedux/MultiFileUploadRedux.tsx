import MultiFileUpload from "@core/basic-components/MultiFileUpload";
import { useEffect, useState } from "react";
import "@core/basic-components/MultiFileUpload/MultiFileUpload.css";

type Preview = { name: string; blob: string; type?: string };

export default function MultiFileUploadRedux({
  input,
  handleBlur,
  handleFocus,
  FileUploadProps,
  meta,
  ...rest
}: any) {
  const { error, touched, invalid } = meta || {};
  const [previews, setPreviews] = useState<Preview[]>(() =>
    Array.isArray(input.value) ? input.value : []
  );
  const maxCount = FileUploadProps?.maxCount ?? 5;

  useEffect(() => {
    if (!input.value || !Array.isArray(input.value) || input.value.length === 0) {
      setPreviews([]);
      return;
    }
    setPreviews(input.value);
  }, [input.value]);

  const handleFileChange = (files: File[]) => {
    if (!files?.length) return;
    const room = Math.max(0, maxCount - previews.length);
    if (!room) return;

    const incoming = files.slice(0, room).map((file) => ({
      name: file.name,
      type: file.type,
      blob: URL.createObjectURL(file),
    }));

    const merged = [...previews];
    for (const file of incoming) {
      if (!merged.some((f) => f.name === file.name && f.blob === file.blob)) {
        merged.push(file);
      }
    }

    setPreviews(merged);
    input.onChange(merged);
  };

  const removeImage = (index: number) => {
    const next = previews.filter((_, i) => i !== index);
    setPreviews(next);
    input.onChange(next);
  };

  return (
    <div className="multi-upload" style={{ width: "100%" }}>
      <MultiFileUpload
        {...FileUploadProps}
        {...rest}
        disabled={previews.length >= maxCount}
        title={
          previews.length
            ? `Add more photos (${previews.length}/${maxCount})`
            : FileUploadProps?.title || "Drop pack photos here or click to browse"
        }
        onChange={handleFileChange}
        onBlur={(e: any) => {
          handleBlur?.(e);
          e.preventDefault();
        }}
        onFocus={(e: any) => {
          handleFocus?.(e);
          e.preventDefault();
        }}
      />

      {previews.length > 0 ? (
        <>
          <div className="multi-upload__grid">
            {previews.map((file, index) => (
              <div className="multi-upload__tile" key={`${file.name}-${index}`}>
                <img src={file.blob} alt={file.name || `Photo ${index + 1}`} />
                <button
                  type="button"
                  className="multi-upload__remove"
                  aria-label={`Remove ${file.name || `photo ${index + 1}`}`}
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p className="multi-upload__caption">
            {previews.length} of {maxCount} photos selected. Tap × to remove.
          </p>
        </>
      ) : (
        <p className="multi-upload__caption">
          Clear pack shots help reviewers and the catalog. You can add more later.
        </p>
      )}

      {touched && invalid && error ? (
        <p className="multi-upload__error">{error}</p>
      ) : null}
    </div>
  );
}
