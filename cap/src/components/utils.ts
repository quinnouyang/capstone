const genId = () => String(Math.random() * 9999);
const DATE = new Date();
const UUID_LEN = 4;

const unextendedIds: Set<string> = new Set<string>();

export function extendId(name?: string, id?: string): string {
  id = id ?? genId().substring(0, UUID_LEN);

  if (unextendedIds.has(id)) {
    console.warn(`extendId: ${id} already exists. Regenerating a full one.`);
    id = genId();
  }

  return [name, DATE.toLocaleTimeString(), id].join(" ");
}
