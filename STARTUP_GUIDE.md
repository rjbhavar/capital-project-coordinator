# Capital Project Coordinator - Startup Guide

## Quick Start Commands

Run these commands in your terminal from the project root directory:

### 1. Install Dependencies (First Time Only)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will start at: `http://localhost:5173`

---

## Troubleshooting

### If Application Doesn't Load

#### Check 1: Node Modules
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

#### Check 2: Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

#### Check 3: Check for Errors
```bash
# Run with verbose logging
npm run dev -- --debug
```

#### Check 4: Verify Package.json
```bash
# Check if package.json exists
cat package.json

# If missing dependencies, install them
npm install react react-dom react-router-dom
npm install lucide-react
npm install axios
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

### If Port 5173 is Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### If Build Fails
```bash
# Try building to check for errors
npm run build

# If successful, preview the build
npm run preview
```

---

## Environment Setup

### Create .env File
```bash
# Create .env file in project root
cat > .env << 'EOF'
# MREF API Configuration
VITE_MREF_BASE_URL=https://semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com
VITE_MREF_USERNAME=your_username_here
VITE_MREF_PASSWORD=your_password_here

# Feature Flags
VITE_USE_MOCK_DATA=true
EOF
```

**Important:** Replace `your_username_here` and `your_password_here` with actual credentials.

### For Demo Mode (No API Required)
```bash
# Edit .env and set
VITE_USE_MOCK_DATA=true
```

### For Live API Mode (Requires VPN)
```bash
# Edit .env and set
VITE_USE_MOCK_DATA=false
```

---

## Complete Setup from Scratch

If you need to set everything up from the beginning:

```bash
# 1. Navigate to project directory
cd /Users/rahulbhavar/Desktop/capital-project-coordinator

# 2. Install dependencies
npm install

# 3. Create .env file (if not exists)
cp .env.example .env

# 4. Edit .env with your credentials
nano .env
# or
vim .env
# or
code .env

# 5. Start development server
npm run dev
```

---

## Verify Installation

### Check Node and NPM Versions
```bash
node --version   # Should be v16 or higher
npm --version    # Should be v8 or higher
```

### Check Project Structure
```bash
# List key files
ls -la src/
ls -la src/components/
ls -la src/services/
ls -la src/pages/
```

### Check Dependencies
```bash
# List installed packages
npm list --depth=0
```

---

## Common Issues and Solutions

### Issue: "Cannot find module 'react'"
```bash
npm install react react-dom
```

### Issue: "Cannot find module 'react-router-dom'"
```bash
npm install react-router-dom
```

### Issue: "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### Issue: "Cannot find module 'axios'"
```bash
npm install axios
```

### Issue: Tailwind CSS not working
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer

# Regenerate config
npx tailwindcss init -p
```

### Issue: Vite not found
```bash
npm install -D vite @vitejs/plugin-react
```

### Issue: Port already in use
```bash
# Option 1: Kill the process
lsof -ti:5173 | xargs kill -9
npm run dev

# Option 2: Use different port
npm run dev -- --port 3000
```

### Issue: Permission denied
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

---

## Development Workflow

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code (if configured)
```bash
npm run lint
```

---

## Testing the Application

### 1. Open Browser
Navigate to: `http://localhost:5173`

### 2. Check Dashboard Loads
- Should see "My Capital Projects" header
- Should see stat cards
- Should see projects table

### 3. Test Features
- ✅ Click checkboxes to select projects
- ✅ Click "Export Report" to download CSV
- ✅ Select projects and click "Run Batch Analysis"
- ✅ Click "AI Analysis" on any project row

### 4. Check Console for Errors
Open browser DevTools (F12) and check Console tab for any errors.

---

## Stopping the Application

### Stop Development Server
Press `Ctrl + C` in the terminal where `npm run dev` is running.

### Kill All Node Processes (if needed)
```bash
# macOS/Linux
killall node

# Or more specific
pkill -f "vite"
```

---

## Reinstall Everything (Nuclear Option)

If nothing works, start completely fresh:

```bash
# 1. Stop all running processes
killall node

# 2. Remove everything
rm -rf node_modules
rm -rf dist
rm package-lock.json

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
npm install

# 5. Start fresh
npm run dev
```

---

## Getting Help

### Check Logs
```bash
# Development server logs are in the terminal
# Check for error messages

# If using systemd or pm2, check their logs
```

### Verify File Integrity
```bash
# Check if all required files exist
ls -la src/main.jsx
ls -la src/App.jsx
ls -la src/pages/Dashboard.jsx
ls -la src/services/capitalProjects.js
ls -la src/components/insights/ProjectAnalysisModal.jsx
ls -la src/components/insights/BatchAnalysisModal.jsx
```

### Check Network
```bash
# Test if MREF API is reachable (requires VPN)
curl -I https://semas.facilities.semas.apps.srvengmas.cp.fyre.ibm.com

# If this fails, you need VPN or use VITE_USE_MOCK_DATA=true
```

---

## Production Deployment

### Build for Production
```bash
npm run build
```

### Output Location
Built files will be in: `dist/`

### Serve Production Build Locally
```bash
npm run preview
```

### Deploy to Server
```bash
# Copy dist folder to your web server
scp -r dist/* user@server:/path/to/webroot/
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_MREF_BASE_URL` | MREF API base URL | `https://semas.facilities...` |
| `VITE_MREF_USERNAME` | MREF username | `your_username` |
| `VITE_MREF_PASSWORD` | MREF password | `your_password` |
| `VITE_USE_MOCK_DATA` | Use mock data (true/false) | `true` or `false` |

---

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Terminal shows: `Local: http://localhost:5173/`
2. ✅ Browser opens automatically
3. ✅ Dashboard loads with projects
4. ✅ No errors in browser console
5. ✅ All buttons are clickable
6. ✅ Modals open when clicking "AI Analysis" or "Run Batch Analysis"

---

## Need More Help?

If you're still having issues:

1. Check the browser console (F12) for JavaScript errors
2. Check the terminal for build errors
3. Verify all files are present in the project
4. Ensure .env file has correct credentials
5. Try the "Nuclear Option" reinstall above

---

**Last Updated:** 2026-05-27  
**Version:** 1.0.0