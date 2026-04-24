# Requirements Document: Analytics Display Improvement

## 1. Functional Requirements

### 1.1 Backend Data Enrichment

**Priority:** High  
**Description:** The system shall enrich download events with user and asset information using MongoDB aggregation pipeline.

**Acceptance Criteria:**
- Download events are joined with users collection on userId field
- Download events are joined with assets collection on assetId field
- Enriched events include username field from users collection
- Enriched events include assetCategory field from assets collection
- Anonymous users (no userId) are handled gracefully with null username
- Missing users or assets are handled gracefully with null fields

### 1.2 New API Endpoint

**Priority:** High  
**Description:** The system shall provide a new API endpoint to retrieve enriched audit log data.

**Acceptance Criteria:**
- Endpoint path is GET /api/analytics/audit-log
- Endpoint requires authentication (JWT token)
- Endpoint requires admin role authorization
- Endpoint accepts optional query parameter `limit` (default: 100, max: 1000)
- Endpoint returns JSON array of EnrichedDownloadEvent objects
- Response is sorted by timestamp in descending order (newest first)

### 1.3 User Display

**Priority:** High  
**Description:** The analytics dashboard shall display human-readable user information instead of session IDs.

**Acceptance Criteria:**
- For authenticated users: display username from users collection
- For anonymous users: display "Anonymous" text
- Session IDs are no longer displayed in the user column
- User column header is labeled "User" (not "User/Session")

### 1.4 Asset Display

**Priority:** High  
**Description:** The analytics dashboard shall display human-readable asset information instead of asset IDs.

**Acceptance Criteria:**
- Display asset name and category in format: "AssetName (Category)"
- If category is not available, display only asset name
- Asset IDs are no longer displayed in the asset column
- Asset column header is labeled "Asset Details" (not "Details")

### 1.5 Audit Log Table

**Priority:** High  
**Description:** The analytics dashboard shall display an audit log table with enriched download events.

**Acceptance Criteria:**
- Table has columns: Timestamp, User, Asset Details, IP Address
- Table displays up to 100 most recent download events by default
- Timestamp is formatted in human-readable format (locale-specific)
- IP Address displays "N/A" if not available
- Table is responsive and accessible

### 1.6 Data Model Extension

**Priority:** High  
**Description:** The system shall define a new data model for enriched download events.

**Acceptance Criteria:**
- New TypeScript interface EnrichedDownloadEvent is defined
- Interface includes all fields from DownloadEvent
- Interface adds username field (optional string)
- Interface adds assetCategory field (optional string)
- Interface is shared between backend and frontend (or duplicated with same structure)

## 2. Non-Functional Requirements

### 2.1 Performance

**Priority:** High  
**Description:** The audit log endpoint shall respond within acceptable time limits.

**Acceptance Criteria:**
- MongoDB aggregation query completes in < 100ms for 100 events
- API endpoint responds in < 200ms (95th percentile)
- Frontend renders table in < 50ms for 100 rows
- Proper indexes exist on userId, assetId, and timestamp fields

### 2.2 Security

**Priority:** High  
**Description:** The audit log endpoint shall enforce proper authentication and authorization.

**Acceptance Criteria:**
- Endpoint returns 401 Unauthorized for unauthenticated requests
- Endpoint returns 403 Forbidden for non-admin users
- JWT token is validated on every request
- Input validation prevents injection attacks
- Limit parameter is validated (positive integer, max 1000)

### 2.3 Scalability

**Priority:** Medium  
**Description:** The audit log feature shall handle growing data volumes efficiently.

**Acceptance Criteria:**
- Aggregation pipeline uses indexed fields for lookups
- Default limit prevents excessive data transfer
- Query performance does not degrade significantly with data growth
- Consider pagination for future enhancement

### 2.4 Maintainability

**Priority:** Medium  
**Description:** The code shall be well-structured and testable.

**Acceptance Criteria:**
- Repository, service, and controller layers are properly separated
- TypeScript interfaces are defined for all data models
- Code follows existing project conventions and style
- Unit tests cover all new methods
- Integration tests verify end-to-end functionality

### 2.5 Usability

**Priority:** Medium  
**Description:** The audit log table shall be easy to read and understand.

**Acceptance Criteria:**
- Column headers are clear and descriptive
- Timestamps are formatted in user's locale
- "Anonymous" label is intuitive for non-authenticated users
- Asset details format is consistent and readable
- Table has proper spacing and visual hierarchy

## 3. Data Requirements

### 3.1 EnrichedDownloadEvent Model

**Description:** New data model for enriched download events.

**Fields:**
- `id`: string (required) - Unique identifier for the download event
- `assetId`: string (required) - Asset identifier
- `assetName`: string (required) - Asset name
- `assetCategory`: string (optional) - Asset category from assets collection
- `userId`: string (optional) - User identifier (null for anonymous)
- `username`: string (optional) - Username from users collection
- `sessionId`: string (required) - Session identifier
- `timestamp`: Date (required) - Event timestamp
- `ipAddress`: string (optional) - IP address of the requester

### 3.2 Database Collections

**Description:** Existing collections used for data enrichment.

**Collections:**
- `download_events`: Contains download event records
- `users`: Contains user records with username field
- `assets`: Contains asset records with category field

### 3.3 Indexes

**Description:** Database indexes required for optimal performance.

**Required Indexes:**
- `download_events.timestamp`: Descending index for sorting
- `download_events.userId`: Index for user lookup
- `download_events.assetId`: Index for asset lookup
- `users._id`: Default index (already exists)
- `assets._id`: Default index (already exists)

## 4. Interface Requirements

### 4.1 API Endpoint Specification

