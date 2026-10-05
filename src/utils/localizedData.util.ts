export const localizedData = (data?: { en?: any; ar?: any } | string) => {
  if (data == null) return "";
  if (typeof data === "string") return data;
  const value = data.en;
  if (value != null && String(value).trim() !== "") return value;
  return "";
};

export const englishName = (item?: { en?: { name?: string }; name?: string } | null) => {
  if (!item) return "";
  return item.en?.name || item.name || "";
};

export const withEnglishCopy = (values: any) => {
  const name = (values?.en?.name || "").trim();
  return {
    ...values,
    en: { ...(values?.en || {}), name },
    ar: { ...(values?.ar || {}), name },
  };
};
