import { Dispatch, SetStateAction } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StoreImageField from "../StoreImageField";

export type SupplementBenefit = {
  title: string;
  description: string;
  iconUrl: string;
};

export type SupplementFit = {
  title: string;
  description: string;
  imageUrl: string;
  bannerImageUrl: string;
};

export type FormulaChip = { title: string; imageUrl: string };
export type SupplementInteraction = { medication: string; note: string };
export type SupplementFact = { name: string; amount: string; dailyValue: string };

export type SupplementDetails = {
  bannerImageUrl: string;
  pageQuestion: string;
  fitFor: SupplementFit[];
  transparency: FormulaChip[];
  interactions: SupplementInteraction[];
  research: string;
  howToTake: string;
  whyItWorks: string;
  whenToTake: string;
  infoImageUrl: string;
  servingSize: string;
  facts: SupplementFact[];
  factsImageUrl: string;
  otherIngredients: string;
  factsNote: string;
  closingTitle: string;
  closingText: string;
};

export const emptySupplementDetails = (): SupplementDetails => ({
  bannerImageUrl: "",
  pageQuestion: "Is this supplement right for you?",
  fitFor: [
    { title: "", description: "", imageUrl: "", bannerImageUrl: "" },
    { title: "", description: "", imageUrl: "", bannerImageUrl: "" },
    { title: "", description: "", imageUrl: "", bannerImageUrl: "" },
  ],
  transparency: [
    { title: "Made without major allergens", imageUrl: "" },
    { title: "Backed by research", imageUrl: "" },
    { title: "Third party tested", imageUrl: "" },
  ],
  interactions: [{ medication: "", note: "" }],
  research: "",
  howToTake: "Take with food and plenty of water.",
  whyItWorks: "",
  whenToTake: "",
  infoImageUrl: "",
  servingSize: "1 capsule",
  facts: [{ name: "", amount: "", dailyValue: "" }],
  factsImageUrl: "",
  otherIngredients: "",
  factsNote: "Daily value not established.",
  closingTitle: "Is this supplement right for you?",
  closingText: "",
});

function asChip(item: any): FormulaChip {
  if (typeof item === "string") return { title: item, imageUrl: "" };
  return {
    title: String(item?.title || item?.label || ""),
    imageUrl: String(item?.imageUrl || ""),
  };
}

export function parseSupplementDetails(raw: any): SupplementDetails {
  const base = emptySupplementDetails();
  if (!raw || typeof raw !== "object") return base;
  const fitFor = Array.isArray(raw.fitFor)
    ? raw.fitFor.map((row: any) => ({
        title: String(row?.title || ""),
        description: String(row?.description || ""),
        imageUrl: String(row?.imageUrl || ""),
        bannerImageUrl: String(row?.bannerImageUrl || ""),
      }))
    : base.fitFor;
  const transparency = Array.isArray(raw.transparency)
    ? raw.transparency.map(asChip).filter((row: FormulaChip) => row.title)
    : base.transparency;
  const facts = Array.isArray(raw.facts)
    ? raw.facts.map((row: any) => ({
        name: String(row?.name || ""),
        amount: String(row?.amount || ""),
        dailyValue: String(row?.dailyValue || ""),
      }))
    : base.facts;
  const interactions = Array.isArray(raw.interactions)
    ? raw.interactions.map((row: any) => ({
        medication: String(row?.medication || ""),
        note: String(row?.note || ""),
      }))
    : base.interactions;
  return {
    bannerImageUrl: String(raw.bannerImageUrl || ""),
    pageQuestion: String(raw.pageQuestion || base.pageQuestion),
    fitFor: fitFor.length ? fitFor : base.fitFor,
    transparency: transparency.length ? transparency : base.transparency,
    interactions: interactions.length ? interactions : base.interactions,
    research: String(raw.research || ""),
    howToTake: String(raw.howToTake || base.howToTake),
    whyItWorks: String(raw.whyItWorks || ""),
    whenToTake: String(raw.whenToTake || ""),
    infoImageUrl: String(raw.infoImageUrl || ""),
    servingSize: String(raw.servingSize || base.servingSize),
    facts: facts.length ? facts : base.facts,
    factsImageUrl: String(raw.factsImageUrl || ""),
    otherIngredients: String(raw.otherIngredients || ""),
    factsNote: String(raw.factsNote || base.factsNote),
    closingTitle: String(raw.closingTitle || base.closingTitle),
    closingText: String(raw.closingText || ""),
  };
}

