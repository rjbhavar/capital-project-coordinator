# MREF/TRIRIGA Entity Relationships

## Core Business Objects

### 1. Capital Program (triCapitalProgram)
**Purpose**: Strategic portfolio-level grouping of capital projects

**Key Fields**:
- `triNameTX` - Program name
- `triDescriptionTX` - Program description
- `triStatusCL` - Status (Active, Completed, On Hold)
- `triStartDA` - Program start date
- `triEndDA` - Program end date
- `triBudgetOriginalNU` - Original budget allocation
- `triBudgetRevisedNU` - Revised budget after changes
- `triActualCostNU` - Actual costs incurred

**Relationships**:
- **Has Many**: Capital Projects
- **Belongs To**: Organization/Business Unit
- **Associated With**: Funding Sources

**Business Rules**:
- Must have at least one project
- Budget rollup from child projects
- Status derived from project statuses

---

### 2. Capital Project (triCapitalProject / cstCapitalProject)
**Purpose**: Individual capital investment initiative

**Key Fields**:
- `spi:triNameTX` - Project name/title
- `spi:triDescriptionTX` - Project description
- `spi:triStatusCL` - Project status
  - Values: Planning, Approved, In Progress, On Hold, Completed, Cancelled
- `spi:triStartDA` - Planned start date
- `spi:triEndDA` - Planned end date
- `spi:triBudgetOriginalFR` / `spi:triBudgetOriginalRollupFR` - Original budget
- `spi:triBudgetRevisedFR` - Revised budget
- `spi:triActualCostFR` - Actual costs
- `spi:triPercentCompletedNU` - Completion percentage
- `spi:triPriorityNU` - Priority ranking
- `spi:triProjectTypeCL` - Type (New Construction, Renovation, etc.)
- `spi:triRiskLevelCL` - Risk assessment (Low, Medium, High)

**Relationships**:
- **Belongs To**: Capital Program
- **Has Many**: Project Tasks, Cost Records, Documents
- **Associated With**: Buildings, Spaces, Organizations
- **Links To**: Contracts, Purchase Orders, Work Orders

**Business Rules**:
- Must be associated with a capital program
- Status workflow enforced
- Budget cannot be negative
- Actual costs cannot exceed revised budget without approval

---

### 3. Project Task (triProjectTask)
**Purpose**: Granular work items within a capital project

**Key Fields**:
- `triNameTX` - Task name
- `triDescriptionTX` - Task description
- `triStatusCL` - Task status (Not Started, In Progress, Completed)
- `triStartDA` - Task start date
- `triEndDA` - Task end date
- `triDurationNU` - Duration in days
- `triPercentCompletedNU` - Completion percentage
- `triPredecessorTX` - Predecessor task IDs
- `triSuccessorTX` - Successor task IDs
- `triAssignedToID` - Assigned person/team
- `triEstimatedCostNU` - Estimated cost
- `triActualCostNU` - Actual cost

**Relationships**:
- **Belongs To**: Capital Project
- **Has Dependencies**: Other Project Tasks
- **Assigned To**: People, Organizations
- **Associated With**: Cost Records, Time Entries

**Business Rules**:
- Must have valid start/end dates
- Dependencies must not create circular references
- Completion percentage affects project rollup

---

### 4. Building (triBuilding)
**Purpose**: Physical building/facility record

**Key Fields**:
- `triNameTX` - Building name
- `triAddressTX` - Street address
- `triCityTX` - City
- `triStateTX` - State/Province
- `triCountryTX` - Country
- `triGrossAreaNU` - Gross square footage
- `triYearBuiltNU` - Year of construction
- `triStatusCL` - Building status (Active, Inactive, Under Construction)
- `triPropertyTypeCL` - Property type (Office, Warehouse, etc.)

**Relationships**:
- **Has Many**: Spaces, Floors
- **Associated With**: Capital Projects, Leases, Work Orders
- **Belongs To**: Property/Portfolio

**Business Rules**:
- Must have valid address
- Area calculations roll up from spaces
- Status affects availability for projects

---

### 5. Space (triSpace)
**Purpose**: Individual room or area within a building

**Key Fields**:
- `triNameTX` - Space name/number
- `triAreaNU` - Area in square feet
- `triCapacityNU` - Occupancy capacity
- `triSpaceClassCL` - Space classification
- `triSpaceUseCL` - Current use type
- `triStatusCL` - Space status

**Relationships**:
- **Belongs To**: Building, Floor
- **Associated With**: Capital Projects, Work Orders
- **Occupied By**: People, Organizations

---

### 6. Organization (triOrganization)
**Purpose**: Business unit or department

**Key Fields**:
- `triNameTX` - Organization name
- `triCodeTX` - Organization code
- `triTypeCL` - Organization type
- `triStatusCL` - Active/Inactive status
- `triParentID` - Parent organization

**Relationships**:
- **Has Many**: People, Projects, Spaces
- **Hierarchical**: Parent/Child structure
- **Associated With**: Cost Centers, Budgets

---

### 7. People (triPeople)
**Purpose**: Individual person record

