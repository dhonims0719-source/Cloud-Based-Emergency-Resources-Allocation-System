import React from 'react';
import {
  AlertCircle,
  Flame,
  ShieldCheck,
  Users,
  Truck,
  Building2,
  Home,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Radio,
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyIncident } from '@/src/types';

interface DashboardViewProps {
  onOpenReportModal: () => void;
  onOpenIncidentModal: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenReportModal,
  onOpenIncidentModal,
}) => {
  const {
    metrics,
    incidents,
    teams,
    resources,
    hospitals,
    shelters,
    setActiveTab,
    setSelectedIncidentId,
    verifyIncident,
    runWorkflowSimulation,
    isSimulatingWorkflow,
  } = useEmergency();

  const criticalAndActiveIncidents = incidents
    .filter((i) => i.status !== 'Resolved')
    .sort((a, b) => (a.priority === 'Critical' ? -1 : 1));

  const resolvedIncidents = incidents.filter((i) => i.status === 'Resolved');

  // SVG Trend Chart Data for 24-hour incident trends
  const trendPoints = [
    { hour: '00:00', count: 3, resolved: 2 },
    { hour: '04:00', count: 1, resolved: 1 },
    { hour: '08:00', count: 6, resolved: 4 },
    { hour: '12:00', count: 11, resolved: 9 },
    { hour: '16:00', count: 14, resolved: 11 },
    { hour: '20:00', count: 8, resolved: 7 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Tactical Alert */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-rose-500/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>METRO EMERGENCY OPERATIONS COMMAND • SECTOR 1-4 ACTIVE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cloud-Based Emergency Resources Allocation System
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Real-time geospatial incident tracking, AI-assisted dispatch triage, inter-agency rescue fleet coordination, and hospital trauma bed synchronization.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenReportModal}
              id="btn-dash-report-sos"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-rose-500 hover:bg-rose-400 text-white text-xs sm:text-sm shadow-lg shadow-rose-500/30 transition active:scale-98"
            >
              <Flame className="w-4 h-4" />
              <span>Report Emergency Incident</span>
            </button>

            <button
              onClick={() => setActiveTab('allocation')}
              id="btn-dash-smart-alloc"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm border border-white/15 backdrop-blur-xs transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Resource Allocation Engine</span>
            </button>

            <button
              onClick={runWorkflowSimulation}
              disabled={isSimulatingWorkflow}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSimulatingWorkflow ? 'Running Workflow...' : 'Simulate 8-Step Lifecycle'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Emergencies */}
        <div
          onClick={() => setActiveTab('incidents')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Emergencies</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.totalEmergencies}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500">
            <span>{incidents.filter((i) => i.status !== 'Resolved').length} active open cases</span>
          </div>
        </div>

        {/* Critical Incidents */}
        <div
          onClick={() => setActiveTab('incidents')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40"
        >
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-xs font-semibold">Critical Incidents</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
            {metrics.criticalIncidents}
          </div>
          <div className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-300">
            Immediate dispatch required
          </div>
        </div>

        {/* Available Resources */}
        <div
          onClick={() => setActiveTab('resources')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Available Resources</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.availableResourcesCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Units across 5 supply depots
          </div>
        </div>

        {/* Active Rescue Teams */}
        <div
          onClick={() => setActiveTab('teams')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Active Rescue Teams</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.activeRescueTeamsCount} <span className="text-sm font-normal text-slate-400">/ {teams.length}</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {teams.filter((t) => t.status === 'Available').length} units on ready standby
          </div>
        </div>

        {/* Available Ambulances */}
        <div
          onClick={() => setActiveTab('resources')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Available Ambulances</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.availableAmbulancesCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            ALS & BLS Fleet Ready
          </div>
        </div>

        {/* Hospital Capacity */}
        <div
          onClick={() => setActiveTab('hospitals')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Hospital Occupancy</span>
            <Building2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.hospitalBedOccupancyPct}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {hospitals.reduce((acc, h) => acc + h.availableBeds, 0)} open trauma beds
          </div>
        </div>

        {/* Shelter Capacity */}
        <div
          onClick={() => setActiveTab('shelters')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Shelter Occupancy</span>
            <Home className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.shelterOccupancyPct}%
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {shelters.reduce((acc, s) => acc + s.availableCapacity, 0)} available capacity
          </div>
        </div>

        {/* Response-Time Analytics */}
        <div
          onClick={() => setActiveTab('reports')}
          className="glass-card apple-card rounded-2xl p-4 sm:p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Avg. Response Time</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {metrics.avgResponseTimeMins} <span className="text-sm font-normal text-slate-400">min</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            1.4m faster than regional SLA
          </div>
        </div>
      </div>

      {/* Main Content Layout: Active Triage Table + Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Triage & Active Incidents Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Active Operational Incidents
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time incident queue sorted by triage priority
              </p>
            </div>

            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({incidents.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalAndActiveIncidents.map((incident) => {
              const assignedCount =
                (incident.allocatedResources?.rescueTeamIds?.length || 0) +
                (incident.allocatedResources?.ambulanceIds?.length || 0);

              return (
                <div
                  key={incident.id}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          {incident.id}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            incident.priority === 'Critical'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : incident.priority === 'High'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {incident.priority}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {incident.type}
                        </span>

                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                          ● {incident.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {incident.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 block">
                        {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {incident.affectedPeople} trapped/injured
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {incident.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{incident.location.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {incident.status === 'Reported' && (
                        <button
                          onClick={() => verifyIncident(incident.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-500 transition"
                        >
                          Verify & AI Triage
                        </button>
                      )}

                      {incident.status === 'Verified' && (
                        <button
                          onClick={() => {
                            setSelectedIncidentId(incident.id);
                            setActiveTab('allocation');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-semibold text-[11px] hover:bg-amber-400 transition"
                        >
                          Smart Allocate
                        </button>
                      )}

                      <button
                        onClick={() => onOpenIncidentModal(incident.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px] transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Statistics, Response Analytics & Hospital Saturation */}
        <div className="space-y-4">
          {/* Emergency Trends SVG Chart */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Emergency Volume (24h)</h4>
                <p className="text-[11px] text-slate-400">Reported vs. Resolved caseload</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +18%
              </span>
            </div>

            {/* Custom Bar Visualization */}
            <div className="pt-2 h-40 flex items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              {trendPoints.map((pt) => {
                const heightPct = (pt.count / 16) * 100;
                const resolvedPct = (pt.resolved / 16) * 100;

                return (
                  <div key={pt.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end gap-1 h-32 justify-center">
                      {/* Incidents bar */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-3 rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-500 relative"
                        title={`${pt.count} reported at ${pt.hour}`}
                      />
                      {/* Resolved bar */}
                      <div
                        style={{ height: `${resolvedPct}%` }}
                        className="w-3 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-500"
                        title={`${pt.resolved} resolved at ${pt.hour}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{pt.hour}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Incidents
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved
              </span>
            </div>
          </div>

          {/* Hospital Readiness & Bed Crunch */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>Hospital Triage Grid</span>
              </h4>
              <button
                onClick={() => setActiveTab('hospitals')}
                className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {hospitals.map((hosp) => {
                const occ = Math.round(((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100);
                return (
                  <div key={hosp.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                      <span className="truncate pr-2">{hosp.name}</span>
                      <span
                        className={`font-bold ${
                          occ > 80 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {occ}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          occ > 80 ? 'bg-rose-500' : occ > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occ}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{hosp.availableBeds} beds free</span>
                      <span>{hosp.icuAvailable} ICU free</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI Operations Hotline */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI Decision Support Hotlink</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Need immediate surge hazard modeling, resource deficit analysis, or casualty evacuation routing?
            </p>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition"
            >
              Consult AI Operations Specialist →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
