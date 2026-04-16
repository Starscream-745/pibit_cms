# Implementation Plan: PIBIT.AI CMS

## Overview

This implementation plan breaks down the PIBIT.AI CMS into discrete coding tasks. The system consists of a React frontend with TypeScript, a Node.js/Express backend with TypeScript, and MongoDB for data persistence. The implementation follows a layered architecture (Controller → Service → Repository) and includes comprehensive property-based testing for correctness validation.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Create monorepo structure with frontend and backend directories
  - Initialize TypeScript configuration for both frontend and backend
  - Set up package.json files with required dependencies (React, Express, MongoDB driver, testing libraries)
  - Configure build scripts and development environment
  - Set up ESLint and Prettier for code quality
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 2. Implement backend data layer (Repository)
  - [x] 2.1 Create Asset data model and TypeScript interfaces
    - Define Asset interface with all required fields (id, name, url, category, description, createdAt, updatedAt)
    - Create MongoDB schema with validation rules
    - Set up database connection module with environment variable support
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 11.4, 11.5, 15.2_
  
  - [ ]* 2.2 Write property test for Asset data model structure
    - **Property 22: Asset Data Model Structure**
    - **Validates: Requirements 13.1, 13.6, 13.7**
  
  - [x] 2.3 Implement AssetRepository class
    - Implement findAll() method to retrieve all assets
    - Implement findById() method to retrieve asset by ID
    - Implement findByCategory() method to filter assets by category
    - Implement save() method to create new assets with timestamps
    - Implement update() method to update existing assets
    - Implement delete() method to remove assets
    - _Requirements: 11.1, 11.2, 11.3, 2.1, 2.3, 2.6, 4.2_
  
  - [ ]* 2.4 Write unit tests for AssetRepository
    - Test database connection handling
    - Test CRUD operations with mock database
    - Test error handling for database failures
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 3. Implement backend business logic layer (Service)
  - [x] 3.1 Create URL validation utility
    - Implement URL format validation function
    - Handle various URL schemes (http, https)
    - Return INVALID_URL error for invalid formats
    - _Requirements: 1.2, 1.8, 9.1, 10.4_
  
  - [ ]* 3.2 Write property test for URL validation consistency
    - **Property 1: URL Validation Consistency**
    - **Validates: Requirements 1.2, 1.8, 9.1, 10.4**
  
  - [x] 3.3 Create input sanitization utility
    - Implement XSS prevention sanitization for user inputs
    - Sanitize description fields
    - Handle special characters and HTML entities
    - _Requirements: 9.2, 9.3_
  
  - [ ]* 3.4 Write property test for input sanitization
    - **Property 17: Input Sanitization for XSS Prevention**
    - **Validates: Requirements 9.2, 9.3**
  
  - [x] 3.5 Implement AssetService class
    - Implement findAll() method
    - Implement findById() method with null handling
    - Implement findByCategory() method
    - Implement create() method with URL validation and sanitization
    - Implement update() method with validation and timestamp handling
    - Implement delete() method
    - Implement getAllCategories() method with unique extraction
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 5.1, 5.2_
  
  - [ ]* 3.6 Write property test for asset creation persistence
    - **Property 2: Asset Creation Persistence**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 11.1**
  
  - [ ]* 3.7 Write property test for asset update persistence
    - **Property 7: Asset Update Persistence**
    - **Validates: Requirements 3.4, 3.5, 11.2**
  
  - [ ]* 3.8 Write property test for asset deletion persistence
    - **Property 9: Asset Deletion Persistence**
    - **Validates: Requirements 4.2, 11.3**
  
  - [ ]* 3.9 Write property test for category extraction uniqueness
    - **Property 11: Category Extraction Uniqueness**
    - **Validates: Requirements 5.2, 5.3**
  
  - [ ]* 3.10 Write property test for required field validation
    - **Property 20: Required Field Validation**
    - **Validates: Requirements 13.2, 13.3, 13.4**
  
  - [ ]* 3.11 Write property test for description field default
    - **Property 21: Description Field Default**
    - **Validates: Requirements 13.5**