**Key Fields**:
- `triFirstNameTX` - First name
- `triLastNameTX` - Last name
- `triEmailTX` - Email address
- `triPhoneTX` - Phone number
- `triStatusCL` - Active/Inactive status
- `triRoleCL` - Role/Job title

**Relationships**:
- **Belongs To**: Organization
- **Assigned To**: Projects, Tasks, Spaces
- **Has**: Permissions, Responsibilities

---

### 8. Contract (triContract)
**Purpose**: Legal agreement for services or procurement

**Key Fields**:
- `triNameTX` - Contract name
- `triContractNumberTX` - Contract number
- `triVendorTX` - Vendor/contractor name
- `triStartDA` - Contract start date
- `triEndDA` - Contract end date
- `triAmountNU` - Contract value
- `triStatusCL` - Contract status

**Relationships**:
- **Associated With**: Capital Projects, Purchase Orders
- **Belongs To**: Vendor/Supplier
- **Has**: Payment Terms, Deliverables

---

### 9. Cost Record (triCostRecord)
**Purpose**: Financial transaction tracking

**Key Fields**:
- `triCostTypeCL` - Cost type (Labor, Material, Equipment)
- `triAmountNU` - Cost amount
- `triDateDA` - Transaction date
- `triDescriptionTX` - Cost description
- `triCostCodeTX` - Cost code/category
- `triInvoiceNumberTX` - Invoice reference

**Relationships**:
- **Belongs To**: Capital Project, Task
- **Associated With**: Purchase Orders, Invoices
- **Categorized By**: Cost Codes, GL Accounts

---

### 10. Document (triDocument)
**Purpose**: File and document management

**Key Fields**:
- `triNameTX` - Document name
- `triTypeCL` - Document type (Drawing, Specification, Contract, etc.)
- `triVersionTX` - Version number
- `triDateDA` - Document date
- `triStatusCL` - Document status (Draft, Approved, Obsolete)
- `triFilePathTX` - File location

**Relationships**:
- **Associated With**: Projects, Buildings, Contracts
- **Has**: Versions, Approvals
- **Categorized By**: Document Types

---

## Entity Relationship Diagram (Conceptual)

```
Capital Program
    ├── Capital Project (1:N)
    │   ├── Project Tasks (1:N)
    │   │   ├── Cost Records (1:N)
    │   │   └── Time Entries (1:N)
    │   ├── Cost Records (1:N)
    │   ├── Documents (N:N)
    │   ├── Contracts (N:N)
    │   └── Buildings/Spaces (N:N)
    │
    ├── Funding Sources (N:N)
    └── Organizations (N:N)

Building
    ├── Floors (1:N)
    │   └── Spaces (1:N)
    ├── Capital Projects (N:N)
    └── Work Orders (1:N)

Organization
    ├── People (1:N)
    ├── Capital Projects (1:N)
    └── Spaces (1:N)

Contract
    ├── Capital Projects (N:N)
    ├── Purchase Orders (1:N)
    └── Vendors (N:1)
```

---

## Key Hierarchies

### Geographic Hierarchy
```
Property → Building → Floor → Space
```

### Organizational Hierarchy
```
Enterprise → Business Unit → Department → Team
```

### Project Hierarchy
```
Capital Program → Capital Project → Project Task → Subtask
```

### Financial Hierarchy
```
Budget → Cost Center → Cost Code → Transaction
```

---

## Common Query Patterns

### Get All Projects in a Program
```
Filter: triCapitalProgramID = {programId}
Include: Project details, status, budget
```

### Get Project with Building Association
```
Filter: triCapitalProjectID = {projectId}
Include: Associated buildings, spaces
```

### Get Project Tasks with Dependencies
```
Filter: triProjectID = {projectId}
Include: Predecessor/successor relationships
```

### Get Project Costs by Category
```
Filter: triProjectID = {projectId}
Group By: triCostTypeCL
Sum: triAmountNU
```

---

## Data Validation Rules

### Required Fields
- All entities: `triNameTX`, `triStatusCL`
- Projects: `triStartDA`, `triEndDA`, `triBudgetOriginalFR`
- Tasks: `triProjectID`, `triStartDA`, `triEndDA`

### Field Constraints
- Dates: End date must be >= Start date
- Numbers: Budget/cost fields must be >= 0
- Status: Must be valid classification value
- Percentages: Must be 0-100

### Business Logic
- Project status cannot be "Completed" if tasks are incomplete
- Actual costs cannot exceed revised budget without approval
- Task dependencies must not create circular references
- Budget rollups must match sum of child records

---

## Integration Considerations

### OSLC API Access
- All entities accessible via OSLC REST API
- Standard CRUD operations supported
- Query using OSLC query syntax
- Pagination for large result sets

### Field Naming Conventions
- `TX` suffix = Text field
- `NU` suffix = Number field
- `DA` suffix = Date field
- `CL` suffix = Classification (dropdown)
- `BO` suffix = Boolean field
- `ID` suffix = Reference/Foreign key

### Namespace Prefixes
- `spi:` = Standard Property Interface
- `tri:` = TRIRIGA namespace
- `cst:` = Custom namespace
- `oslc:` = OSLC standard properties

---

## References
- IBM TRIRIGA Data Model Documentation
- OSLC Resource Shape Definitions
- MREF API Integration Guide