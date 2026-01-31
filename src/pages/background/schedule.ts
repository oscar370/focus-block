import { api } from "@/api";
import { Schedule } from "@/types";

export async function addSchedule(schedule: Schedule) {
  const schedules = await api.get("schedules", []);

  await api.sync({
    schedules: [...schedules, schedule],
  });
}

export async function deleteSchedule(id: string) {
  const schedules = await api.get("schedules", []);
  const filteredSchedules = schedules.filter((schedule) => schedule.id !== id);

  await api.sync({
    schedules: [...filteredSchedules],
  });
}
