import React from 'react';
import { X } from 'lucide-react';

const ProjectAnalysisModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">AI Analysis: {project.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Project Overview</h3>
            <p className="text-blue-800">Building: {project.building}</p>
            <p className="text-blue-800">Status: {project.status}</p>
            <p className="text-blue-800">Health Score: {project.healthScore}%</p>
          </div>
          {project.hasBudget && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Budget Analysis</h3>
              <p className="text-green-800">Budget: ${project.budget?.toLocaleString()}</p>
              <p className="text-green-800">Spent: ${project.spent?.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisModal;

// Made with Bob
