import React from 'react';
import { X } from 'lucide-react';

const BatchAnalysisModal = ({ projects, onClose }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Batch Analysis ({projects.length} projects)</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Batch Summary</h3>
            <p className="text-blue-800">Total Projects: {projects.length}</p>
            <p className="text-blue-800">Average Health: {Math.round(projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length)}%</p>
          </div>
          {projects.map(project => (
            <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-600">Health: {project.healthScore}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchAnalysisModal;

// Made with Bob
