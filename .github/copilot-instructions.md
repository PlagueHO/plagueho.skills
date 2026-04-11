# GitHub Copilot Instructions

## Repository Purpose

Agent skills and plugin marketplace for Daniel Scott-Raynsford (PlagueHO).
Contains Copilot plugin bundles with skills, scripts, and reference data.
See `AGENTS.md` for repository layout, build commands, and the atomic checklist
required when adding a new skill.

## Skill Authoring — SKILL.md

### Frontmatter

```yaml
---
name: <skill-name>          # Required: lowercase, hyphens, matches directory name
description: >-             # Required: 1–1024 chars; what + when + trigger keywords
  <description>
metadata:                   # Optional
  author: <author>
  version: "1.0"
  reference: <URL>
compatibility:              # Optional: list of supported environments
  - GitHub Copilot
  - VS Code
argument-hint: >-           # Optional: prompt hint shown on invocation
  <hint>
user-invocable: true        # Optional: expose skill for direct user invocation
---
```

> Do **not** include `allowed-tools` — this field is incompatible with GitHub Copilot.

### Description Pattern

Workflow skills follow this established format:

```text
**WORKFLOW SKILL** — <one-line summary>. WHEN: "<phrase1>", "<phrase2>".
INVOKES: <tools>. FOR SINGLE OPERATIONS: <lighter alternative>.
```

**Good** — specific, includes trigger keywords, explains when:

```yaml
description: >-
  **WORKFLOW SKILL** — Update Azure Verified Modules (AVM) to their latest
  versions in Bicep files. WHEN: 'update AVM', 'update Bicep modules', 'latest
  AVM versions'. INVOKES: run_in_terminal for MCR API queries and bicep lint.
  FOR SINGLE OPERATIONS: Use az bicep build to validate individual files.
```

**Bad** — vague, no trigger context:

```yaml
description: Helps with Bicep files.
```

### `name` Field Rules

- Lowercase letters `a-z`, digits `0-9`, hyphens only
- Must match the skill directory name exactly
- No leading, trailing, or consecutive hyphens (`--`)
- 1–64 characters

### Body Writing

- Use **imperative form**: "Create the file", not "You should create the file"
- Use `## Step N — Title` headings for multi-step procedures
- Keep under 500 lines; move bulk detail to `references/` files
- Reference bundled files using relative paths from the skill root
- Structure scripts, references, and assets in their own subdirectories

## Plugin Definition — plugin.json

Required fields: `name`, `description`, `version`.

```json
{
  "name": "my-plugin",
  "description": "Short description of what the plugin does.",
  "version": "1.0.0",
  "repository": "https://github.com/PlagueHO/plagueho.skills",
  "skills": ["./skills/<skill-name>"]
}
```

- `name` must match `^[a-z0-9][a-z0-9-]*$`
- `version` is semver `x.y.z`
- `repository` must always be `"https://github.com/PlagueHO/plagueho.skills"`
- Skills listed as relative paths: `"./skills/<skill-name>"`

## Marketplace Sync

`.github/plugin/marketplace.json` is the source of truth.
`.claude-plugin/marketplace.json` must be an **exact copy** — every field
(`name`, `source`, `description`, `version`) identical. The CI `diff` step fails on any divergence.

When a skill is added or modified, bump the plugin `version` (patch or minor)
in both marketplace files and ensure all 7 files in the atomic checklist (see `AGENTS.md`) are updated in the same change.

## Test Files — trigger_tests.yaml

```yaml
name: <skill-name>-triggers
skill: <skill-name>

shouldTriggerPrompts:
  - "<phrase that should activate the skill>"

shouldNotTriggerPrompts:
  - "<phrase that should NOT activate the skill>"
```

Place in `tests/<skill-name>/trigger_tests.yaml`. Derive trigger phrases
directly from the `WHEN:` keywords in the skill's `description`.

## Markdown Formatting

Governed by `.markdownlint.json`. Key active rules:

- Bullet lists: use `-` (not `*` or `+`)
- Fenced code blocks: always specify a language identifier; use backticks
- Emphasis: `*italic*` and `**bold**` (not underscores)
- Do not hard-wrap lines (effective limit is 400 chars)
- No trailing whitespace; newline at end of every file

## Code Style

| Concern | Rule |
|---------|------|
| YAML/JSON indentation | 2 spaces |
| PowerShell/Python indentation | 4 spaces |
| Script filenames | kebab-case; always provide `.ps1` + `.sh` variants |
| Script headers | Comment block: purpose, parameters, usage |

## Security

- Never commit secrets, passwords, API keys, or tokens
- Validate all inputs in scripts, especially when processing external data
- Apply least-privilege access in any generated infrastructure code
