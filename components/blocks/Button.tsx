import { cn } from "@/lib/utils";
import { Button as UiButton } from "@/components/ui/Button";
import type { BlockComponentProps } from "./registry";

const alignClasses: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function Button({ node }: BlockComponentProps) {
  const label = node.props.label as string;
  const href = node.props.href as string;
  const variant = (node.props.variant as "primary" | "secondary" | "ghost" | undefined) ?? "primary";
  const align = (node.props.align as string | undefined) ?? "left";

  return (
    <div className={cn("flex", alignClasses[align] ?? alignClasses.left)}>
      <UiButton href={href} variant={variant}>
        {label}
      </UiButton>
    </div>
  );
}
