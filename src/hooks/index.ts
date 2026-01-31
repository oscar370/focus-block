import { api } from "@/api";
import { PomodoroState, Schedule, SyncState } from "@/types";
import { useEffect, useState } from "react";

export function useBlockedSites() {
  const [sites, setSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBlockedSites()
      .then(setSites)
      .catch((err) => setError(err instanceof Error ? err.message : "ERROR"))
      .finally(() => setLoading(false));

    chrome.storage.onChanged.addListener(handleChange);

    return () => chrome.storage.onChanged.removeListener(handleChange);

    async function getBlockedSites() {
      return await api.get("blockedSites", []);
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "local" && changes.blockedSites) {
        setSites(
          (changes.blockedSites.newValue as SyncState["blockedSites"]) ?? [],
        );
      }
    }
  }, []);

  return { sites, loading, error };
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSchedules()
      .then(setSchedules)
      .catch((err) => setError(err instanceof Error ? err.message : "ERROR"))
      .finally(() => setLoading(false));

    chrome.storage.onChanged.addListener(handleChange);

    return () => chrome.storage.onChanged.removeListener(handleChange);

    async function getSchedules() {
      const schedules = await api.get("schedules", []);
      return schedules;
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "local" && changes.schedules) {
        setSchedules(
          (changes.schedules.newValue as SyncState["schedules"]) ?? [],
        );
      }
    }
  }, []);

  return { schedules, loading, error };
}

export function usePause() {
  const [pauseUntil, setPauseUntil] = useState<number | null>(null);

  useEffect(() => {
    getPauseUntil().then(setPauseUntil);

    chrome.storage.onChanged.addListener(handleChange);

    return () => chrome.storage.onChanged.removeListener(handleChange);

    async function getPauseUntil() {
      const pauseUntil = await api.get("pauseUntil", null);
      return pauseUntil;
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "local" && changes.schedules)
        setPauseUntil(
          (changes.pauseUntil.newValue as SyncState["pauseUntil"]) ?? null,
        );
    }
  }, []);

  async function startPause(minutes: number) {
    const time = Date.now() + minutes * 60000;
    const response = await chrome.runtime.sendMessage({
      type: "SET_PAUSE",
      time,
    });

    if (!response?.ok) {
      throw new Error(response?.error ?? "SET_PAUSE_ERROR");
    }

    return response;
  }

  return { pauseUntil, startPause };
}

export function usePomodoro() {
  const [isLoading, setLoading] = useState(true);
  const [pomodoro, setPomodoroState] = useState<PomodoroState>({
    status: "idle",
    expiry: null,
  });
  const [pomodoroPauseUntil, setPomodoroPauseUntil] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getPomodoroState().then((value) => {
      setPomodoroState(value);
      setLoading(false);
    });

    getPause().then(setPomodoroPauseUntil);

    function handleChange(changes: any) {
      if (changes.pomodoro) setPomodoroState(changes.pomodoro.newValue);
      if (changes.pomodoroPauseUntil)
        setPomodoroPauseUntil(changes.pomodoroPauseUntil.newValue);
    }

    chrome.storage.onChanged.addListener(handleChange);

    return () => chrome.storage.onChanged.removeListener(handleChange);

    async function getPomodoroState() {
      return await api.get("pomodoro", { status: "idle", expiry: null });
    }

    async function getPause() {
      return await api.get("pomodoroPauseUntil", null);
    }
  }, []);

  async function startWork() {
    const expiry = Date.now() + 25 * 60000;
    const pomodoro: PomodoroState = { status: "work", expiry };
    await setPomodoro(pomodoro);
    chrome.alarms.create("pomodoroTimer", { delayInMinutes: 25 });
    chrome.alarms.create("badgeTicker", { periodInMinutes: 1 });
  }

  async function stopPomodoro() {
    const pomodoro: PomodoroState = { status: "idle", expiry: null };
    await setPomodoro(pomodoro);
    chrome.alarms.clear("pomodoroTimer");
    chrome.alarms.clear("badgeTicker");
    chrome.alarms.clear("pomodoroResumeTimer");
  }

  async function pausePomodoro(minutes: number = 5) {
    const response = await chrome.runtime.sendMessage({
      type: "PAUSE_POMODORO",
      minutes,
    });

    if (!response?.ok) {
      throw new Error(response?.error ?? "PAUSE_POMODORO_ERROR");
    }

    return response;
  }

  async function resumePomodoro() {
    const response = await chrome.runtime.sendMessage({
      type: "RESUME_POMODORO",
    });

    if (!response?.ok) {
      throw new Error(response?.error ?? "RESUME_POMODORO_ERROR");
    }

    return response;
  }

  return {
    pomodoro,
    isLoading,
    startWork,
    stopPomodoro,
    pausePomodoro,
    resumePomodoro,
    pomodoroPauseUntil,
  };
}

async function setPomodoro(pomodoro: PomodoroState) {
  const response = await chrome.runtime.sendMessage({
    type: "SET_POMODORO",
    pomodoro,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "SET_POMODORO_ERROR");
  }

  return response;
}

export function useDailyPomodoroCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCount()
      .then(setCount)
      .finally(() => setLoading(false));

    chrome.storage.onChanged.addListener(handleChange);

    return () => chrome.storage.onChanged.removeListener(handleChange);

    async function getCount() {
      const today = new Date().toISOString().split("T")[0];
      const pomodoroCount = await api.get("pomodoroCount", {
        date: "",
        count: 0,
      });

      if (pomodoroCount.date !== today) {
        return 0;
      }

      return pomodoroCount.count;
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "local" && changes.pomodoroDaily) {
        const newValue = changes.pomodoroDaily
          .newValue as SyncState["pomodoroCount"];
        const today = new Date().toISOString().split("T")[0];

        if (newValue && newValue.date === today) {
          setCount(newValue.count);
        } else {
          setCount(0);
        }
      }
    }
  }, []);

  return { count, loading };
}
