type ConditionalRenderProps = {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function ConditionalRender({
  when,
  children,
  fallback = null,
}: ConditionalRenderProps) {
  if (!when) return fallback;
  return children;
}
