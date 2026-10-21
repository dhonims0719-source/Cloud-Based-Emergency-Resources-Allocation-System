import React, { useState } from 'react';
import {
  Users,
  Shield,
  Settings,
  Bell,
  Volume2,
  Cpu,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  Building2,
  Truck,
  HeartPulse,
  Radio,
  Sliders,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { UserRole } from '@/src/types';

export const UsersSettingsView: React.FC = () => {
  const { currentUser, switchRole, resetToMockData, logout } = useEmergency();

  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoAiAllocation, setAutoAiAllocation] = useState(true);
  const [gpsUpdateInterval, setGpsUpdateInterval] = useState('5s');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const roles: { role: UserRole; title: string; desc: string; icon: any }[] = [
    {
      role: 'admin',
      title: 'Incident Commander / Admin',
      desc: 'Full authorization to approve dispatches, adjust fleets, and broadcast alerts.',
      icon: Shield,
    },
    {
      role: 'officer',
      title: 'Emergency Dispatch Officer',
      desc: 'Triage intake, call center verification, and real-time squad dispatching.',
      icon: Radio,
    },
    {
      role: 'citizen',
      title: 'Citizen / Community Reporter',
      desc: 'Simplified reporting portal, safe shelter lookup, and emergency guide view.',
      icon: Users,
    },
  ];

  const handleReset = () => {
    resetToMockData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Roles & Operational Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Role-based access simulation, audio-visual dispatch alarms, and automated triage configurations
        </p>
      </div>

      {/* Role Switching Section */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-rose-500" />
            <span>Active Operator Profile & Access Tier</span>
          </h3>
          <p className="text-xs text-slate-400">
            Switch your active profile to test operational views from different agency perspectives
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roles.map((r) => {
            const isSelected = currentUser.role === r.role;
            const IconComponent = r.icon;

            return (
              <div
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 shadow-xs ring-2 ring-rose-500/20'
                    : 'glass-card border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {r.title}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Preferences */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <span>Dispatch & Operational Preferences</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Audio Alarm */}
          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Audible Alert for Critical Emergencies
              </div>
              <div className="text-[11px] text-slate-400">
                Play siren tone when a priority-1 critical incident is reported
              </div>
            </div>
            <button
              onClick={() => setSoundAlerts(!soundAlerts)}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                soundAlerts ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Automated AI recommendations */}
          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Automatic AI Resource Allocation Packages
              </div>
              <div className="text-[11px] text-slate-400">
                Pre-calculate optimal teams and vehicle dispatch upon incident verification
              </div>
            </div>
            <button
              onClick={() => setAutoAiAllocation(!autoAiAllocation)}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                autoAiAllocation ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoAiAllocation ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* GPS telemetry interval */}
          <div className="py-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Live GPS Asset Telemetry Polling Rate
              </div>
              <div className="text-[11px] text-slate-400">
                Update frequency for moving rescue vehicles on the tactical map
              </div>
            </div>
            <select
              value={gpsUpdateInterval}
              onChange={(e) => setGpsUpdateInterval(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
            >
              <option value="2s">Realtime (2 seconds)</option>
              <option value="5s">Standard (5 seconds)</option>
              <option value="15s">Battery Saver (15 seconds)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Session & Terminal Security */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Terminal Session
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticated as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()}) • {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            id="btn-settings-logout"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 font-bold text-xs transition active:scale-98 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Terminal & Log Out</span>
          </button>
        </div>
      </div>

      {/* Database & State Reset */}
      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-rose-700 dark:text-rose-400">
              Reset System Simulation State
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Restores all sample incidents, rescue squads, trauma hospital capacities, and fleet inventory to pristine demo conditions.
            </p>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition"
            >
              Reset Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
