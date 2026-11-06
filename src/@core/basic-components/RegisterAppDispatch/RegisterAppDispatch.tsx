import { useEffect } from "react";
import { useAppDispatch } from "redux/hooks";
import { setAppDispatch } from "utils/dispatch.util";
import { setUnauthorizedHandler } from "services/http.service";
import AuthService from "services/auth.service";

export default function RegisterAppDispatch() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setAppDispatch(dispatch);
    setUnauthorizedHandler(() => AuthService.logout());
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [dispatch]);

  return null;
}
