export function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "));
}

export function parseAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re =
    /([a-zA-Z:_][a-zA-Z0-9:_.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(tag))) {
    attrs[match[1].toLowerCase()] = decodeEntities(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return attrs;
}

export function collectTags(html: string, tagName: string): string[] {
  const re = new RegExp(`<${tagName}\\b([^>]*)\\/?>`, "gi");
  const tags: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    tags.push(match[1] ?? "");
  }
  return tags;
}

export function firstInner(html: string, tagName: string): string | null {
  const re = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = re.exec(html);
  return match ? stripTags(match[1]) : null;
}

export function allInners(html: string, tagName: string, limit = 8): string[] {
  const re = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "gi",
  );
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) && values.length < limit) {
    const text = stripTags(match[1]);
    if (text && text.length < 140 && !values.includes(text)) values.push(text);
  }
  return values;
}

export function resolveUrl(base: string, href: string | null | undefined): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("javascript:")) {
    return null;
  }
  try {
    return new URL(trimmed, base).toString();
  } catch {
    return null;
  }
}
