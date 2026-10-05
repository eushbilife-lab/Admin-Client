import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import imagesService from "services/images.service";
import { useEffect } from "react";

export default function SelectCertificate(props: any) {
  const dispatch = useAppDispatch();
  const certificateImages = useAppSelector((state) => state.image.product_certificate.imageOptions);
  useEffect(() => {
    imagesService.getOptions({ type: "product_certificate" }, dispatch);
  }, [dispatch]);
 
  return <ComboBoxRedux {...props} options={certificateImages} />;
}
