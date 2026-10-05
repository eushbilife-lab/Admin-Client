import LoginForm from "./LoginForm";
import LoginBrand from "./LoginBrand";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import CircleLoader from "@core/basic-components/CircleLoader";
import { BRAND } from "constants/brand";
import "./Login.css";

export default function Login() {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="login-page">
      {loading && <CircleLoader />}
      <LoginBrand />
      <div className="login-panel">
        <div className="login-panel__inner">
          <img alt="" src={BRAND.logo} className="login-panel__mark" />
          <h1 className="login-panel__title">Welcome Back</h1>
          <p className="login-panel__lede">
            Login start your wellness journey
          </p>
          <LoginForm onSubmit={(values: any) => AuthService.login(values)} />
        </div>
      </div>
    </div>
  );
}
