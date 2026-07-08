import type { BlockComponentProps } from "./registry";

const sizeClasses: Record<string, string> = {
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-24",
};

export function Spacer({ node }: BlockComponentProps) {
  const size = (node.props.size as string | undefined) ?? "md";
  return <div className={sizeClasses[size] ?? sizeClasses.md} aria-hidden />;
}
