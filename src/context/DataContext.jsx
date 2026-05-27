import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCapitalProjects } from '../services/capitalProjects';
import { createSession } from '../services/auth';
import { mockProjects } from '../mock/projects';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  // Load data once on mount
  const loadData = useCallback(async (force = false) => {
    // Skip if already loaded and not forcing refresh
    if (!force && projects.length > 0 && authenticated) {
      console.log('✅ Using cached data');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        console.log('📊 Using mock data (demo mode)');
        setProjects(mockProjects);
        setAuthenticated(true);
      } else {
        try {
          // Authenticate once
          if (!authenticated || force) {
            console.log('🔐 Authenticating...');
            await createSession();
            setAuthenticated(true);
          }
          
          // Fetch all data once
          console.log('📡 Fetching all project data...');
          const projectData = await fetchCapitalProjects();
          setProjects(projectData);
          setLastFetch(new Date());
          console.log(`✅ Loaded ${projectData.length} projects into cache`);
        } catch (apiError) {
          console.warn('⚠️ API fetch failed, using mock data:', apiError.message);
          setProjects(mockProjects);
          setAuthenticated(true);
          setError('Using demo data');
        }
      }
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setProjects(mockProjects);
      setAuthenticated(true);
      setError('Error occurred. Showing demo data.');
    } finally {
      setLoading(false);
    }
  }, [projects.length, authenticated]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []); // Only run once on mount

  // Refresh function for manual refresh
  const refresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    return loadData(true);
  }, [loadData]);

  const value = {
    projects,
    loading,
    error,
    authenticated,
    lastFetch,
    refresh
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Made with Bob