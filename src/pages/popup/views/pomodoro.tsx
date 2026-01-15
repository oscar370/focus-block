import { usePomodoro } from "@/hooks";
import { useEffect, useState } from "react";

export default function Pomodoro() {
  const { pomodoro, startWork, stopPomodoro } = usePomodoro();
  const [timeLeft, setTimeLeft] = useState("");

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

  return (
    <>
      <header>
        <h2>Focus Block</h2>
      </header>

      <article>
        {pomodoro.status === "idle" ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-base! mb-0! font-normal!"> Start pomodoro </h2>

            <button className="w-full" onClick={startWork}>
              Start
            </button>
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

            <button onClick={stopPomodoro} className="secondary w-full">
              Cancel
            </button>
          </div>
        )}
      </article>
    </>
  );
}
