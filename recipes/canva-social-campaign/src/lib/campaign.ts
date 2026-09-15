import type { AnalyzedSite, Campaign, CampaignAsset } from "./types";

function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const match = clean.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || clean).slice(0, 180);
}

function inferCta(site: AnalyzedSite): string {
  const hay = `${site.title} ${site.description} ${site.headings.join(" ")}`.toLowerCase();
  if (/\bshop\b|store|buy now|add to cart/.test(hay)) return "Shop now";
  if (/book a demo|talk to|get a demo/.test(hay)) return "Book a demo";
  if (/sign up|get started|try .*free|start free/.test(hay)) return "Get started";
  if (/download/.test(hay)) return "Download";
  if (/subscribe/.test(hay)) return "Subscribe";
  return "Learn more";
}

function brief(
  kind: string,
  campaign: Omit<Campaign, "assets">,
  extras: string[] = [],
): string {
  return [
    `Create a ${kind} campaign asset for ${campaign.brandName}.`,
    `Source website: ${campaign.sourceUrl}`,
    `Headline: ${campaign.headline}`,
    `Supporting line: ${campaign.subhead}`,
    `Call to action: ${campaign.cta}`,
    campaign.bullets.length
      ? `Proof points: ${campaign.bullets.join(" · ")}`
      : "",
    `Brand palette: accent ${campaign.palette.accent}, background ${campaign.palette.background}, text ${campaign.palette.foreground}.`,
    "Use the company logo and product/OG image as photography. Keep type large. No generic stock people. No lorem ipsum.",
    "Tone: specific, confident, like a real campaign from this company — not a template.",
    ...extras,
  ]
    .filter(Boolean)
    .join("\n");
}

function campaignHeadline(site: AnalyzedSite): string {
  const parts = site.title
    .split(/[|—–]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const brand = (site.siteName || parts[0] || "").toLowerCase();
  const longer = parts.find(
    (part) => part.length > 16 && part.toLowerCase() !== brand,
  );
  if (longer && longer.length < 90) return longer;

  const desc = firstSentence(site.description);
  if (desc.length > 16 && desc.length < 100) {
    return desc.replace(/[.!?]$/, "");
  }

  const heading = site.headings.find(
    (item) => item.length > 12 && item.length < 80,
  );
  return heading || parts[0] || site.siteName;
}

export function buildCampaign(site: AnalyzedSite): Campaign {
  const brandName = site.siteName || site.title.split("|")[0].trim();
  const headline = campaignHeadline(site);
  const subhead =
    firstSentence(site.description) ||
    `${brandName} — campaign kit generated from the live site.`;
  const bullets = site.headings.slice(0, 3);
  const cta = inferCta(site);

  const base: Omit<Campaign, "assets"> = {
    sourceUrl: site.finalUrl,
    brandName,
    headline,
    subhead,
    cta,
    bullets,
    logoUrl: site.logoUrl,
    imageUrl: site.imageUrl,
    palette: site.palette,
  };

  const assets: CampaignAsset[] = [
    {
      id: "og",
      label: "LinkedIn / OG",
      channel: "Feed + link preview",
      aspect: "1.91 / 1",
      designType: "facebook_cover",
      query: brief("landscape Open Graph / LinkedIn banner (1200×628)", base, [
        "Split or full-bleed layout. Headline must read at small sizes.",
      ]),
    },
    {
      id: "story",
      label: "Story",
      channel: "Instagram / Facebook",
      aspect: "9 / 16",
      designType: "your_story",
      query: brief("vertical story (1080×1920)", base, [
        "Keep the lower 20% clear for UI chrome. Large type, one idea.",
      ]),
    },
    {
      id: "square",
      label: "Square post",
      channel: "Instagram / X / LinkedIn",
      aspect: "1 / 1",
      designType: "facebook_post",
      query: brief("square social post (1080×1080)", base, [
        "Poster energy. One headline, one CTA, logo lockup.",
      ]),
    },
    {
      id: "portrait",
      label: "Portrait post",
      channel: "Instagram 4:5",
      aspect: "4 / 5",
      designType: "instagram_post",
      query: brief("portrait social post (1080×1350)", base, [
        "Editorial. Pair a product crop with a short claim.",
      ]),
    },
    {
      id: "email",
      label: "Email header",
      channel: "Campaign email",
      aspect: "3 / 1",
      designType: "email",
      query: brief("email header / hero (1200×400)", base, [
        "Wide banner, not a full newsletter. Logo, offer line, button.",
      ]),
    },
    {
      id: "flyer",
      label: "One-pager",
      channel: "Print / PDF leave-behind",
      aspect: "8.5 / 11",
      designType: "flyer",
      query: brief("letter-size campaign one-pager / flyer", base, [
        "Hero, three proof points, and a strong CTA. This is the takeaway someone prints.",
      ]),
    },
  ];

  return { ...base, assets };
}
