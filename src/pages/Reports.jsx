import React from 'react';
import { Button } from '../components/common/Button';
import { GradientCard, MetricCard } from '../components/common/PremiumCard';
import { useData } from '../context/DataContext';
import { exportProjects } from '../utils/exportUtils';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Loader2,
  FileSpreadsheet,
  BarChart3,
  PieChart
} from 'lucide-react';

const Reports = () => {
  const { projects, loading } = useData();

  const handleExport = (detailed = false) => {
    const result = exportProjects(projects, detailed);
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Export failed: ${result.message}`);
    }
  };

  const reports = [
    {
      title: 'Portfolio Summary Report',
      description: 'Comprehensive overview of all capital projects with key metrics and status',
      icon: FileText,
      color: 'blue',
      action: () => handleExport(false)
    },
    {
      title: 'Detailed Project Report',
      description: 'In-depth analysis including budgets, contracts, proposals, and payments',
      icon: FileSpreadsheet,
      color: 'green',
      action: () => handleExport(true)
    },
    {
      title: 'Budget Analysis Report',
      description: 'Financial governance report with budget utilization and variance analysis',
      icon: DollarSign,
      color: 'purple',
      action: () => handleExport(true)
    },
    {
      title: 'Procurement Report',
      description: 'Contract management report with procurement status and vendor details',
      icon: ShoppingCart,
      color: 'orange',
      action: () => handleExport(true)
    },
    {
      title: 'Timeline Report',
      description: 'Project schedule analysis with milestone tracking and delay identification',
      icon: Calendar,
      color: 'red',
      action: () => handleExport(true)
    },
    {
      title: 'Performance Dashboard',
      description: 'Executive dashboard with KPIs, health scores, and risk assessments',
      icon: TrendingUp,
      color: 'blue',
      action: () => handleExport(true)
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
        <span className="text-lg text-gray-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and export governance reports</p>
        </div>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={projects.length}
          subtitle="Available for reporting"
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Report Types"
          value={reports.length}
          subtitle="Available templates"
          icon={BarChart3}
          color="purple"
        />
        <MetricCard
          title="Data Points"
          value={projects.length * 8}
          subtitle="Metrics tracked"
          icon={PieChart}
          color="green"
        />
        <MetricCard
          title="Export Formats"
          value="2"
          subtitle="CSV & Excel"
          icon={FileSpreadsheet}
          color="orange"
        />
      </div>

      {/* Report Generation Center */}
      <GradientCard gradient="gray" className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Report Generation Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <GradientCard key={index} gradient={report.color} className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-white/60`}>
                  <report.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-700">{report.description}</p>
                </div>
              </div>
              <Button
                variant="primary"
                icon={Download}
                onClick={report.action}
                className="w-full shadow-md hover:shadow-lg transition-shadow"
              >
                Generate Report
              </Button>
            </GradientCard>
          ))}
        </div>
      </GradientCard>

      {/* Quick Export */}
      <GradientCard gradient="blue" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Export</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Summary Export</h4>
            <p className="text-sm text-gray-700 mb-4">Quick export with essential project information</p>
            <Button variant="outline" icon={Download} onClick={() => handleExport(false)}>
              Export Summary
            </Button>
          </div>
          <div className="flex-1 bg-white/60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Detailed Export</h4>
            <p className="text-sm text-gray-700 mb-4">Complete export with all project details and metrics</p>
            <Button variant="primary" icon={Download} onClick={() => handleExport(true)}>
              Export Detailed
            </Button>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default Reports;

// Made with Bob