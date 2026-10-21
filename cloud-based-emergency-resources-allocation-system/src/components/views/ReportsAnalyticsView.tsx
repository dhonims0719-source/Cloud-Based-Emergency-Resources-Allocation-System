import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  Printer,
  Calendar,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Share2,
  PieChart,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';

export const ReportsAnalyticsView: React.FC = () => {
  const { incidents, teams, resources, hospitals, shelters, metrics } = useEmergency();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  // Types distribution
  const typeCounts = incidents.reduce((acc, inc) => {
    acc[inc.type] = (acc[inc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = incidents.reduce((acc, inc) => {
    acc[inc.priority] = (acc[inc.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Incident_ID',
      'Title',
      'Type',
      'Priority',
      'Status',
      'Casualties',
      'Address',
      'Sector',
      'Reported_At',
    ];

    const rows = incidents.map((i) => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.type,
      i.priority,
      i.status,
      i.affectedPeople,
      `"${i.location.address.replace(/"/g, '""')}"`,
      `"${i.location.sector || ''}"`,
      i.reportedAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `emergency_operations_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Executive Incident Analytics & Reporting
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Post-incident after-action telemetry, resource efficiency ratios, and inter-agency compliance audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* 4 Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Mean Time to Dispatch</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            3.2 <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            38% faster than regional SLA
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Incident Resolution Rate</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {metrics.resolutionRatePct}%
          </div>
          <span className="text-[11px] text-slate-400">
            {incidents.filter((i) => i.status === 'Resolved').length} cases fully resolved
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Fleet Utilization Ratio</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            64.5%
          </div>
          <span className="text-[11px] text-slate-400">Balanced reserve capacity maintained</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Casualties Extricated</span>
          <div className="mt-1 text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
            {incidents.reduce((acc, i) => acc + i.affectedPeople, 0)}
          </div>
          <span className="text-[11px] text-slate-400">100% routed to trauma care</span>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incident Classification Breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-rose-500" />
            <span>Incidents by Emergency Category</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(typeCounts).map(([type, count]) => {
              const numCount = Number(count);
              const pct = Math.round((numCount / (incidents.length || 1)) * 100);

              return (
                <div key={type} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                    <span>{type}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {numCount} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Level Breakdown */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Triage Priority Distribution</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const numCount = Number(count);
              const pct = Math.round((numCount / (incidents.length || 1)) * 100);
              const color =
                priority === 'Critical'
                  ? 'bg-rose-500'
                  : priority === 'High'
                  ? 'bg-amber-500'
                  : 'bg-blue-500';

              return (
                <div key={priority} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                    <span>{priority} Priority</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {numCount} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            Critical priority incidents receive immediate automatic pre-alert dispatch within 45 seconds of report intake.
          </div>
        </div>
      </div>

      {/* Inter-Agency Operational Audit Ledger */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Operational Audit Log (Recent Events)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Incident ID</th>
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Actor & Authority</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {incidents.slice(0, 5).map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {inc.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {inc.title}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {inc.reporterName} ({inc.reporterRole})
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">
                    {inc.location.address}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {inc.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
