import { MyFormProps } from ".";
import Button from "@core/basic-components/Button";
import { InjectedFormProps, reduxForm } from "redux-form";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const MyForm = ({
  myFields,
  handleSubmit,
  onClickReset,
  onClickExport,
}: MyFormProps & InjectedFormProps<{}, MyFormProps>) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={handleSubmit}>
      <ReduxFormFields fields={myFields} />
      <br />
      <Divider sx={{my:2}}/>
        <div style={{display:"flex",gap:"15px"}}>
          {onClickReset && (
            <Button
              type="reset"
              variant="outlined"
              onClick={onClickReset}
              sx={{fontSize:"13.5px"}}
            >
              {t("Reset")}
            </Button>
          )}
          <Button variant="contained" type="submit" sx={{fontSize:"12px"}}>
            {t("Search")}
          </Button>
        </div>
        {onClickExport && (
          <Button
            type="button"
            color="success"
            variant="contained"
            onClick={onClickExport}
            sx={{ marginLeft: "10px" }}
          >
            Export
          </Button>
        )}
    </form>
  );
};

export default reduxForm<{}, MyFormProps>({ form: "MyForm" })(MyForm);
