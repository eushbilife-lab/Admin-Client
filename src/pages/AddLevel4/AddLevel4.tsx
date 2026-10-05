import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import level4Service from "services/level4.service";
import GoBack from "@core/basic-components/GoBack";
import Level4FormUpdate from "./Level4FormUpdate";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import Level4Form from "./Level4Form";
import { change } from "redux-form";
import { useEffect } from "react";
import ToasterService from "utils/toaster.util";
import { withEnglishCopy } from "utils/localizedData.util";

export default function AddLevel4() {
  const form = "Level4Form";
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.level4);
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
    const { HNSSProductCategoryID, level3, en, ar } = values;
    const subCategoryID = level3?.value;
    const HNSSProductCategory = HNSSProductCategoryID?.value;
    const status = values.status === true ? "active" : "inactive";
    const payload = { en, ar, status, subCategoryID, HNSSProductCategoryID: HNSSProductCategory };

    // Conditionally update or create
    if (id) {
      await level4Service.update(id, payload, navigate,dispatch);
    } else {
      await level4Service.create(payload, navigate,dispatch);
    }
  };

  return (
    <PageShell
      title={`${id ? "Update" : "Add"} Level 4`}
      actions={<GoBack path="/level4" title="Back to Level 4" />}
    >
      {loading && <CircleLoader />}
      <Level4Form onSubmit={handleSubmit} />
      {id && <Level4FormUpdate id={id} />}
    </PageShell>
  );
}
