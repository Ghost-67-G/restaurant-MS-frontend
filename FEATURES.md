# Restaurant Management System - Features Documentation

## Overview
A comprehensive Restaurant Management System built with React + Vite, featuring role-based access control, real-time order management, inventory tracking, and tax configuration.

## Tech Stack
- **Frontend**: React 18 + Vite (JavaScript)
- **UI Components**: Shadcn UI (Button, Input, Label, Card)
- **State Management**: 
  - React Query v5 (Server state with auto-refresh)
  - Zustand (Cart state management)
- **Routing**: React Router v6 with role-based guards
- **Styling**: Tailwind CSS (Slate/Orange theme)
- **HTTP Client**: Axios with authentication interceptors
- **Notifications**: React Hot Toast
- **Backend**: Express + MongoDB

---

## Features Implemented

### 1. Authentication System ✅
**Status**: Complete

**Implementation**:
- JWT-based authentication
- Login and Registration pages
- Auth store using Zustand (`/stores/auth.store.js`)
- Auth service with API integration (`/services/auth.service.js`)
- Axios interceptors for automatic token injection
- Protected routes with authentication guards

**Files**:
- `/pages/Login.jsx`
- `/pages/Register.jsx`
- `/stores/auth.store.js`
- `/services/auth.service.js`
- `/lib/api.js` (Axios instance with interceptors)

---

### 2. Role-Based Access Control (RBAC) ✅
**Status**: Complete

**Roles**:
1. **Owner**: Full system access (Dashboard, POS, Orders, Menu, Inventory, Tax Settings, Kitchen)
2. **Cashier**: POS and Orders management
3. **Kitchen**: Kitchen Dashboard and Orders view

**Implementation**:
- `RoleGuard` component wraps protected routes
- Automatic redirection based on user role:
  - Cashier → `/pos`
  - Kitchen → `/kitchen`
  - Owner → `/dashboard`
- Role-filtered sidebar navigation
- Role-based order filtering in Orders page

**Files**:
- `/components/guards/RoleGuard.jsx`
- `/components/layout/Sidebar.jsx`
- `/App.jsx` (route protection)

