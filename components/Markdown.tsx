import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders post Markdown with a constrained, theme-aware typographic style.
 * Kept intentionally small — no raw HTML is allowed through.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-5 leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: (props) => (
            <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight" {...props} />
          ),
          h3: (props) => (
            <h3 className="mt-8 font-heading text-xl font-semibold" {...props} />
          ),
          p: (props) => <p className="text-base" {...props} />,
          a: (props) => (
            <a className="font-medium text-primary underline underline-offset-4" {...props} />
          ),
          ul: (props) => <ul className="list-disc space-y-2 pl-6" {...props} />,
          ol: (props) => <ol className="list-decimal space-y-2 pl-6" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground" {...props} />
          ),
          code: (props) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props} />
          ),
          pre: (props) => (
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
