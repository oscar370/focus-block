export type PomodoroState = {
  status: "work" | "break" | "idle";
  expiry: number | null;
};

export type SyncState = {
  blockedSites: string[];
  schedules: Schedule[];
  pauseUntil: number | null;
  pomodoro: PomodoroState;
  pomodoroPrePause: PomodoroState | null;
  pomodoroPauseUntil: number | null;
};

export type Days = {
  sunday: true;
  monday: true;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};

export type Schedule = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: Days;
};
