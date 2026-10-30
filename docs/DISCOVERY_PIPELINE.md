# V5 Geographic Discovery & Ingestion Pipeline

Status: proposed architecture. Do not run bulk provider searches until geographic boundaries, provider terms, access limits, and the migration baseline are confirmed.

## Goal

Discover legitimate food businesses throughout the approved Southcoast Eats launch region with systematic coverage, low request volume, repeatable retries, traceable provenance, and no unapproved provider spend.

## Launch-region boundary

Use the approved launch-region list as the source of truth: New Bedford, Fall River, Dartmouth, Westport, Fairhaven, Acushnet, Mattapoisett, Marion, Rochester, Somerset, Swansea; Bristol, Warren, Barrington, and Little Compton. Aquidneck Island (Newport, Middletown, Portsmouth) is excluded unless the product decision changes.

Represent the approved region as explicit town/geographic boundaries. Grid cells are a search mechanism, not the source of truth. Filter candidate results against the approved boundary so cells that cross the edge do not publish out-of-region businesses.

## Geographic grid

- Generate versioned cells that intersect the approved region.
- Use configurable cell dimensions. Start with a small pilot; test dense and less-dense areas before fixing dimensions.
- Avoid arbitrary cell sizing without considering provider query semantics, result caps, pagination, and geographic precision.
- If a query reaches a provider result cap or coverage is uncertain, subdivide the cell or use another permitted strategy.
- Neighboring cells can return the same location; deduplicate through provider IDs and matching evidence, not by assuming grid cells are disjoint in search results.

## Pipeline stages

1. Plan coverage: select unsearched, failed, stale, or incomplete cells.
2. Check budget: verify per-run, daily, and monthly request budgets and provider access rules before calling an endpoint.
3. Search: use the provider-specific query adapter and approved query shape.
4. Record run metadata: provider, cell/grid version, request timestamp, status, pagination completion, result count, result-cap indicators, retries, and cost/quota estimate.
5. Normalize: map only permitted fields into a provider-neutral candidate representation.
6. Match: use provider IDs first, then name/address/coordinates/phone/brand evidence. Ambiguous matches go to review.
7. Apply field authority: preserve verified/manual corrections; record provenance and observed time; detect conflicts and stale data.
8. Evaluate publication: apply Southcoast Eats identity, legitimacy, location, and conflict criteria.
9. Commit idempotently: retries must not create duplicate provider IDs, restaurants, or locations.
10. Report coverage: distinguish complete, partial, failed, capped, and pending-review outcomes.

## Suggested tracking tables (not yet created)

### discovery_cells
- Stable cell ID and grid version.
- Geographic bounds or geometry.
- Whether the cell intersects the approved region.
- Coverage state and last complete run.
- Last attempted run and next refresh due.

### discovery_runs
- Run ID and cell ID.
- Provider and query strategy/version.
- Started/completed timestamps and status.
- Result count, pagination-complete flag, result-cap flag, retry count.
- Error category/details and request usage estimate.

### provider_usage_ledger
- Provider, endpoint/operation, timestamp, request count, quota/cost estimate.
- Budget period and reason for the request.
- No secrets or sensitive request credentials.

These are proposed concepts. Choose the smallest schema that provides auditable coverage and spend controls; do not create tables until migration history is reconciled and provider requirements are known.

## Free/low-cost strategy

1. Evaluate OpenStreetMap data and a bounded query pilot first, while respecting the usage policy of the specific API/service used.
2. Verify Foursquare's current access tier, quotas, storage rights, attribution, and combination terms before relying on it.
3. Cache responses only when the provider's terms allow it.
4. Avoid overlapping duplicate queries where possible, but prioritize completeness over reducing calls at the expense of silent omissions.
5. Set hard stop conditions before ingestion; stop on budget thresholds, repeated rate limiting, unexpected costs, or uncertain terms.
6. Retry transient failures with exponential backoff. Do not retry permanent errors indefinitely.
7. A zero-result response is not a failure, but a failed request is never proof that an area has no restaurants.
8. Do not store full raw payloads by default; retain only permitted fields and limited diagnostic metadata.

## Pilot acceptance criteria

Run a small pilot in a dense area (for example, New Bedford) and a less-dense area (for example, Mattapoisett) only after provider policy review. Record:
- Requests and quota/cost consumed.
- Candidate count and unique locations after deduplication.
- Cells capped, incomplete, or failed.
- Conflicts and manual-review volume.
- Obvious omissions found through a small independent spot-check.
- Compliance with attribution, retention, and combination terms.

Expand region-wide only after the pilot demonstrates controllable request usage and defensible coverage.

## Stop conditions

Stop a provider run when its terms are unclear, a hard quota is reached, response semantics make completeness unknowable, repeated rate limits occur, or an unexpected bill/usage pattern appears. Resume only after adjusting the plan.
