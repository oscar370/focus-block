import { api } from "@/api";
import { PomodoroState } from "@/types";

export async function setPomodoroPrePause(
  pomodoroPrePause: PomodoroState | null,
) {
  await api.storage.sync.set({
    pomodoroPrePause,
  });
}

export async function setPomodoroPauseUntil(time: number | null) {
  await api.storage.sync.set({
    pomodoroPauseUntil: time,
  });
}

export async function pausePomodoro(minutes: number = 5) {
  const { pomodoro } = (await api.storage.sync.get("pomodoro")) as {
    pomodoro: PomodoroState;
  };

  if (!pomodoro || pomodoro.status === "idle") {
    throw new Error("No active Pomodoro to pause");
  }

  // Store the current Pomodoro state to restore later
  await setPomodoroPrePause(pomodoro);

  // Set pause duration
  const pauseUntil = Date.now() + minutes * 60000;
  await setPomodoroPauseUntil(pauseUntil);

  // Clear the current Pomodoro state
  await api.storage.sync.set({
    pomodoro: { status: "idle", expiry: null },
  });

  // Clear Pomodoro timers
  api.alarms.clear("pomodoroTimer");
  api.alarms.clear("badgeTicker");

  // Create alarm for pause end
  api.alarms.create("pomodoroResumeTimer", { delayInMinutes: minutes });
}

export async function resumePomodoro() {
  const { pomodoroPrePause } = (await api.storage.sync.get(
    "pomodoroPrePause",
  )) as { pomodoroPrePause: PomodoroState | null };

  if (!pomodoroPrePause || pomodoroPrePause.status === "idle") {
    throw new Error("No paused Pomodoro to resume");
  }

  // Restore the Pomodoro state
  await api.storage.sync.set({
    pomodoro: pomodoroPrePause,
    pomodoroPrePause: null,
    pomodoroPauseUntil: null,
  });

  // Restart the appropriate timer based on remaining time
  const remainingMinutes = Math.ceil(
    (pomodoroPrePause.expiry! - Date.now()) / 60000,
  );

  if (remainingMinutes > 0) {
    api.alarms.create("pomodoroTimer", { delayInMinutes: remainingMinutes });
    api.alarms.create("badgeTicker", { periodInMinutes: 1 });
  }

  api.alarms.clear("pomodoroResumeTimer");
}
