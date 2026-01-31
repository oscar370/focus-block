import { api } from "@/api";

export async function setPause(time: number) {
  await api.sync({
    pauseUntil: time,
  });
}
