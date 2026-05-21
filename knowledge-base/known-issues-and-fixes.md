# Known Issues and Fixes

## Issue #1: ENOTFOUND - DNS Resolution Failure

**Status**: 🔴 ACTIVE BLOCKER  
**Severity**: Critical  
**First Observed**: Session 5

### Symptoms
```
Error: getaddrinfo ENOTFOUND semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
```

### Root Cause
- MREF server hostname cannot be resolved by DNS
- Server requires VPN connection
- Local machine not connected to corporate network

### Impact
- Cannot test live API integration
- Cannot verify authentication flow
- Cannot fetch real project data
- Development blocked for live data features

### Resolution
**User Action Required**:
1. Connect to corporate VPN
2. Verify connectivity: `ping semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com`
3. Refresh browser
4. Check terminal for successful proxy logs

### Workaround
- Application falls back to mock data
- All UI functionality works
- Can demo without live API

### Status
⏳ Waiting for user VPN connection

---

## Issue #2: EADDRNOTAVAIL - Network Address Not Available

**Status**: 🔴 ACTIVE BLOCKER  
**Severity**: Critical  
**First Observed**: Session 5

### Symptoms
```
Error: connect EADDRNOTAVAIL
```

### Root Cause
- Network route to MREF server not available
- Related to VPN/network connectivity
- Same underlying issue as ENOTFOUND

### Resolution
Same as Issue #1 - requires VPN connection

---

## Issue #3: Set-Cookie Not Forwarded to Browser

**Status**: ✅ SOLVED  
**Severity**: Critical  
**First Observed**: Session 4  
**Resolved**: Session 5

### Symptoms
- Authentication succeeds (200 OK)
- Set-Cookie header present in response
- Browser doesn't store cookie
- Subsequent requests don't include JSESSIONID
- 401 Unauthorized on follow-up requests

### Root Cause
- MREF sets cookie for its domain (e.g., `semas.facilities...`)
- Browser running on localhost
- Cross-domain cookie restriction
- Browser rejects cookies from different domain

### Failed Attempts
1. **Manual cookie extraction**: HttpOnly prevents JavaScript access
2. **localStorage**: Not compatible with HttpOnly cookies
3. **Direct API calls**: CORS blocks cross-origin requests

### Solution
Vite proxy with cookie rewriting:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: MREF_BASE_URL,
    changeOrigin: true,
    secure: false,
    configure: (proxy) => {
      proxy.on('proxyRes', (proxyRes) => {
        const cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
          proxyRes.headers['set-cookie'] = cookies.map(cookie =>
            cookie
              .replace(/Secure;?/gi, '')              // Remove Secure flag
              .replace(/Domain=[^;]+;?/gi, 'Domain=localhost;')  // Set localhost
              .replace(/SameSite=[^;]+;?/gi, 'SameSite=Lax;')   // Allow cross-origin
          );
        }
      });
    }
  }
}
```

### Why This Works
1. Proxy intercepts MREF response
2. Modifies Set-Cookie header before sending to browser
3. Changes domain to localhost
4. Removes Secure flag (localhost is HTTP)
5. Sets SameSite=Lax for cross-origin
6. Browser accepts and stores cookie
7. Browser sends cookie automatically with subsequent requests

### Status
✅ Implemented and working (pending VPN test)

---

## Issue #4: HttpOnly Cookie Inaccessible from JavaScript

**Status**: ✅ SOLVED  
**Severity**: High  
**First Observed**: Session 3  
**Resolved**: Session 4

### Symptoms
```javascript
document.cookie  // Returns empty string
response.headers['set-cookie']  // undefined in browser
```

### Root Cause
- JSESSIONID is HttpOnly cookie
- Browser security prevents JavaScript access
- Protects against XSS attacks
- By design, not a bug

### Failed Attempts
1. **document.cookie**: Returns empty (HttpOnly)
2. **Response headers**: Not accessible in browser
3. **localStorage workaround**: Not compatible

### Solution
Rely on browser automatic cookie management:

```javascript
// Axios configuration
const apiClient = axios.create({
  withCredentials: true  // Enable automatic cookie handling
});

