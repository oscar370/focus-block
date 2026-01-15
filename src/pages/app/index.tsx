import { createRoot } from "react-dom/client";
import { App } from "./app";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find App root element");
  const root = createRoot(rootContainer);
  root.render(<App />);
}

init();
