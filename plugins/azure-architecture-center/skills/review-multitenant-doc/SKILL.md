---
name: review-multitenant-doc

description: >-
  **ANALYSIS SKILL** — Review Azure Architecture Center multitenant
  documentation for accuracy, structure, and product correctness. Produces
  a structured review report with severity and confidence indicators.
  WHEN: "review multitenant doc", "review AAC doc", "ISV architecture
  review", "SaaS documentation review", "multitenant doc review", "review
  approaches doc", "review service doc", "check AAC structure". INVOKES:
  microsoft-learn MCP, subagent, search, read. FOR SINGLE OPERATIONS: Use
  Microsoft Learn MCP directly.

metadata:
  author: PlagueHO
  version: "1.1"
  reference: https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview

compatibility: >-
  GitHub Copilot, VS Code. Requires microsoft-learn MCP tools
  (microsoft_docs_search, microsoft_docs_fetch,
  microsoft_code_sample_search) and subagent support.
---

# Review AAC Multitenant Documentation

Review Azure Architecture Center multitenant documentation for technical
accuracy, structural consistency, and product correctness. The review is
scoped to the document's category (Approaches, Considerations, or
Service-Specific) as determined by its folder path under
`/docs/guide/multitenant/`.

> **Important:** "Tenant" means your customers or user groups — not Microsoft
> Entra tenants. Do not confuse these concepts throughout the review.
>
> **Scope exclusion — Microsoft Learn Build checks:** Do NOT review for
> general link validity, general clarity, general consistency, inclusive
> language, general terminology, or general tone. These are validated
> automatically by the Microsoft Learn Build service. HOWEVER, you MUST
> review clarity, consistency, and terminology **specifically for
> multitenancy and SaaS concepts**, which are domain-specific and not
> covered by the Build service.

## Prerequisites

- **Microsoft Learn MCP tools** — `microsoft_docs_search`,
  `microsoft_docs_fetch`, and `microsoft_code_sample_search` for verifying
  technical claims and product information against official docs.
- **Subagent tools** — for researching Azure service features, limits,
  preview status, and deprecation paths.
- **Search tool** — for locating patterns and cross-references in the
  codebase.
- **Read tool** — for reading the target document and related files.

## MCP Tools Used

| Step | Tool | Query Pattern | Purpose |
|------|------|---------------|----------|
| 3 | `microsoft_docs_search` | `"<service> multitenancy best practices"` | Find multitenant guidance |
| 3 | `microsoft_docs_fetch` | URL from search results | Retrieve full doc pages |
| 3 | `microsoft_docs_search` | `"<service> limits quotas"` | Verify service limits |
| 3 | `microsoft_docs_search` | `"<service> preview features"` | Check preview/GA status |
| 3 | `microsoft_docs_search` | `"<service> deprecation retirement"` | Check deprecation status |
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

### Step 2 — Verify Front Matter and ms.date

1. YAML front matter is valid and contains required fields.
2. Verify `ms.date` is present and in US date format (`mm/dd/yyyy`).
3. The `ms.date` value should be today's date or very recent. If it is
   significantly outdated, flag it as a finding — the date should reflect
   the most recent review.

### Step 3 — Verify Structure

Compare the document's heading hierarchy and section ordering against the
required structure from the reference template. Check for:

1. All required sections are present.
2. Sections appear in the correct order.
3. Heading levels follow proper hierarchy (no skipped levels).
4. Contributors section exists with LinkedIn links.

> **Note:** Do not check for general link validity — this is handled by the
> Microsoft Learn Build service.

### Step 4 — Verify Product Documentation Correctness

This is the most critical step. Use Microsoft Learn MCP tools and subagent
research to validate every product claim, feature description, and
technical recommendation in the document.

Use the following tools:

1. `microsoft_docs_search` — Query: `"<service> multitenancy best practices"`.
2. `microsoft_docs_search` — Query: `"<service> limits quotas"`.
3. `microsoft_docs_search` — Query: `"<service> preview features"`.
4. `microsoft_docs_search` — Query: `"<service> deprecation retirement"`.
5. `microsoft_docs_fetch` — Retrieve full content from promising results.
6. `microsoft_code_sample_search` — Query: `"<service> <feature>"` with
   `language` parameter when checking code samples.
7. **Subagent research** — Launch subagent queries for complex feature
   verification, cross-referencing multiple sources.

Verify each of the following:

#### 4a — Product Information Correctness

- Azure service names are current (not deprecated or renamed).
- Feature descriptions match the official product documentation.
- Quotas, limits, and pricing models are accurate.
- Configuration options and parameters are correct.
- Code samples match official patterns.

#### 4b — Multitenancy Examples and Patterns

- Any example of how a feature is useful for multitenancy is accurate and
  reflects actual product behavior.
- Patterns recommended specifically for multitenancy/isolation actually
  work as described in the official docs.
- When a service limit is relevant to a multitenancy pattern (e.g., max
  instances, connections, throughput), the documented limit is correct and
  cited. Include the known limit value in the finding if missing.

#### 4c — Preview and Deprecation Status

- Features currently in **preview** must be indicated as such. If the
  document presents a preview feature as generally available, flag it.
