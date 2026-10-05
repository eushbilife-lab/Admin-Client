import MultiFileUpload from "@core/basic-components/MultiFileUpload";
import { useState, useEffect } from "react";
import { useAppDispatch } from "redux/hooks";

export default function MultiFileUploadRedux({
  input,
  handleBlur,
  handleFocus,
  FileUploadProps,
  meta,
  ...rest
}: any) {
  const { error, touched, invalid } = meta || {};
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [previews, setPreviews] = useState<{ name: string; blob: string }[]>(() => input.value || []);

  useEffect(() => {
    if (input.value && Array.isArray(input.value)) {
      setPreviews(input.value);
    }
  }, [input.value]);

  useEffect(() => {
    if (!input.value || input.value.length === 0) {
      setPreviews([]);
    } else if (Array.isArray(input.value)) {
      setPreviews(input.value);
    }
  }, [input.value]);
  
  // Handle file selection
  const handleFileChange = (files: File[]) => {
    if (!files || files.length === 0) return;

    const newFiles = files.map((file) => ({
      name: file.name,
      type: file.type,
      blob: URL.createObjectURL(file), // Create a preview URL
    }));

    // Append new files, ensuring no duplicates
    const updatedPreviews = [...previews, ...newFiles].reduce((acc, file) => {
      if (!acc.find((f) => f.name === file.name)) acc.push(file);
      return acc;
    }, [] as { name: string; blob: string }[]);

    setPreviews(updatedPreviews);
    input.onChange(updatedPreviews);
  };

  // Handle image removal
  const removeImage = (index: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    input.onChange(updatedPreviews);
  };

  return (
    <div style={{ position: "relative", width: "50%" }}>
      <MultiFileUpload
        {...FileUploadProps}
        {...rest}
        loading={loading}
        helperText={touched && invalid ? error : ""}
        error={touched && invalid && !!error}
        onChange={(files: File[]) => {
          if (files && Array.isArray(files)) {
            handleFileChange(files);
          }
        }}
        onSubmit={(setPreviews)=>[]}
        onBlur={(e) => {
          handleBlur?.(e);
          e.preventDefault();
        }}
        onFocus={(e) => {
          handleFocus?.(e);
          e.preventDefault();
        }}
      />
      {previews.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            padding: "10px",
            marginTop: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#f9f9f9",
          }}
        >
          {previews.map((file, index) => (
            <div key={index} style={{ position: "relative", display: "inline-block" }}>
              {/* Image Preview */}
              <img
                src={file.blob}
                alt={file.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <button
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "#FF9800",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: "0.3s ease-in-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#FF9800")} // Darker orange on hover
                                          >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
