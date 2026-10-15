import { BRAND } from "constants/brand";

export default function LoginBrand() {
  return (
    <aside className="login-brand" aria-label={BRAND.name}>
      <img alt={BRAND.name} src={BRAND.logo} className="login-brand__logo" />
    </aside>
  );
}