export default function SupplementProductForm({
  benefits,
  onBenefits,
  details,
  onDetails,
}: {
  benefits: SupplementBenefit[];
  onBenefits: (rows: SupplementBenefit[]) => void;
  details: SupplementDetails;
  onDetails: Dispatch<SetStateAction<SupplementDetails>>;
}) {
  const patch = (partial: Partial<SupplementDetails>) =>
    onDetails((current) => ({ ...current, ...partial }));

  const patchRows = <K extends "fitFor" | "transparency" | "interactions" | "facts">(
    key: K,
    recipe: (rows: SupplementDetails[K]) => SupplementDetails[K]
  ) => {
    onDetails((current) => ({ ...current, [key]: recipe(current[key]) }));
  };

  return (
    <>
      <section className="store-section">
        <h2>Banner</h2>
        <p>Wide banner for the supplement page. It is stored separately from the supplement photo.</p>
        <StoreImageField
          label="Banner image"
          value={details.bannerImageUrl}
          onChange={(bannerImageUrl) => patch({ bannerImageUrl })}
          helperText="Banner only. Uploading here does not change the supplement photo."
          folder="store"
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Benefits</h2>
            <p>The three points under the title on the supplement card.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              onBenefits([...benefits, { title: "", description: "", iconUrl: "" }])
            }
          >
            Add benefit
          </Button>
        </div>
        {benefits.map((row, index) => (
          <div key={`sben-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Benefit {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() => onBenefits(benefits.filter((_, i) => i !== index))}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Title"
              value={row.title}
              onChange={(e) =>
                onBenefits(
                  benefits.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  )
                )
              }
              fullWidth
            />
          </div>
        ))}
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Page question</h2>
            <p>The question above the three cards, such as “Is our CoQ10 right for you?”</p>
          </div>
        </div>
        <TextField
          label="Page question"
          value={details.pageQuestion}
          onChange={(e) => patch({ pageQuestion: e.target.value })}
          fullWidth
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Cards</h2>
            <p>Each card has a banner image, a title, and a description.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patchRows("fitFor", (rows) => [
                ...rows,
                { title: "", description: "", imageUrl: "", bannerImageUrl: "" },
              ])
            }
          >
            Add card
          </Button>
        </div>
        {details.fitFor.map((row, index) => (
          <div key={`fit-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Card {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() =>
                  patchRows("fitFor", (rows) => rows.filter((_, i) => i !== index))
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <StoreImageField
              key={`card-banner-${index}`}
              label="Card banner image"
              value={row.bannerImageUrl}
              onChange={(bannerImageUrl) =>
                patchRows("fitFor", (rows) =>
                  rows.map((item, i) =>
                    i === index ? { ...item, bannerImageUrl } : item
                  )
                )
              }
              folder="store"
            />
            <TextField
              label="Card title"
              value={row.title}
              onChange={(e) => {
                const title = e.target.value;
                patchRows("fitFor", (rows) =>
                  rows.map((item, i) => (i === index ? { ...item, title } : item))
                );
              }}
              fullWidth
            />
            <TextField
              label="Card description"
              value={row.description}
              onChange={(e) => {
                const description = e.target.value;
                patchRows("fitFor", (rows) =>
                  rows.map((item, i) =>
                    i === index ? { ...item, description } : item
                  )
                );
              }}
              fullWidth
              multiline
              minRows={2}
            />
          </div>
        ))}
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Formula transparency</h2>
            <p>Each chip has an icon image and a title.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patchRows("transparency", (rows) => [...rows, { title: "", imageUrl: "" }])
            }
          >
            Add chip
          </Button>
        </div>
        {details.transparency.map((row, index) => (
          <div key={`chip-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Formula {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() =>
                  patchRows("transparency", (rows) =>
                    rows.filter((_, i) => i !== index)
                  )
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Title"
              value={row.title}
              onChange={(e) => {
                const title = e.target.value;
                patchRows("transparency", (rows) =>
                  rows.map((item, i) => (i === index ? { ...item, title } : item))
                );
              }}
              fullWidth
            />
            <StoreImageField
              key={`formula-image-${index}`}
              label="Formula image"
              value={row.imageUrl}
              onChange={(imageUrl) =>
                patchRows("transparency", (rows) =>
                  rows.map((item, i) =>
                    i === index ? { ...item, imageUrl } : item
                  )
                )
              }
              folder="store"
            />
          </div>
        ))}
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Common drug-nutrient interactions</h2>
            <p>Only the medicines this page actually lists.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patch({
                interactions: [...details.interactions, { medication: "", note: "" }],
              })
            }
          >
            Add interaction
          </Button>
        </div>
        {details.interactions.map((row, index) => (
          <div key={`ix-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Interaction {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() =>
                  patch({
                    interactions: details.interactions.filter((_, i) => i !== index),
                  })
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Title"
              value={row.medication}
              onChange={(e) =>
                patch({
                  interactions: details.interactions.map((item, i) =>
                    i === index ? { ...item, medication: e.target.value } : item
                  ),
                })
              }
              fullWidth
              placeholder="Immunosuppressant medications"
            />
            <TextField
              label="Description"
              value={row.note}
              onChange={(e) =>
                patch({
                  interactions: details.interactions.map((item, i) =>
                    i === index ? { ...item, note: e.target.value } : item
                  ),
                })
              }
              fullWidth
              multiline
              minRows={2}
            />
          </div>
        ))}
      </section>

      <section className="store-section">
        <h2>Information</h2>
        <StoreImageField
          label="Information image"
          value={details.infoImageUrl}
          onChange={(infoImageUrl) => patch({ infoImageUrl })}
          folder="store"
        />
        <TextField
          label="What the research says"
          value={details.research}
          onChange={(e) => patch({ research: e.target.value })}
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="How to take it"
          value={details.howToTake}
          onChange={(e) => patch({ howToTake: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Why it works"
          value={details.whyItWorks}
          onChange={(e) => patch({ whyItWorks: e.target.value })}
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="When to take it"
          value={details.whenToTake}
          onChange={(e) => patch({ whenToTake: e.target.value })}
          fullWidth
          helperText="Leave blank when the page has no time."
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Supplement facts</h2>
            <p>Serving size, amount per serving, and percent daily value.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patch({
                facts: [...details.facts, { name: "", amount: "", dailyValue: "" }],
              })
            }
          >
            Add row
          </Button>
        </div>
        <StoreImageField
          label="Facts image"
          value={details.factsImageUrl}
          onChange={(factsImageUrl) => patch({ factsImageUrl })}
          folder="store"
        />
        <TextField
          label="Serving size"
          value={details.servingSize}
          onChange={(e) => patch({ servingSize: e.target.value })}
          fullWidth
        />
        {details.facts.map((row, index) => (
          <div key={`fact-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Nutrient {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() =>
                  patch({ facts: details.facts.filter((_, i) => i !== index) })
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Name"
              value={row.name}
              onChange={(e) =>
                patch({
                  facts: details.facts.map((item, i) =>
                    i === index ? { ...item, name: e.target.value } : item
                  ),
                })
              }
              fullWidth
            />
            <div className="store-editor__row">
              <TextField
                label="Amount per serving"
                value={row.amount}
                onChange={(e) =>
                  patch({
                    facts: details.facts.map((item, i) =>
                      i === index ? { ...item, amount: e.target.value } : item
                    ),
                  })
                }
                fullWidth
              />
              <TextField
                label="% Daily value"
                value={row.dailyValue}
                onChange={(e) =>
                  patch({
                    facts: details.facts.map((item, i) =>
                      i === index ? { ...item, dailyValue: e.target.value } : item
                    ),
                  })
                }
                fullWidth
              />
            </div>
          </div>
        ))}
        <TextField
          label="Other ingredients"
          value={details.otherIngredients}
          onChange={(e) => patch({ otherIngredients: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Facts note"
          value={details.factsNote}
          onChange={(e) => patch({ factsNote: e.target.value })}
          fullWidth
        />
      </section>

      <section className="store-section">
        <h2>Is this supplement right for you?</h2>
        <TextField
          label="Closing title"
          value={details.closingTitle}
          onChange={(e) => patch({ closingTitle: e.target.value })}
          fullWidth
        />
        <TextField
          label="Closing description"
          value={details.closingText}
          onChange={(e) => patch({ closingText: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
      </section>
    </>
  );
}
