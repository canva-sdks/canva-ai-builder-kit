# Social Campaign Generator

Paste a website, get a campaign kit. This recipe reads the live page (name, colors, logo, screenshot) and lays out LinkedIn/OG, story, square, portrait, email header, and a one-pager.

A live demo is available at [Campaign Generator](https://overnight-beta.vercel.app/).

Canva design generation is stubbed in `src/lib/canva/generate-design.ts` until the relevant REST API is available. The rest of the app is wired: analyze → kit previews → “Create in Canva” shows the payload that would be sent.

## Run locally

```bash
cd recipes/canva-social-campaign
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try Linear, Stripe, or paste any public URL.

## Canva hook

When design generation is available, implement `generateDesign()` in `src/lib/canva/generate-design.ts`:

1. Upload `logoUrl` / `imageUrl` via the Assets API
2. POST `query` + `design_type` (+ `asset_ids`)
3. Return the design id, edit URL, and thumbnail

`generateCampaignKit()` and `POST /api/canva/generate` already call that function.
