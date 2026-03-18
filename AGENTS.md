# Repository Instructions

This repository contains skill plugins under `plugins/`. Each subdirectory
in `plugins/` is an independent plugin (e.g., `plugins/azure-infrastructure`,
`plugins/skill-lifecycle`).

## Structure

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
```

## Adding a New Skill

1. Place the skill under the appropriate plugin's `skills/` directory.
2. Ensure the `SKILL.md` has valid YAML frontmatter with `name` and `description`.
3. Update the plugin's `plugin.json` to reference the new skill.
4. Run the marketplace aggregation script to update `marketplace.json`.
5. Add tests under `tests/<skill-name>/`.

## Marketplace

Run `scripts/Update-MarketplaceFromPlugins.ps1` (PowerShell) or
`scripts/update-marketplace-from-plugins.sh` (Bash) to rebuild the
marketplace index from individual `plugin.json` files.