**Endpoint:** GET /api/analytics/audit-log

**Request:**
- Method: GET
- Headers:
  - `Authorization`: Bearer {JWT_TOKEN} (required)
- Query Parameters:
  - `limit`: number (optional, default: 100, max: 1000)

**Response (Success - 200 OK):**
```json
[
  {
    "id": "uuid-string",
    "assetId": "asset-id-string",
    "assetName": "Logo.png",
    "assetCategory": "Images",
    "userId": "user-id-string",
    "username": "admin",
    "sessionId": "session-id-string",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "ipAddress": "192.168.1.100"
  },
  {
    "id": "uuid-string-2",
    "assetId": "asset-id-string-2",
    "assetName": "Brand Video.mp4",
    "assetCategory": "Videos",
    "userId": null,
    "username": null,
    "sessionId": "session-id-string-2",
    "timestamp": "2024-01-15T10:25:00.000Z",
    "ipAddress": "192.168.1.101"
  }
]
```

**Response (Error - 401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**Response (Error - 403 Forbidden):**
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**Response (Error - 500 Internal Server Error):**
```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch audit log"
}
```

### 4.2 Frontend Component Interface

**Component:** AnalyticsDashboard

**New State:**
- `auditLog`: EnrichedDownloadEvent[] - Array of enriched download events
- `auditLogLoading`: boolean - Loading state for audit log fetch
- `auditLogError`: string | null - Error message for audit log fetch

**New Methods:**
- `fetchAuditLog()`: Promise<void> - Fetch enriched audit log from API

**UI Elements:**
- Audit log section with heading "Download Audit Log"
- Table with columns: Timestamp, User, Asset Details, IP Address
- Loading spinner during data fetch
- Error message display on fetch failure
- Empty state message when no data available

## 5. Testing Requirements

### 5.1 Unit Tests

**Backend:**
- Test AnalyticsRepository.getEnrichedDownloadEvents() with various scenarios
- Test AnalyticsService.getAuditLog() delegation
- Test AnalyticsController.getAuditLog() endpoint handler
- Test error handling for database failures
- Test limit parameter validation

**Frontend:**
- Test AnalyticsDashboard.fetchAuditLog() API call
- Test user display logic (username vs "Anonymous")
- Test asset display logic (with and without category)
- Test timestamp formatting
- Test loading and error states

### 5.2 Integration Tests

**Backend:**
- Test end-to-end API call with seeded database
- Verify enriched data includes username and assetCategory
- Verify anonymous users have null username
- Verify timestamp ordering
- Verify limit parameter works correctly

**Frontend:**
- Test AnalyticsDashboard component with mocked API
- Verify table renders with enriched data
- Verify "Anonymous" text appears for null usernames
- Verify asset details format correctly

### 5.3 Property-Based Tests

**Properties to Test:**
- User display invariant: username or "Anonymous"
- Asset display invariant: name with category or name only
- Timestamp ordering: descending order
- Data completeness: required fields are never null

## 6. Deployment Requirements

### 6.1 Database Migration

**Priority:** High  
**Description:** Ensure database indexes are created for optimal performance.

**Tasks:**
- Create index on download_events.timestamp (descending)
- Create index on download_events.userId
- Create index on download_events.assetId
- Verify indexes are created successfully

### 6.2 API Route Registration

**Priority:** High  
**Description:** Register new API endpoint in the routing configuration.

**Tasks:**
- Add GET /api/analytics/audit-log route
- Apply authentication middleware
- Apply admin authorization middleware
- Test endpoint accessibility

### 6.3 Frontend Deployment

**Priority:** High  
**Description:** Deploy updated AnalyticsDashboard component.

**Tasks:**
- Build frontend with new component changes
- Deploy to production environment
- Verify audit log table displays correctly
- Test with real data

## 7. Documentation Requirements

### 7.1 API Documentation

**Priority:** Medium  
**Description:** Document the new audit log endpoint.

**Content:**
- Endpoint path and method
- Authentication requirements
- Query parameters
- Response format
- Error responses
- Example requests and responses

### 7.2 Code Documentation

**Priority:** Medium  
**Description:** Add inline documentation for new code.

**Content:**
- JSDoc comments for new methods
- TypeScript interface documentation
- Aggregation pipeline explanation
- Complex logic comments

### 7.3 User Documentation

**Priority:** Low  
**Description:** Update user guide for analytics dashboard.

**Content:**
- Explain audit log table columns
- Describe "Anonymous" user label
- Explain asset details format
- Provide screenshots of new UI

## 8. Constraints and Assumptions

### 8.1 Constraints

- Must use existing MongoDB database
- Must maintain backward compatibility with existing analytics features
- Must not modify existing DownloadEvent model (enrichment at query time only)
- Must use existing authentication and authorization middleware

### 8.2 Assumptions

- Users collection has username field
- Assets collection has category field
- Download events have userId field (optional)
- Download events have assetId field (required)
- MongoDB version supports aggregation pipeline with $lookup
- Frontend uses React 18+ with TypeScript
- Backend uses Express with TypeScript

## 9. Success Metrics

### 9.1 Functional Success

- Audit log displays usernames instead of session IDs
- Audit log displays asset names and categories instead of asset IDs
- Anonymous users are clearly labeled
- All download events are enriched correctly

### 9.2 Performance Success

- API response time < 200ms (95th percentile)
- Frontend render time < 50ms for 100 rows
- No performance degradation on existing analytics features

### 9.3 User Satisfaction

- Admin users can easily understand audit log data
- No confusion about "Anonymous" label
- Asset details are clear and informative
- Table is easy to read and navigate
