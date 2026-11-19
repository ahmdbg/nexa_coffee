export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName:
    | 'LayoutDashboard'
    | 'ShoppingCart'
    | 'Package'
    | 'Wallet'
    | 'Users'
    | 'Contact'
    | 'ChartNoAxesCombined'
    | 'Sparkles'
    | 'Settings'
    | 'Database';
  description?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Overview',
    path: '/app/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Executive business summary and live metrics',
  },
  {
    id: 'pos',
    label: 'Point of Sale',
    path: '/app/pos',
    iconName: 'ShoppingCart',
    description: 'Checkout terminal, cart, and transaction history',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/app/inventory',
    iconName: 'Package',
    description: 'Products, categories, suppliers, and stock ledger',
  },
  {
    id: 'finance',
    label: 'Finance',
    path: '/app/finance',
    iconName: 'Wallet',
    description: 'Revenue, expenses, profit & loss, and cash flow',
  },
  {
    id: 'employees',
    label: 'Employees',
    path: '/app/employees',
    iconName: 'Users',
    description: 'Staff directory, roles, and activity logs',
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/app/customers',
    iconName: 'Contact',
    description: 'Customer directory and purchase analytics',
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    path: '/app/reports',
    iconName: 'ChartNoAxesCombined',
    description: 'Sales, product, inventory, and financial reports',
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    path: '/app/ai-assistant',
    iconName: 'Sparkles',
    description: 'Business insights assistant grounded in store data',
  },
];

export const MANAGEMENT_NAV_ITEMS: NavItem[] = [
  {
    id: 'settings-business',
    label: 'Settings',
    path: '/app/settings/business',
    iconName: 'Settings',
    description: 'Business profile, tax, currency, and preferences',
  },
  {
    id: 'settings-data',
    label: 'Data Management',
    path: '/app/settings/data-management',
    iconName: 'Database',
    description: 'JSON backup/restore, Excel export, and reset',
  },
];

export const ROUTE_BREADCRUMBS: Record<string, { title: string; group: string }> = {
  '/app/dashboard': { title: 'Overview', group: 'Main' },
  '/app/pos': { title: 'Point of Sale', group: 'Main' },
  '/app/inventory': { title: 'Inventory', group: 'Main' },
  '/app/finance': { title: 'Finance', group: 'Main' },
  '/app/employees': { title: 'Employees', group: 'Main' },
  '/app/customers': { title: 'Customers', group: 'Main' },
  '/app/reports': { title: 'Reports & Analytics', group: 'Main' },
  '/app/ai-assistant': { title: 'AI Assistant', group: 'Main' },
  '/app/settings/business': { title: 'Business Profile', group: 'Settings' },
  '/app/settings/preferences': { title: 'Preferences', group: 'Settings' },
  '/app/settings/data-management': { title: 'Data Management', group: 'Settings' },
};
