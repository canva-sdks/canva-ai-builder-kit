export type Palette = {
  background: string;
  foreground: string;
  accent: string;
  accentText: string;
  muted: string;
};

export type AnalyzedSite = {
  url: string;
  finalUrl: string;
  title: string;
  description: string;
  siteName: string;
  headline: string;
  headings: string[];
  logoUrl: string | null;
  imageUrl: string | null;
  themeColor: string | null;
  colors: string[];
  palette: Palette;
};

export type CanvaDesignType =
  | "instagram_post"
  | "your_story"
  | "facebook_cover"
  | "facebook_post"
  | "flyer"
  | "email"
  | "poster";

export type CampaignAsset = {
  id: string;
  label: string;
  channel: string;
  aspect: string;
  designType: CanvaDesignType;
  query: string;
};

export type Campaign = {
  sourceUrl: string;
  brandName: string;
  headline: string;
  subhead: string;
  cta: string;
  bullets: string[];
  logoUrl: string | null;
  imageUrl: string | null;
  palette: Palette;
  assets: CampaignAsset[];
};

export type GenerateDesignInput = {
  query: string;
  designType: CanvaDesignType;
  brandName: string;
  palette: Palette;
  logoUrl: string | null;
  imageUrl: string | null;
  sourceUrl: string;
};

export type GenerateDesignResult =
  | {
      status: "not_implemented";
      message: string;
      input: GenerateDesignInput;
    }
  | {
      status: "ok";
      designId: string;
      editUrl: string;
      thumbnailUrl: string;
    };
