import "./Banner.css";
import { BannerProps } from ".";
import { useTranslation } from "react-i18next";

export default function Banner({ heading, children }: BannerProps) {
  const { t } = useTranslation();

  return (
    <div className="banner-heading">
      <h2 className="heading-title">{t(heading)}</h2>
      <div className="banner-data">{children}</div>
    </div>
  );
}
