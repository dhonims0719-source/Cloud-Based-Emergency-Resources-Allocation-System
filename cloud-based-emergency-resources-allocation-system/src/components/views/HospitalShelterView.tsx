import React, { useState } from 'react';
import {
  Building2,
  Home,
  Bed,
  HeartPulse,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Shield,
  Coffee,
  Check,
  Search,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';

export const HospitalShelterView: React.FC = () => {
  const { hospitals, shelters, updateHospitalBeds, updateShelterCapacity, incidents } =
    useEmergency();

  const [activeTab, setActiveSubTab] = useState<'hospitals' | 'shelters'>('hospitals');
  const [searchTerm, setSearchTerm] = useState('');

  // Bed allocation quick modal/state
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [bedsToDeduct, setBedsToDeduct] = useState(2);
  const [icuToDeduct, setIcuToDeduct] = useState(1);

  // Evacuee routing state
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [evacueesToAdd, setEvacueesToAdd] = useState(5);

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShelters = shelters.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Trauma Hospitals & Civilian Shelters
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Emergency department bed availability, critical care ICU surge capacity, and humanitarian evacuation shelters
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-white/50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveSubTab('hospitals')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'hospitals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Trauma Hospitals ({hospitals.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('shelters')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'shelters'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Evacuation Shelters ({shelters.length})</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Hospital Trauma Beds</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {hospitals.reduce((acc, h) => acc + h.availableBeds, 0)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {hospitals.reduce((acc, h) => acc + h.totalBeds, 0)} available
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Critical ICU Slots</span>
          <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {hospitals.reduce((acc, h) => acc + h.icuAvailable, 0)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {hospitals.reduce((acc, h) => acc + h.icuTotal, 0)} open
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Civic Shelter Capacity</span>
          <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {shelters.reduce((acc, s) => acc + s.availableCapacity, 0)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              / {shelters.reduce((acc, s) => acc + s.maxCapacity, 0)} slots
            </span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Humanitarian Evacuees Housed</span>
          <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {shelters.reduce((acc, s) => acc + s.currentEvacuees, 0)}
          </div>
        </div>
      </div>

      {/* Hospitals View */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHospitals.map((hosp) => {
              const occPct = Math.round(
                ((hosp.totalBeds - hosp.availableBeds) / hosp.totalBeds) * 100
              );
              const icuOccPct = Math.round(
                ((hosp.icuTotal - hosp.icuAvailable) / hosp.icuTotal) * 100
              );

              return (
                <div
                  key={hosp.id}
                  className="glass-card apple-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {hosp.id}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                          {hosp.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                        {hosp.name}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        occPct > 85
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : occPct > 70
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}
                    >
                      {occPct}% Full
                    </span>
                  </div>

                  {/* Bed Occupancy Gauge */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">General Trauma Beds:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {hosp.availableBeds} / {hosp.totalBeds} Available
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            occPct > 85 ? 'bg-rose-500' : occPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${occPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">ICU Life Support Slots:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {hosp.icuAvailable} / {hosp.icuTotal} Open
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${icuOccPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capabilities Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {hosp.traumaLevel && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900">
                        {hosp.traumaLevel}
                      </span>
                    )}
                    {hosp.burnCenter && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-900">
                        🔥 Burn ICU Ready
                      </span>
                    )}
                    {hosp.helipad && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900">
                        🚁 Helipad Active
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hosp.location.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.phone} • Triage Director: Dr. {hosp.director}</span>
                    </div>
                  </div>

                  {/* Quick Allocation Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400">Emergency Casualty Bed Intake:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateHospitalBeds(hosp.id, -1, 0)}
                        disabled={hosp.availableBeds <= 0}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs disabled:opacity-40"
                      >
                        -1 Bed
                      </button>
                      <button
                        onClick={() => updateHospitalBeds(hosp.id, 1, 0)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
                      >
                        +1 Discharge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shelters View */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShelters.map((shlt) => {
              const occPct = Math.round((shlt.currentEvacuees / shlt.maxCapacity) * 100);

              return (
                <div
                  key={shlt.id}
                  className="glass-card apple-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {shlt.id}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/25">
                          {shlt.district}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                        {shlt.name}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        occPct > 85
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                      }`}
                    >
                      {occPct}% Full
                    </span>
                  </div>

                  {/* Evacuee Capacity Gauge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Evacuation Intake Status:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {shlt.availableCapacity} / {shlt.maxCapacity} Vacancies
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${occPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Supply Reserves */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block font-semibold">Food & Water Rations</span>
                      <strong className="text-slate-800 dark:text-slate-200">{shlt.foodSuppliesDays} Days Reserve</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-400 text-[10px] block font-semibold">Medical First Aid Kits</span>
                      <strong className="text-slate-800 dark:text-slate-200">{shlt.medicalSuppliesDays} Days Reserve</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{shlt.location.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manager: {shlt.manager} • {shlt.phone}</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {shlt.petFriendly ? '🐶 Pets Permitted' : 'No Pets'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Intake Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400">Route Evacuees:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateShelterCapacity(shlt.id, 5)}
                        disabled={shlt.availableCapacity < 5}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs disabled:opacity-40"
                      >
                        +5 Evacuees
                      </button>
                      <button
                        onClick={() => updateShelterCapacity(shlt.id, -5)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs"
                      >
                        -5 Discharged
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
