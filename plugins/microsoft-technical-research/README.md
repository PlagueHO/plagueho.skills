# Microsoft Technical Research

Deep technical research on Microsoft technologies with multi-agent
orchestration and structured documentation output.

## Skills

| Skill | Description |
|-------|-------------|
| [create-microsoft-research-plan](skills/create-microsoft-research-plan/) | Generate structured research plans with scope, areas, search terms, and output mapping. |
| [research-note-template](skills/research-note-template/) | Extract structured notes from sources using standardized extraction rules. |
| [research-output-scaffolding](skills/research-output-scaffolding/) | Scaffold the .research/ folder structure with note directories and section placeholders. |

## Agents

| Agent | Description |
|-------|-------------|
| [research-microsoft-technology](agents/research-microsoft-technology.agent.md) | Orchestrator — coordinates the full research lifecycle from plan to finished output. |
| [research-source-discovery](agents/research-source-discovery.agent.md) | Discovers and ranks candidate sources across all enabled research areas. |
| [research-deep-reader](agents/research-deep-reader.agent.md) | Fetches sources and extracts structured notes following extraction rules. |
| [research-content-writer](agents/research-content-writer.agent.md) | Synthesizes notes into polished output sections with full attribution. |
| [research-quality-reviewer](agents/research-quality-reviewer.agent.md) | Reviews output for attribution, completeness, and source validity. |

## Research Workflow

```text
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Plan Skill │───▶│  Scaffolding │───▶│ Orchestrator│
└─────────────┘    └──────────────┘    └──────┬──────┘
                                              │
                   ┌──────────────────────────┼─────────────────────┐
                   ▼                          ▼                     ▼
          ┌────────────────┐      ┌────────────────┐    ┌──────────────────┐
          │Source Discovery│      │  Deep Reader   │    │ Content Writer   │
          └────────────────┘      └────────────────┘    └──────────────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────┐
                                                        │Quality Reviewer  │
                                                        └──────────────────┘
```

## Output Structure

All research output is written to `.research/<topic-slug>/` in the
workspace root:

```text
.research/<topic-slug>/
├── plan.md              # Research plan (scope, areas, search terms)
├── log.md               # Activity log (all agent actions)
├── sources.md           # Discovered sources with relevance scores
├── review.md            # Quality review report
├── notes/
│   ├── docs/            # Microsoft Learn documentation notes
│   ├── tech/            # Technical documentation notes
│   ├── blogs/           # Blog and article notes
│   ├── arch/            # Architecture pattern notes
│   ├── samples/         # Code sample notes
│   ├── solutions/       # Solution accelerator notes
│   └── other/           # Community and third-party notes
└── output/
    ├── README.md        # Section index with status
    ├── 01-overview.md   # Synthesized output sections
    ├── 02-architecture.md
    └── ...
```

## Research Purposes

| Purpose | Description | Target Audience |
|---------|-------------|-----------------|
| `deep-guide` | Comprehensive technical reference | Architects, senior engineers |
| `presentation` | Tech talk or demo deck | Conference/meetup attendees |
| `lab` | Hands-on workshop exercises | Developers learning through practice |
| `demo` | Sample solution or proof-of-concept | Developers evaluating for adoption |

## Usage

```text
@research-microsoft-technology research Azure Container Apps dynamic sessions for a deep-guide
```

Or invoke the plan skill directly:

```text
create a research plan for Azure AI Foundry as a presentation
```
