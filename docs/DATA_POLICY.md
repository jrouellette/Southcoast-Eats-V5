# Southcoast Eats V5 — Data Policy

Provider-specific rights must be checked against current official terms before any production collection.

## Product truthfulness
- Never fabricate restaurants, addresses, coordinates, contact details, hours, ratings, review counts, prices, menus, or photos.
- Sample UI data must never enter production.
- Unknown is not unavailable, false, or confirmed absent. Missing hours do not mean closed; no result does not prove a business does not exist.
- Do not show ratings/review counts until an authorized reliable source and attribution/refresh policy exist.
- Calculate distance from real coordinates and the chosen reference location; never reuse demo distances.

## Provider compliance gate
Before bulk or recurring use, document access tier/authentication, rate limits/quotas/costs, permitted fields, storage/cache/combination/redistribution rights, attribution, retention/deletion, refresh rules, geographic/category limitations, and derived-data terms. Do not assume free means unrestricted. If terms are unclear, stop before ingestion.

## Data minimization and provenance
Collect only needed fields; prefer normalized candidates over raw payloads; record source and observation time where permitted; never store secrets in data rows, logs, GitHub, or client code; honor provider retention/deletion requirements.

## Matching and publication
Use provider IDs first and supporting evidence second. Never merge on name alone. Queue ambiguous identity, material conflicts, suspicious coordinates, or unclear legitimacy. Publish only reliable identities with a usable physical location inside the approved region and no unresolved misleading conflict.

## Security
Keep RLS enabled on exposed tables. Client roles receive only minimum access. Provider IDs, field provenance, and review queue remain inaccessible to anon/authenticated clients. Never expose service-role/secret keys in browser code or `NEXT_PUBLIC_*`. Use controlled server-side jobs for privileged ingestion. Do not build admin writes before auth, authorization, audit, and review flows are tested.

## Launch geography
New Bedford, Fall River, Dartmouth, Westport, Fairhaven, Acushnet, Mattapoisett, Marion, Rochester, Somerset, Swansea; Bristol, Warren, Barrington, Little Compton. Aquidneck Island/Newport is excluded unless the product decision changes. Apply explicit geographic boundaries at final inclusion.
