import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  Search,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Shield,
  Truck,
  HeartPulse,
  Flame,
  Building2,
  Home,
  AlertTriangle,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { EmergencyIncident, Hospital, RescueTeam, Shelter } from '@/src/types';

interface LiveEmergencyMapViewProps {
  onOpenIncidentModal: (id: string) => void;
}

export const LiveEmergencyMapView: React.FC<LiveEmergencyMapViewProps> = ({
  onOpenIncidentModal,
}) => {
  const {
    incidents,
    teams,
    resources,
    hospitals,
    shelters,
    selectedIncidentId,
    setSelectedIncidentId,
    setActiveTab,
  } = useEmergency();

  // Layer toggles
  const [showEmergencies, setShowEmergencies] = useState(true);
  const [showTeams, setShowTeams] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);

  // Zoom & Pan state for tactical vector map
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [activePin, setActivePin] = useState<{
    id: string;
    type: 'incident' | 'team' | 'hospital' | 'shelter' | 'safeZone';
    title: string;
    data: any;
    x: number;
    y: number;
  } | null>(null);

  // Coordinate projection from lat/lng around San Francisco/Metro Bay (37.72 to 37.82 lat, -122.49 to -122.38 lng)
  // Map canvas is 1000 x 650
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 650;
  const MIN_LAT = 37.72;
  const MAX_LAT = 37.81;
  const MIN_LNG = -122.49;
  const MAX_LNG = -122.38;

  const projectCoords = (lat: number, lng: number) => {
    const normX = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
    const normY = 1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT); // Invert Y
    const x = Math.max(40, Math.min(MAP_WIDTH - 40, normX * MAP_WIDTH));
    const y = Math.max(40, Math.min(MAP_HEIGHT - 40, normY * MAP_HEIGHT));
    return { x, y };
  };

  // Pre-calculated coordinates for all entities
  const mappedIncidents = useMemo(() => {
    return incidents.map((inc) => {
      const pos = projectCoords(inc.location.lat, inc.location.lng);
      return { ...inc, posX: pos.x, posY: pos.y };
    });
  }, [incidents]);

  const mappedTeams = useMemo(() => {
    return teams.map((team) => {
      const pos = projectCoords(team.stationLocation.lat, team.stationLocation.lng);
      return { ...team, posX: pos.x, posY: pos.y };
    });
  }, [teams]);

  const mappedHospitals = useMemo(() => {
    return hospitals.map((hosp) => {
      const pos = projectCoords(hosp.location.lat, hosp.location.lng);
      return { ...hosp, posX: pos.x, posY: pos.y };
    });
  }, [hospitals]);

  const mappedShelters = useMemo(() => {
    return shelters.map((shlt) => {
      const pos = projectCoords(shlt.location.lat, shlt.location.lng);
      return { ...shlt, posX: pos.x, posY: pos.y };
    });
  }, [shelters]);

  // Safe Evacuation Assembly Zones
  const safeZones = [
    { id: 'SZ-1', name: 'Alamo Square Assembly Safe Zone', lat: 37.776, lng: -122.434, cap: 2000 },
    { id: 'SZ-2', name: 'Marina Green Sea Evacuation Point', lat: 37.805, lng: -122.438, cap: 3500 },
    { id: 'SZ-3', name: 'Mission Dolores Park Staging Area', lat: 37.759, lng: -122.427, cap: 2500 },
  ];

  const mappedSafeZones = useMemo(() => {
    return safeZones.map((sz) => {
      const pos = projectCoords(sz.lat, sz.lng);
      return { ...sz, posX: pos.x, posY: pos.y };
    });
  }, []);

  // Selected incident for route tracking
  const selectedIncident = mappedIncidents.find((i) => i.id === selectedIncidentId) || mappedIncidents[0];

  // Find nearest team & nearest hospital to the selected incident
  const nearestTeam = useMemo(() => {
    if (!selectedIncident) return null;
    let closest = mappedTeams[0];
    let minD = 999999;
    mappedTeams.forEach((t) => {
      const dist = Math.hypot(t.posX - selectedIncident.posX, t.posY - selectedIncident.posY);
      if (dist < minD) {
        minD = dist;
        closest = t;
      }
    });
    return closest;
  }, [selectedIncident, mappedTeams]);

  const nearestHospital = useMemo(() => {
    if (!selectedIncident) return null;
    let closest = mappedHospitals[0];
    let minD = 999999;
    mappedHospitals.forEach((h) => {
      const dist = Math.hypot(h.posX - selectedIncident.posX, h.posY - selectedIncident.posY);
      if (dist < minD) {
        minD = dist;
        closest = h;
      }
    });
    return closest;
  }, [selectedIncident, mappedHospitals]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Live Geospatial Tactical Map</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              ● High-Precision Vector GIS
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time multi-agency asset positions, route telemetry, evacuation safe corridors, and nearest resource detection
          </p>
        </div>

        {/* Selected Incident Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Focused Incident:</span>
          <select
            value={selectedIncident?.id}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
          >
            {incidents.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} - {i.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layer Toggles & Controls Bar */}
      <div className="glass-card rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500 text-[11px] mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Layers:
          </span>

          <button
            onClick={() => setShowEmergencies(!showEmergencies)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition ${
              showEmergencies
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500/40 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            🚨 Emergencies ({mappedIncidents.length})
          </button>

          <button
            onClick={() => setShowTeams(!showTeams)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition ${
              showTeams
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500/40 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            🚒 Rescue Units ({mappedTeams.length})
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition ${
              showHospitals
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            🏥 Hospitals ({mappedHospitals.length})
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition ${
              showShelters
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-500/40 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            🏕️ Shelters ({mappedShelters.length})
          </button>

          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`px-2.5 py-1 rounded-lg font-medium border transition ${
              showSafeZones
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-500/40 font-bold'
                : 'border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            🛡️ Safe Corridors
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            title="Center Tactical View"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-slate-950 h-[520px] select-none cursor-grab active:cursor-grabbing">
        {/* SVG Tactical Canvas */}
        <div
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-full"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <defs>
              {/* Grid pattern for high-tech tactical look */}
              <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeOpacity="0.4" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="hospitalRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Background grid */}
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0b0f19" />
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#tacticalGrid)" />

            {/* Simulated Geographic Coastlines, Roads & Municipal Sectors */}
            {/* Bay / Water contours */}
            <path
              d="M 680 0 Q 720 180 820 300 T 950 650 L 1000 650 L 1000 0 Z"
              fill="#081426"
              stroke="#1e3a8a"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            {/* Major Arterial Roads / Freeways */}
            <path
              d="M 100 280 Q 400 320 880 340"
              fill="none"
              stroke="#1e293b"
              strokeWidth="4"
              strokeDasharray="4,4"
              opacity="0.8"
            />
            <path
              d="M 480 50 Q 520 350 560 620"
              fill="none"
              stroke="#1e293b"
              strokeWidth="4"
              opacity="0.8"
            />
            <path
              d="M 220 120 Q 520 220 840 200"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Safe Evacuation Zones polygons */}
            {showSafeZones &&
              mappedSafeZones.map((sz) => (
                <g key={sz.id}>
                  <circle
                    cx={sz.posX}
                    cy={sz.posY}
                    r="48"
                    fill="#0d9488"
                    fillOpacity="0.12"
                    stroke="#14b8a6"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={sz.posX}
                    y={sz.posY - 52}
                    fill="#2dd4bf"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="bold"
                    letterSpacing="0.5"
                  >
                    SAFE ZONE: {sz.name.split(' ')[0]}
                  </text>
                </g>
              ))}

            {/* Route Visualization: Nearest Rescue Team -> Selected Emergency */}
            {selectedIncident && nearestTeam && (
              <g>
                <path
                  d={`M ${nearestTeam.posX} ${nearestTeam.posY} Q ${(nearestTeam.posX + selectedIncident.posX) / 2} ${
                    (nearestTeam.posY + selectedIncident.posY) / 2 - 40
                  } ${selectedIncident.posX} ${selectedIncident.posY}`}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3.5"
                  strokeDasharray="8,6"
                  className="animate-pulse"
                />
                {/* Midpoint ETA Label */}
                <rect
                  x={(nearestTeam.posX + selectedIncident.posX) / 2 - 45}
                  y={(nearestTeam.posY + selectedIncident.posY) / 2 - 50}
                  width="90"
                  height="22"
                  rx="6"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <text
                  x={(nearestTeam.posX + selectedIncident.posX) / 2}
                  y={(nearestTeam.posY + selectedIncident.posY) / 2 - 35}
                  fill="#38bdf8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ETA: 4.8 min (2.3 km)
                </text>
              </g>
            )}

            {/* Route Visualization: Selected Emergency -> Nearest Hospital */}
            {selectedIncident && nearestHospital && (
              <path
                d={`M ${selectedIncident.posX} ${selectedIncident.posY} Q ${(selectedIncident.posX + nearestHospital.posX) / 2} ${
                  (selectedIncident.posY + nearestHospital.posY) / 2 + 30
                } ${nearestHospital.posX} ${nearestHospital.posY}`}
                fill="none"
                stroke="url(#hospitalRouteGrad)"
                strokeWidth="2.5"
                strokeDasharray="5,5"
                opacity="0.85"
              />
            )}

            {/* Shelters Pins */}
            {showShelters &&
              mappedShelters.map((shlt) => (
                <g
                  key={shlt.id}
                  className="cursor-pointer group"
                  onClick={() =>
                    setActivePin({
                      id: shlt.id,
                      type: 'shelter',
                      title: shlt.name,
                      data: shlt,
                      x: shlt.posX,
                      y: shlt.posY,
                    })
                  }
                >
                  <rect
                    x={shlt.posX - 12}
                    y={shlt.posY - 12}
                    width="24"
                    height="24"
                    rx="7"
                    fill="#9333ea"
                    stroke="#c084fc"
                    strokeWidth="1.5"
                    className="group-hover:scale-125 transition-transform origin-center"
                  />
                  <text
                    x={shlt.posX}
                    y={shlt.posY + 4}
                    fill="white"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    ⛺
                  </text>
                  <text
                    x={shlt.posX}
                    y={shlt.posY + 24}
                    fill="#c084fc"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {shlt.name.slice(0, 14)}...
                  </text>
                </g>
              ))}

            {/* Hospitals Pins */}
            {showHospitals &&
              mappedHospitals.map((hosp) => (
                <g
                  key={hosp.id}
                  className="cursor-pointer group"
                  onClick={() =>
                    setActivePin({
                      id: hosp.id,
                      type: 'hospital',
                      title: hosp.name,
                      data: hosp,
                      x: hosp.posX,
                      y: hosp.posY,
                    })
                  }
                >
                  <rect
                    x={hosp.posX - 13}
                    y={hosp.posY - 13}
                    width="26"
                    height="26"
                    rx="8"
                    fill="#059669"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    className="group-hover:scale-125 transition-transform origin-center"
                  />
                  <text
                    x={hosp.posX}
                    y={hosp.posY + 4}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    ✚
                  </text>
                  <text
                    x={hosp.posX}
                    y={hosp.posY + 25}
                    fill="#6ee7b7"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {hosp.name.slice(0, 16)}
                  </text>
                </g>
              ))}

            {/* Rescue Teams Pins */}
            {showTeams &&
              mappedTeams.map((team) => {
                const isSelectedForRoute = nearestTeam?.id === team.id;
                return (
                  <g
                    key={team.id}
                    className="cursor-pointer group"
                    onClick={() =>
                      setActivePin({
                        id: team.id,
                        type: 'team',
                        title: team.name,
                        data: team,
                        x: team.posX,
                        y: team.posY,
                      })
                    }
                  >
                    {isSelectedForRoute && (
                      <circle
                        cx={team.posX}
                        cy={team.posY}
                        r="20"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        className="animate-spin origin-center"
                      />
                    )}
                    <circle
                      cx={team.posX}
                      cy={team.posY}
                      r="12"
                      fill="#2563eb"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-transform origin-center"
                    />
                    <text
                      x={team.posX}
                      y={team.posY + 4}
                      fill="white"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      🚒
                    </text>
                    <text
                      x={team.posX}
                      y={team.posY + 23}
                      fill="#93c5fd"
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {team.id}
                    </text>
                  </g>
                );
              })}

            {/* Emergencies Pins (with glowing radar animations) */}
            {showEmergencies &&
              mappedIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const isCritical = inc.priority === 'Critical';

                return (
                  <g
                    key={inc.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setActivePin({
                        id: inc.id,
                        type: 'incident',
                        title: inc.title,
                        data: inc,
                        x: inc.posX,
                        y: inc.posY,
                      });
                    }}
                  >
                    {/* Critical Radar Pulse effect */}
                    {isCritical && inc.status !== 'Resolved' && (
                      <circle
                        cx={inc.posX}
                        cy={inc.posY}
                        r="26"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        className="animate-radar origin-center"
                      />
                    )}

                    {/* Selected Halo */}
                    {isSelected && (
                      <circle
                        cx={inc.posX}
                        cy={inc.posY}
                        r="18"
                        fill="none"
                        stroke="#fb7185"
                        strokeWidth="2.5"
                      />
                    )}

                    <circle
                      cx={inc.posX}
                      cy={inc.posY}
                      r={isSelected ? 13 : 10}
                      fill={isCritical ? '#e11d48' : '#f59e0b'}
                      stroke="white"
                      strokeWidth="2"
                      className="group-hover:scale-125 transition-transform origin-center"
                    />
                    <text
                      x={inc.posX}
                      y={inc.posY + 3.5}
                      fill="white"
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      !
                    </text>

                    <text
                      x={inc.posX}
                      y={inc.posY - 15}
                      fill={isCritical ? '#fda4af' : '#fde68a'}
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {inc.id}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Legend Overlay bottom-left */}
        <div className="absolute bottom-3 left-3 p-3 rounded-2xl glass-card bg-slate-900/80 text-white border border-slate-700/80 text-[10px] space-y-1.5 backdrop-blur-md pointer-events-none hidden sm:block">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[9px]">Map Legend</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical Incident</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Rescue Force</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trauma Hospital</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Shelter Hub</span>
          </div>
        </div>

        {/* Active Pin Popover */}
        {activePin && (
          <div className="absolute top-4 right-4 w-72 rounded-2xl glass-card bg-slate-900/90 text-white border border-slate-700 p-4 shadow-2xl space-y-3 animate-in fade-in duration-150 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  {activePin.type}
                </span>
                <h4 className="font-bold text-white mt-0.5">{activePin.title}</h4>
              </div>
              <button
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {activePin.type === 'incident' && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-300">{activePin.data.description}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Casualties: <strong className="text-rose-400">{activePin.data.affectedPeople}</strong></span>
                  <span className="font-bold text-indigo-400">{activePin.data.status}</span>
                </div>
                <button
                  onClick={() => onOpenIncidentModal(activePin.data.id)}
                  className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                >
                  Open Incident File
                </button>
              </div>
            )}

            {activePin.type === 'team' && (
              <div className="space-y-1.5">
                <div className="text-slate-300">Spec: {activePin.data.specialization}</div>
                <div className="text-slate-300">Leader: {activePin.data.leader}</div>
                <div className="text-slate-300">Complement: {activePin.data.membersCount} Operators</div>
                <div className="font-bold text-emerald-400">Status: {activePin.data.status}</div>
              </div>
            )}

            {activePin.type === 'hospital' && (
              <div className="space-y-1.5">
                <div className="text-slate-300">{activePin.data.type}</div>
                <div className="text-emerald-400 font-bold">{activePin.data.availableBeds} beds available ({activePin.data.icuAvailable} ICU)</div>
                <div className="text-slate-400 text-[10px]">{activePin.data.location.address}</div>
              </div>
            )}

            {activePin.type === 'shelter' && (
              <div className="space-y-1.5">
                <div className="text-purple-300 font-bold">{activePin.data.availableCapacity} / {activePin.data.maxCapacity} available</div>
                <div className="text-slate-400 text-[10px]">{activePin.data.district}</div>
                <div className="text-[10px] text-slate-300">{activePin.data.petFriendly ? '🐶 Pet Friendly' : 'Standard'}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nearest Resource Detector Card */}
      {selectedIncident && (
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-500" />
              <span>Proximity & Nearest Resource Matrix for {selectedIncident.id}</span>
            </h3>
            <span className="text-[11px] text-slate-500">{selectedIncident.location.address}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Nearest Rescue Unit */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase block">
                Nearest Rescue Team
              </span>
              <div className="font-bold text-slate-900 dark:text-white">
                {nearestTeam?.name || 'USAR Alpha'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                ETA: <strong>~4.8 mins</strong> (2.3 km via Bayway)
              </div>
            </div>

            {/* Nearest Level-1 Trauma Hospital */}
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">
                Nearest Trauma Hospital
              </span>
              <div className="font-bold text-slate-900 dark:text-white">
                {nearestHospital?.name || 'Memorial Trauma Center'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {nearestHospital?.availableBeds} beds open • ETA <strong>~6.2 mins</strong>
              </div>
            </div>

            {/* Evacuation Hub */}
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-1">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase block">
                Primary Evacuation Shelter
              </span>
              <div className="font-bold text-slate-900 dark:text-white">
                {shelters[0]?.name || 'Civic Center Arena'}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {shelters[0]?.availableCapacity} spots remaining • ETA <strong>~8.5 mins</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
