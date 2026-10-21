import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from '@/src/context/EmergencyContext';
import { Navbar } from '@/src/components/Navbar';
import { Sidebar } from '@/src/components/Sidebar';
import { LoginPage } from '@/src/components/LoginPage';
import { ReportEmergencyModal } from '@/src/components/ReportEmergencyModal';
import { IncidentDetailModal } from '@/src/components/IncidentDetailModal';

// Views
import { DashboardView } from '@/src/components/views/DashboardView';
import { EmergencyManagementView } from '@/src/components/views/EmergencyManagementView';
import { SmartAllocationView } from '@/src/components/views/SmartAllocationView';
import { RescueTeamsView } from '@/src/components/views/RescueTeamsView';
import { ResourceManagementView } from '@/src/components/views/ResourceManagementView';
import { LiveEmergencyMapView } from '@/src/components/views/LiveEmergencyMapView';
import { HospitalShelterView } from '@/src/components/views/HospitalShelterView';
import { CitizenPortalView } from '@/src/components/views/CitizenPortalView';
import { IncidentFormView } from '@/src/components/views/IncidentFormView';
import { AIAssistantView } from '@/src/components/views/AIAssistantView';
import { ReportsAnalyticsView } from '@/src/components/views/ReportsAnalyticsView';
import { UsersSettingsView } from '@/src/components/views/UsersSettingsView';
import { Activity, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSimulatingWorkflow,
    isAuthenticated,
    isReportModalOpen,
    setIsReportModalOpen,
    openReportModal,
    closeReportModal,
  } = useEmergency();
  const [detailedIncidentId, setDetailedIncidentId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If user is not authenticated, display the Apple-inspired emergency login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenIncidentModal={(id) => setDetailedIncidentId(id)}
          />
        );
      case 'incidents':
        return (
          <EmergencyManagementView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenIncidentModal={(id) => setDetailedIncidentId(id)}
          />
        );
      case 'allocation':
        return <SmartAllocationView />;
      case 'teams':
        return <RescueTeamsView />;
      case 'resources':
        return <ResourceManagementView />;
      case 'map':
        return (
          <LiveEmergencyMapView
            onOpenIncidentModal={(id) => setDetailedIncidentId(id)}
          />
        );
      case 'hospitals':
      case 'shelters':
        return <HospitalShelterView />;
      case 'citizen':
        return (
          <CitizenPortalView
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        );
      case 'incident-form':
        return (
          <IncidentFormView
            onSubmitted={(id) => {
              setDetailedIncidentId(id);
            }}
          />
        );
      case 'ai-assistant':
        return <AIAssistantView />;
      case 'reports':
        return <ReportsAnalyticsView />;
      case 'settings':
        return <UsersSettingsView />;
      default:
        return (
          <DashboardView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenIncidentModal={(id) => setDetailedIncidentId(id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-(--breakpoint-2xl) w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <ReportEmergencyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <IncidentDetailModal
        incidentId={detailedIncidentId}
        onClose={() => setDetailedIncidentId(null)}
        onOpenAllocation={() => {
          setDetailedIncidentId(null);
          setActiveTab('allocation');
        }}
      />

      {/* Live Simulation Indicator Toast */}
      {isSimulatingWorkflow && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-card bg-slate-900/90 text-white border border-rose-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-9 h-9 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>8-Step Emergency Lifecycle Simulation</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-slate-300 text-[11px]">
              Reported → Verified → AI Optimization → Dispatch → Live GPS → Hospitals Synced → Resolved
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}
