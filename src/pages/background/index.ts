import { api } from "@/api";
import { PomodoroState, SyncState } from "@/types";
import { updateBadge } from "./badge";
import { addBlockedSite, deleteBlockedSite } from "./blocked-sites";
import { notify } from "./notify";
import { setPause } from "./pause";
import { setPomodoro } from "./pomodoro";
import { incrementPomodoroCount } from "./pomodoro-counter";
import { pausePomodoro, resumePomodoro } from "./pomodoro-pause";
import { addSchedule, deleteSchedule } from "./schedule";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "ADD_BLOCKED_SITE": {
      addBlockedSite(message.url)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "DELETE_BLOCKED_SITE": {
      deleteBlockedSite(message.url)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "ADD_SCHEDULE": {
      addSchedule(message.schedule)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "DELETE_SCHEDULE": {
      deleteSchedule(message.id)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "SET_PAUSE": {
      setPause(message.time)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "SET_POMODORO": {
      setPomodoro(message.pomodoro)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "PAUSE_POMODORO": {
      pausePomodoro(message.minutes ?? 5)
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }

    case "RESUME_POMODORO": {
      resumePomodoro()
        .then(() => sendResponse({ ok: true }))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          }),
        );

      return true;
    }
  }
});

api.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "pomodoroTimer") {
    try {
      const { pomodoro } = (await api.storage.sync.get(
        "pomodoro",
      )) as SyncState;
      if (!pomodoro || pomodoro.status === "idle") return;

      let nextState: PomodoroState;

      if (pomodoro.status === "work") {
        nextState = {
          status: "break",
          expiry: Date.now() + 5 * 60000,
        };
        notify("break", "Time for a break!", "Good work. You have 5 minutes.");
        api.alarms.create("pomodoroTimer", { delayInMinutes: 5 });
        // Increment counter when work session completes
        await incrementPomodoroCount();
      } else {
        nextState = { status: "idle", expiry: null };
        notify(
          "break-over",
          "Break over",
          "Return to work or start a new cycle.",
        );
      }

      await setPomodoro(nextState);
      await updateBadge();
    } catch (error) {
      console.error(`A problem occurred with the pomodoro alarm: ${error}`);
    }
  }

  if (alarm.name === "badgeTicker") {
    try {
      await updateBadge();
    } catch (error) {
      console.error(`A problem occurred with the badge alarm: ${error}`);
    }
  }

  if (alarm.name === "pomodoroResumeTimer") {
    try {
      await resumePomodoro();
      await updateBadge();
    } catch (error) {
      console.error(
        `A problem occurred with the Pomodoro resume alarm: ${error}`,
      );
    }
  }
});

api.notifications.onButtonClicked.addListener(
  async (notificationId, buttonIndex) => {
    if (notificationId === "break-over" && buttonIndex === 0) {
      await startNextPomodoro(notificationId);
    }
  },
);

api.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId === "break-over") {
    await startNextPomodoro(notificationId);
  }
});

async function startNextPomodoro(notificationId: string) {
  const minutes = 25;
  const expiry = Date.now() + minutes * 60000;

  await setPomodoro({ status: "work", expiry });

  api.alarms.create("pomodoroTimer", { delayInMinutes: minutes });
  api.alarms.create("badgeTicker", { periodInMinutes: 1 });
  api.notifications.clear(notificationId);
}
