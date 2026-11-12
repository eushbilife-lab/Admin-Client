import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

export const DYNAMIC_FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "URL" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "select", label: "Select" },
  { value: "multiselect", label: "Multi select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
] as const;

export type DynamicFieldType = (typeof DYNAMIC_FIELD_TYPES)[number]["value"];

export type DynamicField = {
  id: string;
  type: DynamicFieldType;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  values: string[];
};

const CHOICE_TYPES = new Set<DynamicFieldType>([
  "select",
  "multiselect",
  "radio",
  "checkbox",
]);

export function needsOptions(type: DynamicFieldType) {
  return CHOICE_TYPES.has(type);
}

export function parseCustomFields(raw: unknown): DynamicField[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row: any, index: number) => {
      const type = String(row?.type || "text") as DynamicFieldType;
      const known = DYNAMIC_FIELD_TYPES.some((item) => item.value === type);
      if (!known || !String(row?.label || "").trim()) return null;
      const options = Array.isArray(row?.options)
        ? row.options.map((item: any) => String(item || "").trim()).filter(Boolean)
        : [];
      const values = Array.isArray(row?.values)
        ? row.values.map((item: any) => String(item || "").trim()).filter(Boolean)
        : [];
      return {
        id: String(row?.id || `field_${index + 1}`),
        type,
        label: String(row.label).trim(),
        placeholder: String(row?.placeholder || "").trim(),
        options,
        value: String(row?.value ?? ""),
        values,
      } satisfies DynamicField;
    })
    .filter((row): row is DynamicField => Boolean(row));
}

function splitOptions(text: string) {
  return text
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function FieldControl({
  field,
  onChange,
}: {
  field: DynamicField;
  onChange: (next: DynamicField) => void;
}) {
  if (field.type === "textarea") {
    return (
      <TextField
        label={field.label}
        value={field.value}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
        fullWidth
        multiline
        minRows={3}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "select") {
    return (
      <TextField
        select
        label={field.label}
        value={field.value}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
        fullWidth
      >
        {field.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (field.type === "multiselect") {
    return (
      <TextField
        select
        label={field.label}
        value={field.values}
        onChange={(e) => {
          const next = e.target.value;
          onChange({
            ...field,
            values: typeof next === "string" ? next.split(",") : next,
          });
        }}
        fullWidth
        SelectProps={{ multiple: true }}
      >
        {field.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="dynamic-field__choice">
        <span>{field.label}</span>
        <RadioGroup
          value={field.value}
          onChange={(e) => onChange({ ...field, value: e.target.value })}
        >
          {field.options.map((option) => (
            <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
      </div>
    );
  }

  if (field.type === "checkbox") {
    if (!field.options.length) {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={field.value === "true"}
              onChange={(e) =>
                onChange({ ...field, value: e.target.checked ? "true" : "false" })
              }
            />
          }
          label={field.label}
        />
      );
    }
    return (
      <div className="dynamic-field__choice">
        <span>{field.label}</span>
        <FormGroup>
          {field.options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={field.values.includes(option)}
                  onChange={(e) => {
                    const values = e.target.checked
                      ? [...field.values, option]
                      : field.values.filter((item) => item !== option);
                    onChange({ ...field, values });
                  }}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      </div>
    );
  }

  const inputType =
    field.type === "phone" ? "tel" : field.type === "text" ? "text" : field.type;

  return (
    <TextField
      type={inputType}
      label={field.label}
      value={field.value}
      onChange={(e) => onChange({ ...field, value: e.target.value })}
      fullWidth
      placeholder={field.placeholder}
    />
  );
}

export default function DynamicProductFields({
  fields,
  onChange,
}: {
  fields: DynamicField[];
  onChange: (fields: DynamicField[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<DynamicFieldType>("text");
  const [label, setLabel] = useState("");
  const [optionsText, setOptionsText] = useState("");

  const addField = () => {
    const name = label.trim();
    if (!name) return;
    const options = needsOptions(type) ? splitOptions(optionsText) : [];
    if (needsOptions(type) && type !== "checkbox" && !options.length) return;
    onChange([
      ...fields,
      {
        id: `field_${Date.now()}`,
        type,
        label: name,
        placeholder: "",
        options,
        value: "",
        values: [],
      },
    ]);
    setLabel("");
    setOptionsText("");
  };

  return (
    <section className="store-section">
      <div className="store-section__head">
        <div>
          <h2>Dynamic form</h2>
          <p>Add extra fields without changing the product form above.</p>
        </div>
        <Button startIcon={<AddIcon />} onClick={() => setOpen((value) => !value)}>
          {open ? "Hide field builder" : "Add dynamic field"}
        </Button>
      </div>

      {open ? (
        <div className="store-subcard">
          <div className="store-editor__row">
            <TextField
              select
              label="Field type"
              value={type}
              onChange={(e) => setType(e.target.value as DynamicFieldType)}
              fullWidth
            >
              {DYNAMIC_FIELD_TYPES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              fullWidth
              placeholder="Flavor"
            />
          </div>
          {needsOptions(type) ? (
            <TextField
              label="Options"
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              fullWidth
              placeholder="Lemon, Mint, Unflavored"
              helperText="Separate choices with commas. Leave empty for a single checkbox."
            />
          ) : null}
          <div>
            <Button variant="contained" onClick={addField} disabled={!label.trim()}>
              Add field
            </Button>
          </div>
        </div>
      ) : null}

      {fields.map((field, index) => (
        <div key={field.id} className="store-subcard">
          <div className="store-subcard__top">
            <strong>
              {field.label}{" "}
              <span className="dynamic-field__type">
                {DYNAMIC_FIELD_TYPES.find((item) => item.value === field.type)?.label}
              </span>
            </strong>
            <IconButton
              size="small"
              onClick={() => onChange(fields.filter((_, i) => i !== index))}
              aria-label="Remove field"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>
          <FieldControl
            field={field}
            onChange={(next) =>
              onChange(fields.map((row, i) => (i === index ? next : row)))
            }
          />
        </div>
      ))}
    </section>
  );
}
