# Tasks: Analytics Display Improvement

## Phase 1: Backend Data Model and Repository

### 1.1 Define EnrichedDownloadEvent Interface
- [x] 1.1.1 Create EnrichedDownloadEvent interface in backend/src/models/analytics.ts
- [x] 1.1.2 Add fields: id, assetId, assetName, assetCategory, userId, username, sessionId, timestamp, ipAddress
- [x] 1.1.3 Mark optional fields: assetCategory, userId, username, ipAddress

### 1.2 Implement getEnrichedDownloadEvents Method
- [x] 1.2.1 Add getEnrichedDownloadEvents method to AnalyticsRepository class
- [x] 1.2.2 Implement MongoDB aggregation pipeline with $addFields for ObjectId conversion
- [x] 1.2.3 Add $lookup stage for users collection
- [ ] 1.2.4 Add $lookup stage for assets collection
- [x] 1.2.5 Add $unwind stages with preserveNullAndEmptyArrays for both lookups
- [x] 1.2.6 Add $project stage to shape final output
- [x] 1.2.7 Add $sort stage for timestamp descending
- [x] 1.2.8 Add $limit stage with configurable limit parameter
- [x] 1.2.9 Return typed array of EnrichedDownloadEvent

### 1.3 Create Database Indexes
- [x] 1.3.1 Add index creation for download_events.timestamp (descending)
- [x] 1.3.2 Add index creation for download_events.userId
- [x] 1.3.3 Add index creation for download_events.assetId
- [x] 1.3.4 Update createIndexes method in AnalyticsRepository

## Phase 2: Backend Service and Controller

### 2.1 Implement Service Method
- [x] 2.1.1 Add getAuditLog method to AnalyticsService class
- [x] 2.1.2 Accept optional limit parameter (default: 100)
- [x] 2.1.3 Delegate to repository.getEnrichedDownloadEvents
- [x] 2.1.4 Return EnrichedDownloadEvent array

### 2.2 Implement Controller Endpoint
- [x] 2.2.1 Add getAuditLog method to AnalyticsController class
- [x] 2.2.2 Extract limit query parameter from request
- [x] 2.2.3 Validate limit parameter (positive integer, max 1000)
- [x] 2.2.4 Call analyticsService.getAuditLog with limit
- [x] 2.2.5 Return JSON response with 200 status
- [x] 2.2.6 Handle errors with next(error)

### 2.3 Register API Route
- [x] 2.3.1 Add GET /api/analytics/audit-log route in backend/src/routes
- [x] 2.3.2 Apply authentication middleware
- [x] 2.3.3 Apply admin authorization middleware
- [x] 2.3.4 Connect route to analyticsController.getAuditLog

## Phase 3: Frontend Data Model and API Integration

### 3.1 Define Frontend Interface
- [x] 3.1.1 Add EnrichedDownloadEvent interface to frontend/src/types or frontend/src/pages/AnalyticsDashboard.tsx
- [x] 3.1.2 Match backend interface structure
- [x] 3.1.3 Use TypeScript types for all fields

### 3.2 Add State Management
- [x] 3.2.1 Add auditLog state: useState<EnrichedDownloadEvent[]>([])
- [x] 3.2.2 Add auditLogLoading state: useState<boolean>(false)
- [x] 3.2.3 Add auditLogError state: useState<string | null>(null)

### 3.3 Implement API Fetch Method
- [x] 3.3.1 Create fetchAuditLog async function
- [x] 3.3.2 Set loading state to true
- [x] 3.3.3 Fetch from /api/analytics/audit-log with auth token
- [x] 3.3.4 Parse JSON response
- [x] 3.3.5 Update auditLog state with response data
- [x] 3.3.6 Handle errors and update error state
- [x] 3.3.7 Set loading state to false in finally block

### 3.4 Call Fetch on Component Mount
- [x] 3.4.1 Add useEffect hook to call fetchAuditLog on mount
- [x] 3.4.2 Ensure authentication and admin role checks pass first

