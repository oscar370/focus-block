import { api } from "@/api";

export async function addBlockedSite(url: string) {
  const response = await api.runtime.sendMessage({
    type: "ADD_BLOCKED_SITE",
    url,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "ADD_BLOCKED_SITE_FAILED");
  }

  return response;
}

export async function deleteBlockedSite(url: string) {
  const response = await api.runtime.sendMessage({
    type: "DELETE_BLOCKED_SITE",
    url,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "DELETE_BLOCKED_SITE_FAILED");
  }

  return response;
}
