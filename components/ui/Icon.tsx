import {
  Accessibility,
  Layers,
  Palette,
  PenLine,
  Smartphone,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the string icon names used in content (e.g. `"palette"`) to Lucide
 * components. Unknown names fall back to a neutral icon, so content authors
 * can reference icons safely without importing anything.
 */
const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  layers: Layers,
  accessibility: Accessibility,
  zap: Zap,
  smartphone: Smartphone,
  "pen-line": PenLine,
  sparkles: Sparkles,
};

export function Icon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Cmp = (name && ICONS[name]) || Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