## Phase 4: Frontend UI Implementation

### 4.1 Create Audit Log Section
- [x] 4.1.1 Add new section below top downloads with heading "Download Audit Log"
- [x] 4.1.2 Add conditional rendering for loading state
- [x] 4.1.3 Add conditional rendering for error state
- [x] 4.1.4 Add conditional rendering for empty state

### 4.2 Implement Audit Log Table
- [x] 4.2.1 Create table element with className "audit-log-table"
- [x] 4.2.2 Add thead with columns: Timestamp, User, Asset Details, IP Address
- [x] 4.2.3 Add tbody with map over auditLog array
- [x] 4.2.4 Render table rows with key={event.id}

### 4.3 Implement User Display Logic
- [x] 4.3.1 Check if event.username exists and is not null
- [x] 4.3.2 Display event.username if available
- [x] 4.3.3 Display "Anonymous" if username is null or undefined

### 4.4 Implement Asset Display Logic
- [x] 4.4.1 Check if event.assetCategory exists and is not null
- [x] 4.4.2 Display "{assetName} ({assetCategory})" if category available
- [x] 4.4.3 Display only assetName if category is null or undefined

### 4.5 Implement Timestamp Formatting
- [x] 4.5.1 Convert event.timestamp to Date object
- [x] 4.5.2 Format using toLocaleString() for user's locale
- [x] 4.5.3 Display formatted timestamp in table cell

### 4.6 Implement IP Address Display
- [x] 4.6.1 Check if event.ipAddress exists
- [x] 4.6.2 Display event.ipAddress if available
- [x] 4.6.3 Display "N/A" if ipAddress is null or undefined

## Phase 5: Styling

### 5.1 Add Audit Log Table Styles
- [x] 5.1.1 Create or update frontend/src/styles/AnalyticsDashboard.css
- [x] 5.1.2 Add styles for .audit-log-section
- [x] 5.1.3 Add styles for .audit-log-table
- [x] 5.1.4 Add styles for table headers (thead th)
- [x] 5.1.5 Add styles for table rows (tbody tr)
- [x] 5.1.6 Add styles for table cells (tbody td)
- [x] 5.1.7 Add hover effects for table rows
- [x] 5.1.8 Ensure responsive design for mobile devices

### 5.2 Add Loading and Error Styles
- [x] 5.2.1 Add styles for loading spinner in audit log section
- [x] 5.2.2 Add styles for error message display
- [x] 5.2.3 Add styles for empty state message

## Phase 6: Testing

