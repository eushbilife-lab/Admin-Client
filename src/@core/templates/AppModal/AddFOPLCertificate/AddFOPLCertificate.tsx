import { useAppDispatch, useAppSelector } from "redux/hooks";
import { reset } from "redux-form";
import { useEffect } from "react";
import AddFOPLCertificateForm from "./AddFOPLCertificateForm";
import UpdateFOPLCertificateForm from "./UpdateFOPLCertificateForm";
import imagesService from "services/images.service";
import { useTranslation } from "react-i18next";

export default function AddFOPLCertificate() {
  const form = "AddFOPLCertificate";
  const { id, type, data } = useAppSelector((state) => state.modal.data) || {};
  const dispatch = useAppDispatch();
  const {t}=useTranslation()

  useEffect(() => {
    if (!id) {
      dispatch(reset(form));
    }
  }, [id, dispatch]);

  const handleSubmit = async (values: any) => {
    const name = String(values?.name || "").trim();
    let updateData = { ...values, name, type, previousImageUrl: data?.url };
    let createData = { ...values, name, type };
  
    if (id) {
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
