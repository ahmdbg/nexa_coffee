import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const SETTINGS_TABS = [
  { label: 'Business Profile', path: '/app/settings/business' },
  { label: 'Preferences', path: '/app/settings/preferences' },
  { label: 'Data Management', path: '/app/settings/data-management' },
];

export function SettingsTabs() {
  return (
    <div className="border-b border-[#E2E8F0] flex items-center gap-6 overflow-x-auto">
      {SETTINGS_TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            cn(
              'py-3 text-[14px] font-medium border-b-2 transition-colors whitespace-nowrap shrink-0',
              isActive
                ? 'border-[#234F80] text-[#234F80]'
                : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
