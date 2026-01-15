import { useIsMobile } from "../hooks/use-is-mobile";

type SplitLayoutProps = {
  children: React.ReactNode;
};

export function SplitLayout({ children }: SplitLayoutProps) {
  const isMobile = useIsMobile();
  const styles: React.CSSProperties = {
    display: !isMobile ? "grid" : undefined,
    gridTemplateColumns: !isMobile
      ? "minmax(min-content, 200px) 1fr"
      : undefined,
  };

  return (
    <div className="container" style={styles}>
      {children}
    </div>
  );
}
