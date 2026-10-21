import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { dynamicActions } from "redux/slices/dynamic";
import dynamicService from "services/dynamic.service";
import PageShell from "@core/templates/PageShell";
import LibraryPanel from "@core/templates/LibraryPanel/LibraryPanel";
import type { DynamicType } from "redux/slices/dynamic";
import useListQueryParams from "hooks/useListQueryParams";

export default function Brands() {
  const dispatch = useAppDispatch();
  const refresh = useAppSelector((state) => state.dynamic.refresh);
  const brand = useAppSelector((state) => state.dynamic.brand);
  const manufacturer = useAppSelector((state) => state.dynamic.manufacturer);
  const brandQuery = useListQueryParams({ prefix: "b_" });
  const makerQuery = useListQueryParams({ prefix: "m_" });

  useEffect(() => {
    dynamicService.getAllDynamics("brand", brandQuery.filters, dispatch);
  }, [dispatch, refresh, brandQuery.filters]);

  useEffect(() => {
    dynamicService.getAllDynamics("manufacturer", makerQuery.filters, dispatch);
  }, [dispatch, refresh, makerQuery.filters]);

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
      <LibraryPanel
        heading="Brands"
        blurb="What households search for: Eushbi Farms, Gulf Dairy, Oasis Snacks."
        addLabel="Add brand"
        empty="No brands yet."
        rows={brand.dynamics}
        loading={brand.loading}
        refreshLoader={brand.loading}
        count={brand.count}
        page={brandQuery.page}
        pageSize={brandQuery.limit}
        searchValue={brandQuery.searchInput}
        onSearchChange={brandQuery.setSearch}
        statusValue={(brandQuery.status as any) || "all"}
        onStatusChange={(id) => brandQuery.setStatus(id)}
        searchPlaceholder="Search brands…"
        onAdd={() => openEditor("brand")}
        onEdit={(row) => openEditor("brand", row)}
        onPage={brandQuery.setPage}
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
        page={makerQuery.page}
        pageSize={makerQuery.limit}
        searchValue={makerQuery.searchInput}
        onSearchChange={makerQuery.setSearch}
        statusValue={(makerQuery.status as any) || "all"}
        onStatusChange={(id) => makerQuery.setStatus(id)}
        searchPlaceholder="Search manufacturers…"
        onAdd={() => openEditor("manufacturer")}
        onEdit={(row) => openEditor("manufacturer", row)}
        onPage={makerQuery.setPage}
      />
    </PageShell>
  );
}
