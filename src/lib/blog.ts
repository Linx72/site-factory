/**
 * File-based blog-lite under content/blog/*.md
 * Frontmatter: title, summary, date (ISO), optional draft.
 * Body: subset of Markdown (headings, paragraphs, lists, links, emphasis, code).
 */
import fs from "node:fs";
import path from "node:path";

export type BlogPostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  draft?: boolean;
};

export type BlogPost = BlogPostMeta & {
  /** Raw markdown body (no frontmatter). */
  body: string;
};

const blogDir = path.join(process.cwd(), "content/blog");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: trimmed };
  }
  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: trimmed };
  }
  const fm = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\n/, "");
  const data: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body };
}

function toMeta(slug: string, data: Record<string, string>): BlogPostMeta {
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    date: data.date ?? "1970-01-01",
    draft: data.draft === "true",
  };
}

function readPostFile(file: string): BlogPost | null {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const meta = toMeta(slug, data);
  if (meta.draft) return null;
  return { ...meta, body };
}

/** Published posts newest-first. */
export function listBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readPostFile(file))
    .filter((post): post is BlogPost => post !== null)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      ...(post.draft !== undefined ? { draft: post.draft } : {}),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string): BlogPost | null {
  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return readPostFile(`${slug}.md`);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g,
    '<a href="$2" class="underline underline-offset-4 hover:text-foreground">$1</a>',
  );
  return out;
}

/**
 * Minimal Markdown → safe HTML for blog posts (no raw HTML passthrough).
 */
export function renderBlogMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith("```")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${inlineMarkdown(para.join(" "))}</p>`);
  }

  return html.join("\n");
}
