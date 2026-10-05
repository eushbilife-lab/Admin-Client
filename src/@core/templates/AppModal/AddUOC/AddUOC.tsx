import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import UpdateIngredientsForm from "./UpdateUOCForm";
import ingredientService from "services/ingredient.service";
import AddIngredientsForm from "./AddUOCForm";
import { change } from "redux-form";
import { useEffect } from "react";
import AddFOPLCertificateForm from "./AddUOCForm";
import UpdateFOPLCertificateForm from "./UpdateUOCForm";
import ImageService from "services/image.service";
import imagesService from "services/images.service";
import AddUOCForm from "./AddUOCForm";
import UpdateUOCForm from "./UpdateUOCForm";

export default function AddUOC() {
  const form = "AddUOCForm";
  const { id, type } = useAppSelector((state) => state.modal.data);
  const { loading ,filters} = useAppSelector((state) => state.ingredient);
  const dispatch = useAppDispatch();

  if (!id) {
    useEffect(() => {
      dispatch(change(form, "status", true));
    });
  }
  const handleSubmit = async(values: any) => {
    const url= await ImageService.uploadFile(values.url)
  
    let data = { ...values, url, type };
    if (id) {
      imagesService.update(id, data,dispatch);
    } else {
      imagesService.create(data,dispatch);
    }
    console.log("🚀 ~ handleSubmit ~ data:", data)
  };

  return (
    <div>
      {loading && <CircleLoader />}
      <h3>{!id ? "Add UOC" : "Update UOC"}</h3>
      <AddUOCForm onSubmit={handleSubmit} />
      {id && <UpdateUOCForm />}
    </div>
  );
}
