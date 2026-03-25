# Plugin Marketplace

This directory contains the VS Code agent plugin marketplace index for
**PlagueHO/plagueho.skills**. Plugin skills are defined under
[`../../plugins/`](../../plugins/) following the
[github/awesome-copilot](https://github.com/github/awesome-copilot) layout.

## Setup

Add the marketplace to your VS Code `settings.json`:

```json
"chat.plugins.enabled": true,
"chat.plugins.marketplaces": [
    "PlagueHO/plagueho.skills"
]
```

Then open the Extensions view (`Ctrl+Shift+X`), type `@agentPlugins`, and
install the plugins you need.

## Repository Layout

```text
plugins/
├── <plugin-name>/
│   ├── plugin.json            # Plugin definition (source of truth)
│   ├── README.md              # Plugin documentation
│   └── skills/
│       └── <skill-name>/
│           └── SKILL.md
.github/
├── plugin/
│   ├── marketplace.json       # Aggregated marketplace index (generated)
│   ├── marketplace.schema.json
│   └── plugin.schema.json     # Schema for individual plugin.json files
scripts/
├── Update-MarketplaceFromPlugins.ps1  # PowerShell aggregation script
└── update-marketplace-from-plugins.sh # Bash aggregation script
```

Each plugin contains its own `plugin.json` at the plugin root that defines its
metadata, skills, agents, and hooks. The root `marketplace.json` is
**generated** by aggregating all individual `plugin.json` files.

## Available Plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| [`azure-architecture-center`](../../plugins/azure-architecture-center/) | `discover-multitenant-service-updates`, `review-multitenant-doc` | Skills for Azure Architecture Center documentation maintainers: discover needed updates and review multitenant docs. |
| [`azure-infrastructure`](../../plugins/azure-infrastructure/) | `azure-github-managed-identity`, `update-avm-modules` | Provision Azure identities and manage Azure Verified Module versions. |
| [`content-and-learning`](../../plugins/content-and-learning/) | `ai-content-readiness-review`, `create-learning-pathway` | Review content for AI readiness and generate Microsoft technology learning pathways. |
| [`developer-environment`](../../plugins/developer-environment/) | `create-dotfiles-repo`, `vscode-profile-sync` | Scaffold dotfiles repos and sync VS Code profiles across editions. |
| [`dotnet-modernization`](../../plugins/dotnet-modernization/) | `dotnet-sdk-style-upgrade` | Convert legacy .NET project files to modern SDK-style format. |
| [`skill-lifecycle`](../../plugins/skill-lifecycle/) | `skill-creator`, `convert-prompt-to-skill`, `create-skill-from-pr` | Create, convert, and generate agent skills from prompts and pull requests. |
| [`suggest-awesome-github-copilot`](../../plugins/suggest-awesome-github-copilot/) | 4 suggest-awesome skills | Discover and install GitHub Copilot assets from the awesome-copilot repository. |

## Marketplace Schema

The marketplace index is validated against
[`marketplace.schema.json`](marketplace.schema.json). Individual plugin files
are validated against [`plugin.schema.json`](plugin.schema.json).

Run validation locally:

```bash
# Validate marketplace.json
npx --yes ajv-cli validate \
  -s .github/plugin/marketplace.schema.json \
  -d .github/plugin/marketplace.json

# Validate individual plugin.json files
find plugins -maxdepth 2 -name 'plugin.json' -exec \
  npx --yes ajv-cli validate -s .github/plugin/plugin.schema.json -d {} \;
```

## Rebuilding marketplace.json from plugin.json Files

The marketplace index is regenerated from individual `plugin.json` files using:

```powershell
# PowerShell
./scripts/Update-MarketplaceFromPlugins.ps1

# Bash (requires jq)
./scripts/update-marketplace-from-plugins.sh
```

## Adding a New Plugin

1. Create `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`.
2. Create `plugins/<plugin-name>/plugin.json` with the
   plugin metadata (see `plugin.schema.json` for the schema).
3. Run the aggregation script to rebuild `marketplace.json`:

   ```powershell
   ./scripts/Update-MarketplaceFromPlugins.ps1
   ```

4. Run the schema validation to verify the result.
5. Run the `update-marketplace` skill to auto-generate the plugin README:

   ```powershell
   & ".github/skills/update-marketplace/scripts/Update-Marketplace.ps1" `
       -RepoRoot "." -UpdateReadmes
   ```
