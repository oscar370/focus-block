import { api } from "@/api";

interface DailyCount {
  date: string;
  count: number;
}

function getDateKey(): string {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function incrementPomodoroCount(): Promise<number> {
  const dateKey = getDateKey();
  const storageKey = "pomodoroDaily";

  const data = (await api.storage.local.get(storageKey)) as Record<
    string,
    DailyCount
  >;
  const dailyCount = data[storageKey] as DailyCount | undefined;

  // Check if we need to reset for a new day
  if (!dailyCount || dailyCount.date !== dateKey) {
    // New day, reset counter
    const newCount: DailyCount = { date: dateKey, count: 1 };
    await api.storage.local.set({ [storageKey]: newCount });
    return 1;
  }

  // Same day, increment
  const updatedCount: DailyCount = {
    date: dateKey,
    count: dailyCount.count + 1,
  };
  await api.storage.local.set({ [storageKey]: updatedCount });
  return updatedCount.count;
}

export async function getDailyCount(): Promise<number> {
  const dateKey = getDateKey();
  const storageKey = "pomodoroDaily";

  const data = (await api.storage.local.get(storageKey)) as Record<
    string,
    DailyCount
  >;
  const dailyCount = data[storageKey] as DailyCount | undefined;

  if (!dailyCount || dailyCount.date !== dateKey) {
    return 0;
  }

  return dailyCount.count;
}
