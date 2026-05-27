/**
 * Export utilities for Capital Project data
 */

/**
 * Convert projects to CSV format
 */
export const exportToCSV = (projects) => {
  if (!projects || projects.length === 0) {
    throw new Error('No projects to export');
  }

  // Define CSV headers
  const headers = [
    'Project ID',
    'Project Name',
    'Status',
    'Phase',
    'Classification',
    'Type',
    'Project Manager',
    'Location',
    'City',
    'State',
    'Country',
    'Budget',
    'Spent',
    'Commitments',
    'Currency',
    'Start Date',
    'End Date',
    'Timeline',
    'Health Score',
    'Risk Score',
    'Priority',
    'Has Budget',
    'Has Proposal',
    'Has Contracts',
    'Has Payments'
  ];

  // Convert projects to CSV rows
  const rows = projects.map(project => [
    project.projectId,
    `"${project.name}"`,
    project.status,
    project.phase,
    project.classification,
    project.projectType,
    project.projectManager,
    `"${project.location}"`,
    project.city,
    project.state,
    project.country,
    project.budget,
    project.spent,
    project.commitments,
    project.currency,
    project.startDate || '',
    project.endDate || '',
    `"${project.timeline}"`,
    project.healthScore,
    project.riskScore,
    project.priority,
    project.hasBudget ? 'Yes' : 'No',
    project.hasProposal ? 'Yes' : 'No',
    project.hasContracts ? 'Yes' : 'No',
    project.hasPayments ? 'Yes' : 'No'
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Export detailed project data including related entities
 */
export const exportDetailedCSV = (projects) => {
  if (!projects || projects.length === 0) {
    throw new Error('No projects to export');
  }

  let csvContent = '';

  projects.forEach((project, index) => {
    // Project header
    csvContent += `\n=== PROJECT ${index + 1}: ${project.name} ===\n\n`;

    // Basic project info
    csvContent += 'PROJECT DETAILS\n';
    csvContent += `Project ID,${project.projectId}\n`;
    csvContent += `Name,"${project.name}"\n`;
    csvContent += `Status,${project.status}\n`;
    csvContent += `Phase,${project.phase}\n`;
    csvContent += `Classification,${project.classification}\n`;
    csvContent += `Type,${project.projectType}\n`;
    csvContent += `Project Manager,${project.projectManager}\n`;
    csvContent += `Location,"${project.location}"\n`;
    csvContent += `City,${project.city}\n`;
    csvContent += `State,${project.state}\n`;
    csvContent += `Country,${project.country}\n`;
    csvContent += `Budget,${project.budget}\n`;
    csvContent += `Spent,${project.spent}\n`;
    csvContent += `Commitments,${project.commitments}\n`;
    csvContent += `Currency,${project.currency}\n`;
    csvContent += `Timeline,"${project.timeline}"\n`;
    csvContent += `Health Score,${project.healthScore}\n`;
    csvContent += `Risk Score,${project.riskScore}\n`;
    csvContent += `Priority,${project.priority}\n\n`;

    // Budget details
    if (project.budgetDetails) {
      csvContent += 'BUDGET DETAILS\n';
      csvContent += `Budget Name,"${project.budgetDetails.name || 'N/A'}"\n`;
      csvContent += `Budget Status,${project.budgetDetails.status || 'N/A'}\n`;
      csvContent += `Budget Type,${project.budgetDetails.budgetType || 'N/A'}\n`;
      csvContent += `Estimated Cost,${project.budgetDetails.estimatedCost || 0}\n`;
      csvContent += `Total Cost,${project.budgetDetails.totalCost || 0}\n`;
      csvContent += `Budget Amount,${project.budgetDetails.budgetAmount || 0}\n`;
      csvContent += `Forecast Cost,${project.budgetDetails.forecastCost || 0}\n`;
      csvContent += `Incurred Cost,${project.budgetDetails.incurredCost || 0}\n\n`;
    }

    // Proposal details
    if (project.proposalDetails) {
      csvContent += 'PROPOSAL DETAILS\n';
      csvContent += `Proposal Name,"${project.proposalDetails.name || 'N/A'}"\n`;
      csvContent += `Proposal Status,${project.proposalDetails.status || 'N/A'}\n`;
      csvContent += `Proposal Type,${project.proposalDetails.proposalType || 'N/A'}\n`;
      csvContent += `Contact Name,${project.proposalDetails.contactName || 'N/A'}\n`;
      csvContent += `Contact Email,${project.proposalDetails.contactEmail || 'N/A'}\n`;
      csvContent += `Proposal Date,${project.proposalDetails.proposalDate || 'N/A'}\n`;
      csvContent += `Bid Amount,${project.proposalDetails.bidAmount || 0}\n\n`;
    }

    // Contract details
    if (project.contractDetails && project.contractDetails.length > 0) {
      csvContent += 'CONTRACT DETAILS\n';
      csvContent += 'Contract Name,Status,Type,Approved Amount,Change Orders,State\n';
      project.contractDetails.forEach(contract => {
        csvContent += `"${contract.name || 'N/A'}",${contract.status || 'N/A'},${contract.contractType || 'N/A'},${contract.approvedAmount || 0},${contract.changeOrders || 0},${contract.contractState || 'N/A'}\n`;
      });
      csvContent += '\n';
    }

    // Payment details
    if (project.paymentDetails && project.paymentDetails.length > 0) {
      csvContent += 'PAYMENT DETAILS\n';
      csvContent += 'Payment Name,Status,Invoice Amount,Payee,Payment Date\n';
      project.paymentDetails.forEach(payment => {
        csvContent += `"${payment.name || 'N/A'}",${payment.status || 'N/A'},${payment.invoiceAmount || 0},${payment.payee || 'N/A'},${payment.paymentDate || 'N/A'}\n`;
      });
      csvContent += '\n';
    }
  });

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename = 'capital-projects-export.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export projects with all details
 */
export const exportProjects = (projects, detailed = false) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `capital-projects-${timestamp}.csv`;
    
    const csvContent = detailed 
      ? exportDetailedCSV(projects)
      : exportToCSV(projects);
    
    downloadCSV(csvContent, filename);
    
    return {
      success: true,
      message: `Successfully exported ${projects.length} project(s)`
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Made with Bob