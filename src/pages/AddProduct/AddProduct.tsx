import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import nutritionService from "services/nutrition.service";
import { nutritionActions } from "redux/slices/nutrition";
import productService from "services/product.service";
import UpdateProductForm from "./UpdateProductForm";
import GoBack from "@core/basic-components/GoBack";
import AddProductImage from "./AddProductImage";
import AddProductForm from "./AddProductForm";
import rdaService from "services/rda.service";
import { rdaActions } from "redux/slices/rda";
import PageShell from "@core/templates/PageShell";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardMedia, IconButton, Tooltip } from "@mui/material";
import Tabs from "@core/templates/Tabs";
import Calculate from "./Calculate";
import { change } from "redux-form";
import { productActions } from "redux/slices/product";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { getRoleStatus } from "utils/getRoleStatus.util";
import draftProductService from "services/draftProduct.service";
import { FormattedNF, formattedNF } from "./productData/productData";

export default function AddProduct() {
  const form = "AddProductForm";
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDraft = searchParams.get("isDraft") === "true";
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  // const [updatedImages, setUpdatedImages] = useState<string[]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.product);
  const { loading: draftLoading } = useAppSelector((state) => state.draftProduct);
  const userRole = useAppSelector((state) => state.auth?.user?.role);
  const { product } = useAppSelector((state) => state.product);
  const { draftProduct } = useAppSelector((state) => state.draftProduct);

  const key=searchParams.get("isDraft")  

  useEffect(() => {
    if (!id) {
      dispatch(change(form, "status", true));
    }
  }, [dispatch, id]);

  useEffect(() => {
    nutritionService.getAll(dispatch);
    rdaService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
      dispatch(rdaActions.setRda(null));
    };
  }, [dispatch]);


  const updateProductImage = useCallback(async (selectedImageUrl: string) => {
    if (!id) return;
    const data = { image_url: selectedImageUrl };
    await productService.updateProductImage(id, data, dispatch);
  }, [id, dispatch]);

  const removeImage = useCallback((index: number) => {
    if (!id || !product?.productImages) return;
    const filteredImages = product.productImages.filter(
      (_: any, i: number) => i !== index
    );
    // setUpdatedImages(filteredImages);
    dispatch(
      productActions.setProduct({ ...product, productImages: filteredImages })
    );
  }, [id, product, dispatch]);



  const handleSubmit = async (values: any) => {
    const {
      status,
      brand,
      manufacturer,
      attribute_01_Flavour,
      attribute_02_Other,
      productionCountry,
      barcode,
      netWeight,
      servingSize,
      servingUOM,
      weightUOM,
      servingsPerContainer,
      productName,
      nf,
      ingredients,
      foodType,
      processingLevel,
      FOPLcertificates,
      carbsCount,
      HNSSProductCategory,
      fruitsVegNutsPercent,
      level1_id,
      level2_id,
      level3_id,
      level4_id,
    } = values;
  
    const formattedIngredients = ingredients?.map((item: any) => ({
      ingredientDescription: item.ingredientDescription || "",
      ingredientContent: item.ingredientContent || "",
      ingredientCode: item.ingredientCode || "",
    }));
  
    const getLevelsForDraft = (values: any) =>
      Object.fromEntries(
        ["level1_id", "level2_id", "level3_id", "level4_id"].map((key) => [
          key,
          {
            en: {
              name: values[key]?.label || values[key] || "",
              nameKey: values[key]?.label || values[key] || "",
            },
            ar: {
              name: values[key]?.label || values[key] || "",
              nameKey: values[key]?.label || values[key] || "",
            },
            _id: values[key]?.value || values[key] || "",
          },
        ])
      );
  
    const getLevels = (values: any) =>
      Object.fromEntries(
        ["level1_id", "level2_id", "level3_id", "level4_id"].map((key) => [
          key,
          values[key]?.value || values[key] || "",
        ])
      );
  
    const roleStatus = getRoleStatus(userRole, status);
  
    const baseData = {
      draftId:draftProduct?._id,
      status: roleStatus,
      key,
      brand,
      manufacturer,
      attribute_01_Flavour,
      attribute_02_Other,
      productionCountry,
      levels: getLevels(values),
      barcode,
      netWeight,
      servingSize,
      servingUOM: servingUOM?.value,
      weightUOM: weightUOM?.value,
      servingsPerContainer,
      productName,
      nf: formattedNF(nf),
      ingredients: formattedIngredients,
      foodType: foodType?.map((item: any) => item?.value || item || ""),
      processingLevel,
      FOPLcertificates,
      carbsCount,
      HNSSProductCategory: HNSSProductCategory?.value || "",
      fruitsVegNutsPercent,
    };
  
    const draftData = {
      ...baseData,
      nf: FormattedNF(nf),
      levels: getLevelsForDraft(values),
      servingUOM: servingUOM ? { _id: servingUOM.value, sign: servingUOM.label } : "",
      weightUOM: weightUOM ? { _id: weightUOM.value, sign: weightUOM.label } : "",
      HNSSProductCategory: HNSSProductCategory
        ? {
            label: HNSSProductCategory?.label || "",
            value: HNSSProductCategory?.value || "",
          }
        : { en: { name: "", nameKey: "" }, ar: { name: "", nameKey: "" }, _id: "" },
      foodType: foodType?.map((item: any) => ({
        en: { name: item?.label || item || "", nameKey: item?.label || item || "" },
        ar: { name: item?.label || item || "", nameKey: item?.label || item || "" },
        _id: item?.value || item || "",
      })),
    };
  
    const createOrUpdateDraft = async () => {
      if (id) {
        await draftProductService.update(id, draftData, navigate, dispatch);
      } else {
        await draftProductService.create(draftData, navigate, dispatch);
      }
    };
    
  const createOrUpdateProduct = async () => {
      if (id) {
        if (searchParams.get("isDraft") === "true") {
        await productService.create(baseData, navigate, dispatch);

        } else {
          await productService.update(id, baseData, navigate, dispatch);
        }
      } else {
        await productService.create(baseData, navigate, dispatch);
      }
    };  
      if (roleStatus === "draft") {
        await createOrUpdateDraft();
      } else {
        await createOrUpdateProduct();
      }
  };
  

  const handleSubmit1 = useCallback(async (values: any) => {
    if (!id) return;
    const files = values?.productImages || [];
    const previousImages = product?.productImages || [];
    const newImages = files;
    await productService.updateImage(
      id,
      newImages,
      previousImages,
      navigate,
      dispatch
    );
    dispatch(change("AddProductImage", "productImages", []));
  }, [id, product, navigate, dispatch]);

  const renderTabs = useMemo(() => {
    const tabs = [
      { label: t("Info"), element: <UpdateProductForm /> }
    ];

    if (!isDraft) {
      tabs.push({
        label: t("Media"),
        element: <AddProductImage onSubmit={handleSubmit1} />
      });
    }

    return (
      <Tabs
        value={activeTab}
        onChange={(newTab) => setActiveTab(newTab)}
        tabs={tabs}
      />
    );
  }, [activeTab, t, handleSubmit1, isDraft]);

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} food`}
      actions={<GoBack path="/Products" title="Back to catalog" />}
    >
      {(loading || draftLoading) && <CircleLoader />}
      {id && renderTabs}
      {activeTab === 0 && <AddProductForm onSubmit={handleSubmit} />}
      <Calculate />
      {activeTab === 1 ? (
        <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
          marginTop: "10px",
        }}
        >
          {product?.productImages?.map((imageUrl: string, index: number) => {
            return (
              <div key={`image-${imageUrl}`} style={{ position: "relative" }}>
                <Tooltip
                  title={t("Make this the default image")}
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#FF9800", // Orange background
                        color: "#fff", // White text
                        fontSize: "14px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#FF9800",
                      },
                    },
                  }}
                >
                  <Card
                    sx={{
                      width: 160,
                      borderRadius: "10px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                    onClick={() => updateProductImage(imageUrl)}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={`Product image ${index + 1}`}
                      sx={{
                        height: 200,
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0",
                      }}
                    />
                  </Card>
                </Tooltip>

                <IconButton
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    background: "#FF9800",
                    color: "white",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: "0.3s ease-in-out",
                    "&:hover": { background: "#CC5500" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </div>
            );
          })}
        </div>
      ) : null}
    </PageShell>
  );
}
