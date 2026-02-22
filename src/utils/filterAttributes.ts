export function getUniqueValues<T>(data: T[], key: keyof T): string[] {
  const values = data.map((item) => String(item[key]));

  return Array.from(new Set(values)).sort();
}

export const cleanParams = <T extends Record<string, unknown>>(
  params: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== '' && value !== null && value !== undefined;
    }),
  ) as Partial<T>;
};
