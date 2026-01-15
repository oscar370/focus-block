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

    api.storage.onChanged.addListener(handleChange);

    return () => api.storage.onChanged.removeListener(handleChange);

    async function getBlockedSites() {
      const { blockedSites = [] } = (await api.storage.sync.get(
        "blockedSites",
      )) as SyncState;
      return blockedSites;
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "sync" && changes.blockedSites) {
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

    api.storage.onChanged.addListener(handleChange);

    return () => api.storage.onChanged.removeListener(handleChange);

    async function getSchedules() {
      const { schedules = [] } = (await api.storage.sync.get(
        "schedules",
      )) as SyncState;
      return schedules;
    }

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) {
      if (area === "sync" && changes.schedules) {
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

    api.storage.onChanged.addListener(handleChange);

    return () => api.storage.onChanged.removeListener(handleChange);

    async function getPauseUntil() {
      const { pauseUntil } = (await api.storage.sync.get(
        "pauseUntil",
      )) as SyncState;
      return pauseUntil;
    }

    function handleChange(changes: any) {
      if (changes.pauseUntil) setPauseUntil(changes.pauseUntil.newValue);
    }
  }, []);

  async function startPause(minutes: number) {
    const time = Date.now() + minutes * 60000;
    const response = await api.runtime.sendMessage({
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
  const [pomodoro, setPomodoroState] = useState<PomodoroState>({
    status: "idle",
    expiry: null,
  });

  useEffect(() => {
    getPomodoroState().then(setPomodoroState);

    function handleChange(changes: any) {
      if (changes.pomodoro) setPomodoroState(changes.pomodoro.newValue);
    }

    api.storage.onChanged.addListener(handleChange);

    return () => api.storage.onChanged.removeListener(handleChange);

    async function getPomodoroState() {
      const { pomodoro = { status: "idle", expiry: null } } =
        (await api.storage.sync.get("pomodoro")) as SyncState;
      return pomodoro;
    }
  }, []);

  async function startWork() {
    const expiry = Date.now() + 25 * 60000;
    const pomodoro: PomodoroState = { status: "work", expiry };
    await setPomodoro(pomodoro);
    api.alarms.create("pomodoroTimer", { delayInMinutes: 25 });
    api.alarms.create("badgeTicker", { periodInMinutes: 1 });
  }

  async function stopPomodoro() {
    const pomodoro: PomodoroState = { status: "idle", expiry: null };
    await setPomodoro(pomodoro);
    api.alarms.clear("pomodoroTimer");
    api.alarms.clear("badgeTicker");
  }

  return { pomodoro, startWork, stopPomodoro };
}

async function setPomodoro(pomodoro: PomodoroState) {
  const response = await api.runtime.sendMessage({
    type: "SET_POMODORO",
    pomodoro,
  });

  if (!response?.ok) {
    throw new Error(response?.error ?? "SET_POMODORO_ERROR");
  }

  return response;
}
