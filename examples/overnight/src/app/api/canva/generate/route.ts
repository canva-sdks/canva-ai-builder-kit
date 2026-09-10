import {
  campaignAssetToInput,
  generateCampaignKit,
  generateDesign,
} from "@/lib/canva/generate-design";
import type { Campaign } from "@/lib/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      campaign?: Campaign;
      assetId?: string;
    };
    if (!body.campaign) {
      return NextResponse.json({ error: "Missing campaign." }, { status: 400 });
    }

    const results = body.assetId
      ? [
          await generateDesign(
            campaignAssetToInput(body.campaign, body.assetId),
          ),
        ]
      : await generateCampaignKit(body.campaign);

    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Couldn’t generate designs.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
