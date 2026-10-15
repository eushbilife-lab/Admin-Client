import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { englishName, localizedData } from "utils/localizedData.util";
import draftProductService from "services/draftProduct.service";
import productService from "services/product.service";
import { useParams, useSearchParams } from "react-router-dom";

export default function UpdateProductForm() {
  const form = "AddProductForm";
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDraft = searchParams.get("isDraft") === "true";
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.product);
  const { draftProduct } = useAppSelector((state) => state.draftProduct);

  useEffect(() => {
    if (id && isDraft) {
      draftProductService.get(id, dispatch);
    } else if (id && !isDraft) {
      productService.get(id, dispatch);
    }
  }, [id, isDraft, dispatch]);

  useEffect(() => {
    const productData = isDraft ? draftProduct : product;
    if (!productData) return;

    const mapNutrition = (field: any) =>
      field?._id && field?.name
        ? { key: field?.key, value: field._id, label: field?.name }
        : null;

    const mapField = (field: any) => {
      if (!field) return null;
      const id = field?._id || field?.value;
      if (!id) return null;
      const label =
        (typeof field?.label === "string" && field.label) ||
        englishName(field) ||
        localizedData({
          en: field?.en?.name,
          ar: field?.ar?.name,
        }) ||
        field?.name ||
        "";
      return { value: String(id), label };
    };

    const mapLevels = (levels: any) =>
      levels
        ? Object.fromEntries(
            ["level1_id", "level2_id", "level3_id", "level4_id"].map(
              (level) => [level, mapField(levels[level])]
            )
          )
        : {};

    const mapNutritionFacts = (nfArray: any[]) =>
      nfArray.map((item) => ({
        ...item,
        nutritionId: item.nutritionId ? mapNutrition(item?.nutritionId) : null,
        uom:
          item?.uom && item?.uom?._id && item?.uom?.sign
            ? {
                label: item.uom.sign || "",
                value: item.uom._id || "",
              }
            : null,
      }));

    const mapHnss = (hnss: any) => {
      if (!hnss) return null;
      const value = hnss?.value || hnss?._id;
      if (!value) return null;
      const name =
        (typeof hnss?.label === "string" && hnss.label) ||
        englishName(hnss) ||
        hnss?.name ||
        "";
      const code = hnss?.code;
      return {
        value: String(value),
        label: code && name && !String(name).includes(code) ? `${code} — ${name}` : name,
        code,
      };
    };

    const fieldsToDispatch = {
      status: productData.status === "active" ? true : false,
      ...mapLevels(productData.levels),
      barcode: productData.barcode,
      brand: productData.brand,
      productName: productData.productName,
      attribute_01_Flavour: productData.attribute_01_Flavour,
      attribute_02_Other: productData.attribute_02_Other,
      netWeight: productData.netWeight,
      servingSize: productData.servingSize,
      servingUOM:
        productData?.servingUOM?._id && productData?.servingUOM?.sign
          ? {
              label: productData.servingUOM.sign,
              value: productData.servingUOM._id,
            }
          : null,
      servingsPerContainer: productData.servingsPerContainer,
      weightUOM:
        productData?.weightUOM?._id && productData?.weightUOM?.sign
          ? {
              label: productData.weightUOM.sign || "",
              value: productData.weightUOM._id || "",
            }
          : null,
      manufacturer: productData.manufacturer,
      productionCountry: productData.productionCountry,
      foodType:
        productData?.foodType && productData?.foodType?.length > 0
          ? productData.foodType
              .map((item: any) => mapField(item))
              .filter(Boolean)
          : null,
      ingredients:
        productData?.ingredients?.map((item: any) => ({
          value: item._id || item.value || item.ingredientCode || "",
          ingredientDescription:
            item.ingredientDescription || item.name || "",
          ingredientContent: item.ingredientContent || item.content || "",
          ingredientCode: item.ingredientCode || item.code || "",
        })) || [],
      processingLevel:
        productData?.processingLevel?.label &&
        productData?.processingLevel?.value
          ? {
              label: productData.processingLevel.label,
              value: productData.processingLevel.value,
            }
          : "",
      fruitsVegNutsPercent: productData.fruitsVegNutsPercent,
      HNSSProductCategory: mapHnss(productData?.HNSSProductCategory),
      carbsCount: productData.carbsCount,
      FOPLcertificates:
        productData?.FOPLcertificates?.map((item: any) => ({
          label: item.label,
          value: item.value,
          url: item.url,
        })) || [],
      nf: mapNutritionFacts(productData.nf || []),
    };

    for (const [key, value] of Object.entries(fieldsToDispatch)) {
      dispatch(change(form, key, value));
    }
  }, [product, draftProduct, isDraft, dispatch]);

  return null;
}
