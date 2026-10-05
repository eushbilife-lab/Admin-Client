import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import AddFOPLCertificateForm from "./AddFOPLCertificateForm";
import UpdateFOPLCertificateForm from "./UpdateFOPLCertificateForm";
import imagesService from "services/images.service";
import { useTranslation } from "react-i18next";

export default function AddFOPLCertificate() {
  const form = "AddFOPLCertificateForm";
  const { id, type, data } = useAppSelector((state) => state.modal.data);
  const dispatch = useAppDispatch();
  const {t}=useTranslation()

  useEffect(() => {
    if (!id) {
      dispatch(change(form, "status", true));
    }
  }, [id, dispatch]);

  const handleSubmit = async (values: any) => {
    let updateData = { ...values, type, previousImageUrl:data?.url };
    let createData = { ...values, type };
  
    if (id) {
      console.log("update")
      imagesService.update(id, updateData, dispatch);
    } else {
      imagesService.create(createData, dispatch);
    }
  };

  return (
    <div>
      <h3>{!id ? t("Add Certificate") : t("Update Certificate")}</h3>
      {data?.url && (
        <img
          src={data.url}
          alt="Certificate"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
      )}
      <AddFOPLCertificateForm onSubmit={handleSubmit} />
      {id && <UpdateFOPLCertificateForm />}
    </div>
  );
}
