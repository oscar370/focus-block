import { api } from "@/api";
import { useBlockedSites, usePause, usePomodoro, useSchedules } from "@/hooks";
import { shouldBlock } from "@/utils/block-logic";
import { useEffect, useState } from "react";
import { addBlockedSite, deleteBlockedSite } from "../services";

export function Site() {
  const { sites } = useBlockedSites();
  const { schedules } = useSchedules();
  const [currentHost, setCurrentHost] = useState("");
  const { pauseUntil, startPause } = usePause();
  const [timeLeft, setTimeLeft] = useState(0);
  const isPaused = pauseUntil && Date.now() < pauseUntil;
  const [isCurrentlyBlocked, setIsCurrentlyBlocked] = useState(false);
  const { pomodoro } = usePomodoro();

  useEffect(() => {
    api.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const url = new URL(tabs[0].url || "");
      setCurrentHost(url.hostname);
    });
  }, []);

  useEffect(() => {
    if (!isPaused) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.round((pauseUntil - Date.now()) / 1000 / 60),
      );
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, pauseUntil]);

  useEffect(() => {
    if (currentHost) {
      setIsCurrentlyBlocked(
        shouldBlock(currentHost, sites, schedules, pauseUntil, pomodoro),
      );
    }
  }, [currentHost, sites, schedules, pauseUntil, pomodoro]);

  async function toggleCurrentSite() {
    const isInList = sites.includes(currentHost);

    if (!isInList) {
      await addBlockedSite(currentHost);
      return;
    }

    await deleteBlockedSite(currentHost);
  }

  function openOptions() {
    api.tabs.create({
      url: api.runtime.getURL("src/pages/app/index.html"),
    });
  }

  return (
    <>
      <header>
        <h2>Focus Block</h2>
      </header>

      <article>
        <div className="mb-2">
          <h3 className="text-base! flex gap-2 mb-0! font-normal!">
            Current site:
            <span className="font-bold mb-0! break-all">{currentHost}</span>
          </h3>
        </div>

        <button
          className={`w-full ${sites.includes(currentHost) ? "secondary" : ""}`}
          onClick={toggleCurrentSite}
        >
          {sites.includes(currentHost) ? "Remove from list" : "Block this site"}
        </button>
      </article>

      <section>
        {isPaused ? (
          <article className="text-center">
            <small> Paused lockout </small>
            <p>
              There are <strong>{timeLeft} min left</strong>
            </p>
          </article>
        ) : (
          <button
            className="contrast outline"
            onClick={() => startPause(5)}
            disabled={pomodoro.status === "work" || !isCurrentlyBlocked}
          >
            Take a 5-minute break
          </button>
        )}
      </section>

      <div className="mb-3">
        <button className="outline" onClick={openOptions}>
          Settings
        </button>
      </div>

      <footer>
        <div className="text-center">
          <small>{schedules.length} configured schedule(s) </small>
        </div>
      </footer>
    </>
  );
}
