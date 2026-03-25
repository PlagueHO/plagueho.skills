# GitHub Copilot Instructions

## Repository Purpose

Agent skills and plugin marketplace for Daniel Scott-Raynsford (PlagueHO). Contains Copilot plugin bundles with skills, scripts, and reference data ## General Coding Principles

- Write clean, readable, maintainable code
- Apply least privilege for security
- Prefer explicit over implicit
- Use self-documenting names
- Keep functions small; single responsibility
- Handle errors explicitly and gracefully

## Code Style

- Use consistent indentation (2 spaces for YAML/JSON, 4 spaces for PowerShell/Python)
- Include a newline at the end of every file
- Avoid trailing whitespace
- Keep lines under 120 characters where possible

## Skill Authoring

- Skills go in `plugins/<plugin>/skills/<skill-name>/SKILL.md`
- Every SKILL.md must have YAML frontmatter with `name` and `description`
- Keep SKILL.md body under 500 lines; split into `references/` files if needed
- Use kebab-case for skill and plugin names
- Include validation steps in every skill

## Plugin Structure

- Each plugin has a `plugin.json` at its root
- Plugin `repository` field must point to `https://github.com/PlagueHO/skills`
- After adding/modifying plugins, run `scripts/Update-MarketplaceFromPlugins.ps1`

## Adding a New Skill — Required Updates

When adding a skill to any plugin, **must** update all of the following in the same change:

1. **`plugins/<plugin>/plugin.json`** — add the skill entry. 2. **`.github/plugin/marketplace.json`** — bump the plugin's `version` (patch or minor).
3. **`.claude-plugin/marketplace.json`** — mirror the same version bump.
4. **`README.md`** (root) — update the plugin row if description or skill count changes.
5. **`docs/images/overview.svg`** — update the slide's `<text class="count">` and skill name list.

Omitting these updates leaves the marketplace index, README, and overview out of sync.
 Documentation

- All scripts should include a header comment explaining purpose, parameters, and usage
- Plugin READMEs should list all included skills with descriptions

## Security

- Never commit secrets, passwords, API keys, or other sensitive information
- Use environment variables or secret management tools for sensitive values
- Validate all inputs, especially when processing external data
