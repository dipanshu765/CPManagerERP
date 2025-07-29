# replit.md

## Overview

This is a full-stack web application built as an Enterprise Resource Planning (ERP) system called "CP Manager ERP". The application follows a modern monorepo structure with a React frontend and Express.js backend, using TypeScript and JSX. The system includes comprehensive dashboard functionality, user management, data import capabilities, and animated UI components with a black/white theme design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: In-memory storage with interface for easy database migration
- **Development**: Hot reload with Vite integration

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend
- **Tables**: 
  - `users` - User authentication and profile information
  - `dashboard_data` - Business metrics and dashboard information
- **Validation**: Zod schemas for runtime validation and type inference

## Key Components

### Authentication System
- Form-based login with email/password
- Forgot password functionality (UI only)
- Static authentication for development (admin@cpmanager.com / admin123)
- Role-based access control with admin privileges

### Dashboard Features
- **User Information Display**: Shows current user details and system status
- **Metrics Visualization**: 
  - Inward entries summary (total, approved, pending, rejected)
  - Voucher types with transaction counts
  - Stock synchronization status with Tally integration
  - Additional business metrics (Hamali entries, amounts)
- **Data Visualization**: Chart.js integration for transaction analytics
- **Responsive Design**: Mobile-first approach with adaptive layouts

### UI/UX Design
- **Design System**: Custom ERP theme with neutral color palette
- **Components**: Comprehensive shadcn/ui component library
- **Responsive**: Mobile sidebar with overlay, desktop persistent sidebar
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints under `/api` prefix
2. **Query Management**: React Query handles caching, synchronization, and error states
3. **Type Safety**: Shared TypeScript types between frontend and backend
4. **Error Handling**: Centralized error handling with toast notifications

### State Management
1. **Server State**: React Query for API data caching and synchronization
2. **Local State**: React hooks for component-level state
3. **Form State**: React Hook Form for complex form interactions
4. **UI State**: Local state for modals, sidebars, and temporary UI states

### Data Storage
1. **Development**: In-memory storage using MemStorage class
2. **Production Ready**: Drizzle ORM interface allows easy database integration
3. **Schema**: PostgreSQL schema with proper indexing and relationships
4. **Migrations**: Drizzle Kit for database migrations and schema changes

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Libraries**: Radix UI components, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Validation**: Zod for schema validation
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **Type Checking**: TypeScript with strict configuration
- **Development**: tsx for running TypeScript directly
- **Replit Integration**: Custom plugins for Replit environment

### Chart Visualization
- **Library**: Chart.js with dynamic imports for bundle optimization
- **Implementation**: Canvas-based rendering with responsive design
- **Data**: Business transaction metrics and trends

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express.js API
- **Hot Reload**: Full-stack hot reload with Vite middleware
- **Environment Variables**: DATABASE_URL for database connection
- **Development Scripts**: `npm run dev` for development server

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: esbuild bundles server code with external dependencies
- **Output**: `dist/` directory with both client and server builds
- **Start Command**: `npm start` runs production server

### Database Setup
- **Schema Push**: `npm run db:push` applies schema changes
- **Migrations**: Stored in `migrations/` directory
- **Environment**: Requires DATABASE_URL for PostgreSQL connection
- **Provider**: Configured for Neon Database but supports any PostgreSQL instance

### Replit Integration
- **Cartographer**: Development mapping for Replit environment
- **Error Overlay**: Runtime error modal for development
- **Banner**: Development mode indicator when running outside Replit

## Component Architecture

### Layout Components (JSX)
- **Sidebar (`client/src/components/layout/sidebar.jsx`)**: Main navigation sidebar with Reports submenu
- **Mobile Sidebar (`client/src/components/layout/mobile-sidebar.jsx`)**: Responsive mobile version with overlay
- **Common Loader (`client/src/components/common/loader.jsx`)**: Universal "CP" branded loading component

### Dashboard Components (TSX)
- **User Info Card**: Current user details and system status display
- **Inward Entries Metrics**: Summary of inward entries with approval status
- **Voucher Types Metrics**: Transaction counts by voucher type
- **Stock Sync Status**: Tally integration and synchronization status
- **Additional Metrics**: Hamali entries and amount tracking
- **Transaction Chart**: Chart.js visualization for business analytics

