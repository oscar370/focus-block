import { SyncState } from "@/types";

export const api = {
  sync: async function (partial: Partial<SyncState>) {
    await chrome.storage.local.set(partial);
    await chrome.storage.sync.set(partial);
  },

  get: async function <K extends keyof SyncState>(
    key: K,
    fallback: SyncState[K],
  ): Promise<SyncState[K]> {
    const result = (await chrome.storage.local.get({
      [key]: fallback,
    })) as SyncState;
    return result[key];
  },
};
