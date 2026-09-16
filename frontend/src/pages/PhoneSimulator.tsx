import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  Smartphone, 
  ArrowLeft, 
  MessageSquare, 
  Package, 
  PhoneCall, 
  PhoneOff, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  RotateCcw, 
  Zap, 
  Coins, 
  Eye, 
  Send, 
  Download, 
  Wifi, 
  Battery, 
  Sparkles, 
  Volume2, 
  VolumeX,
  CreditCard,
  Radio,
  Share2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RakshaAiDrone, type RakshaAiDroneHandle } from '../components/RakshaAiDrone';

type ActiveApp = 'home' | 'chitchat' | 'appforge' | 'screenshare' | 'quickpay' | 'scanner' | 'victory';

interface PermissionItem {
  id: string;
  name: string;
  danger: 'low' | 'medium' | 'critical';
  description: string;
  threatInsight: string;
  granted: boolean;
}

export const PhoneSimulator: React.FC = () => {
  const { user, completeMission } = useGame();
  const navigate = useNavigate();

  // Hardware / System State
  const [activeApp, setActiveApp] = useState<ActiveApp>('home');
  const [currentTime, setCurrentTime] = useState('10:42');
  const [phoneScore, setPhoneScore] = useState(0);
  const [hygieneHealth, setHygieneHealth] = useState(100);
  const [deviceAlert, setDeviceAlert] = useState<string | null>(null);

  // App notification badges
  const [chatBadge, setChatBadge] = useState(2);
  const [appForgeBadge, setAppForgeBadge] = useState(1);
  const [callAlertActive, setCallAlertActive] = useState(false);

  // Scenario 1: ChitChat State
  const [chatStep, setChatStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'scammer' | 'cadet'; text: string; time: string; attachment?: string }>>([
    { sender: 'scammer', text: 'Hey cadet! 🎓 Official School Board Circular: You are eligible for the ₹10,000 National Digital Merit Scholarship!', time: '10:40 AM' },
    { sender: 'scammer', text: 'Download and install our direct registration APK below to claim your funds before today\'s 5 PM deadline:', time: '10:41 AM', attachment: 'National_Merit_Scholarship_2026.apk (4.2 MB)' }
  ]);
  const [chatFeedback, setChatFeedback] = useState<{ type: 'safe' | 'danger'; text: string } | null>(null);
  const [chatCompleted, setChatCompleted] = useState(false);

  // Scenario 2: Malicious APK Permission Sandbox State
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    { 
      id: 'sms', 
      name: 'android.permission.READ_SMS', 
      danger: 'critical', 
      description: 'Allows reading all incoming SMS messages', 
      threatInsight: 'CRITICAL HAZARD: Rogue apps intercept 2FA Bank OTPs & private login codes silently in background.',
      granted: true 
    },
    { 
      id: 'accessibility', 
      name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', 
      danger: 'critical', 
      description: 'Deep system access to read screen contents and simulate taps', 
      threatInsight: 'EXTREME RISK: Keylogger capability that logs banking passwords and clicks buttons without user consent.',
      granted: true 
    },
    { 
      id: 'mic', 
      name: 'android.permission.RECORD_AUDIO', 
      danger: 'medium', 
      description: 'Access to record audio through the microphone', 
      threatInsight: 'SURVEILLANCE HAZARD: Why does a Flashlight/Torch app need microphone eavesdropping permissions?',
      granted: true 
    },
    { 
      id: 'overlay', 
      name: 'android.permission.SYSTEM_ALERT_WINDOW', 
      danger: 'critical', 
      description: 'Display invisible popups over other apps (Draw over apps)', 
      threatInsight: 'PHISHING CLONE: Injects fake login overlays directly on top of your legitimate banking and UPI apps.',
      granted: true 
    },
    { 
      id: 'contacts', 
      name: 'android.permission.READ_CONTACTS', 
      danger: 'medium', 
      description: 'Read full contact list with phone numbers', 
      threatInsight: 'DATA HARVESTING: Steals your family and friends\' phone numbers for automated phishing campaigns.',
      granted: true 
    }
  ]);
  const [apkFeedback, setApkFeedback] = useState<{ type: 'safe' | 'danger'; text: string } | null>(null);
  const [apkQuarantined, setApkQuarantined] = useState(false);

  // Scenario 3: Screen Share Trap (AnyDesk/QuickSupport) State
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'breached' | 'defused'>('idle');
  const [screenShareCode, setScreenShareCode] = useState('');
  const [rogueCursorPos, setRogueCursorPos] = useState({ x: 50, y: 50 });
  const [remoteTimer, setRemoteTimer] = useState(15);
  const [shareFeedback, setShareFeedback] = useState<{ type: 'safe' | 'danger'; text: string } | null>(null);

  // Audio & Companion
  const rakshaRef = useRef<RakshaAiDroneHandle | null>(null);

  // Web Audio Synthesizer
  const playFx = (type: 'ring' | 'chime' | 'alarm' | 'click' | 'success' | 'disconnect') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'chime') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'ring') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(480, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'disconnect') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {}
  };

  const speak = (msg: string) => {
    if (rakshaRef.current) {
      rakshaRef.current.speak(msg);
    }
  };

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Rogue cursor animation when screen share breach occurs
  useEffect(() => {
    let interval: any;
    if (callState === 'breached') {
      interval = setInterval(() => {
        setRogueCursorPos({
          x: Math.floor(Math.random() * 70) + 15,
          y: Math.floor(Math.random() * 60) + 20
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Countdown timer for Screen Share Trap
  useEffect(() => {
    let t: any;
    if (callState === 'breached' && remoteTimer > 0) {
      t = setInterval(() => {
        setRemoteTimer(prev => {
          if (prev <= 1) {
            clearInterval(t);
            playFx('alarm');
            speak("Emergency alert! Remote attacker executed unauthorized UPI transfer! Always hang up and never share AnyDesk codes.");
            setHygieneHealth(prevH => Math.max(10, prevH - 40));
            setCallState('connected');
            setShareFeedback({
              type: 'danger',
              text: '🚨 FRAUD TRAP TRIGGERED: The remote scammer accessed QuickPay and simulated a fund transfer. Never share 9-digit remote codes with strangers!'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [callState, remoteTimer]);

  // Handle Scenario 1: Chat Response Choices
  const handleChatOption = (choice: 'report' | 'install' | 'ask_proof') => {
    playFx('click');
    if (choice === 'report') {
      playFx('success');
      setChatMessages(prev => [
        ...prev,
        { sender: 'cadet', text: '🛡️ Reported as spam & blocked! School scholarships are never disbursed via unsolicited WhatsApp APK files.', time: currentTime }
      ]);
      setChatFeedback({
        type: 'safe',
        text: '✓ EXCELLENT CYBER INSTINCT! Real educational boards and government institutions NEVER distribute official scholarships via WhatsApp APK downloads. You prevented a malware sideload!'
      });
      setPhoneScore(prev => prev + 50);
      setChatBadge(0);
      setChatCompleted(true);
      speak("Cadet, outstanding response! APK downloads from random chat threads bypass Google Play Protect and install background trojans.");
    } else if (choice === 'ask_proof') {
      setIsTyping(true);
      setChatMessages(prev => [
        ...prev,
        { sender: 'cadet', text: 'Which official school portal can I verify this circular on?', time: currentTime }
      ]);
      setTimeout(() => {
        setIsTyping(false);
        playFx('chime');
        setChatMessages(prev => [
          ...prev,
          { sender: 'scammer', text: 'No time for questions! Offer expires in 20 minutes! Just click and install the APK now or lose your scholarship.', time: currentTime }
        ]);
        setChatFeedback({
          type: 'danger',
          text: '⚠️ Notice the artificial urgency ("Offer expires in 20 minutes!"): Scammers rely on panic so you install the malicious file without thinking.'
        });
        speak("Notice the artificial urgency! When pressed for official verification, scammers escalate panic to force a rushed click.");
      }, 1500);
    } else {
      playFx('alarm');
      setChatMessages(prev => [
        ...prev,
        { sender: 'cadet', text: 'Downloading National_Merit_Scholarship.apk...', time: currentTime }
      ]);
      setChatFeedback({
        type: 'danger',
        text: '🚨 MALWARE INFECTION! You sideloaded an unverified APK from an unknown sender. This payload contains a banking keylogger!'
      });
      setHygieneHealth(prev => Math.max(20, prev - 30));
      speak("Warning! Sideloading untrusted APK files gives hackers root permission over your microphone, photos, and SMS messages.");
    }
  };

  // Handle Scenario 2: APK Permission Toggle
  const togglePermission = (id: string) => {
    playFx('click');
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p));
  };

  const handleQuarantineApk = () => {
    const grantedDangerous = permissions.filter(p => p.granted && p.danger === 'critical');
    if (grantedDangerous.length === 0) {
      playFx('success');
      setApkQuarantined(true);
      setApkFeedback({
        type: 'safe',
        text: '✓ SECURED & QUARANTINED! You revoked all critical access (SMS, Accessibility, Overlays). This malicious flashlight app has been neutralized and deleted.'
      });
      setPhoneScore(prev => prev + 60);
      setAppForgeBadge(0);
      speak("Target quarantined! A utility app has zero legitimate reason to access SMS messages or accessibility screen readers.");
    } else {
      playFx('alarm');
      setApkFeedback({
        type: 'danger',
        text: `⚠️ UNCHECKED THREATS REMAIN: You still have ${grantedDangerous.length} high-risk permissions granted (${grantedDangerous.map(p => p.name.split('.').pop()).join(', ')}). Revoke critical permissions to safeguard your device!`
      });
      speak("Caution cadet! Critical permissions are still enabled. Turn off SMS and Accessibility permissions before quarantining.");
    }
  };

  // Handle Scenario 3: Screen Share Trap
  const startIncomingCall = () => {
    playFx('ring');
    setCallState('ringing');
    setCallAlertActive(true);
    speak("Incoming call from an unknown VoIP caller claiming to be bank security. Observe their request carefully.");
  };

  const answerCall = () => {
    playFx('click');
    setCallState('connected');
    setCallAlertActive(false);
    speak("The caller claims your account is locked and is directing you to install a QuickSupport screen-sharing tool.");
  };

  const rejectCall = () => {
    playFx('disconnect');
    setCallState('defused');
    setPhoneScore(prev => prev + 70);
    setShareFeedback({
      type: 'safe',
      text: '✓ HUNG UP & DEFUSED! Legitimate bank executives will NEVER ask you to install AnyDesk, TeamViewer, or QuickSupport to "inspect" your device.'
    });
    speak("Perfect decision! Never allow remote desktop access to incoming callers. Banks do not inspect customer phones via remote access apps.");
  };

  const grantScreenShare = () => {
    if (!screenShareCode || screenShareCode.length < 6) {
      speak("Enter the simulated 9-digit code first.");
      return;
    }
    playFx('alarm');
    setCallState('breached');
    setRemoteTimer(15);
    speak("CRITICAL BREACH! Remote operator connected! A rogue remote operator is taking control of your screen. Hit the emergency disconnect immediately!");
  };

  const emergencyDisconnect = () => {
    playFx('disconnect');
    setCallState('defused');
    setPhoneScore(prev => prev + 70);
    setShareFeedback({
      type: 'safe',
      text: '✓ EMERGENCY KILL-SWITCH ACTIVATED! You terminated the remote session and blocked the intrusion before the attacker could compromise your wallet.'
    });
    speak("Emergency disconnect successful! Remote accessibility hijacked was revoked. Excellent forensic reflexes.");
  };

  // Check Final Completion
  const checkMissionFinish = () => {
    if (chatCompleted && apkQuarantined && callState === 'defused') {
      setActiveApp('victory');
      playFx('success');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      completeMission('phone', 3, 250, 100);
      speak("Mission accomplished Cadet! You neutralized the fake APK, revoked rogue permissions, and defused the screen-sharing scam.");
    }
  };

  useEffect(() => {
    if (chatCompleted && apkQuarantined && callState === 'defused') {
      checkMissionFinish();
    }
  }, [chatCompleted, apkQuarantined, callState]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 select-none font-sans">
      
      {/* Top Mission Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 p-4 sm:p-5 rounded-3xl border-2 border-indigo-100 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full">
                Interactive Lab 02
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                CYBERPHONE-OS v14.2
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 mt-0.5">
              <Smartphone className="w-6 h-6 text-primary animate-pulse" />
              Realistic Virtual Smartphone OS Sandbox
            </h1>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">Device Hygiene</span>
            <span className={`text-sm font-black ${hygieneHealth >= 80 ? 'text-emerald-600' : hygieneHealth >= 50 ? 'text-amber-500' : 'text-rose-600'}`}>
              {hygieneHealth}%
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex flex-col items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">Defense Points</span>
            <span className="text-sm font-black text-cyan-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              {phoneScore} XP
            </span>
          </div>
        </div>
      </div>

      {/* RAKSHA-AI Speech Drone Companion */}
      <RakshaAiDrone 
        droneRef={rakshaRef}
        initialGreeting="Cadet, CyberPhone OS is booted up. Smartphone users in India face daily threats from spoofed chat APKs, permission abuse, and screen-sharing traps. Examine the phone carefully."
      />

      {/* Main Sandbox Grid: Device on Left, Mission Briefing on Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER: THE PHYSICAL SMARTPHONE HARDWARE CHASSIS */}
        <div className="lg:col-span-6 flex justify-center">
          
          {/* Outer Phone Shell */}
          <div className="relative w-[340px] sm:w-[360px] h-[680px] bg-slate-950 rounded-[52px] p-3.5 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/60 flex flex-col overflow-hidden">
            
            {/* Phone Hardware Buttons (Volume & Power Glints) */}
            <div className="absolute -left-[9px] top-28 w-[3px] h-10 bg-slate-700 rounded-l-md"></div>
            <div className="absolute -left-[9px] top-42 w-[3px] h-10 bg-slate-700 rounded-l-md"></div>
            <div className="absolute -right-[9px] top-32 w-[3px] h-14 bg-slate-700 rounded-r-md"></div>

            {/* Inner Phone Screen Display */}
            <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 rounded-[42px] overflow-hidden flex flex-col border border-slate-800/80 text-white">
              
              {/* Top Dynamic Island / Status Bar */}
              <div className="h-11 px-6 flex items-center justify-between z-30 shrink-0 select-none">
                <span className="text-xs font-mono font-bold tracking-tight text-white">{currentTime}</span>
                
                {/* Dynamic Island Pill */}
                <div className="bg-black px-3 py-1 rounded-full flex items-center gap-2 border border-slate-800 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                  </div>
                  {callState === 'ringing' && (
                    <span className="text-[9px] text-amber-400 font-bold animate-pulse flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5" /> Call...
                    </span>
                  )}
                  {callState === 'breached' && (
                    <span className="text-[9px] text-rose-400 font-black animate-pulse flex items-center gap-1">
                      <ShieldAlert className="w-2.5 h-2.5" /> SHARING
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">5G</span>
                  <Battery className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* SCREEN CONTENT AREA: Dynamic Switcher */}
              <div className="flex-1 overflow-y-auto relative flex flex-col">
                
                {/* 1. HOME SCREEN */}
                {activeApp === 'home' && (
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Weather / Date Widget */}
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-sm flex items-center justify-between mb-6">
                        <div>
                          <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">Cyber Sandbox OS</div>
                          <div className="text-lg font-black text-white">Wednesday, 16 Sep</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Safe Mode
                          </span>
                        </div>
                      </div>

                      {/* App Grid */}
                      <div className="grid grid-cols-3 gap-y-6 gap-x-4 text-center">
                        
                        {/* ChitChat App */}
                        <div 
                          onClick={() => { setActiveApp('chitchat'); playFx('click'); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg relative transition-transform group-hover:scale-105">
                            <MessageSquare className="w-7 h-7" />
                            {chatBadge > 0 && (
                              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                                {chatBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">ChitChat</span>
                        </div>

                        {/* AppForge (APK Sandbox) */}
                        <div 
                          onClick={() => { setActiveApp('appforge'); playFx('click'); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-lg relative transition-transform group-hover:scale-105">
                            <Package className="w-7 h-7" />
                            {appForgeBadge > 0 && (
                              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                                !
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">AppForge</span>
                        </div>

                        {/* ScreenShare / Phone Call */}
                        <div 
                          onClick={() => { setActiveApp('screenshare'); playFx('click'); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg relative transition-transform group-hover:scale-105">
                            <PhoneCall className="w-7 h-7" />
                            {callState === 'ringing' && (
                              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 rounded-full animate-ping">
                                RING
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">Calls & Link</span>
                        </div>

                        {/* QuickPay (UPI Wallet) */}
                        <div 
                          onClick={() => { setActiveApp('quickpay'); playFx('click'); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                            <CreditCard className="w-7 h-7" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">QuickPay</span>
                        </div>

                        {/* DigiGuard Scanner */}
                        <div 
                          onClick={() => { setActiveApp('scanner'); playFx('click'); }}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-tr from-teal-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">DigiGuard</span>
                        </div>

                      </div>
                    </div>

                    {/* Bottom Phone Dock */}
                    <div className="bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/15 flex justify-around items-center">
                      <div onClick={() => setActiveApp('chitchat')} className="p-2 cursor-pointer hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div onClick={() => setActiveApp('screenshare')} className="p-2 cursor-pointer hover:scale-110 transition-transform">
                        <PhoneCall className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div onClick={() => setActiveApp('appforge')} className="p-2 cursor-pointer hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CHITCHAT APP (MESSAGING THREAD WITH TYPING INDICATORS) */}
                {activeApp === 'chitchat' && (
                  <div className="flex-1 bg-slate-900 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setActiveApp('home')} className="text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full flex items-center justify-center font-bold text-xs">
                          🎓
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">School Scholarship Desk</div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {isTyping ? <span className="text-emerald-400 font-bold animate-pulse">typing...</span> : '+91 9845X XXXXX (Unverified)'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                        Unknown
                      </span>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 text-xs">
                      <div className="text-[9px] text-center text-slate-500 font-mono my-1">
                        🔒 End-to-end simulated chat sandbox
                      </div>

                      {chatMessages.map((m, idx) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] rounded-2xl p-3 ${
                            m.sender === 'scammer' 
                              ? 'self-start bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700' 
                              : 'self-end bg-emerald-600 text-white rounded-tr-xs'
                          }`}
                        >
                          <p className="leading-relaxed">{m.text}</p>
                          {m.attachment && (
                            <div className="mt-2 p-2 bg-slate-900 rounded-xl border border-rose-500/40 flex items-center gap-2 text-rose-300">
                              <Download className="w-4 h-4 text-rose-400 shrink-0" />
                              <span className="text-[10px] font-mono break-all font-bold">{m.attachment}</span>
                            </div>
                          )}
                          <span className="text-[8px] text-slate-400 text-right mt-1 font-mono">{m.time} ✓✓</span>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="self-start bg-slate-800 p-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5 border border-slate-700">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                          <span className="text-[10px] text-slate-400 ml-1">typing...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Feedback Alert */}
                    {chatFeedback && (
                      <div className={`p-2.5 mx-2 rounded-xl text-[10px] font-bold border ${
                        chatFeedback.type === 'safe' 
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                      }`}>
                        {chatFeedback.text}
                      </div>
                    )}

                    {/* Cadet Interactive Action Options */}
                    <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Choose your tactical protocol:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        <button
                          onClick={() => handleChatOption('report')}
                          disabled={chatCompleted}
                          type="button"
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-[10px] font-black text-emerald-300 text-left flex items-center justify-between cursor-pointer disabled:opacity-50"
                        >
                          <span>🛡️ 1. Report as Fraud & Block Sender</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleChatOption('ask_proof')}
                          disabled={chatCompleted}
                          type="button"
                          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-bold text-slate-200 text-left flex items-center justify-between cursor-pointer disabled:opacity-50"
                        >
                          <span>🔍 2. Ask for official portal domain to verify</span>
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleChatOption('install')}
                          disabled={chatCompleted}
                          type="button"
                          className="p-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 rounded-xl text-[10px] font-bold text-rose-300 text-left flex items-center justify-between cursor-pointer disabled:opacity-50"
                        >
                          <span>⚡ 3. Click and install the APK to claim ₹10k</span>
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. APPFORGE (MALICIOUS APK PERMISSION SANDBOX) */}
                {activeApp === 'appforge' && (
                  <div className="flex-1 bg-slate-900 flex flex-col p-4 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActiveApp('home')} className="text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <Package className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">APK Permission Auditor</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Sandboxed
                      </span>
                    </div>

                    {/* App Package Header */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        🔦
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white leading-tight">Super Bright Torch LED Pro</h4>
                        <span className="text-[10px] text-slate-400 font-mono">com.tool.free.torch.apk (v2.1)</span>
                        <div className="text-[9px] text-rose-400 font-bold mt-0.5">⚠️ Demands 5 Dangerous Permissions</div>
                      </div>
                    </div>

                    {/* Permission Inspection List */}
                    <div className="flex flex-col gap-2 mb-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                        Inspect & Revoke Suspicious Access:
                      </span>

                      {permissions.map((perm) => (
                        <div 
                          key={perm.id} 
                          className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                            perm.granted 
                              ? 'bg-rose-950/40 border-rose-500/40 text-rose-100' 
                              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold break-all">{perm.name}</span>
                            <button
                              onClick={() => togglePermission(perm.id)}
                              type="button"
                              className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider cursor-pointer ${
                                perm.granted ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                              }`}
                            >
                              {perm.granted ? 'Revoke' : 'Allowed'}
                            </button>
                          </div>
                          <p className="text-[9px] text-slate-300 leading-tight">{perm.description}</p>
                          <p className="text-[8px] text-amber-300 font-mono font-bold bg-black/40 p-1.5 rounded mt-0.5">
                            {perm.threatInsight}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* APK Feedback */}
                    {apkFeedback && (
                      <div className={`p-2.5 rounded-xl text-[10px] font-bold border mb-3 ${
                        apkFeedback.type === 'safe' 
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                      }`}>
                        {apkFeedback.text}
                      </div>
                    )}

                    {/* Quarantine Button */}
                    <button
                      onClick={handleQuarantineApk}
                      type="button"
                      className="w-full py-3 bg-primary hover:bg-[#4338CA] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Quarantine & Delete APK</span>
                    </button>
                  </div>
                )}

                {/* 4. SCREEN-SHARING SCAM TRAP (ANYDESK / QUICKUPDATE SIMULATOR) */}
                {activeApp === 'screenshare' && (
                  <div className="flex-1 bg-slate-900 flex flex-col p-4 relative overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 z-10">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setActiveApp('home')} className="text-slate-400 hover:text-white">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <PhoneCall className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-white">Call & Remote Screen Sandbox</span>
                      </div>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                        {callState.toUpperCase()}
                      </span>
                    </div>

                    {/* Autonomous Rogue Cursor Overlay during breach */}
                    {callState === 'breached' && (
                      <div 
                        className="absolute z-50 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center"
                        style={{ left: `${rogueCursorPos.x}%`, top: `${rogueCursorPos.y}%` }}
                      >
                        <div className="w-5 h-5 bg-rose-500 rounded-full border-2 border-white shadow-xl animate-ping absolute"></div>
                        <div className="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-lg relative"></div>
                        <span className="text-[8px] bg-rose-600 text-white font-mono px-1 rounded shadow mt-1">
                          HACKER CURSOR
                        </span>
                      </div>
                    )}

                    {/* Call State: IDLE */}
                    {callState === 'idle' && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700">
                          <PhoneCall className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Screen Share Defense Mission</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Simulate an urgent call from a scammer posing as "Bank Security Officer Vikram".
                          </p>
                        </div>
                        <button
                          onClick={startIncomingCall}
                          type="button"
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-md"
                        >
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span>Trigger Incoming Scam Call</span>
                        </button>
                      </div>
                    )}

                    {/* Call State: RINGING */}
                    {callState === 'ringing' && (
                      <div className="flex-1 flex flex-col items-center justify-between p-4 py-8 animate-fade-in">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-20 h-20 bg-rose-500/20 border-2 border-rose-500/50 rounded-full flex items-center justify-center text-rose-300 animate-pulse text-3xl">
                            🏛️
                          </div>
                          <h3 className="text-base font-black text-white mt-2">HDFC Bank Security</h3>
                          <span className="text-xs text-rose-400 font-mono animate-pulse">Incoming VoIP Call...</span>
                          <p className="text-[10px] text-slate-400 text-center max-w-[220px] mt-1">
                            "Officer Vikram - Urgent Card Lockout Support"
                          </p>
                        </div>

                        <div className="flex items-center gap-8">
                          <button
                            onClick={rejectCall}
                            type="button"
                            className="w-14 h-14 bg-rose-600 hover:bg-rose-700 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                          >
                            <PhoneOff className="w-6 h-6" />
                          </button>
                          <button
                            onClick={answerCall}
                            type="button"
                            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-110 animate-bounce"
                          >
                            <PhoneCall className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Call State: CONNECTED */}
                    {callState === 'connected' && (
                      <div className="flex-1 flex flex-col justify-between p-2">
                        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 text-xs">
                          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                            <span>📞 Call in Progress (00:24)</span>
                            <span className="text-rose-400">High Risk Threat</span>
                          </div>
                          <p className="text-slate-300 italic leading-relaxed">
                            "Cadet, your account is being suspended! Open QuickSupport on your phone and read me the 9-digit remote access code right now to cancel the suspension!"
                          </p>
                        </div>

                        {/* Fake Code Input Box */}
                        <div className="bg-slate-950 p-3 rounded-2xl border border-rose-500/40 flex flex-col gap-2 my-2">
                          <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5" />
                            <span>QuickSupport 9-Digit Code Trap:</span>
                          </span>
                          <input 
                            type="text" 
                            placeholder="Enter 9-digit code (e.g. 592 108 443)" 
                            value={screenShareCode}
                            onChange={(e) => setScreenShareCode(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-rose-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={grantScreenShare}
                              type="button"
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
                            >
                              Share Code with Caller
                            </button>
                            <button
                              onClick={rejectCall}
                              type="button"
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl cursor-pointer"
                            >
                              Hang Up (Legit banks never ask)
                            </button>
                          </div>
                        </div>

                        {shareFeedback && (
                          <div className={`p-2.5 rounded-xl text-[10px] font-bold border ${
                            shareFeedback.type === 'safe' 
                              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
                              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                          }`}>
                            {shareFeedback.text}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Call State: BREACHED (REMOTE OPERATOR CONNECTED) */}
                    {callState === 'breached' && (
                      <div className="flex-1 flex flex-col justify-between p-2 relative z-20">
                        <div className="bg-rose-950/90 border-2 border-rose-500 p-4 rounded-2xl text-center flex flex-col gap-2 animate-pulse">
                          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                          <h4 className="text-sm font-black text-white uppercase">REMOTE OPERATOR CONNECTED!</h4>
                          <p className="text-[10px] text-rose-200 leading-tight">
                            The attacker has total screen control and is tapping towards your QuickPay wallet!
                          </p>
                          <div className="text-xl font-mono font-black text-amber-300">
                            TIME TO FUNDS DRAIN: {remoteTimer}s
                          </div>
                        </div>

                        <button
                          onClick={emergencyDisconnect}
                          type="button"
                          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer animate-bounce"
                        >
                          🚨 EMERGENCY DISCONNECT & REVOKE SESSION
                        </button>
                      </div>
                    )}

                    {/* Call State: DEFUSED */}
                    {callState === 'defused' && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-4">
                        <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center text-2xl">
                          ✓
                        </div>
                        <h4 className="text-sm font-black text-white uppercase">Screen-Share Threat Neutralized</h4>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-[240px]">
                          You prevented unauthorized remote desktop takeover. Your banking passwords and SMS OTPs remain secure!
                        </p>
                        <button
                          onClick={() => setActiveApp('home')}
                          type="button"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Return to Home Screen
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* 5. QUICKPAY SIMULATOR */}
                {activeApp === 'quickpay' && (
                  <div className="flex-1 bg-slate-900 flex flex-col p-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                      <button onClick={() => setActiveApp('home')} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">QuickPay Secure Wallet</span>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-4 rounded-2xl border border-indigo-500/30 text-white flex flex-col gap-2">
                      <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Available Balance</span>
                      <span className="text-2xl font-black">₹4,850.00</span>
                      <span className="text-[9px] text-emerald-400 font-mono">🔒 UPI PIN Protected (6-Digits)</span>
                    </div>

                    <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                      💡 QuickPay Security Rule: Never share your screen via AnyDesk while using financial apps. Screen recording apps record your secret UPI PIN keystrokes!
                    </div>
                  </div>
                )}

                {/* 6. DIGIGUARD SCANNER */}
                {activeApp === 'scanner' && (
                  <div className="flex-1 bg-slate-900 flex flex-col p-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                      <button onClick={() => setActiveApp('home')} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">DigiGuard Mobile Security</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-black text-white">Overall Device Security</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">{hygieneHealth}%</span>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 text-[10px]">
                      <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400">Unknown APK Sideloading</span>
                        <span className={chatCompleted ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {chatCompleted ? 'BLOCKED ✓' : 'NEEDS AUDIT'}
                        </span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400">High-Risk App Permissions</span>
                        <span className={apkQuarantined ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {apkQuarantined ? 'REVOKED ✓' : 'NEEDS AUDIT'}
                        </span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-slate-400">Screen Sharing Protections</span>
                        <span className={callState === 'defused' ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {callState === 'defused' ? 'SECURED ✓' : 'NEEDS AUDIT'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. VICTORY STAMP UNLOCK SCREEN */}
                {activeApp === 'victory' && (
                  <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-center p-5 animate-scale-in">
                    <span className="p-4 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-3xl text-3xl mb-2 animate-bounce">
                      📱
                    </span>
                    <h2 className="text-lg font-black text-white uppercase">Mobile Security Mastered!</h2>
                    <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
                      Phone Detective Credential Stamped
                    </p>

                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl w-full my-4 text-xs font-mono flex flex-col gap-1.5 text-slate-300">
                      <div className="flex justify-between">
                        <span>XP Awarded:</span>
                        <span className="text-primary font-black">+250 XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Safety Coins:</span>
                        <span className="text-amber-400 font-black">+100 Coins</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Device Hygiene:</span>
                        <span className="text-emerald-400 font-black">{hygieneHealth}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/passport')}
                      type="button"
                      className="w-full py-3 bg-primary hover:bg-[#4338CA] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                    >
                      View Passport Stamps
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Phone Gesture Bar / Home Button */}
              <div 
                onClick={() => { setActiveApp('home'); playFx('click'); }}
                className="h-7 shrink-0 flex items-center justify-center cursor-pointer group bg-slate-950/60"
              >
                <div className="w-28 h-1 bg-slate-600 rounded-full group-hover:bg-white group-hover:w-32 transition-all"></div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT: TACTICAL FORENSIC HUD & MISSION GUIDELINES */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          
          <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
              <div>
                <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest block">
                  Interactive Cadet Sandbox
                </span>
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  Mobile OS Threat Mission Guide
                </h3>
              </div>
              <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                3 Threat Scenarios
              </span>
            </div>

            {/* Scenario Checklist */}
            <div className="flex flex-col gap-3">
              
              {/* Task 1 */}
              <div 
                onClick={() => { setActiveApp('chitchat'); playFx('click'); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  chatCompleted 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : activeApp === 'chitchat' 
                      ? 'bg-indigo-50/80 border-primary shadow-xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className={`p-2 rounded-xl text-lg ${chatCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-white border border-slate-200'}`}>
                  💬
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wide">
                      Scenario 1: Sideloaded APK Chat Threat
                    </h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      chatCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {chatCompleted ? 'Completed ✓' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Open <span className="font-bold text-slate-800">ChitChat</span>. An unknown sender sent a fraudulent ₹10k scholarship APK. Identify the false urgency and report the scam message.
                  </p>
                </div>
              </div>

              {/* Task 2 */}
              <div 
                onClick={() => { setActiveApp('appforge'); playFx('click'); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  apkQuarantined 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : activeApp === 'appforge' 
                      ? 'bg-indigo-50/80 border-primary shadow-xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className={`p-2 rounded-xl text-lg ${apkQuarantined ? 'bg-emerald-200 text-emerald-800' : 'bg-white border border-slate-200'}`}>
                  📦
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wide">
                      Scenario 2: Excessive APK Permission Abuse
                    </h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      apkQuarantined ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {apkQuarantined ? 'Completed ✓' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Open <span className="font-bold text-slate-800">AppForge</span>. A simple "Flashlight Torch" demands access to SMS and Screen Accessibility. Revoke dangerous permissions and quarantine the app.
                  </p>
                </div>
              </div>

              {/* Task 3 */}
              <div 
                onClick={() => { setActiveApp('screenshare'); playFx('click'); }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  callState === 'defused' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : activeApp === 'screenshare' 
                      ? 'bg-indigo-50/80 border-primary shadow-xs' 
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className={`p-2 rounded-xl text-lg ${callState === 'defused' ? 'bg-emerald-200 text-emerald-800' : 'bg-white border border-slate-200'}`}>
                  📞
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs uppercase tracking-wide">
                      Scenario 3: AnyDesk Screen-Sharing Trap
                    </h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      callState === 'defused' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {callState === 'defused' ? 'Completed ✓' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    Open <span className="font-bold text-slate-800">Calls & Link</span>. A fake bank officer demands your QuickSupport code. See how screen-sharing exposes your wallet and hit the emergency disconnect!
                  </p>
                </div>
              </div>

            </div>

            {/* Educational Takeaways Card */}
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col gap-2 text-xs">
              <span className="font-black text-indigo-900 uppercase text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Cadet Smartphone Rules of Engagement
              </span>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium text-[11px] leading-relaxed">
                <li>Never sideload APK files from WhatsApp, Telegram, or SMS links.</li>
                <li>Audit app permissions: Torch, Calculator, or Wallpaper apps never need SMS or Microphone access.</li>
                <li>Never share 9-digit AnyDesk, TeamViewer, or QuickSupport remote codes with incoming callers.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
