# Deploying Pastebin-Lite to Vercel

Since this is a Next.js application, it is optimized for Vercel. Follow these steps to get your app live:

## 1. Prerequisites
You will need a production Redis instance. I recommend **Upstash** or **Vercel KV**.

## 2. Environment Variables
In the Vercel Dashboard, go to **Settings > Environment Variables** and add the following:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `REDIS_url` | `redis://...` | Your production Redis connection string |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | Your public deployment URL |
| `TEST_MODE` | `0` | Set to `1` only if you need to run automated tests |

## 3. Deployment Steps
1.  **Push to GitHub/GitLab**: If you haven't already, push your code to a repository.
2.  **Import to Vercel**:
    - Go to [vercel.com/new](https://vercel.com/new).
    - Select your repository.
    - Expand "Environment Variables" and add the ones from Step 2.
    - Click **Deploy**.

## 4. Why the local setup won't work on Vercel
The `docker-compose.yml` and `localhost:6379` references are only for **local development**. Vercel is a serverless platform and cannot run Docker containers. You *must* use a managed Redis service like Upstash for the live site.
