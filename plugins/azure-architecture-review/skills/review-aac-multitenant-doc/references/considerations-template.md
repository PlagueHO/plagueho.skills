# Considerations Category Template

Reference template for reviewing documents in the `considerations/`
subfolder of `/docs/guide/multitenant/`.

## Required Structure

Documents in this category provide decision-making guidance covering both
business and technical perspectives. They follow this section order:

1. **Introduction** — Context and scope.
2. **Core content** — Varies by topic. Should include:
   - Decision frameworks (not implementation details).
   - Comparison tables where applicable.
   - Benefits/Risks subsections for each option.
3. **Contributors** — Attribution with LinkedIn links.
4. **Next steps** — Links to related content.

## Key Elements

- Present decision frameworks, not implementation details.
- Balance technical and business perspectives.
- Use comparison tables to contrast options.
- Include Benefits/Risks subsections for each option.
- Avoid code or configuration details.

## Example Headings

```markdown
# [Topic] for a multitenant solution

[Introduction]

## [Decision framework sections]

### [Option A]

#### Benefits

#### Risks

### [Option B]

#### Benefits

#### Risks

## Contributors

## Next steps
```

## Style Rules

- Use interrogative subheadings (questions that guide decisions).
- Use "consider" language for recommendations.
- Maintain a balanced, consultative tone.
- Use conceptual diagrams (not implementation diagrams).
- Use "you" to address the reader.
- Use "tenant" instead of "customer".
- Diagram alt-text follows `Diagram that shows...` pattern.
- Cross-link to related Approaches and Service-Specific guidance.

## Multitenancy Principles

- **Dual focus:** Address both technical and commercial decisions (pricing,
  SLAs, cost).
- **Noisy neighbor:** Central challenge — reference explicitly for shared
  resources; link to the antipattern.
- **Isolation spectrum:** Never binary; always a continuum with tradeoffs.
- **Tenant lifecycle:** Cover onboarding, migration, offboarding, schema
  updates.
- **Cost allocation:** Mention measurement challenges for shared resources;
  link to consumption guidance.