**Example Usage**:
```jsx
<Route element={<RoleGuard allowedRoles={['owner']} />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

---

### 3. Point of Sale (POS) System ✅
**Status**: Complete

**Features**:
- Menu item grid with infinite scroll
- Real-time search with debouncing (300ms)
- Interactive shopping cart
- Order type selection (Dine-in, Takeaway, Delivery)
- Dynamic tax selection dropdown
- Real-time total calculation
- Table number input (dine-in)
- Delivery fee input (delivery)

**Implementation**:
- Infinite scroll using Intersection Observer API
- React Query for menu items pagination
- Zustand cart store for state management
- Debounced search to reduce API calls
- Tax calculation: `(subtotal × tax.percentage) / 100`
- Total: `subtotal + taxAmount + deliveryFee`

**Files**:
- `/pages/POS.jsx`
- `/components/pos/MenuItemButton.jsx`
- `/components/pos/CartPanel.jsx`
- `/stores/cart.store.js`
- `/hooks/useMenu.js`

**Cart Store State**:
```javascript
{
  items: [],
  orderType: "dine-in" | "takeaway" | "delivery",
  tableNumber: "",
  deliveryFee: 0,
  selectedTax: { id, name, percentage, isActive } | null
}
```

---

### 4. Order Management System ✅
**Status**: Complete

**Order Statuses**:
1. **Pending** (Yellow) - New orders awaiting preparation
2. **Preparing** (Blue) - Kitchen is working on the order
3. **Completed** (Green) - Order finished and ready/delivered
4. **Cancelled** (Red) - Order cancelled

**Features**:
- Role-based order views:
  - **Cashier**: Pending only
  - **Kitchen**: All, Pending, Preparing, Completed
  - **Owner**: All, Pending, Preparing, Completed, Cancelled
- Real-time order details modal
- Status update workflow with business logic
- Order type badges (Dine-in, Takeaway, Delivery)
- Tax and delivery fee display
- Auto-refresh every 30 seconds

**Implementation**:
- Modal stores order ID instead of object for real-time sync
- React Query cache invalidation on status updates
- Color-coded status badges
- Status transitions:
  - Pending → Preparing → Completed
  - Any status → Cancelled (owner only)

**Files**:
- `/pages/Orders.jsx`
- `/components/orders/OrderRow.jsx`
- `/components/orders/OrderDetailsModal.jsx`
- `/services/order.service.js`
- `/hooks/useOrder.js`

**Order Data Structure**:
```javascript
{
  id: string,
  orderNumber: string,
  status: "pending" | "preparing" | "completed" | "cancelled",
  orderType: "dine-in" | "takeaway" | "delivery",
  tableNumber?: string,
  items: [{ menuItemId, name, price, quantity }],
  subtotal: number,
  taxName: string,
  taxPercentage: number,
  taxAmount: number,
  deliveryFee: number,
  totalAmount: number,
  createdAt: timestamp
}
```

---

### 5. Kitchen Dashboard ✅
**Status**: Complete

**Features**:
- Card-based order view optimized for kitchen staff
- Auto-refresh every 10 seconds
- Filter by Pending/Preparing status
- Real-time counters (Pending: X, Preparing: Y)
- Color-coded cards matching order status
- Quick action buttons:
  - "Start Preparing" (Pending → Preparing)
  - "Mark Complete" (Preparing → Completed)
- Order type badges with icons
- Item list with quantities

**Implementation**:
- React Query with `refetchInterval: 10000`
- Card grid layout for better visibility
- Status-based conditional rendering
- One-click status updates

**Files**:
- `/pages/KitchenDashboard.jsx`
- `/components/kitchen/KitchenOrderCard.jsx`

**Card Color Coding**:
- Pending: Yellow border (`border-yellow-400`)
- Preparing: Blue border (`border-blue-400`)
- Completed: Green border (`border-green-400`)

---

### 6. Dashboard & Analytics ✅
**Status**: Complete

**Metrics Displayed**:
- Today's Total Sales ($)
- Total Orders Count
- Pending Orders Count
- Completed Orders Count

**Implementation**:
- Backend endpoint: `GET /dashboard/today`
- Auto-refresh every 30 seconds
- Stat cards with icon indicators
- Real-time data updates

**Files**:
- `/pages/Dashboard.jsx`
- `/services/dashboard.service.js`
- `/hooks/useDashboard.js`

---

### 7. Menu Management ✅
**Status**: Complete

**Features**:
- Create, Read, Update, Delete menu items
- Category management
- Availability toggle
- Image support
- Pagination
- Search functionality

**Implementation**:
- React Query for CRUD operations
- Modal-based add/edit forms
- Optimistic updates
- Cache invalidation on mutations

**Files**:
- `/pages/Menu.jsx`
- `/components/menu/MenuItemRow.jsx`
- `/components/menu/AddEditMenuItemModal.jsx`
- `/services/menu.service.js`
- `/hooks/useMenu.js`

---

### 8. Inventory Management System v1 ✅
**Status**: Complete

**Features**:
- Track inventory items (ingredients, supplies)
- Stock quantity management
- Unit of measurement (kg, L, pcs, etc.)
- Reorder level alerts
- Link menu items to inventory
- CRUD operations with pagination

**Implementation**:
- Inventory item schema: `{ name, quantity, unit, reorderLevel }`
- Menu items can reference inventory items
- Dropdown selector in menu item form
- Table view with edit/delete actions

**Files**:
- `/pages/Inventory.jsx`
- `/components/inventory/InventoryRow.jsx`
- `/components/inventory/AddEditInventoryModal.jsx`
- `/services/inventory.service.js`
- `/hooks/useInventory.js`
- `/components/menu/AddEditMenuItemModal.jsx` (inventory linking)

---

### 9. Tax Configuration System ✅
**Status**: Complete

**Features**:
- Multiple tax configurations support
- Create, update, delete tax rules
- Activate/deactivate taxes
- Real-time tax selection per order
- Tax snapshot per order (prevents historical recalculation)
- "No Tax" option support

**Implementation**:

**Backend API**:
- `GET /tax` - List all tax configurations
- `GET /tax/active` - Get active taxes only
- `GET /tax/:taxId` - Get specific tax
- `POST /tax` - Create new tax
- `PATCH /tax/:taxId` - Update tax
- `DELETE /tax/:taxId` - Delete tax

**Frontend**:
- Tax selector dropdown in POS cart
- Tax calculation: `(subtotal × selectedTax.percentage) / 100`
- Order stores tax snapshot: `{ taxName, taxPercentage, taxAmount }`
- Tax Settings page with CRUD table
- Active/Inactive status badges

**Files**:
- `/pages/TaxSettings.jsx` - CRUD interface
- `/components/pos/CartPanel.jsx` - Tax selector dropdown
- `/services/tax.service.js` - API calls
- `/hooks/useTax.js` - React Query hooks
- `/stores/cart.store.js` - selectedTax state

**Tax Data Structure**:
```javascript
{
  id: string,
  name: string,
  percentage: number,
  isActive: boolean
}
```

**Why Tax Snapshot?**
When a tax rate changes (e.g., GST increases from 5% to 7%), existing orders should maintain their original tax calculation. We store `taxName`, `taxPercentage`, and `taxAmount` with each order to prevent recalculation.

---

### 10. Order Type System ✅
**Status**: Complete

**Order Types**:
1. **Dine-in**: Requires table number
2. **Takeaway**: No additional fields
3. **Delivery**: Optional delivery fee

**Implementation**:
- Radio-style button group with icons:
  - Dine-in: Store icon
  - Takeaway: Shopping Bag icon
  - Delivery: Truck icon
- Conditional input fields based on selection
- Validation: Table number required for dine-in
- Order type stored with each order
- Display badges in kitchen and order views

**Files**:
- `/components/pos/CartPanel.jsx` - Order type selector
- `/components/kitchen/KitchenOrderCard.jsx` - Order type badges
- `/stores/cart.store.js` - orderType state

---

## State Management Architecture

### Zustand Stores

**Auth Store** (`/stores/auth.store.js`):
```javascript
{
  user: { id, name, email, role },
  token: string,
  login: (credentials) => {},
  register: (data) => {},
  logout: () => {}
}
```

**Cart Store** (`/stores/cart.store.js`):
```javascript
{
  items: [],
  orderType: string,
  tableNumber: string,
  deliveryFee: number,
  selectedTax: object | null,
  addItem: (menuItem) => {},
  removeItem: (itemId) => {},
  incrementQuantity: (itemId) => {},
  decrementQuantity: (itemId) => {},
  clearCart: () => {},
  getSubtotal: () => number,
  getTaxAmount: () => number,
  getTotal: () => number,
  setOrderType: (type) => {},
  setTableNumber: (number) => {},
  setDeliveryFee: (fee) => {},
  setSelectedTax: (tax) => {}
}
```

### React Query Usage

**Query Keys Pattern**:
- `['menu-items', filters]` - Menu items with filters
- `['orders', filters]` - Orders with filters
- `['dashboard', 'today']` - Dashboard stats
- `['inventory-items', { page, limit }]` - Inventory pagination
- `['taxes']` - All tax configurations
- `['tax', 'active']` - Active taxes only

**Cache Invalidation**:
- After order creation: Invalidate `['orders']`, `['dashboard']`
- After order update: Invalidate `['orders']`, `['dashboard']`
- After inventory update: Invalidate `['inventory-items']`
- After tax update: Invalidate `['taxes']`

**Auto-refresh**:
- Dashboard: 30 seconds
- Kitchen Dashboard: 10 seconds
- Orders page: 30 seconds

---

## Design Patterns

### 1. Real-time Data Sync
**Problem**: Modal showing stale order data after status updates.

**Solution**: Store order ID instead of full order object, fetch fresh data when modal opens.

```javascript
// Bad ❌
const [selectedOrder, setSelectedOrder] = useState(null);

