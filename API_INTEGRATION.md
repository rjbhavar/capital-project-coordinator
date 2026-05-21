# MREF OSLC API Integration Guide

## Overview

This application integrates with IBM Maximo MREF (Real Estate and Facilities) OSLC APIs to fetch live capital project data.

## Configuration

### Environment Variables

All API credentials are stored in `.env` file:

```env
VITE_MREF_BASE_URL=https://semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
VITE_MREF_USERNAME=rahul
VITE_MREF_PASSWORD=passwordpassword
```

**Important:** Update these values with your actual MREF credentials before running the application.

## Authentication Flow

### 1. Session Creation

Before any API call, the application automatically:

1. Sends POST request to `/p/websignon/signon`
2. Captures `JSESSIONID` from response cookies or Set-Cookie header
3. Stores session centrally
4. Reuses session for all subsequent API calls

### 2. Session Management

- **Auto-authentication**: Session created automatically on first API call
- **Session reuse**: JSESSIONID attached to all requests via Cookie header
- **Auto-retry**: On 401 errors, session is refreshed and request retried
- **Centralized storage**: Session managed in `auth.js` service

## API Services

### auth.js

Handles authentication and session management:

```javascript
import { createSession, getSessionId, hasSession, clearSession } from './services/auth';

// Create session
await createSession();

// Check if session exists
if (hasSession()) {
  console.log('Session active');
}
```

### api.js

Centralized axios client with interceptors:

```javascript
import apiClient from './services/api';

// All requests automatically include JSESSIONID
const response = await apiClient.get('/oslc/so/cstCapitalProjectRS');
```

### capitalProjects.js

Capital project data fetching and transformation:

```javascript
import { fetchCapitalProjects, fetchProjectById, getProjectStatistics } from './services/capitalProjects';

// Fetch all projects
const projects = await fetchCapitalProjects();

// Fetch single project
const project = await fetchProjectById(1);

// Get statistics
const stats = getProjectStatistics(projects);
```

## OSLC API Endpoints

### Capital Projects

**Endpoint:** `GET /oslc/so/cstCapitalProjectRS`

**Response Structure:**
```json
{
  "rdfs:member": [
    {
      "spi:triNameTX": "Project Name",
      "spi:triStatusCL": "In Progress",
      "spi:triBudgetOriginalRollupFR": 1500000,
      "spi:triBudgetSpentRollupFR": 750000,
      "spi:triPhaseCL": "Execution",
      "spi:triProjectLeadTX": "John Doe",
      "spi:triProjectPlanStartDA": "2026-01-01",
      "spi:triProjectPlanEndDA": "2026-12-31",
      "spi:triProjectLocationTX": "Building A",
      "spi:triCityTX": "New York",
      "spi:triCountryTX": "USA",
      "spi:triProjectClassificationLI": "Major Capital"
    }
  ]
}
```

## Field Mapping

| OSLC Field | Application Field | Description |
|------------|------------------|-------------|
| `spi:triNameTX` | `name` | Project name |
| `spi:triStatusCL` | `status` | Project status |
| `spi:triBudgetOriginalRollupFR` | `budget` | Total budget |
| `spi:triBudgetSpentRollupFR` | `spent` | Amount spent |
| `spi:triPhaseCL` | `phase` | Current phase |
| `spi:triProjectLeadTX` | `projectManager` | Project lead |
| `spi:triProjectPlanStartDA` | `startDate` | Start date |
| `spi:triProjectPlanEndDA` | `endDate` | End date |
| `spi:triProjectLocationTX` | `location` | Location |
| `spi:triCityTX` | `city` | City |
| `spi:triCountryTX` | `country` | Country |
| `spi:triProjectClassificationLI` | `classification` | Classification |

## Running the Application

### 1. Install Dependencies

```bash
cd capital-project-coordinator
npm install
```

### 2. Configure Environment

Update `.env` with your MREF credentials:

```env
VITE_MREF_BASE_URL=https://your-mref-instance.com
VITE_MREF_USERNAME=your-username
VITE_MREF_PASSWORD=your-password
```

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at: `http://localhost:5173`

## Application Flow

```
Application Start
      ↓
User Opens Dashboard
      ↓
useEffect Hook Triggered
      ↓
loadProjects() Called
      ↓
createSession() - Authenticate with MREF
      ↓
Capture JSESSIONID
      ↓
fetchCapitalProjects() - Call OSLC API
      ↓
Parse Response (rdfs:member)
      ↓
Transform Data (OSLC → App Format)
      ↓
Calculate Derived Fields (health, risk, progress)
      ↓
Update State (setProjects, setStats)
      ↓
Render Dashboard with Live Data
```

## Error Handling

### Authentication Errors

- **401 Unauthorized**: Session expired, automatically re-authenticates
- **403 Forbidden**: Invalid credentials, check `.env` file
- **Network Error**: Check VPN connection and base URL

### API Errors

- **404 Not Found**: Endpoint not available
- **500 Server Error**: MREF server issue
- **Timeout**: Network or server performance issue

### UI Error States

- Loading spinner during data fetch
- Error message with retry button
- Empty state when no projects found

## CORS Configuration

If you encounter CORS errors, you may need to:

1. Configure MREF server to allow your origin
2. Use a proxy server
3. Run application from same domain as MREF

## Security Notes

- **Never commit `.env` file** to version control
- Store credentials securely
- Use HTTPS in production
- Implement proper session timeout
- Clear session on logout

## Troubleshooting

### Session Not Created

**Problem:** JSESSIONID not captured

**Solution:**
- Check authentication endpoint URL
- Verify credentials in `.env`
- Check browser console for errors
- Ensure cookies are enabled

### API Returns Empty Data

**Problem:** No projects in response

**Solution:**
- Verify OSLC endpoint URL
- Check user permissions in MREF
- Ensure projects exist in system
- Check API response in Network tab

### CORS Errors

**Problem:** Browser blocks API requests

**Solution:**
- Configure MREF CORS settings
- Use proxy server
- Run from same domain

## Development vs Production

### Development

- Uses `.env` file
- Hot module replacement enabled
- Console logging active
- CORS may need proxy

### Production

- Use environment variables from hosting platform
- Minified and optimized build
- Remove console logs
- Configure proper CORS

## Support

For MREF API documentation, contact IBM Maximo support or refer to OSLC specification documentation.