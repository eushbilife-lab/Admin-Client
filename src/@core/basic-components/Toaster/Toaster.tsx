import { useSnackbar } from "notistack";
import useEffectOnce from "hooks/useEffectOnce";
import ToasterService from "utils/toaster.util";
import { useTranslation } from "react-i18next";

export default function Toaster() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  useEffectOnce(() => {
    const success = (msg: string) =>
      msg && enqueueSnackbar(t(msg), { variant: "success" });

    const error = (msg: string) =>
      msg && enqueueSnackbar(t(msg), { variant: "error" });

    ToasterService.subscribe(success, error);
  });

  return null;
}
