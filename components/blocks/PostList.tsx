import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/PostCard";
import type { BlockComponentProps } from "./registry";

export async function PostList({ node }: BlockComponentProps) {
  const limit = node.props.limit as number | undefined;
  const tag = node.props.tag as string | undefined;

  let posts = getAllPosts();
  if (tag) {
    posts = posts.filter((post) => post.category === tag || post.tags.includes(tag));
  }
  if (limit) {
    posts = posts.slice(0, limit);
  }

  if (posts.length === 0) {
    return <p className="text-muted-foreground">No posts yet — check back soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
