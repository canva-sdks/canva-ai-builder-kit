# Overnight

Paste a website, get a campaign kit. Overnight reads the live page (name, colors, logo, screenshot) and lays out LinkedIn/OG, story, square, portrait, email header, and a one-pager.

Canva Design Generation is stubbed in `src/lib/canva/generate-design.ts` until that Connect API ships. The rest of the app is wired: analyze → kit previews → “Create in Canva” shows the payload that would be sent.

## Run locally

```bash
cd examples/overnight
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try Linear, Stripe, or paste any public URL.

## Canva hook

When Design Generation is available, implement `generateDesign()` in `src/lib/canva/generate-design.ts`:

1. Upload `logoUrl` / `imageUrl` via the Assets API
2. POST `query` + `design_type` (+ `asset_ids`)
3. Return design id, edit URL, and thumbnail

`generateCampaignKit()` and `POST /api/canva/generate` already call that function.
