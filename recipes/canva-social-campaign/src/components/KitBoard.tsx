"use client";

import type { Campaign, CampaignAsset } from "@/lib/types";
import { AssetPreview } from "./AssetPreview";

const WIDTHS: Record<string, string> = {
  og: "min(100%, 34rem)",
  story: "min(100%, 16rem)",
  square: "min(100%, 18rem)",
  portrait: "min(100%, 16.5rem)",
  email: "min(100%, 34rem)",
  flyer: "min(100%, 18.5rem)",
};

export function AssetCard({
  campaign,
  asset,
  onCreate,
}: {
  campaign: Campaign;
  asset: CampaignAsset;
  onCreate: (assetId: string) => void;
}) {
  return (
    <figure
      className="flex flex-col gap-3"
      style={{ width: WIDTHS[asset.id] ?? "18rem", flex: "1 1 16rem" }}
    >
      <div
        className="overflow-hidden rounded-sm bg-white shadow-[0_18px_50px_-24px_rgba(26,20,16,0.45)] ring-1 ring-black/10"
        style={{ aspectRatio: asset.aspect, fontSize: "clamp(11px, 2.1vw, 16px)" }}
      >
        <AssetPreview campaign={campaign} asset={asset} />
      </div>
      <figcaption className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium tracking-tight">{asset.label}</p>
          <p className="text-xs text-[#1a1410]/55">{asset.channel}</p>
        </div>
        <button
          type="button"
          onClick={() => onCreate(asset.id)}
          className="shrink-0 text-xs font-medium underline decoration-[#1a1410]/25 underline-offset-4 hover:decoration-[#1a1410]"
        >
          Create in Canva
        </button>
      </figcaption>
    </figure>
  );
}

export function KitBoard({
  campaign,
  onCreateAsset,
  onCreateKit,
  creating,
}: {
  campaign: Campaign;
  onCreateAsset: (assetId: string) => void;
  onCreateKit: () => void;
  creating: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1a1410]/10 pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#1a1410]/45">
            Campaign kit
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
            {campaign.brandName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#1a1410]/65">
            {campaign.subhead}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {campaign.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={campaign.logoUrl}
                alt=""
                className="h-8 w-8 rounded-md object-cover ring-1 ring-black/10"
              />
            ) : null}
            {(
              [
                campaign.palette.accent,
                campaign.palette.background,
                campaign.palette.foreground,
                campaign.palette.muted,
              ] as const
            ).map((color) => (
              <span
                key={color}
                title={color}
                className="h-8 w-8 rounded-full ring-1 ring-black/10"
                style={{ background: color }}
              />
            ))}
            <a
              href={campaign.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#1a1410]/50 underline-offset-2 hover:underline"
            >
              {new URL(campaign.sourceUrl).hostname}
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={onCreateKit}
          disabled={creating}
          className="rounded-full bg-[#1a1410] px-5 py-2.5 text-sm font-medium text-[#f7f1e6] disabled:opacity-60"
        >
          {creating ? "Calling Canva…" : "Create entire kit in Canva"}
        </button>
      </div>

      <div className="mt-10 flex flex-wrap items-start gap-x-8 gap-y-10">
        {campaign.assets.map((asset) => (
          <AssetCard
            key={asset.id}
            campaign={campaign}
            asset={asset}
            onCreate={onCreateAsset}
          />
        ))}
      </div>
    </div>
  );
}
