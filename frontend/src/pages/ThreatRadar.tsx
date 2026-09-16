import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import {
  Radar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Globe,
  Radio,
  Crosshair,
  Server,
  Activity,
  Award,
  ArrowRight,
  Terminal,
  Lock,
  WifiOff,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ThreatIncident {
  id: string;
  region: string;
  city: string;
  coords: { angle: number; distance: number }; // polar for radar: angle in radians, distance 0..1
  threatType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  affectedSchools: number;
  mitigationSteps: string[];
  status: 'ACTIVE' | 'NEUTRALIZING' | 'RESOLVED';
  iocUrl: string;
}

const INITIAL_INCIDENTS: ThreatIncident[] = [
  {
    id: 'inc-hyd-01',
    region: 'Telangana',
    city: 'Hyderabad',
    coords: { angle: 1.2, distance: 0.45 },
    threatType: 'Predatory Instant Loan APK Sideload',
    severity: 'CRITICAL',
    description: 'Malicious fake loan app "RupeeRocket-Instant" requesting full SMS read and Contact sync permissions targeted at college students.',
    affectedSchools: 18,
    mitigationSteps: ['Revoke Android Contacts/SMS Permissions', 'Report Package to CERT-In CSIRT', 'Deploy School Wi-Fi DNS Sinkhole'],
    status: 'ACTIVE',
    iocUrl: 'http://cdn-fastrupee-download.in/app.apk'
  },
  {
    id: 'inc-del-02',
    region: 'Delhi NCR',
    city: 'New Delhi',
    coords: { angle: 4.8, distance: 0.65 },
    threatType: 'Digital Arrest Video Syndicate',
    severity: 'CRITICAL',
    description: 'Rogue call center impersonating Delhi Police Cyber Cell threatening students with bogus contraband parcel seizures via Skype.',
    affectedSchools: 32,
    mitigationSteps: ['Disconnect Unregistered Video Intercom', 'Dispatch National 1930 Cyber Fraud Alert', 'Block Spoofed VoIP Gateway'],
    status: 'ACTIVE',
    iocUrl: 'skype:cbi_cyber_hq_delhi_case99'
  },
  {
    id: 'inc-blr-03',
    region: 'Karnataka',
    city: 'Bengaluru',
    coords: { angle: 2.1, distance: 0.35 },
    threatType: 'Exam Leak Discord Phishing Botnet',
    severity: 'HIGH',
    description: 'Compromised Discord bots promising leaked Board Exam Question Papers requiring students to submit parent UPI QR scans.',
    affectedSchools: 24,
    mitigationSteps: ['Revoke Bot OAuth2 Authorization', 'Broadcast Warning to CBSE / ICSE Guilds', 'Flag UPI Merchant VPA to NPCI'],
    status: 'ACTIVE',
    iocUrl: 'https://cbse-leaks-verified2026.top/verify'
  },
  {
    id: 'inc-mum-04',
    region: 'Maharashtra',
    city: 'Mumbai',
    coords: { angle: 3.5, distance: 0.55 },
    threatType: 'Counterfeit School Fee UPI QR Trap',
    severity: 'HIGH',
    description: 'Stickers pasted over legitimate school canteen and fee counters redirecting payments to an unverified private savings account.',
    affectedSchools: 14,
    mitigationSteps: ['Audit Physical QR Stands with Dynamic BharatQR', 'Verify Merchant VPA Name Match', 'Notify Cyber Police Station'],
    status: 'ACTIVE',
    iocUrl: 'upi://pay?pa=schoolfees_fraud@fakebank'
  },
  {
    id: 'inc-kol-05',
    region: 'West Bengal',
    city: 'Kolkata',
    coords: { angle: 0.4, distance: 0.75 },
    threatType: 'Gaming Free Fire / Roblox Token Stealer',
    severity: 'MEDIUM',
    description: 'Phishing website promising free game skin vouchers harvesting students’ Google accounts and session cookies.',
    affectedSchools: 29,
    mitigationSteps: ['Terminate Active Browser Sessions', 'Enforce FIDO2 / 2-Factor Authentication', 'Blacklist Phishing Domain'],
    status: 'ACTIVE',
    iocUrl: 'https://freefire-diamonds-claim-free.org'
  }
];

const TICKER_ITEMS = [
  '🚨 [HYD-SOC]: 240+ malicious APK download requests blocked on state student networks.',
  '🛡️ [DEL-CERT]: Delhi Police cyber unit detains 4 operators of fake Skype arrest syndicate.',
  '⚡ [BLR-SOC]: Automated NPCI freeze triggered on 3 fraudulent UPI handles targeting school fees.',
  '⚠️ [MUM-SEC]: Physical QR audit initiated across 120 school campuses in Mumbai metropolitan region.',
  '🌐 [NAT-RADAR]: National cyber threat level downgraded from DEFCON 2 to DEFCON 4 as cadet mitigation proceeds.'
];

export const ThreatRadar: React.FC = () => {
  const { completeMission, unlockBadge, addXP } = useGame();
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState<ThreatIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(INITIAL_INCIDENTS[0].id);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [threatsNeutralizedCount, setThreatsNeutralizedCount] = useState(18492);
  const [activeStepIndex, setActiveStepIndex] = useState<Record<string, number>>({});
  const [radarZoom, setRadarZoom] = useState<'PAN-INDIA' | 'ZONE-FOCUS'>('PAN-INDIA');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sweepAngleRef = useRef<number>(0);

  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];
  const allResolved = incidents.every(inc => inc.status === 'RESOLVED');

  // Rotate ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Radar animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderRadar = () => {
      sweepAngleRef.current = (sweepAngleRef.current + 0.025) % (Math.PI * 2);
      const sweep = sweepAngleRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Dark futuristic background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Radar outer border
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Concentric range circles
      const rings = 4;
      for (let i = 1; i <= rings; i++) {
        const r = (radius / rings) * i;
        ctx.strokeStyle = i === rings ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Distance text
        ctx.fillStyle = '#0284c7';
        ctx.font = '9px monospace';
        ctx.fillText(`${i * 125} KM`, centerX + 4, centerY - r + 11);
      }

      // Crosshairs
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Sweeping Beam Gradient
      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      sweepGradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweep - 0.45, sweep);
      ctx.closePath();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fill();

      // Leading beam line
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweep) * radius, centerY + Math.sin(sweep) * radius);
      ctx.stroke();
      ctx.restore();

      // Draw Incident Blips
      incidents.forEach(inc => {
        const blipR = inc.coords.distance * radius;
        const blipX = centerX + Math.cos(inc.coords.angle) * blipR;
        const blipY = centerY + Math.sin(inc.coords.angle) * blipR;

        // Angle difference to current sweep
        let angleDiff = Math.abs(sweep - inc.coords.angle) % (Math.PI * 2);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
        const isSwept = angleDiff < 0.2;

        const isSelected = inc.id === selectedIncidentId;
        const isResolved = inc.status === 'RESOLVED';

        // Blip Glow
        ctx.save();
        if (isResolved) {
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#34d399';
        } else if (inc.severity === 'CRITICAL') {
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#f87171';
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#fbbf24';
        }

        // Pulse ring if swept or selected
        if (isSwept || isSelected) {
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(blipX, blipY, isSelected ? 12 : 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Center dot
        ctx.beginPath();
        ctx.arc(blipX, blipY, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        // City Tag
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.fillText(`${inc.city} [${isResolved ? 'SECURE' : inc.severity[0]}]`, blipX + 8, blipY - 4);

        ctx.restore();
      });

      animId = requestAnimationFrame(renderRadar);
    };

    renderRadar();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [incidents, selectedIncidentId]);

  // Execute mitigation step
  const handleMitigationStep = (stepIdx: number) => {
    const currentStep = activeStepIndex[selectedIncident.id] || 0;
    if (stepIdx !== currentStep) return;

    const nextStep = currentStep + 1;
    setActiveStepIndex(prev => ({ ...prev, [selectedIncident.id]: nextStep }));

    if (nextStep >= selectedIncident.mitigationSteps.length) {
      // Incident fully resolved!
      setIncidents(prev =>
        prev.map(inc => (inc.id === selectedIncident.id ? { ...inc, status: 'RESOLVED' } : inc))
      );
      setThreatsNeutralizedCount(prev => prev + 1);
      addXP(60);

      // Check if all are resolved
      const remainingUnresolved = incidents.filter(
        inc => inc.id !== selectedIncident.id && inc.status !== 'RESOLVED'
      );
      if (remainingUnresolved.length === 0) {
        completeMission('threat_radar', 3, 200, 50);
        unlockBadge('SOC Radar Guardian');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto select-none pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20">
              <Radar className="w-7 h-7 text-white animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  National SOC Command Center
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Telemetry Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
                National Cyber Threat Radar & War Room
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Real-time regional attack radar across Indian schools. Intercept fraud rings, deploy DNS sinkholes, and coordinate national defense.
              </p>
            </div>
          </div>

          {/* National Counter Widget */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-cyan-500/30 px-5 py-3 rounded-2xl backdrop-blur-md">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Threats Neutralized</div>
              <div className="text-xl font-mono font-black text-cyan-400">
                {threatsNeutralizedCount.toLocaleString()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">National Defense Status</div>
              <div className={`text-xs font-black uppercase ${allResolved ? 'text-emerald-400' : 'text-amber-400'}`}>
                {allResolved ? 'DEFCON 5 (GUARDED)' : 'DEFCON 2 (ELEVATED)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Rolling Security Ticker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 px-4 flex items-center gap-3 text-xs shadow-md overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0 bg-red-950/80 text-red-400 border border-red-800 px-2.5 py-1 rounded-lg font-black uppercase text-[10px] tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          Live Threat Feed
        </div>
        <div className="font-mono text-slate-300 truncate">
          {TICKER_ITEMS[tickerIndex]}
        </div>
      </div>

      {/* Main War Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Station Canvas (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Regional Radar Sweep (500 KM Radius)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRadarZoom(radarZoom === 'PAN-INDIA' ? 'ZONE-FOCUS' : 'PAN-INDIA')}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all"
                >
                  Mode: {radarZoom}
                </button>
              </div>
            </div>

            {/* Radar Canvas */}
            <div className="relative rounded-full p-2 bg-slate-900/50 border border-cyan-900/40 shadow-inner">
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                className="w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] block rounded-full"
              />
            </div>

            {/* Incursion selector pills */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
              {incidents.map(inc => {
                const isSelected = inc.id === selectedIncidentId;
                const isResolved = inc.status === 'RESOLVED';
                return (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                        : isResolved
                        ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-[11px] font-black truncate">{inc.city}</div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">{inc.region}</div>
                    </div>
                    {isResolved ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ml-1 ${
                          inc.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Incident Infiltration & Defense Mitigation Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      selectedIncident.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : selectedIncident.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {selectedIncident.status === 'RESOLVED' ? 'THREAT CONTAINED' : `${selectedIncident.severity} SEVERITY`}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {selectedIncident.city}, {selectedIncident.region}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">
                  {selectedIncident.threatType}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {selectedIncident.description}
            </p>

            {/* Indicator of Compromise (IoC) */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-300 font-mono text-[11px] flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-500 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                Indicator of Compromise (IoC Target)
              </span>
              <span className="text-rose-400 break-all">{selectedIncident.iocUrl}</span>
            </div>

            {/* Mitigation Pipeline Checklist */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>SOC Interception Protocol</span>
                <span className="text-indigo-600 font-mono text-[11px]">
                  {activeStepIndex[selectedIncident.id] || 0} / {selectedIncident.mitigationSteps.length} Deployed
                </span>
              </span>

              <div className="flex flex-col gap-2">
                {selectedIncident.mitigationSteps.map((step, idx) => {
                  const currentStep = activeStepIndex[selectedIncident.id] || 0;
                  const isDone = idx < currentStep || selectedIncident.status === 'RESOLVED';
                  const isCurrent = idx === currentStep && selectedIncident.status !== 'RESOLVED';

                  return (
                    <button
                      key={step}
                      type="button"
                      disabled={!isCurrent}
                      onClick={() => handleMitigationStep(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-default'
                          : isCurrent
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer border-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <Zap className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{step}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded-md">
                          Click to Deploy
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Impact Metric */}
            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-3">
              <span>Campuses Protected:</span>
              <span className="font-bold text-slate-900">{selectedIncident.affectedSchools} Institutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner when all resolved */}
      {allResolved && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-indigo-950 border-2 border-emerald-400 rounded-3xl p-8 text-white text-center shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black">All Regional Threats Neutralized!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mt-1">
              The national telemetry board is clean. You earned the <strong>SOC Radar Guardian</strong> distinction and the <strong>THREAT_RADAR_STAMP</strong> for your official Cadet ID.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/id-card')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Holographic Agent ID</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
            >
              Mission Control
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
