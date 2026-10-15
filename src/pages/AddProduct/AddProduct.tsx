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
import Tabs from "@core/templates/Tabs";
import Calculate from "./Calculate";
import { change } from "redux-form";
import { useTranslation } from "react-i18next";
import { getRoleStatus } from "utils/getRoleStatus.util";
import draftProductService from "services/draftProduct.service";
import { FormattedNF, formattedNF } from "./productData/productData";
import { draftLevels, productBody } from "./productPayload";
import ProductGallery from "./ProductGallery";

/** Only local blob picks from MultiFileUpload — ignore existing CDN URLs. */
function pendingUploads(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item: any) =>
      item &&
      typeof item === "object" &&
      typeof item.blob === "string" &&
      item.blob.startsWith("blob:")
  );
}

export default function AddProduct() {
  const form = "AddProductForm";
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDraft = searchParams.get("isDraft") === "true";
  const draftFlag = searchParams.get("isDraft");
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, product } = useAppSelector((state) => state.product);
  const { loading: draftLoading, draftProduct } = useAppSelector(
    (state) => state.draftProduct
  );
  const userRole = useAppSelector((state) => state.auth?.user?.role);
  const editingPublished = Boolean(id && !isDraft);

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [dispatch, id]);

  useEffect(() => {
    nutritionService.getAll(dispatch);
    rdaService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
      dispatch(rdaActions.setRda(null));
    };
  }, [dispatch]);

  const uploadNewImages = useCallback(
    async (productId: string, files: any[], previous: string[] = []) => {
      if (!files.length) return;
      await productService.updateImage(productId, files, previous, dispatch);
    },
    [dispatch]
  );

  const setDefaultImage = useCallback(
    async (imageUrl: string) => {
      if (!id) return;
      await productService.updateProductImage(id, { image_url: imageUrl }, dispatch);
    },
    [id, dispatch]
  );

  const removeImage = useCallback(
    async (imageUrl: string) => {
      if (!id || !product?.productImages) return;
      const kept = product.productImages.filter((url: string) => url !== imageUrl);
      await productService.keepImages(id, kept, dispatch);
    },
    [id, product, dispatch]
  );

  const saveDraft = async (values: any, body: any) => {
    const draftData = {
      ...body,
      nf: FormattedNF(values.nf),
      levels: draftLevels(values),
      servingUOM: values.servingUOM
        ? { _id: values.servingUOM.value, sign: values.servingUOM.label }
        : "",
      weightUOM: values.weightUOM
        ? { _id: values.weightUOM.value, sign: values.weightUOM.label }
        : "",
      foodType: (values.foodType || []).map((item: any) => ({
        name: item?.label || item || "",
        _id: item?.value || item || "",
      })),
    };
    if (id) await draftProductService.update(id, draftData, navigate, dispatch);
    else await draftProductService.create(draftData, navigate, dispatch);
  };

  const handleSubmit = async (values: any) => {
    const roleStatus = getRoleStatus(userRole, values.status);
    const body = {
      ...productBody(values, {
        status: roleStatus,
        draftId: draftProduct?._id,
        isDraft: draftFlag,
      }),
      nf: formattedNF(values.nf),
    };
    const files = pendingUploads(values.productImages);

    if (roleStatus === "draft") {
      await saveDraft(values, body);
      return;
    }

    if (editingPublished) {
      const [ok] = await productService.update(id!, body, null, dispatch);
      if (!ok) return;
      await uploadNewImages(id!, files, product?.productImages || []);
      navigate("/products");
      return;
    }

    const [ok, , created] = await productService.create(body, navigate, dispatch);
    if (!ok || !created?._id) return;
    await uploadNewImages(created._id, files, []);
    navigate(`/update-product/${created._id}`);
  };

  const handleMediaSubmit = useCallback(
    async (values: any) => {
      if (!id) return;
      await uploadNewImages(
        id,
        pendingUploads(values.productImages),
        product?.productImages || []
      );
      dispatch(change("AddProductImage", "productImages", []));
    },
    [id, product, uploadNewImages, dispatch]
  );

  const tabs = useMemo(() => {
    const list = [{ label: t("Info"), element: <UpdateProductForm /> }];
    if (!isDraft) {
      list.push({
        label: t("Media"),
        element: <AddProductImage onSubmit={handleMediaSubmit} />,
      });
    }
    return list;
  }, [t, isDraft, handleMediaSubmit]);

  return (
    <PageShell
      kicker="Catalog"
      title={id ? "Edit food" : "Add food"}
      subtitle={
        id
          ? "Keep label data accurate so scores and scans stay trustworthy."
          : "Enter what is on the pack — categories, details, ingredients, then nutrition."
      }
      actions={<GoBack path="/products" title="Back to catalog" />}
    >
      {(loading || draftLoading) && <CircleLoader />}
      {id ? (
        <Tabs
          value={activeTab}
          onChange={(newTab) => setActiveTab(newTab)}
          tabs={tabs}
        />
      ) : null}
      {activeTab === 0 && <AddProductForm onSubmit={handleSubmit} />}
      <Calculate />
      {activeTab === 1 ? (
        <ProductGallery
          images={product?.productImages || []}
          onSelect={setDefaultImage}
          onRemove={removeImage}
        />
      ) : null}
    </PageShell>
  );
}
