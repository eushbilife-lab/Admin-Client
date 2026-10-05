import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "services/product.service";
import { productActions } from "redux/slices/product";

export default function SelectImages(props: any) {
  const dispatch=useAppDispatch()
  const { id } = useParams();
  const { product } = useAppSelector((state) => state.product);
  useEffect(() => {
    if (id) {
      productService.get(id, dispatch);
    }
    return () => {
      dispatch(productActions.setProduct(null));
    };
  }, [id, dispatch]);
  const productImages=product?.productImages
  console.log("🚀 ~ SelectImages ~ productImages:", productImages)
  return <ComboBoxRedux {...props} options={productImages} />;
}