### 6.1 Backend Unit Tests
- [ ] 6.1.1 Test AnalyticsRepository.getEnrichedDownloadEvents with valid data
- [ ] 6.1.2 Test with anonymous users (null userId)
- [ ] 6.1.3 Test with missing users (userId doesn't exist)
- [ ] 6.1.4 Test with missing assets (assetId doesn't exist)
- [ ] 6.1.5 Test limit parameter functionality
- [ ] 6.1.6 Test timestamp ordering (descending)
- [ ] 6.1.7 Test AnalyticsService.getAuditLog delegation
- [ ] 6.1.8 Test AnalyticsController.getAuditLog endpoint handler
- [ ] 6.1.9 Test error handling for database failures

### 6.2 Frontend Unit Tests
- [ ] 6.2.1 Test AnalyticsDashboard.fetchAuditLog API call
- [ ] 6.2.2 Test user display logic (username vs "Anonymous")
- [ ] 6.2.3 Test asset display logic (with and without category)
- [ ] 6.2.4 Test timestamp formatting
- [ ] 6.2.5 Test loading state rendering
- [ ] 6.2.6 Test error state rendering
- [ ] 6.2.7 Test empty state rendering

### 6.3 Integration Tests
- [ ] 6.3.1 Seed test database with download events, users, and assets
- [ ] 6.3.2 Test GET /api/analytics/audit-log endpoint
- [ ] 6.3.3 Verify response contains enriched data
- [ ] 6.3.4 Verify username and assetCategory are populated
- [ ] 6.3.5 Verify anonymous users have null username
- [ ] 6.3.6 Verify timestamp ordering
- [ ] 6.3.7 Test authentication requirement (401 for unauthenticated)
- [ ] 6.3.8 Test authorization requirement (403 for non-admin)

### 6.4 Property-Based Tests (Optional)
- [ ] 6.4.1 Write property test for user display invariant
- [ ] 6.4.2 Write property test for asset display invariant
- [ ] 6.4.3 Write property test for timestamp ordering
- [ ] 6.4.4 Write property test for data completeness

## Phase 7: Documentation and Deployment

### 7.1 Code Documentation
- [x] 7.1.1 Add JSDoc comments to getEnrichedDownloadEvents method
- [x] 7.1.2 Add JSDoc comments to getAuditLog methods (service and controller)
- [x] 7.1.3 Add comments explaining aggregation pipeline stages
- [x] 7.1.4 Document EnrichedDownloadEvent interface

### 7.2 API Documentation
- [x] 7.2.1 Document GET /api/analytics/audit-log endpoint
- [x] 7.2.2 Document authentication requirements
- [x] 7.2.3 Document query parameters (limit)
- [x] 7.2.4 Document response format
- [x] 7.2.5 Document error responses
- [x] 7.2.6 Add example requests and responses

### 7.3 Manual Testing
- [ ] 7.3.1 Start backend and frontend servers
- [ ] 7.3.2 Log in as admin user
- [ ] 7.3.3 Navigate to analytics dashboard
- [ ] 7.3.4 Verify audit log table displays
- [ ] 7.3.5 Verify usernames display correctly
- [ ] 7.3.6 Verify "Anonymous" displays for anonymous users
- [ ] 7.3.7 Verify asset details display correctly
- [ ] 7.3.8 Verify timestamp formatting
- [ ] 7.3.9 Verify IP addresses display correctly
- [ ] 7.3.10 Test with different data scenarios

### 7.4 Performance Testing
- [ ] 7.4.1 Test API response time with 100 events
- [ ] 7.4.2 Test API response time with 1000 events
- [ ] 7.4.3 Verify database indexes are being used
- [ ] 7.4.4 Test frontend render time with 100 rows
- [ ] 7.4.5 Verify no performance degradation on existing features

### 7.5 Deployment
- [ ] 7.5.1 Build backend with new changes
- [ ] 7.5.2 Build frontend with new changes
- [ ] 7.5.3 Deploy to staging environment
- [ ] 7.5.4 Run smoke tests on staging
- [ ] 7.5.5 Deploy to production environment
- [ ] 7.5.6 Verify production deployment
- [ ] 7.5.7 Monitor for errors or performance issues

## Phase 8: Cleanup and Finalization

### 8.1 Code Review
- [ ] 8.1.1 Review all new code for quality and consistency
- [ ] 8.1.2 Ensure TypeScript types are correct
- [ ] 8.1.3 Ensure error handling is comprehensive
- [ ] 8.1.4 Ensure code follows project conventions

### 8.2 Final Testing
- [ ] 8.2.1 Run full test suite (backend and frontend)
- [ ] 8.2.2 Verify all tests pass
- [ ] 8.2.3 Check test coverage for new code

### 8.3 Documentation Review
- [ ] 8.3.1 Review all documentation for accuracy
- [ ] 8.3.2 Ensure examples are correct
- [ ] 8.3.3 Update README if necessary

### 8.4 Feature Sign-off
- [ ] 8.4.1 Demo feature to stakeholders
- [ ] 8.4.2 Gather feedback
- [ ] 8.4.3 Address any final issues
- [ ] 8.4.4 Mark feature as complete
