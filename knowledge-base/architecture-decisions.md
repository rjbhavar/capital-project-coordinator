# Architecture Decision Records (ADR)

## ADR-001: Use Vite Instead of Create React App

**Status**: Accepted  
**Date**: Initial session  
**Context**: Need modern build tool for React application

**Decision**: Use Vite 6 as build tool and dev server

**Rationale**:
- **Faster**: Native ES modules, no bundling in dev
- **Modern**: Built for modern browsers
- **Smaller**: Optimized production builds
- **Better DX**: Instant HMR, fast startup
- **Future-proof**: Active development, growing ecosystem

**Alternatives Considered**:
- Create React App: Slower, webpack-based, less maintained
- Next.js: Overkill for SPA, adds SSR complexity
- Parcel: Less ecosystem support

**Consequences**:
- ✅ Fast development experience
- ✅ Modern tooling
- ⚠️ Requires Node 18+
- ⚠️ Some plugins may not be compatible

---

## ADR-002: Use Tailwind CSS for Styling

**Status**: Accepted  
**Date**: Initial session  
**Context**: Need styling solution for enterprise dashboard

**Decision**: Use Tailwind CSS utility-first framework

**Rationale**:
- **Rapid Development**: Pre-built utility classes
- **Consistency**: Design system built-in
- **Small Bundle**: PurgeCSS removes unused styles
- **Responsive**: Mobile-first breakpoints
- **Customizable**: Easy to extend/override

**Alternatives Considered**:
- CSS Modules: More boilerplate, harder to maintain
- Styled Components: Runtime overhead, larger bundle
- Material-UI: Too opinionated, harder to customize
- Plain CSS: No design system, inconsistent

**Consequences**:
- ✅ Fast UI development
- ✅ Consistent design
- ✅ Small production bundle (~10KB)
- ⚠️ Learning curve for utility classes
- ⚠️ HTML can look cluttered

---

## ADR-003: Use Vite Proxy for CORS and Cookie Handling

**Status**: Accepted  
**Date**: Session 5  
**Context**: Need to connect frontend to MREF API with session cookies

**Decision**: Use Vite development proxy with cookie rewriting

**Rationale**:
- **CORS Solution**: Proxy makes requests server-side
- **Cookie Handling**: Can modify Set-Cookie headers
- **No Backend**: Don't need separate proxy server
- **Development Speed**: Built into Vite
- **Simple Config**: Few lines of code

**Alternatives Considered**:
1. **CORS Configuration on MREF**: Not possible (no control over MREF)
2. **Node.js Backend Proxy**: More complex, additional deployment
3. **Same-Domain Deployment**: Not feasible for local development
4. **Disable Browser Security**: Dangerous, not recommended

**Implementation**:
```javascript
proxy: {
  '/api': {
    target: MREF_BASE_URL,
    changeOrigin: true,
    secure: false,
    configure: (proxy) => {
      proxy.on('proxyRes', (proxyRes) => {
        // Rewrite cookies for localhost
      });
    }
  }
}
```

**Consequences**:
- ✅ Solves CORS issue
- ✅ Handles cookie domain rewriting
- ✅ No additional backend needed
- ⚠️ Development-only solution
- ⚠️ Production needs different approach

**Production Strategy**:
- Option 1: Deploy frontend to same domain as MREF
- Option 2: Create backend proxy (Node.js/Express)
- Option 3: Configure MREF CORS (if possible)

---

## ADR-004: Use Browser-Managed Cookies

**Status**: Accepted  
**Date**: Session 4  
**Context**: JSESSIONID is HttpOnly cookie, cannot access via JavaScript

**Decision**: Rely on browser automatic cookie management

**Rationale**:
- **Security**: HttpOnly cookies prevent XSS attacks
- **Browser Native**: Automatic cookie handling
- **No Manual Code**: Browser sends cookies automatically
- **Best Practice**: Follows web security standards
- **MREF Requirement**: JSESSIONID is HttpOnly by design

**Alternatives Considered**:
1. **Manual Cookie Extraction**: Impossible (HttpOnly)
2. **localStorage**: Less secure, not compatible with HttpOnly
3. **Request MREF Change**: Not feasible
4. **Custom Auth Token**: Would require MREF API changes

**Implementation**:
```javascript
// Axios configuration
axios.create({
  withCredentials: true  // Enable cookie sending/receiving
});

// No manual cookie handling needed
// Browser manages everything automatically
```

**Consequences**:
- ✅ Secure (HttpOnly protection)
- ✅ Simple code (no manual handling)
- ✅ Standards-compliant
- ⚠️ Cannot inspect cookie in JavaScript
- ⚠️ Debugging requires browser DevTools
- ⚠️ Must use `withCredentials: true`

