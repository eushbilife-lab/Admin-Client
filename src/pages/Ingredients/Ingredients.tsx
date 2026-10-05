import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { ingredientActions } from "redux/slices/ingredient";
import ingredientService from "services/ingredient.service";
import LibraryPanel from "@core/templates/LibraryPanel/LibraryPanel";
import CircleLoader from "@core/basic-components/CircleLoader";

export default function Ingredients() {
  const dispatch = useAppDispatch();
  const { ingredients, loading, refreshLoader, filters, count, refresh } = useAppSelector(
    (state) => state.ingredient
  );

  useEffect(() => {
    ingredientService.getAllIngredients(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(ingredientActions.resetPage());
    };
  }, [dispatch]);

  const openEditor = (row?: { _id: string }) => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_INGREDIENT,
        data: {
          id: row?._id,
          data: row,
        },
        width: "520px",
      })
    );
  };

  return (
    <>
      {loading && <CircleLoader />}
      <LibraryPanel
        wrapPage
        kicker="Labels"
        title="Ingredients"
        subtitle="The ingredient dictionary printed on pack and used to map allergens and intolerance."
        addLabel="Add ingredient"
        empty="No ingredients yet. Add sugar, milk, wheat, and the rest of the label language."
        rows={ingredients}
        loading={loading}
        refreshLoader={refreshLoader}
        count={count}
        page={filters.page}
        pageSize={filters.page_size}
        onAdd={() => openEditor()}
        onEdit={(row) => openEditor(row)}
        onPage={(page) => dispatch(ingredientActions.setPage(page))}
      />
    </>
  );
}
