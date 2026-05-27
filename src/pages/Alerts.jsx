import React, { useMemo } from 'react';
import { Button } from '../components/common/Button';
import { GradientCard, MetricCard, InsightCard } from '../components/common/PremiumCard';
import { useData } from '../context/DataContext';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  XCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Alerts = () => {
  const navigate = useNavigate();
  const { projects, loading } = useData();

  // Memoize alerts generation
  const alerts = useMemo(() => {
    const alertsList = [];

    // Budget alerts
    projects.forEach(project => {
      if (project.budget > 0) {
        const utilization = (project.spent / project.budget) * 100;
        if (utilization > 90) {
          alertsList.push({
            type: 'critical',
            category: 'Budget',
            title: 'Critical Budget Overrun',
            message: `${project.name} has spent ${utilization.toFixed(1)}% of budget`,
            project: project,
            timestamp: new Date().toISOString()
          });
        } else if (utilization > 75) {
          alertsList.push({
            type: 'warning',
            category: 'Budget',
            title: 'High Budget Utilization',
            message: `${project.name} approaching budget limit (${utilization.toFixed(1)}%)`,
            project: project,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Timeline alerts
    projects.forEach(project => {
      if (project.endDate) {
        const endDate = new Date(project.endDate);
        const today = new Date();
        const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEnd < 0) {
          alertsList.push({
            type: 'critical',
            category: 'Timeline',
            title: 'Project Overdue',
            message: `${project.name} is ${Math.abs(daysUntilEnd)} days past deadline`,
            project: project,
            timestamp: new Date().toISOString()
          });
        } else if (daysUntilEnd < 30) {
          alertsList.push({
            type: 'warning',
            category: 'Timeline',
            title: 'Approaching Deadline',
            message: `${project.name} deadline in ${daysUntilEnd} days`,
            project: project,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Status alerts
    projects.forEach(project => {
      if (project.status.toLowerCase().includes('revision')) {
        alertsList.push({
          type: 'info',
          category: 'Status',
          title: 'Revision In Progress',
          message: `${project.name} is under revision`,
          project: project,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Proposal alerts
    projects.forEach(project => {
      if (project.hasProposal && project.proposalDetails?.status?.toLowerCase().includes('pending')) {
        alertsList.push({
          type: 'warning',
          category: 'Proposal',
          title: 'Pending Proposal Approval',
          message: `${project.name} has proposal awaiting approval`,
          project: project,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Risk alerts
    projects.forEach(project => {
      if (project.riskScore >= 60) {
        alertsList.push({
          type: 'critical',
          category: 'Risk',
          title: 'High Risk Project',
          message: `${project.name} has risk score of ${project.riskScore}%`,
          project: project,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Sort alerts by severity
    const sortedAlerts = alertsList.sort((a, b) => {
      const severity = { critical: 0, warning: 1, info: 2 };
      return severity[a.type] - severity[b.type];
    });

    return {
      alerts: sortedAlerts,
      criticalCount: alertsList.filter(a => a.type === 'critical').length,
      warningCount: alertsList.filter(a => a.type === 'warning').length,
      infoCount: alertsList.filter(a => a.type === 'info').length
    };
  }, [projects]);

  const { alerts: sortedAlerts, criticalCount, warningCount, infoCount } = alerts;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      default:
        return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
        <span className="text-lg text-gray-600">Loading alerts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-ibm-blue" />
            Alert Monitoring Center
          </h1>
          <p className="text-gray-600 mt-1">Real-time operational intelligence and risk monitoring</p>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Alerts"
          value={sortedAlerts.length}
          subtitle="Active notifications"
          icon={Bell}
          color="blue"
        />
        <MetricCard
          title="Critical"
          value={criticalCount}
          subtitle="Immediate attention"
          icon={XCircle}
          color="red"
        />
        <MetricCard
          title="Warnings"
          value={warningCount}
          subtitle="Require review"
          icon={AlertTriangle}
          color="yellow"
        />
        <MetricCard
          title="Information"
          value={infoCount}
          subtitle="For awareness"
          icon={AlertCircle}
          color="blue"
        />
      </div>

      {/* Alert Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GradientCard gradient="red" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            Budget Alerts
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {sortedAlerts.filter(a => a.category === 'Budget').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Financial governance</p>
        </GradientCard>

        <GradientCard gradient="orange" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Timeline Alerts
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {sortedAlerts.filter(a => a.category === 'Timeline').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Schedule monitoring</p>
        </GradientCard>

        <GradientCard gradient="purple" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Process Alerts
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {sortedAlerts.filter(a => a.category === 'Proposal' || a.category === 'Status').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Workflow tracking</p>
        </GradientCard>
      </div>

      {/* Active Alerts */}
      <GradientCard gradient="gray" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
            View All Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {sortedAlerts.length > 0 ? (
          <div className="space-y-3">
            {sortedAlerts.map((alert, index) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <InsightCard
                  key={index}
                  type={alert.type === 'critical' ? 'error' : alert.type}
                  title={alert.title}
                  message={alert.message}
                  icon={AlertIcon}
                  action={{
                    label: 'View Project',
                    onClick: () => navigate('/projects')
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h3>
            <p className="text-gray-600">All projects are on track and within parameters</p>
          </div>
        )}
      </GradientCard>
    </div>
  );
};

export default Alerts;

// Made with Bob