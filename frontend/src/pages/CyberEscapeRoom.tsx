import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { RakshaAiDrone, type RakshaAiDroneHandle } from '../components/RakshaAiDrone';
import { 
  ShieldAlert, Award, CheckCircle, XCircle, ArrowRight, Lock, 
  ShieldCheck, Flame, Coins, Zap, RotateCcw, AlertTriangle, 
  Key, HelpCircle, Mail, Globe, PhoneCall, QrCode, Search, 
  ExternalLink, Eye, PhoneOff, Shield, Check, Info,
  MessageSquareWarning, Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PuzzleOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Puzzle {
  title: string;
  scenario: string;
  clue: string;
  hint: string;
  type: 'password-interactive' | 'phishing-interactive' | 'domain-interactive' | 'call-interactive' | 'qr-interactive';
  options?: PuzzleOption[];
  correctExplanation: string;
}

export const CyberEscapeRoom: React.FC = () => {
  const { user, completeMission } = useGame();
  const navigate = useNavigate();
  
  // Game state
  const [stage, setStage] = useState(0); // 0 = Intro, 1-5 = Puzzles, 6 = Finish, 7 = Lockout / Game Over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const maxLives = 3;
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string; explanation: string } | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  // Stage 1: Interactive password terminal state
  const [customPassword, setCustomPassword] = useState('');

  // Stage 2: Link inspector lens
  const [showLinkInspector, setShowLinkInspector] = useState(false);

  // Stage 3: Inspected domain index
  const [inspectedDomainIdx, setInspectedDomainIdx] = useState<number | null>(null);

  // Stage 4: Threat audit toggler
  const [showCallAudit, setShowCallAudit] = useState(false);

  // Stage 5: QR payload decoder toggler
  const [showQrPayload, setShowQrPayload] = useState(false);

  // RAKSHA-AI Drone Companion Ref
  const rakshaRef = useRef<RakshaAiDroneHandle | null>(null);

  if (!user) return null;

  const puzzles: Puzzle[] = [
    {
      title: 'Stage 1: Interactive Terminal Override — Password Security',
      scenario: 'The hacker has locked the school terminal with an encrypted bypass lock. You must neutralize it by entering an UNBREAKABLE security passcode or selecting the strongest candidate password that resists brute-force dictionary attacks.',
      clue: 'An unbreakable password must be at least 8 characters long and contain uppercase, numbers, and special symbols!',
      hint: 'Attackers use automated brute-force tools. Simple words or dates take seconds to crack, while passwords combining letters, digits, and symbols take centuries.',
      type: 'password-interactive',
      options: [
        {
          text: '123456',
          isCorrect: false,
          explanation: '🚨 CRACKED IN 0.001 SECONDS! "123456" is the most commonly breached password in the world and appears in every hacker wordlist.'
        },
        {
          text: 'myschool2024',
          isCorrect: false,
          explanation: '🚨 CRACKED IN UNDER 2 MINUTES! Combining predictable words with the current year is easily guessed by automated dictionary attacks.'
        },
        {
          text: 'ShielD#78@Student!',
          isCorrect: true,
          explanation: '✓ PERFECT & UNBREAKABLE! Takes over 450,000+ years to crack. It mixes uppercase, lowercase, numbers, and special characters.'
        }
      ],
      correctExplanation: 'Strong passwords serve as your first line of defense. Always use at least 8+ characters, mixing uppercase, lowercase, numbers, and symbols.'
    },
    {
      title: 'Stage 2: Phishing Challenge — Interactive Email & Link Inspector',
      scenario: 'An urgent broadcast email has landed in your inbox claiming you won a free gaming laptop. Use the Link Security Inspector to examine where the link really points before deciding how to handle the message.',
      clue: 'Beware of artificial urgency and inspect the underlying URL target before clicking!',
      hint: 'Scammers use fake time countdowns (FOMO) to trigger panic so you click before inspecting the destination URL.',
      type: 'phishing-interactive',
      options: [
        {
          text: '🛡️ Delete message & report phishing trap',
          isCorrect: true,
          explanation: '✓ PERFECT PROTOCOL! Inspecting the link revealed that it leads to an unencrypted credential stealer. Deleting and reporting saves the network.'
        },
        {
          text: '⚡ Click link immediately to claim laptop',
          isCorrect: false,
          explanation: '🚨 PHISHING TRAP TRIGGERED! The hidden link leads to a credential harvester that steals your school password and student profile.'
        },
        {
          text: '📢 Forward email to all classmates',
          isCorrect: false,
          explanation: '🚨 MALWARE SPREAD! Forwarding unverified phishing links infects your classmates and compromises the school intranet.'
        }
      ],
      correctExplanation: 'Never act on urgent prize notifications or unexpected rewards. Always inspect the destination URL first.'
    },
    {
      title: 'Stage 3: URL & Domain Challenge — Interactive Domain Sandbox',
      scenario: 'The ransomware is attempting to redirect school computers to a cloned portal. Click each domain below to inspect its Protocol, Domain name, and Top-Level Domain (TLD) registry to identify the authentic official site.',
      clue: 'Look for official government-regulated domain extensions like .edu.in!',
      hint: 'Scammers register cheap lookalike domains ending in .net or .info with extra hyphens to mimic legitimate portals.',
      type: 'domain-interactive',
      options: [
        {
          text: 'https://www.myschool.edu.in',
          isCorrect: true,
          explanation: '✓ AUTHENTIC DOMAIN! The ".edu.in" top-level domain is strictly regulated and issued only to certified educational institutions in India with valid HTTPS encryption.'
        },
        {
          text: 'http://www.free-games-myschool-login.net',
          isCorrect: false,
          explanation: '🚨 CLONED SCAM SITE! This domain uses ".net" with hyphens, lacks SSL encryption, and is registered to an anonymous offshore hosting provider.'
        },
        {
          text: 'http://myschool-update-account-now.info',
          isCorrect: false,
          explanation: '🚨 PHISHING DOMAIN! The ".info" extension and urgent subdomain "update-account-now" are typical hacker indicators designed to steal logins.'
        }
      ],
      correctExplanation: 'Always inspect the domain name before typing credentials. Official school portals use certified domains like .edu.in.'
    },
    {
      title: 'Stage 4: Scam Message Challenge — Urgent SMS & Fraud Threat Detector',
      scenario: 'An urgent SMS alert flashes on your smartphone from an unknown sender: "🚨 URGENT NOTICE: Your Student Portal & linked Bank Account will be PERMANENTLY BLOCKED within 15 minutes due to unverified KYC. Reply with your 6-digit OTP code immediately to prevent permanent deactivation."',
      clue: 'OTP codes are secret digital keys. Who should you share them with?',
      hint: 'Legitimate banks, government officers, and schools will NEVER ask you for an OTP or PIN via SMS or phone call.',
      type: 'call-interactive',
      options: [
        {
          text: '🛑 Delete message & block sender! Real banks never ask for OTPs',
          isCorrect: true,
          explanation: '✓ EXCELLENT REFLEXES! One-Time Passwords (OTPs) are confidential two-factor authorization keys. Real banks and schools will never ask you to reply with OTPs.'
        },
        {
          text: '💬 Reply with the 6-digit OTP code to avoid account suspension',
          isCorrect: false,
          explanation: '🚨 ACCOUNT COMPROMISED! Sharing your OTP allows scammers to bypass two-factor authentication and drain linked accounts.'
        },
        {
          text: '📢 Forward message & OTP on public WhatsApp group to verify',
          isCorrect: false,
          explanation: '🚨 CREDENTIAL LEAK! Sharing authentication codes in public chat groups exposes your private credentials to anyone watching.'
        }
      ],
      correctExplanation: 'An OTP is your private digital signature. Never share it with anyone via SMS, email, or phone call, regardless of how urgent the message sounds.'
    },
    {
      title: 'Stage 5: Fake QR Challenge — Visual Scanner & Payload Decryptor',
      scenario: 'A QR code prize card arrives on Telegram promising ₹1,000 cash. Use the QR Payload Decryptor to inspect the underlying UPI transaction string before taking action.',
      clue: 'Do you ever need to enter a PIN to receive money?',
      hint: 'Remember the Golden Rule of UPI: Scanning QR codes and entering your PIN is ONLY used to SEND money, never to receive it!',
      type: 'qr-interactive',
      options: [
        {
          text: '🛡️ Reject QR & block sender! You never scan or PIN to receive cash',
          isCorrect: true,
          explanation: '✓ GOLDEN RULE APPLIED! Decrypting the payload proved it was an outbound debit request. To receive money via UPI, no PIN or QR scan is ever required.'
        },
        {
          text: '💸 Scan QR code and type UPI PIN to claim reward',
          isCorrect: false,
          explanation: '🚨 FRAUD EXECUTED! Entering your PIN authorized an instant payment of ₹1,000 to the scammer instead of receiving money.'
        },
        {
          text: '📲 Share QR code with friends to claim money together',
          isCorrect: false,
          explanation: '🚨 SCAM SPREAD! Forwarding fake reward codes tricks your friends into losing their hard-earned money.'
        }
      ],
      correctExplanation: 'Always remember: Scanning a QR code or typing your UPI PIN always sends money out of your account. Receiving money requires zero authorization.'
    }
  ];

  // Evaluate custom password strength for Stage 1 interactive terminal
  const getCustomPasswordStrength = () => {
    if (!customPassword) return { score: 0, label: 'Awaiting Input', color: 'bg-slate-200 text-slate-500' };
    const hasLength = customPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(customPassword);
    const hasNumber = /[0-9]/.test(customPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(customPassword);
    
    const metCount = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (metCount <= 1) return { score: 1, label: 'Weak (Vulnerable)', color: 'bg-red-500 text-white', hasLength, hasUpper, hasNumber, hasSpecial };
    if (metCount === 2) return { score: 2, label: 'Medium (Risky)', color: 'bg-amber-500 text-white', hasLength, hasUpper, hasNumber, hasSpecial };
    if (metCount === 3) return { score: 3, label: 'Strong (Good)', color: 'bg-blue-500 text-white', hasLength, hasUpper, hasNumber, hasSpecial };
    return { score: 4, label: 'Unbreakable (Secure)', color: 'bg-emerald-500 text-white', hasLength, hasUpper, hasNumber, hasSpecial };
  };

  const currentStrength = getCustomPasswordStrength();

  // RAKSHA-AI Speech Helper
  const speakRaksha = useCallback((text: string, force = false) => {
    if (rakshaRef.current) {
      rakshaRef.current.speak(text, force);
    }
  }, []);

  // RAKSHA-AI Stage transition voice intel
  useEffect(() => {
    if (stage === 1) {
      speakRaksha("Protocol initiated! Stage one breach detected. The school terminal is locked down. Enter an unbreakable password or analyze the candidate passcodes.");
    } else if (stage === 2) {
      speakRaksha("Stage two: Urgent phishing email detected. Scammers use fake time limits to cause panic. Inspect the real destination URL before deciding.");
    } else if (stage === 3) {
      speakRaksha("Stage three: Cloned redirect attack. Click each domain to inspect its protocol and TLD registry. Look for official government-regulated extensions like dot edu dot in.");
    } else if (stage === 4) {
      speakRaksha("Stage four: Urgent scam message intercepted on your smartphone. Inspect the fraud pattern signals and spoofed sender ID before responding.");
    } else if (stage === 5) {
      speakRaksha("Stage five: Suspicious prize QR code intercepted. Decrypt the raw UPI payload string to inspect the transaction parameters.");
    } else if (stage === 6) {
      speakRaksha("Outstanding work, Cadet! Ransomware neutralized and school network secured. The Hideout Stopper credential is now added to your passport.");
    } else if (stage === 7) {
      speakRaksha("Critical failure! System lockout initiated. Reboot the terminal and try again, Cadet.");
    }
  }, [stage, speakRaksha]);

  // Stage 1: Debounced speech on password typing
  useEffect(() => {
    if (stage !== 1 || !customPassword.trim()) return;
    const timer = setTimeout(() => {
      const strength = getCustomPasswordStrength();
      if (strength.score <= 1) {
        speakRaksha("Caution! Vulnerable passcode. Dictionary attack tools crack this in under two seconds.");
      } else if (strength.score === 2) {
        speakRaksha("Medium risk. Predictable words or dates are easily solved by automated rainbow tables.");
      } else if (strength.score === 3) {
        speakRaksha("Good entropy. Add a special symbol to achieve an unbreakable rating.");
      } else if (strength.score === 4) {
        speakRaksha("Passcode verified! Entropy is maximum. Ready to override the terminal firewall.");
      }
    }, 650);
    return () => clearTimeout(timer);
  }, [customPassword, stage, speakRaksha]);

  const playSound = (type: 'correct' | 'wrong' | 'complete' | 'alarm' | 'heartloss') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'wrong' || type === 'heartloss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.setValueAtTime(90, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'complete') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      } else if (type === 'alarm') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(440, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {}
  };

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 600);
  };

  const startEscapeRoom = () => {
    setScore(0);
    setLives(3);
    setStage(1);
    setSelectedChoiceIdx(null);
    setCustomPassword('');
    setShowLinkInspector(false);
    setInspectedDomainIdx(null);
    setShowCallAudit(false);
    setShowQrPayload(false);
    setFeedback(null);
    setShowHint(false);
  };

  const rebootEscapeRoom = () => {
    playSound('alarm');
    speakRaksha("Rebooting terminal. Resetting security firewall protocols.");
    startEscapeRoom();
  };

  // Handle choice submission across stages
  const handleChoiceSubmit = () => {
    const currentPuzzle = puzzles[stage - 1];
    if (!currentPuzzle.options || selectedChoiceIdx === null) return;

    const chosenOption = currentPuzzle.options[selectedChoiceIdx];

    if (chosenOption.isCorrect) {
      playSound('correct');
      const pointsEarned = 50;
      setScore((prev) => prev + pointsEarned);
      setFeedback({
        type: 'success',
        msg: 'ACCESS GRANTED! Security Protocol Verified.',
        explanation: chosenOption.explanation
      });

      setTimeout(() => {
        setFeedback(null);
        setSelectedChoiceIdx(null);
        setShowHint(false);
        setShowLinkInspector(false);
        setInspectedDomainIdx(null);
        setShowCallAudit(false);
        setShowQrPayload(false);

        if (stage < 5) {
          setStage((prev) => prev + 1);
        } else {
          // Mission completed with bonus points for surviving lives!
          playSound('complete');
          confetti({ particleCount: 160, spread: 85, origin: { y: 0.6 } });
          const finalBonus = lives * 50;
          setScore((prev) => prev + finalBonus);
          setStage(6);
          const starsEarned = lives === 3 ? 3 : lives === 2 ? 2 : 1;
          completeMission('escape', starsEarned, 300, 150);
        }
      }, 2500);

    } else {
      // Wrong choice: Deduct life!
      playSound('heartloss');
      triggerShake();
      speakRaksha("Shield compromised! Intrusion countermeasure triggered. Review post-breach telemetry.");
      const remainingLives = lives - 1;
      setLives(remainingLives);

      setFeedback({
        type: 'error',
        msg: 'DECRYPTION FAILURE! Security Shield Compromised.',
        explanation: chosenOption.explanation
      });

      if (remainingLives <= 0) {
        setTimeout(() => {
          playSound('alarm');
          setStage(7); // Game Over Lockout
        }, 2500);
      } else {
        setTimeout(() => {
          setFeedback(null);
        }, 2500);
      }
    }
  };

  // Handle custom password terminal submission (Stage 1)
  const handlePasswordTerminalSubmit = () => {
    if (!customPassword) return;

    if (currentStrength.score === 4) {
      playSound('correct');
      setScore((prev) => prev + 50);
      setFeedback({
        type: 'success',
        msg: 'UNBREAKABLE KEY ACCEPTED! Firewall Decrypted.',
        explanation: `✓ EXCELLENT WORK! "${customPassword}" meets all 4 high-security standards (8+ chars, uppercase, digits, and special characters). It resists dictionary attacks and brute-force cracking!`
      });

      setTimeout(() => {
        setFeedback(null);
        setCustomPassword('');
        setShowHint(false);
        setStage(2);
      }, 2500);

    } else {
      playSound('heartloss');
      triggerShake();
      speakRaksha("Vulnerable key! Hacker brute-forced this passcode. Check the 4 security standards.");
      const remainingLives = lives - 1;
      setLives(remainingLives);

      setFeedback({
        type: 'error',
        msg: 'VULNERABLE PASSCODE! The hacker brute-forced this key.',
        explanation: `🚨 WEAK KEY DETECTED! Passcode "${customPassword}" is too easy for botnets to crack. Ensure it is 8+ characters and includes uppercase letters, numbers, and special symbols (@, #, $, !).`
      });

      if (remainingLives <= 0) {
        setTimeout(() => {
          playSound('alarm');
          setStage(7);
        }, 2500);
      } else {
        setTimeout(() => {
          setFeedback(null);
        }, 2500);
      }
    }
  };

  return (
    <div className={`max-w-4xl mx-auto font-sans relative z-10 select-none ${screenShake ? 'animate-shake' : ''}`}>
      
      {/* RAKSHA-AI Voice Cyber Drone Companion HUD */}
      <div className="mb-6">
        <RakshaAiDrone 
          droneRef={rakshaRef} 
          initialGreeting="Cadet, RAKSHA-AI Tactical Drone is standing by. The school network is under active cyber ransomware. When you are ready, initiate the escape protocol."
        />
      </div>
      
      {/* 0. Intro Page */}
      {stage === 0 && (
        <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 sm:p-10 text-center flex flex-col items-center gap-6 shadow-sm">
          
          <span className="p-4 bg-red-50 border border-red-100 text-danger rounded-3xl animate-pulse">
            <ShieldAlert className="w-12 h-12" />
          </span>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 uppercase tracking-wider">
              Hacker's Hideout
            </h1>
            <h3 className="text-xs sm:text-sm font-black text-secondary uppercase tracking-widest mt-1">
              Immersive Cyber Escape Room Challenge
            </h3>
          </div>

          <div className="max-w-lg text-slate-600 text-xs sm:text-sm leading-relaxed font-bold bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-3">
            <p>
              Story: A dangerous hacker has deployed ransomware that is infecting the city's school network. Solve 5 interactive security challenges, inspect email links, sandbox suspect domains, intercept fake calls, and decode QR payloads before you run out of shields!
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px] font-black">
              <span className="bg-red-50 text-red-700 p-2 rounded-xl flex items-center justify-center gap-1">
                ❤️ 3 Security Shields
              </span>
              <span className="bg-indigo-50 text-indigo-700 p-2 rounded-xl flex items-center justify-center gap-1">
                ⚡ +50 Pts Per Puzzle
              </span>
            </div>
          </div>

          <button
            onClick={startEscapeRoom}
            type="button"
            className="px-8 py-4 bg-danger hover:bg-red-600 text-white font-black rounded-2xl btn-playful btn-glow-primary uppercase tracking-widest text-xs cursor-pointer shadow-lg"
          >
            Deploy Protocol: Start Escape
          </button>
        </div>
      )}

      {/* 1-5. Escape Room Active Puzzles */}
      {stage >= 1 && stage <= 5 && (
        <div className="flex flex-col gap-6 relative">
          
          {/* Status Header Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Lives / Shields System */}
            <div className={`bg-white border-2 rounded-2xl p-3 shadow-sm flex items-center justify-between transition-all ${
              lives === 1 ? 'border-red-400 bg-red-50/40' : 'border-[#E0F2FE]'
            }`}>
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Security Shields (Lives)</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {[1, 2, 3].map((heart) => (
                    <span 
                      key={heart} 
                      className={`text-base transition-transform ${heart <= lives ? 'animate-pulse scale-110' : 'opacity-30 grayscale'}`}
                    >
                      {heart <= lives ? '❤️' : '🖤'}
                    </span>
                  ))}
                  <span className={`text-xs font-black ml-1 ${lives === 1 ? 'text-danger font-extrabold animate-pulse' : 'text-slate-800'}`}>
                    ({lives} / {maxLives} left)
                  </span>
                </div>
              </div>
            </div>

            {/* Score System */}
            <div className="bg-white border-2 border-[#E0F2FE] rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Security Score</span>
                <span className="text-sm sm:text-lg font-black text-secondary flex items-center gap-1.5 mt-0.5">
                  <Coins className="w-4 h-4 text-[#06B6D4]" />
                  {score} pts
                </span>
              </div>
            </div>

            {/* Level Counter */}
            <div className="bg-white border-2 border-[#E0F2FE] rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider block">Room Level</span>
                <span className="text-sm sm:text-lg font-black text-primary flex items-center gap-1 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                  {stage} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
              style={{ width: `${((stage - 1) / 5) * 100}%` }}
            ></div>
          </div>

          {/* Primary Room Panel */}
          <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden shadow-sm">
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-5 h-5 text-danger animate-pulse shrink-0" />
                  {puzzles[stage - 1].title}
                </h2>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
                <span className="text-danger font-black block mb-1">🚨 SCENARIO INTERCEPTED:</span>
                {puzzles[stage - 1].scenario}
              </div>
            </div>

            {/* Hint Toggler */}
            <div className="relative z-10">
              <button
                onClick={() => {
                  setShowHint(!showHint);
                  playSound('alarm');
                }}
                type="button"
                className="text-[10px] sm:text-xs font-black text-warning border border-warning/30 bg-orange-50/50 hover:bg-orange-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Clue Decryption' : '💡 Request Advisor Hint'}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3.5 bg-orange-50 border border-orange-200 text-xs text-orange-800 rounded-2xl leading-relaxed font-bold animate-fade-in animate-bounce-gentle">
                  {puzzles[stage - 1].hint}
                </div>
              )}
            </div>

            {/* STAGE 1: Interactive Terminal Override Challenge */}
            {stage === 1 && (
              <div className="relative z-10 flex flex-col gap-5 bg-slate-900 border-2 border-indigo-900/60 p-5 rounded-2xl text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-widest">
                      Cyber Terminal Override
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${currentStrength.color}`}>
                    {currentStrength.label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Type an <span className="text-emerald-400 font-bold">Unbreakable Passcode</span> or pick from the candidate passwords below to bypass the hacker's lock:
                </p>

                {/* Live Password Input Box */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Type or test a secure passcode here..."
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 px-4 py-3 rounded-xl text-sm font-mono tracking-widest text-emerald-400 placeholder-slate-600 outline-none transition-all"
                  />

                  {/* Real-time Criteria Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] font-mono">
                    <span className={`p-1.5 rounded-lg border text-center font-bold ${
                      currentStrength.hasLength ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}>
                      {currentStrength.hasLength ? '✓' : '✗'} 8+ Characters
                    </span>
                    <span className={`p-1.5 rounded-lg border text-center font-bold ${
                      currentStrength.hasUpper ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}>
                      {currentStrength.hasUpper ? '✓' : '✗'} Uppercase (A-Z)
                    </span>
                    <span className={`p-1.5 rounded-lg border text-center font-bold ${
                      currentStrength.hasNumber ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}>
                      {currentStrength.hasNumber ? '✓' : '✗'} Number (0-9)
                    </span>
                    <span className={`p-1.5 rounded-lg border text-center font-bold ${
                      currentStrength.hasSpecial ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}>
                      {currentStrength.hasSpecial ? '✓' : '✗'} Symbol (@, #, !)
                    </span>
                  </div>
                </div>

                {/* Candidate Options Quick Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                    Or select an analyzed security candidate:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {puzzles[0].options?.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomPassword(opt.text)}
                        className={`p-3 rounded-xl border text-left font-mono text-xs transition-all cursor-pointer ${
                          customPassword === opt.text 
                            ? 'bg-indigo-900/60 border-cyan-400 text-white shadow-sm' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold">{opt.text}</div>
                        <div className="text-[9px] text-slate-400 mt-1">
                          {idx === 0 ? '⚠️ 6 digits code' : idx === 1 ? '⚠️ Word + Year' : '🛡️ Mixed symbols'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Educational Feedback Banner */}
                {feedback && (
                  <div className={`p-4 rounded-xl text-xs font-bold flex flex-col gap-1 border animate-fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' 
                      : 'bg-rose-500/20 border-rose-400 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                      <span>{feedback.msg}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed mt-1 text-slate-200">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Submit Override Key */}
                <button
                  onClick={handlePasswordTerminalSubmit}
                  disabled={feedback !== null || !customPassword}
                  type="button"
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <span>Authorize Terminal Override</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 2: Interactive Phishing Email & Link Inspector Challenge */}
            {stage === 2 && (
              <div className="relative z-10 flex flex-col gap-4">
                {/* Simulated Webmail Client Interface */}
                <div className="bg-slate-900 border-2 border-indigo-900/60 rounded-2xl p-4 sm:p-5 text-white flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-mono font-black uppercase text-slate-200">SecureMail Inbox Intercept</span>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full">
                      External Sender
                    </span>
                  </div>

                  <div className="text-xs flex flex-col gap-1 font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">From:</span> <span className="text-rose-400 font-bold">tech-rewards@free-rewards-laptop.net</span></div>
                    <div><span className="text-slate-500">Subject:</span> <span className="text-white font-bold">⚡ FINAL NOTICE: Claim your Free Gaming Laptop (2 mins left!)</span></div>
                  </div>

                  {/* Email Body */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    <p>
                      Congratulations Student! You have been selected for the IEEE SSIT Cyber Tech Grant. A brand-new gaming laptop is reserved for you. Click the secure link below within 2 minutes to confirm your shipping address before your claim expires.
                    </p>

                    {/* Interactive Inspect Link Button */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !showLinkInspector;
                          setShowLinkInspector(nextVal);
                          if (nextVal) {
                            speakRaksha("Notice the true destination IP! The anchor text says student reward, but the payload routes to an unencrypted credential stealer.");
                          }
                        }}
                        className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-900/50 transition-all cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{showLinkInspector ? 'Hide Link Inspector Lens' : '🔍 Inspect Real Destination URL'}</span>
                      </button>

                      <span className="text-[11px] text-blue-400 underline font-mono">
                        http://claim-free-laptop.net/confirm-address
                      </span>
                    </div>

                    {/* Revealed Inspector Lens */}
                    {showLinkInspector && (
                      <div className="mt-3 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs font-mono flex flex-col gap-1 animate-fade-in text-rose-200">
                        <div className="font-bold flex items-center gap-1.5 text-rose-300">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>DESTINATION URL REVEALED:</span>
                        </div>
                        <div className="text-[11px] text-white bg-slate-950 p-2 rounded border border-rose-900/50 break-all font-bold">
                          http://credential-stealer.free-rewards-laptop.net/login.php?steal=account
                        </div>
                        <p className="text-[10px] text-slate-300 mt-1 leading-normal">
                          ⚠️ Threat Detected: Unencrypted HTTP connection. Hidden PHP script prompts for school credentials and steals passwords.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Protocol Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    Select the safe protocol response:
                  </span>
                  
                  <div className="flex flex-col gap-2.5">
                    {puzzles[1].options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoiceIdx(idx)}
                        type="button"
                        className={`p-4 text-left text-xs sm:text-sm font-bold rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedChoiceIdx === idx 
                            ? 'bg-indigo-50 border-primary text-primary shadow-sm' 
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                            selectedChoiceIdx === idx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedChoiceIdx === idx ? 'Selected' : 'Option'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Educational Feedback Banner */}
                {feedback && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex flex-col gap-1.5 border animate-fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                      <span>{feedback.msg}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium bg-white/70 p-3 rounded-xl border border-slate-200/50">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  onClick={handleChoiceSubmit}
                  disabled={feedback !== null || selectedChoiceIdx === null}
                  type="button"
                  className="mt-2 w-full py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Authorize Security Decryption</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 3: Interactive Domain Sandbox & Registry Inspector Challenge */}
            {stage === 3 && (
              <div className="relative z-10 flex flex-col gap-4">
                {/* Domain Sandbox Header */}
                <div className="bg-slate-900 border-2 border-indigo-900/60 rounded-2xl p-4 sm:p-5 text-white flex flex-col gap-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-black uppercase text-slate-200">Domain Sandbox Analyzer</span>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                      DNS & SSL Inspector
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Click any domain candidate to analyze its SSL certificate, protocol safety, and Top-Level Domain (TLD) registry:
                  </p>

                  {/* Domain Candidates Interactive Selector */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {puzzles[2].options?.map((opt, idx) => {
                      const isInspected = inspectedDomainIdx === idx;
                      const isOfficial = opt.text.includes('.edu.in');
                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            setInspectedDomainIdx(idx);
                            setSelectedChoiceIdx(idx);
                            if (isOfficial) {
                              speakRaksha("Verified safe domain! Regulated dot edu dot in extension with valid HTTPS encryption.");
                            } else {
                              speakRaksha("Warning! Unverified domain with insecure HTTP protocol and unregulated registry detected.");
                            }
                          }}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                            selectedChoiceIdx === idx 
                              ? 'bg-slate-950 border-cyan-400 text-white shadow-md' 
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-xs font-bold">
                            <span className={isOfficial ? 'text-emerald-300' : 'text-slate-200'}>{opt.text}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                              selectedChoiceIdx === idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {selectedChoiceIdx === idx ? 'Selected' : 'Analyze'}
                            </span>
                          </div>

                          {/* Real-time Domain Breakdown Widget */}
                          {isInspected && (
                            <div className="mt-1 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono animate-fade-in">
                              <div className={`p-2 rounded-lg border ${isOfficial ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
                                <span className="block text-slate-400 text-[8px] uppercase">Protocol</span>
                                {isOfficial ? '🔒 HTTPS (Encrypted)' : '🔓 HTTP (Insecure)'}
                              </div>
                              <div className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300">
                                <span className="block text-slate-400 text-[8px] uppercase">Domain Name</span>
                                {isOfficial ? 'myschool' : opt.text.split('.')[1]}
                              </div>
                              <div className={`p-2 rounded-lg border ${isOfficial ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
                                <span className="block text-slate-400 text-[8px] uppercase">TLD Registry</span>
                                {isOfficial ? '🏛️ .edu.in (Gov Verified)' : opt.text.endsWith('.net') ? '⚠️ .net (Unregulated)' : '⚠️ .info (Unregulated)'}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instant Educational Feedback Banner */}
                {feedback && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex flex-col gap-1.5 border animate-fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                      <span>{feedback.msg}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium bg-white/70 p-3 rounded-xl border border-slate-200/50">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  onClick={handleChoiceSubmit}
                  disabled={feedback !== null || selectedChoiceIdx === null}
                  type="button"
                  className="mt-2 w-full py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Authorize Domain Decryption</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 4: Interactive Scam Message & Threat Detector Challenge */}
            {stage === 4 && (
              <div className="relative z-10 flex flex-col gap-4">
                {/* Simulated Smartphone Urgent SMS Screen */}
                <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-indigo-900/60 rounded-3xl p-5 text-white flex flex-col gap-4 shadow-xl max-w-xl mx-auto w-full">
                  
                  {/* Smartphone Top Notch & Status Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SECURE MESSAGES</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        Unverified SMS
                      </span>
                      <span>11:44 AM · 5G</span>
                    </div>
                  </div>

                  {/* SMS Header & Sender Identity Box */}
                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-rose-950 border border-rose-600/50 flex items-center justify-center text-rose-400 font-black text-xs">
                        ⚠️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white">BZ-BNKALRT</h4>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">Spoofed ID</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">+91 98765-XXXXX (Unknown Prepaid SIM)</p>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Incoming SMS Chat Bubble */}
                  <div className="flex flex-col gap-1.5">
                    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-100 leading-relaxed shadow-lg relative">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <MessageSquareWarning className="w-3.5 h-3.5" />
                        Urgent Security SMS Alert
                      </div>
                      <p className="font-sans text-slate-200 leading-relaxed">
                        🚨 <strong className="text-amber-300 font-bold">URGENT NOTICE:</strong> Your Student Portal & linked Bank Account will be <strong className="text-rose-400 font-bold">PERMANENTLY BLOCKED</strong> within 15 minutes due to unverified KYC. Reply with your 6-digit OTP code immediately to prevent permanent deactivation.
                      </p>
                      <div className="text-[9px] text-slate-500 font-mono text-right mt-2.5">
                        11:44 AM · Delivered via SMS
                      </div>
                    </div>
                  </div>

                  {/* Threat Analysis Toggle Button */}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !showCallAudit;
                        setShowCallAudit(nextVal);
                        if (nextVal) {
                          speakRaksha("Critical alert! Real banks and schools never demand two-factor OTPs via SMS or phone calls. Never disclose your authentication codes.");
                        }
                      }}
                      className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-900/50 transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{showCallAudit ? 'Hide Threat Signals' : '🚨 Inspect Message Fraud Signals'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">Spam Filter: Flagged High Risk</span>
                  </div>

                  {/* Threat Signals Checklist */}
                  {showCallAudit && (
                    <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-mono flex flex-col gap-2 animate-fade-in text-amber-200">
                      <div className="font-bold flex items-center gap-1 text-amber-300">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>SMS FRAUD PATTERN AUDIT:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                        <div className="p-2 bg-slate-950 rounded border border-amber-900/60 text-slate-200 font-bold">
                          🚨 Artificial Urgency ("15 mins before block")
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-amber-900/60 text-slate-200 font-bold">
                          🛑 Demanding Secret 2FA OTP via SMS reply
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-amber-900/60 text-slate-200 font-bold">
                          🎭 Spoofed Sender ID masquerading as Bank
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Call/Message Response Actions */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-600 uppercase font-black tracking-wider">
                    Select the safe protocol response:
                  </span>
                  
                  <div className="flex flex-col gap-2.5">
                    {puzzles[3].options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoiceIdx(idx)}
                        type="button"
                        className={`p-4 text-left text-xs sm:text-sm font-bold rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedChoiceIdx === idx 
                            ? 'bg-indigo-50 border-primary text-primary shadow-sm' 
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                            selectedChoiceIdx === idx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedChoiceIdx === idx ? 'Selected' : 'Option'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Educational Feedback Banner */}
                {feedback && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex flex-col gap-1.5 border animate-fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                      <span>{feedback.msg}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium bg-white/70 p-3 rounded-xl border border-slate-200/50">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  onClick={handleChoiceSubmit}
                  disabled={feedback !== null || selectedChoiceIdx === null}
                  type="button"
                  className="mt-2 w-full py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Authorize Call Protocol</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE 5: Interactive Fake QR Scanner & UPI Payload Decryptor Challenge */}
            {stage === 5 && (
              <div className="relative z-10 flex flex-col gap-4">
                {/* Visual QR Scanner Sandbox */}
                <div className="bg-slate-900 border-2 border-indigo-900/60 rounded-2xl p-5 text-white flex flex-col gap-4 shadow-xl">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-black uppercase text-cyan-300">QR Scanner & Payload Decryptor</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Camera Viewfinder
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {/* Simulated QR Code Graphic */}
                    <div className="w-32 h-32 bg-white p-2 rounded-2xl border-4 border-cyan-400 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
                      <QrCode className="w-24 h-24 text-slate-950" />
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-cyan-400/20 animate-pulse pointer-events-none"></div>
                    </div>

                    <div className="flex-1 flex flex-col gap-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-slate-300">
                        <span className="text-cyan-400 font-bold block mb-0.5">Caption on Telegram Card:</span>
                        "Scan this QR code with GPay/PhonePe and enter your secret UPI PIN to RECEIVE ₹1,000 cash prize!"
                      </div>

                      {/* Interactive Decode QR Payload Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !showQrPayload;
                          setShowQrPayload(nextVal);
                          if (nextVal) {
                            speakRaksha("Critical alert! The payload transaction mode is debit! Remember the golden rule: you never scan a QR or enter a PIN to receive money.");
                          }
                        }}
                        className="self-start text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-3.5 py-2 rounded-xl flex items-center gap-2 hover:bg-cyan-900/50 transition-all cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{showQrPayload ? 'Hide Decoded Payload' : '🔍 Decode Raw UPI Payload String'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Revealed UPI Payload String */}
                  {showQrPayload && (
                    <div className="p-4 bg-rose-950/60 border border-rose-500/50 rounded-xl text-xs font-mono flex flex-col gap-2 animate-fade-in text-rose-200">
                      <div className="font-bold flex items-center gap-1.5 text-rose-300">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>RAW UPI PAYLOAD DECODED:</span>
                      </div>
                      <div className="text-[11px] text-emerald-300 bg-slate-950 p-2.5 rounded border border-rose-900/50 break-all font-bold">
                        upi://pay?pa=cyber_scam_agent@okhdfc&pn=CashbackClaim&am=1000.00&mode=debit
                      </div>
                      <div className="text-[10px] text-white leading-normal bg-rose-900/40 p-2.5 rounded-lg border border-rose-800/60">
                        🚨 CRITICAL VULNERABILITY REVEALED: Notice the payload parameter <span className="text-cyan-300 font-bold">"mode=debit"</span> and <span className="text-cyan-300 font-bold">"am=1000.00"</span>! This code transfers ₹1,000 OUT of your account. You NEVER enter a PIN to receive money!
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Decision Protocol */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    Select the safe protocol response:
                  </span>
                  
                  <div className="flex flex-col gap-2.5">
                    {puzzles[4].options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoiceIdx(idx)}
                        type="button"
                        className={`p-4 text-left text-xs sm:text-sm font-bold rounded-2xl border-2 transition-all cursor-pointer ${
                          selectedChoiceIdx === idx 
                            ? 'bg-indigo-50 border-primary text-primary shadow-sm' 
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                            selectedChoiceIdx === idx ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedChoiceIdx === idx ? 'Selected' : 'Option'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Educational Feedback Banner */}
                {feedback && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex flex-col gap-1.5 border animate-fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-sm">
                      {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                      <span>{feedback.msg}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium bg-white/70 p-3 rounded-xl border border-slate-200/50">
                      {feedback.explanation}
                    </p>
                  </div>
                )}

                {/* Action Submit Button */}
                <button
                  onClick={handleChoiceSubmit}
                  disabled={feedback !== null || selectedChoiceIdx === null}
                  type="button"
                  className="mt-2 w-full py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Authorize Final QR Decryption</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 6. Finish Screen (Victory) */}
      {stage === 6 && (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-md animate-scale-in">
          
          <span className="p-4 bg-emerald-50 border border-emerald-100 text-success rounded-full animate-bounce">
            <ShieldCheck className="w-14 h-14" />
          </span>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 uppercase tracking-wider">
              Escape Complete!
            </h1>
            <h3 className="text-xs sm:text-sm font-black text-success uppercase tracking-widest mt-1">
              You stopped the Hacker & Secured the Network!
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg w-full mt-2 text-[10px] font-black uppercase tracking-wider">
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Final Score</span>
              <span className="text-sm text-cyan-600 flex items-center gap-1 font-black">
                <Coins className="w-4 h-4 text-cyan-500" />
                {score} pts
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Shields Kept</span>
              <span className="text-sm text-red-500 flex items-center gap-1 font-black">
                {'❤️'.repeat(lives)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">XP Awarded</span>
              <span className="text-sm text-primary flex items-center gap-1 font-black">
                <Zap className="w-4 h-4" />
                +300 XP
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Safety Coins</span>
              <span className="text-sm text-warning flex items-center gap-1 font-black">
                <Coins className="w-4 h-4" />
                +150 Coins
              </span>
            </div>
          </div>

          {/* Badges and Credentials unlocked */}
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-md w-full flex items-center gap-4 text-left">
            <span className="p-3 bg-emerald-100 text-success rounded-2xl text-2xl">
              🎖️
            </span>
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Credential Earned: Cyber Hero Stamp
              </h4>
              <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                Stamps Unlocked: <span className="text-indigo-700 font-black">HIDEOUT_STOPPER</span> ({lives === 3 ? '★★★ Flawless Run' : lives === 2 ? '★★ Skilled Defender' : '★ Resilient Guard'}). Added to your Safety Credentials Passport.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              onClick={startEscapeRoom}
              type="button"
              className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Challenge
            </button>

            <button
              onClick={() => navigate('/passport')}
              type="button"
              className="flex-1 px-6 py-3.5 bg-primary hover:bg-[#4338CA] text-white font-black rounded-2xl btn-playful uppercase tracking-widest text-xs cursor-pointer shadow-lg"
            >
              View Passport
            </button>
          </div>
        </div>
      )}

      {/* 7. System Lockout / Game Over Screen (0 Lives) */}
      {stage === 7 && (
        <div className="bg-white border-2 border-red-200 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-xl animate-scale-in">
          
          <span className="p-5 bg-red-100 border-2 border-red-300 text-danger rounded-full animate-pulse">
            <AlertTriangle className="w-16 h-16" />
          </span>

          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-red-600 uppercase tracking-wider">
              System Breach: Terminal Lockout!
            </h1>
            <h3 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mt-1">
              You ran out of Security Shields (0/3 Lives)
            </h3>
          </div>

          <div className="max-w-md bg-red-50/70 border border-red-200 p-5 rounded-2xl text-slate-700 text-xs sm:text-sm font-bold leading-relaxed text-left">
            <p className="text-danger font-black uppercase text-[11px] mb-1">
              🚨 Incident Report:
            </p>
            The hacker detected repeated security missteps and isolated the terminal. Don't worry, true cybersecurity defenders learn from failures! Review your clues and reboot the firewall to try again.
          </div>

          <button
            onClick={rebootEscapeRoom}
            type="button"
            className="px-8 py-4 bg-danger hover:bg-red-700 text-white font-black rounded-2xl btn-playful shadow-xl uppercase tracking-widest text-xs cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reboot Security Firewall (Try Again)
          </button>
        </div>
      )}

    </div>
  );
};
