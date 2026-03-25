# PlagueHO Agent Skills

This repository contains Daniel Scott-Raynsford's curated set of agent
skills and plugin bundles for coding agents. For information about the
Agent Skills standard, see [agentskills.io](https://agentskills.io).

> **Note:** This is a personal repository/marketplace for plugins, skills,
> and agents that I develop and use across my own projects. When a plugin or
> skill proves to be generally beneficial, it will be contributed upstream to
> the [github/awesome-copilot](https://github.com/github/awesome-copilot)
> community repository.

## What's Included

<p align="center">
  <img src="docs/images/overview.svg" alt="Plugin catalog overview" width="840"/>
</p>

| Plugin | Description |
|--------|-------------|
| [azure-architecture-center](plugins/azure-architecture-center/) | Skills for Azure Architecture Center documentation maintainers: review multitenant guidance and docs. |
| [azure-infrastructure-deployment](plugins/azure-infrastructure-deployment/) | Provision Azure identities and manage Azure Verified Module versions. |
| [content-and-learning](plugins/content-and-learning/) | Review content for AI readiness and generate Microsoft technology learning pathways. |
| [developer-environment](plugins/developer-environment/) | Scaffold dotfiles repos and sync VS Code profiles across editions. |
| [dotnet-modernization](plugins/dotnet-modernization/) | Convert legacy .NET project files to modern SDK-style format. |
| [github-workflows](plugins/github-workflows/) | Evaluate PR review comments, merge Dependabot PRs in parallel, and optimize Copilot resources. |
| [skill-lifecycle](plugins/skill-lifecycle/) | Create, convert, and generate agent skills from prompts and pull requests. |
| [suggest-awesome-github-copilot](plugins/suggest-awesome-github-copilot/) | Discover and install GitHub Copilot assets from the awesome-copilot repository. |

## Installation

### VS Code / VS Code Insiders

Add the marketplace to your VS Code `settings.json`:

```jsonc
// settings.json
{
  "chat.plugins.enabled": true,
  "chat.plugins.marketplaces": ["PlagueHO/skills"]
}
```

Once configured, type `/plugins` in Copilot Chat or use the `@agentPlugins`
filter in Extensions to browse and install plugins from the marketplace.

### Copilot CLI / Claude Code

1. Launch Copilot CLI or Claude Code
2. Add the marketplace:

   ```text
   /plugin marketplace add PlagueHO/skills
   ```

3. Install a plugin:

   ```text
   /plugin install <plugin>@plagueho-agent-skills
   ```

4. Restart to load the new plugins
5. View available skills:

   ```text
   /skills
   ```

## Repository Structure

```text
PlagueHO/skills/
├── plugins/                    # Agent plugin bundles (canonical layout)
│   ├── <plugin-name>/
│   │   ├── plugin.json         # Plugin definition (source of truth)
│   │   ├── README.md           # Plugin documentation
│   │   └── skills/
│   │       └── <skill-name>/
│   │           └── SKILL.md
│   └── ...
├── tests/                      # Skill tests
│   └── <skill-name>/
│       └── trigger_tests.yaml
├── scripts/                    # Marketplace build scripts
│   ├── Update-MarketplaceFromPlugins.ps1
│   └── update-marketplace-from-plugins.sh
├── docs/                       # Reference documentation
│   └── SKILLS.md
├── .github/
│   ├── plugin/                 # Marketplace index and schemas
│   │   ├── marketplace.json
│   │   ├── marketplace.schema.json
│   │   └── plugin.schema.json
│   ├── workflows/              # CI workflows
│   ├── CODEOWNERS
│   └── copilot-instructions.md
├── .claude-plugin/             # Claude plugin registry
│   └── marketplace.json
├── CONTRIBUTING.md
├── AGENTS.md
├── LICENSE
├── SECURITY.md
└── README.md
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and how
to add a new plugin.

## License

See [LICENSE](LICENSE) for details.
