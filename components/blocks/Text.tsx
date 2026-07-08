import { sanitizeRestrictedHtml } from "@/lib/blocks/html";
import type { BlockComponentProps } from "./registry";

export function Text({ node }: BlockComponentProps) {
  const html = node.props.html as string;
  const clean = sanitizeRestrictedHtml(html);

  return (
    <div
      className="space-y-4 text-base leading-relaxed text-foreground/90 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
