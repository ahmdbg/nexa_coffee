import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storageService';
import type {
  AppSettings,
  Business,
  EmployeeRole,
  NexaDeskData,
  ServiceResult,
} from '../types';

interface AppState {
  data: NexaDeskData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  corruptedRawData: string | null;

  activeRole: EmployeeRole;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  isAuthenticated: boolean;

  initializeApp: () => void;
  refreshData: () => void;
  updateBusinessProfile: (
    patch: Partial<Omit<Business, 'id' | 'createdAt' | 'updatedAt'>>
  ) => ServiceResult<NexaDeskData>;
  updateSettings: (patch: Partial<AppSettings>) => ServiceResult<NexaDeskData>;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => ServiceResult<NexaDeskData>;
  restoreFromBackup: () => ServiceResult<NexaDeskData>;
  setActiveRole: (role: EmployeeRole) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  loginDemo: () => void;
  logoutDemo: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  data: null,
  isLoading: true,
  isSaving: false,
  error: null,
  corruptedRawData: null,

  activeRole: 'owner',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  isAuthenticated: true,

  initializeApp: () => {
    set({ isLoading: true, error: null });
    const result = storageService.initializeOrLoad();
    if (result.status === 'corrupted' || !result.data) {
      set({
        data: null,
        isLoading: false,
        error: result.error ?? 'Failed to load application data.',
        corruptedRawData: result.rawCorrupted ?? null,
      });
      return;
    }

    set({
      data: result.data,
      isLoading: false,
      error: null,
      corruptedRawData: null,
    });
  },

  refreshData: () => {
    const res = storageService.getData();
    if (res.success && res.data) {
      set({ data: res.data, error: null });
    } else {
      set({ error: res.error ?? 'Unable to refresh data from storage.' });
    }
  },

  updateBusinessProfile: (patch) => {
    const current = get().data;
    if (!current) {
      return { success: false, error: 'Application data is not loaded.' };
    }
    set({ isSaving: true });
    const now = new Date().toISOString();
    const res = storageService.updateData((draft) => ({
      ...draft,
      business: {
        ...draft.business,
        ...patch,
        updatedAt: now,
      },
      settings: {
        ...draft.settings,
        currency: patch.currency ?? draft.settings.currency,
      },
      auditLogs: [
        {
          id: uuidv4(),
          action: 'BUSINESS_UPDATED',
          entityType: 'business',
          entityId: draft.business.id,
          actorName: ROLE_ACTOR_NAME(get().activeRole),
          summary: `Updated business profile (${patch.name ?? draft.business.name})`,
          createdAt: now,
        },
        ...draft.auditLogs,
      ],
    }));

    if (res.success && res.data) {
      set({ data: res.data, isSaving: false, error: null });
    } else {
      set({ isSaving: false });
    }
    return res;
  },

  updateSettings: (patch) => {
    set({ isSaving: true });
    const now = new Date().toISOString();
    const res = storageService.updateData((draft) => ({
      ...draft,
      settings: {
        ...draft.settings,
        ...patch,
      },
      business: {
        ...draft.business,
        currency: patch.currency ?? draft.business.currency,
        updatedAt: now,
      },
    }));

    if (res.success && res.data) {
      set({ data: res.data, isSaving: false, error: null });
    } else {
      set({ isSaving: false });
    }
    return res;
  },

  markNotificationRead: (notificationId) => {
    const res = storageService.updateData((draft) => ({
      ...draft,
      notifications: draft.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
    if (res.success && res.data) {
      set({ data: res.data });
    }
  },

  markAllNotificationsRead: () => {
    const res = storageService.updateData((draft) => ({
      ...draft,
      notifications: draft.notifications.map((n) => ({ ...n, read: true })),
    }));
    if (res.success && res.data) {
      set({ data: res.data });
    }
  },

  resetToDemoData: () => {
    set({ isSaving: true });
    const res = storageService.resetData();
    if (res.success && res.data) {
      set({
        data: res.data,
        isSaving: false,
        error: null,
        corruptedRawData: null,
      });
    } else {
      set({ isSaving: false, error: res.error ?? 'Failed to reset data.' });
    }
    return res;
  },

  restoreFromBackup: () => {
    set({ isSaving: true });
    const res = storageService.restoreBackup();
    if (res.success && res.data) {
      set({
        data: res.data,
        isSaving: false,
        error: null,
        corruptedRawData: null,
      });
    } else {
      set({ isSaving: false });
    }
    return res;
  },

  setActiveRole: (role) => set({ activeRole: role }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  loginDemo: () => set({ isAuthenticated: true }),
  logoutDemo: () => set({ isAuthenticated: false }),
}));

function ROLE_ACTOR_NAME(role: EmployeeRole): string {
  switch (role) {
    case 'owner':
      return 'Elena Vance (Owner)';
    case 'manager':
      return 'Marcus Chen (Manager)';
    case 'cashier':
      return 'Sofia Alverez (Cashier)';
    case 'inventory_staff':
      return 'Daniel Park (Inventory)';
  }
}
