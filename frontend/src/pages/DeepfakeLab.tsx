import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Info,
  Sliders,
  Radio,
  Eye,
  Lock,
  Volume2
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  category: string;
  impersonatedEntity: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SAFE';
  script: string;
  duration: number; // in seconds
  isDeepfake: boolean;
  synthFrequencySpike: number; // in kHz, e.g. 3.2
  respiratoryBreathsDetected: number; // 0 for synthetic, >2 for real
  noiseFloorDb: string; // e.g. "-96 dB (Artificial Zero)" vs "-48 dB (Acoustic Room)"
  deepfakeClues: string[];
  safeAction: string;
  explanation: string;
  audioVoicePitch: number;
  audioVoiceRate: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'scen-1',
    title: 'Digital Arrest Threat Call',
    category: 'CBI Police Impersonation',
    impersonatedEntity: 'Inspector Vikram, Cyber Crime HQ Delhi',
    threatLevel: 'CRITICAL',
    script:
      '"This is Inspector Vikram from CBI Cyber Crime HQ Delhi. An illegal parcel containing prohibited contraband was booked under your Aadhaar number. Connect immediately to Skype for video deposition or your bank accounts and passport will be frozen within 2 hours."',
    duration: 14,
    isDeepfake: true,
    synthFrequencySpike: 3.2,
    respiratoryBreathsDetected: 0,
    noiseFloorDb: '-98 dB (Sterile Digital Silence)',
    deepfakeClues: [
      '3.2 kHz synthetic vocoder harmonic spike detected across all vowel transitions',
      'Zero acoustic inhalations/respiratory breaths throughout 14 seconds of speech',
      'Sterile noise floor with zero room reverb or ambient station acoustics',
      'Digital Arrest does not exist under Indian Law — CBI never conducts arrests over Skype or WhatsApp'
    ],
    safeAction: 'Immediately disconnect. Report to National Cyber Crime Portal (cybercrime.gov.in) or dial 1930.',
    explanation:
      'Scammers use AI voice generators trained on public YouTube interviews of police officers. Indian law enforcement agencies NEVER issue arrest warrants or conduct official interrogation via video call.',
    audioVoicePitch: 0.9,
    audioVoiceRate: 0.95
  },
  {
    id: 'scen-2',
    title: 'Emergency Family Kidnap Extortion',
    category: 'Kinship Distress Scam',
    impersonatedEntity: 'Rahul (Younger Brother / Cousin)',
    threatLevel: 'CRITICAL',
    script:
      '"Bhaiya... please help me! I was in a severe auto-rickshaw accident near the station. The driver is threatening to beat me up and police are holding my bag. Please urgently UPI ₹15,000 to this clinic scanner right now, don\'t call Mummy or she will faint!"',
    duration: 16,
    isDeepfake: true,
    synthFrequencySpike: 2.9,
    respiratoryBreathsDetected: 0,
    noiseFloorDb: '-94 dB (Artificial Zero Loop)',
    deepfakeClues: [
      'Cloned neural voice signature matching ElevenLabs/Bark model diffusion artifacts',
      'Unnatural panic cadence without genuine physiological sob tremor or lung compression',
      'Zero background street or traffic audio despite claim of being on the highway',
      'Classic coercion pattern: urging urgency and demanding secrecy from parents'
    ],
    safeAction: 'Do not transfer money. Immediately hang up and call Rahul on his regular SIM number or call parents.',
    explanation:
      'Deepfake distress scams clone children\'s voices using 5-second audio snippets extracted from Instagram Reels or TikTok. Families should establish a secret verbal "Safe Word" to verify distress calls.',
    audioVoicePitch: 1.1,
    audioVoiceRate: 1.05
  },
  {
    id: 'scen-3',
    title: 'School Principal Urgent Gift Card Trap',
    category: 'Authority Abuse Scam',
    impersonatedEntity: 'Dr. K. Sharma (School Principal)',
    threatLevel: 'HIGH',
    script:
      '"Good evening cadet. This is Principal Sharma speaking. I am currently locked in a state education board meeting and cannot take calls. I need you to purchase five Google Play gift cards of ₹1,000 each for tomorrow\'s annual prize distribution. Send the codes to principal.office.urgent@gmail.com."',
    duration: 17,
    isDeepfake: true,
    synthFrequencySpike: 3.4,
    respiratoryBreathsDetected: 0,
    noiseFloorDb: '-99 dB (Pure Synthetic Zero)',
    deepfakeClues: [
      'Uncanny robotic rhythm with zero syllable elongation during pauses',
      'Vocal frequency profile reveals high-frequency vocoder clipping at 3.4 kHz',
      'Requests emergency purchase of untraceable gift cards via personal Gmail domain',
      'School administrators never ask students to purchase gift vouchers with personal funds'
    ],
    safeAction: 'Never purchase gift vouchers. Report the suspicious recording directly to the school administration office.',
    explanation:
      'Impersonation of authority figures relies on students feeling too intimidated to question instructions. Real school communications always flow through official registered channels.',
    audioVoicePitch: 0.85,
    audioVoiceRate: 0.92
  },
  {
    id: 'scen-4',
    title: 'Official Bank Automated Security Alert',
    category: 'Legitimate Financial IVR',
    impersonatedEntity: 'State Bank of India Automated IVR Alert',
    threatLevel: 'SAFE',
    script:
      '"State Bank of India automated security notice. An attempted transaction of ₹4,999 on your debit card ending in 4102 was flagged for unusual location. If you authorized this, press 1. If you did NOT authorize this, press 2 to immediately freeze your card. Remember, SBI never asks for your OTP, CVV, or UPI PIN."',
    duration: 18,
    isDeepfake: false,
    synthFrequencySpike: 0, // No spike
    respiratoryBreathsDetected: 3,
    noiseFloorDb: '-46 dB (Natural Studio Floor)',
    deepfakeClues: [
      'Natural studio voiceover with authentic human diaphragmatic cadence',
      'Balanced harmonic distribution with natural low-frequency resonance and no 3kHz vocoder spikes',
      'Explicit safety advisory warning the customer to NEVER disclose OTP or UPI PIN',
      'Interactive automated keypad options (Press 1 or 2) with no suspicious personal link or external payment requests'
    ],
    safeAction: 'This is a genuine alert. Follow the automated keypad prompt (Press 2) or call the number on the back of your card.',
    explanation:
      'Legitimate financial institutions notify you of suspicious debit card activity and provide direct self-service block options without demanding your confidential passwords.',
    audioVoicePitch: 1.0,
    audioVoiceRate: 1.0
  }
];

