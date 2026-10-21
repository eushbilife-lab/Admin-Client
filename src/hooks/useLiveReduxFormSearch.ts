import { useEffect, useRef } from "react";
import { useAppSelector } from "redux/hooks";

/**
 * Auto-submits a redux-form filter form when values change (debounced).
 * Keeps Level 1–4 and similar list filters API-connected without clicking Search.
 */
export default function useLiveReduxFormSearch(
  form: string,
  onSearch: (values: Record<string, any>) => void,
  debounceMs = 350
) {
  const formValues = useAppSelector((state) => state.form?.[form]?.values);
  const primed = useRef(false);
  const lastKey = useRef("");

  useEffect(() => {
    if (!formValues) return;
    // Skip the first hydrate from PersistFilters so we don't double-fetch
    if (!primed.current) {
      primed.current = true;
      lastKey.current = JSON.stringify(formValues);
      return;
    }
    const key = JSON.stringify(formValues);
    if (key === lastKey.current) return;
    const timer = setTimeout(() => {
      lastKey.current = key;
      onSearch(formValues);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [formValues, onSearch, debounceMs]);
}
