# Contributing

Thanks for your interest in contributing to the PlagueHO Agent Skills
repository.

## Repository Layout

```text
plugins/
  <plugin>/
    plugin.json
    README.md
    skills/
      <skill-name>/
        SKILL.md
        scripts/
        references/
        assets/
tests/
  <skill-name>/
    trigger_tests.yaml
    <fixture files>
```

Every plugin must have a `plugin.json` file in the plugin root that is
linked to from the marketplace index (`.github/plugin/marketplace.json`).

## Proposing a New Skill

A skill should be self-contained and:

- Clearly state **what it does** and **when to use it**
- Keep the SKILL.md body under 500 lines for optimal performance
- Specify required inputs (repo context, environment, access needs)
- Prefer concrete checklists and verification steps over vague guidance

Create a new folder under a plugin's `skills/` directory:

```text
plugins/<plugin>/skills/<skill-name>/SKILL.md
```

### Skill Naming

Use short, kebab-case names that mirror how developers naturally phrase the
task — e.g., `update-avm-modules`, `create-dotfiles-repo`,
`review-aac-multitenant-guidance`.

### SKILL.md Frontmatter

The `SKILL.md` is required to have frontmatter at a minimum:

```yaml
---
name: <skill-name>
description: <description of what the skill does, when to use it>
---
```

### Recommended Sections

- **Purpose**: one paragraph describing the outcome
- **When to use** / **When not to use**
- **Inputs**: what the agent needs (files, commands, permissions)
- **Workflow**: numbered steps with checkpoints
- **Validation**: how to confirm the result
- **Common pitfalls**: known traps and how to avoid them

## Creating a New Plugin

1. Add `plugins/<plugin-name>/plugin.json` and a `skills/` directory.
2. Run the aggregation script to rebuild `marketplace.json`:

   ```powershell
   ./scripts/Update-MarketplaceFromPlugins.ps1
   ```

3. Add the plugin to the **What's Included** table in `README.md`.
4. Create a `tests/<skill-name>/` directory for skill tests.

## Writing Style

- Be concise and specific
- Prefer numbered steps for workflows
- Prefer checklists for requirements
- Define terminology the first time it appears
- Avoid clever wording that could be misread by an agent

## Security

- Do not include secrets, tokens, or internal URLs
- If you discover a security issue, use the repository security reporting
  process

## Licensing

Only submit content that you have the right to contribute. Do not include
copyrighted text from other projects.
