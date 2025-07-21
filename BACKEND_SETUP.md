# Backend Configuration Guide

## Current Issue
The Stock Journal frontend is trying to connect to `http://127.0.0.1:8096` but your backend server is not accessible at this URL.

## Solution Options

### Option 1: Find Your Backend Server Port
If your backend is already running but on a different port, you need to find which port it's using:

1. **Check your backend server logs** to see which port it's running on
2. **Look for other working API endpoints** in your browser network tab to see their base URL
3. **Update the backend URL** in one of these ways:

#### Method A: Environment Variable (Recommended)
```bash
export BACKEND_URL="http://127.0.0.1:YOUR_ACTUAL_PORT"
npm run dev
```

#### Method B: Direct Code Change
Edit `server/routes.ts` line 5:
```typescript
const BACKEND_BASE_URL = "http://127.0.0.1:YOUR_ACTUAL_PORT";
```

### Option 2: Start Your Backend Server on Port 8096
Make sure your backend server is running with these endpoints:
- `GET /api/get-stock-journals/`
- `GET /api/get-voucher-types/`
- `GET /api/get-stock-journals-detail/{transaction_id}/`
- `POST /api/process/sync-to-tally/`

### Option 3: Test Backend Connectivity
Use the test endpoint to verify connection:
```bash
curl http://localhost:5000/api/test-backend
```

## Quick Fix
Since you mentioned other APIs are working, please:

1. **Check your browser Network tab** when accessing other working pages
2. **Find the base URL** of your working API calls (e.g., `http://127.0.0.1:3000` or `http://127.0.0.1:8000`)
3. **Tell me the correct port number**, and I'll update the configuration immediately

## Current Configuration
- Frontend server: `http://localhost:5000` (working)
- Backend server: `http://127.0.0.1:8096` (not accessible)
- Stock Journal APIs: Not working because backend is unreachable

The frontend code is ready and will work immediately once the correct backend URL is configured.