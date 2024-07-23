export function parseBoolean(str?: string): boolean {
  return (str || '').trim().toLowerCase() === 'true';
}
