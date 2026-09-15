import { buildPalette, extractHexColors, normalizeHex } from "./color";
import {
  allInners,
  collectTags,
  firstInner,
  parseAttrs,
  resolveUrl,
} from "./html";
import { assertPublicHttpUrl, normalizeUrl } from "./ssrf";
import type { AnalyzedSite } from "./types";

const MAX_BYTES = 1_500_000;
const FETCH_MS = 12_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OvernightKit/0.1";

function metaContent(
  metas: Record<string, string>[],
  keys: string[],
): string | null {
  const wanted = new Set(keys.map((k) => k.toLowerCase()));
  for (const meta of metas) {
    const key = (meta.property || meta.name || meta.itemprop || "").toLowerCase();
    if (wanted.has(key) && meta.content) return meta.content;
  }
  return null;
}

function parseJsonLd(html: string): { name?: string; logo?: string; slogan?: string } {
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    try {
      const data = JSON.parse(match[1]);
      const nodes = Array.isArray(data)
        ? data
        : data["@graph"]
          ? data["@graph"]
          : [data];
      for (const node of nodes) {
        const type = String(node["@type"] ?? "");
        if (
          /Organization|WebSite|Brand|Product/i.test(type) ||
          node.name ||
          node.logo
        ) {
          const logo =
            typeof node.logo === "string"
              ? node.logo
              : node.logo?.url || node.image?.url || node.image;
          return {
            name: node.name || node.legalName,
            logo: typeof logo === "string" ? logo : undefined,
            slogan: node.slogan || node.description,
          };
        }
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return {};
}

async function fetchHtml(url: URL): Promise<{ html: string; finalUrl: string }> {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_MS),
    headers: {
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Couldn’t fetch that site (${response.status}).`);
  }

  const finalUrl = new URL(response.url);
  await assertPublicHttpUrl(finalUrl);

  const length = Number(response.headers.get("content-length") ?? 0);
  if (length > MAX_BYTES) {
    throw new Error("That page is too large to analyze.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !/html|xml|text\/plain/i.test(contentType)) {
    throw new Error("That URL didn’t return a web page.");
  }

  const html = (await response.text()).slice(0, MAX_BYTES);
  if (/just a moment|attention required|cf-browser-verification/i.test(html) && html.length < 8000) {
    throw new Error("That site blocked automated reads. Try another URL.");
  }

  return { html, finalUrl: finalUrl.toString() };
}

export async function analyzeSite(rawUrl: string): Promise<AnalyzedSite> {
  const url = normalizeUrl(rawUrl);
  await assertPublicHttpUrl(url);
  const { html, finalUrl } = await fetchHtml(url);

  const metas = collectTags(html, "meta").map(parseAttrs);
  const links = collectTags(html, "link").map(parseAttrs);
  const jsonLd = parseJsonLd(html);

  const title =
    metaContent(metas, ["og:title", "twitter:title"]) ||
    firstInner(html, "title") ||
    url.hostname;

  const description =
    metaContent(metas, [
      "og:description",
      "twitter:description",
      "description",
    ]) ||
    jsonLd.slogan ||
    "";

  const siteName =
    metaContent(metas, ["og:site_name", "application-name"]) ||
    jsonLd.name ||
    url.hostname.replace(/^www\./, "");

  const imageUrl = resolveUrl(
    finalUrl,
    metaContent(metas, [
      "og:image",
      "og:image:url",
      "twitter:image",
      "twitter:image:src",
    ]),
  );

  const iconHref =
    links.find((l) => (l.rel || "").toLowerCase().includes("apple-touch-icon"))
      ?.href ||
    links.find((l) => (l.rel || "").toLowerCase() === "icon")?.href ||
    links.find((l) => (l.rel || "").toLowerCase().includes("icon"))?.href ||
    "/favicon.ico";

  const logoUrl =
    resolveUrl(finalUrl, jsonLd.logo) ||
    resolveUrl(finalUrl, iconHref) ||
    imageUrl;

  const themeColor = normalizeHex(
    metaContent(metas, ["theme-color"]) ?? "",
  );

  const headings = [
    ...allInners(html, "h1", 4),
    ...allInners(html, "h2", 6),
  ].filter((h) => h.toLowerCase() !== title.toLowerCase());

  const colors = extractHexColors(html.slice(0, 80_000));
  const palette = buildPalette(colors, themeColor);

  return {
    url: url.toString(),
    finalUrl,
    title,
    description,
    siteName,
    headline: title.split(/[|—–]/)[0].trim() || title,
    headings,
    logoUrl,
    imageUrl,
    themeColor,
    colors,
    palette,
  };
}
