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
import { optionId, optionLabel } from "utils/selectOption.util";

export default function AddLevel2() {
  const form = "Level2Form";
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.level1);

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [id, dispatch]);

  const handleSubmit = async (values: any) => {
    const name =
      optionLabel(values?.name ?? values?.en?.name ?? values?.en, "").trim() ||
      String(values?.en?.name || "").trim();
    if (!name) return ToasterService.showError("Name is required");

    const mainCategoryID = optionId(values.level1);
    if (!mainCategoryID) {
      return ToasterService.showError("Level 1 is required");
    }

    const status = values.status === true ? "active" : "inactive";
    const payload = { name, status, mainCategoryID };

    if (id) {
      await level2Service.update(id, payload, navigate, dispatch);
    } else {
      await level2Service.create(payload, navigate, dispatch);
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
