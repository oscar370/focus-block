# Changelog

## [1.0.5] - 2026-02-02

- The Pomodoro timer reset has been improved.

## [1.0.4] - 2026-01-31

- The comparison of sites has been fixed.

## [1.0.3] - 2026-01-31

- Local synchronization was implemented in parallel to reduce latency.
- The `api` wrapper was modified to synchronize in parallel.
- The chrome spacename is used directly where data retrieval is not required.
- The cancel pomodoro button was removed when paused.
- Pomodoro counting follows synchronization with the user's local time.
