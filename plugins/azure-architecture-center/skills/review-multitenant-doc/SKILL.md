---
name: review-multitenant-doc

description: >-
  **ANALYSIS SKILL** — Review Azure Architecture Center multitenant
  documentation for accuracy, structure, and style. Produces a categorized
  review report. WHEN: "review multitenant doc", "review AAC doc", "ISV
  architecture review", "SaaS documentation review", "multitenant doc
  review", "review approaches doc", "review service doc", "check AAC
  structure". INVOKES: microsoft-learn MCP, search, read. FOR SINGLE
  OPERATIONS: Use Microsoft Learn MCP directly.

metadata:
  author: PlagueHO
  version: "1.0"
  reference: https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview

compatibility: >-
  GitHub Copilot, VS Code. Requires microsoft-learn MCP tools
  (microsoft_docs_search, microsoft_docs_fetch,
  microsoft_code_sample_search).
---

# Review AAC Multitenant Documentation

Review Azure Architecture Center multitenant documentation for technical
accuracy, structural consistency, and style alignment. The review is scoped
to the document's category (Approaches, Considerations, or Service-Specific)
as determined by its folder path under `/docs/guide/multitenant/`.

> **Important:** "Tenant" means your customers or user groups — not Microsoft
> Entra tenants. Do not confuse these concepts throughout the review.

## Prerequisites

- **Microsoft Learn MCP tools** — `microsoft_docs_search`,
  `microsoft_docs_fetch`, and `microsoft_code_sample_search` for verifying
  technical claims against official docs.
- **Search tool** — for locating patterns and cross-references in the
  codebase.
- **Read tool** — for reading the target document and related files.

## MCP Tools Used

| Step | Tool | Query Pattern | Purpose |
|------|------|---------------|----------|
| 3 | `microsoft_docs_search` | `"<service> multitenancy best practices"` | Find multitenant guidance |
| 3 | `microsoft_docs_fetch` | URL from search results | Retrieve full doc pages |
| 3 | `microsoft_code_sample_search` | `"<service> <feature>"` | Validate code samples |

**CLI Fallback (if MCP unavailable):**
Browse Microsoft Learn directly at
`https://learn.microsoft.com/en-us/azure/<service>/` and search for
multitenancy-related content manually.

## Process

### Step 1 — Determine Document Category

Read the target document and determine its category from the subfolder path
in `/docs/guide/multitenant/`:

| Folder | Category | Reference |
|--------|----------|-----------|
| `approaches/` | Approaches | [approaches-template.md](references/approaches-template.md) |
| `considerations/` | Considerations | [considerations-template.md](references/considerations-template.md) |
| `service/` | Service-Specific | [service-template.md](references/service-template.md) |

Load the matching reference template — it contains the required structure,
style rules, and example headings for that category. Review ONLY against
the matching category's requirements.

If the folder path does not match any of the three categories, ask the user
for clarification before proceeding.

### Step 2 — Verify Structure

Compare the document's heading hierarchy and section ordering against the
required structure from the reference template. Check for:

1. All required sections are present.
2. Sections appear in the correct order.
3. Heading levels follow proper hierarchy (no skipped levels).
4. YAML front matter is valid and contains required fields.
5. Contributors section exists with LinkedIn links.

### Step 3 — Verify Technical Accuracy

Use Microsoft Learn MCP tools to validate technical claims:

1. `microsoft_docs_search` — Query: `"<service> multitenancy best practices"`.
2. `microsoft_docs_fetch` — Retrieve full content from promising results.
3. `microsoft_code_sample_search` — Query: `"<service> <feature>"` with
   `language` parameter when checking code samples.

Verify:

- Azure service names are current (not deprecated or renamed).
- Quotas, limits, and pricing models are accurate.
- Links to external documentation resolve correctly.
- Code samples match official patterns.
- Feature claims are grounded in official documentation.

### Step 4 — Check Multitenancy Coverage

Evaluate whether the document adequately addresses multitenant-specific
concerns. Reference the Multitenant Documentation Principles from the
appropriate category template and verify:

- **Isolation requirements** — Discusses isolation options and tradeoffs.
- **Noisy neighbor** — Referenced explicitly for shared resources; links to
  the antipattern article.
- **Cost allocation** — Mentions measurement challenges for shared resources;
  links to consumption guidance.
- **Tenant lifecycle** — Covers onboarding, migration, offboarding, and
  schema updates where applicable.
- **Isolation spectrum** — Presents isolation as a continuum, not binary.
- **Dual focus** — Addresses both technical and commercial decisions.

For Service-Specific documents, also verify:

- Comparison table exists with the correct columns and rows.
- Benefits/Trade-offs subsections are present for each isolation model.

### Step 5 — Check Style Alignment

Verify the document follows the style guidelines from the reference
template:

- Uses "you" to address the reader.
- Uses "tenant" instead of "customer".
- Diagram alt-text follows `Diagram that shows...` pattern.
- Proper markdown hierarchy is maintained.
- Callout syntax is correct (e.g., `> [!NOTE]`, `> [!WARNING]`).
- Code blocks have language tags.
- Cross-references link between Approaches, Considerations, and
  Service-Specific documents.
- Links to Well-Architected Framework and Cloud Design Patterns where
  appropriate.

### Step 6 — Check Scope Boundaries

Verify the document stays within its intended scope:

- **Do Not Review:** Code implementations, deployment scripts (unless
  illustrative), non-multitenancy content, general Azure guidance.
- **Always Preserve:** Contributors sections with attribution.
- **Never Invent:** Azure services or features — verify against official
  docs.

Flag if a document is in the correct folder but contains content from
another category (structural issue).

### Step 7 — Produce the Review Report

Output the review using this format:

```markdown
## Document Review: [filename]

**Path:** [full path]
**Category:** [Approaches/Considerations/Service-Specific] (from folder)
**Status:** [Brief assessment]

### Critical Issues (Accuracy)
1. [Issue] - **Location:** [ref] - **Current:** [problem]
   - **Fix:** [solution] - **Example:** [if needed]

### Important Issues (Consistency)
[Same format]

### Minor Issues (Polish)
[Same format]

### Strengths
- [Positive aspects]

### Verified Against
- [Microsoft Docs consulted]
```

Categorize each issue by severity:

- **Critical** — Technical inaccuracy, outdated service names, broken links,
  incorrect claims.
- **Important** — Missing required sections, wrong heading hierarchy, missing
  cross-references, incomplete multitenancy coverage.
- **Minor** — Style deviations, formatting inconsistencies, missing alt-text
  patterns.

## Quality Standards

Ensure guidance is:

- **Accurate** — Current Azure capabilities verified against official docs.
- **Consistent** — Follows established patterns for the document category.
- **Complete** — Covers all relevant multitenancy aspects.
- **Clear** — Uses consistent terminology throughout.
- **Connected** — Proper cross-links between doc types, WAF, and Cloud
  Design Patterns.

## Edge Cases

- **File path does not match expected folders** — Ask the user which
  category to review against.
- **Technical claims unverifiable via MCP tools** — Note in the report as
  "unverified" with a recommendation to manually confirm.
- **Conflicting recommendations across official sources** — Report both
  sources and flag the conflict for human resolution.
- **Document in correct folder but wrong category content** — Flag as a
  structural issue in the Critical section.
- **No multitenancy-specific guidance available for the topic** — Note the
  gap and suggest checking broader Azure documentation.
