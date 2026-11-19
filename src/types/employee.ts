export type EmployeeRole = 'owner' | 'manager' | 'cashier' | 'inventory_staff';

export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: string;
  name: string;
  position: string;
  role: EmployeeRole;
  phone?: string;
  email?: string;
  salary?: number;
  status: EmployeeStatus;
  joinDate: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
