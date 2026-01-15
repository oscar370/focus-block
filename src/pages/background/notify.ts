import { api } from "@/api";

export function notify(id: string, title: string, message: string) {
  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  const options: chrome.notifications.NotificationCreateOptions = {
    type: "basic",
    iconUrl: "icon-128.png",
    title,
    message,
    priority: 2,
  };

  if (id === "break-over" && !isFirefox) {
    options.buttons = [{ title: "Start the next pomodoro" }];
  }

  api.notifications.create(id, options);
}
