# Project Name

Brief description of what this template, skill, or workflow helps an agent do.

## Overview

Explain the problem this resource solves and who should use it.

## What's Included

- `AGENTS.md` - Default instructions for working with this project. Used for OpenAI tool: ChatGPT, Codex.
- `CLAUDE.md` - Project context for Claude-based agents.

## Getting Started

1. Copy the files or directories you need into your project.
2. Replace project-specific placeholders and links.
3. Review the instructions with the team before using them in production.

## Usage

Overview of all the templates in this folder and best practices when adding them to your skills folders.

### AGENTS.md

This file is the fallback that Agents will use, and the prefered style for OpenAI-based projects. 

Keep the instructions to 300-600 words, 900 word max. If you need more detailed files, use the `references/` infrastructure. 

### CLAUDE.md

This file is the default for Claude-based projects. 

Keep the instructions around 50 lines / a few thousand tokens, and ideally short enough to skim in under a minute. The file should be no more than 200 lines. 

Things to keep in mind: 

- CLAUDE.md gets loaded into context on every session, so it's a standing tax on your context window — bloat there is bloat in every conversation, forever.

 - Anything that reads like reference documentation (full API lists, exhaustive style guides) belongs in a linked doc, not inline. Claude can read that file on demand if it needs it. CLAUDE.md should point to it, not contain it.

## Contributing

Explain how to propose updates, where new tutorials or workflows belong, and how changes should be reviewed.

Before submitting changes:

- Test the documented happy path.
- Check at least one relevant failure case.
- Update links, examples, and version-dependent assumptions.


## License

Add the project license or licensing guidance here.
