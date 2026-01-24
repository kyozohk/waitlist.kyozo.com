# Vercel Deployment Setup

## Overview

This project uses **Vite for the frontend** (keeping the exact UI) and **Vercel Serverless Functions** for the backend email API. This is the perfect hybrid approach that:

- ✅ Keeps your Vite frontend exactly as it is (no UI changes)
- ✅ Adds backend email functionality via Vercel API routes
- ✅ Deploys seamlessly to Vercel
- ✅ No Express server needed

## Architecture

```
Frontend (Vite)          Backend (Vercel Functions)
├── src/app/            ├── api/
│   ├── App.tsx         │   ├── send-notification.js
│   └── components/     │   └── send-reply.js
└── src/lib/
    └── email.ts (API client)
```

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Local Development

```bash
# Run Vite dev server (frontend)
pnpm dev

# Vercel API routes will work automatically when deployed
# For local testing of API routes, install Vercel CLI:
pnpm i -g vercel
vercel dev
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### 5. Configure Vercel Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add `RESEND_API_KEY` and all Firebase variables
3. Redeploy

## API Endpoints

### POST /api/send-notification
Sends email notification when someone submits the waitlist form.

**Request:**
```json
{
  "formData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    ...
  }
}
```

### POST /api/send-reply
Sends reply email from admin dashboard.

**Request:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome to Kyozo!",
  "message": "<html>...</html>"
}
```

## Usage in Frontend

```typescript
import { sendNewSubmissionNotification } from '@/lib/email';

// In your form submission handler
await sendNewSubmissionNotification(formData);
```

## Benefits of This Approach

1. **No UI Changes** - Your Vite frontend stays exactly as it is
2. **Serverless** - No need to manage Express servers
3. **Scalable** - Vercel handles scaling automatically
4. **Cost Effective** - Pay only for what you use
5. **Easy Deployment** - One command deployment
6. **Environment Variables** - Secure secret management

## Vercel Configuration

The `vercel.json` file configures:
- Build command: `pnpm build`
- Output directory: `dist` (Vite build output)
- API routes: `/api/*` → serverless functions

## Notes

- API routes are automatically serverless functions on Vercel
- No Express server needed
- Frontend and backend deploy together
- CORS is handled in the API routes
- Environment variables are secure and not exposed to frontend
