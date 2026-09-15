import type { Campaign, CampaignAsset } from "@/lib/types";
import { SafeImage } from "./SafeImage";

function BrandMark({
  campaign,
  light,
}: {
  campaign: Campaign;
  light?: boolean;
}) {
  return (
    <div className="flex items-center gap-[0.45em] min-w-0">
      <SafeImage
        src={campaign.logoUrl}
        alt=""
        className="h-[1.15em] w-[1.15em] rounded-[0.2em] object-cover bg-white/20"
      />
      <span
        className="truncate font-medium tracking-tight"
        style={{ color: light ? campaign.palette.accentText : campaign.palette.foreground }}
      >
        {campaign.brandName}
      </span>
    </div>
  );
}

function Cta({ campaign }: { campaign: Campaign }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-[0.9em] py-[0.35em] text-[0.72em] font-semibold"
      style={{
        background: campaign.palette.accent,
        color: campaign.palette.accentText,
      }}
    >
      {campaign.cta}
    </span>
  );
}

export function AssetPreview({
  campaign,
  asset,
}: {
  campaign: Campaign;
  asset: CampaignAsset;
}) {
  const { palette } = campaign;

  if (asset.id === "story") {
    return (
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ background: palette.accent, color: palette.accentText }}
      >
        <SafeImage
          src={campaign.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${palette.accent}cc 0%, ${palette.accent}40 40%, ${palette.accent}f2 100%)`,
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-[9%] pt-[14%]">
          <BrandMark campaign={campaign} light />
          <div>
            <p className="font-display text-[1.55em] leading-[1.05] tracking-[-0.03em]">
              {campaign.headline}
            </p>
            <p className="mt-[0.7em] line-clamp-3 text-[0.72em] leading-snug opacity-85">
              {campaign.subhead}
            </p>
            <div className="mt-[1.1em]">
              <Cta campaign={campaign} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (asset.id === "og") {
    return (
      <div
        className="flex h-full w-full overflow-hidden"
        style={{ background: palette.background, color: palette.foreground }}
      >
        <div className="flex w-[52%] flex-col justify-between p-[6%]">
          <BrandMark campaign={campaign} />
          <div>
            <p className="font-display text-[1.35em] leading-[1.05] tracking-[-0.03em]">
              {campaign.headline}
            </p>
            <p className="mt-[0.55em] line-clamp-2 text-[0.62em] leading-snug opacity-70">
              {campaign.subhead}
            </p>
          </div>
          <Cta campaign={campaign} />
        </div>
        <div className="relative w-[48%]" style={{ background: palette.muted }}>
          <SafeImage
            src={campaign.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  if (asset.id === "email") {
    return (
      <div
        className="flex h-full w-full items-center justify-between gap-[1em] overflow-hidden px-[5%]"
        style={{ background: palette.accent, color: palette.accentText }}
      >
        <div className="min-w-0">
          <BrandMark campaign={campaign} light />
          <p className="mt-[0.35em] truncate font-display text-[1.15em] leading-none tracking-[-0.03em]">
            {campaign.headline}
          </p>
        </div>
        <Cta campaign={campaign} />
      </div>
    );
  }

  if (asset.id === "flyer") {
    return (
      <div
        className="flex h-full w-full flex-col overflow-hidden"
        style={{ background: palette.background, color: palette.foreground }}
      >
        <div className="flex items-center justify-between px-[8%] py-[6%]">
          <BrandMark campaign={campaign} />
          <span className="text-[0.55em] uppercase tracking-[0.18em] opacity-50">
            One-pager
          </span>
        </div>
        <div
          className="relative mx-[8%] aspect-[16/9] overflow-hidden"
          style={{ background: palette.muted }}
        >
          <SafeImage
            src={campaign.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background: `linear-gradient(transparent, ${palette.background})`,
            }}
          />
        </div>
        <div className="flex flex-1 flex-col px-[8%] pb-[8%] pt-[6%]">
          <p className="font-display text-[1.45em] leading-[1.05] tracking-[-0.03em]">
            {campaign.headline}
          </p>
          <p className="mt-[0.55em] line-clamp-3 text-[0.62em] leading-snug opacity-70">
            {campaign.subhead}
          </p>
          <div className="mt-[0.9em] grid grid-cols-3 gap-[0.5em]">
            {(campaign.bullets.length
              ? campaign.bullets
              : ["Launch ready", "On-brand", "Send today"]
            )
              .slice(0, 3)
              .map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-[0.3em] p-[0.55em]"
                  style={{ background: palette.muted }}
                >
                  <p className="line-clamp-3 text-[0.5em] leading-snug font-medium">
                    {bullet}
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-auto pt-[0.9em]">
            <Cta campaign={campaign} />
          </div>
        </div>
      </div>
    );
  }

  if (asset.id === "portrait") {
    return (
      <div
        className="flex h-full w-full flex-col overflow-hidden"
        style={{ background: palette.background, color: palette.foreground }}
      >
        <div className="relative flex-[1.2]" style={{ background: palette.muted }}>
          <SafeImage
            src={campaign.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-[8%]">
          <p className="font-display text-[1.25em] leading-[1.05] tracking-[-0.03em]">
            {campaign.headline}
          </p>
          <div className="flex items-center justify-between gap-[0.5em]">
            <span className="truncate text-[0.62em] opacity-60">
              {campaign.brandName}
            </span>
            <Cta campaign={campaign} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-[8%]"
      style={{ background: palette.accent, color: palette.accentText }}
    >
      <SafeImage
        src={campaign.imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative">
        <BrandMark campaign={campaign} light />
      </div>
      <div className="relative">
        <p className="font-display text-[1.55em] leading-[1.02] tracking-[-0.03em]">
          {campaign.headline}
        </p>
        <div className="mt-[1em]">
          <Cta campaign={campaign} />
        </div>
      </div>
    </div>
  );
}
