# VPN Testing and API Validation Guide

## Prerequisites

### 1. VPN Connection
You need to connect to IBM's VPN to access the MREF/TRIRIGA development environment.

**VPN Details:**
- Host: `tririga-dev.fss.ibm.com`
- Environment: IBM MREF Development
- Required: IBM VPN client or compatible VPN software

### 2. Test VPN Connectivity

```bash
# Test DNS resolution
ping tririga-dev.fss.ibm.com

# Test HTTPS connectivity
curl -I https://tririga-dev.fss.ibm.com

# Expected: Should resolve and return HTTP response (not "Could not resolve host")
```

## Step-by-Step Testing Process

### Phase 1: Basic Connectivity Test

#### 1.1 Test OSLC Endpoint Availability
```bash
cd capital-project-coordinator

# Test if endpoint is reachable
curl -I https://tririga-dev.fss.ibm.com/oslc/so/cstCapitalProjectRS

# Expected Response:
# HTTP/1.1 401 Unauthorized (authentication required)
# or
# HTTP/1.1 200 OK (if no auth required)
```

#### 1.2 Test Authentication Endpoint
```bash
# Test login endpoint
curl -X POST https://tririga-dev.fss.ibm.com/j_security_check \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "j_username=YOUR_USERNAME&j_password=YOUR_PASSWORD" \
  -c cookies.txt -v

# Expected: Should return session cookie (JSESSIONID)
```

### Phase 2: Application Testing

#### 2.1 Start Development Server
```bash
# Make sure .env file is configured
cat .env

# Should contain:
# VITE_MREF_BASE_URL=https://tririga-dev.fss.ibm.com
# VITE_MREF_USERNAME=your_username
# VITE_MREF_PASSWORD=your_password

# Start the dev server
npm run dev
```

#### 2.2 Test in Browser
1. Open http://localhost:5173
2. Open Browser DevTools (F12)
3. Go to Network tab
4. Navigate to Dashboard page
5. Click "Connect to MREF" button
6. Check Network tab for API calls

**Expected Network Calls:**
```
POST /api/j_security_check (should return 200 or 302)
GET /api/oslc/so/cstCapitalProjectRS (should return 200 with data)
```

### Phase 3: Diagnostic Testing

#### 3.1 Run Built-in Diagnostics
```bash
# The app includes network diagnostics
# Open browser console and run:
```

In Browser Console:
```javascript
// Test VPN connectivity
await fetch('/api/oslc/so/cstCapitalProjectRS')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e));

// Test authentication
await fetch('/api/j_security_check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'j_username=YOUR_USER&j_password=YOUR_PASS',
  credentials: 'include'
}).then(r => console.log('Auth Status:', r.status));
```

#### 3.2 Check Vite Proxy Logs
The Vite dev server logs all proxy requests. Check terminal output for:
```
[vite] http proxy: /api/oslc/so/cstCapitalProjectRS -> https://tririga-dev.fss.ibm.com/oslc/so/cstCapitalProjectRS
```

### Phase 4: API Validation

#### 4.1 Test Capital Projects Endpoint
```bash
# With authentication cookie
curl -X GET https://tririga-dev.fss.ibm.com/oslc/so/cstCapitalProjectRS \
  -H "Cookie: JSESSIONID=YOUR_SESSION_ID" \
  -H "Accept: application/json"

# Expected: JSON array of capital projects
```

#### 4.2 Validate Response Structure
Expected JSON structure:
```json
{
  "oslc:results": [
    {
      "rdf:about": "project_uri",
      "dcterms:title": "Project Name",
      "tririga:projectNumber": "PRJ-001",
      "tririga:projectStatus": "Active",
      "tririga:totalBudget": 1000000,
      "tririga:building": "Building Name"
    }
  ]
}
```

## Common Issues and Solutions

### Issue 1: "Could not resolve host"
**Cause:** VPN not connected or DNS not configured  
**Solution:** 
- Connect to IBM VPN
- Verify DNS resolution: `ping tririga-dev.fss.ibm.com`
- Check VPN client status

### Issue 2: 401 Unauthorized
**Cause:** Invalid credentials or session expired  
**Solution:**
- Verify credentials in .env file
- Check if username/password are correct
- Try manual login via browser first

