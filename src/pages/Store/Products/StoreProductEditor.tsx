import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton, MenuItem, TextField } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PageShell from "@core/templates/PageShell";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeProductService from "services/storeProduct.service";
import { storeProductActions } from "redux/slices/storeProduct";
import ToasterService from "utils/toaster.util";
import StoreImageField from "../StoreImageField";
import "../Store.css";

type VariantRow = {
  key: string;
  label: string;
  bottles: number;
  sku: string;
  price: number;
  compareAtPrice: number | "";
  stock: number;
  imageUrl: string;
  isDefault: boolean;
};

type IngredientRow = {
  name: string;
  scientificName: string;
  description: string;
  imageUrl: string;
};

type BenefitRow = { title: string; description: string; iconUrl: string };
type HowToRow = { step: number; title: string; description: string };
type FaqRow = { question: string; answer: string };
type TestimonialRow = {
  name: string;
  age: number | "";
  quote: string;
  rating: number;
  imageUrl: string;
};

const emptyVariant = (index = 0): VariantRow => ({
  key: "",
  label: index === 0 ? "1 Bottle" : `${index + 1} Bottles`,
  bottles: index + 1,
  sku: "",
  price: 0,
  compareAtPrice: "",
  stock: 0,
  imageUrl: "",
  isDefault: index === 0,
});

const emptyIngredient = (): IngredientRow => ({
  name: "",
  scientificName: "",
  description: "",
  imageUrl: "",
});

const emptyBenefit = (): BenefitRow => ({
  title: "",
  description: "",
  iconUrl: "",
});

const emptyHowTo = (step = 1): HowToRow => ({
  step,
  title: "",
  description: "",
});

const emptyFaq = (): FaqRow => ({ question: "", answer: "" });

const emptyTestimonial = (): TestimonialRow => ({
  name: "",
  age: "",
  quote: "",
  rating: 5,
  imageUrl: "",
});

