# Smart Agriculture — Crop Disease Detection & Farm Advisory System

A farmer-friendly web app for a hackathon prototype. Farmers can monitor crop health, detect possible crop diseases from uploaded leaf images, receive farm/weather advisory, check basic soil health, and view everything on a farmer dashboard.

## What's demo vs. real

| Feature | Status |
|---|---|
| Crop Disease Detection | **Demo/simulated** results. API structure is ready for a real AI model. |
| Farm Advisory (weather) | **Demo/simulated** weather. Ready to connect a live weather API. |
| Soil Health | **Real** basic assessment logic (pH + NPK thresholds). |
| Farmer Dashboard | Pulls from the above; demo fallbacks when no data exists. |

Disease and weather results are clearly labelled as demo data in the UI. The
response shapes match the documented backend API so a real Flask/AI backend
can be connected later without frontend changes.

## Tech stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Icons:** lucide-react
- **Routing:** hash-based (no server config needed)
- **Persistence:** browser localStorage (saves last scan/soil/weather for the dashboard)

The original spec described a separate Python Flask backend. This repo ships a
**frontend with a built-in simulated backend** (`src/lib/api.ts`) that mimics
the Flask endpoints (`/api/predict`, `/api/soil`, `/api/weather`) with latency
and graceful fallbacks. To use a real Flask backend instead, replace the
function bodies in `src/lib/api.ts` with `fetch()` calls to your Flask server
(see "Connecting a real backend" below).

## Getting started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the frontend
```bash
npm run dev
```
Then open the printed URL (usually http://localhost:5173).

### 3. Build for production
```bash
npm run build
npm run preview
```

## Connecting a real Flask backend (optional)

1. Create a Flask app exposing:
   - `GET /api/health`
   - `POST /api/predict` (multipart/form-data, field `image`)
   - `POST /api/soil` (JSON: `{ ph, nitrogen, phosphorus, potassium }`)
   - `GET /api/weather?location=...`
2. In `src/lib/api.ts`, replace each simulated function with a `fetch()` call
   to the matching endpoint, returning the same response shape.
3. Enable CORS on Flask so the browser can call it.

Example `/api/predict` response:
```json
{
  "success": true,
  "crop": "Tomato",
  "disease": "Healthy",
  "confidence": 0.92,
  "recommendation": "Continue monitoring the crop regularly."
}
```

## Connecting an AI model later

1. Train or obtain a crop disease classification model (e.g. TensorFlow/PyTorch).
2. Load it in the Flask `/api/predict` handler.
3. When no model is available, return a clearly-labelled demo response (as the
   current simulated backend does). Do not present mock predictions as real.

## Connecting a weather API later

1. Sign up for a weather API (e.g. OpenWeatherMap).
2. Store the API key in an environment variable — **do not hardcode it**.
3. Call it from the Flask `/api/weather` handler and return the shape the
   frontend expects (`location`, `temperatureC`, `humidity`, `rainfallMm`,
   `condition`, `irrigationAdvice`, `alerts`, `cropCare`).
4. If the API is unavailable, return demo data so the UI never breaks.

## Project structure
```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui.tsx          (shared UI: toasts, spinner, status dot, etc.)
├── lib/
│   ├── api.ts          (simulated backend — swap for real fetch calls)
│   ├── store.ts        (localStorage persistence)
│   └── types.ts
├── pages/
│   ├── Home.tsx
│   ├── CropDisease.tsx
│   ├── Advisory.tsx
│   ├── SoilHealth.tsx
│   └── Dashboard.tsx
├── App.tsx             (hash-based routing)
└── main.tsx
```

## Notes
- All pages are connected via the navbar and footer.
- Loading indicators, error messages, and offline-friendly fallbacks are built in.
- Responsive across mobile, tablet, and desktop.
