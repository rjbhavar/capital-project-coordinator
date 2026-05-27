import React, { useMemo } from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { GradientCard, MetricCard, RadialProgress } from '../components/common/PremiumCard';
import { useData } from '../context/DataContext';
import {
  ShoppingCart,
  FileSignature,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  RefreshCw,
  Package,
  FileCheck
} from 'lucide-react';

const Procurement = () => {
  const { projects, loading, error, refresh } = useData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Memoize procurement metrics
  const procurementMetrics = useMemo(() => {
    const projectsWithContracts = projects.filter(p => p.hasContracts && p.contractDetails);
    const totalContractValue = projectsWithContracts.reduce((sum, p) => 
      sum + (p.contractDetails?.approvedAmount || 0), 0
    );
    const activeContracts = projectsWithContracts.filter(p => 
      p.contractDetails?.contractStatus?.toLowerCase().includes('active') ||
      p.contractDetails?.contractStatus?.toLowerCase().includes('approved')
    ).length;
    const pendingContracts = projectsWithContracts.filter(p => 
      p.contractDetails?.contractStatus?.toLowerCase().includes('pending') ||
      p.contractDetails?.contractStatus?.toLowerCase().includes('revision')
    ).length;
    const completedContracts = projectsWithContracts.filter(p => 
      p.contractDetails?.contractStatus?.toLowerCase().includes('complete')
    ).length;

    return {
      projectsWithContracts,
      totalContractValue,
      activeContracts,
      pendingContracts,
      completedContracts
    };
  }, [projects]);

  const { projectsWithContracts, totalContractValue, activeContracts, pendingContracts, completedContracts } = procurementMetrics;

  const contractCompletionRate = projectsWithContracts.length > 0 
    ? (completedContracts / projectsWithContracts.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
        <span className="text-lg text-gray-600">Loading procurement data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600 mt-1">Contract operations and procurement tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outline" icon={Download}>
            Export Procurement Report
          </Button>
        </div>
      </div>

      {/* Procurement KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contracts"
          value={projectsWithContracts.length}
          subtitle="Active procurement"
          icon={ShoppingCart}
          color="orange"
        />
        <MetricCard
          title="Contract Value"
          value={formatCurrency(totalContractValue)}
          subtitle="Total approved amount"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Active Contracts"
          value={activeContracts}
          subtitle="Currently active"
          icon={FileCheck}
          color="blue"
        />
        <MetricCard
          title="Pending Review"
          value={pendingContracts}
          subtitle="Awaiting approval"
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      {/* Procurement Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Completion Rate */}
        <GradientCard gradient="green" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
          <div className="flex justify-center">
            <RadialProgress
              value={contractCompletionRate}
              max={100}
              size={140}
              strokeWidth={12}
              color={contractCompletionRate >= 80 ? 'green' : contractCompletionRate >= 60 ? 'orange' : 'red'}
              label="Complete"
              sublabel={`${completedContracts} of ${projectsWithContracts.length} contracts`}
            />
          </div>
        </GradientCard>

        {/* Active Contracts */}
        <GradientCard gradient="blue" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Contracts</h3>
          <div className="flex flex-col items-center justify-center h-40">
            <Package className="w-16 h-16 text-blue-600 mb-3" />
            <p className="text-4xl font-bold text-gray-900">{activeContracts}</p>
            <p className="text-sm text-gray-600 mt-2">Currently in progress</p>
          </div>
        </GradientCard>

        {/* Pending Approvals */}
        <GradientCard gradient="yellow" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
          <div className="flex flex-col items-center justify-center h-40">
            <FileSignature className="w-16 h-16 text-yellow-600 mb-3" />
            <p className="text-4xl font-bold text-gray-900">{pendingContracts}</p>
            <p className="text-sm text-gray-600 mt-2">Require attention</p>
          </div>
        </GradientCard>
      </div>

      {/* Contract Details Table */}
      <GradientCard gradient="gray" className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white/50">
          <h2 className="text-xl font-bold text-gray-900">Contract Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Project</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Contract Name</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Approved Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Change Orders</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">State</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projectsWithContracts.map((project) => (
                <tr key={project.id} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.building}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{project.contractDetails?.contractName || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={project.contractDetails?.contractStatus || 'Unknown'} />
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {project.contractDetails?.contractType || 'N/A'}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {formatCurrency(project.contractDetails?.approvedAmount || 0)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      (project.contractDetails?.changeOrders || 0) > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {project.contractDetails?.changeOrders || 0} changes
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {project.contractDetails?.contractState || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GradientCard>

      {/* Procurement Pipeline */}
      <GradientCard gradient="orange" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Total Contracts</p>
            <p className="text-3xl font-bold text-gray-900">{projectsWithContracts.length}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Active</p>
            <p className="text-3xl font-bold text-blue-600">{activeContracts}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingContracts}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedContracts}</p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default Procurement;

// Made with Bob