**Key Learning**: Don't fight browser security. Work with it.

---

## ADR-005: Centralized Service Layer Architecture

**Status**: Accepted  
**Date**: Session 6  
**Context**: Need clean separation between UI and API logic

**Decision**: Create centralized service layer for API integration

**Structure**:
```
src/services/
├── auth.js              # Authentication
├── api.js               # Axios client + interceptors
└── capitalProjects.js   # Business logic
```

**Rationale**:
- **Separation of Concerns**: UI doesn't know about API details
- **Reusability**: Services used by multiple components
- **Testability**: Easy to mock services
- **Consistency**: Single source of truth for API config
- **Maintainability**: Changes in one place

**Alternatives Considered**:
1. **Component-Level API Calls**: Duplicated code, hard to maintain
2. **Redux/Context API**: Overkill for current needs
3. **React Query**: Additional dependency, learning curve

**Implementation Pattern**:
```javascript
// auth.js - Authentication logic
export async function createSession() { ... }

// api.js - Shared axios instance
export const apiClient = axios.create({
  withCredentials: true
});

// capitalProjects.js - Business logic
export async function fetchCapitalProjects() {
  await createSession();
  const response = await apiClient.get('/api/oslc/...');
  return mapToUIFormat(response.data);
}
```

**Consequences**:
- ✅ Clean architecture
- ✅ Easy to test
- ✅ Reusable code
- ✅ Consistent error handling
- ⚠️ Additional abstraction layer
- ⚠️ Slightly more code initially

---

## ADR-006: Mock Data Fallback Strategy

**Status**: Accepted  
**Date**: Session 7  
**Context**: API blocked by VPN, need to continue development

**Decision**: Implement graceful fallback to mock data

**Rationale**:
- **Development Continuity**: Work without VPN
- **Demo Capability**: Show UI without live API
- **Testing**: Test UI independently
- **Resilience**: Graceful degradation

**Implementation**:
```javascript
try {
  const liveData = await fetchCapitalProjects();
  setProjects(liveData);
} catch (error) {
  console.error('API failed, using mock data:', error);
  setProjects(mockProjects);
}
```

**Alternatives Considered**:
1. **Error Only**: Blocks development without VPN
2. **Environment Flag**: More complex, easy to forget
3. **Separate Mock Mode**: Duplicated code

**Consequences**:
- ✅ Enables development without VPN
- ✅ Useful for demos
- ✅ Simple implementation
- ⚠️ May mask API issues
- ⚠️ Must ensure mock data matches real structure
- ⚠️ Need to test with live data eventually

**Best Practice**: Always test with live API before production

---

## ADR-007: Knowledge Base Structure

**Status**: Accepted  
**Date**: Session 8  
**Context**: Need comprehensive documentation for continuation

**Decision**: Create multi-file knowledge base with specific purposes

**Structure**:
```
knowledge-base/
├── capital-project-overview.md    # Business domain
├── mref-entities.md               # Data model
├── oslc-api-mapping.md            # API reference
├── glossary.md                    # Terminology
├── implementation-history.md      # Development log
├── architecture-decisions.md      # This file
└── implementation-notes.md        # Technical details

project-handover/
└── BOB_CONTINUATION_CONTEXT.md    # Master handover doc
```

**Rationale**:
- **Token Optimization**: Read only what's needed
- **Separation**: Business vs technical docs
- **Continuation**: Enable seamless handover
- **Context Preservation**: Avoid re-discovery
- **Learning Capture**: Document decisions and learnings

**Alternatives Considered**:
1. **Single README**: Hard to navigate, high token cost
2. **Code Comments Only**: Not comprehensive enough
3. **External Wiki**: Not version-controlled with code

**Consequences**:
- ✅ Optimized token usage
- ✅ Easy to navigate
- ✅ Comprehensive coverage
- ✅ Version-controlled
- ⚠️ Multiple files to maintain
- ⚠️ Need to keep synchronized

**Key Innovation**: BOB_CONTINUATION_CONTEXT.md as master handover document

---

## ADR-008: React Router for Client-Side Routing

**Status**: Accepted  
**Date**: Initial session  
**Context**: Need navigation between dashboard pages

**Decision**: Use React Router v7 for client-side routing

**Rationale**:
- **Standard**: De facto routing library for React
- **Declarative**: Route configuration in JSX
- **Features**: Nested routes, lazy loading, navigation guards
- **Maintained**: Active development, large community

**Alternatives Considered**:
- Reach Router: Merged into React Router
- Wouter: Too minimal, missing features
- Custom Router: Reinventing the wheel

**Consequences**:
- ✅ Full-featured routing
- ✅ Large ecosystem
- ✅ Good documentation
- ⚠️ Bundle size (~50KB)

