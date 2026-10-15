import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import level3Service from "services/level3.service";
import GoBack from "@core/basic-components/GoBack";
import Level3FormUpdate from "./Level3FormUpdate";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import Level3Form from "./Level3Form";
import { useEffect } from "react";
import { change } from "redux-form";
import ToasterService from "utils/toaster.util";
import { optionId, optionLabel } from "utils/selectOption.util";

export default function AddLevel3() {
  const form = "Level3Form";
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.level3);

  useEffect(() => {
    if (!id) dispatch(change(form, "status", true));
  }, [id, dispatch]);

  const handleSubmit = async (values: any) => {
    const name =
      optionLabel(values?.name ?? values?.en?.name ?? values?.en, "").trim() ||
      String(values?.en?.name || "").trim();
    if (!name) return ToasterService.showError("Name is required");

    const categoryID = optionId(values.level2);
    if (!categoryID) {
      return ToasterService.showError("Level 2 is required");
    }

    const status = values.status === true ? "active" : "inactive";
    const payload = { name, status, categoryID };

    if (id) {
      await level3Service.update(id, payload, navigate, dispatch);
    } else {
      await level3Service.create(payload, navigate, dispatch);
    }
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} Level 3`}
      actions={<GoBack path="/level3" title="Back to Level 3" />}
    >
      {loading && <CircleLoader />}
      <Level3Form onSubmit={handleSubmit} />
      {id && <Level3FormUpdate id={id} />}
    </PageShell>
  );
}
