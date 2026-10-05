import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import { localizedData } from "utils/localizedData.util";
import { productActions } from "redux/slices/product";
import draftProductService from "services/draftProduct.service";
import { draftProductActions } from "redux/slices/draftProduct";
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

    // Utility functions for mapping
    const mapNutrition = (field: any) => field?._id && field?.name ? { key: field?.key, value: field._id, label: field?.name } : null;
  
    const mapField = (field: any, keyLabel = "name") =>
      field?._id
        ? {
            value: field._id,
            label: localizedData({
              en: field?.en?.[keyLabel],
              ar: field?.ar?.[keyLabel],
            }),
          }
        : null;

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
        uom: item?.uom &&
          item?.uom?._id &&
          item?.uom?.sign
          ? {
              label: item.uom.sign || "",
              value: item.uom._id || "",
            }
          : null,
      }));

    // Consolidated field mapping
    const fieldsToDispatch = {
      productImages: productData?.productImages,
      status: productData.status === "active" ? true : false,
      ...mapLevels(productData.levels),
      barcode: productData.barcode,
      brand: productData.brand,
      productName: productData.productName,
      attribute_01_Flavour: productData.attribute_01_Flavour,
      attribute_02_Other: productData.attribute_02_Other,
      netWeight: productData.netWeight,
      servingSize: productData.servingSize,
      servingUOM: productData?.servingUOM?._id && productData?.servingUOM?.sign
          ? {
              label: productData.servingUOM.sign,
              value: productData.servingUOM._id,
            }
          : null,
      servingsPerContainer: productData.servingsPerContainer,
      weightUOM: productData?.weightUOM?._id && productData?.weightUOM?.sign
          ? {
              label: productData.weightUOM.sign || "",
              value: productData.weightUOM._id || "",
            }
          : null,
      manufacturer: productData.manufacturer,
      productionCountry: productData.productionCountry,
      foodType:productData?.foodType && productData?.foodType?.length > 0 ?
      productData?.foodType?.map((item: any) => ({
        label: localizedData({ en: item?.en?.name, ar: item?.ar?.name }),
        value: item._id,
      })) : null,
      ingredients:
        productData?.ingredients?.map((item: any) => ({
          ingredientDescription: item.ingredientDescription,
          ingredientContent: item.ingredientContent,
          ingredientCode: item.ingredientCode,
        })) || [],
        processingLevel: productData?.processingLevel?.label &&
        productData?.processingLevel?.value
        ? {
          label: productData.processingLevel.label,
          value: productData.processingLevel.value,
        }
      : "",
      fruitsVegNutsPercent: productData.fruitsVegNutsPercent,
      HNSSProductCategory: productData?.HNSSProductCategory?.label &&
        productData?.HNSSProductCategory?.value
        ? {
          label: productData?.HNSSProductCategory?.label,
          value: productData?.HNSSProductCategory?.value,
        }
      : null,
      carbsCount: productData.carbsCount,
      FOPLcertificates:
        productData?.FOPLcertificates?.map((item: any) => ({
          label: item.label,
          value: item.value,
          url: item.url,
        })) || [],
      nf: mapNutritionFacts(productData.nf || []),
    };

    // Efficient dispatch for all fields
    for (const [key, value] of Object.entries(fieldsToDispatch)) {
        dispatch(change(form, key, value));
    }
  }, [product, draftProduct, isDraft]);

  return null;
}

