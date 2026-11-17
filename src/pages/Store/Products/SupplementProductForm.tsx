import { Dispatch, ReactNode, SetStateAction } from "react";
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
export type SupplementInteraction = {
  medication: string;
  note: string;
  imageUrl: string;
};
export type SupplementFact = { name: string; amount: string; dailyValue: string };

export type SupplementDetails = {
  bannerImageUrl: string;
  pageQuestion: string;
  fitFor: SupplementFit[];
  transparency: FormulaChip[];
  interactionsIntro: string;
  interactions: SupplementInteraction[];
  research: string;
  howToTake: string;
  whyItWorks: string;
  whenToTake: string;
  infoTitle: string;
  infoImageUrl: string;
  servingSize: string;
  facts: SupplementFact[];
  factsImageUrl: string;
  otherIngredients: string;
  ingredients: string[];
  factsNote: string;
  closingTitle: string;
  closingText: string;
  closingImageUrl: string;
  closingButtonLabel: string;
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
  interactionsIntro: "",
  interactions: [{ medication: "", note: "", imageUrl: "" }],
  research: "",
  howToTake: "Take with food and plenty of water.",
  whyItWorks: "",
  whenToTake: "",
  infoTitle: "",
  infoImageUrl: "",
  servingSize: "1 capsule",
  facts: [{ name: "", amount: "", dailyValue: "" }],
  factsImageUrl: "",
  otherIngredients: "",
  ingredients: [""],
  factsNote:
    "% Daily Values are based on a 2,000 calorie diet. Daily Value not established.",
  closingTitle: "Is this supplement right for you?",
  closingText: "",
  closingImageUrl: "",
  closingButtonLabel: "Take Assessment Now",
});

function asChip(item: any): FormulaChip {
  if (typeof item === "string") return { title: item, imageUrl: "" };
  return {
    title: String(item?.title || item?.label || ""),
    imageUrl: String(item?.imageUrl || ""),
  };
}

function keptText(value: unknown, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

export function parseSupplementDetails(raw: any): SupplementDetails {
  const base = emptySupplementDetails();
  if (!raw || typeof raw !== "object") return base;
  const blankFit = { title: "", description: "", imageUrl: "", bannerImageUrl: "" };
  const fitFor = Array.isArray(raw.fitFor)
    ? raw.fitFor.map((row: any) => ({
        title: String(row?.title || ""),
        description: String(row?.description || ""),
        imageUrl: String(row?.imageUrl || ""),
        bannerImageUrl: String(row?.bannerImageUrl || ""),
      }))
    : base.fitFor;
  const transparency = Array.isArray(raw.transparency)
    ? raw.transparency.map(asChip)
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
        imageUrl: String(row?.imageUrl || ""),
      }))
    : base.interactions;
  const ingredientRows = Array.isArray(raw.ingredients)
    ? raw.ingredients.map((row: any) =>
        String(typeof row === "string" ? row : row?.name || "")
      )
    : String(raw.otherIngredients || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
  return {
    bannerImageUrl: keptText(raw.bannerImageUrl),
    pageQuestion: keptText(raw.pageQuestion, base.pageQuestion),
    fitFor: fitFor.length ? fitFor : [blankFit],
    transparency: transparency.length ? transparency : [{ title: "", imageUrl: "" }],
    interactionsIntro: keptText(raw.interactionsIntro),
    interactions: interactions.length
      ? interactions
      : [{ medication: "", note: "", imageUrl: "" }],
    research: keptText(raw.research),
    howToTake: keptText(raw.howToTake, base.howToTake),
    whyItWorks: keptText(raw.whyItWorks),
    whenToTake: keptText(raw.whenToTake),
    infoTitle: keptText(raw.infoTitle),
    infoImageUrl: keptText(raw.infoImageUrl),
    servingSize: keptText(raw.servingSize, base.servingSize),
    facts: facts.length ? facts : [{ name: "", amount: "", dailyValue: "" }],
    factsImageUrl: keptText(raw.factsImageUrl),
    otherIngredients: keptText(raw.otherIngredients),
    ingredients: ingredientRows.length ? ingredientRows : [""],
    factsNote: keptText(raw.factsNote, base.factsNote),
    closingTitle: keptText(raw.closingTitle, base.closingTitle),
    closingText: keptText(raw.closingText),
    closingImageUrl: keptText(raw.closingImageUrl),
    closingButtonLabel: keptText(raw.closingButtonLabel, base.closingButtonLabel),
  };
}

