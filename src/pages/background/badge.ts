import { api } from "@/api";
import { SyncState } from "@/types";

export async function updateBadge() {
  const { pomodoro = { status: "idle", expiry: null } } =
    (await api.storage.sync.get("pomodoro")) as SyncState;
  console.log("Desde badge: ", pomodoro);

  if (!pomodoro || pomodoro.status === "idle" || !pomodoro.expiry) {
    api.action.setBadgeText({ text: "" });
    return;
  }

  const minutesLeft = Math.ceil((pomodoro.expiry - Date.now()) / 60000);

  if (minutesLeft <= 0) {
    api.action.setBadgeText({ text: "0" });
  } else {
    api.action.setBadgeText({ text: minutesLeft.toString() });
  }

  const color = pomodoro.status === "work" ? "#D93025" : "#1E8E3E";
  api.action.setBadgeBackgroundColor({ color });
}
