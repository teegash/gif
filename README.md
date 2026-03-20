# Thematic Reveal Frontend Prototype

Frontend-only proof of concept for the cinematic gift reveal idea described in the markdown files.

## What it shows

- A 4-chapter reveal flow:
  sender world, journey sequence, receiver anticipation, grand reveal
- Multi-theme switching:
  Pirate Voyage, Valentine Bloom, Mother's Day Glow
- Advanced frontend motion patterns:
  GSAP `ScrollTrigger`, pinned stage, scrubbed transitions, 3D-style CSS transforms, smooth scroll via Lenis
- A client-ready concept page that proves the storytelling and visual direction before backend work

## How to open it

Open [`index.html`](./index.html) in a browser.

If you want a local server instead, from this folder you can run:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Notes

- This prototype intentionally uses CDN-delivered GSAP and Lenis so there is no build setup yet.
- The next step can be migrating this into a proper React or Next.js app and wiring it to real backend data, QR codes, analytics, audio, and media assets.
