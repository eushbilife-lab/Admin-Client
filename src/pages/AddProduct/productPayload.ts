const choiceId = (value: any) => value?.value || value || "";

/** Brand / manufacturer are stored as display names on the product. */
const choiceLabel = (value: any) => {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value;
  return String(value.label || value.name || value.En_name || "").trim();
};

const levelKeys = ["level1_id", "level2_id", "level3_id", "level4_id"] as const;

export function productLevels(values: any) {
  return Object.fromEntries(levelKeys.map((key) => [key, choiceId(values[key])]));
}

export function draftLevels(values: any) {
  return Object.fromEntries(
    levelKeys.map((key) => [
      key,
      {
        name: values[key]?.label || values[key] || "",
        _id: choiceId(values[key]),
      },
    ])
  );
}

export function productIngredients(ingredients: any[] = []) {
  return (ingredients || []).map((item) => ({
    ingredientDescription: item.ingredientDescription || item.name || "",
    ingredientContent: item.ingredientContent || item.content || "",
    ingredientCode: item.ingredientCode || item.code || "",
  }));
}

export function productBody(values: any, extras: { status: string; draftId?: string; isDraft?: string | null }) {
  return {
    draftId: extras.draftId || "",
    status: extras.status,
    key: extras.isDraft || "",
    brand: choiceLabel(values.brand),
    manufacturer: choiceLabel(values.manufacturer),
    attribute_01_Flavour: values.attribute_01_Flavour,
    attribute_02_Other: values.attribute_02_Other,
    productionCountry: values.productionCountry,
    levels: productLevels(values),
    barcode: values.barcode,
    netWeight: values.netWeight,
    servingSize: values.servingSize,
    servingUOM: choiceId(values.servingUOM),
    weightUOM: choiceId(values.weightUOM),
    servingsPerContainer: values.servingsPerContainer,
    productName: values.productName,
    ingredients: productIngredients(values.ingredients),
    foodType: (values.foodType || []).map((item: any) => choiceId(item)),
    processingLevel: values.processingLevel,
    FOPLcertificates: values.FOPLcertificates,
    carbsCount: values.carbsCount,
    HNSSProductCategory: choiceId(values.HNSSProductCategory),
    fruitsVegNutsPercent: values.fruitsVegNutsPercent,
  };
}
