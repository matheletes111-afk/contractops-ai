# SEO Plan

## On `open-seo` (github.com/every-app/open-seo)

Recommendation: **skip it for now.** It's a legitimate, well-maintained (13k+ stars) SEO toolkit — keyword research, rank tracking, competitor/backlink auditing — but it requires a paid DataForSEO API key for real data. That's a genuine cost, not a one-time setup, and it conflicts directly with the "don't want to spend more on this" goal. It's worth revisiting once there's revenue to justify a data subscription; for now, everything below is genuinely free.

## Already done (this session)

- Fixed `<html lang="hi">` in `app/layout.tsx` — the whole app is English by default (only the navbar toggles Hindi client-side), and a wrong `lang` attribute actively hurts both accessibility and search engines' understanding of the page.
- Added `app/robots.ts` — allows crawling of public pages, blocks `/api`, `/admin`, `/dashboard`, `/contracts`, `/results`, `/processing` (all account-gated or non-content pages that shouldn't be indexed).
- Added `app/sitemap.ts` — lists `/`, `/pricing`, `/sample` for search engines.
- Added JSON-LD `SoftwareApplication` structured data to the homepage — helps Google understand what the product is and its free tier, which can surface rich results.

All of the above use Next.js's built-in `MetadataRoute` APIs — no dependencies, no cost.

## Next steps (free, prioritized)

1. **Per-page metadata** — right now every route inherits the same generic title/description from `app/layout.tsx`. Add `export const metadata` (or `generateMetadata`) to `/pricing`, `/sample`, and any future content pages with distinct, keyword-relevant titles and descriptions (e.g., `/sample` → "Sample NDA Risk Report — See ContractOps AI in Action"). Free, ~30 minutes of work.
2. **Google Search Console** — verify the domain (free, DNS TXT record or HTML file), submit the new sitemap, and monitor indexing/search queries. Do this as soon as the sitemap is live in production.
3. **Content pages (the actual free growth lever)** — tooling and metadata only help pages that already exist get found; they don't create new search demand. A handful of long-tail content pages targeting real search queries will do more than any tooling investment at this stage:
   - "NDA risk checklist" / "What to check before signing an NDA"
   - "MSA red flags" / "Common risky clauses in vendor contracts"
   - "How to review a contract with AI"
   - "Indemnity clause explained" (and similar per-clause explainers — reuses the 10 clause types already analyzed, and each is a natural internal link back to `/analyze`)
   Even 3-4 solid pages, written once and left alone, compound over months. This is the highest-leverage free SEO activity available right now.
4. **Open Graph image** — currently there's no custom OG image, so shared links (Twitter/X, LinkedIn, WhatsApp) render with no preview. A single static image (1200×630) referenced in `layout.tsx` metadata fixes this — cheap and improves click-through on shared links.
5. **Core Web Vitals** — Next.js's defaults (SSR, image optimization, code splitting) already give a solid performance baseline; no action needed unless Search Console flags specific issues later.

## Deferred until there's revenue

- `open-seo` (or any paid rank-tracking tool) for keyword-gap and competitor analysis once there's a marketing budget.
- Backlink building / outreach — typically the highest-effort, slowest-payoff SEO lever; not worth prioritizing pre-launch.
