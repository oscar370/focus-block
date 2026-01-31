# Changelog

## [1.0.3] - 2026-01-31

- Local synchronization was implemented in parallel to reduce latency.
- The `api` wrapper was modified to synchronize in parallel.
- The chrome spacename is used directly where data retrieval is not required.
- The cancel pomodoro button was removed when paused.
- Pomodoro counting follows synchronization with the user's local time.
