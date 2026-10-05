import { BRAND } from "constants/brand";

export default function LoginBrand() {
  return (
    <aside className="login-brand">
      <div className="login-brand__glow" aria-hidden="true" />
      <img alt={BRAND.name} src={BRAND.logo} className="login-brand__logo" />
      <p className="login-brand__kicker">{BRAND.console}</p>
      <h2 className="login-brand__headline">{BRAND.tagline}</h2>
      <p className="login-brand__copy">{BRAND.lede}</p>
      <ul className="login-brand__pillars">
        <li>Catalog</li>
        <li>Safety</li>
        <li>Science</li>
        <li>Scores</li>
      </ul>
    </aside>
  );
}
