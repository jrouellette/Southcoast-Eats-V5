# Southcoast Eats V5 — Data Model

Status: current foundation and intended rules. This document does not imply that proposed future tables or fields have been implemented.

## Current tables
- `restaurants`: internal identity, name, slug, description, cuisine tags, price, website, phone, publication status, featured flag, timestamps.
- `restaurant_locations`: physical location, address, locality, region, postal code, country, optional coordinates, primary flag, timestamps.
- `restaurant_photos`: image URL and optional alt text/credit/order/cover flag. Use only where source terms permit.
- `restaurant_provider_ids`: provider-namespaced external IDs; unique by provider + provider place ID.
- `restaurant_field_sources`: field-level source type/name/record ID, observed value, current flag, observed time.
- `restaurant_review_queue`: candidate review items, reason, proposed changes, source details, review status, notes.
- `favorites`: authenticated user + restaurant key. The consumer app currently uses demo/local browser state; this table is not wired into the app.

## Identity and matching
1. Internal UUIDs are stable and owned by Southcoast Eats.
2. Provider IDs are never internal primary keys.
3. Match exact provider IDs first; otherwise compare normalized name, address, coordinates, phone, and brand/location relationships.
4. Never merge on name alone. Ambiguous matches go to human review.
5. Distinct physical locations remain distinct records.

## Field authority and uncertainty
- Track source and observation time for imported or manually corrected fields.
- Distinguish unknown, unverified, confirmed absent/unavailable, conflicting, and stale. Missing does not mean false.
- Protect manual corrections from routine refreshes until deliberately revalidated.
- Confidence and verification are separate.
- Do not retain full raw provider payloads unless terms allow it and a documented need exists.

## Publication eligibility
Publish only when identity is reliable, the physical location is inside the approved launch region, evidence supports a legitimate food business, and no unresolved identity conflict is likely to mislead. Website, photos, hours, and complete classification are not mandatory. Do not fabricate missing data or infer closure from missing hours or failed queries.

## Classification
Keep restaurant/business type, cuisine, hierarchical food specialty, service availability, and primary dining experience separate. Search ranking is separate from classification. Default to strict matches and explain broader alternatives.

## Deferred schema
Before adding tables/columns, specify requirements for controlled taxonomy, verification/freshness/conflicts, discovery cells and run history, usage ledger, admin review/audit, and account-backed favorites. Add only what a tested workflow needs.
