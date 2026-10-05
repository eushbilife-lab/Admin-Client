import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import level2Service from "services/level2.service";
import GoBack from "@core/basic-components/GoBack";
import Level2FormUpdate from "./Level2FormUpdate";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import Level2Form from "./Level2Form";
import { change } from "redux-form";
import { useEffect } from "react";
import ToasterService from "utils/toaster.util";
import { withEnglishCopy } from "utils/localizedData.util";

export default function AddLevel2() {
  const form = "Level2Form";
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
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
    values = withEnglishCopy(values);
    const { level1, en, ar } = values;
    const mainCategoryID = level1?.value || null;
    const status = values.status === true ? "active" : "inactive";
    const payload = { en, ar, status, mainCategoryID };

    if (id) {
      await level2Service.update(id, payload, navigate,dispatch);
    } else {
      await level2Service.create(payload, navigate,dispatch);
    }
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} Level 2`}
      actions={<GoBack path="/level2" title="Back to Level 2" />}
    >
      {loading && <CircleLoader />}
      <Level2Form onSubmit={handleSubmit} />
      {id && <Level2FormUpdate id={id} />}
    </PageShell>
  );
}