- [ ] 4. Checkpoint - Ensure backend service layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement backend API layer (Controller and Routes)
  - [x] 5.1 Create error handling middleware
    - Define ErrorResponse interface with code and message fields
    - Implement error codes (ASSET_NOT_FOUND, INVALID_URL, VALIDATION_ERROR, DATABASE_ERROR)
    - Create error handler middleware for consistent error responses
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 5.2 Write property test for error response structure
    - **Property 18: Error Response Structure**
    - **Validates: Requirements 10.1, 10.2**
  
  - [ ]* 5.3 Write property test for validation error code
    - **Property 19: Validation Error Code**
    - **Validates: Requirements 10.5**
  
  - [x] 5.4 Implement AssetController class
    - Implement getAllAssets() handler with 200 response
    - Implement getAssetById() handler with 200/404 responses
    - Implement getAssetsByCategory() handler with 200 response
    - Implement createAsset() handler with validation and 201 response
    - Implement updateAsset() handler with validation and 200/404 responses
    - Implement deleteAsset() handler with 204/404 responses
    - Implement getAllCategories() handler with 200 response
    - _Requirements: 1.1, 1.7, 2.1, 2.2, 2.4, 2.5, 2.7, 3.1, 3.6, 3.7, 4.1, 4.3, 4.4, 5.3_
  
  - [ ]* 5.5 Write property test for asset creation success response
    - **Property 3: Asset Creation Success Response**
    - **Validates: Requirements 1.7**
  
  - [ ]* 5.6 Write property test for asset retrieval by ID
    - **Property 4: Asset Retrieval by ID**
    - **Validates: Requirements 2.4**
  
  - [ ]* 5.7 Write property test for non-existent asset returns 404
    - **Property 5: Non-Existent Asset Returns 404**
    - **Validates: Requirements 2.5, 3.7, 4.4, 10.3**
  
  - [ ]* 5.8 Write property test for category filtering correctness
    - **Property 6: Category Filtering Correctness**
    - **Validates: Requirements 2.6, 2.7**
  
  - [ ]* 5.9 Write property test for asset update success response
    - **Property 8: Asset Update Success Response**
    - **Validates: Requirements 3.6**
  
  - [ ]* 5.10 Write property test for asset deletion success response
    - **Property 10: Asset Deletion Success Response**
    - **Validates: Requirements 4.3**
  
  - [x] 5.11 Set up Express routes
    - Create assetRoutes.ts with all REST endpoints
    - Wire routes to controller methods
    - Apply error handling middleware
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_
  
  - [x] 5.12 Create server.ts entry point
    - Initialize Express app
    - Configure middleware (JSON parsing, CORS for LAN)
    - Mount routes
    - Bind server to local network interface only
    - Support PORT environment variable
    - Support NODE_ENV environment variable
    - _Requirements: 9.4, 9.5, 15.1, 15.3, 15.4, 15.5_

- [ ] 6. Checkpoint - Ensure backend API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement frontend service layer
  - [x] 7.1 Create Asset TypeScript interface for frontend
    - Define Asset type matching backend model
    - Create CreateAssetDTO and UpdateAssetDTO types
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_
  
  - [x] 7.2 Implement AssetService class for API communication
    - Implement getAll() method with fetch to /api/assets
    - Implement getById() method with fetch to /api/assets/:id
    - Implement create() method with POST to /api/assets
    - Implement update() method with PUT to /api/assets/:id
    - Implement delete() method with DELETE to /api/assets/:id
    - Implement getCategories() method with fetch to /api/categories
    - Handle HTTP errors and parse JSON responses
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_
  
  - [ ]* 7.3 Write property test for frontend service API call correctness
    - **Property 23: Frontend Service API Call Correctness**
    - **Validates: Requirements 14.3, 14.5, 14.6**
  
  - [ ]* 7.4 Write property test for frontend service POST/PUT data transmission
    - **Property 24: Frontend Service POST/PUT Data Transmission**
    - **Validates: Requirements 14.4, 14.5**

