import { api } from "@/api";

export async function setPause(time: number) {
  await api.storage.sync.set({
    pauseUntil: time,
  });
}
