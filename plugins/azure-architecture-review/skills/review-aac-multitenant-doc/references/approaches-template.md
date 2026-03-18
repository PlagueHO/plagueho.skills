# Approaches Category Template

Reference template for reviewing documents in the `approaches/` subfolder
of `/docs/guide/multitenant/`.

## Required Structure

Documents in this category describe architectural patterns across service
categories. They follow this section order:

1. **Introduction** — Service category overview.
2. **Key considerations and requirements** — Must include subsections for:
   - Scale
   - Performance predictability
   - Isolation
   - Complexity (implementation and operations)
   - Cost
3. **Approaches and patterns to consider** — Each pattern must include:
   - Benefits subsection
   - Risks subsection
4. **Antipatterns to avoid** — Common mistakes and pitfalls.
5. **Contributors** — Attribution with LinkedIn links.
6. **Next steps / Related resources** — Links to related content.

## Example Headings

```markdown
# Architectural approaches for [category] in multitenant solutions

## Key considerations and requirements

### Scale

### Performance predictability

### Isolation

### Complexity

### Cost

## Approaches and patterns to consider

### [Pattern name]

#### Benefits

#### Risks

## Antipatterns to avoid

## Contributors

## Next steps
```

## Style Rules

- Use "you" to address the reader.
- Use concrete Azure service names (not generic terms).
- Use "tenant" instead of "customer".
- Diagram alt-text follows `Diagram that shows...` pattern.
- Reference the noisy neighbor problem explicitly for shared resources.
- Cross-link to related Considerations and Service-Specific guidance.

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
