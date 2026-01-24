import { api } from "@/api";

export async function pausePomodoroService(minutes: number = 5) {
  const response = await api.runtime.sendMessage({
    type: "PAUSE_POMODORO",
    minutes,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "PAUSE_POMODORO_FAILED");
  }

  return response;
}

export async function resumePomodoroService() {
  const response = await api.runtime.sendMessage({
    type: "RESUME_POMODORO",
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "RESUME_POMODORO_FAILED");
  }

  return response;
}
