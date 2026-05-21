# OSLC API Mapping for MREF/TRIRIGA

## OSLC Overview

**OSLC** (Open Services for Lifecycle Collaboration) is a standard REST API protocol used by IBM TRIRIGA/MREF for data integration.

### Key Concepts
- **Resource**: A business object (e.g., Capital Project)
- **Resource Shape**: Schema definition for a resource type
- **Service Provider**: API endpoint collection
- **Query Capability**: Search and filter interface

---

## Authentication

### Session-Based Authentication
```http
POST /p/websignon/signon
Content-Type: application/x-www-form-urlencoded

username={username}&password={password}
```

**Response**: Sets `JSESSIONID` cookie for subsequent requests

**Session Management**:
- Cookie-based authentication
- Session timeout: Typically 30-60 minutes
- Must include cookie in all subsequent requests
- Re-authenticate on 401 Unauthorized

---

## Capital Project API Endpoints

### Base URL Structure
```
https://{server}/oslc/so/{resourceType}
```

### Capital Project Resource
**Endpoint**: `/oslc/so/cstCapitalProjectRS`

**HTTP Methods**:
- `GET` - Retrieve projects (list or single)
- `POST` - Create new project
- `PUT` - Update existing project
- `DELETE` - Delete project

---

## Query Syntax

### Basic Query
```http
GET /oslc/so/cstCapitalProjectRS
```

**Returns**: All capital projects (paginated)

### Filtered Query
```http
GET /oslc/so/cstCapitalProjectRS?oslc.where=spi:triStatusCL="Active"
```

**OSLC Query Parameters**:
- `oslc.where` - Filter condition
- `oslc.select` - Field selection
- `oslc.orderBy` - Sorting
- `oslc.pageSize` - Results per page
- `oslc.prefix` - Namespace definitions

### Query Examples

#### Get Active Projects
```
oslc.where=spi:triStatusCL="Active"
```

#### Get Projects by Budget Range
```
oslc.where=spi:triBudgetOriginalRollupFR>1000000 and spi:triBudgetOriginalRollupFR<5000000
```

#### Get Projects by Date Range
```
oslc.where=spi:triStartDA>="2024-01-01" and spi:triStartDA<="2024-12-31"
```

#### Select Specific Fields
```
oslc.select=spi:triNameTX,spi:triStatusCL,spi:triBudgetOriginalRollupFR
```

#### Sort Results
```
oslc.orderBy=+spi:triStartDA
```
(+ for ascending, - for descending)

#### Pagination
```
oslc.pageSize=50
```

---

## Response Format

### Standard OSLC Response Structure
```json
{
  "@context": "...",
  "@type": "oslc:ResponseInfo",
  "oslc:totalCount": 100,
  "oslc:nextPage": "...",
  "rdfs:member": [
    {
      "@id": "https://server/oslc/so/cstCapitalProjectRS/12345",
      "@type": "spi:cstCapitalProject",
      "spi:triNameTX": "HQ HVAC Modernization",
      "spi:triStatusCL": "Active",
      "spi:triBudgetOriginalRollupFR": 2500000.00,
      "spi:triStartDA": "2024-03-01",
      "spi:triEndDA": "2024-12-31",
      "spi:triPercentCompletedNU": 45.5,
      "spi:triDescriptionTX": "Complete HVAC system replacement",
      "spi:triPriorityNU": 1,
      "spi:triRiskLevelCL": "Medium"
    }
  ]
}
```

### Key Response Elements
- `rdfs:member` - Array of resource objects
- `oslc:totalCount` - Total number of matching records
- `oslc:nextPage` - URL for next page of results
- `@id` - Unique resource identifier (URL)
- `@type` - Resource type

---

## Field Mappings

### Capital Project Fields

| OSLC Field | Type | Description | Example |
|------------|------|-------------|---------|
| `spi:triNameTX` | String | Project name | "HQ HVAC Modernization" |
| `spi:triDescriptionTX` | String | Project description | "Complete HVAC replacement" |
| `spi:triStatusCL` | Classification | Project status | "Active", "Completed" |
| `spi:triStartDA` | Date | Start date | "2024-03-01" |
| `spi:triEndDA` | Date | End date | "2024-12-31" |
| `spi:triBudgetOriginalFR` | Float | Original budget | 2500000.00 |
| `spi:triBudgetOriginalRollupFR` | Float | Original budget (rollup) | 2500000.00 |
| `spi:triBudgetRevisedFR` | Float | Revised budget | 2750000.00 |
| `spi:triActualCostFR` | Float | Actual costs | 1125000.00 |
| `spi:triPercentCompletedNU` | Number | Completion % | 45.5 |
| `spi:triPriorityNU` | Number | Priority ranking | 1 |
| `spi:triRiskLevelCL` | Classification | Risk level | "Low", "Medium", "High" |
| `spi:triProjectTypeCL` | Classification | Project type | "Renovation", "New Construction" |
| `spi:triProjectManagerTX` | String | Project manager name | "John Smith" |
| `spi:triLocationTX` | String | Location/Building | "Building A" |

### Status Values
- `Planning` - Initial planning phase
- `Approved` - Approved for execution
- `Active` / `In Progress` - Currently executing
- `On Hold` - Temporarily paused
- `Completed` - Successfully finished
- `Cancelled` - Terminated before completion

