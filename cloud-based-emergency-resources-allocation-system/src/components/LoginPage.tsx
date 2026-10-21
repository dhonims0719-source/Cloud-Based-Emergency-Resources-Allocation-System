import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Radio,
  Truck,
  HeartPulse,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Phone,
  Building2,
  KeyRound,
  Sun,
  Moon,
  Info,
  LifeBuoy,
} from 'lucide-react';
import { useEmergency } from '@/src/context/EmergencyContext';
import { UserRole } from '@/src/types';

export const LoginPage: React.FC = () => {
  const { login, theme, toggleTheme } = useEmergency();

  const [activeMode, setActiveMode] = useState<'officer' | 'citizen' | 'register'>('officer');
  const [email, setEmail] = useState('sarah.vance@eoc.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [complianceChecked, setComplianceChecked] = useState(true);
  const [clearanceRole, setClearanceRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Register mode state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Urban Tactical Search & Rescue');
  const [regRole, setRegRole] = useState<UserRole>('officer');

  // Handle manual submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide an official EOC email or badge identifier.');
      return;
    }

    if (!complianceChecked && activeMode === 'officer') {
      setErrorMessage('You must confirm adherence to CJIS emergency communication protocols.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication handshake
    setTimeout(() => {
      const success = login({
        email,
        role: clearanceRole,
        password,
      });
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Authentication credentials rejected by central security gateway.');
      }
    }, 600);
  };

  // Handle 1-click demo login
  const handleQuickLogin = (role: UserRole, demoEmail: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      login({
        email: demoEmail,
        role,
      });
      setIsLoading(false);
    }, 450);
  };

  // Handle Guest SOS Bypass
  const handleGuestSOS = () => {
    setIsLoading(true);
    setTimeout(() => {
      login({ bypassAsGuest: true });
      setIsLoading(false);
    }, 300);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in all agency registration fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({
        email: regEmail,
        role: regRole,
      });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white shadow-lg shadow-rose-500/25">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                EOC Cloud
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                DEFCON 4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Metropolitan Operations Terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Direct 911 Hotline pill */}
          <a
            href="tel:911"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold hover:bg-rose-100 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency 911</span>
          </a>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            id="btn-login-theme-toggle"
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        {/* Life-Safety Emergency Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Are You Experiencing an Immediate Emergency?
              </h3>
              <p className="text-xs text-rose-100 leading-snug mt-0.5">
                Civilians do not require an account or password to report an incident or find safe evacuation shelters.
              </p>
            </div>
          </div>

          <button
            onClick={handleGuestSOS}
            id="btn-login-guest-sos"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs shadow-md transition active:scale-98 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Enter Citizen SOS (No Login)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The Primary Auth Container Card */}
        <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-2 gap-2">
            <button
              onClick={() => {
                setActiveMode('officer');
                setEmail('sarah.vance@eoc.gov');
                setClearanceRole('admin');
              }}
              id="tab-login-officer"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activeMode === 'officer'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Command Staff & Responders</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('citizen');
                setEmail('elena.rostova@metro.org');
                setClearanceRole('citizen');
              }}
              id="tab-login-citizen"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activeMode === 'citizen'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Community Portal</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('register');
              }}
              id="tab-login-register"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                activeMode === 'register'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Agency Registration</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Authentication Form */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold mb-2">
                  <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    {activeMode === 'officer'
                      ? 'Incident Command System (ICS) Gateway'
                      : activeMode === 'citizen'
                      ? 'Civilian Life-Safety Portal'
                      : 'Relief Agency Accreditation'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {activeMode === 'officer'
                    ? 'Command & Tactical Officer Login'
                    : activeMode === 'citizen'
                    ? 'Citizen Responder Login'
                    : 'Register Emergency Response Agency'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeMode === 'officer'
                    ? 'Authenticate using your municipal agency credentials or select a 1-click test role below.'
                    : activeMode === 'citizen'
                    ? 'Sign in to review community alerts, track your filed emergency reports, or locate shelters.'
                    : 'Submit verification details to coordinate volunteer brigades or medical reserve teams.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Body for Officer / Citizen */}
              {activeMode !== 'register' ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Email / Badge ID */}
                  <div className="space-y-1">
                    <label
                      htmlFor="input-login-email"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                    >
                      <span>
                        {activeMode === 'officer' ? 'Official Agency Email / Badge ID' : 'Registered Email Address'}
                      </span>
                      {activeMode === 'officer' && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          e.g. sarah.vance@eoc.gov
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-email"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          activeMode === 'officer'
                            ? 'officer@eoc.gov or badge number...'
                            : 'name@example.com...'
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-hidden transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="input-login-password"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Security Key / Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Forgot credentials?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Clearance Role Selector (Officer mode only) */}
                  {activeMode === 'officer' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Operational Clearance Level
                      </label>
                      <select
                        value={clearanceRole}
                        onChange={(e) => setClearanceRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium"
                      >
                        <option value="admin">Level 5: Incident Commander (Full Allocation Approval)</option>
                        <option value="officer">Level 3: Tactical Dispatch Officer & Squad Leader</option>
                        <option value="citizen">Level 1: Community Liaison / Observer</option>
                      </select>
                    </div>
                  )}

                  {/* Checkbox options */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberTerminal}
                        onChange={(e) => setRememberTerminal(e.target.checked)}
                        className="rounded-md border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Remember this workstation terminal for 24 hours</span>
                    </label>

                    {activeMode === 'officer' && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={complianceChecked}
                          onChange={(e) => setComplianceChecked(e.target.checked)}
                          className="rounded-md border-slate-300 dark:border-slate-700 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-[11px]">
                          Confirm CJIS compliance & protocol integrity for tactical radio channels
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    id="btn-login-submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/25 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Clearance...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {activeMode === 'officer'
                            ? clearanceRole === 'admin'
                              ? 'Authenticate & Open Dispatcher Dashboard'
                              : 'Authenticate & Open Incident Queue'
                            : 'Access Emergency Incident Form'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Agency Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Officer / Liaison Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Lt. Carlos Ramirez"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Official Department / Agency
                    </label>
                    <input
                      type="text"
                      required
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      placeholder="e.g. County Fire Rescue, Red Cross Logistics..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Agency Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. carlos.ramirez@relief.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Requested Role Tier
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="officer">Emergency Response Officer / Squad Leader</option>
                      <option value="admin">Command Staff Liaison (Admin Level)</option>
                      <option value="citizen">Civic Community Relief Representative</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    id="btn-register-submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Register Agency & Issue Credentials</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Side: Fast 1-Click Interactive Demo Personas */}
            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800/80 lg:pl-8 pt-6 lg:pt-0 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Instant 1-Click Demo Profiles</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select a persona to immediately experience the operations platform with pre-configured authority tiers:
                </p>
              </div>

              {/* Persona 1: Admin / Incident Commander */}
              <div
                onClick={() => handleQuickLogin('admin', 'sarah.vance@eoc.gov')}
                id="btn-quick-login-admin"
                className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition cursor-pointer space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      SV
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center gap-1.5">
                        <span>Chief Sarah Vance</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[9px] font-bold">
                          ADMIN
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">EOC-DIR-01 • Level 5 Commander</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition -translate-x-1 group-hover:translate-x-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight pl-10">
                  Full command authorization: approve smart AI allocations, dispatch squads, and manage hospital surges.
                </p>
                <div className="pl-10 text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <span>↳ Post-login route:</span>
                  <span className="underline font-bold">Dispatcher Dashboard</span>
                </div>
              </div>

              {/* Persona 2: Emergency Response Officer */}
              <div
                onClick={() => handleQuickLogin('officer', 'marcus.reed@rescue.gov')}
                id="btn-quick-login-officer"
                className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition cursor-pointer space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      MR
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1.5">
                        <span>Capt. Marcus Reed</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                          OFFICER
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">TAC-OFF-84 • Field Dispatcher</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition -translate-x-1 group-hover:translate-x-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight pl-10">
                  Tactical unit view: live GPS tracking, casualty triage coordination, and field status logging.
                </p>
                <div className="pl-10 text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <span>↳ Post-login route:</span>
                  <span className="underline font-bold">Tactical Incident Queue</span>
                </div>
              </div>

              {/* Persona 3: Citizen / Community Member */}
              <div
                onClick={() => handleQuickLogin('citizen', 'elena.rostova@metro.org')}
                id="btn-quick-login-citizen"
                className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition cursor-pointer space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      ER
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5">
                        <span>Elena Rostova</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                          CITIZEN
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Civilian Portal Access</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition -translate-x-1 group-hover:translate-x-0" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight pl-10">
                  Civilian life-safety: instant emergency reporting form, real-time response tracking, and shelter finder.
                </p>
                <div className="pl-10 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>↳ Post-login route:</span>
                  <span className="underline font-bold">Emergency Incident Form</span>
                </div>
              </div>

              {/* Security Audit Footer */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>CJIS & NIST SP 800-53 Authenticated</span>
                </div>
                <p className="leading-tight">
                  All terminal keystrokes, dispatches, and hospital casualty routings are cryptographically logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Badges */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2 text-[11px]">
          <span>© 2026 Metropolitan Emergency Operations Command</span>
          <span>•</span>
          <span>FEMA NIMS Standard</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hover:underline cursor-pointer" onClick={() => setShowForgotModal(true)}>
            Operations Dispatch Line: 1-800-555-EOC1
          </span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Status: All Systems Operational
          </span>
        </div>
      </footer>

      {/* Forgot Credentials Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Officer Credential Recovery
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Incident Command System Security Protocol
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>
                To maintain physical and cyber security per FEMA Title 44, cryptographic access keys cannot be reset via unverified self-service.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] space-y-1">
                <div>Emergency Communications Hub: <strong>(555) 911-EOC1</strong></div>
                <div>Radio Dispatch Channel: <strong>Tac-Alpha-7</strong></div>
                <div>Supervisor Call-Sign: <strong>EOC Chief Dispatcher</strong></div>
              </div>
              <p className="text-[11px] text-slate-400">
                For rapid testing, you may close this dialog and click any of the 1-click profiles on the right to enter instantly.
              </p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition"
            >
              Return to Login Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
