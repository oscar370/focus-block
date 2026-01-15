import { Days, PomodoroState, Schedule } from "@/types";

const dayKeyMap: Record<number, keyof Days> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

function getMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function shouldBlock(
  currentUrl: string,
  blockedSites: string[],
  schedules: Schedule[],
  pauseUntil: number | null,
  pomodoro: PomodoroState,
): boolean {
  const isSiteListed = blockedSites.some((site) =>
    currentUrl.toLowerCase().includes(site.toLowerCase()),
  );
  if (!isSiteListed) return false;

  if (pomodoro.status === "work") return true;
  if (pomodoro.status === "break") return false;

  if (pauseUntil && Date.now() < pauseUntil) {
    return false;
  }

  if (schedules.length === 0) return false;

  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDayKey = dayKeyMap[currentDayIndex];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isWithinSchedule = schedules.some((schedule) => {
    if (!schedule.days[currentDayKey]) return false;

    const start = getMinutes(schedule.startTime);
    const end = getMinutes(schedule.endTime);

    if (start < end) {
      return currentMinutes >= start && currentMinutes < end;
    }

    return currentMinutes >= start || currentMinutes < end;
  });

  return isWithinSchedule;
}
