import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneOff, ShieldAlert, ShieldCheck, Mail, MessageSquare, 
  Lock, ArrowLeft, RefreshCw, QrCode, AlertTriangle, AlertCircle, 
  HelpCircle, ExternalLink, Compass, Clock, Send, Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RakshaMascot } from './RakshaMascot';

// Definitions for branching scenarios
export interface AppScenario {
  id: number;
  appName: 'whatsapp' | 'sms' | 'gmail' | 'call' | 'upi' | 'browser';
  sender: string;
  avatarText: string;
  initialText: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
    coins: number;
    leadsTo?: string; // branching dialog
  }[];
  // Specific to email/browser links
  linkUrl?: string;
  // Specific to QR challenge
  qrCodes?: {
    id: number;
    imageLabel: string;
    description: string;
    isSafe: boolean;
    explanation: string;
  }[];
}

interface SmartphoneSimulatorProps {
  scenarios: AppScenario[];
  missionName: string;
  badgeName: string;
  onMissionComplete: (score: number, maxScore: number) => void;
}

export const SmartphoneSimulator: React.FC<SmartphoneSimulatorProps> = ({
  scenarios,
  missionName,
  badgeName,
  onMissionComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedApp, setSelectedApp] = useState<AppScenario['appName'] | null>(null);
  
  // Decision States
  const [answered, setAnswered] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCorrectChoice, setIsCorrectChoice] = useState(false);
  const [vibrate, setVibrate] = useState(false);

  // Link intercept warning state
  const [showLinkWarning, setShowLinkWarning] = useState(false);
  const [interceptedLink, setInterceptedLink] = useState('');

  // QR Code States
  const [selectedQR, setSelectedQR] = useState<number | null>(null);

  // Call Screen States
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');

  const currentScenario = scenarios[currentIdx];

  // Ring tone / sound synthesizer
  const playTone = (type: 'ring' | 'correct' | 'wrong' | 'tick') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'tick') {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        // Ring
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.setValueAtTime(440, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {}
  };

  // Setup scenario state
  useEffect(() => {
    setAnswered(false);
    setFeedbackText('');
    setSelectedQR(null);
    setCallState('ringing');
    setSelectedApp(null);
  }, [currentIdx]);

  const triggerVibration = () => {
    setVibrate(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
    setTimeout(() => setVibrate(false), 500);
  };

  // Branching / choice selection
  const makeDecision = (choice: typeof currentScenario['options'][0]) => {
    if (answered) return;

    setAnswered(true);
    setIsCorrectChoice(choice.isCorrect);
    setFeedbackText(choice.explanation);

    if (choice.isCorrect) {
      setScore((prev) => prev + 1);
      playTone('correct');
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    } else {
      playTone('wrong');
      triggerVibration();
    }
  };

  // QR Selection handler
  const selectQRCard = (qr: {
    id: number;
    imageLabel: string;
    description: string;
    isSafe: boolean;
    explanation: string;
  }) => {
    if (answered) return;

    setSelectedQR(qr.id);
    setAnswered(true);
    setIsCorrectChoice(qr.isSafe);
    setFeedbackText(qr.explanation);

    if (qr.isSafe) {
      setScore((prev) => prev + 1);
      playTone('correct');
      confetti({ particleCount: 50, spread: 40 });
    } else {
      playTone('wrong');
      triggerVibration();
    }
  };

  // Suspicious Link Click Interceptor
  const handleLinkClick = (url: string) => {
    if (answered) return;
    setInterceptedLink(url);
    setShowLinkWarning(true);
  };


  const confirmLinkVisit = () => {
    setShowLinkWarning(false);
    const linkOption = currentScenario.options.find(
      opt => opt.text.toLowerCase().includes('click') || opt.text.toLowerCase().includes('open')
    );
    if (linkOption) {
      makeDecision(linkOption);
    } else {
      makeDecision({
        text: 'Click Link',
        isCorrect: false,
        explanation: '🚨 Warning! Clicking suspicious links redirects you to credential harvesters or malware installers.',
        points: 0,
        coins: 0
      });
    }
  };

  const cancelLinkVisit = () => {
    setShowLinkWarning(false);
    const backOption = currentScenario.options.find(
      opt => opt.text.toLowerCase().includes('ignore') || opt.text.toLowerCase().includes('delete') || opt.text.toLowerCase().includes('back')
    ) || {
      text: 'Go Back',
      isCorrect: true,
      explanation: '✨ SMART HABIT! You paused, thought about the link risk, and went back safely. +10 XP earned!',
      points: 10,
      coins: 5
    };
    
    makeDecision(backOption);
  };

  const handleNext = () => {
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onMissionComplete(score, scenarios.length);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start w-full">
      
      {/* 1. Left Guide panel: Raksha Owl */}
      <div className="flex flex-col gap-4">
        <div className="glass-panel-strong rounded-3xl p-5 border-2 border-indigo-100 flex flex-col gap-4 shadow-md bg-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Mission Telemetry</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-indigo-900 font-black uppercase tracking-wider">Mission Progress</div>
              <div className="text-base font-black text-indigo-950 mt-1">
                {currentIdx + 1} / {scenarios.length}
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center shadow-sm">
              <div className="text-[10px] text-emerald-900 font-black uppercase tracking-wider">Cyber Score</div>
              <div className="text-base font-black text-emerald-700 mt-1">
                {score} Correct
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <RakshaMascot 
              expression={
                answered 
                  ? (isCorrectChoice ? 'celebrate' : 'warning') 
                  : 'idle'
              }
              message={
                answered
                  ? (isCorrectChoice ? "Superb Job Student!" : "Oh no! Watch out for that trap!")
                  : "Read carefully and make your choice at your own pace."
              }
            />
          </div>
        </div>
      </div>

      {/* 2. Middle: Smartphone Simulator */}
      <div className="flex justify-center select-none lg:col-span-2">
        <div className={`
          w-full max-w-[340px] sm:max-w-sm h-[520px] sm:h-[580px] bg-slate-950 border-[6px] sm:border-[8px] border-slate-800 rounded-[36px] sm:rounded-[48px] shadow-2xl relative flex flex-col overflow-hidden justify-between
          ${vibrate ? 'animate-shake' : ''}
          transition-all duration-300 border-t-[10px] sm:border-t-[12px] border-b-[10px] sm:border-b-[12px]
        `}>
          {/* Top Notch Speaker / Camera */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full flex justify-center items-center z-50">
            <span className="w-10 h-1 bg-slate-700 rounded-full mr-2"></span>
            <span className="w-2.5 h-2.5 bg-slate-900 rounded-full"></span>
          </div>

          {/* Status bar */}
          <div className="bg-black/80 text-slate-200 text-[10px] font-black px-6 pt-7 pb-1.5 flex justify-between items-center z-40">
            <span>DigiNet 5G</span>
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-100 font-bold">Self-Paced</span>
            </div>
            <span>100% 🔋</span>
          </div>

          {/* Warning before clicking Link */}
          {showLinkWarning && (
            <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-center items-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-lg font-black text-rose-400 uppercase tracking-wide">Think Before You Click!</h3>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed max-w-[240px] font-bold">
                Suspicious links can steal your credentials, passwords, and photos.
              </p>

              <div className="flex flex-col gap-2.5 w-full mt-6">
                <button
                  onClick={cancelLinkVisit}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  🛡️ Cancel & Go Back (Safe)
                </button>
                <button
                  onClick={confirmLinkVisit}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-800"
                >
                  Continue anyway (Danger)
                </button>
              </div>
            </div>
          )}

          {/* App screens based on type */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto relative">
            
            {/* WHATSAPP APP */}
            {currentScenario.appName === 'whatsapp' && (
              <div className="flex-1 flex flex-col bg-[#e5ddd5] text-slate-900 font-sans">
                {/* WA Header */}
                <div className="bg-[#075E54] text-white p-3 pt-4 flex items-center gap-2.5 shadow-md">
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-black text-sm text-slate-800">
                    {currentScenario.avatarText}
                  </div>
                  <div>
                    <div className="font-black text-xs text-white">{currentScenario.sender}</div>
                    <div className="text-[9px] text-emerald-200 bg-emerald-800/60 px-1.5 py-0.5 rounded-full inline-block font-bold">Online</div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-3 flex flex-col justify-end gap-3 min-h-[220px]">
                  <div className="bg-white border border-slate-300 rounded-2xl p-3 shadow-sm max-w-[85%] self-start relative text-xs leading-normal font-medium">
                    <span className="font-black block text-rose-700 mb-1 text-[10px] uppercase">{currentScenario.sender}</span>
                    {currentScenario.initialText}
                    {currentScenario.linkUrl && (
                      <span 
                        onClick={() => handleLinkClick(currentScenario.linkUrl!)}
                        className="text-blue-700 underline font-black mt-1.5 block cursor-pointer flex items-center gap-1 hover:text-blue-800"
                      >
                        {currentScenario.linkUrl} <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SMS APP */}
            {currentScenario.appName === 'sms' && (
              <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
                {/* SMS Header */}
                <div className="bg-slate-950 p-3 pt-4 border-b border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                    💬
                  </div>
                  <div>
                    <div className="font-black text-xs text-white">{currentScenario.sender}</div>
                    <div className="text-[9px] text-slate-300 uppercase tracking-widest font-bold">Thread Inbox</div>
                  </div>
                </div>

                {/* SMS Thread */}
                <div className="flex-1 p-3 flex flex-col justify-end gap-3 min-h-[220px]">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-inner max-w-[90%] self-start text-xs leading-normal font-medium">
                    <div className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider">SMS ALERT</div>
                    {currentScenario.initialText}
                    {currentScenario.linkUrl && (
                      <span 
                        onClick={() => handleLinkClick(currentScenario.linkUrl!)}
                        className="text-cyan-400 underline font-black mt-1.5 block cursor-pointer flex items-center gap-1 hover:text-cyan-300"
                      >
                        {currentScenario.linkUrl} <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GMAIL APP */}
            {currentScenario.appName === 'gmail' && (
              <div className="flex-1 flex flex-col bg-white text-slate-900">
                {/* Gmail Header */}
                <div className="bg-[#EA4335] text-white p-3 pt-4 flex items-center gap-2.5 shadow-md">
                  <Mail className="w-5 h-5" />
                  <span className="font-black text-xs">Inbox Preview</span>
                </div>

                {/* Email details */}
                <div className="flex-1 p-3 flex flex-col gap-3 min-h-[220px]">
                  <div className="border-b border-slate-200 pb-2">
                    <div className="text-xs font-black text-slate-700">From:</div>
                    <div className="text-xs text-slate-900 font-mono font-bold break-all">{currentScenario.sender}</div>
                    <div className="text-xs font-black text-slate-700 mt-1">Subject:</div>
                    <div className="text-xs text-slate-950 font-black">Urgent Account Alert!</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 text-xs leading-normal font-medium text-slate-900">
                    {currentScenario.initialText}
                    {currentScenario.linkUrl && (
                      <button 
                        onClick={() => handleLinkClick(currentScenario.linkUrl!)}
                        className="mt-3 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Reset Password Now <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PHONE CALL SIMULATOR */}
            {currentScenario.appName === 'call' && (
              <div className="flex-1 flex flex-col bg-gradient-to-b from-[#111827] to-[#030712] text-white justify-between p-6">
                
                {callState === 'ringing' && (
                  <div className="flex-1 flex flex-col justify-between items-center py-6 text-center">
                    <div className="mt-8">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-4 border-2 border-violet-400 shadow-lg">
                        {currentScenario.avatarText}
                      </div>
                      <h3 className="font-black text-xl text-white">{currentScenario.sender}</h3>
                      <p className="text-xs text-cyan-300 uppercase tracking-widest font-black mt-1.5 animate-pulse">
                        Incoming Call...
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setCallState('connected')}
                        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce cursor-pointer"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => makeDecision(currentScenario.options.find(o => o.text.toLowerCase().includes('hang') || o.text.toLowerCase().includes('reject')) || currentScenario.options[0])}
                        className="w-14 h-14 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer"
                      >
                        <PhoneOff className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}

                {callState === 'connected' && (
                  <div className="flex-1 flex flex-col justify-between py-2 text-center">
                    <div>
                      <div className="text-[9px] text-slate-300 font-black uppercase tracking-widest mb-1">Active Connection</div>
                      <h3 className="font-black text-base text-white">{currentScenario.sender}</h3>
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">00:09</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-2xl text-xs text-slate-100 italic text-left leading-normal font-medium my-4">
                      "{currentScenario.initialText}"
                    </div>

                    <div className="text-[10px] text-rose-400 uppercase font-black tracking-widest mb-2">
                      🚨 Scammer is demanding code!
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* UPI APP */}
            {currentScenario.appName === 'upi' && (
              <div className="flex-1 flex flex-col bg-slate-900 text-white justify-between">
                {/* UPI Header */}
                <div className="bg-[#1A73E8] p-3 pt-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-white">
                  <span>Pay Shield UPI</span>
                  <span className="text-[9px] text-emerald-300 font-bold animate-pulse">🔒 SECURE GATEWAY</span>
                </div>

                {/* QR codes screen or collect request */}
                <div className="flex-1 p-3 flex flex-col items-center justify-center text-center gap-4">
                  {currentScenario.qrCodes ? (
                    <div className="w-full flex flex-col gap-3">
                      <div className="text-xs font-black text-cyan-300 uppercase tracking-wide">
                        Choose the SAFE QR Code to scan:
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {currentScenario.qrCodes.map((qr) => (
                          <div 
                            key={qr.id}
                            onClick={() => selectQRCard(qr)}
                            className={`
                              bg-slate-950 border-2 p-2 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer transition-all hover:bg-slate-900
                              ${selectedQR === qr.id ? 'border-cyan-400' : 'border-slate-800'}
                            `}
                          >
                            <QrCode className="w-10 h-10 text-cyan-400" />
                            <span className="text-[9px] font-black uppercase text-slate-200">{qr.imageLabel}</span>
                            <span className="text-[8px] text-slate-400 leading-tight font-medium block">{qr.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-4">
                      <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <AlertTriangle className="w-8 h-8 text-rose-400" />
                        <div>
                          <div className="text-[10px] uppercase font-black text-slate-300">Incoming Debit Request</div>
                          <div className="text-xl font-black text-rose-400 mt-0.5">₹4,999.00</div>
                        </div>
                      </div>

                      <div className="text-left w-full text-xs">
                        <div className="font-black text-slate-200">Description:</div>
                        <p className="text-slate-300 mt-1 leading-normal bg-slate-950 p-2.5 border border-slate-800 rounded-xl font-medium">
                          {currentScenario.initialText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BROWSER APP */}
            {currentScenario.appName === 'browser' && (
              <div className="flex-1 flex flex-col bg-slate-900 text-white">
                {/* Browser Address Bar */}
                <div className="bg-[#202124] p-2 pt-4 border-b border-slate-700 flex items-center gap-2">
                  <div className="flex-1 bg-[#2F3033] rounded-lg px-3 py-1 flex items-center justify-between text-[10px] font-mono text-slate-200 font-bold">
                    <span className="truncate">{currentScenario.linkUrl || 'http://unverified-site.net/secure'}</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                {/* Page view */}
                <div className="flex-1 p-4 flex flex-col gap-3 justify-center items-center text-center">
                  <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-white">Warning: Page Blocked?</h3>
                    <p className="text-[10px] text-slate-300 leading-normal mt-1 font-medium">
                      {currentScenario.initialText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Bottom Option Choice Tray */}
            <div className="bg-slate-900 border-t border-slate-800 p-3.5 w-full flex flex-col gap-2">
              {!answered ? (
                <>
                  {currentScenario.appName === 'call' && callState === 'ringing' ? (
                    <div className="text-[10px] text-cyan-300 text-center uppercase tracking-wider font-black animate-pulse">
                      📞 Click Accept Call button above
                    </div>
                  ) : currentScenario.qrCodes ? (
                    <div className="text-[10px] text-cyan-300 text-center uppercase tracking-wider font-black animate-pulse">
                      📲 Select a QR code above to check safety
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="text-[10px] uppercase font-black text-cyan-300 tracking-wider">Choose response:</div>
                      {currentScenario.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => makeDecision(opt)}
                          className="w-full py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-xl text-left text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-between shadow-sm"
                        >
                          <span className="leading-snug">{opt.text}</span>
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-black px-2 py-1 rounded uppercase tracking-wider">Tap</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className={`p-2.5 rounded-xl text-xs font-black border ${
                    isCorrectChoice 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                      : 'bg-rose-500/20 border-rose-400 text-rose-300'
                  }`}>
                    {isCorrectChoice ? '🎉 CORRECT DECISION!' : '🚨 EXTREME RISK TRIGGERED!'}
                  </div>

                  <p className="text-[11px] text-slate-100 leading-relaxed font-bold bg-slate-950 p-3 border border-slate-700 rounded-xl">
                    {feedbackText}
                  </p>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    {currentIdx < scenarios.length - 1 ? 'Next Scenario ➔' : 'Complete training ➔'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

