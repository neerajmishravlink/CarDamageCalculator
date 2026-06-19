# API Specification

All endpoints are served by FastAPI (`/api` root). JSON responses, proper HTTP status codes.

| Method | Path | Auth | Request Body | Response |
|--------|------|------|--------------|----------|
| **POST** | `/auth/request` | ❌ | `{ "email": "test@example.com" }` | `202 Accepted` – email sent (MailDev view) |
| **GET** | `/auth/verify?token=...` | ❌ | – | `200 OK` – `{ "access_token": "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" }` |
| **GET** | `/location` | ✅ | Query params `lat`, `lon` (optional). If omitted, backend returns `{ "city": "...", "region": "..." }` using IP fallback. | `200 OK` |
| **POST** | `/estimate` | ✅ | `multipart/form-data` with one or more `images` files. | `200 OK` – `{ "damage": ["front bumper", "left door"], "cost": "$1,200" }` |
| **GET** | `/openapi.json` | ❌ | – | OpenAPI schema |

### Error format
```json
{ "detail": "error description" }
```

### Rate limiting
- 30 requests/min per IP (implemented via `slowapi`).
- Exceeding returns `429 Too Many Requests`.