- [ ] 8. Implement frontend React components
  - [x] 8.1 Create Layout component
    - Implement main layout structure with header and content area
    - Add navigation elements
    - Style with CSS for LAN-friendly interface
    - _Requirements: 6.1_
  
  - [x] 8.2 Create AssetCard component
    - Display asset name, URL, category, and description
    - Add edit and delete action buttons
    - Style card layout
    - _Requirements: 6.5_
  
  - [ ]* 8.3 Write property test for asset card display completeness
    - **Property 13: Asset Card Display Completeness**
    - **Validates: Requirements 6.5**
  
  - [x] 8.4 Create CategoryFilter component
    - Fetch categories from API
    - Render category filter dropdown/buttons
    - Handle category selection events
    - _Requirements: 5.3, 6.2_
  
  - [x] 8.5 Create AssetList component
    - Implement state management for assets and loading state
    - Fetch assets on component mount using AssetService
    - Support category filtering via props
    - Render loading indicator during fetch
    - Group and render assets by category using AssetCard
    - Handle empty state
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 8.2, 8.3_
  
  - [ ]* 8.6 Write property test for frontend category filtering
    - **Property 12: Frontend Category Filtering**
    - **Validates: Requirements 6.2**
  
  - [x] 8.7 Create AssetForm component
    - Implement form state management for all asset fields
    - Render empty form for creation mode
    - Populate form fields when editing existing asset
    - Implement form validation (required fields, URL format)
    - Handle form submission with onSubmit callback
    - Handle form cancellation with onCancel callback
    - Display validation errors
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 8.8 Write property test for asset form population
    - **Property 14: Asset Form Population**
    - **Validates: Requirements 7.2**
  
  - [ ]* 8.9 Write property test for form validation execution
    - **Property 15: Form Validation Execution**
    - **Validates: Requirements 7.3**
  
  - [ ]* 8.10 Write property test for valid form submission callback
    - **Property 16: Valid Form Submission Callback**
    - **Validates: Requirements 7.4**

- [ ] 9. Implement main App component and routing
  - [x] 9.1 Create App.tsx with routing
    - Set up React Router for navigation
    - Create routes for asset list view, create view, and edit view
    - Integrate Layout, AssetList, AssetForm, and CategoryFilter components
    - Implement create asset flow (form submission → API call → redirect)
    - Implement edit asset flow (load asset → populate form → update → redirect)
    - Implement delete asset flow (confirmation → API call → refresh list)
    - _Requirements: 6.1, 6.2, 7.1, 7.4, 7.5_
  
  - [ ]* 9.2 Write integration tests for frontend workflows
    - Test asset creation workflow end-to-end
    - Test asset editing workflow end-to-end
    - Test asset deletion workflow end-to-end
    - Test category filtering workflow
    - _Requirements: 6.1, 6.2, 7.1, 7.4, 7.5_

- [ ] 10. Checkpoint - Ensure frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement environment configuration
  - [x] 11.1 Create environment configuration files
    - Create .env.example with PORT, DATABASE_URL, NODE_ENV
    - Create .env for local development
    - Document environment variables in README
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 11.2 Write property test for environment configuration handling
    - **Property 25: Environment Configuration Handling**
    - **Validates: Requirements 15.1**
  
  - [ ]* 11.3 Write property test for database URL configuration
    - **Property 26: Database URL Configuration**
    - **Validates: Requirements 15.2**

- [ ] 12. Add performance optimizations
  - [ ] 12.1 Implement caching for category list
    - Add in-memory cache for categories in AssetService
    - Invalidate cache on asset creation/update/deletion
    - _Requirements: 8.1_
  
  - [ ] 12.2 Add database indexing
    - Create index on category field in MongoDB
    - Verify index creation in repository initialization
    - _Requirements: 11.5_
  
  - [ ] 12.3 Implement pagination support (optional enhancement)
    - Add pagination parameters to API endpoints
    - Update frontend to support paginated loading
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 13. Create deployment scripts and documentation
  - [ ] 13.1 Create build and deployment scripts
    - Add npm scripts for building frontend and backend
    - Create production build configuration
    - Add start scripts for development and production
    - _Requirements: 15.3, 15.4, 15.5_
  
  - [x] 13.2 Write README documentation
    - Document system architecture and features
    - Provide setup instructions for development
    - Document environment variables
    - Provide deployment instructions
    - Document API endpoints
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 14. Final checkpoint - End-to-end validation
  - Ensure all tests pass (unit, property-based, integration)
  - Verify all requirements are covered by implementation
  - Test complete workflows manually if needed
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation uses TypeScript throughout for type safety
- MongoDB is used for data persistence with indexing for performance
- The system is designed for LAN-only access with no external authentication
