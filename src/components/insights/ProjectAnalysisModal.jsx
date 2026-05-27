import React, { useState, useMemo } from 'react';
import { X, Building2, DollarSign, FileText, ShoppingCart, CreditCard, AlertTriangle, TrendingUp, Clock, Target, Zap, CheckCircle, XCircle } from 'lucide-react';
import { GradientCard, RadialProgress, InsightCard } from '../common/PremiumCard';

const ProjectAnalysisModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = [];
    
    if (project.budget > 0) {
      const utilization = (project.spent / project.budget) * 100;
      if (utilization > 90) {
        recs.push({
          type: 'error',
          title: 'Budget Utilization Critical',
          message: `Project has spent ${utilization.toFixed(1)}% of allocated budget. Immediate review recommended.`,
          icon: AlertTriangle
        });
      } else if (utilization > 75) {
        recs.push({
          type: 'warning',
          title: 'High Budget Utilization',
          message: `Budget utilization at ${utilization.toFixed(1)}%. Monitor spending closely.`,
          icon: DollarSign
        });
      }
    }

    if (project.riskScore >= 60) {
      recs.push({
        type: 'error',
        title: 'High Risk Project',
        message: `Risk score of ${project.riskScore}% requires immediate governance attention.`,
        icon: AlertTriangle
      });
    }

    if (project.status?.toLowerCase().includes('revision')) {
      recs.push({
        type: 'warning',
        title: 'Revision In Progress',
        message: 'Project is under revision. Ensure timely completion of review process.',
        icon: FileText
      });
    }

    if (project.hasProposal && project.proposalDetails?.status?.toLowerCase().includes('pending')) {
      recs.push({
        type: 'warning',
        title: 'Proposal Approval Pending',
        message: 'Proposal awaiting approval. Expedite routing to avoid delays.',
        icon: FileText
      });
    }

    if (recs.length === 0) {
      recs.push({
        type: 'success',
        title: 'Project On Track',
        message: 'All governance parameters within acceptable thresholds.',
        icon: CheckCircle
      });
    }

    return recs;
  }, [project]);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Building2 },
    { id: 'budget', label: 'Budget Intelligence', icon: DollarSign },
    { id: 'procurement', label: 'Procurement & Contracts', icon: ShoppingCart },
    { id: 'proposal', label: 'Proposal Management', icon: FileText },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
    { id: 'risks', label: 'Risks & Governance', icon: AlertTriangle },
    { id: 'recommendations', label: 'Agent Recommendations', icon: Zap },
    { id: 'timeline', label: 'Timeline & Activity', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ibm-blue to-blue-700 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="w-7 h-7" />
              Capital Project Intelligence Workspace
            </h2>
            <p className="text-blue-100 mt-1">{project.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-ibm-blue border-b-2 border-ibm-blue bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GradientCard gradient="blue" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Health</h3>
                  <div className="flex justify-center">
                    <RadialProgress
                      value={project.healthScore}
                      max={100}
                      size={120}
                      strokeWidth={10}
                      color={project.healthScore >= 80 ? 'green' : project.healthScore >= 60 ? 'orange' : 'red'}
                      label="Health"
                    />
                  </div>
                </GradientCard>

                <GradientCard gradient="red" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="flex justify-center">
                    <RadialProgress
                      value={project.riskScore}
                      max={100}
                      size={120}
                      strokeWidth={10}
                      color={project.riskScore >= 60 ? 'red' : project.riskScore >= 40 ? 'orange' : 'green'}
                      label="Risk"
                    />
                  </div>
                </GradientCard>

                <GradientCard gradient="green" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Status</h3>
                  <div className="flex justify-center">
                    <RadialProgress
                      value={(project.spent / project.budget) * 100}
                      max={100}
                      size={120}
                      strokeWidth={10}
                      color="green"
                      label="Utilized"
                    />
                  </div>
                </GradientCard>
              </div>

              <GradientCard gradient="gray" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="font-semibold text-gray-900">{project.status}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Phase</p>
                    <p className="font-semibold text-gray-900">{project.phase}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Building</p>
                    <p className="font-semibold text-gray-900">{project.building}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Project Manager</p>
                    <p className="font-semibold text-gray-900">{project.projectManager}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{project.city}, {project.state}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Timeline</p>
                    <p className="font-semibold text-gray-900">{project.timeline}</p>
                  </div>
                </div>
              </GradientCard>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              {project.hasBudget && project.budgetDetails ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GradientCard gradient="green" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Budget Amount</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(project.budgetDetails.budgetAmount)}</p>
                      <p className="text-sm text-gray-600 mt-2">{project.budgetDetails.budgetStatus}</p>
                    </GradientCard>
                    <GradientCard gradient="blue" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Incurred Cost</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(project.budgetDetails.incurredCost)}</p>
                      <p className="text-sm text-gray-600 mt-2">Actual spending</p>
                    </GradientCard>
                    <GradientCard gradient="purple" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Forecast Cost</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(project.budgetDetails.forecastCost)}</p>
                      <p className="text-sm text-gray-600 mt-2">Projected total</p>
                    </GradientCard>
                  </div>

                  <GradientCard gradient="gray" className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Intelligence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Budget Name</p>
                        <p className="font-semibold text-gray-900">{project.budgetDetails.budgetName || 'N/A'}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(project.budgetDetails.estimatedCost)}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Currency</p>
                        <p className="font-semibold text-gray-900">{project.budgetDetails.currency || 'USD'}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Variance</p>
                        <p className={`font-semibold ${(project.budgetDetails.budgetAmount - project.budgetDetails.incurredCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(project.budgetDetails.budgetAmount - project.budgetDetails.incurredCost)}
                        </p>
                      </div>
                    </div>
                  </GradientCard>
                </>
              ) : (
                <GradientCard gradient="gray" className="p-12 text-center">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Budget Data Available</h3>
                  <p className="text-gray-600">Budget information has not been linked to this project.</p>
                </GradientCard>
              )}
            </div>
          )}

          {activeTab === 'procurement' && (
            <div className="space-y-6">
              {project.hasContracts && project.contractDetails ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GradientCard gradient="orange" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Contract Amount</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(project.contractDetails.approvedAmount)}</p>
                      <p className="text-sm text-gray-600 mt-2">{project.contractDetails.contractStatus}</p>
                    </GradientCard>
                    <GradientCard gradient="blue" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Change Orders</p>
                      <p className="text-3xl font-bold text-gray-900">{project.contractDetails.changeOrders || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">Contract modifications</p>
                    </GradientCard>
                    <GradientCard gradient="purple" className="p-6">
                      <p className="text-sm text-gray-600 mb-2">Contract State</p>
                      <p className="text-2xl font-bold text-gray-900">{project.contractDetails.contractState || 'Active'}</p>
                      <p className="text-sm text-gray-600 mt-2">Current status</p>
                    </GradientCard>
                  </div>

                  <GradientCard gradient="gray" className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Contract Name</p>
                        <p className="font-semibold text-gray-900">{project.contractDetails.contractName || 'N/A'}</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Contract Type</p>
                        <p className="font-semibold text-gray-900">{project.contractDetails.contractType || 'N/A'}</p>
                      </div>
                    </div>
                  </GradientCard>
                </>
              ) : (
                <GradientCard gradient="gray" className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contract Data Available</h3>
                  <p className="text-gray-600">No procurement contracts have been linked to this project.</p>
                </GradientCard>
              )}
            </div>
          )}

          {activeTab === 'proposal' && (
            <div className="space-y-6">
              {project.hasProposal && project.proposalDetails ? (
                <GradientCard gradient="gray" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Proposal Status</p>
                      <p className="font-semibold text-gray-900">{project.proposalDetails.status || 'N/A'}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Proposal Type</p>
                      <p className="font-semibold text-gray-900">{project.proposalDetails.type || 'N/A'}</p>
                    </div>
                  </div>
                </GradientCard>
              ) : (
                <GradientCard gradient="gray" className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Proposal Data Available</h3>
                  <p className="text-gray-600">No proposals have been linked to this project.</p>
                </GradientCard>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              {project.hasPayments && project.paymentDetails ? (
                <GradientCard gradient="gray" className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                      <p className="font-semibold text-gray-900">{project.paymentDetails.status || 'N/A'}</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Invoice Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(project.paymentDetails.invoiceAmount)}</p>
                    </div>
                  </div>
                </GradientCard>
              ) : (
                <GradientCard gradient="gray" className="p-12 text-center">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Data Available</h3>
                  <p className="text-gray-600">No payment records have been linked to this project.</p>
                </GradientCard>
              )}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <GradientCard gradient="red" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 mb-3">
                      <span className="text-3xl font-bold text-gray-900">{project.riskScore}%</span>
                    </div>
                    <p className="text-sm text-gray-700">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 mb-3">
                      <span className="text-3xl font-bold text-gray-900">{project.healthScore}%</span>
                    </div>
                    <p className="text-sm text-gray-700">Health Score</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/60 mb-3">
                      {project.riskScore >= 60 ? (
                        <XCircle className="w-10 h-10 text-red-600" />
                      ) : (
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700">Governance Status</p>
                  </div>
                </div>
              </GradientCard>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <GradientCard gradient="blue" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  AI-Powered Governance Recommendations
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Intelligent insights generated from project data analysis
                </p>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <InsightCard key={index} {...rec} />
                  ))}
                </div>
              </GradientCard>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <GradientCard gradient="gray" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
                <div className="space-y-4">
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Timeline</p>
                    <p className="font-semibold text-gray-900">{project.timeline}</p>
                  </div>
                  {project.startDate && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Start Date</p>
                      <p className="font-semibold text-gray-900">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {project.endDate && (
                    <div className="bg-white/60 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">End Date</p>
                      <p className="font-semibold text-gray-900">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </GradientCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisModal;

// Made with Bob
