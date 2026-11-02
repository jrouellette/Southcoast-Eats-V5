# Supabase Migration Baseline — V5

Verified against project `wlrmaqqxtrlfohleuand` on 2026-10-30. PostgreSQL 17; seven foundation tables are empty. The live schema was compared with `202610250001_initial_schema.sql` and matches the initial schema plus the security changes described below.

## Remote migration history
| Version | Name | State |
|---|---|---|
| `202610250001` | (not populated) | Initial schema was already present; history entry was inserted after read-only schema comparison. |
| `20261030141657` | `202610290001_security_least_privilege` | Security SQL applied through Supabase MCP. |

The security migration's remote version is `20261030141657`, but the old repository filename used `202610290001_security_least_privilege.sql`. The canonical repository filename should be `20261030141657_security_least_privilege.sql`. The initial baseline history entry was inserted directly into `supabase_migrations.schema_migrations`, not through standard CLI migration repair, because this is a browser-only workflow. This deviation is documented; do not reset the history or replay the initial schema.

## Security model verified
- RLS is enabled on all seven public tables.
- `anon` and `authenticated` have SELECT on restaurants, locations, and photos only; RLS restricts reads to published restaurants and associated locations/photos.
- Authenticated users have SELECT/INSERT/DELETE on favorites, with each policy restricted to `auth.uid() = user_id`.
- `service_role` has SELECT/INSERT/UPDATE/DELETE on the six restaurant/internal tables, but not favorites.
- Provider IDs, field sources, and review queue have no client-facing policies (intentional default-deny).
- `set_updated_at()` is not SECURITY DEFINER and uses `search_path = pg_catalog`.
- No real restaurant data has been ingested.

## Advisor results
Security advisor: three informational findings for the internal tables with RLS enabled and no policies; intentional. Performance advisor: eight unused-index notices; database is empty, so reassess after representative data and query patterns exist.

## Guardrails
1. Never run `supabase db reset --linked`.
2. Never replay `202610250001_initial_schema.sql` against this database.
3. Keep schema changes in versioned migration files and verify after applying.
4. Do not ingest provider data until access tier, quotas, storage/retention, attribution, and data-combination terms are verified.
5. Never expose service-role/secret keys in browser code or `NEXT_PUBLIC_*` variables.

## Phase 1 boundary
The database foundation and least-privilege access model are applied and verified. The consumer app is not connected to production data; provider ingestion is not yet authorized or ready. Next: finalize provider compliance and the smallest data-model additions needed for a budget-limited discovery pilot.
