"use client";

import type { Campaign, GenerateDesignResult } from "@/lib/types";
import { FormEvent, useState } from "react";
import { CanvaPayloadDialog } from "./CanvaPayloadDialog";
import { KitBoard } from "./KitBoard";

const EXAMPLES = [
  { label: "Linear", url: "https://linear.app" },
  { label: "Stripe", url: "https://stripe.com" },
  { label: "Notion", url: "https://www.notion.com" },
  { label: "Airbnb", url: "https://www.airbnb.com" },
];

const STAGES = [
  "Fetching the site",
  "Pulling brand",
  "Drafting the kit",
] as const;

export function Studio() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [results, setResults] = useState<GenerateDesignResult[] | null>(null);

  async function analyze(nextUrl: string) {
    setError(null);
    setCampaign(null);
    setStage(STAGES[0]);
    const tick = window.setTimeout(() => setStage(STAGES[1]), 700);
    const tick2 = window.setTimeout(() => setStage(STAGES[2]), 1400);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: nextUrl }),
      });
      const data = (await response.json()) as {
        error?: string;
        campaign?: Campaign;
      };
      if (!response.ok || !data.campaign) {
        throw new Error(data.error || "Couldn’t analyze that website.");
      }
      setCampaign(data.campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      window.clearTimeout(tick);
      window.clearTimeout(tick2);
      setStage(null);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void analyze(url);
  }

  async function createInCanva(assetId?: string) {
    if (!campaign) return;
    setCreating(true);
    try {
      const response = await fetch("/api/canva/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign, assetId }),
      });
      const data = (await response.json()) as {
        error?: string;
        results?: GenerateDesignResult[];
      };
      if (!response.ok || !data.results) {
        throw new Error(data.error || "Couldn’t call Canva generation.");
      }
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t call Canva generation.");
    } finally {
      setCreating(false);
    }
  }

  async function onCreateAsset(assetId: string) {
    await createInCanva(assetId);
  }

  async function onCreateKit() {
    await createInCanva();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <p className="font-display text-xl tracking-tight">
          Overnight
        </p>
        {campaign ? (
          <button
            type="button"
            onClick={() => {
              setCampaign(null);
              setError(null);
            }}
            className="text-sm text-[#1a1410]/60 hover:text-[#1a1410]"
          >
            Try another site
          </button>
        ) : (
          <p className="hidden text-sm text-[#1a1410]/50 sm:block">
            Paste a site. Walk away with a campaign.
          </p>
        )}
      </header>

      {!campaign ? (
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
          <h1 className="max-w-3xl text-center font-display text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            Your website,
            <br />
            as a campaign.
          </h1>
          <p className="mt-6 max-w-md text-center text-base text-[#1a1410]/65">
            Overnight reads the live page — name, colors, screenshot — and
            lays out a kit. Canva generation is stubbed until that API ships.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="url"
              inputMode="url"
              required
              placeholder="https://your-site.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="h-12 flex-1 rounded-full border border-[#1a1410]/15 bg-white px-5 text-base outline-none ring-[#1a1410]/20 placeholder:text-[#1a1410]/35 focus:ring-2"
            />
            <button
              type="submit"
              disabled={Boolean(stage)}
              className="h-12 rounded-full bg-[#1a1410] px-6 text-sm font-medium text-[#f7f1e6] disabled:opacity-60"
            >
              {stage ?? "Make the kit"}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example.url}
                type="button"
                disabled={Boolean(stage)}
                onClick={() => {
                  setUrl(example.url);
                  void analyze(example.url);
                }}
                className="rounded-full border border-[#1a1410]/12 bg-white/60 px-3 py-1 text-sm text-[#1a1410]/70 hover:bg-white"
              >
                Try {example.label}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mt-6 max-w-md text-center text-sm text-[#9b2c1a]">
              {error}
            </p>
          ) : null}
        </main>
      ) : (
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20 sm:px-10">
          {error ? (
            <p className="mb-6 text-sm text-[#9b2c1a]">{error}</p>
          ) : null}
          <KitBoard
            campaign={campaign}
            onCreateAsset={onCreateAsset}
            onCreateKit={onCreateKit}
            creating={creating}
          />
        </main>
      )}

      {results ? (
        <CanvaPayloadDialog results={results} onClose={() => setResults(null)} />
      ) : null}
    </div>
  );
}
