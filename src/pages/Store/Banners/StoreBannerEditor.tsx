import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeBannerService from "services/storeBanner.service";
import { storeBannerActions } from "redux/slices/storeBanner";
import ToasterService from "utils/toaster.util";
import StoreImageField from "../StoreImageField";
import "../Store.css";

export default function StoreBannerEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { banner, loading } = useAppSelector((state) => state.storeBanner);
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("published");
  const [linkType, setLinkType] = useState("none");
  const [linkTarget, setLinkTarget] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) storeBannerService.get(id, dispatch);
    return () => {
      dispatch(storeBannerActions.setBanner(null));
    };
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!banner || isNew) return;
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setImageUrl(banner.imageUrl || "");
    setStatus(banner.status || "published");
    setLinkType(banner.linkType || "none");
    setLinkTarget(banner.linkTarget || "");
    setSortOrder(Number(banner.sortOrder) || 0);
  }, [banner, isNew]);

  const save = async () => {
    if (!title.trim() || !imageUrl.trim()) {
      ToasterService.showError("Title and banner image are required");
      return;
    }
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      status,
      linkType,
      linkTarget: linkTarget.trim(),
      sortOrder: Number(sortOrder) || 0,
    };
    setSaving(true);
    const [success, error] = isNew
      ? await storeBannerService.create(payload, dispatch)
      : await storeBannerService.update(String(id), payload, dispatch);
    setSaving(false);
    if (error) {
      ToasterService.showError(error?.response?.data?.message || "Save failed");
      return;
    }
    ToasterService.showSuccess(isNew ? "Banner created" : "Banner updated");
    const nextId = success?.data?.data?.banner?._id;
    navigate(nextId ? `/store/banners/${nextId}` : "/store/banners");
  };

  return (
    <PageShell
      kicker="Store"
      title={isNew ? "New banner" : "Edit banner"}
      subtitle="Carousel slides on the mobile Store home."
      actions={
        <>
          <Button onClick={() => navigate("/store/banners")}>Cancel</Button>
          <Button variant="contained" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      {loading && !isNew ? <CircleLoader /> : null}
      <div className="store-editor">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField
          label="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          fullWidth
        />
        <StoreImageField
          label="Banner image"
          value={imageUrl}
          onChange={setImageUrl}
          helperText="Upload a wide slide image for the store home carousel"
        />
        <div className="store-editor__row">
          <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <TextField
            select
            label="Link type"
            value={linkType}
            onChange={(e) => setLinkType(e.target.value)}
            fullWidth
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="url">URL</MenuItem>
          </TextField>
        </div>
        <TextField
          label="Link target"
          value={linkTarget}
          onChange={(e) => setLinkTarget(e.target.value)}
          fullWidth
          helperText="Product id, category key, or full URL"
        />
        <TextField
          label="Sort order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          fullWidth
        />
      </div>
    </PageShell>
  );
}
