# Admin to Mobile Supabase Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make active rewards, campaigns, and missions created in the LoyLoop admin appear in the appropriate mobile commerce and Benefits screens from the shared Supabase project.

**Architecture:** Keep Supabase as the single source of truth and keep existing tables and navigation. Make admin writes and reads surface real errors and empty results, then align mobile eligibility and visibility with active state, campaign status/date, commerce membership, and the existing focus reload.

**Tech Stack:** Next.js 15 server actions, React 19, Supabase JS, Expo SDK 57 / React Native, Expo Router.

**Spec:** `docs/superpowers/specs/2026-10-21-admin-mobile-supabase-design.md`

## Global Constraints

- No database schema changes, new dependencies, or new routes.
- Admin content remains scoped to Cafe Central in this delivery.
- Mobile demo mode remains available only through its existing explicit demo configuration.
- Global LoyLevel benefits remain separate from commerce rewards.
- Before editing mobile code, read `https://docs.expo.dev/versions/v57.0.0/` as required by `AGENTS.md`.
- Admin files are outside the writable workspace root; implementation must obtain filesystem approval before modifying `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop`.
- Do not modify Supabase RLS policies or write records to the live database as part of implementation.
- The user did not request tests; do not add or run tests. Keep verification to code review and describe the manual checks for the user.

## Review Focus

- Supabase write error or invalid input must not look like successful creation; connect to the action-state UI task.
- Empty admin query results must remain empty and query errors distinguishable; connect to admin data read task.
- Scheduled, expired, or inactive campaigns must not appear claimable; connect to mobile eligibility task.
- A visitor must see public promotion and locked member-only content without receiving a claim action; connect to mobile presentation task.
- Member content must refresh when the user returns to Benefits or commerce detail; connect to mobile read path task.

---

## File Map

- `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop\lib\actions\loyalty.ts`: validate mutations, return visible action results, and preserve revalidation on success.
- `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop\lib\data\dashboard.ts`: distinguish empty query results from failures; remove demo substitution from live dashboard reads.
- `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop\app\dashboard\recompensas\page.tsx`: display empty state and create/update/delete action feedback.
- `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop\app\dashboard\misiones\page.tsx`: display empty state and create/update/delete action feedback.
- `C:\Users\cubil\OneDrive\Desktop\Proyectos\LoyLoop\app\dashboard\campanas\page.tsx`: display empty state and create/update/delete action feedback.
- `src/lib/loyloop-data.ts`: centralize offer active/date/status/membership mapping; allow visitor detail to discover public promotions and locked member content; keep Benefits scoped to memberships.
- `src/app/recompensas.tsx`: retain tab layout and focus reload while presenting the correctly filtered records.
- `src/app/comercio/[slug].tsx`: render visitor locked states and ensure blocked offers do not expose claim actions.

## Task 1: Make admin mutations report success and failure

**Files:**
- Modify: admin `lib/actions/loyalty.ts`
- Modify: admin dashboard pages listed in File Map

**Interfaces:**
- Existing form payload field names and Supabase table columns remain unchanged.
- Each mutation returns a serializable action result with success or a Spanish error message; success continues to revalidate its existing paths.

- [ ] Replace swallowed errors for reward, mission, and campaign create/update/delete actions with returned action state; preserve Cafe Central scoping and current payload fields.
- [ ] Add server-side required-field and numeric validation for fields already required by the forms; return field/action feedback rather than silently returning on invalid submissions.
- [ ] Wire each create/edit/delete form to the returned action state and display success/error feedback using the existing admin visual system.
- [ ] Ensure a failed operation does not trigger success revalidation state; successful operations revalidate current admin pages and customer commerce pages.
- [ ] Review that no service-role key, policy change, or broad privilege is introduced.

## Task 2: Make admin lists reflect Supabase exactly

**Files:**
- Modify: admin `lib/data/dashboard.ts`
- Modify: admin rewards, missions, and campaigns pages

**Interfaces:**
- `getDashboardRewards`, `getDashboardMissions`, and `getDashboardCampaigns` return actual rows, including an empty array; Supabase query failures are thrown to the page error boundary or handled as explicit load errors.

- [ ] Remove fallback-demo substitution from live query error and empty-result branches for the three dashboard lists.
- [ ] Preserve existing row-to-view-model mapping for actual database results.
- [ ] Add clear empty-list states to each page so zero records is a normal, understandable result.
- [ ] Ensure query failures reach an explicit error state and cannot be mistaken for an empty list.
- [ ] Keep unrelated dashboard fallback data and non-offer pages unchanged.

## Task 3: Align mobile offer eligibility and visitor detail

**Files:**
- Modify: `src/lib/loyloop-data.ts`
- Modify: `src/app/comercio/[slug].tsx`

**Interfaces:**
- `getBusinessDetail(slug)` continues returning `BusinessDetail` with `rewards`, `campaigns`, and `missions` arrays.
- Existing `Offer` fields remain compatible; blocked member-only offers carry `available: false` and no usable claim action for visitors.

- [ ] Add focused helper logic for offer activity and schedule: rewards/missions require `active`; campaigns require `active` and `status === "active"`; future `starts_at` and past `ends_at` are not currently available.
- [ ] Preserve active public campaigns in visitor detail; keep member-only rewards/missions visible as locked content with a join explanation.
- [ ] For members, map real reward points, campaigns, missions, and existing mission progress without making locked/expired entries claimable.
- [ ] Check current commerce detail rendering and ensure `available: false` suppresses claim actions while still showing locked offers and join CTA.
- [ ] Preserve current demo data path and global profile behavior.

## Task 4: Align the Benefits aggregation and focus refresh

**Files:**
- Modify: `src/lib/loyloop-data.ts`
- Review/modify only if needed: `src/app/recompensas.tsx`, `src/hooks/use-resource.ts`

**Interfaces:**
- `getRewards()` remains the data loader for the existing Benefits tabs.
- Existing Expo Router focus reload remains the refresh contract; no realtime channel is added.

- [ ] Keep aggregation limited to member businesses and collect only offers eligible for the signed-in member, while preserving the separate reward/promotion/mission kinds.
- [ ] Confirm the existing `useResource` focus callback reloads the current Benefits view and commerce detail after navigation returns; change only if a gap is found.
- [ ] Keep the global LoyLevel card/profile data independent from commerce offer queries.
- [ ] Preserve visible loading, query error, and empty states in Benefits.

## Manual Review Checklist (do not run unless user requests)

- In admin, create one reward, campaign, and mission; each should appear in its admin list after success.
- Simulate a rejected/missing Supabase mutation and confirm the form reports failure rather than success.
- Confirm a valid empty result stays empty and a read error is distinguishable.
- In mobile, as a member, open Benefits and confirm eligible records appear under the right tabs after returning to the screen.
- As a visitor, open a commerce detail and confirm public promotion visibility, locked member content, and no claim action until joining.
- Confirm future/inactive/expired records are not available to claim.