// Good ✅
const [selectedOrderId, setSelectedOrderId] = useState(null);
const { data: orderDetails } = useOrder(selectedOrderId);
```

### 2. Tax Snapshot Pattern
**Problem**: Tax rate changes should not affect historical orders.

**Solution**: Store tax snapshot with each order:
```javascript
{
  taxName: "GST",
  taxPercentage: 5,
  taxAmount: 25.00  // Calculated once, never recalculated
}
```

### 3. Role-Based Rendering
**Pattern**: Filter content based on user role without hard-coded conditionals.

```javascript
const navigation = [
  { name: "Dashboard", path: "/dashboard", roles: ["owner"] },
  { name: "POS", path: "/pos", roles: ["owner", "cashier"] },
  { name: "Kitchen", path: "/kitchen", roles: ["owner", "kitchen"] },
].filter(item => item.roles.includes(userRole));
```

### 4. Optimistic Updates
**Pattern**: Update UI immediately, rollback on error.

```javascript
updateMutation.mutate(data, {
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['orders']);
    const previousOrders = queryClient.getQueryData(['orders']);
    queryClient.setQueryData(['orders'], old => updateOptimistically(old, newData));
    return { previousOrders };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['orders'], context.previousOrders);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['orders']);
  }
});
```

### 5. Debounced Search
**Pattern**: Reduce API calls during user typing.

```javascript
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useDebounce(searchQuery, 300);

