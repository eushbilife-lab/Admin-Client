/** Standard API envelope returned by Admin backend. */
export type ApiEnvelope<T = unknown> = {
  data: T;
  message?: string;
  code?: number;
};

export type ListQueryArgs = Record<string, unknown>;

export type Paginated<TKey extends string, TItem> = {
  [K in TKey]: TItem[];
} & {
  totalCount: number;
};

/** Unwrap `response.data` from the Axios envelope already returned by baseQuery. */
export function unwrapData<T>(response: unknown): T {
  const envelope = response as ApiEnvelope<T>;
  return envelope?.data as T;
}
