# Focus Block - AI Coding Guidelines

## Architecture Overview

This is a **browser extension** (Chrome/Firefox) with Vite build tooling. Key components:

- **Background Service Worker** (`src/pages/background/`): Core state engine managing blocked sites, schedules, pause mode, and Pomodoro timers via `chrome.storage.sync` and alarms
- **App/Options Page** (`src/pages/app/`): React options panel for site/schedule configuration (internal page, not native options API, for Firefox parity)
- **Content Script** (`src/pages/content/`): Injected blocking UI with real-time state sync; calls `shouldBlock()` logic every 60s or on state change
- **Popup** (`src/pages/popup/`): Lightweight Pomodoro timer controls

## Build & Development

**Commands:**
- `pnpm dev` / `pnpm dev:chrome` - Vite watch build (Chrome manifest, reloads on change)
- `pnpm dev:firefox` - Firefox dev build
- `pnpm build` - Production build for both (outputs to `dist_chrome/`, `dist_firefox/`)

**Key files:** `vite.config.chrome.ts`, `vite.config.firefox.ts` (inherit from `vite.config.base.ts`). Uses `@crxjs/vite-plugin` to manage manifest injection. Separate builds needed due to different manifest structures.

## Communication Pattern: Service Worker ↔ UI

**All state mutations flow through service worker only.** UI components send **type-tagged messages** via `api.runtime.sendMessage()`, service worker handles them and returns `{ ok: true }` or `{ ok: false, error }`.

**Message types:** `ADD_BLOCKED_SITE`, `DELETE_BLOCKED_SITE`, `ADD_SCHEDULE`, `DELETE_SCHEDULE`, `SET_PAUSE`, `SET_POMODORO`

See [src/pages/background/index.ts](src/pages/background/index.ts#L10) switch statement for full handler definitions.

## State Management

**Single source of truth:** `chrome.storage.sync` with TypeScript interface `SyncState`:
- `blockedSites[]` - domain strings (case-insensitive substring matching)
- `schedules[]` - Schedule objects with time windows and day-of-week bitmask
- `pauseUntil` - unix timestamp for 5-min pause override
- `pomodoro` - `{ status: "work"|"break"|"idle", expiry: number|null }`

**Real-time sync:** All React components use custom hooks (`useBlockedSites()`, `useSchedules()`, `usePause()`, `usePomodoro()`) that listen to `api.storage.onChanged` events. See [src/hooks/index.ts](src/hooks/index.ts).

## Blocking Logic

Core algorithm in [src/utils/block-logic.ts](src/utils/block-logic.ts): `shouldBlock(hostname, sites, schedules, pauseUntil, pomodoro)` returns `true` if site should be blocked. **Precedence:** Pomodoro work mode → pause override → active schedule check.

Content script runs this check every 60s. Content script also manages media suppression via `stopMedia()` helper.

## Key Patterns & Conventions

1. **API abstraction:** All `chrome.*` calls route through `api` from [src/api/index.ts](src/api/index.ts) for testability
2. **Error handling:** Service worker handlers catch errors and return structured responses; UI components throw errors from failed responses
3. **Typing:** Use `SyncState`, `Schedule`, `PomodoroState` from [src/types/index.ts](src/types/index.ts); avoid `any`
4. **UI styling:** TailwindCSS v4 + PicoCSS; check [src/pages/app/](src/pages/app/) for layout patterns (split-layout, sidebar components)
5. **Manifest:** Stored in manifest.json; dev overrides in manifest.dev.json (injected when `__DEV__` flag set)

## Browser-Specific Notes

- Chrome & Firefox use ManifestV3; separate Vite configs handle different service worker registration
- `webextension-polyfill` provides unified API, but project uses bare `chrome.*` calls directly
- Firefox requires internal options page (not native API) for feature parity

## Adding New Features

1. Define new state in `SyncState` type
2. Add message handler in [src/pages/background/index.ts](src/pages/background/index.ts) switch statement
3. Create getter/setter service function in appropriate `src/pages/*/services/` file  
4. Add React hook in [src/hooks/index.ts](src/hooks/index.ts) for UI consumers
5. Build: `pnpm dev` auto-reloads; test in both browsers before `pnpm build`
