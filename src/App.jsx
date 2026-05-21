import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AIInsights from './pages/AIInsights';
import Timeline from './pages/Timeline';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="insights/:id" element={<AIInsights />} />
          <Route path="timeline" element={<Timeline />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// Made with Bob
