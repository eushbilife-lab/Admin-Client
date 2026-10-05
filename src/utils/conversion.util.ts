export type ConversionTable = {
  [key: string]: (value: number) => number;
};

export const conversionTable = (NF_per_serving: number, uom: string, rda_uom: string) => {

  // Define conversion functions based on unit of measure
  const conversions: ConversionTable = {
    'mg-gm': (value: number) => value * 0.001,  // convert mg to gm
    'gm-mg': (value: number) => value * 1000,   // convert gm to mg
    'cal-KCal': (value: number) => value * 0.001, // convert cal to KCal
    'KCal-cal': (value: number) => value * 1000,  // convert KCal to cal
  };

  // Determine conversion key
  const conversionKey = `${uom}-${rda_uom}`;
  
  // Check if conversion exists
  if (conversions[conversionKey]) {
    return conversions[conversionKey](NF_per_serving);
  }

  return NF_per_serving;
};
