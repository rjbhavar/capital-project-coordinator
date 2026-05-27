import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getProjectStatistics } from '../services/capitalProjects';
import { MetricCard, RadialProgress, InsightCard, GradientCard } from '../components/common/PremiumCard';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  ShoppingCart,
  CreditCard,
  Clock,
  MapPin,
  Loader2,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Target,
  Zap
} from 'lucide-react';

const Overview = () => {
  const navigate = useNavigate();
  const { projects, loading, error } = useData();

  // Memoize statistics calculation
  const stats = useMemo(() => {
    return getProjectStatistics(projects);
  }, [projects]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate additional metrics
  const budgetUtilization = stats.totalBudget > 0 ? (stats.totalSpent / stats.totalBudget) * 100 : 0;
  const atRiskProjects = projects.filter(p => p.riskScore >= 60).length;
  const delayedProjects = projects.filter(p => {
    if (!p.endDate) return false;
    return new Date(p.endDate) < new Date();
  }).length;
  const pendingProposals = projects.filter(p => 
    p.hasProposal && p.proposalDetails?.status?.toLowerCase().includes('pending')
  ).length;
  const revisionProjects = projects.filter(p => 
    p.status?.toLowerCase().includes('revision')
  ).length;

  // Status distribution
  const statusDistribution = useMemo(() => {
    return projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  // Phase distribution
  const phaseDistribution = useMemo(() => {
    return projects.reduce((acc, p) => {
      acc[p.phase] = (acc[p.phase] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  // Geography distribution
  const geoDistribution = useMemo(() => {
    return projects.reduce((acc, p) => {
      const key = `${p.city}, ${p.state}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [projects]);

  const topLocations = Object.entries(geoDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Generate executive insights
  const insights = useMemo(() => {
    const insightsList = [];
    
    if (revisionProjects > 0) {
      insightsList.push({
        type: 'info',
        title: 'Projects in Revision',
        message: `${revisionProjects} project${revisionProjects > 1 ? 's are' : ' is'} currently under revision`,
        icon: FileText
      });
    }
    
    if (atRiskProjects > 0) {
      insightsList.push({
        type: 'error',
        title: 'High Risk Alert',
        message: `${atRiskProjects} project${atRiskProjects > 1 ? 's require' : ' requires'} immediate attention`,
        icon: AlertTriangle,
        action: { label: 'View Projects', onClick: () => navigate('/projects') }
      });
    }
    
    if (delayedProjects > 0) {
      insightsList.push({
        type: 'warning',
        title: 'Timeline Delays',
        message: `${delayedProjects} project${delayedProjects > 1 ? 's are' : ' is'} past deadline`,
        icon: Clock,
        action: { label: 'Review Timeline', onClick: () => navigate('/projects') }
      });
    }
    
    if (budgetUtilization > 85) {
      insightsList.push({
        type: 'warning',
        title: 'Budget Utilization High',
        message: `Portfolio budget utilization at ${budgetUtilization.toFixed(1)}%`,
        icon: DollarSign,
        action: { label: 'View Budgets', onClick: () => navigate('/budgets') }
      });
    }
    
    if (pendingProposals > 0) {
      insightsList.push({
        type: 'info',
        title: 'Pending Approvals',
        message: `${pendingProposals} proposal${pendingProposals > 1 ? 's await' : ' awaits'} approval`,
        icon: FileText,
        action: { label: 'Review Proposals', onClick: () => navigate('/projects') }
      });
    }

    if (insightsList.length === 0) {
      insightsList.push({
        type: 'success',
        title: 'All Systems Operational',
        message: 'Portfolio is performing within expected parameters',
        icon: CheckCircle
      });
    }
    
    return insightsList;
  }, [revisionProjects, atRiskProjects, delayedProjects, budgetUtilization, pendingProposals, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
        <span className="text-lg text-gray-600">Loading executive dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Overview</h1>
          <p className="text-gray-600 mt-1">Capital Project Portfolio Command Center</p>
        </div>
      </div>

      {/* Executive KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon={Building2}
          color="blue"
          trend={{ value: '+12%', label: 'vs last quarter', positive: true }}
        />
        <MetricCard
          title="Portfolio Budget"
          value={formatCurrency(stats.totalBudget)}
          subtitle={`${budgetUtilization.toFixed(1)}% utilized`}
          icon={DollarSign}
          color="green"
          trend={{ value: budgetUtilization > 90 ? 'High' : 'Normal', label: 'utilization', positive: budgetUtilization <= 90 }}
        />
        <MetricCard
          title="Portfolio Health"
          value={`${stats.avgHealthScore}%`}
          subtitle="Average health score"
          icon={TrendingUp}
          color="purple"
          trend={{ value: '+5%', label: 'improvement', positive: true }}
        />
        <MetricCard
          title="At Risk"
          value={atRiskProjects}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Contracts"
          value={stats.projectsWithContracts}
          subtitle="Procurement active"
          icon={ShoppingCart}
          color="orange"
        />
        <MetricCard
          title="Payments Processed"
          value={stats.projectsWithPayments}
          subtitle="Financial transactions"
          icon={CreditCard}
          color="green"
        />
        <MetricCard
          title="Delayed Projects"
          value={delayedProjects}
          subtitle="Past deadline"
          icon={Clock}
          color="red"
        />
        <MetricCard
          title="Pending Proposals"
          value={pendingProposals}
          subtitle="Awaiting approval"
          icon={FileText}
          color="blue"
        />
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Utilization Ring */}
        <GradientCard gradient="green" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
          <div className="flex justify-center">
            <RadialProgress
              value={budgetUtilization}
              max={100}
              size={140}
              strokeWidth={12}
              color={budgetUtilization > 90 ? 'red' : budgetUtilization > 75 ? 'orange' : 'green'}
              label="Utilized"
              sublabel={`${formatCurrency(stats.totalSpent)} of ${formatCurrency(stats.totalBudget)}`}
            />
          </div>
        </GradientCard>

        {/* Portfolio Health Ring */}
        <GradientCard gradient="purple" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Health</h3>
          <div className="flex justify-center">
            <RadialProgress
              value={stats.avgHealthScore}
              max={100}
              size={140}
              strokeWidth={12}
              color={stats.avgHealthScore >= 80 ? 'green' : stats.avgHealthScore >= 60 ? 'orange' : 'red'}
              label="Health"
              sublabel={`${stats.totalProjects} projects monitored`}
            />
          </div>
        </GradientCard>

        {/* Risk Assessment Ring */}
        <GradientCard gradient="red" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="flex justify-center">
            <RadialProgress
              value={100 - (atRiskProjects / stats.totalProjects * 100)}
              max={100}
              size={140}
              strokeWidth={12}
              color={atRiskProjects === 0 ? 'green' : atRiskProjects <= 2 ? 'orange' : 'red'}
              label="Safe"
              sublabel={`${atRiskProjects} high risk project${atRiskProjects !== 1 ? 's' : ''}`}
            />
          </div>
        </GradientCard>
      </div>

      {/* Governance Command Center */}
      <GradientCard gradient="gray" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-ibm-blue" />
              Governance Command Center
            </h2>
            <p className="text-sm text-gray-600 mt-1">Real-time operational intelligence</p>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-2 px-4 py-2 bg-ibm-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Alerts
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </GradientCard>

      {/* Distribution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <GradientCard gradient="blue" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Projects by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(statusDistribution).map(([status, count]) => {
              const percentage = (count / stats.totalProjects) * 100;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GradientCard>

        {/* Phase Distribution */}
        <GradientCard gradient="purple" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Projects by Phase
          </h3>
          <div className="space-y-3">
            {Object.entries(phaseDistribution).map(([phase, count]) => {
              const percentage = (count / stats.totalProjects) * 100;
              return (
                <div key={phase}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{phase}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GradientCard>
      </div>

      {/* Geographic Intelligence */}
      <GradientCard gradient="orange" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          Geographic Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topLocations.map(([location, count], index) => (
            <div key={location} className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-orange-600">#{index + 1}</span>
                <span className="text-sm font-semibold text-gray-900">{count} projects</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{location}</p>
            </div>
          ))}
        </div>
      </GradientCard>
    </div>
  );
};

export default Overview;

// Made with Bob