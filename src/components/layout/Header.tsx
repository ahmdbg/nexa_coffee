import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCheck,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '../../constants';
import { MAIN_NAV_ITEMS, MANAGEMENT_NAV_ITEMS, ROUTE_BREADCRUMBS } from '../../constants/navigation';
import { useAppStore } from '../../store/appStore';
import { selectUnreadNotifications } from '../../store/selectors';
import { useToast } from '../../store/toastStore';
import type { EmployeeRole } from '../../types';
import { cn } from '../../utils/cn';
import { formatDateTime } from '../../utils/date';
import { getInitials } from '../../utils/formatters';
import { Button, Modal } from '../ui';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const data = useAppStore((s) => s.data);
  const activeRole = useAppStore((s) => s.activeRole);
  const setActiveRole = useAppStore((s) => s.setActiveRole);
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const logoutDemo = useAppStore((s) => s.logoutDemo);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = selectUnreadNotifications(data);
  const notifications = data?.notifications ?? [];
  const crumb = ROUTE_BREADCRUMBS[location.pathname] ?? {
    title: 'Workspace',
    group: 'Main',
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const quickJumpItems = useMemo(() => {
    const navEntries = [...MAIN_NAV_ITEMS, ...MANAGEMENT_NAV_ITEMS].map((item) => ({
      id: item.id,
      label: item.label,
      meta: item.description ?? 'Navigation route',
      path: item.path,
    }));
    const productEntries = (data?.products ?? []).slice(0, 6).map((p) => ({
      id: p.id,
      label: p.name,
      meta: `Product · ${p.sku} · Stock: ${p.stock} ${p.unit}`,
      path: '/app/inventory',
    }));
    const all = [...navEntries, ...productEntries];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return navEntries;
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const handleRoleSwitch = (role: EmployeeRole) => {
    setActiveRole(role);
    setProfileOpen(false);
    toast.info('Active role switched', `Simulated view: ${ROLE_LABELS[role]}`);
  };

  const handleSignOut = () => {
    setProfileOpen(false);
    logoutDemo();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-[68px] bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile drawer button + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] min-w-0">
            <Link
              to="/app/dashboard"
              className="text-[#64748B] hover:text-[#1E293B] transition-colors whitespace-nowrap hidden sm:inline"
            >
              {data?.business.name ?? 'NexaDesk'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8] shrink-0 hidden sm:inline" />
            <span className="text-[#64748B] whitespace-nowrap hidden md:inline">
              {crumb.group}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8] shrink-0 hidden md:inline" />
            <span className="font-semibold text-[#1E293B] truncate">{crumb.title}</span>
          </nav>
        </div>

        {/* Right: Quick Search, Notifications, Help, Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="h-9 px-3 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Quick jump...</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              aria-label="Notifications"
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#DC5555] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12)] z-40 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#1E293B]">
                    Notifications ({unreadNotifications.length} unread)
                  </span>
                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[#234F80] hover:underline cursor-pointer"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-[13px] text-[#64748B]">
                      No notifications available.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifOpen(false);
                          if (n.link) navigate(n.link);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer',
                          !n.read && 'bg-[#EAF2FA]/40'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium text-[#1E293B]">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="text-[11px] font-medium text-[#234F80] shrink-0">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#64748B] leading-relaxed">
                          {n.message}
                        </p>
                        <p className="mt-1 text-[11px] text-[#94A3B8]">
                          {formatDateTime(n.createdAt)}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="Help and architecture info"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              aria-label="Account and role menu"
              className="h-9 pl-1.5 pr-2.5 inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <span className="h-6 w-6 rounded-md bg-[#234F80] text-white text-[11px] font-semibold flex items-center justify-center">
                {getInitials(ROLE_LABELS[activeRole])}
              </span>
              <span className="hidden md:inline text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
                {ROLE_LABELS[activeRole]}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#E2E8F0] bg-white shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12)] z-40 p-2">
                <div className="px-2.5 py-2 border-b border-[#E2E8F0]">
                  <p className="text-[12px] font-medium text-[#64748B]">
                    Simulated Role View
                  </p>
                  <p className="text-[13px] font-semibold text-[#1E293B]">
                    {ROLE_LABELS[activeRole]}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#64748B]">
                    {ROLE_PERMISSIONS[activeRole].join(' · ')}
                  </p>
                </div>

                <div className="py-1.5 space-y-0.5">
                  <p className="px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
                    Switch Role
                  </p>
                  {(Object.keys(ROLE_LABELS) as EmployeeRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSwitch(role)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer',
                        activeRole === role
                          ? 'bg-[#EAF2FA] text-[#234F80] font-medium'
                          : 'text-[#334155] hover:bg-[#F1F5F9]'
                      )}
                    >
                      <span>{ROLE_LABELS[role]}</span>
                      {activeRole === role && <UserCheck className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="my-1 border-t border-[#E2E8F0]" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/app/settings/business');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-[#64748B]" />
                  Business Settings
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] text-[#DC5555] hover:bg-[#FDECEC] cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out (Demo Auth)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Jump Search Modal */}
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Quick Jump"
        description="Search modules or Nexa Coffee House catalog records."
        size="md"
      >
        <div className="space-y-3">
          <div className="relative flex items-center">
            <Search className="h-4 w-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a module name or product SKU..."
              className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#4C83C3]"
            />
          </div>
          <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-xl overflow-hidden max-h-72 overflow-y-auto">
            {quickJumpItems.length === 0 ? (
              <p className="p-4 text-[13px] text-[#64748B] text-center">
                No matching modules or products found.
              </p>
            ) : (
              quickJumpItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    navigate(item.path);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F8FAFC] flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#1E293B]">{item.label}</p>
                    <p className="text-[12px] text-[#64748B]">{item.meta}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#94A3B8] shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="NexaDesk Workspace Guide"
        description="Local-first personal business management platform."
        footer={<Button onClick={() => setHelpOpen(false)}>Close</Button>}
      >
        <div className="space-y-4 text-[14px] text-[#475569] leading-relaxed">
          <p>
            NexaDesk operates with a single centralized local dataset persisted in browser
            Local Storage under the key <code className="font-mono text-[12px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#14243A]">nexadesk_data</code>.
          </p>
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-2 text-[13px]">
            <p className="font-semibold text-[#1E293B]">Current Foundation Build (Phase 1)</p>
            <ul className="list-disc pl-5 space-y-1 text-[#475569]">
              <li>Design tokens, responsive AppLayout, and React Router navigation</li>
              <li>Zod-validated schemas and atomic storageService persistence</li>
              <li>Zustand global store with derived single-source-of-truth selectors</li>
              <li>Consistent Nexa Coffee House seed dataset</li>
            </ul>
          </div>
          <p className="text-[12px] text-[#64748B]">
            Note: Role switching and authentication screens are frontend UI simulations for demonstration purposes.
          </p>
        </div>
      </Modal>
    </>
  );
}
