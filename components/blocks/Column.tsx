import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "./registry";

const alignClasses: Record<string, string> = {
  start: "items-start text-left",
  center: "items-center text-center",
  end: "items-end text-right",
};

export function Column({ node, children }: BlockComponentProps) {
  const span = (node.props.span as number | undefined) ?? 12;
  const align = (node.props.align as string | undefined) ?? "start";
  const percent = (span / 12) * 100;

  return (
    <div
      className={cn("flex min-w-0 flex-col gap-4", alignClasses[align] ?? alignClasses.start)}
      style={{ flexBasis: `${percent}%`, flexGrow: 0, flexShrink: 1 }}
    >
      {children}
    </div>
  );
}
