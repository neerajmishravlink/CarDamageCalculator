# Requirements

## Functional
- User registration via email magic‑link verification.
- Authenticated chat session where the user can:
  - Share location (auto‑filled from browser geolocation or manual address entry).
  - Upload one or more car images.
  - Receive a damage detection summary and a cost estimate.
- Backend must validate the user token before processing any request.
- AI model must run locally, no external paid API calls.

## Non‑functional
- All components must be free/open‑source.
- System should run on a single Docker‑Compose stack on Windows (Git‑Bash).
- Latency for inference < 5 seconds for a single image on a typical laptop GPU/CPU.
- Data privacy: images stored only temporarily in MinIO and deleted after processing.
