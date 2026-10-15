/** Normalize API option IDs for Autocomplete equality checks. */
export function optionId(value: any): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const id = value.value ?? value._id ?? value.id;
  if (id == null || id === "") return null;
  return String(id);
}

/** Turn bilingual / string / nested labels into a plain string. */
export function optionLabel(label: any, fallback = ""): string {
  if (label == null) return fallback;
  if (typeof label === "string") return label || fallback;
  return (
    label?.en?.name ||
    label?.name ||
    label?.En_name ||
    label?.label ||
    fallback
  );
}

/** Parent ref may be an id string or a populated `{ _id }` object. */
export function parentRefId(ref: any): string | null {
  if (ref == null || ref === "") return null;
  if (typeof ref === "string" || typeof ref === "number") return String(ref);
  return optionId(ref);
}
