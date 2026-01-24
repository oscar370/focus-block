import { useBlockedSites, usePause, usePomodoro, useSchedules } from "@/hooks";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { shouldBlock } from "../../utils/block-logic";
import { BlockOverlay } from "./components/block-overlay";
import { stopMedia } from "./utils/stop-media";

const div = document.createElement("div");
div.id = "__root_extension_focus_block";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root_extension_focus_block");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);

root.render(
  <StrictMode>
    <ContentApp />
  </StrictMode>,
);

try {
  console.log("Focus Block logic loaded");
} catch (e) {
  console.error(e);
}

function ContentApp() {
  const { sites, loading: loadingSites } = useBlockedSites();
  const { schedules, loading: loadingSchedules } = useSchedules();
  const { pauseUntil } = usePause();
  const [isBlocked, setIsBlocked] = useState(false);
  const { pomodoro, pomodoroPauseUntil } = usePomodoro();

  useEffect(() => {
    if (loadingSites || loadingSchedules) return;

    check();

    const interval = setInterval(check, 60000);

    function check() {
      const blocked = shouldBlock(
        window.location.hostname,
        sites,
        schedules,
        pauseUntil,
        pomodoro,
        pomodoroPauseUntil,
      );

      setIsBlocked(blocked);

      if (blocked) {
        document.body.style.overflow = "hidden";
        stopMedia();
      } else {
        document.body.style.overflow = "";
      }
    }

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [sites, schedules, pauseUntil, loadingSites, loadingSchedules, pomodoro]);

  if (!isBlocked) return null;

  return <BlockOverlay />;
}
