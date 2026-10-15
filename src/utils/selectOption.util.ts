const MONGO_ID_RE = /^[a-fA-F0-9]{24}$/;

/** True when value looks like a Mongo ObjectId hex string. */
export function isMongoId(value: unknown): boolean {
  return typeof value === "string" && MONGO_ID_RE.test(value);
}

/** Normalize option IDs for Autocomplete equality (string, number, or `{ value|_id }`). */
export function optionId(value: any): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const id = value.value ?? value._id ?? value.id;
  if (id == null || id === "") return null;
  return String(id);
}

/**
 * Like optionId, but only returns a value if it is a Mongo ObjectId.
 * Use for cascade API filters so label strings are never sent as parent ids.
 */
export function mongoOptionId(value: any): string | null {
  const id = optionId(value);
  return id && isMongoId(id) ? id : null;
}

/** Plain string label — no en/ar. Accepts string or `{ label|name }`. */
export function optionLabel(label: any, fallback = ""): string {
  if (label == null) return fallback;
  if (typeof label === "string") return label.trim() || fallback;
  if (typeof label !== "object") return fallback;
  if (typeof label.label === "string" && label.label.trim()) return label.label.trim();
  if (typeof label.name === "string" && label.name.trim()) return label.name.trim();
  return fallback;
}

/** Parent ref may be an id string or a populated `{ _id }` object. */
export function parentRefId(ref: any): string | null {
  return mongoOptionId(ref) || (typeof ref === "object" ? optionId(ref) : null);
}

/** Map API option rows to `{ value, label, ...extras }` with plain string label. */
export function mapPlainOptions(
  rows: any[] | undefined | null,
  extras?: (row: any) => Record<string, any>
) {
  return (rows || [])
    .map((row: any) => {
      const value = optionId(row?.value ?? row?._id ?? row);
      if (!value) return null;
      return {
        value,
        label: optionLabel(row?.label ?? row?.name ?? row, ""),
        ...(extras ? extras(row) : {}),
      };
    })
    .filter(Boolean) as Array<{ value: string; label: string } & Record<string, any>>;
}
