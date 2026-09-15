import { analyzeSite } from "@/lib/analyze-site";
import { buildCampaign } from "@/lib/campaign";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let rawUrl = "";
  try {
    const body = (await request.json()) as { url?: string };
    rawUrl = body.url ?? "";
  } catch {
    return NextResponse.json({ error: "Send a JSON body with a url." }, { status: 400 });
  }

  try {
    const site = await analyzeSite(rawUrl);
    const campaign = buildCampaign(site);
    return NextResponse.json({ site, campaign });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Couldn’t analyze that website.";
    const status = /valid URL|Enter a website|allowed|http and https/.test(message)
      ? 400
      : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
