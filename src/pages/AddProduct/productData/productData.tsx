export const formattedNF = (nf: any) =>
  nf?.map((item: any) => ({
    nutritionId: item.nutritionId?.value || "",
    perServing: item.perServing || 0,
    uom: item.uom?.value || "",
    nFDv: item.nFDv || "",
    rda_id: item.rda_id || "",
    dv: item.dv || 0,
  }));

export const FormattedNF = (nf: any) =>
  nf?.map((item: any) => ({
    nutritionId: item.nutritionId?.value || "",
    perServing: item.perServing || 0,
    uom: item.uom ? { _id: item.uom.value, sign: item.uom.label } : "",
    nFDv: item.nFDv || "",
    rda_id: item.rda_id || "",
    dv: item.dv || "",
  }));


  
