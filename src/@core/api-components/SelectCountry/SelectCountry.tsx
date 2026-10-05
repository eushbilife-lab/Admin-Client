import { countries, getEmojiFlag, TCountryCode } from "countries-list";
import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import { useMemo } from "react";

export default function SelectCountry({ ...props }) {
  const options = useMemo(() => {
    return Object.entries(countries).map(([code, data]) => ({
      value: code,
      label: `${getEmojiFlag(code as TCountryCode)} ${data.name}`,
    }));
  }, []);

  return <ComboBoxRedux {...props} options={options} />;
}
