import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { dynamicActions } from "redux/slices/dynamic";
import dynamicService from "services/dynamic.service";
import PageShell from "@core/templates/PageShell";
import LibraryPanel from "@core/templates/LibraryPanel/LibraryPanel";
import CircleLoader from "@core/basic-components/CircleLoader";
import type { DynamicType } from "redux/slices/dynamic";

export default function Brands() {
  const dispatch = useAppDispatch();
  const refresh = useAppSelector((state) => state.dynamic.refresh);
  const brand = useAppSelector((state) => state.dynamic.brand);
  const manufacturer = useAppSelector((state) => state.dynamic.manufacturer);

  useEffect(() => {
    dynamicService.getAllDynamics("brand", brand.filters, dispatch);
    dynamicService.getAllDynamics("manufacturer", manufacturer.filters, dispatch);
  }, [dispatch, refresh, brand.filters, manufacturer.filters]);

  const openEditor = (type: DynamicType, row?: { _id: string }) => {
    dispatch(
      modalActions.openModal({
        type: type === "brand" ? MODAL.ADD_BRAND : MODAL.ADD_MANUFACTURER,
        data: { type, id: row?._id, data: row },
        width: "520px",
      })
    );
  };

  return (
    <PageShell
      kicker="Catalog"
      title="Brands & makers"
      subtitle="Brand and manufacturer names the app uses in search, filters, and the store shelf."
    >
      {(brand.loading || manufacturer.loading) && <CircleLoader />}
      <LibraryPanel
        heading="Brands"
        blurb="What households search for: SACA Farms, Gulf Dairy, Oasis Snacks."
        addLabel="Add brand"
        empty="No brands yet."
        rows={brand.dynamics}
        loading={brand.loading}
        refreshLoader={brand.loading}
        count={brand.count}
        page={brand.filters.page}
        pageSize={brand.filters.page_size}
        onAdd={() => openEditor("brand")}
        onEdit={(row) => openEditor("brand", row)}
        onPage={(page) => dispatch(dynamicActions.setPage({ type: "brand", page }))}
      />
      <LibraryPanel
        heading="Manufacturers"
        blurb="The packing company behind the barcode, used for recalls and label QA."
        addLabel="Add manufacturer"
        empty="No manufacturers yet."
        rows={manufacturer.dynamics}
        loading={manufacturer.loading}
        refreshLoader={manufacturer.loading}
        count={manufacturer.count}
        page={manufacturer.filters.page}
        pageSize={manufacturer.filters.page_size}
        onAdd={() => openEditor("manufacturer")}
        onEdit={(row) => openEditor("manufacturer", row)}
        onPage={(page) => dispatch(dynamicActions.setPage({ type: "manufacturer", page }))}
      />
    </PageShell>
  );
}
