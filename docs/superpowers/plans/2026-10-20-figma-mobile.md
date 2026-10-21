# LoyLoop mobile implementation plan

**Goal:** Replace the existing mobile UI with the supplied Figma design while retaining Expo Router, Supabase authentication and the existing claim API.

**Specification:** User requirements 1–15 and Figma UITegQ7U4n3fBriaUnLZZE, node 528:2009. Four main sections; QR is an action. Internal tabs and scroll variants do not create navigation destinations.

**Architecture:** Extend the current data adapter with real membership and offer eligibility. Shared UI primitives and card variants compose the existing routes. Use a secondary benefit detail route and personal information route. Preserve current uncommitted changes in claims.ts and supabase.ts.

**Stack:** Existing Expo 54, React Native, TypeScript, Expo Router, Supabase. Expo v57 documentation consulted as requested; use APIs compatible with installed SDK. Inter and coral/pink tokens, consistent outline icons.

## Tasks

- [x] Data: distinguish membership, loyalty thresholds, stamps, promotions, missions and global XP. Test unlock conditions and QR parsing. Persist demo memberships separately; never substitute demo customer identity for a signed-out user.
- [x] Shared components: adapt BottomTabs, StampCard and RewardCard; add shared typography, buttons, sheets, commerce cards, progress, mission and level cards. Download original Figma artwork.
- [x] Main routes: one scrolling Home, Comercios with internal tabs/search/sort/category filters, Beneficios with internal filters, Perfil with global level and account/help settings.
- [x] Commerce detail: one member/visitor screen, joining, expandable stamps, available/locked rewards, promotions, missions and locations.
- [x] Claim: detail to QR/manual code, real expiration, polling of merchant validation, success only after approval. Preserve point balances.
- [x] Personal information: edit simple fields in sheet, email verification, password update, avatar and delete account flow with explicit confirmation and honest server errors.
- [x] Verification: TypeScript, domain tests, web export, responsive browser checks and review of backend limitations.

## Review focus

Implementation and local verification details: [mobile-ui-handoff.md](../../mobile-ui-handoff.md).
Server deployment and physical-device verification remain external prerequisites;
the checked implementation tasks do not imply those prerequisites were executed.

- Logged-out users must not inherit another customer's membership or points.
- Failed requests must surface retryable errors, not substitute demo rewards into live data.
- QR scanning must reject unrelated URLs and malformed business identifiers.
- Expired, rejected or unverified claims must never display success.
- Small screens, long text and large font sizes must remain scrollable and operable.
