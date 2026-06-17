# Product Requirements Document (PRD)

## Overview
A web‑based chat application that lets a car owner obtain an AI‑generated repair estimate from photos of a damaged vehicle.

## Personas
- **Owner** – non‑technical, wants quick estimate and location‑based pricing.
- **Estimator** – team member who may review AI output (future extension).

## User Journey
1. Owner opens URL, enters email → receives magic‑link.
2. Clicks link → session token stored in browser.
3. Chat bot greets, asks for location (browser geolocation or address input).
4. Owner shares location.
5. Bot asks for car images.
6. Owner uploads images.
7. Backend runs damage detection + cost model, returns JSON:
   ```json
   {"damage": ["front bumper", "left door"], "cost": "$1,200"}
   ```
8. Bot displays summary in chat.

## Success Metrics
- 80 % of users receive an estimate within 30 seconds.
- 0 % storage of images after processing.
- No external paid API calls.

## Constraints
- Use only free/open‑source libraries.
- Must run on Windows with Docker.
- Team of 4, limited to ~2 weeks.

## Acceptance Criteria
- [ ] Email magic‑link verification works (maildev for demo).
- [ ] Auth middleware rejects unauthenticated calls.
- [ ] `/estimate` accepts multipart image, returns damage list & cost.
- [ ] Front‑end shows chat flow with location and image prompts.
- [ ] All docs version‑controlled in repo.
