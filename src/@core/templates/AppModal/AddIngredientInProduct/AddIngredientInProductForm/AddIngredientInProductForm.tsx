import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ChipboxRedux from "@core/redux-fields/ChipboxRedux";
import ingredientService from "services/ingredient.service";
import { change, Field, reduxForm } from "redux-form";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import Input from "@core/basic-components/Input";
import ToasterService from "utils/toaster.util";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

function AddIngredientInProductForm() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState([]);

  const dispatch = useAppDispatch();
  const form = "AddProductForm";
  const currentIngredients = useAppSelector(
    (state) => state.form[form]?.values?.ingredients
  );
  const { ingredientOptions, loading } = useAppSelector((state) => state?.ingredient);

  // Debounce search term update
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch ingredients when search changes
  useEffect(() => {
    ingredientService.getByName({ name: debouncedSearch || "" }, dispatch);
  }, [debouncedSearch]);

  // Sync selected items with ingredientSection
  useEffect(() => {
    setSelectedItems([]);
  }, []);

  // Toggle item selection
  const handleToggle = (ingredient: any) => {
    setSelectedItems((prevSelected: any) => {
      const isAlreadySelected = prevSelected.some((item: any) => item.value === ingredient.value);
      if (isAlreadySelected) {
        return prevSelected.filter((item: any) => item.value !== ingredient.value);
      } else {
        return [...prevSelected, ingredient];
      }
    });
  };
  // Handle form submission
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      ToasterService.showError("Please select at least one Ingredient!");
    } else {
      const rows = selectedItems.map((item: any) => ({
        ingredientDescription: item.name || item.label || "",
        ingredientCode: item.code || "",
        ingredientContent: item.content || "",
      }));
      dispatch(change(form, "ingredients", [...(currentIngredients || []), ...rows]));
      dispatch(modalActions.closeModal());
    }
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <div className="search-container">
        <Field
          name="search"
          label="Search Ingredients"
          component={Input}
          type="text"
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>

      {ingredientOptions?.map((ingredient) => (
        <Field
          key={ingredient.value}
          name={ingredient.label}
          label={[
            ingredient.name || ingredient.label,
            ingredient.code ? `code ${ingredient.code}` : "",
            ingredient.content ? `content ${ingredient.content}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}
          component={ChipboxRedux}
          sign={
            selectedItems.some((selected:any) => selected.value === ingredient.value) ? (
              <RemoveIcon sx={{ fontSize: "1rem" }} />
            ) : (
              <AddIcon sx={{ fontSize: "1rem" }} />
            )
          }
          isSelected={selectedItems.some((selected:any) => selected.value === ingredient.value)}
          onClick={() => handleToggle(ingredient)}
        />
      ))}

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="outlined" onClick={() => dispatch(modalActions.closeModal())}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </Stack>
    </div>
  );
}

export default reduxForm({ form: "AddIngredientsInProductForm" })(AddIngredientInProductForm);