export const DeepfakeLab: React.FC = () => {
  const { completeMission, unlockBadge, addXP } = useGame();
  const navigate = useNavigate();

  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100

  // Forensic Filter Toggles
  const [filterPitchAnomaly, setFilterPitchAnomaly] = useState(true);
  const [filterCadenceBreath, setFilterCadenceBreath] = useState(false);
  const [filterNoiseFloor, setFilterNoiseFloor] = useState(false);

  // Verdict state
  const [selectedVerdict, setSelectedVerdict] = useState<'DEEPFAKE' | 'AUTHENTIC' | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [labCompleted, setLabCompleted] = useState(false);

  const scenario = SCENARIOS[currentScenarioIdx];

  // Canvas ref for audio waveform
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Audio Context refs for synthetic procedural tone/effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Clean up on unmount or scenario switch
  useEffect(() => {
    stopAudio();
    setSelectedVerdict(null);
    setHasEvaluated(false);
    setPlaybackProgress(0);
  }, [currentScenarioIdx]);

  // Audio playback simulator using SpeechSynthesis & Web Audio Canvas
  const playAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsPlaying(true);

    // Try SpeechSynthesis if supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(scenario.script);
      utterance.rate = scenario.audioVoiceRate;
      utterance.pitch = scenario.audioVoicePitch;

      // Pick an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes('en') || v.lang.includes('IN')) || voices[0];
      if (engVoice) utterance.voice = engVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Web Audio Canvas Animation
    const startTime = Date.now();
    const durationMs = scenario.duration * 1000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setPlaybackProgress(pct);

      if (pct < 100) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        setIsPlaying(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const stopAudio = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Canvas Spectrogram Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Dark radar background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Frequency axis labels
      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      ctx.fillText('0 Hz', 6, height - 6);
      ctx.fillText('1.5 kHz', 6, height / 2 + 3);
      ctx.fillText('3.0 kHz (Vocoder Band)', 6, 28);
      ctx.fillText('5.0 kHz', 6, 12);

      const numBars = 54;
      const barWidth = (width - 60) / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = 50 + i * barWidth;
        const normalizedFreq = i / numBars; // 0 to 1

        // Base wave calculation
        let barHeight = isPlaying
          ? Math.abs(Math.sin(phase + i * 0.25)) * 40 + Math.cos(phase * 1.5 + i * 0.15) * 20 + 15
          : 8 + Math.sin(i * 0.3) * 4;

        // Artificial Synthetic Spike at ~3.2kHz if scenario is deepfake and filter is enabled
        const isSpikeBand = normalizedFreq >= 0.58 && normalizedFreq <= 0.68;
        if (scenario.isDeepfake && isSpikeBand) {
          if (filterPitchAnomaly) {
            barHeight = isPlaying ? 78 + Math.sin(phase * 4) * 8 : 45;
          }
        }

        // Color coding
        let barGradient = ctx.createLinearGradient(x, height, x, height - barHeight);
        if (scenario.isDeepfake && isSpikeBand && filterPitchAnomaly) {
          barGradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
          barGradient.addColorStop(0.6, '#f97316');
          barGradient.addColorStop(1, '#ef4444');
        } else {
          barGradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
          barGradient.addColorStop(0.7, '#06b6d4');
          barGradient.addColorStop(1, '#3b82f6');
        }

        ctx.fillStyle = barGradient;
        ctx.fillRect(x, height - barHeight - 10, barWidth - 2, barHeight);

        // Highlight cap
        ctx.fillStyle = scenario.isDeepfake && isSpikeBand && filterPitchAnomaly ? '#fee2e2' : '#bae6fd';
        ctx.fillRect(x, height - barHeight - 11, barWidth - 2, 2);
      }

      // Filter Overlays
      if (filterPitchAnomaly && scenario.isDeepfake) {
        // Red horizontal band at 3kHz
        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.fillRect(50, 18, width - 60, 26);

        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(50, 31);
        ctx.lineTo(width, 31);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('⚠️ SYNTHETIC HARMONIC ARTIFACT (3.2 kHz SPIKE)', width - 290, 26);
      }

      if (filterCadenceBreath) {
        ctx.fillStyle = scenario.isDeepfake ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)';
        ctx.font = 'bold 10px monospace';
        const msg = scenario.isDeepfake
          ? '⚠️ ZERO INHALATIONS DETECTED (CADENCE VARIANCE: 0.01s)'
          : '✓ NATURAL RESPIRATORY DIAPHRAGMATIC CYCLES DETECTED';
        ctx.fillText(msg, width - 330, height - 18);
      }

      if (filterNoiseFloor) {
        ctx.fillStyle = scenario.isDeepfake ? 'rgba(239, 68, 68, 0.9)' : 'rgba(56, 189, 248, 0.9)';
        ctx.font = 'bold 10px monospace';
        const noiseMsg = `NOISE FLOOR: ${scenario.noiseFloorDb}`;
        ctx.fillText(noiseMsg, 60, height - 18);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, filterPitchAnomaly, filterCadenceBreath, filterNoiseFloor, scenario]);

  // Handle verdict selection
  const handleSelectVerdict = (verdict: 'DEEPFAKE' | 'AUTHENTIC') => {
    if (hasEvaluated) return;
    setSelectedVerdict(verdict);
    setHasEvaluated(true);

    const isCorrect =
      (verdict === 'DEEPFAKE' && scenario.isDeepfake) ||
      (verdict === 'AUTHENTIC' && !scenario.isDeepfake);

    if (isCorrect) {
      setScore(prev => prev + 1);
      addXP(50);
    }

    if (!completedScenarios.includes(scenario.id)) {
      setCompletedScenarios(prev => [...prev, scenario.id]);
    }
  };

  const handleNextScenario = () => {
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx(prev => prev + 1);
    } else {
      // Completed all
      setLabCompleted(true);
      completeMission('deepfake', 3, 200, 50);
      unlockBadge('Deepfake Analyst');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto select-none pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20">
              <Mic className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/45">
                  AI Forensic Audio Lab
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Case {currentScenarioIdx + 1} of {SCENARIOS.length}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mt-1">
                AI Voice Clone & Deepfake Audio Forensics
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Analyze synthetic vocal spectrograms, detect vocoder pitch anomalies, and bust digital arrest scams.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-indigo-500/30 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Analysis Accuracy</div>
              <div className="text-lg font-black text-cyan-400">
                {score} / {SCENARIOS.length} Correct
              </div>
            </div>
            <Award className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      </div>

      {!labCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Spectrogram & Audio Player (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Audio Waveform & Canvas Visualizer Card */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Dual-Band FFT Audio Spectrogram
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/60">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Live 48kHz Sampling
                </div>
              </div>

              {/* Canvas Spectrogram */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={220}
                  className="w-full h-[220px] block"
                />

                {/* Progress bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-150"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={playAudio}
                    type="button"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/30'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause Audio Stream' : 'Play Intercepted Audio'}
                  </button>

                  <button
                    onClick={() => {
                      stopAudio();
                      setPlaybackProgress(0);
                    }}
                    type="button"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer border border-slate-700"
                    title="Rewind to start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>0:{(scenario.duration * (playbackProgress / 100)).toFixed(0).padStart(2, '0')}</span>
                    <span>/</span>
                    <span>0:{scenario.duration.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Risk Assessment:
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md border ${
                      scenario.threatLevel === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : scenario.threatLevel === 'HIGH'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {scenario.threatLevel}
                  </span>
                </div>
              </div>

              {/* Forensic Filter Toggle Strip */}
              <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Cadet Forensic Filter Overlays (Toggle to Reveal Hidden Signatures)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFilterPitchAnomaly(!filterPitchAnomaly)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      filterPitchAnomaly
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Radio className={`w-4 h-4 shrink-0 ${filterPitchAnomaly ? 'text-rose-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[11px] font-black uppercase leading-tight">3kHz Pitch Anomaly</div>
                      <div className="text-[9px] text-slate-400">Exposes vocoder diffusion spikes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterCadenceBreath(!filterCadenceBreath)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      filterCadenceBreath
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity className={`w-4 h-4 shrink-0 ${filterCadenceBreath ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[11px] font-black uppercase leading-tight">Breath / Cadence Lens</div>
                      <div className="text-[9px] text-slate-400">Audits biological lung inhalations</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterNoiseFloor(!filterNoiseFloor)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      filterNoiseFloor
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className={`w-4 h-4 shrink-0 ${filterNoiseFloor ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-[11px] font-black uppercase leading-tight">Noise Floor Mismatch</div>
                      <div className="text-[9px] text-slate-400">Detects sterile digital zero dB</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Transcript Card */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-600" />
                  Intercepted Voice Call Transcript
                </span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Caller: {scenario.impersonatedEntity}
                </span>
              </div>
              <blockquote className="italic text-slate-800 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {scenario.script}
              </blockquote>
            </div>
          </div>

          {/* Forensic Analysis & Verdict Panel (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Case Details Card */}
            <div className="bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-sm flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                  {scenario.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-snug mt-0.5">
                  {scenario.title}
                </h3>
              </div>

              {/* Telemetry Metrics */}
              <div className="flex flex-col gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">Vocoder Anomaly</span>
                  <span className="font-mono font-black text-slate-900">
                    {scenario.synthFrequencySpike > 0 ? `${scenario.synthFrequencySpike} kHz Peak` : 'None (Natural)'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">Natural Inhalations</span>
                  <span className="font-mono font-black text-slate-900">
                    {scenario.respiratoryBreathsDetected} Detected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Room Acoustics</span>
                  <span className="font-mono font-black text-slate-900">
                    {scenario.noiseFloorDb.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Verdict Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 text-center">
                  Forensic Agent Verdict
                </span>

                <button
                  type="button"
                  disabled={hasEvaluated}
                  onClick={() => handleSelectVerdict('DEEPFAKE')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    hasEvaluated && scenario.isDeepfake
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200'
                  } ${hasEvaluated && selectedVerdict !== 'DEEPFAKE' ? 'opacity-50' : ''}`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Synthetic AI Voice Clone (Deepfake)
                </button>

                <button
                  type="button"
                  disabled={hasEvaluated}
                  onClick={() => handleSelectVerdict('AUTHENTIC')}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    hasEvaluated && !scenario.isDeepfake
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                  } ${hasEvaluated && selectedVerdict !== 'AUTHENTIC' ? 'opacity-50' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authentic Human Recording
                </button>
              </div>

              {/* Post-Verdict Evaluation Box */}
              {hasEvaluated && (
                <div
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-3 animate-in fade-in duration-300 ${
                    (selectedVerdict === 'DEEPFAKE' && scenario.isDeepfake) ||
                    (selectedVerdict === 'AUTHENTIC' && !scenario.isDeepfake)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm uppercase">
                    {(selectedVerdict === 'DEEPFAKE' && scenario.isDeepfake) ||
                    (selectedVerdict === 'AUTHENTIC' && !scenario.isDeepfake) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Analysis Confirmed! (+50 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Forensic Assessment Missed</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {scenario.explanation}
                  </p>

                  <div className="bg-white/80 p-3 rounded-xl border border-black/10 text-xs">
                    <span className="font-black block uppercase text-[10px] text-indigo-700 mb-1">
                      Cyber Defense Action:
                    </span>
                    {scenario.safeAction}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all mt-1"
                  >
                    <span>{currentScenarioIdx < SCENARIOS.length - 1 ? 'Analyze Next Audio Intercept' : 'Claim Deepfake Stamp'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Lab Completion & Badge Unlocked Screen */
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-8 sm:p-12 shadow-2xl text-center max-w-2xl mx-auto flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-100">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Mission Neutralized
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Deepfake Forensics Certification Earned!
            </h2>
            <p className="text-sm text-slate-600 font-medium max-w-md mx-auto mt-2">
              You successfully identified synthetic voice vectors, uncovered 3.2kHz vocoder artifacts, and learned how to neutralize digital arrest extortion.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl">
              <div className="text-2xl font-black text-indigo-600">+200 XP</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Cadet Experience</div>
            </div>
            <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl">
              <div className="text-2xl font-black text-emerald-600">DEEPFAKE</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Passport Stamp</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/passport')}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg cursor-pointer transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Passport Stamps</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/threat-radar')}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-500 hover:to-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg cursor-pointer transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Enter Threat Radar SOC</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
