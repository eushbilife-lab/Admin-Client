import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { config } from "config";

export type ListQueryParams = {
  page: number;
  limit: number;
  search: string;
  sort?: string;
};

type Options = {
  defaultLimit?: number;
  debounceMs?: number;
  /** Prefix query keys when multiple lists share a route (e.g. brand_) */
  prefix?: string;
};

/**
 * Keeps list page/limit/search in the URL and exposes a debounced search value
 * suitable for server-side queries. Changing search resets page to 1.
 */
export default function useListQueryParams(options: Options = {}) {
  const {
    defaultLimit = Number(config.PAGE_SIZE) || 10,
    debounceMs = 300,
    prefix = "",
  } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageKey = `${prefix}page`;
  const limitKey = `${prefix}limit`;
  const searchKey = `${prefix}q`;
  const sortKey = `${prefix}sort`;

  const page = Math.max(1, Number(searchParams.get(pageKey) || 1) || 1);
  const limit = Math.max(
    1,
    Number(searchParams.get(limitKey) || defaultLimit) || defaultLimit
  );
  const search = searchParams.get(searchKey) || "";
  const sort = searchParams.get(sortKey) || undefined;

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const skipUrlSync = useRef(false);

  useEffect(() => {
    setSearchInput(search);
    setDebouncedSearch(search);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [searchInput, debounceMs]);

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false;
      return;
    }
    if (debouncedSearch === search) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set(searchKey, debouncedSearch);
    else next.delete(searchKey);
    next.set(pageKey, "1");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, search, searchParams, setSearchParams, searchKey, pageKey]);

  const setPage = useCallback(
    (nextPage: number) => {
      const next = new URLSearchParams(searchParams);
      next.set(pageKey, String(Math.max(1, nextPage)));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, pageKey]
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      const next = new URLSearchParams(searchParams);
      next.set(limitKey, String(Math.max(1, nextLimit)));
      next.set(pageKey, "1");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, limitKey, pageKey]
  );

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const setSort = useCallback(
    (value?: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(sortKey, value);
      else next.delete(sortKey);
      next.set(pageKey, "1");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, sortKey, pageKey]
  );

  const query: ListQueryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch,
      sort,
    }),
    [page, limit, debouncedSearch, sort]
  );

  /** Shape many existing admin services expect */
  const filters = useMemo(
    () => ({
      page,
      page_size: limit,
      name: debouncedSearch || undefined,
      sort,
    }),
    [page, limit, debouncedSearch, sort]
  );

  return {
    query,
    filters,
    page,
    limit,
    search,
    searchInput,
    debouncedSearch,
    sort,
    setPage,
    setLimit,
    setSearch,
    setSort,
  };
}
