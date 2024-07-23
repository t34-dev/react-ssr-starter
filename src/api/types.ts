/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiError {}

export function filterRequestParams<T extends Record<string, any>>(
  params: T,
): Partial<T> {
  return Object.keys(params).reduce((filtered: Partial<T>, key: string) => {
    if (params[key] !== undefined && params[key] !== null) {
      filtered[key as keyof T] = params[key];
    }
    return filtered;
  }, {} as Partial<T>);
}

// Helper function to build query string
export function buildQueryString(params: Record<string, any>): string {
  const queryEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  const queryString = queryEntries
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
  return queryString ? `?${queryString}` : '';
}