useInfiniteMenuItems({ name: debouncedSearch || undefined });
```

---

## API Integration

### Base Configuration
**File**: `/lib/api.js`

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request interceptor (attach token)
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle 401)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Service Layer Pattern
All API calls abstracted into service files:

- `auth.service.js` - Authentication
- `menu.service.js` - Menu management
- `order.service.js` - Order operations
- `inventory.service.js` - Inventory CRUD
- `dashboard.service.js` - Analytics
- `tax.service.js` - Tax configuration

**Example**:
```javascript
// tax.service.js
export const taxService = {
  getTaxes: () => api.get("/tax").then(res => res.data),
  getActiveTax: () => api.get("/tax/active").then(res => res.data),
  createTax: (data) => api.post("/tax", data).then(res => res.data),
  updateTax: (taxId, data) => api.patch(`/tax/${taxId}`, data).then(res => res.data),
  deleteTax: (taxId) => api.delete(`/tax/${taxId}`).then(res => res.data),
};
```

---

## UI/UX Design Decisions

### Color Scheme
- **Primary**: Orange (`orange-500`, `orange-600`)
- **Neutral**: Slate (`slate-50` to `slate-900`)
- **Status Colors**:
  - Success: Green (`green-500`)
  - Warning: Yellow (`yellow-400`)
  - Info: Blue (`blue-500`)
  - Error: Red (`red-600`)

### Component Library
**Shadcn UI** - Accessible, customizable components built on Radix UI primitives.

**Why Shadcn?**
- Copy-paste components (not npm package)
- Full control over styling
- Tailwind CSS integration
- Accessibility built-in

**Components Used**:
- `Button` - Primary actions, status updates
- `Input` - Form fields
- `Label` - Form labels
- `Card` - Container components (kitchen dashboard)

### Layout
**DashboardLayout** (`/components/layout/DashboardLayout.jsx`):
- Fixed sidebar (role-filtered navigation)
- Header with user info and logout
- Main content area with responsive padding
- Mobile-friendly hamburger menu (future enhancement)

---

## Performance Optimizations

### 1. Infinite Scroll
**Why**: Loading 1000+ menu items at once is slow.

**Implementation**: Intersection Observer API + React Query infinite queries.

**Benefits**:
- Reduced initial load time
- Better perceived performance
- Lower memory usage

### 2. Debounced Search
**Why**: API call on every keystroke is wasteful.

**Implementation**: Custom `useDebounce` hook with 300ms delay.

**Benefits**:
- Reduced server load
- Fewer API calls
- Better UX (no flickering results)

### 3. React Query Cache
**Why**: Avoid refetching unchanged data.

**Configuration**:
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,      // Data fresh for 30s
      cacheTime: 300000,     // Keep in cache for 5min
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
```

