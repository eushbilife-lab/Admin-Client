import { useTranslation } from "react-i18next";
import { FieldArrayHeadingProps } from ".";
import Button from "@core/basic-components/Button";

export default function FieldArrayHeading({
  index,
  onClick,
  heading,
  fieldsLength,
  addMore,
}: FieldArrayHeadingProps) {
  const {t}=useTranslation()
  return (
    <h3
      style={{
        margin: "0",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {addMore && <>{index + 1}.</>}
      {/* {heading} */}
      {fieldsLength > 1 && <Button onClick={onClick} sx={{fontSize:"13px"}}>{t("Remove")}</Button>}
    </h3>
  );
}
