import { useState } from "react";
import "../Login/Login.css";
import { useAppSelector } from "redux/hooks";
import CircleLoader from "@core/basic-components/CircleLoader";
import { BRAND } from "constants/brand";
import Button from "@core/basic-components/Button";
import Input from "@core/basic-components/Input";
import OTPInput from "@core/basic-components/OTPInput";
import AuthService from "services/auth.service";
import { Link } from "react-router-dom";
import UpdateFormScreen from "./UpdateFormScreen";
import LoginBrand from "../Login/LoginBrand";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpExp, setOtpExp] = useState("");
  const [otpReset, setOtpReset] = useState(0);
  const [screenType, setScreenType] = useState("email");
  const loading = useAppSelector((state) => state.auth.loading);

  const sendCode = () => {
    AuthService.forgot({ email }).then(([otpExpiry]) => {
      if (otpExpiry) {
        setOtpExp(otpExpiry);
        setScreenType("otp");
        setOtpReset((value) => value + 1);
      }
    });
  };

  return (
    <div className="login-page">
      {loading && <CircleLoader />}
      <LoginBrand />
      <div className="login-panel">
        <div className="login-panel__inner">
          {screenType === "email" && (
            <>
              <img alt="" src={BRAND.logo} className="login-panel__mark" />
              <h1 className="login-panel__title">Reset access</h1>
              <p className="login-panel__lede">
                Enter the staff email we should send a one-time code to.
              </p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendCode();
                }}
              >
                <Input
                  required
                  type="email"
                  label="Email"
                  sx={{ mb: 2 }}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button fullWidth variant="contained" type="submit">
                  Send code
                </Button>
              </form>
              <Link className="login-panel__back" to="/">
                Back to sign in
              </Link>
            </>
          )}
          {screenType === "password" && <UpdateFormScreen email={email} />}
          {screenType === "otp" && (
            <>
              <img alt="" src={BRAND.logo} className="login-panel__mark" />
              <h1 className="login-panel__title">Enter your code</h1>
              <p className="login-panel__lede">
                {otpExp
                  ? `A 4-digit code was sent. It stays valid until ${otpExp}.`
                  : "A 4-digit code is on its way."}
              </p>
              <OTPInput
                length={4}
                reset={otpReset}
                onComplete={(otp) => {
                  if (!otp) return;
                  AuthService.verifyOtp({ email, otpCode: otp }).then(([verified]) => {
                    if (verified) setScreenType("password");
                  });
                }}
              />
              <Button
                type="button"
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={sendCode}
              >
                Resend code
              </Button>
              <Link className="login-panel__back" to="/">
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
