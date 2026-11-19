import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Contact,
  Database,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { MANAGEMENT_NAV_ITEMS, MAIN_NAV_ITEMS, type NavItem } from '../../constants/navigation';
import { ROLE_LABELS } from '../../constants';
import { useAppStore } from '../../store/appStore';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';
import { NexaDeskLogo } from './NexaDeskLogo';

const ICON_MAP: Record<NavItem['iconName'], React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wallet,
  Users,
  Contact,
  ChartNoAxesCombined,
  Sparkles,
  Settings,
  Database,
};

export function Sidebar() {
  const navigate = useNavigate();
  const data = useAppStore((s) => s.data);
  const activeRole = useAppStore((s) => s.activeRole);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const mobileOpen = useAppStore((s) => s.mobileSidebarOpen);
  const setMobileOpen = useAppStore((s) => s.setMobileSidebarOpen);

  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const businessName = data?.business.name ?? 'Nexa Coffee House';
  const businessCategory = data?.business.category ?? 'Coffee Shop';

  const renderNavLink = (item: NavItem) => {
    const Icon = ICON_MAP[item.iconName];
    return (
      <NavLink
        key={item.id}
        to={item.path}
        title={collapsed ? item.label : undefined}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors duration-150',
            collapsed && 'justify-center px-2',
            isActive
              ? 'bg-[#EAF2FA] text-[#234F80]'
              : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                isActive ? 'text-[#234F80]' : 'text-[#64748B] group-hover:text-[#1E293B]'
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </>
        )}
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0]">
      {/* Brand Row */}
      <div
        className={cn(
          'h-[68px] flex items-center border-b border-[#E2E8F0] px-4 shrink-0',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <NavLink
          to="/app/dashboard"
          onClick={() => setMobileOpen(false)}
          className="focus-visible:outline-none"
        >
          <NexaDeskLogo collapsed={collapsed} />
        </NavLink>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Workspace / Business Selector */}
      <div className="p-3 border-b border-[#E2E8F0] relative">
        <button
          type="button"
          onClick={() => setWorkspaceOpen((o) => !o)}
          title={collapsed ? businessName : undefined}
          className={cn(
            'w-full flex items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-2 text-left hover:bg-[#F1F5F9] transition-colors cursor-pointer',
            collapsed && 'justify-center px-2'
          )}
        >
          <div className="h-7 w-7 rounded-md bg-[#234F80] text-white flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1E293B] truncate">
                  {businessName}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">{businessCategory}</p>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-[#64748B] shrink-0 transition-transform duration-150',
                  workspaceOpen && 'rotate-180'
                )}
              />
            </>
          )}
        </button>

        {workspaceOpen && (
          <div
            className={cn(
              'absolute z-30 mt-1.5 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.1)]',
              collapsed ? 'left-16 top-2 w-56' : 'left-3 right-3'
            )}
          >
            <div className="px-2.5 py-1.5">
              <p className="text-[11px] font-medium text-[#64748B]">Active Workspace</p>
              <p className="text-[13px] font-semibold text-[#1E293B] truncate">
                {businessName}
              </p>
            </div>
            <div className="my-1 border-t border-[#E2E8F0]" />
            <button
              type="button"
              onClick={() => {
                setWorkspaceOpen(false);
                setMobileOpen(false);
                navigate('/app/settings/business');
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-[13px] text-[#334155] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Business Profile Settings
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Navigation */}
      <nav
        aria-label="Primary Navigation"
        className="flex-1 overflow-y-auto nexa-scrollbar px-3 py-4 space-y-6"
      >
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold text-[#64748B] tracking-wide">
              Main Menu
            </p>
          )}
          {MAIN_NAV_ITEMS.map(renderNavLink)}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold text-[#64748B] tracking-wide">
              Management
            </p>
          )}
          {MANAGEMENT_NAV_ITEMS.map(renderNavLink)}
        </div>
      </nav>

      {/* Bottom Profile + Collapse Control */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-2 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="h-8 w-8 rounded-lg bg-[#14243A] text-white text-[12px] font-semibold flex items-center justify-center shrink-0">
              {getInitials(ROLE_LABELS[activeRole])}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[#1E293B] truncate">
                {ROLE_LABELS[activeRole]}
              </p>
              <p className="text-[11px] text-[#64748B] truncate">Local Workspace</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'hidden lg:flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4 shrink-0" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        style={{
          width: collapsed
            ? 'var(--sidebar-collapsed-width)'
            : 'var(--sidebar-width)',
        }}
        className="hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-200"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#14243A]/40 transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[260px] max-w-[85vw] h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
