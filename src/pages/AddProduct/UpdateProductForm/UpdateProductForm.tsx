import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import draftProductService from "services/draftProduct.service";
import productService from "services/product.service";
import { useParams, useSearchParams } from "react-router-dom";
import { optionId, optionLabel } from "utils/selectOption.util";

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
        ? { key: field?.key, value: String(field._id), label: field.name }
        : null;

    const mapField = (field: any) => {
      if (!field) return null;
      const value = optionId(field);
      if (!value) return null;
      return { value, label: optionLabel(field, "") };
    };

    const mapLevels = (levels: any) =>
      levels
        ? Object.fromEntries(
            ["level1_id", "level2_id", "level3_id", "level4_id"].map((level) => [
              level,
              mapField(levels[level]),
            ])
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
                value: String(item.uom._id),
              }
            : null,
      }));

    const mapHnss = (hnss: any) => {
      const mapped = mapField(hnss);
      if (!mapped) return null;
      const code = hnss?.code;
      const name = mapped.label;
      return {
        ...mapped,
        code,
        label:
          code && name && !String(name).includes(String(code))
            ? `${code} — ${name}`
            : name,
      };
    };

    const fieldsToDispatch = {
      status: productData.status === "active",
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
              value: String(productData.servingUOM._id),
            }
          : null,
      servingsPerContainer: productData.servingsPerContainer,
      weightUOM:
        productData?.weightUOM?._id && productData?.weightUOM?.sign
          ? {
              label: productData.weightUOM.sign || "",
              value: String(productData.weightUOM._id),
            }
          : null,
      manufacturer: productData.manufacturer,
      productionCountry: productData.productionCountry,
      foodType:
        productData?.foodType?.length > 0
          ? productData.foodType.map((item: any) => mapField(item)).filter(Boolean)
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
