import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Users,
  Camera,
  Upload,
  CheckCircle2,
  Navigation,
  Sparkles,
  Phone,
  ShieldAlert,
  ArrowRight,
  LifeBuoy,
  Building2,
  HeartPulse,
  Truck,
  Car,
  Home,
  Info,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyType, PriorityLevel, EmergencyIncident } from '@/src/types';

interface IncidentFormViewProps {
  onSubmitted?: (incidentId: string) => void;
}

export const IncidentFormView: React.FC<IncidentFormViewProps> = ({ onSubmitted }) => {
  const { reportEmergency, currentUser, setActiveTab, setSelectedIncidentId } = useEmergency();

  const [type, setType] = useState<EmergencyType>('Fire');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [address, setAddress] = useState('850 Folsom Street, South of Market');
  const [sector, setSector] = useState('Sector Alpha-2');
  const [lat, setLat] = useState(37.7812);
  const [lng, setLng] = useState(-122.4045);
  const [description, setDescription] = useState('');
  const [affectedPeople, setAffectedPeople] = useState<number>(3);
  const [reporterName, setReporterName] = useState(currentUser.name || 'Citizen Reporter');
  const [reporterPhone, setReporterPhone] = useState(currentUser.phone || '+1 (555) 019-2831');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<EmergencyIncident | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick photo presets
  const imagePresets: { label: string; url: string; type: EmergencyType }[] = [
    {
      label: 'Building Fire / Smoke',
      type: 'Fire',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Urban Flood / Water',
      type: 'Flood',
      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Vehicle Collision',
      type: 'Accident',
      url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Structural Collapse',
      type: 'Building Collapse',
      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const emergencyTypes: { type: EmergencyType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'Fire', label: 'Structural Fire', icon: Flame },
    { type: 'Medical', label: 'Severe Medical Trauma', icon: HeartPulse },
    { type: 'Accident', label: 'Vehicle Crash / Pileup', icon: Car },
    { type: 'Flood', label: 'Flash Flood / Rising Water', icon: Truck },
    { type: 'Building Collapse', label: 'Structural Collapse', icon: Building2 },
    { type: 'Earthquake', label: 'Earthquake Damage', icon: AlertTriangle },
    { type: 'Cyclone', label: 'Severe Storm / Cyclone', icon: LifeBuoy },
    { type: 'Other', label: 'General Hazard', icon: ShieldAlert },
  ];

  // Browser Geolocation auto-detect
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(parseFloat(pos.coords.latitude.toFixed(4)));
          setLng(parseFloat(pos.coords.longitude.toFixed(4)));
          setAddress(`Near ${pos.coords.latitude.toFixed(3)}°N, ${Math.abs(pos.coords.longitude).toFixed(3)}°W (GPS Verified)`);
          setSector('Sector Delta-Live');
          setIsLocating(false);
        },
        () => {
          // Fallback location
          setAddress('450 Mission Street, Financial District');
          setSector('Sector Alpha-1');
          setLat(37.7901);
          setLng(-122.3998);
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = 'Incident location address is required.';
    if (!description.trim()) newErrors.description = 'Please describe the emergency situation.';
    if (!reporterName.trim()) newErrors.reporterName = 'Reporter identity is required for verification.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newIncident = reportEmergency({
        title: `${type} Emergency at ${address.split(',')[0]}`,
        type,
        priority,
        location: {
          lat,
          lng,
          address,
          sector,
        },
        description,
        affectedPeople,
        reporterName,
        reporterPhone,
        reporterRole: currentUser.role === 'citizen' ? 'Citizen' : 'Emergency Officer',
        imageUrl: imagePreview,
      });

      setIsSubmitting(false);
      setSubmittedIncident(newIncident);
      if (onSubmitted) {
        onSubmitted(newIncident.id);
      }
    }, 450);
  };

  if (submittedIncident) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-8 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Incident Transmitted to EOC Dispatch Grid
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Emergency Report Successfully Registered
          </h2>

          <p className="text-emerald-100 text-sm max-w-lg mx-auto">
            Your emergency report has been assigned unique identifier{' '}
            <strong className="text-white font-mono bg-emerald-800/40 px-2 py-0.5 rounded-md">
              {submittedIncident.id}
            </strong>
            . First responders, medical dispatchers, and evacuation teams have been alerted.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedIncidentId(submittedIncident.id);
                setActiveTab('citizen');
              }}
              id="btn-view-tracking"
              className="px-6 py-3 rounded-2xl bg-white text-emerald-700 font-bold text-sm shadow-lg hover:bg-emerald-50 transition active:scale-98 flex items-center gap-2"
            >
              <span>Track Live Incident Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedIncident(null);
                setDescription('');
              }}
              id="btn-report-another"
              className="px-5 py-3 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800/80 border border-white/20 text-white font-bold text-sm transition"
            >
              Report Another Emergency
            </button>
          </div>
        </div>

        {/* Dispatch Summary Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Incident Command Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
              <strong className="text-slate-900 dark:text-white">{submittedIncident.location.address}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported Type & Priority</span>
              <strong className="text-slate-900 dark:text-white">
                {submittedIncident.type} • {submittedIncident.priority} Priority
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
            <LifeBuoy className="w-3.5 h-3.5 animate-spin" />
            <span>CITIZEN EMERGENCY REPORTING FORM • DIRECT EOC UPLINK</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Report an Active Emergency Incident
          </h1>

          <p className="text-rose-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Fill in the details below to dispatch emergency rescue squads, fire suppression engines, and trauma ambulances directly to your GPS coordinates.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="tel:911"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-rose-600 font-bold text-xs shadow-md hover:bg-rose-50 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 911 Hotline</span>
            </a>
            <button
              onClick={() => setActiveTab('citizen')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/60 border border-white/20 text-white text-xs font-semibold hover:bg-rose-900/80 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Find Evacuation Shelters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
        {/* Step 1: Emergency Hazard Category */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>1. Select Emergency Hazard Type</span>
            <span className="text-rose-500 text-[11px] font-semibold">Immediate Priority Triage</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {emergencyTypes.map((item) => {
              const Icon = item.icon;
              const isSelected = type === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setType(item.type)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 active:scale-98 ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Code: {item.type}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Location & GPS */}
        <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Incident Location & Geolocation
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              id="btn-detect-gps"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 text-xs font-bold hover:bg-indigo-100 transition disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Acquire My GPS Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Street Address / Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 850 Folsom Street or Corner of 4th & Market"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-rose-500"
                />
              </div>
              {errors.address && <p className="text-[11px] text-rose-500">{errors.address}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                City Sector / District
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. Sector Alpha-2"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Coordinates: Lat {lat}, Lng {lng}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Signal Locked</span>
          </div>
        </div>

        {/* Step 3: Severity, Casualties & Description */}
        <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Severity & Situation Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Perceived Danger Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      priority === lvl
                        ? lvl === 'Critical'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : lvl === 'High'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Affected people counter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Estimated Persons at Risk / Trapped</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{affectedPeople} People</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={affectedPeople}
                  onChange={(e) => setAffectedPeople(parseInt(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description of Emergency Scene
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe smoke, flames, trapped individuals, road blockages, chemical odors, or special medical needs..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-rose-500"
            />
            {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
          </div>
        </div>

        {/* Step 4: Photo / Visual Evidence */}
        <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>4. Visual Evidence / Photo Documentation</span>
            <span className="text-slate-400 text-[10px]">Optional for AI Pre-Triage</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {imagePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setImagePreview(preset.url)}
                className={`relative rounded-xl overflow-hidden border text-left group ${
                  imagePreview === preset.url
                    ? 'ring-2 ring-rose-500 border-rose-500'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  referrerPolicy="no-referrer"
                  className="h-16 w-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/75 text-[10px] font-semibold text-white px-1.5 py-0.5 truncate block">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-rose-500" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-slate-400">Supports JPEG, PNG, HEIC from mobile cameras</span>
          </div>
        </div>

        {/* Step 5: Reporter Contact Details */}
        <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            5. Civilian Contact Info (For Dispatch Call-Back)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              {errors.reporterName && <p className="text-[11px] text-rose-500">{errors.reporterName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number for Dispatch Confirmation
              </label>
              <input
                type="tel"
                required
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit SOS Button */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-submit-incident-form"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-600/30 transition active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Broadcasting SOS to Municipal EOC...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5" />
                <span>Submit Emergency Report Now (Broadcast SOS)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
