import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Users,
  Truck,
  HeartPulse,
  Flame,
  Building2,
  Home,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCw,
  Send,
  Check,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { AllocatedResources, RescueTeam, ResourceItem } from '@/src/types';

export const SmartAllocationView: React.FC = () => {
  const {
    incidents,
    teams,
    resources,
    hospitals,
    shelters,
    selectedIncidentId,
    setSelectedIncidentId,
    recommendAllocation,
    approveAndDispatch,
    setActiveTab,
    currentUser,
  } = useEmergency();

  // Pick selected or first non-resolved incident
  const activeIncident =
    incidents.find((i) => i.id === selectedIncidentId) ||
    incidents.find((i) => i.status !== 'Resolved') ||
    incidents[0];

  const [customTeams, setCustomTeams] = useState<string[]>([]);
  const [customAmbulances, setCustomAmbulances] = useState<string[]>([]);
  const [customFireTrucks, setCustomFireTrucks] = useState<string[]>([]);
  const [customVehicles, setCustomVehicles] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(3); // 1: Emergency -> 2: Severity -> 3: Nearest -> 4: Recommend -> 5: Approve -> 6: Dispatch

  // Initialize or re-run auto-recommendation
  const handleRunRecommendation = () => {
    if (!activeIncident) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const rec = recommendAllocation(activeIncident.id);
      setCustomTeams(rec.rescueTeamIds);
      setCustomAmbulances(rec.ambulanceIds);
      setCustomFireTrucks(rec.fireTruckIds);
      setCustomVehicles(rec.vehicleIds);
      setIsAnalyzing(false);
      setHasCalculated(true);
    }, 600);
  };

  // Run on mount or incident change if empty
  React.useEffect(() => {
    if (activeIncident) {
      const rec = activeIncident.allocatedResources?.rescueTeamIds?.length
        ? activeIncident.allocatedResources
        : recommendAllocation(activeIncident.id);
      setCustomTeams(rec.rescueTeamIds || []);
      setCustomAmbulances(rec.ambulanceIds || []);
      setCustomFireTrucks(rec.fireTruckIds || []);
      setCustomVehicles(rec.vehicleIds || []);
      setHasCalculated(true);
    }
  }, [activeIncident?.id]);

  if (!activeIncident) {
    return (
      <div className="p-12 text-center text-slate-500">
        No incidents available for smart allocation.
      </div>
    );
  }

  const handleToggleTeam = (teamId: string) => {
    setCustomTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleToggleResource = (resId: string, category: string) => {
    if (category === 'Ambulance') {
      setCustomAmbulances((prev) =>
        prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
      );
    } else if (category === 'Fire Truck') {
      setCustomFireTrucks((prev) =>
        prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
      );
    } else {
      setCustomVehicles((prev) =>
        prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
      );
    }
  };

  const handleAuthorizeDispatch = () => {
    const finalAllocations: AllocatedResources = {
      rescueTeamIds: customTeams,
      ambulanceIds: customAmbulances,
      fireTruckIds: customFireTrucks,
      vehicleIds: customVehicles,
      equipment: [
        { name: 'MCI Rapid Response Trauma Pack', quantity: 6 },
        { name: 'Oxygen Life Support Modules', quantity: 4 },
      ],
      supplies: [
        { name: 'Sterile Burn & Trauma Dressing', quantity: 20, unit: 'kits' },
        { name: 'Emergency Hydration Units', quantity: 50, unit: 'liters' },
      ],
    };

    approveAndDispatch(activeIncident.id, finalAllocations);
    setActiveTab('map');
  };

  const isAlreadyDispatched =
    activeIncident.status === 'Dispatched' ||
    activeIncident.status === 'On Scene' ||
    activeIncident.status === 'Resolved';

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Incident Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Optimization Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Smart Resource Allocation Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated severity triage, closest depot proximity detection, and multi-agency dispatch packaging
          </p>
        </div>

        {/* Incident Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Target Incident:</label>
          <select
            value={activeIncident.id}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.slice(0, 30)}... ({i.priority})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6-Stage Operational Workflow Breadcrumbs */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] text-xs">
          {[
            { step: 1, label: 'Emergency Reported', status: 'done' },
            { step: 2, label: 'Analyze Severity', status: 'done' },
            { step: 3, label: 'Find Nearest Resources', status: 'done' },
            { step: 4, label: 'Recommend Allocation', status: 'active' },
            {
              step: 5,
              label: 'Admin Approval',
              status: isAlreadyDispatched ? 'done' : 'pending',
            },
            {
              step: 6,
              label: 'Field Dispatch',
              status: isAlreadyDispatched ? 'done' : 'pending',
            },
          ].map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    s.status === 'done'
                      ? 'bg-emerald-500 text-white'
                      : s.status === 'active'
                      ? 'bg-purple-600 text-white ring-4 ring-purple-500/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.status === 'done' ? <Check className="w-3.5 h-3.5" /> : s.step}
                </div>
                <span
                  className={`font-semibold ${
                    s.status === 'active'
                      ? 'text-purple-600 dark:text-purple-400'
                      : s.status === 'done'
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 bg-slate-200 dark:bg-slate-700" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Target Incident Context Card */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {activeIncident.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeIncident.priority === 'Critical'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}
              >
                {activeIncident.priority} Priority
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeIncident.type}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeIncident.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Reported Casualties</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                {activeIncident.affectedPeople} Persons
              </span>
            </div>
            <button
              onClick={handleRunRecommendation}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold transition"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Recalculate AI Package</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          {activeIncident.description}
        </p>
      </div>

      {/* Two-Column Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Rescue Teams Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>1. Specialized Rescue Teams</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {customTeams.length} Selected
            </span>
          </div>

          <div className="space-y-2.5">
            {teams.map((team) => {
              const isSelected = customTeams.includes(team.id);
              const isBusy = team.status !== 'Available' && team.assignedIncidentId !== activeIncident.id;

              return (
                <div
                  key={team.id}
                  onClick={() => !isBusy && handleToggleTeam(team.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-500 shadow-xs'
                      : isBusy
                      ? 'opacity-60 bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                      : 'glass-card border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {team.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {team.id}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>{team.specialization}</span>
                      <span>•</span>
                      <span>{team.membersCount} Specialists</span>
                      <span>•</span>
                      <span>ETA ~4 mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        team.status === 'Available'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {team.status}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Fleet & Equipment Inventory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>2. Emergency Fleet & Hardware</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {customAmbulances.length + customFireTrucks.length + customVehicles.length} Units Picked
            </span>
          </div>

          <div className="space-y-2.5">
            {resources
              .filter((r) => ['Ambulance', 'Fire Truck', 'Rescue Vehicle'].includes(r.category))
              .map((res) => {
                const isSelected =
                  customAmbulances.includes(res.id) ||
                  customFireTrucks.includes(res.id) ||
                  customVehicles.includes(res.id);
                const isOutOfStock = res.availableCount <= 0;

                return (
                  <div
                    key={res.id}
                    onClick={() => !isOutOfStock && handleToggleResource(res.id, res.category)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 shadow-xs'
                        : isOutOfStock
                        ? 'opacity-50 bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        : 'glass-card border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {res.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {res.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {res.depotLocation} • {res.availableCount} of {res.totalCount} ready
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Medical & Evacuation Supplies Kit */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
              3. Automatic Medical Supplies & Rations Pod
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-900 dark:text-white block">Trauma & Burn First Aid</span>
                <span className="text-[11px] text-slate-500">15 MCI Kits allocated</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-900 dark:text-white block">Potable Water & Rations</span>
                <span className="text-[11px] text-slate-500">50 L Water + 40 MRE Packs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Authorization Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-white">Incident Commander Dispatch Authorization</span>
          </div>
          <p className="text-xs text-slate-300">
            Package: {customTeams.length} Rescue Teams, {customAmbulances.length} Ambulances, {customFireTrucks.length} Fire Engines, {customVehicles.length} Specialty Craft.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAuthorizeDispatch}
            id="btn-approve-dispatch"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 active:scale-98 transition"
          >
            <Send className="w-4 h-4" />
            <span>Approve & Dispatch Units</span>
          </button>
        </div>
      </div>
    </div>
  );
};
