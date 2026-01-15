import { useIsMobile } from "../hooks/use-is-mobile";

type SidebarProps = {
  open: boolean;
  children: React.ReactNode;
};

export function Sidebar({ open, children }: SidebarProps) {
  const isMobile = useIsMobile();
  const styles: React.CSSProperties = {
    backgroundColor: "var(--pico-background-color)",
    translate: !open && isMobile ? "-100dvw" : undefined,
    position: isMobile ? "fixed" : "static",
  };

  return (
    <aside className="z-5 inset-0 transition-transform" style={styles}>
      <div className="container">{children}</div>
    </aside>
  );
}
