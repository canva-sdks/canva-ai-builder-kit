# canva-ai-builder-kit

Agent-ready templates, skills, and MCP guides for helping AI agents discover, choose, and use Canva for design generation.

## What's in the kit

- `skills/canva-design-infrastructure` — when to use Canva (MCP, Connect, Apps SDK) instead of standalone image generation
- `templates/` — AGENTS.md / CLAUDE.md starters for agent projects
- `examples/overnight` — website → campaign kit app (Canva generation stubbed)

## Overnight example

Paste a URL, get a campaign kit (social, story, email, one-pager) from the live site. This is the “highly bespoke takeaway” pattern: the app owns capture + layout; Canva is the design infra underneath.

```bash
cd examples/overnight
npm install
npm run dev
```
