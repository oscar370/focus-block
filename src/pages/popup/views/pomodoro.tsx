import { useDailyPomodoroCount, usePomodoro } from "@/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  pausePomodoroService,
  resumePomodoroService,
} from "../services/pomodoro";

export default function Pomodoro() {
  const { pomodoro, startWork, stopPomodoro, pomodoroPauseUntil } =
    usePomodoro();
  const { count } = useDailyPomodoroCount();
  const [timeLeft, setTimeLeft] = useState("");
  const [pauseTimeLeft, setPauseTimeLeft] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pomodoro.expiry) return;

      const diff = pomodoro.expiry - Date.now();
      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoro.expiry]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pomodoroPauseUntil) {
        setIsPaused(false);
        setPauseTimeLeft("");
        return;
      }

      const diff = pomodoroPauseUntil - Date.now();
      if (diff <= 0) {
        setPauseTimeLeft("");
        setIsPaused(false);
        return;
      }

      setIsPaused(true);
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setPauseTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroPauseUntil]);

  const handlePause = async () => {
    try {
      await pausePomodoroService(5);
      toast.success("Pomodoro paused");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to pause Pomodoro",
      );
    }
  };

  const handleResume = async () => {
    try {
      await resumePomodoroService();
      toast.success("Pomodoro resumed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resume Pomodoro",
      );
    }
  };

  return (
    <>
      <header>
        <h2>Focus Block</h2>
      </header>

      <article>
        {pomodoro.status === "idle" && !isPaused ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-base! mb-0! font-normal!"> Start pomodoro </h2>

            <button className="w-full" onClick={startWork}>
              Start
            </button>
          </div>
        ) : isPaused ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-600">
              Paused
            </span>

            <h2 className="text-5xl! m-0! font-mono">{pauseTimeLeft}</h2>

            <div className="flex w-full">
              <button onClick={handleResume} className="flex-1">
                Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                pomodoro.status === "work"
                  ? "bg-red-500/20 text-red-500"
                  : "bg-green-500/20 text-green-500"
              }`}
            >
              {pomodoro.status === "work" ? "Work" : "Break"}
            </span>

            <h2 className="text-5xl! m-0! font-mono">{timeLeft}</h2>

            <div className="flex gap-2 w-full">
              <button onClick={handlePause} className="flex-1">
                Pause
              </button>

              <button onClick={stopPomodoro} className="secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        )}
      </article>

      <footer className="text-center text-sm py-2">
        <span>
          {count} pomodoro{count !== 1 ? "s" : ""} today
        </span>
      </footer>
    </>
  );
}
