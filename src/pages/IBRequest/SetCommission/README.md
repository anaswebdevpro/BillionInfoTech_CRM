# SetCommission Component Structure

This folder contains the destructured SetCommission component with reusable sub-components.

## File Structure

```
SetCommission/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript interfaces and types
├── SetCommission.tsx           # Main component (orchestrator)
├── SearchAndFilterControls.tsx # Search and filter UI
├── SummaryCards.tsx            # Summary statistics cards
├── TabNavigation.tsx           # Tab navigation component
├── DataTable.tsx              # Data table with different views
├── PaginationControls.tsx     # Pagination controls
└── README.md                  # This file
```

## Components

### SetCommission.tsx
- **Purpose**: Main orchestrator component
- **Responsibilities**: 
  - State management (pagination, search, filters, active tab)
  - Data fetching and processing
  - Coordinating child components
  - Business logic (filtering, pagination)

### SearchAndFilterControls.tsx
- **Purpose**: Search and filter interface
- **Props**: Search term, status filter, entries per page, clear filters handler
- **Features**: 
  - Real-time search across name, ID, slug, symbol
  - Status filtering (for platforms and categories)
  - Entries per page selector
  - Clear filters button

### SummaryCards.tsx
- **Purpose**: Display summary statistics
- **Props**: Filtered data array
- **Features**:
  - Total filtered results count
  - Active items count
  - Inactive items count

### TabNavigation.tsx
- **Purpose**: Tab navigation between data types
- **Props**: Active tab, tab change handler, counts for each tab
- **Features**:
  - Groups, Platforms, Categories tabs
  - Dynamic count display
  - Active state styling

### DataTable.tsx
- **Purpose**: Render data in table format
- **Props**: Data array, active tab type
- **Features**:
  - Different table layouts for each data type
  - Status badges for platforms and categories
  - Action buttons (Edit, Delete)
  - Responsive design

### PaginationControls.tsx
- **Purpose**: Pagination navigation
- **Props**: Current page, total pages, data counts, page change handler
- **Features**:
  - Previous/Next buttons
  - Page number buttons (smart pagination)
  - Entry count display
  - Disabled states

## Types

### Core Data Types
- `Group`: ID, name, symbol, currency ID
- `Platform`: ID, name, slug, status
- `Category`: ID, name, slug, status
- `NetworkIncomeSettings`: Main data structure

### Component Props
- `SearchAndFilterProps`: Search and filter controls
- `SummaryCardsProps`: Summary cards data
- `TabNavigationProps`: Tab navigation state
- `DataTableProps`: Table data and type
- `PaginationControlsProps`: Pagination state and handlers

## Usage

```tsx
import SetCommission from './SetCommission';

// Use the main component
<SetCommission />

// Or import individual components
import { SearchAndFilterControls, DataTable } from './SetCommission';
```

## Benefits of Destructuring

1. **Reusability**: Components can be reused in other parts of the application
2. **Maintainability**: Easier to maintain and update individual components
3. **Testability**: Each component can be tested in isolation
4. **Readability**: Clear separation of concerns
5. **Performance**: Better optimization opportunities with smaller components
6. **Development**: Easier to work on specific features without affecting others
