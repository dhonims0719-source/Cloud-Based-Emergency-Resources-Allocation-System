import React, { useState } from 'react';
import {
  Flame,
  Phone,
  Home,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  LifeBuoy,
  MapPin,
  Clock,
  Compass,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyIncident } from '@/src/types';

interface CitizenPortalViewProps {
  onOpenReportModal: () => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  onOpenReportModal,
}) => {
  const { incidents, shelters } = useEmergency();

  const [trackingId, setTrackingId] = useState('');
  const [trackedIncident, setTrackedIncident] = useState<EmergencyIncident | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<string>('earthquake');

  const handleTrackIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = incidents.find(
      (i) => i.id.toLowerCase() === trackingId.trim().toLowerCase()
    );
    setTrackedIncident(found || null);
  };

  const emergencyContacts = [
    { title: 'Emergency Dispatch (Life-Threatening)', number: '911', desc: 'Police, Fire, Ambulance' },
    { title: 'Disaster Relief Hotline', number: '1-800-621-3362', desc: 'FEMA & State Operations' },
    { title: 'National Poison Control Center', number: '1-800-222-1222', desc: 'Chemical & Toxin Triage' },
    { title: 'Civil Defense Evacuation Coordination', number: '(555) 911-EVAC', desc: 'Shelter & Transport' },
  ];

  const safetyGuides = {
    earthquake: {
      title: 'Earthquake Survival Protocol',
      steps: [
        'DROP to hands and knees immediately to prevent being knocked over.',
        'COVER your head and neck beneath a sturdy table or desk. If no shelter is nearby, drop near an interior wall.',
        'HOLD ON until shaking stops. Protect your vital organs from falling debris.',
        'Stay indoors until the shaking completely ceases and exit routes are inspected for structural integrity.',
      ],
      hazardNotice: 'Watch for ruptured gas lines and downed electrical wires upon evacuating.',
    },
    fire: {
      title: 'Building Fire Evacuation Protocol',
      steps: [
        'Stay low beneath smoke layers where clean air is concentrated.',
        'Feel doors with the back of your hand before opening. If hot, use an alternate escape route.',
        'Never use elevators during a structural fire; use illuminated emergency stairwells.',
        'Once outside, rendezvous at designated assembly safe zones and do not re-enter.',
      ],
      hazardNotice: 'Close doors behind you to compartmentalize oxygen and stall fire progression.',
    },
    flood: {
      title: 'Flash Flood & Inundation Safety',
      steps: [
        'Immediately seek higher ground. Avoid basements, subway tunnels, and subterranean garages.',
        'Never walk, swim, or drive through moving floodwaters. Just 6 inches of water can sweep a vehicle.',
        'Disconnect electrical mains if safe to do so before flood waters enter dwellings.',
        'Monitor emergency broadcast radio channels for flash flood warnings and dam alerts.',
      ],
      hazardNotice: 'Floodwaters frequently carry hazardous bio-waste and submerged electrical hazards.',
    },
    medical: {
      title: 'Severe Trauma First Aid Triage',
      steps: [
        'Call 911 or trigger SOS immediately via this portal.',
        'Apply direct, firm pressure on bleeding wounds using sterile cloths or compression bandages.',
        'Keep patients warm and still to mitigate hemorrhagic shock.',
        'Do NOT move victims with suspected spinal trauma unless immediate environmental peril exists.',
      ],
      hazardNotice: 'Begin bystander CPR if the patient is unresponsive and has no detectable carotid pulse.',
    },
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* SOS Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>CITIZEN EMERGENCY ASSISTANCE PORTAL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Are You Experiencing an Emergency?
          </h2>

          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
            Report an incident in under 30 seconds. Your GPS coordinates and report details are beamed directly to the nearest fire station, rescue squad, and trauma center.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenReportModal}
              id="btn-citizen-report-sos"
              className="px-6 py-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xl active:scale-98 transition flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Report Emergency Incident Now</span>
            </button>
            <a
              href="tel:911"
              className="px-5 py-3 rounded-2xl bg-rose-900/50 hover:bg-rose-900/70 border border-white/20 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call 911 Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Incident Status Tracker */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-rose-500" />
            <span>Track Emergency Report Status</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your 7-character Incident ID (e.g. INC-101) to verify unit dispatch and live status
          </p>
        </div>

        <form onSubmit={handleTrackIncident} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Incident ID (e.g. INC-101, INC-102)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition"
          >
            Track Status
          </button>
        </form>

        {hasSearched && (
          <div className="pt-2">
            {trackedIncident ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">{trackedIncident.id}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{trackedIncident.title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                    Status: {trackedIncident.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Location: <strong>{trackedIncident.location.address}</strong>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>Reported</span>
                    <span>Verified</span>
                    <span>Units Dispatched</span>
                    <span>On Scene</span>
                    <span>Resolved</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width:
                          trackedIncident.status === 'Reported'
                            ? '20%'
                            : trackedIncident.status === 'Verified'
                            ? '40%'
                            : trackedIncident.status === 'Dispatched'
                            ? '60%'
                            : trackedIncident.status === 'On Scene'
                            ? '80%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  {trackedIncident.status === 'Dispatched'
                    ? 'Emergency crews and ambulance units are currently en route to your reported coordinates.'
                    : trackedIncident.status === 'On Scene'
                    ? 'Units have arrived at the scene. Please stay in a safe position.'
                    : trackedIncident.status === 'Resolved'
                    ? 'This incident has been fully resolved by field operations.'
                    : 'Dispatch controllers are verifying report details and mobilizing nearby units.'}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
                Incident ID <strong>{trackingId}</strong> not found. Please verify the ID or submit a new emergency report.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emergency Hotlines & Nearby Shelters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hotlines */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>Official Emergency Hotlines</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{contact.title}</div>
                  <div className="text-[11px] text-slate-400">{contact.desc}</div>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-100 transition"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Safe Evacuation Shelters */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="w-4 h-4 text-purple-500" />
            <span>Open Civic Evacuation Shelters</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {shelters.slice(0, 3).map((shelter) => (
              <div key={shelter.id} className="py-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{shelter.name}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {shelter.availableCapacity} spots free
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{shelter.location.address} • {shelter.district}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disaster Preparedness Guides */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Official Life-Safety Action Protocols</span>
          </h3>
          <p className="text-xs text-slate-400">Standard operating procedures for immediate civilian defense</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(safetyGuides).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedGuide(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedGuide === key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {key} Action Guide
            </button>
          ))}
        </div>

        {/* Selected Guide Details */}
        {safetyGuides[selectedGuide as keyof typeof safetyGuides] && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {safetyGuides[selectedGuide as keyof typeof safetyGuides].title}
            </h4>

            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              {safetyGuides[selectedGuide as keyof typeof safetyGuides].steps.map((st, i) => (
                <li key={i} className="leading-relaxed">
                  {st}
                </li>
              ))}
            </ol>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{safetyGuides[selectedGuide as keyof typeof safetyGuides].hazardNotice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
