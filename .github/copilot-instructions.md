# GitHub Copilot Instructions

These instructions apply to all GitHub Copilot interactions in this repository.

## Repository Purpose

This is the agent skills and plugin marketplace repository for Daniel
Scott-Raynsford (PlagueHO). It contains GitHub Copilot agent plugin bundles
with skills, scripts, and reference data distributed via the VS Code
plugin marketplace.

## General Coding Principles

- Write clean, readable, and maintainable code
- Follow the principle of least privilege for security
- Prefer explicit over implicit
- Write self-documenting code with meaningful names
- Keep functions small and focused on a single responsibility
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

## Documentation

- All scripts should include a header comment explaining purpose, parameters, and usage
- Plugin READMEs should list all included skills with descriptions

## Security

- Never commit secrets, passwords, API keys, or other sensitive information
- Use environment variables or secret management tools for sensitive values
- Validate all inputs, especially when processing external data