- Features on a **deprecation path** or **retirement schedule** must be
  flagged. If the document recommends a deprecated feature without
  noting its status, this is a critical finding.

#### 4d — Multitenancy Relevance Validation

- Each feature claimed to be useful for multitenancy actually provides
  **unique benefits in a multitenant context** — not just general benefits
  that apply equally to single-tenant deployments.
- Features should explain how they would be applied differently or provide
  specific advantages in a multitenancy environment (e.g., tenant
  isolation, per-tenant scaling, noisy-neighbor mitigation, cost
  allocation).
- Flag any feature that is presented as a multitenancy benefit but does
  not offer differentiated value compared to single-tenant usage.

### Step 5 — Check Multitenancy Coverage

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

### Step 6 — Check Multitenancy Terminology and Clarity

Review the document specifically for multitenancy and SaaS terminology
accuracy and clarity. This is NOT covered by the Microsoft Learn Build
service.

- Uses "tenant" consistently (not "customer" when referring to tenants).
- Multitenancy concepts (isolation models, shared vs. dedicated, noisy
  neighbor, etc.) are explained clearly and correctly.
- SaaS-specific terminology is used accurately.
- Diagram alt-text follows `Diagram that shows...` pattern.
- Cross-references link between Approaches, Considerations, and
  Service-Specific documents.
- Links to Well-Architected Framework and Cloud Design Patterns where
  appropriate.

> **Do not review** for general style, clarity, tone, or inclusive
> language — the Microsoft Learn Build service handles these.

### Step 7 — Check Scope Boundaries

Verify the document stays within its intended scope:

- **Do Not Review:** Code implementations, deployment scripts (unless
  illustrative), non-multitenancy content, general Azure guidance, general
  link validity, general style/tone/inclusive language.
- **Always Preserve:** Contributors sections with attribution.
- **Never Invent:** Azure services or features — verify against official
  docs.

Flag if a document is in the correct folder but contains content from
another category (structural issue).

### Step 8 — Produce the Review Report

Output the review using the [report-template.md](assets/report-template.md)
template. The report must include:

1. **Document metadata** — Path, category, service, ms.date status.
2. **Summary** — Brief overall assessment.
3. **Sources searched** — All MCP queries and subagent research performed.
4. **Findings table** — Each finding with:
   - **Severity** — 🔴 Critical, 🟠 Important, 🟡 Minor, ℹ️ Info.
   - **Confidence** — 🟢 High, 🟡 Medium, 🔴 Low (how confident you are
     that this is a genuine issue).
   - **Status** — ✅ ➡️ ❌ ❓ ⛔ (see legend in template).
   - **Change type and reason**.
   - **Reference documentation** to support the finding.
5. **Suggested changes** — Actionable change text for each finding.

### Severity Definitions

- **🔴 Critical** — Incorrect product information, wrong service limits,
  deprecated feature recommended without disclaimer, preview feature
  presented as GA, technical inaccuracy verified against official docs.
- **🟠 Important** — Missing required sections, incomplete multitenancy
  coverage, feature claimed as multitenant benefit without unique
  differentiation, missing relevant service limits for a pattern,
  significantly outdated `ms.date`.
- **🟡 Minor** — Multitenancy terminology inconsistencies, missing
  cross-references to related AAC docs, diagram alt-text pattern
  deviations.
- **ℹ️ Info** — Suggestions for improvement that are not issues (e.g.,
  additional features that could be mentioned).

### Confidence Definitions

- **🟢 High** — Finding verified against official Microsoft documentation
  via MCP tools or subagent research.
- **🟡 Medium** — Finding based on general knowledge but not fully verified
  against a specific official source.
- **🔴 Low** — Finding is a suspicion or inference; requires manual
  verification.

## Quality Standards

Ensure guidance is:

- **Accurate** — Current Azure capabilities verified against official docs.
  Product information, limits, preview/deprecation status all confirmed.
- **Consistent** — Follows established patterns for the document category.
- **Complete** — Covers all relevant multitenancy aspects with correct
  service limits where applicable.
- **Clear** — Uses consistent multitenancy and SaaS terminology throughout.
- **Connected** — Proper cross-links between doc types, WAF, and Cloud
  Design Patterns.
- **Current** — `ms.date` reflects a recent review; no deprecated or
  preview features presented without appropriate status indicators.

## Edge Cases

- **File path does not match expected folders** — Ask the user which
  category to review against.
- **Technical claims unverifiable via MCP tools** — Note in the report as
  "unverified" with confidence 🔴 Low and recommend manual confirmation.
- **Conflicting recommendations across official sources** — Report both
  sources, flag the conflict for human resolution, and set confidence to
  🟡 Medium.
- **Document in correct folder but wrong category content** — Flag as a
  structural issue with severity 🔴 Critical.
- **No multitenancy-specific guidance available for the topic** — Note the
  gap and suggest checking broader Azure documentation.
- **Feature in preview with no GA timeline** — Flag as 🟠 Important with
  a note to add a preview disclaimer.
- **Service limit not documented anywhere** — Note as ℹ️ Info with
  confidence 🔴 Low.
