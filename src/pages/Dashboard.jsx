import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge, RiskBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { fetchCapitalProjects, getProjectStatistics } from '../services/capitalProjects';
import { createSession } from '../services/auth';
import { mockProjects } from '../mock/projects';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Brain,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
    totalSpent: 0,
    avgHealthScore: 0,
    highRiskCount: 0
  });

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we should use mock data
      const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // Use mock data for demo
        console.log('📊 Using mock data (VITE_USE_MOCK_DATA=true)');
        setProjects(mockProjects);
        const statistics = getProjectStatistics(mockProjects);
        setStats(statistics);
      } else {
        // Try to fetch from MREF API
        try {
          console.log('🔄 Fetching from MREF API...');
          await createSession();
          const projectData = await fetchCapitalProjects();
          setProjects(projectData);
          const statistics = getProjectStatistics(projectData);
          setStats(statistics);
          console.log('✅ Live data loaded from MREF');
        } catch (apiError) {
          console.warn('⚠️ API fetch failed, using mock data:', apiError.message);
          setProjects(mockProjects);
          const statistics = getProjectStatistics(mockProjects);
          setStats(statistics);
          setError('Using demo data. To use live MREF data, set VITE_USE_MOCK_DATA=false in .env');
        }
      }
      
    } catch (err) {
      console.error('❌ Error loading projects:', err);
      setProjects(mockProjects);
      const statistics = getProjectStatistics(mockProjects);
      setStats(statistics);
      setError('Error occurred. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRunAI = (projectId) => {
    navigate(`/insights/${projectId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Capital Projects</h1>
          <p className="text-gray-600 mt-1">Project coordination and monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={loadProjects}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
          <Button variant="primary" icon={Brain}>
            Run Batch Analysis
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
            <span className="text-lg text-gray-600">Loading projects from MREF...</span>
          </div>
        </Card>
      )}

      {/* Info Banner - Using Mock Data */}
      {import.meta.env.VITE_USE_MOCK_DATA === 'true' && !loading && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Brain className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Demo Mode Active</h3>
              <p className="text-blue-700 text-sm">
                Currently showing demo data. To connect to live MREF API, set <code className="bg-blue-100 px-2 py-1 rounded">VITE_USE_MOCK_DATA=false</code> in your .env file.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && import.meta.env.VITE_USE_MOCK_DATA !== 'true' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">API Connection Issue</h3>
              <p className="text-yellow-700 mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={loadProjects}>
                Retry Connection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="From MREF OSLC API"
            icon={Building2}
            color="blue"
          />
          <StatCard
            title="Total Budget"
            value={formatCurrency(stats.totalBudget)}
            subtitle={`${formatCurrency(stats.totalSpent)} spent`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Avg Health Score"
            value={`${stats.avgHealthScore}%`}
            subtitle="Across all projects"
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="High Risk Projects"
            value={stats.highRiskCount}
            subtitle="Require attention"
            icon={AlertTriangle}
            color="red"
          />
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects by name or building..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue"
            >
              <option value="All">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completing">Completing</option>
            </select>
            <Button variant="outline" icon={Filter}>
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      {!loading && !error && (
        <Card title="Capital Projects" subtitle={`${filteredProjects.length} projects found`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Project Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Building</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Budget</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timeline</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Health</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.projectManager}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{project.building}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{formatCurrency(project.budget)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(project.spent)} spent</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-sm">{project.timeline}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            project.healthScore >= 80 ? 'bg-green-500' :
                            project.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${project.healthScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{project.healthScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <RiskBadge score={project.riskScore} />
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Brain}
                      onClick={() => handleRunAI(project.id)}
                    >
                      AI Analysis
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}
      
      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-600 mb-4">No capital projects available in MREF system.</p>
            <Button variant="primary" onClick={loadProjects}>
              Refresh Data
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

// Made with Bob
