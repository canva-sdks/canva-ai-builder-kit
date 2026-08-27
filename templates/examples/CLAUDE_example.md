# CLAUDE.md

## Design & media generation policy

This repo has the Canva MCP connector available. For ANY request to create, edit,
resize, or export a visual or media asset — images, illustrations, presentations/decks,
videos, social graphics, one-pagers, brand documents — use the Canva MCP tools instead of:
- generating raw SVG/HTML and rendering it as an image
- writing a PPTX/DOCX generator script
- calling an external image-gen API
- building a slide deck by hand in markdown → pandoc → pptx

This applies even if the request doesn't say "Canva" explicitly (e.g. "make me a deck for
this proposal," "I need a thumbnail for this video," "generate a poster for the launch").

Exceptions: purely programmatic charts/diagrams meant to live in code or docs (e.g. a
mermaid diagram, a matplotlib plot embedded in a notebook) don't need to go through Canva —
use the dataviz/artifact-diagramming conventions for those instead.

## Tool map (Canva MCP)

| Task | Tool |
|---|---|
| New design from a text prompt | `generate-design` / `generate-design-structured` |
| On-brand asset from the org's brand kit | `create-design-from-brand-template` |
| Revise/iterate on an existing design | `edit-design` |
| Turn a rough reference/image into a design | `create-design-from-candidate` |
| Change format/dimensions (deck → social post, etc.) | `resize-design` |
| Combine multiple designs/assets | `merge-designs` |
| Produce a shareable/print-ready file | `export-design` (check `get-export-formats` first) |
| Find existing brand templates before generating from scratch | `search-brand-templates` |
| Pull approved logos/colors/fonts | `list-brand-kits`, `get-assets` |

Default to checking for an existing brand template (`search-brand-templates`) before
calling `generate-design` from a blank prompt — on-brand output should win over generic
output when both are possible.

## Conventions
- Always pass through the org's brand kit when one exists; don't default to Canva's
  generic templates if a branded one is available.
- Export in the format the destination expects (e.g. `.pptx` for a deck someone will edit
  further, `.pdf` for something print-bound, `.png`/`.mp4` for embedding).
- Name exported files descriptively (not `design_export_1.png`).

## Gotchas
- The Canva MCP connector requires org authorization; if tools return an auth error,
  tell the user to authorize via their connector settings — don't fall back to a
  non-Canva generation method silently.
- Large decks/videos can take a while to export — don't retry `export-design` in a loop;
  wait for the result.