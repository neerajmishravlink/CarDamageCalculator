# Architecture Overview

```mermaid
graph LR
    subgraph Frontend
        UI[React SPA] -->|HTTPS| API[FastAPI Backend]
    end
    subgraph Backend
        API --> Auth[JWT Auth Middleware]
        API --> Loc[Nominatim Wrapper]
        API --> Estimate[Estimate Service]
        Estimate --> Model[YOLO‑v5 + SAM + Llama‑cpp]
        Model --> MinIO[MinIO Object Store]
        MinIO --> Model
        Auth --> MailDev[MailDev (SMTP mock)]
    end
    subgraph Infra
        Docker[Docker‑Compose] --> Frontend
        Docker --> Backend
        Docker --> MinIO
        Docker --> MailDev
    end
```

## Components
| Component | Language / Tool | Role |
|-----------|----------------|------|
| React SPA | JavaScript (Create‑React‑App) | Chat UI, image upload, geolocation |
| FastAPI | Python 3.11 | REST API, auth, endpoint orchestration |
| JWT + Magic‑link | itsdangerous + maildev | Password‑less verification |
| YOLO‑v5 + Segment Anything | PyTorch | Damage detection & segmentation |
| Llama‑cpp (7B) | C++ inference | Textual cost estimation |
| MinIO | S3‑compatible storage | Temporary image bucket, auto‑expire |
| Nominatim | Public OSM API | Reverse/forward geocoding |
| Docker‑Compose | YAML | One‑click local dev stack |
| MailDev | Node | Local SMTP server for demo emails |

## Data Flow
1. UI posts `/auth/request` → Backend emails magic‑link.
2. User clicks link → token stored in browser (JWT).
3. UI calls `/location` (browser geolocation or manual address).
4. UI uploads images via `/estimate` (multipart/form‑data).
5. Backend stores images to MinIO (TTL 5 min), runs Model, deletes files.
6. Model returns damage list → cost estimator → JSON response.
7. UI renders chat message with estimate.

## Security
- All internal traffic stays inside Docker network.
- External ports: 3000 (frontend), 8000 (backend), 1080 (MailDev UI).
- MinIO bucket policy restricts to service account.
- JWT secret in `.env`; never committed.
- Images deleted after inference to protect privacy.
