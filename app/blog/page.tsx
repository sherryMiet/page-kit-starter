import type { Metadata } from "next";
import { getAllPosts, getCategories } from "@/lib/content";
import { PostCard } from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, guides, and announcements.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recent = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <div className="container py-16 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Articles, guides, and announcements from the team.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <section className="mt-12">
              <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Featured
              </h2>
              <PostCard post={featured} featured />
            </section>
          )}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_240px]">
            {/* Recent */}
            <section>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Recent posts
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {recent.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>

            {/* Categories sidebar */}
            <aside>
              <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Categories
              </h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.name}
                    className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span>{cat.name}</span>
                    <span className="text-muted-foreground">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
