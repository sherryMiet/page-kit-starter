import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "./registry";

const gapClasses: Record<string, string> = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-10",
};

const alignClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Row({ node, children }: BlockComponentProps) {
  const gap = (node.props.gap as string | undefined) ?? "md";
  const align = (node.props.align as string | undefined) ?? "stretch";

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row",
        gapClasses[gap] ?? gapClasses.md,
        alignClasses[align] ?? alignClasses.stretch,
      )}
    >
      {children}
    </div>
  );
}