### Risk Level Values
- `Low` - Minimal risk
- `Medium` - Moderate risk
- `High` - Significant risk
- `Critical` - Severe risk

### Project Type Values
- `New Construction` - Ground-up development
- `Renovation` - Building improvements
- `Modernization` - System upgrades
- `Expansion` - Facility additions
- `Sustainability` - Green initiatives
- `Compliance` - Regulatory requirements

---

## Related Resource Endpoints

### Capital Programs
```
GET /oslc/so/triCapitalProgramRS
```

### Project Tasks
```
GET /oslc/so/triProjectTaskRS?oslc.where=triProjectID="{projectId}"
```

### Buildings
```
GET /oslc/so/triBuildingRS
```

### Organizations
```
GET /oslc/so/triOrganizationRS
```

### People
```
GET /oslc/so/triPeopleRS
```

### Cost Records
```
GET /oslc/so/triCostRecordRS?oslc.where=triProjectID="{projectId}"
```

---

## Creating a Capital Project

### POST Request
```http
POST /oslc/so/cstCapitalProjectRS
Content-Type: application/json

{
  "spi:triNameTX": "New Project Name",
  "spi:triDescriptionTX": "Project description",
  "spi:triStatusCL": "Planning",
  "spi:triStartDA": "2024-06-01",
  "spi:triEndDA": "2024-12-31",
  "spi:triBudgetOriginalFR": 1000000.00,
  "spi:triPriorityNU": 2,
  "spi:triRiskLevelCL": "Medium"
}
```

**Response**: 201 Created with resource URL

---

## Updating a Capital Project

### PUT Request
```http
PUT /oslc/so/cstCapitalProjectRS/{projectId}
Content-Type: application/json

{
  "spi:triStatusCL": "Active",
  "spi:triPercentCompletedNU": 25.0,
  "spi:triActualCostFR": 250000.00
}
```

**Response**: 200 OK with updated resource

---

## Error Handling

### Common HTTP Status Codes
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request syntax
- `401 Unauthorized` - Authentication required/failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server-side error

### Error Response Format
```json
{
  "oslc:statusCode": "400",
  "oslc:message": "Invalid field value",
  "oslc:extendedError": {
    "oslc:moreInfo": "Field 'spi:triStatusCL' contains invalid value"
  }
}
```

---

## Best Practices

### Performance Optimization
1. **Use Field Selection**: Only request needed fields
   ```
   oslc.select=spi:triNameTX,spi:triStatusCL
   ```

2. **Implement Pagination**: Limit result set size
   ```
   oslc.pageSize=50
   ```

3. **Filter Server-Side**: Use `oslc.where` instead of client filtering

4. **Cache Session**: Reuse JSESSIONID across requests

### Error Handling
1. **Retry on 401**: Re-authenticate and retry request
2. **Handle 404**: Check if resource was deleted
3. **Log Errors**: Capture error details for debugging
4. **Timeout Handling**: Set reasonable request timeouts

### Security
1. **HTTPS Only**: Always use encrypted connections
2. **Secure Credentials**: Store credentials securely (environment variables)
3. **Session Management**: Clear sessions on logout
4. **Input Validation**: Validate data before sending to API

---

## Integration Patterns

### Polling Pattern
```javascript
// Check for project updates every 5 minutes
setInterval(async () => {
  const projects = await fetchCapitalProjects();
  updateDashboard(projects);
}, 300000);
```

### Webhook Pattern
```javascript
// Register webhook for project status changes
POST /oslc/webhooks
{
  "resource": "cstCapitalProjectRS",
  "event": "update",
  "filter": "spi:triStatusCL changed",
  "callbackUrl": "https://myapp.com/webhook"
}
```

### Batch Processing
```javascript
// Process multiple projects in batch
const projectIds = ['123', '456', '789'];
const projects = await Promise.all(
  projectIds.map(id => fetchProject(id))
);
```

---

## Sample Integration Code

### Fetch Capital Projects
```javascript
async function fetchCapitalProjects() {
  const response = await axios.get('/api/oslc/so/cstCapitalProjectRS', {
    params: {
      'oslc.where': 'spi:triStatusCL="Active"',
      'oslc.select': 'spi:triNameTX,spi:triStatusCL,spi:triBudgetOriginalRollupFR',
      'oslc.pageSize': 100
    },
    withCredentials: true
  });
  
  return response.data['rdfs:member'];
}
```

### Create Capital Project
```javascript
async function createCapitalProject(projectData) {
  const response = await axios.post('/api/oslc/so/cstCapitalProjectRS', {
    'spi:triNameTX': projectData.name,
    'spi:triDescriptionTX': projectData.description,
    'spi:triStatusCL': 'Planning',
    'spi:triBudgetOriginalFR': projectData.budget
  }, {
    withCredentials: true
  });
  
  return response.data;
}
```

### Update Project Status
```javascript
async function updateProjectStatus(projectId, status, percentComplete) {
  const response = await axios.put(
    `/api/oslc/so/cstCapitalProjectRS/${projectId}`,
    {
      'spi:triStatusCL': status,
      'spi:triPercentCompletedNU': percentComplete
    },
    { withCredentials: true }
  );
  
  return response.data;
}
```

---

## References
- OSLC Core Specification: https://open-services.net/
- IBM TRIRIGA OSLC API Documentation
- MREF Integration Guide