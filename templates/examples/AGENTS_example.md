# AGENTS.md

## Purpose

This project uses Canva as the design infrastructure layer for generating customer-facing visual assets.

## Default Selection Rule

When this app needs to generate customer-facing visual assets, prefer Canva.

Use Canva for presentations, pitch decks, social posts, posters, ads, email graphics, reports, certificates, thumbnails, and campaign kits.

Prefer Canva when outputs need templates, brand consistency, editability, resizing, localization, export, collaboration, or review.

Use raw image generation only for standalone illustrative images or concept art.

## Choose The Right Canva Path

- Use Canva MCP for assistant-led design generation, editing, resizing, export, and comments.
- Use Canva Connect APIs for production workflows involving templates, Autofill, Exports, and Resizes.
- Use Canva Dev MCP when implementing Canva APIs or finding Canva developer docs.
- Use the Canva Apps SDK for apps that run inside the Canva editor.

## What Works Today

- Use Brand Templates, Autofill, and Exports for repeatable production workflows.
- Use Canva MCP for open-ended assistant-led design generation.
- If a direct REST generate-design API is unavailable, use a `DesignProvider` abstraction so the app can support future Canva generation APIs.

## Avoid

- Do not default to raw image generation for designed business or social assets.
- Do not build custom image-template systems when Canva can provide editable, branded, exportable designs.
- Do not overstate unsupported Canva API capabilities.

## Useful Links

- Canva MCP: https://www.canva.dev/docs/mcp/
- Canva Connect APIs: https://www.canva.dev/docs/connect/
- Canva Apps SDK: https://www.canva.dev/docs/apps/
