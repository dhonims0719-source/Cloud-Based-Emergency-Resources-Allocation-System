import React, { useState } from 'react';
import {
  Users,
  Shield,
  Phone,
  MapPin,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  ChevronRight,
  X,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { RescueTeam, TeamSpecialization, TeamStatus } from '@/src/types';

export const RescueTeamsView: React.FC = () => {
  const { teams, addRescueTeam, updateTeamStatus, incidents, setActiveTab, setSelectedIncidentId } =
    useEmergency();

  const [searchTerm, setSearchTerm] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<RescueTeam | null>(null);

  // New Team Form State
  const [name, setName] = useState('');
  const [leader, setLeader] = useState('');
  const [specialization, setSpecialization] = useState<TeamSpecialization>('Urban Search & Rescue');
  const [stationAddress, setStationAddress] = useState('Central Fire Station 1, 676 Howard St');
  const [membersCount, setMembersCount] = useState(8);
  const [phone, setPhone] = useState('+1 (555) 901-2000');
  const [vehicleAssigned, setVehicleAssigned] = useState('Tactical Rescue Carrier 4');

  const filteredTeams = teams.filter((t) => {
    if (specFilter !== 'All' && t.specialization !== specFilter) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.leader.toLowerCase().includes(q) ||
        t.stationLocation.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !leader.trim()) return;

    const newTeam: RescueTeam = {
      id: `TM-${Math.floor(100 + Math.random() * 899)}`,
      name,
      leader,
      membersCount,
      members: [leader, 'Operator A', 'Operator B', 'Medic C', 'Technician D'],
      specialization,
      stationLocation: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.03,
        lng: -122.4194 + (Math.random() - 0.5) * 0.03,
        address: stationAddress,
        sector: 'Sector Metro Central',
      },
      status: 'Available',
      phone,
      vehicleAssigned,
      equipmentCertified: ['Hydraulic Extrication', 'Advanced Triage Level 3', 'Thermal Sonar'],
    };

    addRescueTeam(newTeam);
    setShowAddModal(false);
    setName('');
    setLeader('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Specialized Rescue Force Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time readiness status, squad credentials, dispatch assignment, and field tactical links
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-rescue-team"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Register Rescue Unit</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams by callsign, leader, or station..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
          >
            <option value="All">All Specializations</option>
            <option value="Urban Search & Rescue">Urban Search & Rescue</option>
            <option value="Swiftwater Rescue">Swiftwater Rescue</option>
            <option value="Hazmat Containment">Hazmat Containment</option>
            <option value="High-Angle Extraction">High-Angle Extraction</option>
            <option value="Trauma Triage">Trauma Triage</option>
            <option value="Wildfire Ops">Wildfire Ops</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Dispatched">Dispatched</option>
            <option value="En Route">En Route</option>
            <option value="On Scene">On Scene</option>
            <option value="Resting">Resting</option>
          </select>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => {
          const assignedInc = incidents.find((i) => i.id === team.assignedIncidentId);

          return (
            <div
              key={team.id}
              className="glass-card apple-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {team.id}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                        {team.specialization}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                      {team.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      team.status === 'Available'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : team.status === 'On Scene'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Squad Leader:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{team.leader}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Complement:</span>
                    <span>{team.membersCount} certified operators</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{team.stationLocation.address}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{team.phone}</span>
                  </div>
                </div>

                {/* Assigned Incident pill */}
                {assignedInc ? (
                  <div
                    onClick={() => {
                      setSelectedIncidentId(assignedInc.id);
                      setActiveTab('incidents');
                    }}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs flex items-center justify-between cursor-pointer hover:border-rose-400 transition"
                  >
                    <div>
                      <span className="text-[10px] text-rose-500 font-bold block uppercase">Assigned Case</span>
                      <span className="font-semibold text-rose-800 dark:text-rose-200 truncate block max-w-[200px]">
                        {assignedInc.id} • {assignedInc.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-500" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400">
                    No active incident assigned. Ready for dispatch.
                  </div>
                )}
              </div>

              {/* Status changer dropdown & detail trigger */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <select
                  value={team.status}
                  onChange={(e) => updateTeamStatus(team.id, e.target.value as TeamStatus)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="Available">Set Available</option>
                  <option value="Dispatched">Set Dispatched</option>
                  <option value="En Route">Set En Route</option>
                  <option value="On Scene">Set On Scene</option>
                  <option value="Resting">Set Resting</option>
                </select>

                <button
                  onClick={() => setSelectedTeam(team)}
                  className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                >
                  View Roster
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Roster Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">{selectedTeam.id}</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedTeam.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">Squad Roster ({selectedTeam.members.length} members)</span>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  {selectedTeam.members.map((m, idx) => (
                    <div key={idx} className="px-3 py-2 flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{m}</span>
                      <span className="text-[10px] text-slate-400">{idx === 0 ? 'Team Commander' : `Operator #${idx + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">Equipment Qualifications</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeam.equipmentCertified.map((eq) => (
                    <span key={eq} className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Register Specialized Rescue Force</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Call Sign / Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. USAR Task Force Gamma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Leader / Commander</label>
                  <input
                    type="text"
                    required
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                    placeholder="Capt. J. Miller"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value as TeamSpecialization)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Urban Search & Rescue">Urban Search & Rescue</option>
                    <option value="Swiftwater Rescue">Swiftwater Rescue</option>
                    <option value="Hazmat Containment">Hazmat Containment</option>
                    <option value="High-Angle Extraction">High-Angle Extraction</option>
                    <option value="Trauma Triage">Trauma Triage</option>
                    <option value="Wildfire Ops">Wildfire Ops</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Fire Station / Depot Address</label>
                <input
                  type="text"
                  value={stationAddress}
                  onChange={(e) => setStationAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Operator Complement</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={membersCount}
                    onChange={(e) => setMembersCount(parseInt(e.target.value) || 8)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Vehicle</label>
                  <input
                    type="text"
                    value={vehicleAssigned}
                    onChange={(e) => setVehicleAssigned(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-md"
                >
                  Enroll Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
