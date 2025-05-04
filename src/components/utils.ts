const ids: Set<string> = new Set<string>();

function genUuid(len = 4) {
  return self.crypto.randomUUID().slice(0, len + 1);
}

export function genId(idx: number, name: string, suffix?: string): string {
  const id = [name, idx, suffix].join(" ").trim();

  if (ids.has(id)) {
    console.warn(`ID ${id} aready exists. Retrying with a random suffix`);
    return genId(idx, name, genUuid());
  }

  ids.add(id);
  return id;
}

export function formatTimestamp(seconds: number): string {
  return `${Math.floor(Number(seconds / 60))}:${Math.ceil(seconds % 60)}`;
}