function linesToList(text: string) {
  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function listToLines(list?: string[]) {
  return Array.isArray(list) ? list.join("\n") : "";
}

export default function StoreProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((state) => state.storeProduct);
  const isNew = !id || id === "new";

  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("supplements");
  const [status, setStatus] = useState("published");
  const [currency, setCurrency] = useState("PKR");
  const [badgeText, setBadgeText] = useState("Sale");
  const [rating, setRating] = useState(4.8);
  const [ratingCount, setRatingCount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [beforeAfterImages, setBeforeAfterImages] = useState<string[]>([]);
  const [highlightsText, setHighlightsText] = useState(
    "Free Delivery\nTested Clinically\n100% Organic\nHerbal Fusion"
  );
  const [certificationsText, setCertificationsText] = useState(
    "Gluten Free\nNo Artificial Flavours\n100% Vegan\nNon GMO\nNo Artificial Colors"
  );
  const [tagsText, setTagsText] = useState("");
  const [sku, setSku] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([emptyVariant(0)]);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    emptyIngredient(),
  ]);
  const [benefits, setBenefits] = useState<BenefitRow[]>([emptyBenefit()]);
  const [howToUse, setHowToUse] = useState<HowToRow[]>([
    emptyHowTo(1),
    emptyHowTo(2),
    emptyHowTo(3),
    emptyHowTo(4),
  ]);
  const [faqs, setFaqs] = useState<FaqRow[]>([emptyFaq()]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([
    emptyTestimonial(),
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) storeProductService.get(id, dispatch);
    return () => {
      dispatch(storeProductActions.setProduct(null));
    };
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!product || isNew) return;
    setName(product.name || "");
    setHeadline(product.headline || "");
    setShortDescription(product.shortDescription || "");
    setDescription(product.description || "");
    setCategory(product.category || "supplements");
    setStatus(product.status || "published");
    setCurrency(product.currency || "PKR");
    setBadgeText(product.badgeText || "");
    setRating(Number(product.rating) || 0);
    setRatingCount(Number(product.ratingCount) || 0);
    setImageUrl(product.imageUrl || "");
    {
      const gallery = Array.isArray(product.images)
        ? product.images.map(String).filter(Boolean)
        : [];
      const primary = String(product.imageUrl || "").trim();
      setImages(
        primary && !gallery.includes(primary) ? [primary, ...gallery] : gallery
      );
    }
    setBeforeAfterImages(
      Array.isArray(product.beforeAfterImages)
        ? product.beforeAfterImages.map(String).filter(Boolean)
        : []
    );
    setHighlightsText(listToLines(product.highlights));
    setCertificationsText(listToLines(product.certifications));
    setTagsText(listToLines(product.tags));
    setSku(product.sku || "");
    setIsFeatured(Boolean(product.isFeatured));

    if (Array.isArray(product.variants) && product.variants.length) {
      setVariants(
        product.variants.map((v: any, i: number) => ({
          key: v.key || "",
          label: v.label || `Option ${i + 1}`,
          bottles: Number(v.bottles) || 1,
          sku: v.sku || "",
          price: Number(v.price) || 0,
          compareAtPrice:
            v.compareAtPrice != null ? Number(v.compareAtPrice) : "",
          stock: Number(v.stock) || 0,
          imageUrl: v.imageUrl || "",
          isDefault: Boolean(v.isDefault),
        }))
      );
    } else {
      setVariants([
        {
          ...emptyVariant(0),
          price: Number(product.price) || 0,
          compareAtPrice:
            product.compareAtPrice != null ? Number(product.compareAtPrice) : "",
          stock: Number(product.stock) || 0,
          sku: product.sku || "",
          imageUrl: product.imageUrl || "",
          isDefault: true,
        },
      ]);
    }

    setIngredients(
      product.ingredients?.length
        ? product.ingredients.map((row: any) => ({
            name: row.name || "",
            scientificName: row.scientificName || "",
            description: row.description || "",
            imageUrl: row.imageUrl || "",
          }))
        : [emptyIngredient()]
    );
    setBenefits(
      product.benefits?.length
        ? product.benefits.map((row: any) => ({
            title: row.title || "",
            description: row.description || "",
            iconUrl: row.iconUrl || "",
          }))
        : [emptyBenefit()]
    );
    setHowToUse(
      product.howToUse?.length
        ? product.howToUse.map((row: any, i: number) => ({
            step: Number(row.step) || i + 1,
            title: row.title || "",
            description: row.description || "",
          }))
        : [emptyHowTo(1), emptyHowTo(2), emptyHowTo(3), emptyHowTo(4)]
    );
    setFaqs(
      product.faqs?.length
        ? product.faqs.map((row: any) => ({
            question: row.question || "",
            answer: row.answer || "",
          }))
        : [emptyFaq()]
    );
    setTestimonials(
      product.testimonials?.length
        ? product.testimonials.map((row: any) => ({
            name: row.name || "",
            age: row.age != null ? Number(row.age) : "",
            quote: row.quote || "",
            rating: Number(row.rating) || 5,
            imageUrl: row.imageUrl || "",
          }))
        : [emptyTestimonial()]
    );
  }, [product, isNew]);

  const defaultVariant = useMemo(
    () => variants.find((v) => v.isDefault) || variants[0],
    [variants]
  );

  const previewDiscount = useMemo(() => {
    if (!defaultVariant) return null;
    const price = Number(defaultVariant.price) || 0;
    const compare =
      defaultVariant.compareAtPrice === ""
        ? 0
        : Number(defaultVariant.compareAtPrice) || 0;
    if (!compare || compare <= price) return null;
    return Math.round(((compare - price) / compare) * 100);
  }, [defaultVariant]);

  const updateVariant = (index: number, patch: Partial<VariantRow>) => {
    setVariants((prev) =>
      prev.map((row, i) => {
        if (i !== index) {
          if (patch.isDefault) return { ...row, isDefault: false };
          return row;
        }
        return { ...row, ...patch };
      })
    );
  };

  const save = async () => {
    if (!name.trim()) {
      ToasterService.showError("Name is required");
      return;
    }
    const cleanVariants = variants
      .filter((v) => v.label.trim())
      .map((v) => ({
        ...v,
        label: v.label.trim(),
        price: Number(v.price) || 0,
        compareAtPrice:
          v.compareAtPrice === "" ? null : Number(v.compareAtPrice) || null,
        stock: Number(v.stock) || 0,
        bottles: Math.max(1, Number(v.bottles) || 1),
      }));
    if (!cleanVariants.length) {
      ToasterService.showError("Add at least one bottle / price variant");
      return;
    }

    const gallery = [...images];
    if (imageUrl.trim() && !gallery.includes(imageUrl.trim())) {
      gallery.unshift(imageUrl.trim());
    }

    const payload = {
      name: name.trim(),
      headline: headline.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category,
      status,
      currency,
      badgeText: badgeText.trim() || (previewDiscount ? "Sale" : ""),
      rating: Number(rating) || 0,
      ratingCount: Number(ratingCount) || 0,
      imageUrl: imageUrl.trim() || gallery[0] || "",
      images: gallery,
      beforeAfterImages,
      highlights: linesToList(highlightsText),
      certifications: linesToList(certificationsText),
      tags: linesToList(tagsText),
      sku: sku.trim() || cleanVariants[0]?.sku || "",
      isFeatured,
      variants: cleanVariants,
      ingredients: ingredients
        .filter((row) => row.name.trim())
        .map((row) => ({
          name: row.name.trim(),
          scientificName: row.scientificName.trim(),
          description: row.description.trim(),
          imageUrl: row.imageUrl.trim(),
        })),
      benefits: benefits
        .filter((row) => row.title.trim())
        .map((row) => ({
          title: row.title.trim(),
          description: row.description.trim(),
          iconUrl: row.iconUrl.trim(),
        })),
      howToUse: howToUse
        .filter((row) => row.title.trim())
        .map((row, i) => ({
          step: Number(row.step) || i + 1,
          title: row.title.trim(),
          description: row.description.trim(),
        })),
      faqs: faqs
        .filter((row) => row.question.trim() && row.answer.trim())
        .map((row) => ({
          question: row.question.trim(),
          answer: row.answer.trim(),
        })),
      testimonials: testimonials
        .filter((row) => row.name.trim() && row.quote.trim())
        .map((row) => ({
          name: row.name.trim(),
          age: row.age === "" ? null : Number(row.age) || null,
          quote: row.quote.trim(),
          rating: Number(row.rating) || 5,
          imageUrl: row.imageUrl.trim(),
        })),
    };

    setSaving(true);
    const [success, error] = isNew
      ? await storeProductService.create(payload, dispatch)
      : await storeProductService.update(String(id), payload, dispatch);
    setSaving(false);
    if (error) {
      ToasterService.showError(error?.response?.data?.message || "Save failed");
      return;
    }
    ToasterService.showSuccess(isNew ? "Product created" : "Product updated");
    const nextId = success?.data?.data?.product?._id;
    navigate(nextId ? `/store/products/${nextId}` : "/store/products");
  };

  return (
    <PageShell
      kicker="Store"
      title={isNew ? "New store product" : "Edit store product"}
      subtitle="Modeled on eushbi.com product pages — bottles/variants, sale prices, gallery, ingredients, benefits, how-to, FAQs, and reviews."
      actions={
        <>
          <Button onClick={() => navigate("/store/products")}>Cancel</Button>
          <Button variant="contained" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </>
      }
    >
      {loading && !isNew ? <CircleLoader /> : null}

      <div className="store-editor">
        <section className="store-section">
          <h2>Basics</h2>
          <TextField label="Product name" value={name} onChange={(e) => setName(e.target.value)} fullWidth placeholder="Gallzen Capsules" />
          <TextField label="Headline / tagline" value={headline} onChange={(e) => setHeadline(e.target.value)} fullWidth placeholder="Flow Better, Digest Faster" helperText="Hero line above the product title" />
          <TextField label="Short description (card)" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} fullWidth multiline minRows={2} />
          <TextField label="Full description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={4} />
          <div className="store-editor__row">
            <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth>
              <MenuItem value="supper_foods">Supper Foods</MenuItem>
              <MenuItem value="supplements">Supplements</MenuItem>
            </TextField>
            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <TextField label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} fullWidth />
          </div>
          <div className="store-editor__row">
            <TextField label="Badge text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} fullWidth placeholder="Sale" />
            <TextField label="Rating" type="number" inputProps={{ step: 0.1, min: 0, max: 5 }} value={rating} onChange={(e) => setRating(Number(e.target.value))} fullWidth />
            <TextField label="Rating count" type="number" value={ratingCount} onChange={(e) => setRatingCount(Number(e.target.value))} fullWidth />
          </div>
          <label className="store-check">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured on Store home
          </label>
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>Bottle packs & prices</h2>
              <p>Like Gallzen / Keto Water — each pack has its own price, compare-at (strikethrough), and stock.</p>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setVariants((v) => [...v, emptyVariant(v.length)])}>
              Add pack
            </Button>
          </div>
          {previewDiscount != null ? (
            <p className="store-discount-hint">Default pack discount: {previewDiscount}% off</p>
          ) : null}
          {variants.map((row, index) => (
            <div key={`variant-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>Pack {index + 1}</strong>
                <div className="store-subcard__actions">
                  <label className="store-check">
                    <input
                      type="checkbox"
                      checked={row.isDefault}
                      onChange={() => updateVariant(index, { isDefault: true })}
                    />
                    Default
                  </label>
                  {variants.length > 1 ? (
                    <IconButton size="small" onClick={() => setVariants((v) => v.filter((_, i) => i !== index))}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </div>
              </div>
              <div className="store-editor__row">
                <TextField label="Label" value={row.label} onChange={(e) => updateVariant(index, { label: e.target.value })} fullWidth placeholder="1 Bottle / 2 Bottles" />
                <TextField label="Bottles" type="number" value={row.bottles} onChange={(e) => updateVariant(index, { bottles: Number(e.target.value) })} fullWidth />
                <TextField label="SKU" value={row.sku} onChange={(e) => updateVariant(index, { sku: e.target.value })} fullWidth />
              </div>
              <div className="store-editor__row">
                <TextField label="Sale price (Rs)" type="number" value={row.price} onChange={(e) => updateVariant(index, { price: Number(e.target.value) })} fullWidth />
                <TextField
                  label="Compare-at / MRP"
                  type="number"
                  value={row.compareAtPrice}
                  onChange={(e) =>
                    updateVariant(index, {
                      compareAtPrice: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  fullWidth
                  helperText="Strikethrough price (e.g. 4000 → 2990)"
                />
                <TextField label="Stock" type="number" value={row.stock} onChange={(e) => updateVariant(index, { stock: Number(e.target.value) })} fullWidth />
              </div>
              <StoreImageField
                label="Pack image"
                value={row.imageUrl}
                onChange={(url) => updateVariant(index, { imageUrl: url })}
                helperText="Shown when this bottle option is selected"
              />
            </div>
          ))}
        </section>

        <section className="store-section">
          <h2>Gallery</h2>
          <StoreImageField
            label="Product images"
            value={imageUrl}
            onChange={setImageUrl}
            values={images}
            onChangeMany={setImages}
            multiple
            helperText="Upload carousel photos — click Set primary for the main image"
          />
          <StoreImageField
            label="Before & after"
            values={beforeAfterImages}
            onChangeMany={setBeforeAfterImages}
            multiple
          />
        </section>

        <section className="store-section">
          <h2>Trust chips & labels</h2>
          <TextField
            label="Highlights (Free Delivery, Tested Clinically…)"
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            helperText="One per line"
          />
          <TextField
            label="Certifications (Gluten Free, Vegan…)"
            value={certificationsText}
            onChange={(e) => setCertificationsText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <TextField label="Tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} fullWidth multiline minRows={2} helperText="Optional search tags, one per line" />
          <TextField label="Base SKU (fallback)" value={sku} onChange={(e) => setSku(e.target.value)} fullWidth />
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>Ingredients</h2>
              <p>Herbal extracts with scientific names — as on the Gallzen page.</p>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setIngredients((rows) => [...rows, emptyIngredient()])}>
              Add ingredient
            </Button>
          </div>
          {ingredients.map((row, index) => (
            <div key={`ing-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>Ingredient {index + 1}</strong>
                <IconButton size="small" onClick={() => setIngredients((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="store-editor__row">
                <TextField label="Name" value={row.name} onChange={(e) => setIngredients((rows) => rows.map((r, i) => (i === index ? { ...r, name: e.target.value } : r)))} fullWidth placeholder="Ajwain Extract" />
                <TextField label="Scientific name" value={row.scientificName} onChange={(e) => setIngredients((rows) => rows.map((r, i) => (i === index ? { ...r, scientificName: e.target.value } : r)))} fullWidth placeholder="Trachyspermum ammi" />
              </div>
              <TextField label="Description" value={row.description} onChange={(e) => setIngredients((rows) => rows.map((r, i) => (i === index ? { ...r, description: e.target.value } : r)))} fullWidth multiline minRows={2} />
              <StoreImageField
                label="Ingredient image"
                value={row.imageUrl}
                onChange={(url) =>
                  setIngredients((rows) =>
                    rows.map((r, i) => (i === index ? { ...r, imageUrl: url } : r))
                  )
                }
              />
            </div>
          ))}
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>Benefits</h2>
              <p>Outcome bullets (skin clarity, digestion, etc.).</p>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setBenefits((rows) => [...rows, emptyBenefit()])}>
              Add benefit
            </Button>
          </div>
          {benefits.map((row, index) => (
            <div key={`ben-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>Benefit {index + 1}</strong>
                <IconButton size="small" onClick={() => setBenefits((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
              <TextField label="Title" value={row.title} onChange={(e) => setBenefits((rows) => rows.map((r, i) => (i === index ? { ...r, title: e.target.value } : r)))} fullWidth />
              <TextField label="Description" value={row.description} onChange={(e) => setBenefits((rows) => rows.map((r, i) => (i === index ? { ...r, description: e.target.value } : r)))} fullWidth />
              <StoreImageField
                label="Icon / image"
                value={row.iconUrl}
                onChange={(url) =>
                  setBenefits((rows) =>
                    rows.map((r, i) => (i === index ? { ...r, iconUrl: url } : r))
                  )
                }
              />
            </div>
          ))}
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>How to use</h2>
              <p>Simple daily steps.</p>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setHowToUse((rows) => [...rows, emptyHowTo(rows.length + 1)])}>
              Add step
            </Button>
          </div>
          {howToUse.map((row, index) => (
            <div key={`how-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>Step {index + 1}</strong>
                <IconButton size="small" onClick={() => setHowToUse((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
              <TextField label="Title" value={row.title} onChange={(e) => setHowToUse((rows) => rows.map((r, i) => (i === index ? { ...r, title: e.target.value, step: index + 1 } : r)))} fullWidth placeholder="Take one capsule twice every day." />
              <TextField label="Extra detail" value={row.description} onChange={(e) => setHowToUse((rows) => rows.map((r, i) => (i === index ? { ...r, description: e.target.value } : r)))} fullWidth />
            </div>
          ))}
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>FAQs</h2>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setFaqs((rows) => [...rows, emptyFaq()])}>
              Add FAQ
            </Button>
          </div>
          {faqs.map((row, index) => (
            <div key={`faq-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>FAQ {index + 1}</strong>
                <IconButton size="small" onClick={() => setFaqs((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
              <TextField label="Question" value={row.question} onChange={(e) => setFaqs((rows) => rows.map((r, i) => (i === index ? { ...r, question: e.target.value } : r)))} fullWidth />
              <TextField label="Answer" value={row.answer} onChange={(e) => setFaqs((rows) => rows.map((r, i) => (i === index ? { ...r, answer: e.target.value } : r)))} fullWidth multiline minRows={2} />
            </div>
          ))}
        </section>

        <section className="store-section">
          <div className="store-section__head">
            <div>
              <h2>Testimonials</h2>
            </div>
            <Button startIcon={<AddIcon />} onClick={() => setTestimonials((rows) => [...rows, emptyTestimonial()])}>
              Add review
            </Button>
          </div>
          {testimonials.map((row, index) => (
            <div key={`rev-${index}`} className="store-subcard">
              <div className="store-subcard__top">
                <strong>Review {index + 1}</strong>
                <IconButton size="small" onClick={() => setTestimonials((rows) => rows.filter((_, i) => i !== index))}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="store-editor__row">
                <TextField label="Name" value={row.name} onChange={(e) => setTestimonials((rows) => rows.map((r, i) => (i === index ? { ...r, name: e.target.value } : r)))} fullWidth />
                <TextField label="Age" type="number" value={row.age} onChange={(e) => setTestimonials((rows) => rows.map((r, i) => (i === index ? { ...r, age: e.target.value === "" ? "" : Number(e.target.value) } : r)))} fullWidth />
                <TextField label="Stars" type="number" inputProps={{ min: 1, max: 5 }} value={row.rating} onChange={(e) => setTestimonials((rows) => rows.map((r, i) => (i === index ? { ...r, rating: Number(e.target.value) } : r)))} fullWidth />
              </div>
              <TextField label="Quote" value={row.quote} onChange={(e) => setTestimonials((rows) => rows.map((r, i) => (i === index ? { ...r, quote: e.target.value } : r)))} fullWidth multiline minRows={2} />
              <StoreImageField
                label="Reviewer photo"
                value={row.imageUrl}
                onChange={(url) =>
                  setTestimonials((rows) =>
                    rows.map((r, i) => (i === index ? { ...r, imageUrl: url } : r))
                  )
                }
              />
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  );
}
