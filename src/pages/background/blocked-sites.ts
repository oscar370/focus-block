import { api } from "@/api";
import { SyncState } from "@/types";

export async function addBlockedSite(url: string) {
  const { blockedSites = [] } = (await api.storage.sync.get()) as SyncState;

  if (blockedSites.includes(url)) {
    throw new Error("Duplicate site");
  }

  await api.storage.sync.set({
    blockedSites: [...blockedSites, url],
  });
}

export async function deleteBlockedSite(url: string) {
  const { blockedSites = [] } = (await api.storage.sync.get()) as SyncState;

  const filteredSites = blockedSites.filter((site) => site !== url);

  await api.storage.sync.set({
    blockedSites: [...filteredSites],
  });
}
