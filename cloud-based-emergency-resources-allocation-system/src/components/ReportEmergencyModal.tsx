import React, { useState } from 'react';
import {
  X,
  Flame,
  AlertTriangle,
  MapPin,
  Users,
  Camera,
  Upload,
  CheckCircle2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyType, PriorityLevel } from '@/src/types';

interface ReportEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportEmergencyModal: React.FC<ReportEmergencyModalProps> = ({ isOpen, onClose }) => {
  const { reportEmergency, currentUser } = useEmergency();

  const [type, setType] = useState<EmergencyType>('Fire');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [address, setAddress] = useState('850 Folsom Street, South of Market');
  const [sector, setSector] = useState('Sector Alpha-2');
  const [lat, setLat] = useState(37.7812);
  const [lng, setLng] = useState(-122.4045);
  const [description, setDescription] = useState('');
  const [affectedPeople, setAffectedPeople] = useState<number>(4);
  const [reporterName, setReporterName] = useState(currentUser.name);
  const [reporterPhone, setReporterPhone] = useState(currentUser.phone || '+1 (555) 019-2831');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  );
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Image presets for quick realistic selection
  const imagePresets: { label: string; url: string; type: EmergencyType }[] = [
    {
      label: 'Building Smoke/Fire',
      type: 'Fire',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Urban Flood/Water',
      type: 'Flood',
      url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Highway Collision',
      type: 'Accident',
      url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Structural Damage',
      type: 'Building Collapse',
      url: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Chemical / Hazmat Plume',
      type: 'Other',
      url: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setAddress(`GPS Pin: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Live Location)`);
        setSector('GPS Sector Auto');
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        setIsLocating(false);
        // graceful default
        setAddress('742 Market Street, Financial District (Fallback GPS)');
      },
      { timeout: 8000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = 'Incident location address is required';
    if (!description.trim()) newErrors.description = 'Please provide incident details & observed hazards';
    if (affectedPeople < 1) newErrors.affectedPeople = 'At least 1 affected individual required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    reportEmergency({
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
      imageUrl: imagePreview,
      reporterName,
      reporterPhone,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-7 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Report Emergency Incident
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transmits immediate dispatch telemetry to Emergency Operations Center
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Emergency Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Emergency Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EmergencyType)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
              >
                <option value="Fire">Fire (Commercial / High-Rise / Brush)</option>
                <option value="Flood">Flood (Flash Flood / Storm Surge)</option>
                <option value="Accident">Accident (Highway / Multi-vehicle)</option>
                <option value="Medical">Medical (Mass Casualty / Cardiac / Stroke)</option>
                <option value="Cyclone">Cyclone (Severe Gale / Storm)</option>
                <option value="Earthquake">Earthquake (Seismic Damage)</option>
                <option value="Building Collapse">Building Collapse (Structural Failure)</option>
                <option value="Other">Other (Hazmat / Gas Leak / Rescue)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Severity Priority <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setPriority(lvl)}
                    className={`py-2 rounded-xl text-[11px] font-bold border transition ${
                      priority === lvl
                        ? lvl === 'Critical'
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : lvl === 'High'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : lvl === 'Medium'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-xs'
                          : 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location & GPS Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Incident Location & Sector <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLocating}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS...' : 'Use Current Device GPS'}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, intersection, or landmark"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                    errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden`}
                />
                {errors.address && <p className="text-rose-500 text-[10px] mt-1">{errors.address}</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Sector / Zone"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Incident Description & Field Hazards <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the emergency: trapped individuals, fire spread, structural weakness, electrical wires down, toxic odor, water depth..."
              className={`w-full px-3 py-2.5 rounded-xl border ${
                errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden`}
            />
            {errors.description && <p className="text-rose-500 text-[10px] mt-1">{errors.description}</p>}
          </div>

          {/* Affected people & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Estimated Casualties / Trapped
              </label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={affectedPeople}
                  onChange={(e) => setAffectedPeople(parseInt(e.target.value) || 1)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reporter Name
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Callback Phone
              </label>
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
              />
            </div>
          </div>

          {/* Image Upload & Presets */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Field Photo / Visual Verification
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              {/* Preview image */}
              <div className="relative w-full sm:w-44 h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0">
                <img
                  src={imagePreview}
                  alt="Incident Scene"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium">Incident Photo Attachment</span>
                </div>
              </div>

              {/* Upload input & quick presets */}
              <div className="flex-1 space-y-2 w-full">
                <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 cursor-pointer text-slate-600 dark:text-slate-400 hover:text-rose-600 transition">
                  <Upload className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Upload Image from Device</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {/* Quick preset chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Or pick realistic scene preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setImagePreview(preset.url);
                          setType(preset.type);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] transition border ${
                          imagePreview === preset.url
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-submit-emergency"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-red-500 active:scale-98 transition"
            >
              <Flame className="w-4 h-4" />
              <span>Broadcast Emergency SOS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