// No manual cookie code needed
// Browser manages everything automatically
```

### Key Learning
**Don't fight browser security. Work with it.**

HttpOnly cookies are:
- ✅ More secure (XSS protection)
- ✅ Automatically managed by browser
- ✅ Sent with every request automatically
- ❌ Not accessible via JavaScript
- ❌ Cannot be inspected in code

### Status
✅ Architecture changed to browser-managed cookies

---

## Issue #5: Postman Works, Browser Doesn't

**Status**: ✅ UNDERSTOOD  
**Severity**: Medium  
**First Observed**: Session 4

### Symptoms
- Postman successfully authenticates and fetches data
- Browser fails with CORS errors
- Same credentials, same endpoints
- Different behavior

### Root Cause
**Different Security Models**:

| Feature | Postman | Browser |
|---------|---------|---------|
| CORS | Ignored | Enforced |
| Cookies | Manual | Automatic |
| Security | Relaxed | Strict |
| Purpose | Testing | Production |

### Explanation
1. **Postman**: Desktop app, not subject to browser security
2. **Browser**: Enforces CORS, cookie policies, same-origin policy
3. **Not a bug**: Expected behavior

### Solution
- Use Vite proxy for development (handles CORS)
- Don't assume Postman behavior = browser behavior
- Test in actual browser, not just Postman

### Key Learning
**Postman success doesn't guarantee browser success.**

Always test in the actual deployment environment.

### Status
✅ Documented and understood

---

## Issue #6: CORS Preflight Failures

**Status**: ✅ SOLVED  
**Severity**: Medium  
**First Observed**: Session 4  
**Resolved**: Session 5

### Symptoms
```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header present
```

### Root Cause
- Browser makes preflight OPTIONS request
- MREF doesn't return proper CORS headers
- Browser blocks actual request

### Solution
Vite proxy makes requests server-side:

```javascript
proxy: {
  '/api': {
    target: MREF_BASE_URL,
    changeOrigin: true  // Critical for CORS
  }
}
```

**How it works**:
1. Browser makes request to localhost:5173/api/...
2. Vite proxy forwards to MREF server
3. Proxy makes request server-side (no CORS)
4. Proxy returns response to browser
5. Browser sees response from same origin (localhost)
6. No CORS issue

### Status
✅ Solved by proxy configuration

---

## Issue #7: Session Timeout Not Handled

**Status**: ⏳ PARTIALLY SOLVED  
**Severity**: Medium  
**First Observed**: Session 6

### Symptoms
- Session expires after 30-60 minutes
- Subsequent requests return 401 Unauthorized
- User sees error message
- Must manually refresh page

### Current Solution
Axios interceptor with auto-retry:

```javascript
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await createSession();  // Re-authenticate
      return apiClient.request(error.config);  // Retry
    }
    throw error;
  }
);
```

### Limitations
- Only retries once
- No exponential backoff
- No user notification
- No session refresh before expiry

### Future Improvements
- [ ] Proactive session refresh (before expiry)
- [ ] User notification of re-authentication
- [ ] Exponential backoff for retries
- [ ] Session timeout warning

### Status
⏳ Basic implementation done, enhancements pending

---

## Issue #8: Mock Data Structure Mismatch

**Status**: ⚠️ POTENTIAL ISSUE  
**Severity**: Low  
**First Observed**: Session 7

### Symptoms
- Mock data works fine
- Concern: May not match real MREF data structure
- Cannot verify until VPN connected

### Risk
- UI may break when switching to live data
- Field mappings may be incorrect
- Data types may differ

### Mitigation
- Mock data based on OSLC documentation
- Field names match OSLC spec
- Data types match expected format
- Will verify with live data once VPN available

### Action Items
- [ ] Test with live MREF data
- [ ] Verify field mappings
- [ ] Update mock data if needed
- [ ] Add data validation

### Status
⚠️ Monitoring - will verify with live data

---

## Issue #9: No Network Diagnostics

**Status**: ⏳ PLANNED  
**Severity**: Medium  
**First Observed**: Session 8

### Problem
- No visibility into connection status
- No way to test VPN connectivity
- No diagnostic information for debugging
- Users don't know why API fails

### Planned Solution
Network diagnostics panel showing:
- VPN/host reachability status
- Login API status
- Session established status
- OSLC API status
- Last API response
- Current environment URL

### Implementation Plan
```javascript
// src/utils/networkDiagnostics.js
export async function testHostReachability() { ... }
export async function testAuthEndpoint() { ... }
export async function testCapitalProjectEndpoint() { ... }
```

### Status
⏳ Planned for Phase 3

---

## Issue #10: No Error Recovery UI

**Status**: ⏳ PLANNED  
**Severity**: Low  
**First Observed**: Session 8

### Problem
- Errors shown in console only
- No user-friendly error messages
- No retry buttons
- No guidance on resolution

### Planned Solution
Enhanced error handling with:
- User-friendly error messages
- Specific error types (DNS, VPN, timeout, auth, etc.)
- Retry buttons
- Troubleshooting tips
- Status indicators

### Status
⏳ Planned for Phase 3

---

## Summary Table

| Issue | Status | Severity | Resolution |
|-------|--------|----------|------------|
| ENOTFOUND | 🔴 Active | Critical | VPN required |
| EADDRNOTAVAIL | 🔴 Active | Critical | VPN required |
| Cookie forwarding | ✅ Solved | Critical | Proxy rewrite |
| HttpOnly access | ✅ Solved | High | Browser-managed |
| Postman vs Browser | ✅ Understood | Medium | Expected behavior |
| CORS preflight | ✅ Solved | Medium | Proxy |
| Session timeout | ⏳ Partial | Medium | Auto-retry |
| Mock data mismatch | ⚠️ Potential | Low | Needs verification |
| No diagnostics | ⏳ Planned | Medium | Phase 3 |
| No error UI | ⏳ Planned | Low | Phase 3 |

---

## Debugging Tips

### For Network Issues
1. Check VPN connection
2. Test connectivity: `ping hostname`
3. Check browser DevTools → Network tab
4. Check terminal for proxy logs
5. Verify .env configuration

### For Cookie Issues
1. Check browser DevTools → Application → Cookies
2. Look for JSESSIONID under localhost
3. Check Network tab → Response Headers → Set-Cookie
4. Verify `withCredentials: true` in axios

### For CORS Issues
1. Check if proxy is running (Vite dev server)
2. Verify proxy configuration in vite.config.js
3. Check browser console for CORS errors
4. Ensure `changeOrigin: true` in proxy config

### For Authentication Issues
1. Verify credentials in .env
2. Check POST /p/websignon/signon response
3. Look for 200 OK status
4. Check Set-Cookie header
5. Verify cookie stored in browser

---

## Lessons Learned

### What We Learned the Hard Way
1. **HttpOnly cookies**: Cannot access via JavaScript - don't try
2. **Browser security**: Strict for good reason - work with it
3. **Postman ≠ Browser**: Different security models
4. **CORS**: Proxy is essential for cross-domain development
5. **VPN**: Always check network connectivity first

### Best Practices Discovered
1. **Use browser DevTools**: Essential for debugging
2. **Check terminal logs**: Proxy logs show what's happening
3. **Test incrementally**: Verify each step works
4. **Document issues**: Save time for future debugging
5. **Don't assume**: Test in actual environment

### Common Mistakes to Avoid
1. ❌ Trying to extract HttpOnly cookies manually
2. ❌ Assuming Postman success = browser success
3. ❌ Fighting browser security
4. ❌ Skipping VPN connection check
5. ❌ Not checking browser DevTools

---

**Last Updated**: 2026-05-21  
**Total Issues**: 10  
**Resolved**: 5  
**Active Blockers**: 2  
**Planned**: 3