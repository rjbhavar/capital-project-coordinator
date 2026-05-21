export const mockAIInsights = {
  1: {
    projectId: 1,
    projectName: "HQ HVAC Modernization",
    executiveSummary: "The HVAC Modernization project is currently 48% complete with moderate risk factors identified. AI analysis indicates potential delays in procurement and vendor coordination. Budget utilization is on track at 48%, but timeline concerns require immediate attention. Recommended actions include expediting vendor approvals and implementing parallel task execution where possible.",
    healthMetrics: {
      overallHealth: 78,
      timelineStatus: "At Risk",
      budgetStatus: "On Track",
      riskLevel: "Medium"
    },
    aiGeneratedTasks: [
      {
        id: 1,
        task: "Expedite HVAC unit procurement from approved vendors",
        priority: "High",
        suggestedOwner: "Procurement Team",
        dueDate: "2026-06-15",
        status: "Pending",
        aiConfidence: 92
      },
      {
        id: 2,
        task: "Schedule coordination meeting with electrical contractors",
        priority: "High",
        suggestedOwner: "Sarah Johnson",
        dueDate: "2026-06-10",
        status: "In Progress",
        aiConfidence: 88
      },
      {
        id: 3,
        task: "Conduct air quality baseline assessment for floors 5-8",
        priority: "Medium",
        suggestedOwner: "Environmental Team",
        dueDate: "2026-06-20",
        status: "Pending",
        aiConfidence: 85
      },
      {
        id: 4,
        task: "Review and approve updated installation timeline",
        priority: "High",
        suggestedOwner: "Project Steering Committee",
        dueDate: "2026-06-08",
        status: "Pending",
        aiConfidence: 90
      },
      {
        id: 5,
        task: "Finalize temporary cooling arrangements for affected areas",
        priority: "Medium",
        suggestedOwner: "Facilities Team",
        dueDate: "2026-06-25",
        status: "Not Started",
        aiConfidence: 78
      }
    ],
    dependencies: [
      {
        id: 1,
        from: "Electrical Infrastructure Upgrade",
        to: "HVAC Unit Installation",
        status: "Blocked",
        impact: "High",
        description: "HVAC installation cannot proceed until electrical capacity is upgraded on floors 3-6"
      },
      {
        id: 2,
        from: "Vendor Contract Approval",
        to: "Equipment Procurement",
        status: "In Progress",
        impact: "Critical",
        description: "Procurement delayed pending final vendor contract signatures"
      },
      {
        id: 3,
        from: "Asbestos Inspection",
        to: "Ductwork Removal",
        status: "Completed",
        impact: "Medium",
        description: "Environmental clearance obtained for ductwork removal"
      },
      {
        id: 4,
        from: "Building Permit Approval",
        to: "Structural Modifications",
        status: "At Risk",
        impact: "High",
        description: "Permit approval delayed by 2 weeks due to documentation issues"
      }
    ],
    risks: [
      {
        id: 1,
        category: "Timeline",
        severity: "High",
        description: "Vendor contract approval delayed by 3 weeks",
        impact: "May push project completion to Q1 2027",
        mitigation: "Engage backup vendors and expedite legal review process",
        probability: 75
      },
      {
        id: 2,
        category: "Resource",
        severity: "Medium",
        description: "Specialized HVAC technicians availability conflict",
        impact: "Installation phase may require extended timeline",
        mitigation: "Pre-book technicians and consider contractor augmentation",
        probability: 60
      },
      {
        id: 3,
        category: "Budget",
        severity: "Medium",
        description: "Material costs increased 8% due to supply chain issues",
        impact: "Potential budget overrun of $200,000",
        mitigation: "Negotiate bulk pricing and explore alternative suppliers",
        probability: 55
      },
      {
        id: 4,
        category: "Compliance",
        severity: "Low",
        description: "Updated building codes require additional documentation",
        impact: "Minor administrative delays",
        mitigation: "Assign dedicated compliance coordinator",
        probability: 30
      }
    ],
    recommendations: [
      {
        id: 1,
        priority: "Critical",
        action: "Escalate vendor contract approval to executive leadership",
        rationale: "3-week delay threatens Q4 completion target",
        expectedImpact: "Reduce approval time by 50%",
        effort: "Low"
      },
      {
        id: 2,
        priority: "High",
        action: "Implement parallel execution for independent work streams",
        rationale: "Maximize resource utilization during vendor delays",
        expectedImpact: "Recover 2 weeks of schedule",
        effort: "Medium"
      },
      {
        id: 3,
        priority: "High",
        action: "Conduct weekly stakeholder alignment meetings",
        rationale: "Improve coordination and early issue detection",
        expectedImpact: "Reduce coordination delays by 30%",
        effort: "Low"
      },
      {
        id: 4,
        priority: "Medium",
        action: "Establish contingency budget reserve of $250,000",
        rationale: "Mitigate material cost inflation risks",
        expectedImpact: "Ensure project completion within approved scope",
        effort: "Low"
      }
    ]
  },
  2: {
    projectId: 2,
    projectName: "Workspace Renovation",
    executiveSummary: "Workspace Renovation project is in early planning phase with strong health indicators. AI analysis shows optimal conditions for project kickoff with minimal risk factors. Budget allocation is appropriate and timeline is realistic. Key focus areas include finalizing design specifications and securing furniture vendors.",
    healthMetrics: {
      overallHealth: 85,
      timelineStatus: "On Track",
      budgetStatus: "On Track",
      riskLevel: "Low"
    },
    aiGeneratedTasks: [
      {
        id: 1,
        task: "Finalize workspace design specifications with architects",
        priority: "High",
        suggestedOwner: "Michael Chen",
        dueDate: "2026-06-30",
        status: "In Progress",
        aiConfidence: 94
      },
      {
        id: 2,
        task: "Conduct employee workspace preference survey",
        priority: "Medium",
        suggestedOwner: "HR Department",
        dueDate: "2026-07-15",
        status: "Pending",
        aiConfidence: 87
      },
      {
        id: 3,
        task: "Evaluate and select furniture vendors",
        priority: "High",
        suggestedOwner: "Procurement Team",
        dueDate: "2026-07-20",
        status: "Not Started",
        aiConfidence: 91
      }
    ],
    dependencies: [
      {
        id: 1,
        from: "Design Approval",
        to: "Furniture Procurement",
        status: "On Track",
        impact: "High",
        description: "Furniture orders depend on finalized design specifications"
      }
    ],
    risks: [
      {
        id: 1,
        category: "Timeline",
        severity: "Low",
        description: "Furniture lead times may extend to 16 weeks",
        impact: "Potential 2-week delay in project completion",
        mitigation: "Order long-lead items early and maintain vendor relationships",
        probability: 40
      }
    ],
    recommendations: [
      {
        id: 1,
        priority: "High",
        action: "Engage employees early in design process",
        rationale: "Increase adoption and satisfaction with new workspace",
        expectedImpact: "Improve employee satisfaction by 25%",
        effort: "Low"
      }
    ]
  }
};

