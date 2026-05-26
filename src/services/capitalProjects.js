import apiClient from './api';

/**
 * Fetch all capital projects from MREF OSLC API
 */
export const fetchCapitalProjects = async () => {
  try {
    console.log('📡 Fetching capital projects from MREF...');
    const response = await apiClient.get('/oslc/spq/cstCapitalProjectQC?oslc.select=*');
    
    console.log('📦 Raw API Response:', response.data);
    
    // Parse OSLC response - the real API uses 'rdfs:member'
    const members = response.data?.['rdfs:member'] || [];
    
    console.log(`📊 Found ${members.length} projects in response`);
    
    if (members.length === 0) {
      console.warn('⚠️ No projects found in MREF response');
    }
    
    // Map OSLC fields to application format
    const projects = members.map((project, index) => {
      const budget = parseFloat(project['spi:triBudgetOriginalRollupFR']) || 0;
      const incurredInvoice = parseFloat(project['spi:triIncurredInvoiceRollupFR']) || 0;
      const incurredPaid = parseFloat(project['spi:triIncurredPaidRollupFR']) || 0;
      const commitmentOriginal = parseFloat(project['spi:triCommitmentOriginalRollupFR']) || 0;
      const commitmentChanges = parseFloat(project['spi:triCommitmentChangesRollupFR']) || 0;
      
      // Calculate total spent (invoiced + paid)
      const spent = incurredInvoice + incurredPaid;
      
      return {
        id: project['dcterms:identifier'] || `project-${index + 1}`,
        projectId: project['spi:triIdTX'] || `ID-${index + 1}`,
        name: project['spi:triNameTX'] || 'Unnamed Project',
        status: project['spi:triStatusCL'] || 'Unknown',
        budget: budget,
        spent: spent,
        commitments: commitmentOriginal + commitmentChanges,
        phase: project['spi:triPhaseCL'] || 'N/A',
        projectManager: project['spi:triProjectLeadTX'] || 'Unassigned',
        startDate: project['spi:triProjectPlanStartDA'] || null,
        endDate: project['spi:triProjectPlanEndDA'] || null,
        actualStartDate: project['spi:triProjectActualStartDA'] || null,
        actualEndDate: project['spi:triProjectActualEndDA'] || null,
        location: project['spi:triProjectLocationTX'] || 'N/A',
        city: project['spi:triCityTX'] || 'N/A',
        state: project['spi:triStateProvTX'] || 'N/A',
        country: project['spi:triCountryTX'] || 'N/A',
        classification: project['spi:triProjectClassificationLI'] || 'N/A',
        projectType: project['spi:triProjectTypeLI'] || 'N/A',
        building: project['spi:triProjectLocationTX'] || 'N/A',
        currency: project['spi:triCurrencyUO'] || 'USD',
        organization: project['spi:OrgName'] || 'N/A',
        
        // Calculate derived fields
        progress: calculateProgress(project),
        healthScore: calculateHealthScore(project),
        riskScore: calculateRiskScore(project),
        timeline: formatTimeline(
          project['spi:triProjectPlanStartDA'],
          project['spi:triProjectPlanEndDA']
        ),
        
        // Additional fields
        priority: determinePriority(project),
        description: `${project['spi:triProjectClassificationLI'] || 'Project'} in ${project['spi:triCityTX'] || 'Unknown Location'}`,
        
        // Raw data for debugging
        _raw: project
      };
    });
    
    console.log(`✅ Fetched ${projects.length} capital projects from MREF`);
    return projects;
    
  } catch (error) {
    console.error('❌ Error fetching capital projects:', error.message);
    throw error;
  }
};

/**
 * Calculate project progress percentage
 */
const calculateProgress = (project) => {
  const budget = parseFloat(project['spi:triBudgetOriginalRollupFR']) || 0;
  const spent = parseFloat(project['spi:triBudgetSpentRollupFR']) || 0;
  
  if (budget === 0) return 0;
  return Math.min(Math.round((spent / budget) * 100), 100);
};

/**
 * Calculate project health score
 */
const calculateHealthScore = (project) => {
  const status = project['spi:triStatusCL'] || '';
  const phase = project['spi:triPhaseCL'] || '';
  
  // Simple health calculation based on status
  if (status.toLowerCase().includes('complete')) return 95;
  if (status.toLowerCase().includes('progress')) return 75;
  if (status.toLowerCase().includes('planning')) return 85;
  if (status.toLowerCase().includes('approved')) return 80;
  if (status.toLowerCase().includes('draft')) return 60;
  
  return 70; // Default
};

/**
 * Calculate project risk score
 */
const calculateRiskScore = (project) => {
  const budget = parseFloat(project['spi:triBudgetOriginalRollupFR']) || 0;
  const spent = parseFloat(project['spi:triBudgetSpentRollupFR']) || 0;
  const status = project['spi:triStatusCL'] || '';
  
  let risk = 30; // Base risk
  
  // Budget overrun risk
  if (budget > 0 && spent > budget * 0.9) risk += 30;
  
  // Status-based risk
  if (status.toLowerCase().includes('hold')) risk += 40;
  if (status.toLowerCase().includes('risk')) risk += 35;
  
  return Math.min(risk, 100);
};

/**
 * Format timeline string
 */
const formatTimeline = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Determine project priority
 */
const determinePriority = (project) => {
  const budget = parseFloat(project['spi:triBudgetOriginalRollupFR']) || 0;
  const status = project['spi:triStatusCL'] || '';
  
  if (budget > 2000000 || status.toLowerCase().includes('critical')) return 'High';
  if (budget > 1000000) return 'Medium';
  return 'Low';
};

/**
 * Fetch single project details
 */
export const fetchProjectById = async (projectId) => {
  try {
    const projects = await fetchCapitalProjects();
    return projects.find(p => p.id === parseInt(projectId));
  } catch (error) {
    console.error(`❌ Error fetching project ${projectId}:`, error.message);
    throw error;
  }
};

/**
 * Get project statistics
 */
export const getProjectStatistics = (projects) => {
  return {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => 
      p.status.toLowerCase().includes('progress')
    ).length,
    draftProjects: projects.filter(p => 
      p.status.toLowerCase().includes('draft') || 
      p.status.toLowerCase().includes('planning')
    ).length,
    completedProjects: projects.filter(p => 
      p.status.toLowerCase().includes('complete')
    ).length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    avgHealthScore: Math.round(
      projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length
    ),
    highRiskCount: projects.filter(p => p.riskScore >= 60).length
  };
};

// Made with Bob
