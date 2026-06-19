# CarDamageCalculator

Car Damage Calculator

## Run the application

Start the full stack from the repository root:

```powershell
start-stack.cmd
```

This runs the frontend, backend, MinIO, and MailDev services in Docker.

If Docker is not installed, `start-stack.cmd` will automatically fall back to local frontend/backend startup using `npm.cmd` and `python`.

If you prefer to run the frontend outside Docker, use:

```powershell
cd frontend
npm.cmd install
npm.cmd start
```

If PowerShell blocks unsigned npm scripts, run:

```powershell
cd frontend
start.cmd
```

To run the backend locally instead of Docker:

```powershell
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open `http://localhost:3000` and use the backend API at `http://localhost:8000`.

If you are running the backend locally without a Docker MinIO service, uploads will automatically fall back to the local `backend/uploads` directory.

When running the frontend locally, the app already targets `http://localhost:8000` by default. To override it, set:

```powershell
$env:REACT_APP_API_URL='http://localhost:8000'
npm.cmd start
```

Clicking the magic link will auto-verify the token in the frontend when the page loads.

## Build static docs

From the repository root, run:

```powershell
python -m pip install -r tools/requirements-docs.txt
python tools/build_docs.py
```

Or use the helper script on Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build_docs.ps1
```

Then open `docs/index.html` in a browser.
