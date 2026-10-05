import CircleLoader from "@core/basic-components/CircleLoader";
import level1Service from "services/level1.service";
import GoBack from "@core/basic-components/GoBack";
import Level1FormUpdate from "./Level1FormUpdate";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import Level1Form from "./Level1Form";
import { useEffect } from "react";
import { change } from "redux-form";
import ToasterService from "utils/toaster.util";
import { withEnglishCopy } from "utils/localizedData.util";

export default function AddLevel1() {
  const form = "Level1Form";
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.level1);

  if (!id) {
    useEffect(() => {
      dispatch(change(form, "status", true));
    });
  }
  const handleSubmit = async (values: any) => {
    if (!values?.en?.name?.trim()) {
      return ToasterService.showError("Name is required");
    }
    let data = withEnglishCopy(values);
    data.status = data.status === true ? "active" : "inactive";
    if (id) {
      await level1Service.update(`${id}`, data, navigate,dispatch);
    } else {
      await level1Service.create(data, navigate,dispatch);
    }
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} Level 1`}
      actions={<GoBack path="/Level1" title="Back to Level 1" />}
    >
      {loading && <CircleLoader />}
      <Level1Form onSubmit={handleSubmit} />
      {id && <Level1FormUpdate id={id} />}
    </PageShell>
  );
}
