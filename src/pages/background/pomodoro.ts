import { api } from "@/api";
import { PomodoroState } from "@/types";
import { updateBadge } from "./badge";

export async function setPomodoro(pomodoro: PomodoroState) {
  await api.storage.sync.set({
    pomodoro: pomodoro,
  });
  await updateBadge();
}
