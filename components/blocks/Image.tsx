import NextImage from "next/image";
import { cn } from "@/lib/utils";
import type { BlockComponentProps } from "./registry";

const aspectClasses: Record<string, string> = {
  auto: "",
  "16:9": "aspect-[16/9]",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
};

export function Image({ node }: BlockComponentProps) {
  const src = node.props.src as string;
  const alt = node.props.alt as string;
  const aspect = (node.props.aspect as string | undefined) ?? "auto";
  const link = node.props.link as string | undefined;

  const img =
    aspect === "auto" ? (
      <NextImage
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="h-auto w-full rounded-lg border border-border object-cover"
      />
    ) : (
      <div className={cn("relative overflow-hidden rounded-lg border border-border", aspectClasses[aspect])}>
        <NextImage src={src} alt={alt} fill className="object-cover" />
      </div>
    );

  if (link) {
    return (
      <a href={link} className="block">
        {img}
      </a>
    );
  }

  return img;
}
