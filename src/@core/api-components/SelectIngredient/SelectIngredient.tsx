import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import ingredientService from "services/ingredient.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";

export default function SelectIngredient(props: any) {
  const dispatch=useAppDispatch()
  const dynamicIngredient = useAppSelector((state) =>state.ingredient.ingredientOptions);
  useEffect(() => {
    ingredientService.getOptions({ status:"active" },dispatch);
  }, []);
  return (
    <CheckboxRedux
      {...props}
      options={dynamicIngredient} // Pass the options to the CheckboxRedux
    />
  );
}
