import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import MainLayout from './layouts/MainLayout';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Budgets from './pages/Budgets';
import Procurement from './pages/Procurement';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Overview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="procurement" element={<Procurement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;

// Made with Bob
