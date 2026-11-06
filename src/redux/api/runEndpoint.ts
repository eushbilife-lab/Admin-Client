import type { AppDispatch } from "redux/store";
import { getAppDispatch } from "utils/dispatch.util";

/** Resolve app dispatch (supports thunks / RTK Query initiate). */
export function resolveDispatch(dispatch?: AppDispatch | unknown): AppDispatch | undefined {
  return (dispatch as AppDispatch | undefined) || getAppDispatch();
}

/**
 * Run an RTK Query endpoint via initiate and return a Promisable-compatible
 * `[success, error, result?]` tuple so existing call sites keep working.
 */
export async function runEndpoint<T>(
  dispatch: AppDispatch | unknown | undefined,
  initiate: (arg: any, options?: any) => any,
  arg?: unknown,
  options?: { forceRefetch?: boolean }
): Promise<[any, any, T?]> {
  const d = resolveDispatch(dispatch);
  if (!d) return [null, new Error("Store not ready")];
  try {
    const result = (await d(
      initiate(arg, options?.forceRefetch ? { forceRefetch: true } : undefined)
    ).unwrap()) as T;
    return [{ data: { data: result } }, null, result];
  } catch (error) {
    return [null, error];
  }
}
