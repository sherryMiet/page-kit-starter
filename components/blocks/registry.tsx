import type { ComponentType, ReactNode } from "react";
import type { BlockNode } from "@/lib/blocks/schema";
import { Section } from "./Section";
import { Row } from "./Row";
import { Column } from "./Column";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Image } from "./Image";
import { Button } from "./Button";
import { Divider } from "./Divider";
import { Spacer } from "./Spacer";
import { RawHtml } from "./RawHtml";
import { PostList } from "./PostList";

export type BlockComponentProps = {
  node: BlockNode;
  children?: ReactNode;
};

/**
 * Maps each known block `type` to its component. Container blocks (section,
 * row, column) receive `children`; content blocks (heading, text, ...)
 * ignore it — they are leaves.
 */
export const blockRegistry: Record<string, ComponentType<BlockComponentProps>> = {
  section: Section,
  row: Row,
  column: Column,
  heading: Heading,
  text: Text,
  image: Image,
  button: Button,
  divider: Divider,
  spacer: Spacer,
  "raw-html": RawHtml,
  "post-list": PostList,
};
