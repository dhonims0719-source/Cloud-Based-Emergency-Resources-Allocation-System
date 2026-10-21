import React, { useState } from 'react';
import {
  ShieldAlert,
  Bell,
  Sun,
  Moon,
  Radio,
  Play,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Cloud,
  ChevronDown,
  LogOut,
  Menu,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { UserRole } from '@/src/types';

export const Navbar: React.FC<{
  onOpenReportModal: () => void;
  onToggleMobileMenu?: () => void;
}> = ({ onOpenReportModal, onToggleMobileMenu }) => {
  const {
    currentUser,
    switchRole,
    logout,
    theme,
    toggleTheme,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveTab,
    isCloudSynced,
    runWorkflowSimulation,
    isSimulatingWorkflow,
    resetToMockData,
    metrics,
    setSelectedIncidentId,
  } = useEmergency();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-16 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand & Live Operational Status */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation Drawer"
            className="p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white shadow-lg shadow-rose-500/20">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              EOC Cloud
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              Operations Center
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Grid Active
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline text-[11px]">
              {metrics.criticalIncidents} Critical | {metrics.activeRescueTeamsCount} Teams Deployed
            </span>
          </div>
        </div>
      </div>

      {/* Center / Fast Guided Workflow CTA */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
        <button
          onClick={runWorkflowSimulation}
          disabled={isSimulatingWorkflow}
          id="btn-run-simulation"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            isSimulatingWorkflow
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-rose-600 dark:hover:text-rose-400 shadow-xs'
          }`}
          title="Run end-to-end emergency incident and dispatch simulation"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isSimulatingWorkflow ? 'Simulating Workflow...' : 'Simulate 8-Step Lifecycle'}
        </button>

        <button
          onClick={resetToMockData}
          id="btn-reset-data"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition"
          title="Reset sample data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset</span>
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Report Emergency Button */}
        <button
          onClick={onOpenReportModal}
          id="btn-report-emergency-header"
          className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 active:scale-98 transition"
        >
          <Flame className="w-4 h-4" />
          <span>Report SOS</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-theme-toggle"
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            id="btn-notifications-toggle"
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Live Tactical Alerts</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-medium">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No notifications in feed.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.incidentId) {
                          setSelectedIncidentId(notif.incidentId);
                          setActiveTab('incidents');
                        }
                        setShowNotifications(false);
                      }}
                      className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                        !notif.read ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`font-semibold ${
                            notif.level === 'critical'
                              ? 'text-rose-600 dark:text-rose-400'
                              : notif.level === 'warning'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            id="btn-user-role-menu"
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
              {currentUser.name[0]}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none text-left">
              <span className="text-[11px] font-semibold text-slate-900 dark:text-white">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role selector dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                <div className="mt-1 text-[10px] text-slate-400">{currentUser.department || 'Civilian Access'}</div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role
                </div>
                {(['admin', 'officer', 'citizen'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition ${
                      currentUser.role === r
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="capitalize">{r === 'admin' ? 'Admin (Incident Commander)' : r === 'officer' ? 'Emergency Officer' : 'Citizen Portal'}</span>
                    {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Cloud & Firebase Architecture</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  id="btn-navbar-logout"
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out / Switch Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Log Out Icon Button */}
        <button
          onClick={logout}
          id="btn-quick-header-logout"
          title="Sign Out / Return to Login Page"
          className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
