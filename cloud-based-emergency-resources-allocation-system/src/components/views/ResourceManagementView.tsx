import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  HeartPulse,
  Flame,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Package,
  Layers,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { ResourceCategory, ResourceItem } from '@/src/types';

export const ResourceManagementView: React.FC = () => {
  const { resources, updateResourceStock, addResourceItem } = useEmergency();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add resource modal state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Medical Equipment');
  const [type, setType] = useState('Critical MCI Kit');
  const [totalCount, setTotalCount] = useState(50);
  const [unit, setUnit] = useState('kits');
  const [depotLocation, setDepotLocation] = useState('Central Civil Defense Depot 1');
  const [criticalThreshold, setCriticalThreshold] = useState(10);

  const filteredResources = resources.filter((res) => {
    if (categoryFilter !== 'All' && res.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        res.id.toLowerCase().includes(q) ||
        res.name.toLowerCase().includes(q) ||
        res.type.toLowerCase().includes(q) ||
        res.depotLocation.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ResourceItem = {
      id: `RES-${Math.floor(20 + Math.random() * 80)}`,
      name,
      category,
      type,
      totalCount,
      availableCount: totalCount,
      unit,
      status: 'Available',
      depotLocation,
      depotCoords: { lat: 37.77, lng: -122.41 },
      criticalThreshold,
    };

    addResourceItem(newItem);
    setShowAddModal(false);
    setName('');
  };

  const categories: ResourceCategory[] = [
    'Ambulance',
    'Fire Truck',
    'Rescue Vehicle',
    'Medical Equipment',
    'Life Support',
    'Food & Water',
    'Rescue Gear',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Central Resource & Logistics Depot
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time tracking of emergency fleet, medical supplies, potable water, oxygen, and heavy extraction apparatus
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-resource"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog New Resource</span>
        </button>
      </div>

      {/* Category Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              categoryFilter === 'All'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resource name, model, or supply warehouse..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const availPct = Math.round((res.availableCount / (res.totalCount || 1)) * 100);
          const isLow = res.availableCount <= res.criticalThreshold;

          return (
            <div
              key={res.id}
              className={`glass-card apple-card rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
                isLow
                  ? 'border-amber-400/80 dark:border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {res.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        {res.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                      {res.name}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      res.status === 'Available'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : res.status === 'Low Stock'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div>Model / Spec: <strong className="text-slate-800 dark:text-slate-200">{res.type}</strong></div>
                  <div>Depot: {res.depotLocation}</div>
                </div>

                {/* Stock Level Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Readiness Level:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {res.availableCount} / {res.totalCount} {res.unit} ({availPct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        availPct <= 20
                          ? 'bg-rose-500'
                          : availPct <= 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${availPct}%` }}
                    />
                  </div>
                </div>

                {isLow && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Below critical threshold ({res.criticalThreshold} {res.unit})</span>
                  </div>
                )}
              </div>

              {/* Action count buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">Quick Adjust Stock:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateResourceStock(res.id, -1)}
                    disabled={res.availableCount <= 0}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
                    title="Deploy 1 unit"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateResourceStock(res.id, 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    title="Restock 1 unit"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateResourceStock(res.id, 5)}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                    title="Restock batch (+5)"
                  >
                    +5 Batch
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Catalog Emergency Resource</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Critical Mobile Ventilator Pod"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="vehicles, kits, cylinders, boxes"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Specification / Model Details</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Dual-tube High Flow Oxygen Generator"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Depot / Warehouse Staging Location</label>
                <input
                  type="text"
                  value={depotLocation}
                  onChange={(e) => setDepotLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Stock Count</label>
                  <input
                    type="number"
                    min={1}
                    value={totalCount}
                    onChange={(e) => setTotalCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Critical Threshold Alert</label>
                  <input
                    type="number"
                    min={1}
                    value={criticalThreshold}
                    onChange={(e) => setCriticalThreshold(parseInt(e.target.value) || 1)}
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
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
