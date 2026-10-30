-- Least-privilege grants and small advisor fixes for Southcoast Eats V5.
-- Review against the live ACLs and migration baseline before applying.

begin;

revoke all privileges on table
  public.restaurants,
  public.restaurant_locations,
  public.restaurant_photos,
  public.restaurant_provider_ids,
  public.restaurant_field_sources,
  public.restaurant_review_queue,
  public.favorites
from public, anon, authenticated, service_role;

grant select on table
  public.restaurants,
  public.restaurant_locations,
  public.restaurant_photos
to anon, authenticated;

grant select, insert, delete on table public.favorites to authenticated;

grant select, insert, update, delete on table
  public.restaurants,
  public.restaurant_locations,
  public.restaurant_photos,
  public.restaurant_provider_ids,
  public.restaurant_field_sources,
  public.restaurant_review_queue
to service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $function$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$function$;

revoke all on function public.set_updated_at() from public, anon, authenticated, service_role;

drop policy if exists "Users can read their own favorites" on public.favorites;
drop policy if exists "Users can add their own favorites" on public.favorites;
drop policy if exists "Users can remove their own favorites" on public.favorites;

create policy "Users can read their own favorites"
on public.favorites for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can add their own favorites"
on public.favorites for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can remove their own favorites"
on public.favorites for delete to authenticated
using ((select auth.uid()) = user_id);

create index if not exists favorites_restaurant_id_idx
  on public.favorites (restaurant_id);

create index if not exists restaurant_review_queue_restaurant_id_idx
  on public.restaurant_review_queue (restaurant_id);

commit;