### Issue 3: CORS Errors
**Cause:** Browser blocking cross-origin requests  
**Solution:**
- Vite proxy should handle this automatically
- Verify vite.config.js proxy configuration
- Check that requests go through `/api` prefix

### Issue 4: Cookie Not Being Sent
**Cause:** Browser not including credentials  
**Solution:**
- Verify `withCredentials: true` in axios config
- Check that cookies are being set (DevTools > Application > Cookies)
- Ensure proxy is rewriting cookie domain

### Issue 5: Proxy Not Working
**Cause:** Vite proxy misconfiguration  
**Solution:**
- Restart dev server: `npm run dev`
- Check vite.config.js proxy settings
- Verify VITE_MREF_BASE_URL in .env

## Testing Checklist

- [ ] VPN connected and verified
- [ ] DNS resolves tririga-dev.fss.ibm.com
- [ ] .env file configured with credentials
- [ ] Dev server starts without errors
- [ ] Browser can access http://localhost:5173
- [ ] Network tab shows /api requests
- [ ] Authentication returns session cookie
- [ ] Capital projects endpoint returns data
- [ ] Data displays correctly in UI
- [ ] Error handling works for failed requests
- [ ] Session refresh works on 401 errors

## Advanced Testing

### Test Session Management
```javascript
// In browser console
// 1. Login
await fetch('/api/j_security_check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'j_username=USER&j_password=PASS',
  credentials: 'include'
});

// 2. Fetch data
const response = await fetch('/api/oslc/so/cstCapitalProjectRS', {
  credentials: 'include'
});
const data = await response.json();
console.log('Projects:', data);

// 3. Check session cookie
document.cookie.split(';').forEach(c => console.log(c.trim()));
```

### Test Error Handling
```javascript
// Test 401 handling (expired session)
// 1. Clear cookies
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// 2. Try to fetch data (should trigger auto-login)
const response = await fetch('/api/oslc/so/cstCapitalProjectRS', {
  credentials: 'include'
});
console.log('Status:', response.status);
```

### Test Network Resilience
```javascript
// Test timeout handling
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // 5 second timeout

try {
  const response = await fetch('/api/oslc/so/cstCapitalProjectRS', {
    credentials: 'include',
    signal: controller.signal
  });
  console.log('Success:', response.status);
} catch (error) {
  console.error('Timeout or error:', error.message);
}
```

## Performance Testing

### Measure API Response Times
```javascript
// In browser console
const start = performance.now();
await fetch('/api/oslc/so/cstCapitalProjectRS', {
  credentials: 'include'
});
const end = performance.now();
console.log(`API call took ${end - start}ms`);
```

### Test Concurrent Requests
```javascript
// Test multiple simultaneous requests
const requests = Array(5).fill(null).map(() => 
  fetch('/api/oslc/so/cstCapitalProjectRS', {
    credentials: 'include'
  })
);

const start = performance.now();
const responses = await Promise.all(requests);
const end = performance.now();
console.log(`${requests.length} requests took ${end - start}ms`);
console.log('All successful:', responses.every(r => r.ok));
```

## Next Steps After Successful Testing

1. **Document Findings**
   - Record actual API response structure
   - Note any deviations from expected format
   - Document performance metrics

2. **Update Mock Data**
   - Replace mock data with real data structure
   - Update TypeScript interfaces if needed
   - Adjust UI components for real data

3. **Implement Production Features**
   - Add proper error messages
   - Implement retry logic
   - Add loading indicators
   - Handle edge cases

4. **Security Hardening**
   - Remove credentials from .env (use secure vault)
   - Implement token refresh
   - Add request signing
   - Enable HTTPS only

5. **Performance Optimization**
   - Implement caching
   - Add request debouncing
   - Optimize data fetching
   - Add pagination

## Support and Resources

- **MREF Documentation**: Check knowledge-base/mref-entities.md
- **OSLC API Reference**: Check knowledge-base/oslc-api-mapping.md
- **Troubleshooting**: Check knowledge-base/known-issues-and-fixes.md
- **Architecture**: Check knowledge-base/architecture-decisions.md

## Contact

For VPN access issues, contact IBM IT Support.
For API access issues, contact MREF/TRIRIGA team.