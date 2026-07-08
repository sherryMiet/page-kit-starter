import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "./registry";

const levelClasses: Record<number, string> = {
  1: "font-heading text-4xl font-bold tracking-tight sm:text-6xl",
  2: "font-heading text-3xl font-bold tracking-tight sm:text-4xl",
  3: "font-heading text-2xl font-bold tracking-tight",
  4: "font-heading text-xl font-semibold tracking-tight",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Heading({ node }: BlockComponentProps) {
  const text = node.props.text as string;
  const level = (node.props.level as number | undefined) ?? 2;
  const align = (node.props.align as string | undefined) ?? "left";
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

  return <Tag className={cn(levelClasses[level] ?? levelClasses[2], alignClasses[align] ?? alignClasses.left)}>{text}</Tag>;
}
