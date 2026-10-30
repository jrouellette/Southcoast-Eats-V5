# Supabase Migration Baseline Reconciliation

## Why this is required

The V5 database currently has the schema from `202610250001_initial_schema.sql`, but Supabase's remote migration history was empty at the last audit. Do not replay the initial migration against the existing schema and do not run a remote database reset.

## Safe reconciliation sequence

1. Confirm the linked project is `wlrmaqqxtrlfohleuand` (Southcoast-Eats-V5).
2. Compare the live schema, RLS policies, indexes, triggers, function, and enum definitions with `supabase/migrations/202610250001_initial_schema.sql`.
3. If and only if the live schema matches that initial migration, use the Supabase CLI migration repair command to mark version `202610250001` as applied:
   `supabase migration repair 202610250001 --status applied`
4. Check local and remote history:
   `supabase migration list`
5. Preview pending changes:
   `supabase db push --dry-run`
6. Review the preview. It should show only intended new migrations, not the initial schema recreation.
7. Apply only after review:
   `supabase db push`
8. Re-run the Supabase security and performance advisors and verify the effective grants, policies, trigger, and indexes.

Never run `supabase db reset --linked` on this project. That command is destructive.

## Current prepared migration

`supabase/migrations/202610290001_security_least_privilege.sql` is prepared but should not be applied until the baseline is reconciled and the migration is present in the repository. Review it before applying, particularly the intended service-role access model.