### Page Components (Mixed JSX/TSX)
- **Login (`login.jsx`)**: Authentication form with email/password
- **Dashboard (`dashboard.tsx`)**: Main business metrics overview
- **Add Inward (`add-inward.jsx`)**: Form for creating new inward entries
- **Import Data (`import-data.jsx`)**: Bulk data import functionality
- **User List (`user-list.jsx`)**: User management interface
- **Inward Reports (`inward-reports.jsx`)**: Detailed inward entry reports
- **Stock Journal (`stock-journal.jsx`)**: Stock transaction reports
- **Forgot Password (`forgot-password.tsx`)**: Password recovery form

### UI Components (shadcn/ui - TSX)
Complete shadcn/ui component library including forms, dialogs, cards, buttons, inputs, and navigation components.

### Static Data Management
- **Mock Data (`client/src/lib/static-data.ts`)**: User data, dashboard metrics, voucher types, and sample business data
- **Shared Schema (`shared/schema.ts`)**: TypeScript types and Zod validation schemas for database models

### Backend Infrastructure
- **Express Server (`server/index.ts`)**: Main server with middleware and routing
- **Routes (`server/routes.ts`)**: API endpoints (currently minimal setup)
- **Storage (`server/storage.ts`)**: In-memory storage interface with user management
- **Vite Integration (`server/vite.ts`)**: Development server setup with hot reload

## Security Features
- **Client/Server Separation**: Frontend and backend properly separated
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Input Validation**: Zod schemas for form validation and API requests
- **Session Management**: Express sessions with configurable storage

## Recent Changes: Latest modifications with dates

### July 29, 2025
- **Import Data Page API Integration**: Updated import data page to call `/api/upload-xml/` endpoint for file uploads
- **XML File Upload Support**: Modified file upload to support XML format instead of CSV/Excel files
- **Multipart Form Data**: Implemented proper multipart/form-data upload with FormData API
- **Authentication Headers**: Added Bearer token authentication for XML upload API calls
- **File Validation**: Added XML file type validation and 70MB size limit checking (updated from 10MB)
- **Upload Progress UI**: Enhanced UI with loading states, file selection feedback, and upload progress indicators
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications
- **Master Data Import APIs**: Implemented individual API calls for master data imports:
  - Import Unit Master: POST `/api/fetch-units/` with Bearer token authentication
  - Godown Master: POST `/api/fetch-godowns/` with Bearer token authentication
  - Stock Groups: POST `/api/fetch-stock-group/` with Bearer token authentication
  - Stock Category: POST `/api/fetch-stock-category/` with Bearer token authentication
  - Voucher Type Masters: POST `/api/fetch-voucher-types/` with Bearer token authentication
  - Stock Item Master: Kept static (no API integration for now)
- **Individual Loading States**: Added specific loading states for each master import with visual feedback
- **Global Import Overlay**: Created full-screen loading overlay when any master import is in progress
- **Empty JSON Body**: All master import APIs use empty JSON body as requested
- **Items Mapping Layout Fix**: Fixed sidebar layout issue where sidebar is now fixed and main content is properly scrollable
- **JSX Structure Correction**: Resolved JSX syntax errors by properly structuring React fragments and components
- **Hamali Reports Feature**: Created comprehensive Hamali reports system with two screens:
  - Main Hamali Reports: Daily hamali entries listing with API integration (`/api/process/get-hamali/`)
  - Hamali Details: Individual entry details with simplified layout showing only required fields
  - Entry Details Popup: Modal popup calling `/api/process/entry-details/{id}/` for detailed entry information
- **Hamali Reports Customization**: Removed hamali type column from main listing as requested
- **Simplified Entry Display**: Details screen shows only voucher number, hamali type, supervised by, labour count, total packets, total weight, hamali amount, and applied rate
- **Popup Implementation**: View Details button opens modal instead of separate screen with comprehensive entry information including stock items, transfer details, and summary statistics
- **Navigation Integration**: Added Hamali Report to sidebar Reports submenu with proper routing
- **Authentication Headers**: All Hamali APIs use Bearer token authentication with proper error handling
- **Migration Completed**: Successfully completed migration from Replit Agent to Replit environment with all functionality working

