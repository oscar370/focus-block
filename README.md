# Focus Block

A productivity tool for distraction blocking, schedule management, and Pomodoro cycles.

## User Guide

### Key Features

* **Focus Management**: Reactive website blocking that triggers instantly without requiring page refreshes.
* **Pomodoro System**: Productivity timer with interactive notifications and a visual counter on the extension icon.
* **Schedule Control**: Panel to program automatic restriction periods by days and hours.
* **Pause Mode**: 5-minute temporary access for quick tasks.

### Installation

The extension is available for direct installation via the Chrome Web Store and Firefox Add-ons. **Still in progress**

---

## Development and Architecture

### Project Structure

* **Background Service Worker**: Core engine managing alarms, persistence, and system notifications.
* **Options Page (App)**: Main React application for detailed configuration of sites and schedules. It is implemented as an internal page rather than using the native options API to ensure feature parity in Firefox.
* **Content**: Injected blocking interface with real-time state synchronization.
* **Popup**: Lightweight interface for Pomodoro state control.

### Tech Stack

* **Runtime**: Vite + Node.js with **pnpm**.
* **Frontend**: React + TailwindCSS + PicoCSS.
* **Communication**: Asynchronous messaging system optimized to prevent premature port closure in Chromium.

### Terminal Commands

Install dependencies:

```bash
pnpm install

```

Development build:

```bash
pnpm run dev

```

Production build:

```bash
pnpm run build

```
