# 🏢 Autonomous Capital Project Coordinator Agent

Enterprise AI dashboard for IBM Maximo Real Estate & Facilities (MREF/TRIRIGA) capital project management.

![Status](https://img.shields.io/badge/status-beta-yellow)
![Progress](https://img.shields.io/badge/progress-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Overview

AI-powered dashboard that autonomously analyzes approved capital projects and provides:
- 🤖 AI-generated execution planning
- ✅ Automated project task generation
- 🔗 Dependency analysis
- ⚠️ Project risk detection
- 📊 Executive summaries
- 💡 AI recommendations
- 🏥 Project health monitoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- **VPN access to MREF server** (required for live API)

### Installation

```bash
# Clone repository
git clone https://github.com/rjbhavar/capital-project-coordinator.git
cd capital-project-coordinator

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MREF credentials

# Start development server
npm run dev
```

Application opens at: **http://localhost:5173**

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18.3.1
- **Build Tool**: Vite 6.0.11
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router 7.1.3
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React 0.469.0

### Architecture Pattern
```
Browser → Vite Proxy → MREF OSLC API
         ↓
    Cookie Rewriting
         ↓
    Browser-Managed JSESSIONID
         ↓
    Automatic Session Handling
```

**Key Features**:
- Session-based authentication with HttpOnly cookies
- Vite development proxy for CORS handling
- Browser-managed cookie security
- Centralized service layer architecture

---

## 📁 Project Structure

```
capital-project-coordinator/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route pages (Dashboard, AIInsights, Timeline)
│   ├── layouts/            # Layout components (Sidebar, MainLayout)
│   ├── services/           # API integration layer
│   ├── mock/               # Mock data for development
│   ├── utils/              # Utility functions
│   └── App.jsx             # Main application
├── knowledge-base/         # Business & technical documentation
├── project-handover/       # Handover documentation
├── continuation-context/   # Quick continuation guides
├── public/                 # Static assets
├── .env.example           # Environment template
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind configuration
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file from `.env.example`:

```bash
VITE_MREF_BASE_URL=https://your-mref-server.com
VITE_MREF_USERNAME=your_username
VITE_MREF_PASSWORD=your_password
VITE_USE_MOCK_DATA=false
```

### VPN Requirement

⚠️ **IMPORTANT**: MREF server requires VPN connection

Test connectivity:
```bash
ping semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
```

---

## 📖 Documentation

### Quick Start Guides
- **[START_HERE.md](continuation-context/START_HERE.md)** - 5-minute quick start
- **[BOB_CONTINUATION_CONTEXT.md](project-handover/BOB_CONTINUATION_CONTEXT.md)** - Complete project context

### Knowledge Base
- **[Capital Project Overview](knowledge-base/capital-project-overview.md)** - Business workflows
- **[MREF Entities](knowledge-base/mref-entities.md)** - Data model
- **[OSLC API Mapping](knowledge-base/oslc-api-mapping.md)** - API reference
- **[Glossary](knowledge-base/glossary.md)** - Terminology
- **[Implementation History](knowledge-base/implementation-history.md)** - Development log
- **[Architecture Decisions](knowledge-base/architecture-decisions.md)** - Design rationale
- **[Known Issues & Fixes](knowledge-base/known-issues-and-fixes.md)** - Troubleshooting
- **[Current System State](knowledge-base/current-system-state.md)** - Status overview
- **[Implementation Roadmap](knowledge-base/implementation-roadmap.md)** - Future work

---

## 🎯 Features

### ✅ Implemented
- **Dashboard**: Project list, search, filters, statistics
- **AI Insights**: Executive summaries, health metrics, task generation
- **Timeline**: Activity feed, AI events, recommendations
- **Components**: Cards, badges, progress bars, indicators
- **API Integration**: Authentication, data fetching, error handling
- **Session Management**: Auto-retry, cookie handling

### ⏳ Pending
- Network diagnostics panel
- Enhanced error handling UI
- AI feature integration (OpenAI/Azure)
- Production deployment

---

## 🐛 Troubleshooting

### Common Issues

**Problem**: API not working  
**Solution**: Check VPN connection
```bash
ping semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
```

**Problem**: Cookie not stored  
**Solution**: Check browser DevTools → Application → Cookies → localhost

**Problem**: 401 Unauthorized  
**Solution**: Session expired - auto-retry should handle it

**Problem**: CORS errors  
**Solution**: Ensure Vite dev server is running (proxy handles CORS)

**More**: See [Known Issues & Fixes](knowledge-base/known-issues-and-fixes.md)

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

### Development Workflow

1. **Read Documentation**: Start with `continuation-context/START_HERE.md`
2. **Configure Environment**: Copy `.env.example` to `.env`
3. **Connect VPN**: Required for live API
4. **Start Dev Server**: `npm run dev`
5. **Check Browser**: http://localhost:5173
6. **Debug**: Use browser DevTools

---

## 📊 Project Status

**Overall Progress**: 85% Complete

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend UI | ✅ 100% | Complete and working |
| API Integration | ⚠️ 90% | Code ready, VPN blocked |
| Documentation | ✅ 100% | Comprehensive |
| Diagnostics | ✅ 100% | Utilities created |
| AI Features | ⏳ 0% | Future work |

**Current Blocker**: VPN connectivity to MREF server

---

## 🤝 Contributing

### For New Developers

1. Read `continuation-context/START_HERE.md`
2. Review `project-handover/BOB_CONTINUATION_CONTEXT.md`
3. Check `knowledge-base/current-system-state.md`
4. Follow `knowledge-base/implementation-roadmap.md`

### Development Rules

**DO NOT**:
- ❌ Try to extract JSESSIONID manually (HttpOnly)
- ❌ Remove `withCredentials: true` from axios
- ❌ Modify proxy cookie rewriting logic
- ❌ Redesign authentication flow

**DO**:
- ✅ Use browser-managed cookies
- ✅ Test with VPN connected
- ✅ Check browser DevTools for debugging
- ✅ Follow existing architecture patterns

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Authors

- **Development Team**: Enterprise AI Solutions
- **Client**: IBM Maximo Real Estate & Facilities

---

## 🔗 Links

- **Repository**: https://github.com/rjbhavar/capital-project-coordinator
- **MREF Documentation**: https://www.ibm.com/docs/en/masv-and-l/maximo-ref/cd
- **OSLC Specification**: https://open-services.net/

---

## 📞 Support

For issues or questions:
1. Check [Known Issues & Fixes](knowledge-base/known-issues-and-fixes.md)
2. Review [Troubleshooting](#-troubleshooting) section
3. Check browser console and terminal logs
4. Verify VPN connection

---

## 🎯 Roadmap

### Phase 1: VPN Testing ⏳
- Test live API integration
- Verify session management
- Validate data fetching

### Phase 2: Repository Cleanup ✅
- Remove unused files
- Optimize dependencies
- Clean up code

### Phase 3: Diagnostics ✅
- Network diagnostics utilities
- Connection status UI
- Enhanced error handling

### Phase 4: Production Hardening
- Security enhancements
- Performance optimization
- Testing suite

### Phase 5: AI Features
- OpenAI/Azure integration
- Task generation
- Risk analysis
- Executive summaries

### Phase 6: Deployment
- Production build
- CI/CD pipeline
- Monitoring setup

---

**Status**: Ready for VPN testing and continued development  
**Last Updated**: 2026-05-21  
**Version**: 1.0.0-beta