### July 25, 2025
- **Authentication Session Management Fixed**: Resolved critical issue where user credentials persisted after logout
- **React Query Cache Clearing**: Implemented proper cache clearing on both login and logout for fresh user data
- **Enhanced Logout Process**: Added comprehensive cleanup that clears localStorage, React Query cache, and invalidates all queries
- **Protected Route Guards**: Added authentication guards to ensure users are redirected to login when accessing protected routes
- **User Session Isolation**: Fixed issue where new user login would show previous user's cached data
- **Items Mapping Feature**: Added comprehensive items mapping system after Item Masters in sidebar
- **Items Mapping API Integration**: Connected to `/api/item-mapping/` POST endpoint with Bearer token authentication
- **Dynamic Voucher-Item Mapping**: Created interface for mapping stock items with users based on vouchers and types (SOURCE, DESTINATION, BARDAN)
- **Multi-level Configuration**: Implemented nested mapping structure where items can have multiple vouchers, each with specific type assignments
- **Form Validation**: Added comprehensive validation for user selection, item mapping, voucher selection, and type assignments
- **Dynamic Data Integration**: Replaced static data with full API integration for users, items, and vouchers
- **React Hooks Error Fixed**: Resolved React Hooks violation by restructuring component loading logic
- **Default Item Mapping Block**: Added default item mapping that shows immediately when page loads for better UX
- **Search Functionality**: Implemented search input for item dropdown to easily find items by name or parent
- **Active Vouchers Filter**: Added is_active=true parameter to voucher API to show only active voucher types
- **Enhanced UI/UX**: Improved visual feedback with green selection indicators and simplified interface
- **Button Functionality Fixed**: Resolved issue where Add Item buttons weren't working properly
- **Migration to Replit Environment**: Successfully completed migration from Replit Agent with all security enhancements

### July 23, 2025
- **Project Migration Completed**: Successfully migrated CP Manager ERP from Replit Agent to Replit environment
- **Godown Masters Feature**: Added new menu option after User List with comprehensive godown management
- **API Integration**: Created Godown Masters page with real API endpoint `/api/get-godowns/` using Bearer token authentication
- **Item Masters Feature**: Added Item Masters menu after Godown Masters with POST API integration `/api/get-stock-items/`
- **Type Filtering**: Implemented Items/Bardan dropdown filter with proper API request mapping
- **Column Optimization**: Streamlined table to show only Name, Parent, Base Unit, Conversion, and Closing Balance
- **Voucher Settings Feature**: Added Voucher Settings menu after Item Masters with GET API integration `/api/get-voucher-types/`
- **Status Filtering**: Implemented All/Active/Inactive dropdown with is_active query parameter filtering
- **Default Filtering**: Set Active status as default with automatic is_active=true API parameter
- **Search & Filtering**: Implemented search by godown name and branch filtering (All, Rayapur, Tarihal)
- **Responsive Design**: Added mobile sidebar layout with proper responsive design patterns
- **Pagination System**: Implemented 25 items per page for Godown Masters, 50 items for Item Masters
- **Data Display**: Shows godown name, branch, active status, and creation date in table format
- **Error Handling**: Proper error states with toast notifications and loading indicators
- **Migration Complete**: All migration checklist items completed and project ready for production use

### July 22, 2025
- **Stock Journal API Integration**: Integrated stock journal reports with real API endpoints
- **API Features Added**: Date filtering, voucher type filtering, sync status filtering with query parameters
- **Pagination Implementation**: Added comprehensive pagination with API response data
- **Hard-coded Voucher Types**: Implemented dropdown with Consumption note, Production note, Brand transfer, Stock transfer
- **Authentication Integration**: All API calls use proper Bearer token authentication
- **Error Handling**: Added proper error states and loading indicators

### July 21, 2025
- **Project Migration**: Successfully migrated from Replit Agent to Replit environment
- **Sidebar Consistency**: Fixed sidebar component inconsistencies across all pages
- **JSX Conversion**: Converted sidebar components from TSX to JSX format as requested
- **Import Path Standardization**: Updated all import paths to use consistent @/ aliases
- **Path Resolution**: Fixed mobile sidebar path mismatch for stock journal reports
- **Component Documentation**: Comprehensive documentation of all project components
- **Authentication Integration**: Integrated real API authentication with mobile-based login
- **API Integration**: Connected login/logout to external API at http://127.0.0.1:8096
- **Schema Updates**: Updated user schema and validation for mobile-based authentication
- **AuthService**: Created comprehensive authentication service with token management
- **Query Client Updates**: Enhanced API request handling with automatic authentication headers

### July 18, 2025
- **Common Loader System**: Created universal "CP" branded loader component with theme-matching black/white colors and animations
- **Fixed Dashboard Navigation**: Resolved issue where clicking dashboard from other screens wasn't properly navigating back
- **Loading States**: Added consistent loading states across all pages (login, dashboard, inward reports, user list, import data)
- **Dialog Accessibility**: Fixed missing Dialog descriptions that were causing accessibility warnings
- **Enhanced UX**: Added realistic loading delays and proper loading text for each screen type
- **Stock Journal Reports**: Created comprehensive stock journal report screen with static data matching API structure