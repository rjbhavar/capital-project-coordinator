import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockActivityTimeline } from '../mock/aiInsights';
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Download
} from 'lucide-react';

const Timeline = () => {
  const [filter, setFilter] = useState('All');

  const filteredActivities = filter === 'All'
    ? mockActivityTimeline
    : mockActivityTimeline.filter(activity => activity.type === filter.toLowerCase());

  const getIcon = (type) => {
    switch (type) {
      case 'analysis':
        return <Brain className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'milestone':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'recommendation':
        return <Brain className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getIconColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Activity Timeline</h1>
          <p className="text-gray-600 mt-1">Real-time AI agent activities and project updates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download}>
            Export Timeline
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          <div className="flex gap-2">
            {['All', 'Analysis', 'Alert', 'Milestone', 'Recommendation'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-ibm-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card title="Activity Feed" subtitle={`${filteredActivities.length} activities`}>
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline Line */}
              {index !== filteredActivities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Activity Item */}
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(activity.severity)}`}>
                  {getIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-ibm-blue transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <Badge variant={activity.severity === 'success' ? 'success' : activity.severity === 'warning' ? 'warning' : 'info'}>
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{activity.projectName}</p>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-3">{activity.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Brain className="w-4 h-4" />
                        <span>AI Confidence: {activity.aiConfidence}%</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-6 border-t border-gray-200">
          <Button variant="outline">
            Load More Activities
          </Button>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockActivityTimeline.filter(a => a.type === 'analysis').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">AI Analyses</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockActivityTimeline.filter(a => a.type === 'alert').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Alerts</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockActivityTimeline.filter(a => a.type === 'milestone').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Milestones</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockActivityTimeline.filter(a => a.type === 'recommendation').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Recommendations</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Timeline;

// Made with Bob
