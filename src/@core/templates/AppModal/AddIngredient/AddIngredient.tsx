import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ingredientService from "services/ingredient.service";
import AddIngredientForm from "./AddIngredientForm/AddIngredientForm";
import UpdateIngredientForm from "./UpdateIngredientForm";
import { useEffect } from "react";
import { change } from "redux-form";

export default function AddIngredient() {
  const form = "AddIngredientForm";
  const { id } = useAppSelector((state) => state.modal.data);
  const { loading, filters } = useAppSelector((state) => state.ingredient);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [dispatch, id]);

  const handleSubmit = (values: any) => {
    const enName = values?.en?.name;
    const data = {
      ...values,
      ar: { ...(values.ar || {}), name: enName },
      status: values.status === true || values.status === "active" ? "active" : "inactive",
    };
    if (id) ingredientService.updateIngredient(id, data, dispatch);
    else ingredientService.create(data, filters, dispatch);
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{id ? "Update ingredient" : "Add ingredient"}</h3>
      <AddIngredientForm onSubmit={handleSubmit} />
      {id ? <UpdateIngredientForm /> : null}
    </div>
  );
}
