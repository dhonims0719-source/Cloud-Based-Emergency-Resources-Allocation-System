import React from 'react';
import {
  LayoutDashboard,
  AlertCircle,
  Cpu,
  Boxes,
  Users,
  MapPin,
  Building2,
  Home,
  UserCheck,
  Bot,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  Flame,
  X,
  ChevronRight,
  LogOut,
  FileText,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { ActiveNavTab } from '@/src/types';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenReportModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const { activeTab, setActiveTab, metrics, notifications, incidents, currentUser, logout } = useEmergency();

  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems: {
    id: ActiveNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'incidents',
      label: 'Emergency Incidents',
      icon: AlertCircle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'allocation',
      label: 'Smart Allocation',
      icon: Cpu,
      badge: metrics.criticalIncidents > 0 ? `${metrics.criticalIncidents} Req` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'resources',
      label: 'Resource Depot',
      icon: Boxes,
      badge: metrics.availableResourcesCount,
      badgeColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    },
    {
      id: 'teams',
      label: 'Rescue Teams',
      icon: Users,
      badge: metrics.activeRescueTeamsCount > 0 ? `${metrics.activeRescueTeamsCount} Out` : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'map',
      label: 'Live Tactical Map',
      icon: MapPin,
    },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: Building2,
      badge: `${metrics.hospitalBedOccupancyPct}%`,
      badgeColor: metrics.hospitalBedOccupancyPct > 80 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    },
    {
      id: 'shelters',
      label: 'Shelters',
      icon: Home,
      badge: `${metrics.shelterOccupancyPct}%`,
      badgeColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    },
    {
      id: 'citizen',
      label: 'Citizen Portal',
      icon: UserCheck,
    },
    {
      id: 'incident-form',
      label: 'Incident Report Form',
      icon: FileText,
      badge: 'SOS',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'ai-assistant',
      label: 'AI EOC Assistant',
      icon: Bot,
      badge: 'Support',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: ShieldCheck,
    },
    {
      id: 'settings',
      label: 'Cloud & Firebase',
      icon: Settings,
    },
  ];

  const handleSelectTab = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in drawer */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 lg:hidden">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">Emergency Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header */}
        <div className="px-4 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Command Modules
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md leading-none ${
                        item.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info widget */}
        <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/80 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span>Operational Read</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">DEFCON 4</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Mutual Aid Agreements active with 4 municipal sectors.
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {currentUser.name[0]}
              </div>
              <span className="text-[10px] font-semibold truncate text-slate-700 dark:text-slate-300">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
            <button
              onClick={logout}
              id="btn-sidebar-logout"
              title="Sign Out from EOC Terminal"
              className="flex items-center gap-1 text-[10px] text-rose-600 dark:text-rose-400 hover:text-rose-700 font-bold px-1.5 py-0.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