### 4. Optimistic Updates
**Why**: Instant UI feedback improves UX.

**Example**: Order status update appears immediately, reverts if API fails.

---

## Security Features

### 1. JWT Authentication
- Tokens stored in Zustand (memory, not localStorage)
- Automatic token refresh (future enhancement)
- Secure HTTP-only cookies option (future)

### 2. Role-Based Authorization
- Frontend route guards
- Backend API endpoint protection (assumed)
- Role validation on every protected route

### 3. Input Validation
- Required field checks
- Number range validation (tax: 0-100%)
- Type validation (email, password strength - future)

---

## Testing Strategy

### Unit Tests (Future)
- Zustand store actions
- Utility functions (debounce, formatters)
- Cart calculations

### Integration Tests (Future)
- API service layer
- React Query hooks
- Form submissions

### E2E Tests (Future)
- Order creation flow
- Kitchen workflow
- Tax configuration

**Recommended Tools**: Vitest, React Testing Library, Playwright

---

## Deployment Considerations

### Environment Variables
```env
VITE_API_URL=https://api.yourrestaurant.com
```

### Build Command
```bash
npm run build
```

### Production Checklist
- [ ] Enable error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Configure CORS for production API
- [ ] Set up SSL/TLS certificates
- [ ] Enable gzip compression
- [ ] Add service worker for offline support
- [ ] Implement rate limiting
- [ ] Set up monitoring (Datadog, New Relic)

---

## Future Enhancements

### High Priority
1. **Reports & Analytics**
   - Sales reports by date range
   - Top-selling items
   - Revenue trends
   - Export to CSV/PDF

2. **Customer Management**
   - Customer profiles
   - Order history
   - Loyalty points
   - Phone number capture

3. **Notification System**
   - Real-time order alerts (WebSocket)
   - Kitchen display system (KDS)
   - SMS notifications for delivery
   - Browser push notifications

### Medium Priority
4. **Advanced Inventory**
   - Auto-deduct stock on order
   - Low stock alerts
   - Supplier management
   - Purchase orders

5. **Payment Integration**
   - Stripe/Square integration
   - Multiple payment methods
   - Split bills
   - Tips/gratuity

6. **Printing**
   - Receipt printer integration
   - Kitchen ticket printing
   - Invoice generation

### Low Priority
7. **Multi-location Support**
   - Branch management
   - Centralized reporting
   - Cross-location transfers

8. **Reservations**
   - Table booking system
   - Waitlist management
   - Reservation calendar

9. **Staff Management**
   - Shift scheduling
   - Time tracking
   - Commission calculation

---

## Known Issues & Limitations

### Current Limitations
1. **No Offline Support**: Requires internet connection
2. **No Real-time Updates**: Uses polling instead of WebSocket
3. **No Order Editing**: Once placed, orders cannot be modified
4. **No Printer Integration**: Manual printing only
5. **No Multi-currency**: USD only

### Bug Fixes Applied
- ✅ Tax selector "No Tax" option now works correctly
- ✅ Modal shows fresh order data on status updates
- ✅ Default tax selection fixed (won't override manual "No Tax" selection)

---

## Maintenance Guide

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Cache Invalidation
If users see stale data:
```javascript
queryClient.invalidateQueries(); // Clear all caches
```

### Debugging React Query
```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## Contributing Guidelines

### Code Style
- Use ESLint configuration
- Follow Prettier formatting
- Use descriptive variable names
- Add JSDoc comments for complex functions

### Git Workflow
1. Create feature branch: `git checkout -b feature/order-editing`
2. Make changes and commit: `git commit -m "feat: add order editing"`
3. Push and create PR: `git push origin feature/order-editing`

### Commit Message Format
```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

---

## License
MIT License - Feel free to use for commercial and personal projects.

---

## Support & Contact
For questions or issues, please contact the development team or create an issue in the project repository.

**Last Updated**: February 2, 2026