export default function SupplementProductForm({
  benefits,
  onBenefits,
  details,
  onDetails,
  afterBenefits,
  beforeClosing,
}: {
  benefits: SupplementBenefit[];
  onBenefits: (rows: SupplementBenefit[]) => void;
  details: SupplementDetails;
  onDetails: Dispatch<SetStateAction<SupplementDetails>>;
  afterBenefits?: ReactNode;
  beforeClosing?: ReactNode;
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
        <div className="store-section__head">
          <div>
            <h2>Benefits</h2>
            <p>The check marks under the product description, such as “Promotes heart health”.</p>
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

      {afterBenefits}

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Is our product right for you?</h2>
            <p>The heading above the cards, such as “Is our CoQ10 right for you?”</p>
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
            <h2>Right-for-you cards</h2>
            <p>Each card has a photo, a title, and a description, such as “Power Up”.</p>
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
            <p>Icon and title chips, such as “Made Without Major Allergens”.</p>
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
            <p>The note under the heading, then each medicine with its icon and description.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patch({
                interactions: [
                  ...details.interactions,
                  { medication: "", note: "", imageUrl: "" },
                ],
              })
            }
          >
            Add interaction
          </Button>
        </div>
        <TextField
          label="Intro"
          value={details.interactionsIntro}
          onChange={(e) => patch({ interactionsIntro: e.target.value })}
          fullWidth
          multiline
          minRows={3}
          placeholder="Medications and supplements can interact in different ways..."
        />
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
            <StoreImageField
              key={`ix-image-${index}`}
              label="Icon"
              value={row.imageUrl}
              onChange={(imageUrl) =>
                patch({
                  interactions: details.interactions.map((item, i) =>
                    i === index ? { ...item, imageUrl } : item
                  ),
                })
              }
              folder="store"
            />
            <TextField
              label="Medication"
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
        <h2>Product information</h2>
        <p>Shown in this order on the page: image, research, why it works, how to take it, when to take it.</p>
        <TextField
          label="Information title"
          value={details.infoTitle}
          onChange={(e) => patch({ infoTitle: e.target.value })}
          fullWidth
          placeholder="CoQ10 Information"
        />
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
          label="Why it works"
          value={details.whyItWorks}
          onChange={(e) => patch({ whyItWorks: e.target.value })}
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="How to take it?"
          value={details.howToTake}
          onChange={(e) => patch({ howToTake: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="When to take it?"
          value={details.whenToTake}
          onChange={(e) => patch({ whenToTake: e.target.value })}
          fullWidth
          placeholder="Daytime"
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Supplement facts</h2>
            <p>Serving size, then each nutrient with amount per serving and % daily value.</p>
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
          label="Facts note"
          value={details.factsNote}
          onChange={(e) => patch({ factsNote: e.target.value })}
          fullWidth
          multiline
          minRows={2}
          placeholder="% Daily Values are based on a 2,000 calorie diet."
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Ingredients</h2>
            <p>One line each, in the order shown on the page.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              const ingredients = [...details.ingredients, ""];
              patch({ ingredients, otherIngredients: ingredients.filter(Boolean).join("\n") });
            }}
          >
            Add ingredient
          </Button>
        </div>
        {details.ingredients.map((row, index) => (
          <div key={`ing-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Ingredient {index + 1}</strong>
              <IconButton
                size="small"
                onClick={() => {
                  const ingredients = details.ingredients.filter((_, i) => i !== index);
                  patch({
                    ingredients: ingredients.length ? ingredients : [""],
                    otherIngredients: ingredients.filter(Boolean).join("\n"),
                  });
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Name"
              value={row}
              onChange={(e) => {
                const ingredients = details.ingredients.map((item, i) =>
                  i === index ? e.target.value : item
                );
                patch({
                  ingredients,
                  otherIngredients: ingredients.filter(Boolean).join("\n"),
                });
              }}
              fullWidth
              placeholder="Garlic Powder"
            />
          </div>
        ))}
      </section>

      {beforeClosing}
    </>
  );
}
