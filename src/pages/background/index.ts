import { api } from "@/api";
import { PomodoroState } from "@/types";
import { updateBadge } from "./badge";
import { addBlockedSite, deleteBlockedSite } from "./blocked-sites";
import { notify } from "./notify";
import { setPause } from "./pause";
import {
  incrementPomodoroCount,
  pausePomodoro,
  resumePomodoro,
  setPomodoro,
} from "./pomodoro";
import { addSchedule, deleteSchedule } from "./schedule";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ADD_BLOCKED_SITE") {
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

  if (message.type === "DELETE_BLOCKED_SITE") {
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

  if (message.type === "ADD_SCHEDULE") {
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

  if (message.type === "DELETE_SCHEDULE") {
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

  if (message.type === "SET_PAUSE") {
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

  if (message.type === "SET_POMODORO") {
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

  if (message.type === "PAUSE_POMODORO") {
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

  if (message.type === "RESUME_POMODORO") {
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
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "pomodoroTimer") {
    try {
      const pomodoro = await api.get("pomodoro", {
        status: "idle",
        expiry: null,
      });

      if (pomodoro.status === "idle") return;

      let nextState: PomodoroState;

      if (pomodoro.status === "work") {
        nextState = {
          status: "break",
          expiry: Date.now() + 5 * 60000,
        };

        notify("break", "Time for a break!", "Good work. You have 5 minutes.");
        chrome.alarms.create("pomodoroTimer", { delayInMinutes: 5 });

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

chrome.notifications.onButtonClicked.addListener(
  async (notificationId, buttonIndex) => {
    if (notificationId === "break-over" && buttonIndex === 0) {
      await startNextPomodoro(notificationId);
    }
  },
);

chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId === "break-over") {
    await startNextPomodoro(notificationId);
  }
});

async function startNextPomodoro(notificationId: string) {
  const minutes = 25;
  const expiry = Date.now() + minutes * 60000;

  await setPomodoro({ status: "work", expiry });

  chrome.alarms.create("pomodoroTimer", { delayInMinutes: minutes });
  chrome.alarms.create("badgeTicker", { periodInMinutes: 1 });
  chrome.notifications.clear(notificationId);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;

  const patch: Record<string, unknown> = {};

  for (const key in changes) {
    patch[key] = changes[key].newValue;
  }

  if (Object.keys(patch).length > 0) {
    chrome.storage.local.set(patch);
  }
});
