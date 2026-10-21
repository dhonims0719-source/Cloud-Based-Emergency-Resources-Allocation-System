import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  EmergencyIncident,
  RescueTeam,
  ResourceItem,
  Hospital,
  Shelter,
  AppNotification,
  UserProfile,
  UserRole,
  ActiveNavTab,
  IncidentStatus,
  AllocatedResources,
} from '@/src/types';
import {
  INITIAL_INCIDENTS,
  INITIAL_TEAMS,
  INITIAL_RESOURCES,
  INITIAL_HOSPITALS,
  INITIAL_SHELTERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '@/src/data/mockData';

export interface RoleSpecializedRoute {
  tab: ActiveNavTab;
  title: string;
  badge: string;
  description: string;
  openIncidentForm?: boolean;
}

export const ROLE_SPECIALIZED_ROUTES: Record<UserRole, RoleSpecializedRoute> = {
  admin: {
    tab: 'dashboard',
    title: 'Dispatcher Dashboard',
    badge: 'Incident Commander',
    description: 'Centralized emergency command, tactical fleet telemetry, and automated AI resource allocation.',
    openIncidentForm: false,
  },
  officer: {
    tab: 'incidents',
    title: 'Tactical Incident Dispatch Queue',
    badge: 'Emergency Response Officer',
    description: 'Field response verification, incident priority triage, and direct squad dispatching.',
    openIncidentForm: false,
  },
  citizen: {
    tab: 'incident-form',
    title: 'Emergency Incident Report Form',
    badge: 'Civilian Life-Safety SOS',
    description: 'Immediate civilian SOS reporting, emergency geolocation broadcast, and shelter tracking.',
    openIncidentForm: true,
  },
};

interface EmergencyContextType {
  incidents: EmergencyIncident[];
  teams: RescueTeam[];
  resources: ResourceItem[];
  hospitals: Hospital[];
  shelters: Shelter[];
  notifications: AppNotification[];
  currentUser: UserProfile;
  allUsers: UserProfile[];
  theme: 'dark' | 'light';
  activeTab: ActiveNavTab;
  selectedIncidentId: string | null;
  searchQuery: string;
  isCloudSynced: boolean;
  isSimulatingWorkflow: boolean;
  isAuthenticated: boolean;
  isReportModalOpen: boolean;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setActiveTab: (tab: ActiveNavTab) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  switchRole: (role: UserRole) => void;
  login: (credentials: { email?: string; role?: UserRole; password?: string; bypassAsGuest?: boolean }) => boolean;
  logout: () => void;
  setIsReportModalOpen: (open: boolean) => void;
  openReportModal: () => void;
  closeReportModal: () => void;
  getSpecializedRouteForRole: (role: UserRole) => RoleSpecializedRoute;
  redirectByRole: (role: UserRole) => void;

  // Incident lifecycle
  reportEmergency: (data: Partial<EmergencyIncident>) => EmergencyIncident;
  verifyIncident: (id: string) => void;
  recommendAllocation: (incidentId: string) => AllocatedResources;
  approveAndDispatch: (incidentId: string, customAllocations?: AllocatedResources) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, notes?: string) => void;
  resolveIncident: (incidentId: string, resolutionSummary?: string) => void;

  // Facility & Resource actions
  assignHospitalCase: (incidentId: string, hospitalId: string, bedsCount: number) => void;
  assignShelterCase: (incidentId: string, shelterId: string, count: number) => void;
  updateTeamStatus: (teamId: string, status: RescueTeam['status']) => void;
  updateResourceStock: (resourceId: string, countChange: number) => void;
  addResourceItem: (item: ResourceItem) => void;
  addRescueTeam: (team: RescueTeam) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (
    title: string,
    message: string,
    category: AppNotification['category'],
    level?: AppNotification['level'],
    incidentId?: string
  ) => void;

  // Simulation & reset
  runWorkflowSimulation: () => void;
  resetToMockData: () => void;

  // Computed metrics
  metrics: {
    totalEmergencies: number;
    criticalIncidents: number;
    availableResourcesCount: number;
    activeRescueTeamsCount: number;
    availableAmbulancesCount: number;
    hospitalBedOccupancyPct: number;
    shelterOccupancyPct: number;
    avgResponseTimeMins: number;
    resolutionRatePct: number;
  };
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eoc_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-2026-801');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eoc_auth_status');
      // If user has not logged in yet, default to false so they experience the new Login Page
      return saved === 'true';
    }
    return false;
  });

  // Core Data Collections with localStorage caching
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_incidents');
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [teams, setTeams] = useState<RescueTeam[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_teams');
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_hospitals');
      return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [shelters, setShelters] = useState<Shelter[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_shelters');
      return saved ? JSON.parse(saved) : INITIAL_SHELTERS;
    } catch {
      return INITIAL_SHELTERS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('eoc_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem('eoc_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('eoc_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('eoc_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('eoc_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('eoc_shelters', JSON.stringify(shelters));
  }, [shelters]);

  useEffect(() => {
    localStorage.setItem('eoc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('eoc_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const getSpecializedRouteForRole = (role: UserRole): RoleSpecializedRoute => {
    return ROLE_SPECIALIZED_ROUTES[role] || ROLE_SPECIALIZED_ROUTES.officer;
  };

  const redirectByRole = (role: UserRole) => {
    const route = getSpecializedRouteForRole(role);
    setActiveTab(route.tab);
    if (route.openIncidentForm) {
      setIsReportModalOpen(true);
    } else {
      setIsReportModalOpen(false);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      const targetRoute = getSpecializedRouteForRole(role);
      setActiveTab(targetRoute.tab);
      if (targetRoute.openIncidentForm) {
        setIsReportModalOpen(true);
      } else {
        setIsReportModalOpen(false);
      }
      addNotification(
        'Role Switch & View Routing',
        `Switched to ${found.name} (${role.toUpperCase()}). Redirected to ${targetRoute.title}.`,
        'Resource Allocation',
        'info'
      );
    }
  };

  const login = (credentials: { email?: string; role?: UserRole; password?: string; bypassAsGuest?: boolean }): boolean => {
    if (credentials.bypassAsGuest) {
      const citizenUser = INITIAL_USERS.find((u) => u.role === 'citizen') || INITIAL_USERS[2];
      setCurrentUser(citizenUser);
      setIsAuthenticated(true);
      localStorage.setItem('eoc_auth_status', 'true');
      
      const citizenRoute = getSpecializedRouteForRole('citizen');
      setActiveTab(citizenRoute.tab);
      setIsReportModalOpen(true);

      addNotification(
        'Civilian SOS Session Activated',
        `Direct civilian emergency access granted. Redirected to ${citizenRoute.title}.`,
        'New Emergency',
        'info'
      );
      return true;
    }

    let foundUser: UserProfile | undefined;

    if (credentials.role) {
      foundUser = INITIAL_USERS.find((u) => u.role === credentials.role);
    } else if (credentials.email) {
      const trimmedEmail = credentials.email.trim().toLowerCase();
      foundUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (!foundUser) {
        foundUser = INITIAL_USERS.find(
          (u) =>
            u.name.toLowerCase().includes(trimmedEmail) ||
            u.role.toLowerCase() === trimmedEmail
        );
      }
    }

    if (!foundUser) {
      foundUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: credentials.email ? credentials.email.split('@')[0] : 'Emergency Officer',
        role: credentials.role || 'officer',
        email: credentials.email || 'officer.dispatch@eoc.gov',
        department: 'Inter-Agency Command & Tactical Logistics',
        badgeNumber: `TAC-${Math.floor(1000 + Math.random() * 9000)}`,
        phone: '+1 (555) 911-0422',
      };
    }

    setCurrentUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('eoc_auth_status', 'true');

    // Execute specialized post-login role redirection logic
    const specializedRoute = getSpecializedRouteForRole(foundUser.role);
    setActiveTab(specializedRoute.tab);
    if (specializedRoute.openIncidentForm) {
      setIsReportModalOpen(true);
    } else {
      setIsReportModalOpen(false);
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    const routingDetails =
      foundUser.role === 'admin'
        ? 'Redirected to Dispatcher Dashboard (Incident Commander Console).'
        : foundUser.role === 'citizen'
        ? 'Redirected to Citizen Incident Form for instant SOS reporting.'
        : 'Redirected to Tactical Incident Dispatch Queue.';

    addNotification(
      'Authentication Successful',
      `Welcome, ${foundUser.name} (${foundUser.role.toUpperCase()}). ${routingDetails}`,
      'Resource Allocation',
      'success'
    );

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('eoc_auth_status', 'false');
    addNotification(
      'Session Terminated',
      'You have logged out from the Emergency Operations Command terminal.',
      'Resource Allocation',
      'info'
    );
  };

  const addNotification = (
    title: string,
    message: string,
    category: AppNotification['category'],
    level: AppNotification['level'] = 'info',
    incidentId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      category,
      timestamp: 'Just now',
      read: false,
      incidentId,
      level,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Automated smart resource allocation calculation
  const recommendAllocation = (incidentId: string): AllocatedResources => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) {
      return {
        rescueTeamIds: [],
        ambulanceIds: [],
        fireTruckIds: [],
        vehicleIds: [],
        equipment: [],
        supplies: [],
      };
    }

    const recTeams: string[] = [];
    const recAmbs: string[] = [];
    const recFires: string[] = [];
    const recVehicles: string[] = [];

    // Match team specialization by emergency type
    if (inc.type === 'Fire') {
      const availUSAR = teams.find((t) => t.status === 'Available' && t.specialization === 'Urban Search & Rescue');
      if (availUSAR) recTeams.push(availUSAR.id);
      const fireEngines = resources.filter((r) => r.category === 'Fire Truck' && r.availableCount > 0);
      if (fireEngines[0]) recFires.push(fireEngines[0].id);
      if (fireEngines[1]) recFires.push(fireEngines[1].id);
      const amb = resources.find((r) => r.category === 'Ambulance' && r.availableCount > 0);
      if (amb) recAmbs.push(amb.id);
    } else if (inc.type === 'Flood' || inc.type === 'Cyclone') {
      const swift = teams.find((t) => t.status === 'Available' && t.specialization === 'Swiftwater Rescue');
      if (swift) recTeams.push(swift.id);
      const boat = resources.find((r) => r.name.includes('Boat') || r.name.includes('Craft'));
      if (boat) recVehicles.push(boat.id);
      const amb = resources.find((r) => r.category === 'Ambulance' && r.availableCount > 0);
      if (amb) recAmbs.push(amb.id);
    } else if (inc.type === 'Building Collapse' || inc.type === 'Earthquake') {
      const usar = teams.find((t) => t.status === 'Available' && t.specialization === 'Urban Search & Rescue');
      if (usar) recTeams.push(usar.id);
      const heavy = resources.find((r) => r.name.includes('USAR') || r.name.includes('Extrication'));
      if (heavy) recVehicles.push(heavy.id);
      const amb = resources.find((r) => r.category === 'Ambulance' && r.availableCount > 0);
      if (amb) recAmbs.push(amb.id);
    } else {
      // General/Accident/Medical/Other
      const trauma = teams.find((t) => t.status === 'Available' && t.specialization === 'Trauma Triage');
      if (trauma) recTeams.push(trauma.id);
      const amb = resources.find((r) => r.category === 'Ambulance' && r.availableCount > 0);
      if (amb) recAmbs.push(amb.id);
    }

    // Default fallback if no specialized team is currently free: pick first available team
    if (recTeams.length === 0) {
      const anyFreeTeam = teams.find((t) => t.status === 'Available');
      if (anyFreeTeam) recTeams.push(anyFreeTeam.id);
    }

    return {
      rescueTeamIds: recTeams,
      ambulanceIds: recAmbs,
      fireTruckIds: recFires,
      vehicleIds: recVehicles,
      equipment: [
        { name: 'Tactical MCI Trauma Kits', quantity: Math.max(4, Math.ceil(inc.affectedPeople / 2)) },
        { name: 'Portable O2 Concentrators', quantity: 2 },
      ],
      supplies: [
        { name: 'Purified Emergency Water', quantity: Math.max(20, inc.affectedPeople * 3), unit: 'liters' },
        { name: 'Thermal Evacuation Blankets', quantity: Math.max(10, inc.affectedPeople * 2), unit: 'blankets' },
      ],
    };
  };

  // Report emergency
  const reportEmergency = (data: Partial<EmergencyIncident>): EmergencyIncident => {
    const id = `INC-2026-${Math.floor(800 + Math.random() * 199)}`;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newIncident: EmergencyIncident = {
      id,
      title: data.title || `${data.type || 'General'} Incident at ${data.location?.address || 'Metro Sector'}`,
      type: data.type || 'Other',
      priority: data.priority || 'High',
      location: data.location || {
        lat: 37.7749 + (Math.random() - 0.5) * 0.04,
        lng: -122.4194 + (Math.random() - 0.5) * 0.04,
        address: 'Sector 4, Central Metro Ave',
        sector: 'Sector Metro-East',
      },
      description: data.description || 'Emergency incident reported by citizen. Rapid response requested.',
      affectedPeople: data.affectedPeople || 1,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      reportedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'Reported',
      reporterName: data.reporterName || currentUser.name,
      reporterPhone: data.reporterPhone || currentUser.phone || '+1 (555) 019-0000',
      reporterRole: currentUser.role === 'citizen' ? 'Citizen' : 'Emergency Officer',
      allocatedResources: {
        rescueTeamIds: [],
        ambulanceIds: [],
        fireTruckIds: [],
        vehicleIds: [],
        equipment: [],
        supplies: [],
      },
      timeline: [
        {
          id: `TL-${Date.now()}-1`,
          step: 'Emergency Reported',
          timestamp: timeStr,
          actor: currentUser.name,
          actorRole: currentUser.role === 'citizen' ? 'Citizen' : 'Emergency Officer',
          details: 'Initial report logged into Cloud Emergency Operations Center.',
        },
      ],
      aiAnalysis: {
        severityScore: data.priority === 'Critical' ? 9.1 : data.priority === 'High' ? 7.6 : 5.4,
        hazardSummary: `Preliminary analysis: ${data.type || 'Incident'} involving approximately ${data.affectedPeople || 1} persons. Immediate triage assessment initiated.`,
        recommendedTeams: ['Pending officer verification'],
        recommendedAmbulances: data.priority === 'Critical' ? 3 : 1,
        recommendedFireTrucks: data.type === 'Fire' ? 2 : 0,
        priorityReason: 'Initial hazard score calculated from reported casualty count and hazard profile.',
        generatedAt: timeStr,
      },
      notes: data.notes,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(id);

    addNotification(
      'New Emergency Reported',
      `${newIncident.title} (${newIncident.priority}) registered with ID ${id}.`,
      'New Emergency',
      newIncident.priority === 'Critical' ? 'critical' : 'warning',
      id
    );

    return newIncident;
  };

  // Verify incident
  const verifyIncident = (id: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const autoRec = recommendAllocation(id);

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc;
        return {
          ...inc,
          status: 'Verified',
          updatedAt: now.toISOString(),
          allocatedResources: autoRec,
          timeline: [
            ...inc.timeline,
            {
              id: `TL-${Date.now()}`,
              step: 'Incident Verified & AI Analyzed',
              timestamp: timeStr,
              actor: currentUser.name,
              actorRole: 'Incident Commander / Officer',
              details: 'Physical verification confirmed. AI resource package prepared for dispatch approval.',
            },
          ],
        };
      })
    );

    addNotification(
      'Incident Verified',
      `Incident ${id} has been verified. Smart resource recommendations generated.`,
      'Resource Allocation',
      'info',
      id
    );
  };

  // Approve & Dispatch resources
  const approveAndDispatch = (incidentId: string, customAllocations?: AllocatedResources) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    const allocations = customAllocations || inc.allocatedResources || recommendAllocation(incidentId);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Update teams to Dispatched
    if (allocations.rescueTeamIds && allocations.rescueTeamIds.length > 0) {
      setTeams((prev) =>
        prev.map((t) =>
          allocations.rescueTeamIds.includes(t.id)
            ? { ...t, status: 'Dispatched', assignedIncidentId: incidentId }
            : t
        )
      );
    }

    // Decrement inventory resources
    setResources((prev) =>
      prev.map((r) => {
        let deduct = 0;
        if (allocations.ambulanceIds?.includes(r.id)) deduct += 1;
        if (allocations.fireTruckIds?.includes(r.id)) deduct += 1;
        if (allocations.vehicleIds?.includes(r.id)) deduct += 1;
        if (deduct > 0) {
          const newAvail = Math.max(0, r.availableCount - deduct);
          return {
            ...r,
            availableCount: newAvail,
            status: newAvail === 0 ? 'Deployed' : newAvail <= r.criticalThreshold ? 'Low Stock' : 'Available',
          };
        }
        return r;
      })
    );

    // Auto assign nearest hospital if none set
    const assignedHosp = inc.assignedHospitalId || 'HOSP-01';
    const assignedShlt = inc.assignedShelterId || 'SHT-01';

    // Update incident status
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id !== incidentId) return i;
        return {
          ...i,
          status: 'Dispatched',
          allocatedResources: allocations,
          assignedHospitalId: assignedHosp,
          assignedShelterId: assignedShlt,
          updatedAt: now.toISOString(),
          timeline: [
            ...i.timeline,
            {
              id: `TL-${Date.now()}`,
              step: 'Resource Dispatch Approved',
              timestamp: timeStr,
              actor: currentUser.name,
              actorRole: 'Incident Commander',
              details: `Authorized dispatch of ${allocations.rescueTeamIds.length} rescue team(s), ${allocations.ambulanceIds.length} ambulance(s), and ${allocations.fireTruckIds.length} fire unit(s).`,
            },
          ],
        };
      })
    );

    addNotification(
      'Emergency Dispatch Authorized',
      `Units dispatched for ${inc.title}. Live tracking and radio coordination active.`,
      'Team Dispatch',
      'success',
      incidentId
    );
  };

  // Update status (e.g. On Scene, Allocating, etc)
  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, notes?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          status,
          updatedAt: now.toISOString(),
          notes: notes || inc.notes,
          timeline: [
            ...inc.timeline,
            {
              id: `TL-${Date.now()}`,
              step: `Status Updated to ${status}`,
              timestamp: timeStr,
              actor: currentUser.name,
              actorRole: currentUser.role.toUpperCase(),
              details: notes || `Operational status transitioned to ${status}.`,
            },
          ],
        };
      })
    );

    // If status is On Scene, update assigned teams to On Scene
    if (status === 'On Scene') {
      setTeams((prev) =>
        prev.map((t) => (t.assignedIncidentId === incidentId ? { ...t, status: 'On Scene' } : t))
      );
    }

    addNotification(
      'Incident Status Updated',
      `Incident ${incidentId} is now marked as "${status}".`,
      'Critical Incident',
      'info',
      incidentId
    );
  };

  // Resolve incident
  const resolveIncident = (incidentId: string, resolutionSummary?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Release rescue teams back to available
    setTeams((prev) =>
      prev.map((t) =>
        t.assignedIncidentId === incidentId
          ? { ...t, status: 'Available', assignedIncidentId: undefined }
          : t
      )
    );

    // Mark incident resolved
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        return {
          ...inc,
          status: 'Resolved',
          updatedAt: now.toISOString(),
          notes: resolutionSummary || inc.notes,
          timeline: [
            ...inc.timeline,
            {
              id: `TL-${Date.now()}`,
              step: 'Emergency Resolved',
              timestamp: timeStr,
              actor: currentUser.name,
              actorRole: 'Incident Commander',
              details: resolutionSummary || 'All casualties treated and evacuated. Site secured and units stood down.',
            },
          ],
        };
      })
    );

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#06b6d4'],
      });
    } catch {
      // safe fallback
    }

    addNotification(
      'Emergency Resolved Successfully',
      `Incident ${incidentId} has been successfully closed and units demobilized.`,
      'Incident Resolution',
      'success',
      incidentId
    );
  };

  // Assign Hospital Case
  const assignHospitalCase = (incidentId: string, hospitalId: string, bedsCount: number) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newAvail = Math.max(0, h.availableBeds - bedsCount);
          return {
            ...h,
            availableBeds: newAvail,
            assignedIncidentsCount: h.assignedIncidentsCount + 1,
            status: newAvail < 15 ? 'Surge Alert' : 'Normal',
          };
        }
        return h;
      })
    );

    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, assignedHospitalId: hospitalId } : i))
    );

    addNotification(
      'Hospital Coordination Updated',
      `${bedsCount} casualty case(s) routed to ${hospitals.find((h) => h.id === hospitalId)?.name || 'hospital'}.`,
      'Hospital Alert',
      'info',
      incidentId
    );
  };

  // Assign Shelter Case
  const assignShelterCase = (incidentId: string, shelterId: string, count: number) => {
    setShelters((prev) =>
      prev.map((s) => {
        if (s.id === shelterId) {
          const newOcc = Math.min(s.maxCapacity, s.currentOccupancy + count);
          const newAvail = Math.max(0, s.maxCapacity - newOcc);
          return {
            ...s,
            currentOccupancy: newOcc,
            availableCapacity: newAvail,
            status: newAvail < 50 ? 'Approaching Capacity' : 'Open',
          };
        }
        return s;
      })
    );

    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, assignedShelterId: shelterId } : i))
    );

    addNotification(
      'Shelter Evacuation Updated',
      `${count} displaced individuals registered at ${shelters.find((s) => s.id === shelterId)?.name || 'shelter'}.`,
      'Shelter Alert',
      'info',
      incidentId
    );
  };

  const updateTeamStatus = (teamId: string, status: RescueTeam['status']) => {
    setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, status } : t)));
  };

  const updateResourceStock = (resourceId: string, countChange: number) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const newAvail = Math.max(0, r.availableCount + countChange);
          return {
            ...r,
            availableCount: newAvail,
            status: newAvail === 0 ? 'Deployed' : newAvail <= r.criticalThreshold ? 'Low Stock' : 'Available',
          };
        }
        return r;
      })
    );
  };

  const addResourceItem = (item: ResourceItem) => {
    setResources((prev) => [item, ...prev]);
    addNotification('New Resource Added', `${item.name} cataloged into depot stock.`, 'Resource Allocation');
  };

  const addRescueTeam = (team: RescueTeam) => {
    setTeams((prev) => [team, ...prev]);
    addNotification('New Rescue Unit Enrolled', `${team.name} registered under ${team.specialization}.`, 'Team Dispatch');
  };

  // Full demonstration workflow simulator
  const runWorkflowSimulation = () => {
    if (isSimulatingWorkflow) return;
    setIsSimulatingWorkflow(true);

    // Step 1: Citizen reports emergency
    const simIncident = reportEmergency({
      title: 'Structural Fire & Gas Alarm at Bayview Complex',
      type: 'Fire',
      priority: 'Critical',
      description: 'Smoke billowing from residential apartment 4B. Citizen alerted neighbors and reported trapped elderly resident.',
      affectedPeople: 8,
      location: {
        lat: 37.765,
        lng: -122.41,
        address: '420 16th St, Mission Bay / Potrero',
        sector: 'Sector East',
      },
      reporterName: 'David Miller',
      reporterPhone: '+1 (555) 302-8821',
    });

    setActiveTab('incidents');

    // Step 2: Officer verifies incident after 2s
    setTimeout(() => {
      verifyIncident(simIncident.id);
      setActiveTab('allocation');

      // Step 3: Admin approves dispatch after 4s
      setTimeout(() => {
        approveAndDispatch(simIncident.id);
        setActiveTab('map');

        // Step 4: Unit arrives on scene after 7s
        setTimeout(() => {
          updateIncidentStatus(simIncident.id, 'On Scene', 'Units arrived on scene. First water line charged, search team deployed.');

          // Step 5: Coordinate with hospital after 9s
          setTimeout(() => {
            assignHospitalCase(simIncident.id, 'HOSP-01', 3);
            assignShelterCase(simIncident.id, 'SHT-01', 5);

            // Step 6: Resolve incident after 12s
            setTimeout(() => {
              resolveIncident(simIncident.id, 'All occupants safely evacuated. Fire extinguished. Structure ventilated.');
              setActiveTab('dashboard');
              setIsSimulatingWorkflow(false);
            }, 3000);
          }, 2000);
        }, 3000);
      }, 2500);
    }, 2000);
  };

  const resetToMockData = () => {
    setIncidents(INITIAL_INCIDENTS);
    setTeams(INITIAL_TEAMS);
    setResources(INITIAL_RESOURCES);
    setHospitals(INITIAL_HOSPITALS);
    setShelters(INITIAL_SHELTERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    addNotification('System Reset', 'All records refreshed to baseline emergency scenario data.', 'Resource Allocation');
  };

  // Calculate high-level metrics
  const totalEmergencies = incidents.length;
  const criticalIncidents = incidents.filter((i) => i.priority === 'Critical' && i.status !== 'Resolved').length;
  const availableResourcesCount = resources.reduce((acc, r) => acc + r.availableCount, 0);
  const activeRescueTeamsCount = teams.filter((t) => t.status === 'Dispatched' || t.status === 'On Scene').length;
  const availableAmbulancesCount = resources
    .filter((r) => r.category === 'Ambulance')
    .reduce((acc, r) => acc + r.availableCount, 0);

  const totalHospBeds = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
  const availHospBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);
  const hospitalBedOccupancyPct = Math.round(((totalHospBeds - availHospBeds) / (totalHospBeds || 1)) * 100);

  const totalShelterCap = shelters.reduce((acc, s) => acc + s.maxCapacity, 0);
  const currentShelterOcc = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const shelterOccupancyPct = Math.round((currentShelterOcc / (totalShelterCap || 1)) * 100);

  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
  const resolutionRatePct = Math.round((resolvedCount / (incidents.length || 1)) * 100);
  const avgResponseTimeMins = 6.8;

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        teams,
        resources,
        hospitals,
        shelters,
        notifications,
        currentUser,
        allUsers: INITIAL_USERS,
        theme,
        activeTab,
        selectedIncidentId,
        searchQuery,
        isCloudSynced,
        isSimulatingWorkflow,
        isAuthenticated,
        isReportModalOpen,

        setTheme,
        toggleTheme,
        setActiveTab,
        setSelectedIncidentId,
        setSearchQuery,
        switchRole,
        login,
        logout,
        setIsReportModalOpen,
        openReportModal,
        closeReportModal,
        getSpecializedRouteForRole,
        redirectByRole,

        reportEmergency,
        verifyIncident,
        recommendAllocation,
        approveAndDispatch,
        updateIncidentStatus,
        resolveIncident,

        assignHospitalCase,
        assignShelterCase,
        updateTeamStatus,
        updateResourceStock,
        addResourceItem,
        addRescueTeam,

        markNotificationRead,
        markAllNotificationsRead,
        addNotification,

        runWorkflowSimulation,
        resetToMockData,

        metrics: {
          totalEmergencies,
          criticalIncidents,
          availableResourcesCount,
          activeRescueTeamsCount,
          availableAmbulancesCount,
          hospitalBedOccupancyPct,
          shelterOccupancyPct,
          avgResponseTimeMins,
          resolutionRatePct,
        },
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
