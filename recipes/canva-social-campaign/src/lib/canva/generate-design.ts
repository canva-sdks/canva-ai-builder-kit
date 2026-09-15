import type { Campaign, GenerateDesignInput, GenerateDesignResult } from "../types";

/**
 * Create a Canva design from a campaign asset brief.
 *
 * This is the Connect Design Generation call — the API is not public yet.
 * When it ships, this should:
 *   1. Upload `logoUrl` / `imageUrl` via the Assets API
 *   2. POST the brief to Design Generation (`query`, `design_type`, `asset_ids`)
 *   3. Return the new design id, edit URL, and thumbnail
 */
export async function generateDesign(
  input: GenerateDesignInput,
): Promise<GenerateDesignResult> {
  // TO IMPLEMENT: Canva Connect Design Generation API
  //
  // const assets = await uploadSourceImages(input)
  // const job = await fetch("https://api.canva.com/rest/v1/designs/generate", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     query: input.query,
  //     design_type: input.designType,
  //     asset_ids: assets,
  //   }),
  // })
  // const result = await poll(job)
  // return { status: "ok", designId, editUrl, thumbnailUrl }

  return {
    status: "not_implemented",
    message: "Canva Design Generation API is not wired yet.",
    input,
  };
}

export function campaignAssetToInput(
  campaign: Campaign,
  assetId: string,
): GenerateDesignInput {
  const asset = campaign.assets.find((item) => item.id === assetId);
  if (!asset) {
    throw new Error(`Unknown campaign asset: ${assetId}`);
  }
  return {
    query: asset.query,
    designType: asset.designType,
    brandName: campaign.brandName,
    palette: campaign.palette,
    logoUrl: campaign.logoUrl,
    imageUrl: campaign.imageUrl,
    sourceUrl: campaign.sourceUrl,
  };
}

/** Generate every piece in the kit. Each piece calls `generateDesign`. */
export async function generateCampaignKit(
  campaign: Campaign,
): Promise<GenerateDesignResult[]> {
  return Promise.all(
    campaign.assets.map((asset) =>
      generateDesign(campaignAssetToInput(campaign, asset.id)),
    ),
  );
}
