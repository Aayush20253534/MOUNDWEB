# Part 09 — Podcast and Media Publishing

## Implementation scope

The previous Podcast and Media pages were honest unpublished-content placeholders. Both are now full MOUNDWEB-styled editorial experiences. No real episode, guest, date, article, press appearance, training event, or video has been supplied or published.

### Podcast
- Cinematic mountain hero with decorative glowing microphone rings and soundwave.
- Discoverable, filterable concept directory with three **unpublished topic pitches**.
- Three static detail routes with illustrative artwork, topic tags, editorial discussion outline and a dedicated accessible player region.
- `AudioPlayer` uses the browser-native `<audio controls>` element only when a safe, approved MP3/M4A/OGG/WAV URL is configured. Drafts have no player and clearly say no recording exists.
- Transcript section is shown when an approved transcript is available; otherwise it explains that no transcript exists.
- No fabricated guest credits, dates, interview quotations, or duration.

### Media
- Illustrated hero, searchable editorial concept grid with four **unpublished** feature ideas, category filters, accessible empty state and individual concept detail pages.
- Responsive original-artwork gallery with a keyboard-accessible Radix lightbox, captions expressly describing images as design illustrations, not news photographs.
- Dated articles and verified releases appear in a separate Published library **only** when their approved content gates are satisfied. The current library is empty.

### Publishing-readiness and content gates
`apps/web/src/lib/editorial.ts` contains typed `Episode` and `MediaItem` records with explicit `draft` / `published` status. A podcast episode is publishable only if its status is `published` and it has a publication date, a compatible approved audio URL, a positive known duration and an accessible transcript. A media record requires a publication date, named author and nonempty approved article body. Empty publication libraries remain accurate. All currently published indexes and preview detail routes carry `robots: noindex` until records are approved and site publishing is authorized. Drafts are not put into the sitemap.

Publishing involves updating the typed records after real content has been reviewed. Later the Part 12 Admin/CMS should replace this source with database-backed editorial records and secure media storage, status transitions, signed uploads, author permissions, revisions, moderation, audit trail, sanitization, and SEO metadata. Never treat editable frontend data as an authorization system.

### Files
- `apps/web/src/lib/editorial.ts`, `editorial.test.ts`
- `apps/web/src/components/editorial/editorial-catalog.tsx`
- `apps/web/src/components/editorial/audio-player.tsx`
- `apps/web/src/components/editorial/media-gallery.tsx`
- `apps/web/src/components/editorial/editorial-motion.tsx`
- `apps/web/src/app/podcast/page.tsx`, `podcast/[slug]/page.tsx`
- `apps/web/src/app/media/page.tsx`, `media/[slug]/page.tsx`
- `apps/web/src/app/globals.css`, `tests/browser.spec.ts`

### Test and acceptance
`npm ci && npm run verify && npm run test:browser`.
Unit tests verify that no sample becomes an accidental release, audio paths are restricted, published records need transcript/media/date, and slugs are unique. Browser tests verify search, category filters, zero published items, no phantom audio players, detail navigation, draft noindex, accessible gallery lightbox, mobile overflow, automated WCAG AA checks, and reduced motion.

### Remaining before real media goes live
Real approved episode files, transcripts, guest permissions/credits, recording durations, publication dates, actual press materials, image rights, authors, release copy, CDN/media streaming strategy and legal policies. Actual storage and publishing authorization remain Part 11/12 tasks. Frontend visuals are design illustrations only.

No new third-party paid media services or dependencies were added.
