const DATE = new Date();

const ids: Set<string> = new Set<string>();

export function genCountableId(count: number, prefix?: string): string {
  const id = [prefix, count, DATE.getMilliseconds()].join(" ").trim();

  if (ids.has(id)) {
    // console.warn(`ID ${id} aready exists in. Retrying with a random count`);
    // console.warn(ids);
    return genCountableId(Math.round(Math.random() * 9999), prefix);
  }

  ids.add(id);
  return id;
}
