import { GoBackProps } from ".";
import { Link } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { useTranslation } from "react-i18next";
export default function GoBack({ path, title }: GoBackProps) {
  const { t } = useTranslation();
  return (
    <div className="goback">
      <Link to={path}>
        <BsArrowLeftShort size="23px" />
        <span style={{fontSize:"15px"}}>{t(title)}</span>
      </Link>
    </div>
  );
}
