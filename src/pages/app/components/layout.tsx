import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, Outlet } from "react-router-dom";
import { useIsMobile } from "../hooks/use-is-mobile";
import { ConditionalRender } from "./conditional-render";
import { Sidebar } from "./sidebar";
import { SplitLayout } from "./split-layout";

type HeaderProps = {
  toggleSidebar: () => void;
};

const navButtons = [
  {
    label: "Blocked Sites",
    to: "/",
  },
  {
    label: "Schedule",
    to: "/schedule",
  },
];

export function Layout() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleSidebar() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <Header toggleSidebar={handleToggleSidebar} />

      <SplitLayout>
        <Sidebar open={isOpen}>
          <ConditionalRender when={isMobile}>
            <SidebarHeader toggleSidebar={handleToggleSidebar} />
          </ConditionalRender>

          <SidebarNav toggleSidebar={handleToggleSidebar} />
        </Sidebar>

        <Outlet />
      </SplitLayout>

      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "var(--pico-card-background-color)",
            color: "var(--pico-secondary-inverse)",
          },
        }}
      />
    </>
  );
}

function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header>
      <nav className="container">
        <ConditionalRender when={isMobile}>
          <ul>
            <li>
              <a
                className="secondary cursor-pointer"
                aria-label="open"
                onClick={toggleSidebar}
              >
                <ChevronLeft />
              </a>
            </li>
          </ul>
        </ConditionalRender>

        <ul>
          <li>
            <a className="secondary" href="/">
              Focus Block
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function SidebarHeader({ toggleSidebar }: HeaderProps) {
  return (
    <header className="flex py-3 items-center justify-between">
      <h2 className="mb-0"> Focus Block </h2>

      <a
        className="secondary cursor-pointer"
        aria-label="close"
        onClick={toggleSidebar}
      >
        <ChevronLeft />
      </a>
    </header>
  );
}

function SidebarNav({ toggleSidebar }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <nav>
      <ul>
        {navButtons.map((button) => (
          <li>
            <Link
              className="contrast"
              to={button.to}
              aria-current={
                button.to === location.pathname ? "page" : undefined
              }
              onClick={isMobile ? toggleSidebar : undefined}
            >
              {button.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