export const mockActivityTimeline = [
  {
    id: 1,
    timestamp: "2026-05-18T08:30:00Z",
    type: "analysis",
    projectId: 1,
    projectName: "HQ HVAC Modernization",
    title: "AI Analysis Completed",
    description: "Comprehensive project analysis identified 4 high-priority risks and generated 5 recommended actions",
    severity: "info",
    aiConfidence: 89
  },
  {
    id: 2,
    timestamp: "2026-05-18T07:15:00Z",
    type: "alert",
    projectId: 1,
    projectName: "HQ HVAC Modernization",
    title: "Vendor Delay Detected",
    description: "AI detected potential 3-week delay in vendor contract approval process",
    severity: "warning",
    aiConfidence: 92
  },
  {
    id: 3,
    timestamp: "2026-05-17T16:45:00Z",
    type: "milestone",
    projectId: 3,
    projectName: "Smart Lighting Upgrade",
    title: "Phase 2 Installation Complete",
    description: "Smart lighting installation completed for Buildings C and D, 86% project completion",
    severity: "success",
    aiConfidence: 95
  },
  {
    id: 4,
    timestamp: "2026-05-17T14:20:00Z",
    type: "recommendation",
    projectId: 4,
    projectName: "Sustainability Retrofit",
    title: "Budget Reallocation Recommended",
    description: "AI recommends reallocating $150K from contingency to accelerate solar panel installation",
    severity: "info",
    aiConfidence: 84
  },
  {
    id: 5,
    timestamp: "2026-05-17T11:00:00Z",
    type: "alert",
    projectId: 4,
    projectName: "Sustainability Retrofit",
    title: "Weather Impact Warning",
    description: "Forecasted severe weather may impact outdoor work schedule next week",
    severity: "warning",
    aiConfidence: 78
  },
  {
    id: 6,
    timestamp: "2026-05-16T09:30:00Z",
    type: "analysis",
    projectId: 2,
    projectName: "Workspace Renovation",
    title: "Planning Phase Analysis Complete",
    description: "AI analysis confirms project readiness with 85% health score and low risk profile",
    severity: "success",
    aiConfidence: 91
  },
  {
    id: 7,
    timestamp: "2026-05-15T15:10:00Z",
    type: "milestone",
    projectId: 6,
    projectName: "Cafeteria Modernization",
    title: "Final Inspection Scheduled",
    description: "Project 91% complete, final inspection scheduled for May 25th",
    severity: "success",
    aiConfidence: 96
  },
  {
    id: 8,
    timestamp: "2026-05-15T10:45:00Z",
    type: "recommendation",
    projectId: 1,
    projectName: "HQ HVAC Modernization",
    title: "Parallel Execution Opportunity",
    description: "AI identified opportunity to execute electrical and ductwork tasks in parallel, saving 2 weeks",
    severity: "info",
    aiConfidence: 87
  }
];

// Made with Bob
