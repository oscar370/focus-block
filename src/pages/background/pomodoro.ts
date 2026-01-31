import { api } from "@/api";
import { PomodoroState } from "@/types";
import { updateBadge } from "./badge";

export async function setPomodoro(pomodoro: PomodoroState) {
  await api.sync({
    pomodoro: pomodoro,
  });
  await updateBadge();
}

function getLocalDayKey() {
  return new Date().toLocaleDateString("sv-SE", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

export async function incrementPomodoroCount() {
  const currentDate = getLocalDayKey();
  const pomodoroCount = await api.get("pomodoroCount", { date: "", count: 0 });

  if (pomodoroCount.date !== currentDate) {
    await api.sync({ pomodoroCount: { date: currentDate, count: 1 } });
    return;
  }

  const updatedCount = {
    date: currentDate,
    count: pomodoroCount.count + 1,
  };

  await api.sync({ pomodoroCount: updatedCount });
}

export async function getDailyCount() {
  const currentDate = getLocalDayKey();
  const pomodoroCount = await api.get("pomodoroCount", { date: "", count: 0 });

  if (pomodoroCount.date !== currentDate) {
    return 0;
  }

  return pomodoroCount.count;
}

export async function setPomodoroPrePause(
  pomodoroPrePause: PomodoroState | null,
) {
  await api.sync({
    pomodoroPrePause,
  });
}

export async function setPomodoroPauseUntil(time: number | null) {
  await api.sync({
    pomodoroPauseUntil: time,
  });
}

export async function pausePomodoro(minutes: number = 5) {
  const pomodoro = await api.get("pomodoro", {
    status: "idle",
    expiry: null,
  });

  if (pomodoro.status === "idle") {
    throw new Error("No active Pomodoro to pause");
  }

  await setPomodoroPrePause(pomodoro);

  const pauseUntil = Date.now() + minutes * 60000;
  await setPomodoroPauseUntil(pauseUntil);

  await api.sync({
    pomodoro: { status: "idle", expiry: null },
  });

  chrome.alarms.clear("pomodoroTimer");
  chrome.alarms.clear("badgeTicker");

  chrome.alarms.create("pomodoroResumeTimer", { delayInMinutes: minutes });
}

export async function resumePomodoro() {
  const pomodoroPrePause = await api.get("pomodoroPrePause", null);

  if (!pomodoroPrePause || pomodoroPrePause.status === "idle") {
    throw new Error("No paused Pomodoro to resume");
  }

  await api.sync({
    pomodoro: pomodoroPrePause,
    pomodoroPrePause: null,
    pomodoroPauseUntil: null,
  });

  const remainingMinutes = Math.ceil(
    (pomodoroPrePause.expiry! - Date.now()) / 60000,
  );

  if (remainingMinutes > 0) {
    chrome.alarms.create("pomodoroTimer", { delayInMinutes: remainingMinutes });
    chrome.alarms.create("badgeTicker", { periodInMinutes: 1 });
  }

  chrome.alarms.clear("pomodoroResumeTimer");
}
