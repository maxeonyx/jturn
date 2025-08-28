# Instructions for AI Assistants

This repository uses `AGENTS.md` files to guide contributors. Consult these files before making changes. Create additional `AGENTS.md` files in subdirectories when local instructions are needed and keep them up to date.

## Getting Started
- Review [FAQ.md](FAQ.md) for recurring issues or clarifications.
- Determine whether the repository uses Git or JJ. If `jj root` succeeds or a `.jj/` directory exists, follow [notes/jj.md](notes/jj.md). Otherwise, use Git.
- Commit frequently with clear messages.

## Project Overview
- Read the project vision in [notes/initial-vision.md](notes/initial-vision.md).
- `jj` overview: [notes/jj.md](notes/jj.md).
- Explore demos in the [demo/](demo/) directory, e.g. [demo/graph/index.html](demo/graph/index.html).
- When new directories are created, update this file with summaries and links to their README files.

## Development Practices
- Use **Test-Driven Development**: write tests before code.
- Start with small demos to validate ideas.
- Frontend uses **Vue.js**; server components use **Rust**; a VSCode extension is planned.
- Run all relevant programmatic checks and tests for changed files.

## Iteration Strategies
- Clarify tasks and ask questions before coding.
- Break features into small, achievable steps.
- Consider end-to-end behavior and edge cases when designing tests.
- Gather feedback early. Inspect internal state directly if stuck.

## Deployment Summary
See [site/README.md](site/README.md) for site details and [notes/release-notes.md](notes/release-notes.md) for version history.
1. Update the version in `site/package.json` and the release notes.
2. Commit and push the changes.
3. Monitor GitHub Actions with `gh run list` and `gh run watch <run-id>`.
4. Verify the deployed version at `https://maxeonyx.github.io/jturn/version.json`.

## Meta Workflow
- Maintain this system of `AGENTS.md` files. Add or refine instructions when workflows change.
- Link to existing documentation rather than duplicating instructions.
- Record challenges and their solutions in [FAQ.md](FAQ.md). Check this file before starting work and append new entries when useful.
- When adding new directories or functionality, include or update `AGENTS.md` and accompanying docs as needed.

## Directory Guides
- Additional instructions may exist in subdirectories. For the web site, see [site/AGENTS.md](site/AGENTS.md).
