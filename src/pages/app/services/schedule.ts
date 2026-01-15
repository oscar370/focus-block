import { api } from "@/api";
import { Schedule } from "@/types";

export async function addSchedule(schedule: Schedule) {
  const response = await api.runtime.sendMessage({
    type: "ADD_SCHEDULE",
    schedule,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "ADD_SCHEDULE_FAILED");
  }

  return response;
}

export async function deleteSchedule(url: string) {
  const response = await api.runtime.sendMessage({
    type: "DELETE_SCHEDULE",
    url,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "DELETE_SCHEDULE_FAILED");
  }

  return response;
}
