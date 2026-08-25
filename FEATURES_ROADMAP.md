# Feature Roadmap

A prioritized backlog based on (a) what ContractOps AI already has, and (b) research into what law firms, in-house legal teams, and established competitors (Spellbook, Robin AI, Lexion, LawGeex, Ironclad, and others) say they need from AI contract tools. Ranked by impact vs. build effort for a solo developer — not everything needs to happen at once.

## What already exists (so we don't duplicate it)

- Risk-scored analysis across 10 fixed clause types (Term, Termination, Indemnity, Limitation of Liability, Confidentiality, IP Ownership, Governing Law, Data Privacy, Insurance, Payment Terms)
- Per-clause summary, original text, and suggested redline
- Multi-page PDF export with executive summary and risk distribution stats
- Contract history with status tracking (Uploaded → Analyzed → Downloaded)
- English and Hindi contract analysis (the AI prompt handles both; the UI chrome around it is only shallowly translated — see Tier 2)
- Manual subscription/payment flow (see `SUBSCRIPTION_MANAGEMENT.md` for its risks and upgrade path)
- A dashboard with two **unbuilt** "Chart Placeholder" analytics widgets — an easy near-term win since the scaffolding is already there

## Why this ordering

Legal buyers are risk-averse: research consistently shows accuracy and data-handling transparency are their top two trust blockers, ahead of feature breadth. That's why "explain this clause" and source citations — both nearly free to build since the AI already generates the underlying reasoning — are ranked above bigger, flashier features like a Word plugin.

## Tier 1 — Build next (low effort, high impact)

1. **Renewal / expiry date extraction + email reminders** — auto-extract term length, auto-renewal, and notice-period dates per contract, then email a reminder before they lapse. Most vendor/SaaS contracts have an auto-renewal clause and users forget them. Reuses the existing OpenAI extraction and the email infrastructure already wired up for magic-link auth.
2. **"Explain this clause" reasoning, not just a score** — the model already reasons its way to a risk level; surface that reasoning in the UI instead of only the summary. Directly answers the #1 trust objection (black-box scoring) at near-zero extra cost.
3. **Source-grounded citations** — visually tie each risk flag back to the exact original-text excerpt it came from. The original text is already parsed and stored; this is a UI/highlighting task, not new AI work. Same trust-building rationale as above.
4. **Contract version / redline diff** — let a user upload a v2 of a contract they previously analyzed and see what changed vs. v1, not just a fresh standalone analysis. Natural extension of the existing analysis pipeline.
5. **Finish the dashboard analytics** — the two "Chart Placeholder" divs on `/dashboard` are already scaffolded; wire them to real data (risk trends over time, analyses used vs. plan limit).

## Tier 2 — Next (moderate effort)

6. **User-defined clause library / playbook comparison** — let a user paste in their own "standard" clause language (or pick a template) and flag deviations from it, instead of only generic risk scoring. This is the single most-requested feature across every competitor researched (Robin AI, LawGeex, Lexion all lead with it) — buildable as prompt augmentation on top of the existing analysis, not new infrastructure.
7. **Bulk upload / batch analysis** — useful for small ops/legal teams processing many vendor contracts at once; Premium plan already advertises this as "coming soon."
8. **Industry-specific templates** — NDA, MSA, lease, employment-agreement presets that tune which clauses matter most per contract type, marketed as specialization rather than one-size-fits-all.
9. **Real UI localization beyond the navbar** — the AI backend already produces genuine Hindi analysis, but results pages, PDF export, and the dashboard are hardcoded English. Closing this gap makes the existing Hindi-analysis capability actually visible to Hindi-speaking users.

## Tier 3 — Bigger bets (later, once there's revenue/time to invest)

10. **Word / Google Docs plugin or lightweight browser extension** — this is Spellbook's core moat (review without leaving the document). High differentiation, meaningfully higher build effort — a v2+ investment, not a v1 one.
11. **Public API access** — if the core analysis is already effectively an internal API, exposing it is low marginal effort and monetizable as its own tier.
12. **E-signature integration** — nice-to-have once contract volume justifies it; not a differentiator this early.
13. **Multi-party (3+ signatory) contract support** — more of a data-model change than a feature; only prioritize if customers actually ask for it.

## Trust, not just features

Two things matter more than any single feature for converting risk-averse legal buyers, and both are copy/positioning work rather than code:
- Be explicit that AI output is a first-pass review, not a replacement for lawyer sign-off (the disclaimer already does this — keep it visible everywhere, not just the landing page).
- Be explicit about data handling: uploaded contracts aren't used to train models, and there's a clear deletion/retention policy. This is now stated on the landing page's new "Built to Be Trusted" section — consider a dedicated `/privacy` or `/trust` page as usage grows.
