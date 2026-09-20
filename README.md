# Driver Space — Phoenix Metro

A live driver-location page for Greater Phoenix: a stylized map (major freeways
+ Central Ave, cities, and a few informal neighborhood districts), an
unauthenticated public landing page for customers, and driver/admin logins.

- **Public landing page** (`/`) — no login required. Shows every driver who is
  currently online as a marker on the map.
- **Driver login** (`/login` → `/driver`) — a single "I'm driving" toggle.
  While on, the browser's geolocation is sent to the server every 5 minutes.
  Turning the toggle off immediately removes the driver from the public map.
- **Admin login** (`/login` → `/admin`) — see every driver's exact
  coordinates and online status, force a driver offline, and create new
  driver accounts.
- **Location privacy** — the server never stores or shows a driver's exact
  GPS fix to the public. Each ping is blurred with a random offset (default:
  up to ~400m, in a random direction) before it's exposed via the public
  API. Only admins see the true coordinates. A driver who goes offline (or
  whose last ping is older than ~12 minutes — two missed 5-minute cycles)
  disappears from the public map.

## Architecture

Two small apps, no external services required:

- `server/` — Node + Express + SQLite (via `better-sqlite3`, a single file
  on disk). Handles login (JWT), the driver online/offline toggle, location
  pings (with server-side jitter), and the public/admin read APIs.
- `client/` — React + Vite. A stylized SVG map (hand-built from
  approximate real coordinates, not a tile/GPS map) plus the four pages
  above.

A backend is required here (rather than a pure static single page) because
the driver's location has to be visible to *other* people's browsers — that
needs a shared server, not just client-side state.

## Running it locally

**1. Start the API:**

```bash
cd server
npm install
cp .env.example .env   # review/edit JWT_SECRET, jitter radius, etc.
npm start                # http://localhost:4000
```

On first run it seeds two accounts and prints the credentials once:

- admin: `admin` / `admin123`
- driver: `driver1` / `driver123`

**Change both passwords** (via the admin UI's driver-creation flow for new
drivers, or by editing the DB directly) before using this anywhere real —
these seed credentials exist only to make first boot usable.

**2. Start the client** (separate terminal):

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:4000`, so just
open `http://localhost:5173`.

For a production build: `npm run build` in `client/` produces static
files in `client/dist/`.

## Deploying: Netlify (client) + a separate host (API)

**Netlify only serves static files** — it can't run the stateful
Express/SQLite API long-term. So the split is: client on Netlify, API on
any Node host that keeps a persistent disk (Render, Fly.io, Railway, a
VPS, etc.). Deploy the API first, then the client.

**1. API** — deploy `server/` to a Node host. A `render.yaml` blueprint is
included as one easy option (Render's free tier supports a small
persistent disk, which the app needs so the SQLite file survives
restarts/deploys):

- On Render: New → Blueprint → point at this repo → it reads `render.yaml`
  and provisions the service + a 1GB disk mounted for the DB.
- On any other host: run `npm install && npm start` from `server/`, set
  `JWT_SECRET` to a real secret, and set `DATA_DIR` to a path on a
  persistent volume (without one, the SQLite file — and every driver
  account — is wiped on each redeploy).
- Note the API's public URL once it's up (e.g.
  `https://driver-space-api.onrender.com`).

**2. Client on Netlify:**

- New site from Git → this repo. `netlify.toml` at the repo root already
  sets the base directory (`client`), build command (`npm run build`),
  publish directory (`dist`), and the SPA redirect that `/login`,
  `/driver`, and `/admin` need to load directly (React Router routes,
  not real files).
- Add one environment variable in Netlify's site settings:
  `VITE_API_BASE_URL` = the API's URL from step 1 (no trailing slash, no
  `/api` suffix — the client appends that itself).
- Deploy. Netlify rebuilds on every push to this branch.

**3. Connect them:** once the Netlify URL exists, set `CORS_ORIGIN` on the
API host to that URL (comma-separate it with any Netlify deploy-preview
domain you use) so the browser is allowed to call the API cross-origin.

## Notes / things to revisit before real-world use

- The driver's browser must have location permission granted and stay open
  (a background tab is fine; a fully closed tab stops sending pings, and
  the driver silently drops off the public map after ~12 minutes).
- The 5-minute update interval and ~400m jitter radius are both configurable
  via `server/.env` (`STALE_AFTER_MS`, `JITTER_RADIUS_METERS`).
- The stylized map's freeway/city/neighborhood positions are approximate
  and hand-placed (`client/src/data/phoenixMapData.js`) — good for a
  recognizable at-a-glance layout, not for turn-by-turn accuracy.
- Auth is a simple username/password + JWT; there's no password reset flow
  or rate limiting on login yet.
- `CORS_ORIGIN` (API) and `VITE_API_BASE_URL` (client) only matter once the
  two are deployed separately (see Deploying, above) — leave both unset for
  local dev.
