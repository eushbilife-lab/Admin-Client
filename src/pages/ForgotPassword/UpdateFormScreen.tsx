import { useState } from "react";
import { BRAND } from "constants/brand";
import Input from "@core/basic-components/Input";
import Button from "@core/basic-components/Button";
import ToasterService from "utils/toaster.util";
import AuthService from "services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import useBeforeUnload from "@core/basic-components/useBeforeUnload";

const UpdateFormScreen = ({ email }: { email: string }) => {
  useBeforeUnload("ss");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const passwordSubmit = () => {
    if (password !== cPassword) {
      ToasterService.showError("Password and confirmation do not match");
      return;
    }
    AuthService.reset({ email, password }).then(([user]) => {
      if (user) navigate("/");
    });
  };

  return (
    <>
      <img alt="" src={BRAND.logo} className="login-panel__mark" />
      <h1 className="login-panel__title">Set a new password</h1>
      <p className="login-panel__lede">Choose a password for your {BRAND.console} account.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          passwordSubmit();
        }}
      >
        <Input
          required
          type="password"
          label="Password"
          showIcon
          inputProps={{ minLength: 8 }}
          sx={{ mb: 2 }}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Input
          required
          showIcon
          type="password"
          inputProps={{ minLength: 8 }}
          label="Confirm password"
          sx={{ mb: 2 }}
          onChange={(event) => setCPassword(event.target.value)}
        />
        <Button fullWidth variant="contained" type="submit">
          Update password
        </Button>
      </form>
      <Link className="login-panel__back" to="/">
        Back to sign in
      </Link>
    </>
  );
};

export default UpdateFormScreen;