---

## ADR-009: Functional Components with Hooks

**Status**: Accepted  
**Date**: Initial session  
**Context**: Choose React component pattern

**Decision**: Use functional components with hooks exclusively

**Rationale**:
- **Modern**: Current React best practice
- **Simpler**: Less boilerplate than classes
- **Composable**: Custom hooks for reusability
- **Performance**: Easier optimization
- **Future**: React team recommends

**Alternatives Considered**:
- Class Components: Legacy, more verbose
- Mixed Approach: Inconsistent codebase

**Consequences**:
- ✅ Modern codebase
- ✅ Less code
- ✅ Better composition
- ⚠️ Requires React 16.8+

---

## ADR-010: Axios for HTTP Client

**Status**: Accepted  
**Date**: Session 3  
**Context**: Need HTTP client for API calls

**Decision**: Use Axios for all HTTP requests

**Rationale**:
- **Features**: Interceptors, automatic JSON parsing, timeout
- **Browser Support**: Works everywhere
- **Familiar**: Widely used, good documentation
- **Interceptors**: Essential for auth retry logic

**Alternatives Considered**:
- Fetch API: No interceptors, more boilerplate
- SWR/React Query: Overkill for current needs

**Consequences**:
- ✅ Rich feature set
- ✅ Interceptor support
- ✅ Good error handling
- ⚠️ Additional dependency (~15KB)

---

## ADR-011: Environment Variables for Configuration

**Status**: Accepted  
**Date**: Session 3  
**Context**: Need to configure MREF connection

**Decision**: Use .env file with Vite environment variables

**Rationale**:
- **Security**: Keep credentials out of code
- **Flexibility**: Easy to change per environment
- **Standard**: Common practice
- **Vite Support**: Built-in support

**Implementation**:
```bash
VITE_MREF_BASE_URL=https://...
VITE_MREF_USERNAME=user
VITE_MREF_PASSWORD=pass
```

**Consequences**:
- ✅ Secure credential storage
- ✅ Environment-specific config
- ✅ Not committed to git
- ⚠️ Must document required variables
- ⚠️ Must provide .env.example

---

## ADR-012: No State Management Library (Yet)

**Status**: Accepted  
**Date**: Initial session  
**Context**: Decide on state management approach

**Decision**: Use React built-in state (useState, useContext) only

**Rationale**:
- **Simplicity**: Current needs are simple
- **No Overhead**: No additional library
- **Fast Development**: Less boilerplate
- **Sufficient**: Component state + props work fine

**When to Reconsider**:
- Complex state sharing across many components
- Need for time-travel debugging
- Performance issues with prop drilling
- Team requests it

**Alternatives Available**:
- Redux: If complex state management needed
- Zustand: If lightweight global state needed
- React Query: If complex data fetching needed

**Consequences**:
- ✅ Simple codebase
- ✅ No additional dependencies
- ✅ Fast development
- ⚠️ May need refactor if app grows
- ⚠️ Some prop drilling

---

## Summary of Key Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Vite | Fast, modern build tool | ✅ Working |
| Tailwind CSS | Rapid UI development | ✅ Working |
| Vite Proxy | CORS + cookie handling | ✅ Working |
| Browser Cookies | Security + simplicity | ✅ Working |
| Service Layer | Clean architecture | ✅ Working |
| Mock Fallback | Development continuity | ✅ Working |
| Knowledge Base | Token optimization | ✅ Complete |
| React Router | Standard routing | ✅ Working |
| Functional Components | Modern React | ✅ Working |
| Axios | Rich HTTP client | ✅ Working |
| Environment Variables | Secure config | ✅ Working |
| No State Library | Keep it simple | ✅ Sufficient |

---

## Lessons for Future Decisions

### What Worked Well
1. **Start Simple**: Don't over-engineer initially
2. **Follow Standards**: Use established patterns
3. **Document Early**: Capture decisions when fresh
4. **Security First**: Don't compromise on security
5. **Token Awareness**: Optimize for continuation

### What to Avoid
1. **Fighting Browser Security**: Work with it, not against it
2. **Premature Optimization**: Add complexity only when needed
3. **Assuming Postman = Browser**: Different security models
4. **Manual Cookie Handling**: Let browser manage
5. **Skipping Documentation**: Costs more tokens later

### Decision-Making Framework
1. **Identify Problem**: What are we trying to solve?
2. **List Alternatives**: What are the options?
3. **Evaluate Trade-offs**: Pros and cons of each
4. **Choose**: Make decision based on context
5. **Document**: Record decision and rationale
6. **Review**: Revisit if context changes

---

**Last Updated**: 2026-05-21  
**Total ADRs**: 12  
**Status**: All Accepted and Implemented