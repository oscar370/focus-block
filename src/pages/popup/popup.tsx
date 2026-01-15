import { usePomodoro } from "@/hooks";
import { Tabs } from "./components/tabs";
import Pomodoro from "./views/pomodoro";
import { Site } from "./views/site";

const tabs = [
  { id: "site", label: "Site", content: <Site /> },
  {
    id: "pomodoro",
    label: "Pomodoro",
    content: <Pomodoro />,
  },
];

export default function Popup() {
  const { pomodoro } = usePomodoro();

  return (
    <main className="container px-4 py-3">
      <Tabs
        tabs={tabs}
        defaultTabId={pomodoro.status !== "idle" ? "pomodoro" : "site"}
      />
    </main>
  );
}
