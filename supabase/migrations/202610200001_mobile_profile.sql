-- Apply before enabling email changes, avatar uploads and account deletion.
-- This migration does not alter loyalty balances.
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "LoyLoop avatar upload" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "LoyLoop avatar update" on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "LoyLoop avatar delete" on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "LoyLoop avatar read" on storage.objects for select to authenticated
using (bucket_id = 'avatars');

-- Keep the legacy email-linked customer record connected after a verified
-- email change. Auth changes the email only after its verification flow.
create or replace function public.sync_loyloop_customer_identity()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.customer_profiles
  set email = new.email,
      full_name = coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), full_name),
      phone = coalesce(nullif(new.raw_user_meta_data->>'phone', ''), phone)
  where lower(email) = lower(old.email);
  update public.app_users
  set email = new.email,
      full_name = coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), full_name)
  where lower(email) = lower(old.email);
  return new;
end;
$$;
revoke all on function public.sync_loyloop_customer_identity() from public, anon, authenticated;
drop trigger if exists loyloop_sync_customer_identity on auth.users;
create trigger loyloop_sync_customer_identity
after update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_loyloop_customer_identity();

create or replace function public.loyloop_mobile_profile_ready()
returns boolean language sql security invoker set search_path = ''
as $$ select true; $$;
revoke all on function public.loyloop_mobile_profile_ready() from public, anon;
grant execute on function public.loyloop_mobile_profile_ready() to authenticated;

-- Preflight runs before removing the avatar; the delete RPC rechecks it.
create or replace function public.check_loyloop_account_deletion()
returns void language plpgsql security definer set search_path = ''
as $$
declare
  current_id uuid := auth.uid();
  current_email text;
begin
  if current_id is null then
    raise exception 'Authentication required';
  end if;
  select email into current_email from auth.users
  where id = current_id and email_confirmed_at is not null;
  if current_email is null then
    raise exception 'Verify your email before deleting this account';
  end if;
  -- A commerce owner must use the business account closure process.
  if exists (select 1 from public.businesses where owner_user_id = current_id) then
    raise exception 'Close or transfer your business account first';
  end if;
end;
$$;
revoke all on function public.check_loyloop_account_deletion() from public, anon;
grant execute on function public.check_loyloop_account_deletion() to authenticated;

create or replace function public.delete_loyloop_account()
returns void language plpgsql security definer set search_path = ''
as $$
declare
  current_id uuid := auth.uid();
  current_email text;
begin
  perform public.check_loyloop_account_deletion();
  select email into current_email from auth.users where id = current_id;
  delete from public.app_users where lower(email) = lower(current_email) and account_type = 'customer';
  delete from public.customer_profiles where lower(email) = lower(current_email);
  delete from auth.users where id = current_id;
end;
$$;
revoke all on function public.delete_loyloop_account() from public, anon;
grant execute on function public.delete_loyloop_account() to authenticated;
commit;
