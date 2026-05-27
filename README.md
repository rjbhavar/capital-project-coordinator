# Capital Project Execution & Governance Command Center

Enterprise-grade capital project management and governance platform with real-time operational intelligence.

## Features

- **Executive Dashboard** - Premium KPI visualizations with radial progress indicators
- **Project Management** - Operational workspace with advanced filtering and batch analysis
- **Budget Governance** - Financial tracking with utilization and variance analysis
- **Procurement Operations** - Contract management and procurement pipeline
- **Reports & Analytics** - Comprehensive report generation and export
- **Alert Monitoring** - Real-time operational intelligence and risk monitoring

## Architecture

- **Centralized Data Management** - Single authentication and data fetch at startup
- **Instant Navigation** - <100ms page transitions with in-memory caching
- **Premium UX** - Enterprise-grade visualizations and smooth animations
- **Performance Optimized** - React.useMemo, efficient re-renders, lightweight components

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- VPN access to MREF API (for live data)

### Installation

```bash
# Clone repository
git clone https://github.com/rjbhavar/capital-project-coordinator.git
cd capital-project-coordinator

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Environment Configuration

Create `.env` file:

```env
# Demo Mode (no authentication required)
VITE_USE_MOCK_DATA=true

# Live Mode (requires VPN and credentials)
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
VITE_API_USERNAME=your_username
VITE_API_PASSWORD=your_password
```

### Run Development Server

```bash
npm run dev
```

Access at: http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## VPN Requirement

For live MREF API access:
1. Connect to IBM VPN
2. Set `VITE_USE_MOCK_DATA=false` in `.env`
3. Provide valid credentials

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── insights/        # Analysis modals
├── context/             # Global state management
├── layouts/             # App layout components
├── pages/               # Main application pages
├── services/            # API and data services
├── utils/               # Utility functions
└── mock/                # Demo data
```

## Key Technologies

- React 18
- React Router v6
- Vite
- Tailwind CSS
- Lucide Icons

## Performance

- **Authentication**: 1 time at startup (vs 3-5 times before)
- **Page Load**: <100ms (vs 2-5 seconds before)
- **API Calls**: 1 per session (vs 6+ before)
- **Navigation**: Instant tab switching

## Documentation

- `PERFORMANCE_OPTIMIZATION_SUMMARY.md` - Architecture and performance details
- `PREMIUM_UX_TRANSFORMATION.md` - UX design system and features
- `continuation-context/` - Development context and history
- `knowledge-base/` - Technical documentation

## Demo Mode

Run without VPN/credentials:
```bash
VITE_USE_MOCK_DATA=true npm run dev
```

## License

Proprietary - IBM Internal Use

## Made with Bob

Enterprise Capital Project Governance Platform