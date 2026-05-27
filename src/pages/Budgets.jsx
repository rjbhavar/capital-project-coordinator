import React, { useMemo } from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { GradientCard, MetricCard, RadialProgress } from '../components/common/PremiumCard';
import { useData } from '../context/DataContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  RefreshCw,
  PieChart,
  BarChart3
} from 'lucide-react';

const Budgets = () => {
  const { projects, loading, error, refresh } = useData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Memoize budget metrics
  const budgetMetrics = useMemo(() => {
    const projectsWithBudgets = projects.filter(p => p.hasBudget && p.budgetDetails);
    return {
      projectsWithBudgets,
      totalBudgetAmount: projectsWithBudgets.reduce((sum, p) => 
        sum + (p.budgetDetails?.budgetAmount || 0), 0
      ),
      totalEstimatedCost: projectsWithBudgets.reduce((sum, p) => 
        sum + (p.budgetDetails?.estimatedCost || 0), 0
      ),
      totalIncurredCost: projectsWithBudgets.reduce((sum, p) => 
        sum + (p.budgetDetails?.incurredCost || 0), 0
      ),
      totalForecastCost: projectsWithBudgets.reduce((sum, p) => 
        sum + (p.budgetDetails?.forecastCost || 0), 0
      )
    };
  }, [projects]);

  const { projectsWithBudgets, totalBudgetAmount, totalEstimatedCost, totalIncurredCost, totalForecastCost } = budgetMetrics;

  const budgetUtilization = totalBudgetAmount > 0 ? (totalIncurredCost / totalBudgetAmount) * 100 : 0;
  const budgetVariance = totalBudgetAmount - totalIncurredCost;
  const forecastVariance = totalForecastCost - totalBudgetAmount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-ibm-blue mr-3" />
        <span className="text-lg text-gray-600">Loading budget data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-1">Financial governance and budget tracking</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={RefreshCw} onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outline" icon={Download}>
            Export Budget Report
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Budget"
          value={formatCurrency(totalBudgetAmount)}
          subtitle={`${projectsWithBudgets.length} projects`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Estimated Cost"
          value={formatCurrency(totalEstimatedCost)}
          subtitle="Planned expenditure"
          icon={BarChart3}
          color="purple"
        />
        <MetricCard
          title="Incurred Cost"
          value={formatCurrency(totalIncurredCost)}
          subtitle={`${budgetUtilization.toFixed(1)}% utilized`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Forecast Cost"
          value={formatCurrency(totalForecastCost)}
          subtitle="Projected total"
          icon={PieChart}
          color="orange"
        />
      </div>

      {/* Budget Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Utilization */}
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
              sublabel={`${formatCurrency(totalIncurredCost)} spent`}
            />
          </div>
        </GradientCard>

        {/* Budget Variance */}
        <GradientCard gradient={budgetVariance >= 0 ? 'green' : 'red'} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Variance</h3>
          <div className="flex flex-col items-center justify-center h-40">
            {budgetVariance >= 0 ? (
              <CheckCircle className="w-16 h-16 text-green-600 mb-3" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-red-600 mb-3" />
            )}
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(Math.abs(budgetVariance))}</p>
            <p className="text-sm text-gray-600 mt-2">{budgetVariance >= 0 ? 'Under Budget' : 'Over Budget'}</p>
          </div>
        </GradientCard>

        {/* Forecast Variance */}
        <GradientCard gradient={forecastVariance <= 0 ? 'green' : 'orange'} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Variance</h3>
          <div className="flex flex-col items-center justify-center h-40">
            {forecastVariance <= 0 ? (
              <TrendingDown className="w-16 h-16 text-green-600 mb-3" />
            ) : (
              <TrendingUp className="w-16 h-16 text-orange-600 mb-3" />
            )}
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(Math.abs(forecastVariance))}</p>
            <p className="text-sm text-gray-600 mt-2">{forecastVariance <= 0 ? 'On Track' : 'Projected Overrun'}</p>
          </div>
        </GradientCard>
      </div>

      {/* Budget Details Table */}
      <GradientCard gradient="gray" className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white/50">
          <h2 className="text-xl font-bold text-gray-900">Project Budget Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Project</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Budget Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Budget Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Estimated</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Incurred</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Forecast</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Utilization</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Variance</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projectsWithBudgets.map((project) => {
                const utilization = project.budgetDetails?.budgetAmount > 0
                  ? (project.budgetDetails.incurredCost / project.budgetDetails.budgetAmount) * 100
                  : 0;
                const variance = project.budgetDetails?.budgetAmount - project.budgetDetails?.incurredCost;

                return (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.building}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={project.budgetDetails?.budgetStatus || 'Unknown'} />
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {formatCurrency(project.budgetDetails?.budgetAmount || 0)}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {formatCurrency(project.budgetDetails?.estimatedCost || 0)}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {formatCurrency(project.budgetDetails?.incurredCost || 0)}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {formatCurrency(project.budgetDetails?.forecastCost || 0)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              utilization > 90 ? 'bg-red-500' :
                              utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GradientCard>

      {/* Budget Summary */}
      <GradientCard gradient="blue" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Total Allocated</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgetAmount)}</p>
            <p className="text-xs text-gray-500 mt-1">Across {projectsWithBudgets.length} projects</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncurredCost)}</p>
            <p className="text-xs text-gray-500 mt-1">{budgetUtilization.toFixed(1)}% of budget</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Remaining</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetVariance)}</p>
            <p className="text-xs text-gray-500 mt-1">Available funds</p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default Budgets;

// Made with Bob