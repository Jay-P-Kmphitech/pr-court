const store = new Map<string, unknown>();

export const cache = {
  get: <T>(key: string) => store.get(key) as T | undefined,
  set: (key: string, value: unknown) => void store.set(key, value),
  clear: () => store.clear(),
};
