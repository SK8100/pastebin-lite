# Pastebin Lite

A minimal Pastebin-like web application where users can create text pastes and share a URL to view them. Pastes can optionally expire based on time or view count.

---

## Live Demo

You can try the app live at: https://pastebin-lite-git-main-shivas-projects-554bcaf3.vercel.app/

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Upstash Redis** (persistence)
- **Vercel** (deployment)

---

## Features

- Create a paste containing arbitrary text
- Receive a shareable URL for the paste
- View paste via API or HTML page
- Optional TTL-based expiration
- Optional view-count limits
- Deterministic expiry support for automated tests
- Health check endpoint reflecting persistence availability
- Safe rendering of paste content (no script execution)

---

## API Endpoints

### Health Check

**GET** `/api/healthz`

Returns whether the service and persistence layer are available.

**Response (200):**
```json
{
  "ok": true
}
```

---

### Create a Paste

**POST** `/api/pastes`

**Request Body (JSON):**
```json
{
  "content": "hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
```

**Rules:**
- `content` is required and must be a non-empty string
- `ttl_seconds` is optional (integer ≥ 1)
- `max_views` is optional (integer ≥ 1)

**Response (2xx):**
```json
{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}
```

Invalid input returns a 4xx status with a JSON error response.

---

### Fetch a Paste (API)

**GET** `/api/pastes/:id`

**Response (200):**
```json
{
  "content": "hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

**Notes:**
- `remaining_views` is `null` if unlimited
- `expires_at` is `null` if no TTL
- Each successful fetch counts as a view
- Unavailable cases (missing, expired, or view limit exceeded) return HTTP 404 with JSON response

---

### View a Paste (HTML)

**GET** `/p/:id`

- Returns an HTML page containing the paste content
- Returns HTTP 404 if the paste is unavailable
- Paste content is rendered safely (no script execution)

---

## Deterministic Time Testing

To support deterministic expiry testing for automated graders:

If the environment variable is set:
```
TEST_MODE=1
```

Then the request header:
```
x-test-now-ms: <milliseconds since epoch>
```

is treated as the current time for expiry logic only. If the header is absent, system time is used.

---

## Persistence Layer

This application uses **Upstash Redis** as its persistence layer.

**Why Redis?**
- Survives across serverless requests on Vercel
- Supports atomic operations for view-count enforcement
- Allows reliable TTL handling for paste expiration
- No in-memory global state is used

---

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/SK8100/pastebin-lite.git
cd pastebin-lite
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env.local`
```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Optional for deterministic testing
TEST_MODE=1
```

### 4. Start the development server
```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

---

## Design Decisions

- Redis chosen for serverless-safe persistence
- All unavailable paste cases consistently return HTTP 404
- Strict input validation with clear error responses
- Shared time utility used for deterministic testing support
- No secrets or credentials committed to the repository
- No reliance on global mutable state

---

## Deployment

The application is deployed on **Vercel**.

Redis connectivity is configured using environment variables in the Vercel dashboard. No manual database migrations or shell access are required.

---

## License

MIT
