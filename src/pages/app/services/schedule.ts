import { Schedule } from "@/types";

export async function addSchedule(schedule: Schedule) {
  const response = await chrome.runtime.sendMessage({
    type: "ADD_SCHEDULE",
    schedule,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "ADD_SCHEDULE_FAILED");
  }

  return response;
}

export async function deleteSchedule(id: string) {
  const response = await chrome.runtime.sendMessage({
    type: "DELETE_SCHEDULE",
    id,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "DELETE_SCHEDULE_FAILED");
  }

  return response;
}
