import { api } from "@/api";

export async function addBlockedSite(url: string) {
  const blockedSites = await api.get("blockedSites", []);

  if (blockedSites.includes(url)) {
    throw new Error("Duplicate site");
  }

  await api.sync({
    blockedSites: [...blockedSites, url],
  });
}

export async function deleteBlockedSite(url: string) {
  const blockedSites = await api.get("blockedSites", []);

  const filteredSites = blockedSites.filter((site) => site !== url);

  await api.sync({
    blockedSites: [...filteredSites],
  });
}
