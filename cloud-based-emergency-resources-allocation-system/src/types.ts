export type EmergencyType =
  | 'Fire'
  | 'Flood'
  | 'Accident'
  | 'Medical'
  | 'Cyclone'
  | 'Earthquake'
  | 'Building Collapse'
  | 'Other';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus =
  | 'Reported'
  | 'Verified'
  | 'Allocating'
  | 'Dispatched'
  | 'On Scene'
  | 'Resolved';

export interface LocationCoords {
  lat: number;
  lng: number;
  address: string;
  sector?: string;
  landmark?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  step: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  details?: string;
}

export interface AllocatedResources {
  rescueTeamIds: string[];
  ambulanceIds: string[];
  fireTruckIds: string[];
  vehicleIds: string[];
  equipment: { name: string; quantity: number }[];
  supplies: { name: string; quantity: number; unit: string }[];
}

export interface EmergencyIncident {
  id: string; // e.g. INC-2026-801
  title: string;
  type: EmergencyType;
  priority: PriorityLevel;
  location: LocationCoords;
  description: string;
  affectedPeople: number;
  imageUrl?: string;
  reportedAt: string;
  updatedAt: string;
  status: IncidentStatus;
  reporterName: string;
  reporterPhone: string;
  reporterRole: 'Citizen' | 'Emergency Officer' | 'Automated Sensor' | '911 Dispatch';
  allocatedResources: AllocatedResources;
  assignedHospitalId?: string;
  assignedShelterId?: string;
  timeline: IncidentTimelineEvent[];
  aiAnalysis?: {
    severityScore: number; // 1 - 10
    hazardSummary: string;
    recommendedTeams: string[];
    recommendedAmbulances: number;
    recommendedFireTrucks: number;
    priorityReason: string;
    generatedAt: string;
  };
  notes?: string;
}

export type TeamSpecialization =
  | 'Urban Search & Rescue'
  | 'Swiftwater Rescue'
  | 'Hazmat Containment'
  | 'High-Angle Extraction'
  | 'Trauma Triage'
  | 'Wildfire Ops';

export type TeamStatus = 'Available' | 'Dispatched' | 'En Route' | 'On Scene' | 'Resting';

export interface RescueTeam {
  id: string; // e.g. TM-101
  name: string;
  leader: string;
  membersCount: number;
  members: string[];
  specialization: TeamSpecialization;
  stationLocation: LocationCoords;
  currentLocation?: LocationCoords;
  status: TeamStatus;
  assignedIncidentId?: string;
  phone: string;
  vehicleAssigned?: string;
  equipmentCertified: string[];
}

export type ResourceCategory =
  | 'Ambulance'
  | 'Fire Truck'
  | 'Rescue Vehicle'
  | 'Medical Equipment'
  | 'Life Support'
  | 'Food & Water'
  | 'Rescue Gear';

export interface ResourceItem {
  id: string; // e.g. RES-01
  name: string;
  category: ResourceCategory;
  type: string;
  totalCount: number;
  availableCount: number;
  unit: string;
  status: 'Available' | 'Deployed' | 'Maintenance' | 'Low Stock';
  depotLocation: string;
  depotCoords: { lat: number; lng: number };
  criticalThreshold: number;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Level 1 Trauma' | 'General Hospital' | 'Specialty Medical Center' | 'Community Clinic';
  location: LocationCoords;
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  dedicatedAmbulances: number;
  availableAmbulances: number;
  facilities: string[];
  contact: string;
  status: 'Normal' | 'Surge Alert' | 'Critical Capacity' | 'Diverting';
  assignedIncidentsCount: number;
}

export interface Shelter {
  id: string;
  name: string;
  district: string;
  location: LocationCoords;
  maxCapacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  facilities: string[];
  status: 'Open' | 'Approaching Capacity' | 'Full' | 'Standby';
  contact: string;
  petFriendly: boolean;
  medicalStation: boolean;
  foodSupplyDays: number;
}

export type NotificationCategory =
  | 'New Emergency'
  | 'Critical Incident'
  | 'Resource Allocation'
  | 'Team Dispatch'
  | 'Hospital Alert'
  | 'Shelter Alert'
  | 'Incident Resolution';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  incidentId?: string;
  level: 'info' | 'warning' | 'critical' | 'success';
}

export type UserRole = 'admin' | 'officer' | 'citizen';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  badgeNumber?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'incidents'
  | 'allocation'
  | 'resources'
  | 'teams'
  | 'map'
  | 'hospitals'
  | 'shelters'
  | 'citizen'
  | 'incident-form'
  | 'ai-assistant'
  | 'notifications'
  | 'reports'
  | 'users'
  | 'settings';
