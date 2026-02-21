export function getUniqueValues<T>(data: T[], key: keyof T): string[] {
  const values = data.map((item) => String(item[key]));

  return Array.from(new Set(values)).sort();
}