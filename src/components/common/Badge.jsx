import React from 'react';

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger: 'badge badge-danger',
    info: 'badge badge-info',
    default: 'badge bg-gray-100 text-gray-800'
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    'In Progress': { variant: 'info', label: 'In Progress' },
    'Planning': { variant: 'default', label: 'Planning' },
    'Approved': { variant: 'success', label: 'Approved' },
    'Completing': { variant: 'success', label: 'Completing' },
    'On Hold': { variant: 'warning', label: 'On Hold' },
    'At Risk': { variant: 'danger', label: 'At Risk' },
    'Completed': { variant: 'success', label: 'Completed' },
    'Pending': { variant: 'warning', label: 'Pending' },
    'Not Started': { variant: 'default', label: 'Not Started' }
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'High': { variant: 'danger', label: 'High' },
    'Medium': { variant: 'warning', label: 'Medium' },
    'Low': { variant: 'info', label: 'Low' },
    'Critical': { variant: 'danger', label: 'Critical' }
  };

  const config = priorityConfig[priority] || { variant: 'default', label: priority };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const RiskBadge = ({ score }) => {
  let variant = 'success';
  let label = 'Low Risk';

  if (score >= 70) {
    variant = 'danger';
    label = 'High Risk';
  } else if (score >= 40) {
    variant = 'warning';
    label = 'Medium Risk';
  }

  return <Badge variant={variant}>{label}</Badge>;
};

// Made with Bob
