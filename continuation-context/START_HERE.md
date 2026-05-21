# 🚀 START HERE - Quick Continuation Guide

**For**: Any Bob instance or developer continuing this project  
**Purpose**: Immediate understanding and continuation capability  
**Read Time**: 5 minutes

---

## 📋 Project Overview

**Name**: Autonomous Capital Project Coordinator Agent  
**Client**: IBM Maximo Real Estate & Facilities (MREF/TRIRIGA)  
**Type**: Enterprise AI Dashboard (Frontend MVP)  
**Status**: 85% Complete - VPN Blocked

**Goal**: AI-powered dashboard analyzing capital projects with execution planning, task generation, dependency analysis, risk detection, and health monitoring.

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Setup
cd capital-project-coordinator
npm install

# 2. Configure (create .env from template)
cp .env.example .env
# Edit .env with MREF credentials

# 3. Run
npm run dev
# Opens http://localhost:5173
```

**⚠️ VPN Required**: MREF server only accessible via corporate VPN

---

## 🎯 Current Status

### ✅ Complete (85%)
- Frontend UI (React + Vite + Tailwind)
- Dashboard, AI Insights, Timeline pages
- Component library
- API integration code
- Proxy configuration
- Session management
- Knowledge base documentation

### 🔴 Blocked
- **VPN Connectivity**: Cannot test live API
- **Error**: `ENOTFOUND semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com`
- **Workaround**: App uses mock data

### ⏳ Pending
- VPN testing (Phase 1)
- Repository cleanup (Phase 2)
- Network diagnostics (Phase 3)
- AI features (Phase 5)

---

## 🏗️ Architecture (30 seconds)

```
Browser → Vite Proxy → MREF Server
         ↓
    Cookie Rewriting
         ↓
    Browser Stores JSESSIONID
         ↓
    Auto-sent with Requests
```

**Key Points**:
- Vite proxy handles CORS + cookie domain rewriting
- Browser manages HttpOnly JSESSIONID automatically
- `withCredentials: true` in axios
- No manual cookie handling

---

## 📁 Critical Files

```
vite.config.js          # Proxy + cookie rewriting
src/services/auth.js    # Authentication
src/services/api.js     # Axios client
.env                    # Credentials
```

---

## 🔍 Where to Learn More

| Need | Read This | Time |
|------|-----------|------|
| Full Context | `project-handover/BOB_CONTINUATION_CONTEXT.md` | 10 min |
| Current State | `knowledge-base/current-system-state.md` | 5 min |
| Known Issues | `knowledge-base/known-issues-and-fixes.md` | 5 min |
| Next Steps | `knowledge-base/implementation-roadmap.md` | 5 min |
| MREF Domain | `knowledge-base/capital-project-overview.md` | 10 min |
| API Details | `knowledge-base/oslc-api-mapping.md` | 10 min |

---

## 🎯 Next Actions

### If VPN Available
1. Connect VPN
2. Refresh browser
3. Verify authentication
4. Test data fetching
5. → Go to Phase 3 (diagnostics)

### If VPN Not Available
1. Start Phase 2 (cleanup)
2. Remove unused files
3. Optimize dependencies
4. → Wait for VPN

**See**: `knowledge-base/implementation-roadmap.md` for detailed tasks

---

## ⚠️ Critical Rules

### DO NOT
- ❌ Try to extract JSESSIONID manually (HttpOnly)
- ❌ Remove `withCredentials: true`
- ❌ Modify proxy cookie logic
- ❌ Redesign auth flow

### DO
- ✅ Use browser-managed cookies
- ✅ Test with VPN connected
- ✅ Check browser DevTools
- ✅ Follow existing patterns

---

## 🐛 Quick Debug

**Problem**: API not working  
**Check**: VPN connected? → `ping semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com`

**Problem**: Cookie not stored  
**Check**: Browser DevTools → Application → Cookies → localhost

**Problem**: 401 errors  
**Check**: Session expired, auto-retry should work

**More**: See `knowledge-base/known-issues-and-fixes.md`

---

## 📊 Progress Metrics

- **Frontend**: 100%
- **API Code**: 90% (testing blocked)
- **Documentation**: 100%
- **Overall**: 85%

---

## 🔗 Navigation

```
START_HERE.md           ← You are here
├── PROJECT_STATE.json  → Machine-readable state
├── CURRENT_PROGRESS.md → Detailed progress
├── NEXT_ACTIONS.md     → Immediate tasks
└── SYSTEM_CONTEXT.md   → Full technical context
```

---

## ✨ Success Criteria

**You're ready when**:
- ✅ Dev server runs
- ✅ You understand architecture
- ✅ You know the blocker (VPN)
- ✅ You can identify next step

**Project complete when**:
- ✅ VPN testing passed
- ✅ Diagnostics added
- ✅ AI features integrated
- ✅ Deployed to production

---

**Next**: Read `PROJECT_STATE.json` for machine-readable state, or `SYSTEM_CONTEXT.md` for full technical details.

**Questions?** Check `project-handover/BOB_CONTINUATION_CONTEXT.md` (master document)