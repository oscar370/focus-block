import { api } from "@/api";
import { Schedule, SyncState } from "@/types";

export async function addSchedule(schedule: Schedule) {
  const { schedules = [] } = (await api.storage.sync.get()) as SyncState;

  await api.storage.sync.set({
    schedules: [...schedules, schedule],
  });
}

export async function deleteSchedule(id: string) {
  const { schedules = [] } = (await api.storage.sync.get()) as SyncState;

  const filteredSchedules = schedules.filter((schedule) => schedule.id !== id);

  console.log(id, schedules, filteredSchedules);

  await api.storage.sync.set({
    schedules: [...filteredSchedules],
  });
}
