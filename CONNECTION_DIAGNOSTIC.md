# Connection Error Diagnostic Guide

If you're seeing "Unable to connect to the server" error, follow these steps:

## Step 1: Verify Backend is Running

```bash
# Test backend health endpoint
curl https://waleed-project-production.up.railway.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "databaseConnected": true,
  "mode": "production"
}
```

**If this fails:**
- Check Railway dashboard for deployment status
- Verify environment variables are set in Railway
- Check MongoDB connection string is correct
- Review Railway logs for errors

## Step 2: Verify Frontend Configuration

### For Development
```bash
# Check .env file
cat frontend/.env
# Should show: REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api
```

### For Production (Vercel)
```bash
# Check .env.production file
cat frontend/.env.production
# Should show: REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api
```

### For Local Testing
```bash
cd frontend
npm start
# Open browser console (F12)
# You should see API logs like: "API Base URL: https://waleed-project-production.up.railway.app/api"
```

## Step 3: Check Browser Console

1. Open DevTools: `F12`
2. Go to **Console** tab
3. Look for these log patterns:

**Good (working):**
```
API Base URL: https://waleed-project-production.up.railway.app/api
API Request: POST /auth/login
API Response: 200 /auth/login
```

**Bad (not working):**
```
API Base URL: http://localhost:5001/api (should not show localhost)
API Error: Network Error
CORS error in console
```

## Step 4: Check Network Tab

1. Open DevTools: `F12`
2. Go to **Network** tab
3. Try to login or load data
4. Click on API requests and check:

**Response Headers should include:**
```
access-control-allow-credentials: true
access-control-allow-origin: https://medilease.vercel.app
access-control-allow-methods: GET,POST,PUT,DELETE,OPTIONS
```

**Request Headers should include:**
```
Authorization: Bearer {token}  (if logged in)
Content-Type: application/json
```

## Step 5: Test CORS Manually

```bash
# Test if CORS allows Vercel domain
curl -X OPTIONS https://waleed-project-production.up.railway.app/api/auth/login \
  -H "Origin: https://medilease.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Should include CORS headers in response
```

## Step 6: Test API Endpoint

```bash
# Test login endpoint
curl -X POST https://waleed-project-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://medilease.vercel.app" \
  -d '{"email":"test@test.com","password":"test123"}'

# Should return response (even if authentication fails)
```

## Common Solutions

### Solution 1: Clear Cache & Reload
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Solution 2: Hard Refresh
- Windows/Linux: `Ctrl + Shift + R`
- macOS: `Cmd + Shift + R`

### Solution 3: Rebuild Frontend
```bash
cd frontend
npm install
npm run build
# This uses .env.production
```

### Solution 4: Check Environment Variables

**In Vercel:**
1. Go to project settings
2. Click "Environment Variables"
3. Add/verify: `REACT_APP_API_URL=https://waleed-project-production.up.railway.app/api`
4. Redeploy

**In Railway (Backend):**
1. Go to Variables
2. Verify all are set:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL=https://medilease.vercel.app`

### Solution 5: Check Build Output

```bash
cd frontend
# Look for build output
cat build/static/js/main.*.js | grep "waleed-project-production"
# Should find the Railway URL in the build
```

## Network Debugging

### If behind corporate firewall/proxy:
- Check if outbound HTTPS to Railway is allowed
- Contact network admin for access

### If using VPN:
- Try disabling VPN
- Some VPNs block external API calls

### If on slow connection:
- Check timeout settings
- The API has 10-second timeout

## Still Not Working?

Check these files in order:

1. **frontend/src/config/api.js**
   - Should import axios and create API instance
   - Should have interceptors for logging

2. **frontend/src/utils/authUtils.js**
   - Should export getAuthConfig function
   - Should return headers with Authorization

3. **frontend/src/controller/authController.js**
   - Should import API instance (not axios)
   - Should use `/auth/login` path

4. **backend/server.js**
   - Should have CORS configured for Vercel domain
   - Should include Authorization in allowed headers

5. **backend/.env**
   - MONGODB_URI should be set
   - JWT_SECRET should be set
   - FRONTEND_URL should be set to Vercel domain

## Testing Checklist

- [ ] Backend health check returns 200
- [ ] CORS headers present in response
- [ ] Frontend console shows correct API URL
- [ ] Browser Network tab shows requests to railway URL
- [ ] No CORS errors in browser console
- [ ] localStorage has correct token (if logged in)
- [ ] Environment variables set in both Vercel and Railway
- [ ] .env.production has correct API URL
- [ ] Build includes railway URL (verify in build output)

## Emergency Debugging

If nothing works, run this to collect all diagnostics:

```bash
echo "=== Frontend Env Check ==="
cat frontend/.env
cat frontend/.env.production

echo "=== Build Status ==="
cd frontend && npm run build

echo "=== API URL in Build ==="
cat build/static/js/main.*.js | grep -o "waleed-project-production" | head -1

echo "=== Backend Health ==="
curl -I https://waleed-project-production.up.railway.app/api/health

echo "=== CORS Test ==="
curl -I -X OPTIONS https://waleed-project-production.up.railway.app/api/auth/login \
  -H "Origin: https://medilease.vercel.app"
```

Share the output of these checks with the team for faster debugging.
