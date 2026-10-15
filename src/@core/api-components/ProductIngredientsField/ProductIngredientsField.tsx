import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ingredientService from "services/ingredient.service";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ProductIngredientRow = {
  ingredientDescription?: string;
  ingredientContent?: string | number;
  ingredientCode?: string;
  value?: string;
};

function rowKey(row: ProductIngredientRow) {
  return (
    row.value ||
    row.ingredientCode ||
    row.ingredientDescription ||
    ""
  ).toLowerCase();
}

function toRow(option: any): ProductIngredientRow {
  return {
    value: option.value || option._id || "",
    ingredientDescription: option.name || option.label || option.ingredientDescription || "",
    ingredientCode: option.code || option.ingredientCode || "",
    ingredientContent: option.content || option.ingredientContent || "",
  };
}

/**
 * Searchable multi-select for product ingredients with chips + optional % content.
 * Works as a redux-form Field component (input.value = ProductIngredientRow[]).
 */
export default function ProductIngredientsField({
  input,
  meta,
  label,
}: any) {
  const dispatch = useAppDispatch();
  const { ingredientOptions, loading } = useAppSelector((state) => state.ingredient);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  const selected: ProductIngredientRow[] = Array.isArray(input?.value)
    ? input.value
    : [];

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!open && !debounced) return;
    ingredientService.getByName({ name: debounced || "" }, dispatch);
  }, [debounced, open, dispatch]);

  const selectedKeys = useMemo(
    () => new Set(selected.map(rowKey).filter(Boolean)),
    [selected]
  );

  const options = useMemo(() => {
    const list = Array.isArray(ingredientOptions) ? ingredientOptions : [];
    return list
      .map(toRow)
      .filter((row) => row.ingredientDescription)
      .filter((row) => !selectedKeys.has(rowKey(row)));
  }, [ingredientOptions, selectedKeys]);

  const onAdd = useCallback(
    (_e: any, option: any) => {
      if (!option) return;
      const row = toRow(option);
      const key = rowKey(row);
      if (!key || selectedKeys.has(key)) return;
      input.onChange([...selected, row]);
      setSearch("");
    },
    [input, selected, selectedKeys]
  );

  const onRemove = useCallback(
    (index: number) => {
      input.onChange(selected.filter((_, i) => i !== index));
    },
    [input, selected]
  );

  const onContentChange = useCallback(
    (index: number, content: string) => {
      const next = selected.map((row, i) =>
        i === index ? { ...row, ingredientContent: content } : row
      );
      input.onChange(next);
    },
    [input, selected]
  );

  const showError = meta?.touched && meta?.error;

  return (
    <Box sx={{ width: "100%" }}>
      {label ? (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          {label}
        </Typography>
      ) : null}

      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        value={null}
        inputValue={search}
        onInputChange={(_e, value, reason) => {
          if (reason === "input" || reason === "clear") setSearch(value);
        }}
        onChange={onAdd}
        filterOptions={(x) => x}
        getOptionLabel={(option: any) =>
          option.ingredientDescription || option.label || option.name || ""
        }
        isOptionEqualToValue={(a: any, b: any) => rowKey(a) === rowKey(b)}
        noOptionsText={
          loading
            ? "Searching…"
            : debounced
              ? "No ingredients found"
              : "Type to search ingredients"
        }
        renderOption={(props, option: any) => {
          const { key, ...rest } = props as any;
          return (
            <li key={key || rowKey(option)} {...rest}>
              <Box sx={{ py: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {option.ingredientDescription}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {[option.ingredientCode && `Code ${option.ingredientCode}`, option.ingredientContent && `${option.ingredientContent}%`]
                    .filter(Boolean)
                    .join(" · ") || "Ingredient"}
                </Typography>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search ingredients"
            placeholder="Type at least 1 character…"
            size="small"
            error={Boolean(showError)}
            helperText={showError ? meta.error : "Select from the dictionary. Duplicates are blocked."}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <Box sx={{ mt: 2 }}>
        {selected.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1.5 }}>
            No ingredients selected yet.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {selected.map((row, index) => (
              <Stack
                key={`${rowKey(row)}-${index}`}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{
                  p: 1.25,
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--border-radius-md)",
                  backgroundColor: "var(--color-canvas)",
                }}
              >
                <Chip
                  label={row.ingredientDescription || "Ingredient"}
                  onDelete={() => onRemove(index)}
                  sx={{ fontWeight: 600, maxWidth: "100%" }}
                />
                {row.ingredientCode ? (
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
                    {row.ingredientCode}
                  </Typography>
                ) : null}
                <TextField
                  size="small"
                  label="Content %"
                  value={row.ingredientContent ?? ""}
                  onChange={(e) => onContentChange(index, e.target.value)}
                  inputProps={{ inputMode: "decimal", "aria-label": `Content percent for ${row.ingredientDescription}` }}
                  sx={{ width: { xs: "100%", sm: 120 }, ml: { sm: "auto" } }}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
