# Inventory + POS — Demo

This repository is a minimal Inventory + POS system designed to demonstrate a full-stack project you can host for free.

## Structure
- `frontend/` — static site (index.html, main.js, styles.css). Host this on **Vercel** or **Netlify** as a static site.
- `backend/` — Node.js + Express API storing data in `data.json`. Host this on **Render** or **Railway** (free tiers).

## Quick start (local)
### Backend
```bash
cd backend
npm install
npm start
# server on http://localhost:3000
```

### Frontend
Open `frontend/index.html` in your browser. By default the frontend uses same-origin; to call backend locally, set `localStorage.setItem('API_URL', 'http://localhost:3000')` in browser console, then reload.

## Deploying (recommended)
### 1) Push to GitHub
Create a new repository on GitHub and upload the unzipped files (or push with git).

### 2) Deploy backend
- Use **Render** or **Railway**:
  - Create New Web Service → Connect GitHub → Select `backend` folder (or monorepo root with `backend`).
  - Build & start command: `npm install && npm start`
  - PORT is provided by the platform automatically.

### 3) Deploy frontend
- Use **Vercel**:
  - Import the repo and select the `frontend` folder (or deploy root and set output).
  - After deploy, set a browser `localStorage` key named `API_URL` to point to your backend production URL. For example, open developer console on the deployed frontend and run:
    ```js
    localStorage.setItem('API_URL', 'https://your-backend.onrender.com')
    ```
  - Reload frontend to connect to backend.

## Notes
- This demo uses a file-based `data.json` for simplicity. For production, use a proper DB (Postgres/MySQL) and environment variables for secrets.
- You can extend features: authentication, barcode scanning, receipts, reports export, role-based access.

