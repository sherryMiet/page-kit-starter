import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "./registry";

const paddingClasses: Record<string, string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
};

export function Section({ node, children }: BlockComponentProps) {
  const background = node.props.background as { color?: string; imageSrc?: string } | undefined;
  const padding = (node.props.padding as string | undefined) ?? "md";
  const width = (node.props.width as string | undefined) ?? "contained";

  return (
    <section
      className={cn("relative", paddingClasses[padding] ?? paddingClasses.md)}
      style={{
        backgroundColor: background?.color,
        backgroundImage: background?.imageSrc ? `url(${background.imageSrc})` : undefined,
        backgroundSize: background?.imageSrc ? "cover" : undefined,
        backgroundPosition: background?.imageSrc ? "center" : undefined,
      }}
    >
      <div className={width === "full" ? "w-full" : "container"}>{children}</div>
    </section>
  );
}
