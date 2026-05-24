# Deployment & Troubleshooting Checklist

## Frontend Configuration ✅
- [x] `.env` file with `REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api`
- [x] `.env.production` file with production API URL
- [x] `package.json` with `"homepage": "https://medilease.vercel.app"`
- [x] `vercel.json` configured for SPA routing
- [x] API instance with interceptors for logging and error handling
- [x] Authentication utilities with proper headers
- [x] Auth controller using API instance instead of direct axios

## Backend Configuration ✅
- [x] CORS configured for `https://medilease.vercel.app`
- [x] CORS allows credentials, POST, PUT, DELETE, OPTIONS
- [x] CORS allows Authorization header
- [x] Health check endpoint working
- [x] All API routes configured

## Debugging Tips

### If you see "Unable to connect to the server":

1. **Check Browser Console (F12)**
   - Look for API request logs
   - Check error messages in Network tab
   - Verify API URL is correct

2. **Verify Backend URL**
   - Test: `curl https://waleed-project-production.up.railway.app/api/health`
   - Should respond with `{"success":true,"message":"Server is running"...}`

3. **Test CORS**
   - Check if CORS headers are being sent
   - Verify Origin header matches `https://medilease.vercel.app`

4. **Check Frontend Environment Variables**
   - Development: Uses `.env`
   - Production (Vercel): Uses `.env.production`
   - Build: Uses `.env.production` when running `npm run build`

5. **Clear Browser Cache**
   - Clear localStorage: `localStorage.clear()`
   - Clear browser cache and cookies
   - Try in private/incognito window

### Common Issues:

| Issue | Solution |
|-------|----------|
| 404 errors | Check API URL in .env and backend routes |
| CORS errors | Verify backend CORS config includes Vercel domain |
| "Unable to connect" | Check internet connection, verify backend is running |
| Auth errors | Ensure JWT_SECRET matches between frontend and backend |
| Token not being sent | Check localStorage for 'token' key |

## Environment Variables

### Backend (Railway)
```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=8080 (Railway sets this)
FRONTEND_URL=https://medilease.vercel.app
```

### Frontend (Vercel / Local Development)
```
REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api
```

## Testing Flow

1. **Start Fresh**
   ```bash
   # Clear everything
   npm run build
   # This creates the optimized build
   ```

2. **Verify Backend Connection**
   ```bash
   curl https://waleed-project-production.up.railway.app/api/health
   ```

3. **Test in Development**
   ```bash
   npm start
   # Open browser console to see API logs
   ```

4. **Deploy to Vercel**
   - Push to GitHub
   - Vercel auto-deploys
   - Check Vercel deployments tab for build logs

## Log Locations

- **Frontend Logs**: Browser console (F12)
  - API requests are logged
  - Errors are logged with full details
  
- **Backend Logs**: Railway dashboard
  - View deployment logs
  - Check for errors during startup

## Quick Verification

After deployment, verify:
1. ✅ Health check responds
2. ✅ Can reach login page
3. ✅ Can attempt login (will fail if no user, but should reach backend)
4. ✅ Network tab shows API requests to correct URL
5. ✅ CORS headers present in responses
