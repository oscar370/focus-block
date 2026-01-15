import { HashRouter, Route, Routes } from "react-router-dom";
import { BlockedSites } from "./views/blocked-sites";
import { Layout } from "./components/layout";
import { Schedule } from "./views/schedule";

export function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route Component={Layout}>
            <Route path="/" Component={BlockedSites} />
            <Route path="/schedule" Component={Schedule} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}
