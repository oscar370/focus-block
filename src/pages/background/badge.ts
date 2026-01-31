import { api } from "@/api";

export async function updateBadge() {
  const pomodoro = await api.get("pomodoro", { status: "idle", expiry: null });

  const pomodoroPauseUntil = await api.get("pomodoroPauseUntil", null);

  if (pomodoroPauseUntil && Date.now() < pomodoroPauseUntil) {
    const minutesLeft = Math.ceil((pomodoroPauseUntil - Date.now()) / 60000);
    chrome.action.setBadgeText({ text: minutesLeft.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#F59E0B" });
    return;
  }

  if (!pomodoro || pomodoro.status === "idle" || !pomodoro.expiry) {
    chrome.action.setBadgeText({ text: "" });
    return;
  }

  const minutesLeft = Math.ceil((pomodoro.expiry - Date.now()) / 60000);

  if (minutesLeft <= 0) {
    chrome.action.setBadgeText({ text: "0" });
  } else {
    chrome.action.setBadgeText({ text: minutesLeft.toString() });
  }

  const color = pomodoro.status === "work" ? "#D93025" : "#1E8E3E";
  chrome.action.setBadgeBackgroundColor({ color });
}
