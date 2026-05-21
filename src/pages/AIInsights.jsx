import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, StatCard } from '../components/common/Card';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { fetchProjectById } from '../services/capitalProjects';
import { mockAIInsights } from '../mock/aiInsights';
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  Send
} from 'lucide-react';

const AIInsights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instruction, setInstruction] = useState('');
  const [showInstructionPanel, setShowInstructionPanel] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjectById(parseInt(id));
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const insights = mockAIInsights[id];

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading project data...</p>
      </div>
    );
  }

  if (!project || !insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project insights not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleSendInstruction = () => {
    console.log('Instruction sent:', instruction);
    // In a real app, this would send to backend
    setInstruction('');
    alert('Instruction sent to AI Agent! (Demo mode - no backend)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.building} • {project.projectManager}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={MessageSquare}
            onClick={() => setShowInstructionPanel(!showInstructionPanel)}
          >
            Give Instructions
          </Button>
          <Button variant="primary" icon={Brain}>
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* AI Instruction Panel */}
      {showInstructionPanel && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Brain className="w-6 h-6 text-ibm-blue mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Give AI Agent Instructions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide specific instructions or questions for the AI to analyze and act upon.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g., 'Prioritize vendor approval tasks' or 'Analyze budget risks'"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ibm-blue"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendInstruction()}
                />
                <Button
                  variant="primary"
                  icon={Send}
                  onClick={handleSendInstruction}
                  disabled={!instruction.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Overall Health"
          value={`${insights.healthMetrics.overallHealth}%`}
          icon={TrendingUp}
          color={insights.healthMetrics.overallHealth >= 80 ? 'green' : 'yellow'}
        />
        <StatCard
          title="Timeline Status"
          value={insights.healthMetrics.timelineStatus}
          icon={Clock}
          color={insights.healthMetrics.timelineStatus === 'On Track' ? 'green' : 'red'}
        />
        <StatCard
          title="Budget Status"
          value={insights.healthMetrics.budgetStatus}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Risk Level"
          value={insights.healthMetrics.riskLevel}
          icon={AlertTriangle}
          color={insights.healthMetrics.riskLevel === 'Low' ? 'green' : 'yellow'}
        />
      </div>

      {/* Executive Summary */}
      <Card
        title="AI Executive Summary"
        subtitle="Generated by Capital Project Coordinator"
        action={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Brain className="w-4 h-4" />
            <span>AI Confidence: 89%</span>
          </div>
        }
      >
        <p className="text-gray-700 leading-relaxed">{insights.executiveSummary}</p>
      </Card>

      {/* AI Generated Tasks */}
      <Card title="AI Generated Tasks" subtitle={`${insights.aiGeneratedTasks.length} tasks identified`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Suggested Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">AI Confidence</th>
              </tr>
            </thead>
            <tbody>
              {insights.aiGeneratedTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{task.task}</td>
                  <td className="py-4 px-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-4 px-4 text-gray-700">{task.suggestedOwner}</td>
                  <td className="py-4 px-4 text-gray-700">{task.dueDate}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${task.aiConfidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{task.aiConfidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dependencies and Risks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dependencies */}
        <Card title="Dependency Analysis" subtitle={`${insights.dependencies.length} dependencies tracked`}>
          <div className="space-y-4">
            {insights.dependencies.map((dep) => (
              <div key={dep.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{dep.from}</p>
                    <p className="text-sm text-gray-500 mt-1">→ {dep.to}</p>
                  </div>
                  <StatusBadge status={dep.status} />
                </div>
                <p className="text-sm text-gray-600 mt-2">{dep.description}</p>
                <div className="mt-2">
                  <span className={`text-xs font-medium ${
                    dep.impact === 'Critical' ? 'text-red-600' :
                    dep.impact === 'High' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {dep.impact} Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Risks */}
        <Card title="Risk Detection" subtitle={`${insights.risks.length} risks identified`}>
          <div className="space-y-4">
            {insights.risks.map((risk) => (
              <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      risk.severity === 'High' ? 'text-red-500' :
                      risk.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <span className="font-medium text-gray-900">{risk.category}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-2">{risk.description}</p>
                <p className="text-sm text-gray-600 mt-1">Impact: {risk.impact}</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">Mitigation:</p>
                  <p className="text-xs text-gray-600">{risk.mitigation}</p>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Probability: {risk.probability}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card title="AI Recommendations" subtitle="Prioritized action items">
        <div className="space-y-4">
          {insights.recommendations.map((rec) => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:border-ibm-blue transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                </div>
                <span className="text-xs text-gray-500">Effort: {rec.effort}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{rec.action}</h4>
              <p className="text-sm text-gray-600 mb-2">{rec.rationale}</p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Expected Impact: {rec.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIInsights;

// Made with Bob
