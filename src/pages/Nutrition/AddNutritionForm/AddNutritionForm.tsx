import { useAppDispatch, useAppSelector } from "redux/hooks";
import nutritionService from "services/nutrition.service";
import { nutritionActions } from "redux/slices/nutrition";
import { Button, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import Input from "@core/basic-components/Input";
import { change, reduxForm } from "redux-form";
import { useEffect, useState } from "react";
import TableWrapper from "@core/templates/TableWrapper";
import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";

const AddNutritionForm = ({ handleSubmit }: any) => {
  const formName = "AddNutritionForm";
  const dispatch = useAppDispatch();
  const { nutritions } = useAppSelector((state) => state.nutrition);
  const [nutrients, setNutrients] = useState<any[]>([]);

  useEffect(() => {
    nutritionService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
    };
  }, [nutritions?.length, dispatch]);

  useEffect(() => {
    if (!nutritions || nutritions?.length === 0) return;
    setNutrients(JSON.parse(JSON.stringify(nutritions)));
  }, [nutritions, dispatch]);

  const addNutrient = () => {
    const next = [{ name: "" }, ...nutrients];
    setNutrients(next);
    dispatch(change(formName, "nutrients", next));
  };

  const removeNutrient = (index: number) => {
    const next = nutrients.filter((_, i) => i !== index);
    setNutrients(next);
    dispatch(change(formName, "nutrients", next));
  };

  const handleNutrientChange = (value: string, index: number) => {
    const next = nutrients.map((nutrient, i) =>
      i === index ? { ...nutrient, name: value } : nutrient
    );
    setNutrients(next);
  };

  return (
    <div>
      <div className="table-toolbar">
        <Button type="button" variant="outlined" onClick={addNutrient}>
          Add nutrient
        </Button>
        <Button variant="contained" onClick={() => handleSubmit(nutrients)}>
          Save library
        </Button>
      </div>
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Nutrient library" sx={adminTableSx}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nutrient</StyledTableCell>
                <StyledTableCellAction>Action</StyledTableCellAction>
              </TableRow>
            </TableHead>
            <TableBody>
              {nutrients.map((item: any, index: number) => (
                <StyledTableRow key={item._id || `new-${index}`}>
                  <StyledTableCell>
                    <Input
                      name={`nutrient-${index}`}
                      label="Name"
                      required
                      value={item.name}
                      onChange={(event: any) =>
                        handleNutrientChange(event.target.value, index)
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCellAction>
                    <Button type="button" color="error" onClick={() => removeNutrient(index)}>
                      Remove
                    </Button>
                  </StyledTableCellAction>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </div>
  );
};

export default reduxForm({ form: "AddNutritionForm" })(AddNutritionForm);
