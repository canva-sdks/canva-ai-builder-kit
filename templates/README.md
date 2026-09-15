# Agent Template Guide

This folder contains starter instruction files for AI coding agents. It is meant to help you add project-specific guidance to a repo without writing a large, generic instruction set from scratch.

## What this is for

Use these files when you want an agent to understand:

- the repo's purpose and architecture
- the preferred implementation patterns
- which tools, frameworks, or services are expected
- the repo-specific constraints and review standards

This is most useful for repos that are being worked on by AI tools, agentic workflows, or multi-agent systems.

## Included files

- `AGENTS.md` — the default project instructions for agent-based workflows, especially for OpenAI-style and general agent tooling.
- `CLAUDE.md` — a shorter, more concise instruction file for Claude-based sessions.

## When to use them

Copy one or both files into a project when you want the repo to provide a consistent operating guide for AI assistants.

Use `AGENTS.md` when you want a richer project brief, including:

- the product or technical goal
- architecture boundaries
- design or implementation decisions
- repo conventions and rules

Use `CLAUDE.md` when you want a lighter-weight summary that can be loaded into context repeatedly. It should stay short and highly scannable.

## Recommended structure

Keep the file focused on the project, not on generic best practices.

A good template should include:

1. purpose of the project
2. architecture and folder responsibilities
3. important constraints or conventions
4. commands for local development and validation
5. definition of done for a feature or fix

## Good guidance vs. bad guidance

Good agent instructions are:

- specific to the repository
- short enough to read quickly
- explicit about preferred patterns
- concrete about what to validate

Avoid:

- lots of generic software advice
- long API reference dumps
- duplicated documentation that already exists elsewhere
- vague instructions like “be careful” or “follow best practices”

## AGENTS.md guidance

Use `AGENTS.md` as the main source of project-level operating rules.

A strong version usually stays around 300–600 words, with a hard cap around 900 words unless there is a clear reason to be longer.

Keep it focused on:

- project purpose
- repo structure
- architectural rules
- preferred implementation choices
- verification steps

If a topic needs deeper documentation, link to a dedicated reference doc instead of stuffing it into the agent file.

## CLAUDE.md guidance

Use `CLAUDE.md` for a shorter, session-friendly overview.

Keep it brief: roughly 50 lines or a few thousand tokens, and ideally readable in under a minute.

Best practices:

- prioritize the most important project context
- keep it scannable and minimal
- link to docs instead of repeating them inline
- avoid bloating every session with reference material

## Suggested usage flow

1. Copy the file or files you need into the target repo.
2. Replace the placeholders and project-specific details.
3. Update the instructions to reflect the actual repo structure.
4. Keep the guidance aligned with the current stack, commands, and conventions.
5. Review the file with the team before using it in production workflows.

## Contribution guidance

If you update these templates:

- keep them general enough to be reusable
- prefer concise examples over long narrative blocks
- avoid template content that is too tied to one product or codebase
- ensure the examples still match common agent workflows

## Practical rule

The file should help an agent make good decisions quickly, not act as a second README.

If the instructions can be summarized in one or two screens, that is usually the right level of detail.
