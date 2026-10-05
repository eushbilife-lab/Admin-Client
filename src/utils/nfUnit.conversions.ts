export const nfUnitConversions = (value: number, unit: string) => {
  switch (unit) {
    case "gm":
      return value * 1000;
    case "mg":
      return value;
    case "mcg":
      return value / 1000;
    case "kg":
        return value * 1000;
    case "lb":
        return value * 453.592;
    case "oz":
        return value * 28.3495;   
    default:
      return undefined;
  }
};

export const unitConversions = (value: number, unit: string) => {
  switch (unit) {
    case "gm":
      return value;
    case "mg":
      return value / 1000;
    case "mcg":
      return value / 1_000_000;
    case "kg":
      return value * 1000;
    case "lb":
      return value * 453.592;
    case "oz":
      return value * 28.3495; 
    default:
      return undefined;
  }
};

export const unitConversion = (value: number, unit: string): number | undefined => {
  switch (unit) {
    case "gm":
      return value;
    case "Kcal":
        return value;    
    case "mg":
      return value / 1000; // mg → g
    case "mcg":
      return value / 1_000_000; // mcg → g
    case "kg":
      return value * 1000; // kg → g
    case "lb":
      return value * 453.592; // lb → g
    case "oz":
      return value * 28.3495; // oz → g
    case "ml":
      return value;
    case "ltr":
      return value * 1000; // L → mL
    case "gal":
      return value * 3785.41; // gal → mL
    case "oz.fl":
      return value * 29.5735; // fl oz → mL
    default:
      return undefined;
  }
};
