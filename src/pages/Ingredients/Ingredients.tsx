import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { ingredientActions } from "redux/slices/ingredient";
import ingredientService from "services/ingredient.service";
import LibraryPanel from "@core/templates/LibraryPanel/LibraryPanel";
import useListQueryParams from "hooks/useListQueryParams";

export default function Ingredients() {
  const dispatch = useAppDispatch();
  const { ingredients, loading, refreshLoader, count, refresh } = useAppSelector(
    (state) => state.ingredient
  );
  const listQuery = useListQueryParams();

  useEffect(() => {
    ingredientService.getAllIngredients(listQuery.filters, dispatch);
  }, [dispatch, refresh, listQuery.filters]);

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
      <LibraryPanel
        wrapPage
        kicker="Labels"
        title="Ingredients"
        subtitle="The ingredient dictionary printed on pack and used to map allergens and intolerance."
        extraColumn="ingredient"
        addLabel="Add ingredient"
        empty="No ingredients yet. Add sugar, milk, wheat, and the rest of the label language."
        rows={ingredients}
        loading={loading}
        refreshLoader={refreshLoader}
        count={count}
        page={listQuery.page}
        pageSize={listQuery.limit}
        searchValue={listQuery.searchInput}
        onSearchChange={listQuery.setSearch}
        statusValue={(listQuery.status as any) || "all"}
        onStatusChange={(id) => listQuery.setStatus(id)}
        searchPlaceholder="Search ingredients…"
        onAdd={() => openEditor()}
        onEdit={(row) => openEditor(row)}
        onPage={listQuery.setPage}
      />
    </>
  );
}
