import React, { useState } from 'react';
import {
  AlertCircle,
  Flame,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyType, PriorityLevel, IncidentStatus } from '@/src/types';

interface EmergencyManagementViewProps {
  onOpenReportModal: () => void;
  onOpenIncidentModal: (id: string) => void;
}

export const EmergencyManagementView: React.FC<EmergencyManagementViewProps> = ({
  onOpenReportModal,
  onOpenIncidentModal,
}) => {
  const {
    incidents,
    verifyIncident,
    setActiveTab,
    setSelectedIncidentId,
    resolveIncident,
  } = useEmergency();

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filteredIncidents = incidents.filter((inc) => {
    if (typeFilter !== 'All' && inc.type !== typeFilter) return false;
    if (priorityFilter !== 'All' && inc.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.address.toLowerCase().includes(q) ||
        inc.location.sector?.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Emergency Incident Operations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive triage registry, verification status, and inter-agency dispatch ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white/50 dark:bg-slate-800/50">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Card Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={onOpenReportModal}
            id="btn-report-emergency-incident-view"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs font-bold shadow-md shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Incident</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Incident ID, address, street, or description..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="All">All Types</option>
              <option value="Fire">Fire</option>
              <option value="Flood">Flood</option>
              <option value="Accident">Accident</option>
              <option value="Medical">Medical</option>
              <option value="Cyclone">Cyclone</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Building Collapse">Building Collapse</option>
              <option value="Other">Other</option>
            </select>

            {/* Priority selector */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Status selector */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="Allocating">Allocating</option>
              <option value="Dispatched">Dispatched</option>
              <option value="On Scene">On Scene</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Showing {filteredIncidents.length} of {incidents.length} recorded incidents</span>
          {(typeFilter !== 'All' || priorityFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setTypeFilter('All');
                setPriorityFilter('All');
                setStatusFilter('All');
                setSearchTerm('');
              }}
              className="text-rose-600 dark:text-rose-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Table Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((incident) => {
            const isResolved = incident.status === 'Resolved';

            return (
              <div
                key={incident.id}
                className="glass-card apple-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {incident.id}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            incident.priority === 'Critical'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : incident.priority === 'High'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {incident.priority}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {incident.type}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                        {incident.title}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 ${
                        isResolved
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : incident.status === 'Dispatched' || incident.status === 'On Scene'
                          ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {incident.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate">{incident.location.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Casualties: <strong className="text-rose-600 dark:text-rose-400">{incident.affectedPeople}</strong></span>
                    <span>Reported: {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {incident.status === 'Reported' && (
                      <button
                        onClick={() => verifyIncident(incident.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition"
                      >
                        Verify Incident
                      </button>
                    )}

                    {incident.status === 'Verified' && (
                      <button
                        onClick={() => {
                          setSelectedIncidentId(incident.id);
                          setActiveTab('allocation');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-xs transition"
                      >
                        Allocate Resources
                      </button>
                    )}

                    {(incident.status === 'Dispatched' || incident.status === 'On Scene') && (
                      <button
                        onClick={() => resolveIncident(incident.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition"
                      >
                        Resolve Case
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenIncidentModal(incident.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition"
                  >
                    <span>View Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Casualties</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => onOpenIncidentModal(inc.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {inc.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inc.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                            : inc.priority === 'High'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        }`}
                      >
                        {inc.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {inc.location.address}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                      {inc.affectedPeople}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{inc.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenIncidentModal(inc.id)}
                        className="px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
