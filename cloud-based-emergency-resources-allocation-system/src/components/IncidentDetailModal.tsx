import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Shield,
  Truck,
  HeartPulse,
  Flame,
  CheckCircle2,
  Building2,
  Home,
  AlertTriangle,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyIncident, IncidentStatus } from '@/src/types';

interface IncidentDetailModalProps {
  incidentId: string | null;
  onClose: () => void;
  onOpenAllocation: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incidentId,
  onClose,
  onOpenAllocation,
}) => {
  const {
    incidents,
    teams,
    resources,
    hospitals,
    shelters,
    verifyIncident,
    updateIncidentStatus,
    resolveIncident,
    assignHospitalCase,
    assignShelterCase,
    currentUser,
  } = useEmergency();

  const [notesInput, setNotesInput] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('HOSP-01');
  const [selectedShelterId, setSelectedShelterId] = useState('SHT-01');
  const [casualtyRoutingCount, setCasualtyRoutingCount] = useState(2);
  const [evacueeRoutingCount, setEvacueeRoutingCount] = useState(4);

  if (!incidentId) return null;
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  const assignedTeams = teams.filter((t) => incident.allocatedResources?.rescueTeamIds?.includes(t.id));
  const assignedHospital = hospitals.find((h) => h.id === incident.assignedHospitalId);
  const assignedShelter = shelters.find((s) => s.id === incident.assignedShelterId);

  const handleStatusChange = (newStatus: IncidentStatus) => {
    if (newStatus === 'Resolved') {
      resolveIncident(incident.id, notesInput || 'Incident resolved and area stabilized.');
    } else {
      updateIncidentStatus(incident.id, newStatus, notesInput);
    }
    setNotesInput('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-7 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700">
                {incident.id}
              </span>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  incident.priority === 'Critical'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : incident.priority === 'High'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                }`}
              >
                {incident.priority} Priority
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {incident.type}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                Status: {incident.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight pt-1">
              {incident.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print / Save Briefing"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
          {/* Top metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incident Location</span>
              <div className="mt-1 flex items-start gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{incident.location.address}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {incident.location.sector} • GPS: {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Casualties / Trapped</span>
              <div className="mt-1 font-bold text-base text-rose-600 dark:text-rose-400">
                {incident.affectedPeople} Persons
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Reported by {incident.reporterName} ({incident.reporterRole})
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Initial Report Time</span>
              <div className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                {new Date(incident.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(incident.reportedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Image & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {incident.imageUrl && (
              <div className="sm:col-span-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-36 bg-slate-100 dark:bg-slate-800">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className={incident.imageUrl ? 'sm:col-span-2' : 'sm:col-span-3'}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Field Situation Overview</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                {incident.description}
              </p>
            </div>
          </div>

          {/* AI Decision Support Review */}
          {incident.aiAnalysis && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Tactical Decision Support (Score: {incident.aiAnalysis.severityScore}/10)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-semibold">
                  Human Approval Required
                </span>
              </div>
              <p className="text-slate-700 dark:text-purple-100 text-xs">
                {incident.aiAnalysis.hazardSummary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-purple-300/40">
                  Target Rec: {incident.aiAnalysis.recommendedTeams.join(', ')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-purple-300/40">
                  Ambulances: {incident.aiAnalysis.recommendedAmbulances} units
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-purple-300/40">
                  Fire Units: {incident.aiAnalysis.recommendedFireTrucks}
                </span>
              </div>
            </div>
          )}

          {/* Allocated Resources Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-500" />
                <span>Assigned Fleet & Units</span>
              </h3>

              {incident.status === 'Verified' || incident.status === 'Reported' ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAllocation();
                  }}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Smart Allocation Engine</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : null}
            </div>

            {assignedTeams.length === 0 &&
            (!incident.allocatedResources?.ambulanceIds || incident.allocatedResources.ambulanceIds.length === 0) ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 flex items-center justify-between">
                <span>No resources currently dispatched for this incident.</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAllocation();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-semibold text-xs shadow-xs"
                >
                  Allocate Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{team.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {team.specialization} • Lead: {team.leader}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {team.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hospital & Shelter Coordination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Hospital Card / Assignment */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>Hospital Casualty Routing</span>
              </div>

              {assignedHospital ? (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{assignedHospital.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {assignedHospital.type} • {assignedHospital.availableBeds} beds available ({assignedHospital.icuAvailable} ICU)
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => setSelectedHospitalId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.availableBeds} beds)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignHospitalCase(incident.id, selectedHospitalId, casualtyRoutingCount)}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 text-xs transition"
                  >
                    Assign {casualtyRoutingCount} Casualty Beds
                  </button>
                </div>
              )}
            </div>

            {/* Shelter Evacuation Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Home className="w-4 h-4 text-blue-500" />
                <span>Displaced Civilian Shelter</span>
              </div>

              {assignedShelter ? (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                  <div className="font-bold text-slate-800 dark:text-slate-100">{assignedShelter.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {assignedShelter.district} • {assignedShelter.availableCapacity} spots remaining
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <select
                    value={selectedShelterId}
                    onChange={(e) => setSelectedShelterId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    {shelters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.availableCapacity} slots)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignShelterCase(incident.id, selectedShelterId, evacueeRoutingCount)}
                    className="w-full py-1.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 text-xs transition"
                  >
                    Route {evacueeRoutingCount} Displaced Evacuees
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2 pt-2">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Incident Operational Timeline & Audit Log</span>
            </h3>

            <div className="space-y-2 border-l-2 border-rose-500/30 ml-2 pl-3">
              {incident.timeline.map((event) => (
                <div key={event.id} className="relative pb-2">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{event.step}</span>
                    <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    By {event.actor} ({event.actorRole})
                  </div>
                  {event.details && <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{event.details}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Lifecycle Operations */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {incident.status === 'Reported' && (
              <button
                onClick={() => verifyIncident(incident.id)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 text-xs shadow-xs"
              >
                Verify Incident
              </button>
            )}

            {incident.status === 'Verified' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAllocation();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-400 text-xs shadow-xs"
              >
                Authorize Dispatch Package
              </button>
            )}

            {incident.status === 'Dispatched' && (
              <button
                onClick={() => handleStatusChange('On Scene')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 text-xs shadow-xs"
              >
                Confirm Units Arrived On Scene
              </button>
            )}

            {incident.status === 'On Scene' && (
              <button
                onClick={() => handleStatusChange('Resolved')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 text-xs shadow-xs"
              >
                Declare Incident Resolved
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
