# CertFlow — waitlist landing page

A single-page marketing landing page for CertFlow (instant Certificates of Insurance
for small US independent P&C agencies). Built with Next.js + the `motion` library.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Before you launch — two things to edit

1. **Connect the email forms.** Both waitlist forms post to a placeholder Formspree
   endpoint. Replace `REPLACE_ME` with your real Formspree form ID:
   - `src/components/WaitlistForm.tsx` → `FORMSPREE_ENDPOINT`

   Each submission also sends a `source` field (`hero` or `footer-cta`) so you can
   tell which form a signup came from.

2. **Swap the illustrative numbers.** Stats and the sample certificate are realistic
   placeholders, marked with `EDIT:` comments:
   - `src/app/page.tsx` → `OUTCOMES` (9 sec / 6+ hrs / 0 / 24-7) and the stat footnote
   - `src/components/Certificate.tsx` → the sample COI data
   - `src/app/layout.tsx` → `SITE_URL` for correct metadata/Open Graph

## Where things live

- `src/app/page.tsx` — page content + copy (hero, pain, how-it-works, outcomes, trust, CTA)
- `src/app/globals.css` — design tokens (color, type, the "form-grid" primitives)
- `src/components/Certificate.tsx` — the self-filling ACORD-style hero certificate
- `src/components/WaitlistForm.tsx` — Formspree form, email validation, success state
- `src/components/Reveal.tsx` — scroll-reveal wrapper (respects reduced motion)

## Notes

- Email is validated client-side; submit shows a loading → success/error state and
  clears the input on success.
- All animations honor `prefers-reduced-motion`.
- Responsive across 375 / 768 / 1024 / 1440px.
