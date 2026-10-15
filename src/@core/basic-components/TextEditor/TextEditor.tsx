import { InputLabel } from "@mui/material";
import { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
];

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html || "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
  });
}

export default function TextEditor({
  label,
  input,
  handleBlur,
  handleFocus,
  meta: { error, touched },
  ...rest
}: any) {
  const isSet = useRef(false);

  useEffect(() => {
    if (!input.value || isSet.current) return;
    // Sanitize once on hydrate — never unescape entities back to raw HTML.
    input.onChange(sanitizeHtml(String(input.value)));
    isSet.current = true;
  }, [input]);

  return (
    <>
      <InputLabel shrink htmlFor={rest.name} sx={{ fontWeight: "bold" }}>
        {label}
      </InputLabel>
      <ReactQuill
        id={rest.name}
        error={touched && error}
        {...rest}
        theme="snow"
        onChange={(html) => {
          input.onChange(sanitizeHtml(html));
        }}
        value={input.value}
        defaultValue={input.value}
        formats={formats}
        modules={modules}
      />
    </>
  );
}
