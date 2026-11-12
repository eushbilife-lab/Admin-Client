import { Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type SupplementBenefit = {
  title: string;
  description: string;
  iconUrl: string;
};

export type SupplementFit = { title: string; description: string };
export type SupplementInteraction = { medication: string; note: string };
export type SupplementFact = { name: string; amount: string; dailyValue: string };

export type SupplementDetails = {
  fitFor: SupplementFit[];
  transparency: string[];
  interactions: SupplementInteraction[];
  research: string;
  howToTake: string;
  whyItWorks: string;
  whenToTake: string;
  servingSize: string;
  facts: SupplementFact[];
  otherIngredients: string;
};

export const emptySupplementDetails = (): SupplementDetails => ({
  fitFor: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
  transparency: [
    "Vegan",
    "Made without major allergens",
    "Backed by research",
  ],
  interactions: [{ medication: "", note: "" }],
  research: "",
  howToTake: "Take with food and a full glass of water.",
  whyItWorks: "",
  whenToTake: "",
  servingSize: "1 capsule",
  facts: [{ name: "", amount: "", dailyValue: "" }],
  otherIngredients: "",
});

export function parseSupplementDetails(raw: any): SupplementDetails {
  const base = emptySupplementDetails();
  if (!raw || typeof raw !== "object") return base;
  const fitFor = Array.isArray(raw.fitFor)
    ? raw.fitFor.map((row: any) => ({
        title: String(row?.title || ""),
        description: String(row?.description || ""),
      }))
    : base.fitFor;
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
  const transparency = Array.isArray(raw.transparency)
    ? raw.transparency.map((item: any) => String(item || "")).filter(Boolean)
    : base.transparency;
  return {
    fitFor: fitFor.length ? fitFor : base.fitFor,
    transparency: transparency.length ? transparency : base.transparency,
    interactions: interactions.length ? interactions : base.interactions,
    research: String(raw.research || ""),
    howToTake: String(raw.howToTake || base.howToTake),
    whyItWorks: String(raw.whyItWorks || ""),
    whenToTake: String(raw.whenToTake || ""),
    servingSize: String(raw.servingSize || base.servingSize),
    facts: facts.length ? facts : base.facts,
    otherIngredients: String(raw.otherIngredients || ""),
  };
}

type BenefitRow = SupplementBenefit;

export default function SupplementProductForm({
  productName,
  benefits,
  onBenefits,
  details,
  onDetails,
}: {
  productName: string;
  benefits: BenefitRow[];
  onBenefits: (rows: BenefitRow[]) => void;
  details: SupplementDetails;
  onDetails: (next: SupplementDetails) => void;
}) {
  const patch = (partial: Partial<SupplementDetails>) =>
    onDetails({ ...details, ...partial });

  return (
    <>
      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Supplement form</h2>
            <p>
              Card points, “is it right for you,” formula notes, interactions, and the supplement facts panel.
            </p>
          </div>
        </div>
        <TextField
          label="Page question"
          value={
            productName.trim()
              ? `Is our ${productName.trim()} right for you?`
              : "Is this supplement right for you?"
          }
          fullWidth
          InputProps={{ readOnly: true }}
          helperText="Shown from the product name. Fill the three cards below."
        />
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Card benefits</h2>
            <p>The short points on the supplements list, like focus, nerves, and energy.</p>
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
              label="Point"
              value={row.title}
              onChange={(e) =>
                onBenefits(
                  benefits.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  )
                )
              }
              fullWidth
              placeholder="Supports mental clarity"
            />
            <TextField
              label="Extra line"
              value={row.description}
              onChange={(e) =>
                onBenefits(
                  benefits.map((item, i) =>
                    i === index ? { ...item, description: e.target.value } : item
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
            <h2>Right for you</h2>
            <p>Three cards under the product title. Each has a short title and a sentence.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patch({ fitFor: [...details.fitFor, { title: "", description: "" }] })
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
                  patch({ fitFor: details.fitFor.filter((_, i) => i !== index) })
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </div>
            <TextField
              label="Title"
              value={row.title}
              onChange={(e) =>
                patch({
                  fitFor: details.fitFor.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  ),
                })
              }
              fullWidth
              placeholder="Stay sharp"
            />
            <TextField
              label="Description"
              value={row.description}
              onChange={(e) =>
                patch({
                  fitFor: details.fitFor.map((item, i) =>
                    i === index ? { ...item, description: e.target.value } : item
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
        <div className="store-section__head">
          <div>
            <h2>Formula transparency</h2>
            <p>Chips such as Vegan, Made without major allergens, Backed by research.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() => patch({ transparency: [...details.transparency, ""] })}
          >
            Add chip
          </Button>
        </div>
        {details.transparency.map((label, index) => (
          <div key={`chip-${index}`} className="store-editor__row">
            <TextField
              label={`Chip ${index + 1}`}
              value={label}
              onChange={(e) =>
                patch({
                  transparency: details.transparency.map((item, i) =>
                    i === index ? e.target.value : item
                  ),
                })
              }
              fullWidth
            />
            <IconButton
              onClick={() =>
                patch({
                  transparency: details.transparency.filter((_, i) => i !== index),
                })
              }
            >
              <DeleteOutlineIcon />
            </IconButton>
          </div>
        ))}
      </section>

      <section className="store-section">
        <div className="store-section__head">
          <div>
            <h2>Drug and nutrient notes</h2>
            <p>Medicines this supplement may affect. Keep each note short and factual.</p>
          </div>
          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              patch({
                interactions: [...details.interactions, { medication: "", note: "" }],
              })
            }
          >
            Add note
          </Button>
        </div>
        {details.interactions.map((row, index) => (
          <div key={`ix-${index}`} className="store-subcard">
            <div className="store-subcard__top">
              <strong>Note {index + 1}</strong>
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
              label="Medication group"
              value={row.medication}
              onChange={(e) =>
                patch({
                  interactions: details.interactions.map((item, i) =>
                    i === index ? { ...item, medication: e.target.value } : item
                  ),
                })
              }
              fullWidth
              placeholder="Thyroid medications"
            />
            <TextField
              label="What to know"
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
        <h2>Supplement information</h2>
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
        <TextField
          label="Serving size"
          value={details.servingSize}
          onChange={(e) => patch({ servingSize: e.target.value })}
          fullWidth
          placeholder="1 vegetarian capsule"
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
              placeholder="Acetyl L-Carnitine"
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
                placeholder="500 mg"
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
                placeholder="† if not established"
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
          placeholder="Hypromellose, rice flour, silica"
        />
      </section>
    </>
  );
}
