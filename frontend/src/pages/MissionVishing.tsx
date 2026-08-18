import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, ArrowLeft, ChevronRight, Play, AlertOctagon, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VishingScenario {
  id: number;
  theme: string;
  caller: string;
  transcriptLines: { text: string; isScamTrigger: boolean }[];
  explanation: string;
}

const SCENARIOS: VishingScenario[] = [
  {
    id: 1,
    theme: 'KYC Block Renewal',
    caller: 'Telecom Admin (Automated)',
    transcriptLines: [
      { text: "Hello customer, your eSIM activation request has been processed successfully.", isScamTrigger: false },
      { text: "If you did not request this eSIM, your SIM card will be deactivated in 2 hours.", isScamTrigger: true },
      { text: "To cancel the eSIM transfer, please click the link sent to your SMS and upload your bank details.", isScamTrigger: true }
    ],
    explanation: "Scammers pretend your SIM card is expiring or being hijacked. They demand you click links to 'cancel eSIM deactivation' which steals your login codes."
  },
  {
    id: 2,
    theme: 'Police Cyber Cell Arrest Threat',
    caller: 'Officer Kumar (Delhi Police)',
    transcriptLines: [
      { text: "This is Cyber Crime Branch Delhi. We intercepted a package containing narcotics sent to Taiwan under your Aadhaar ID.", isScamTrigger: true },
      { text: "To avoid immediate arrest and clear your name, you must join our Skype video call for interrogation.", isScamTrigger: true },
      { text: "Keep this call strictly secret, do not tell anyone, and deposit ₹50,500 for a safety audit.", isScamTrigger: true }
    ],
    explanation: "Real police officers never conduct interrogations via Skype, ask for secrecy, or demand money to clear you of arrest. This is a classic police impersonation vishing scam!"
  },
  {
    id: 3,
    theme: 'Power Bill Disconnection',
    caller: 'Electricity Board Support',
    transcriptLines: [
      { text: "This is a courtesy check from state power division.", isScamTrigger: false },
      { text: "Your connection will be disconnected in 30 minutes due to an unpaid bill of ₹4,200.", isScamTrigger: true },
      { text: "Please call our lineman immediately at 88229-88112 to pay, or your power stays cut.", isScamTrigger: true }
    ],
    explanation: "Utility companies never send callers to disconnect power in 30 minutes or ask you to call random mobile numbers to pay. Always pay only on official portals."
  },
  {
    id: 4,
    theme: 'School Project Discussion',
    caller: 'Class Teacher (Mrs. Sharma)',
    transcriptLines: [
      { text: "Hello Aarav, I am Mrs. Sharma calling from your school.", isScamTrigger: false },
      { text: "I noticed you haven't submitted your Science project outline yet.", isScamTrigger: false },
      { text: "Please check your student email box and upload the document by tomorrow afternoon.", isScamTrigger: false }
    ],
    explanation: "This call is fully legitimate. Your teacher is asking you to follow regular school procedures via the official student portal. No personal passwords, OTPs, or bank details are requested."
  },
  {
    id: 5,
    theme: 'Tax Refund Verification',
    caller: 'Income Tax Office (Govt)',
    transcriptLines: [
      { text: "Hello, this is the Income Tax Department Department Office calling.", isScamTrigger: false },
      { text: "Our system shows you are eligible for an immediate tax refund of ₹12,500.", isScamTrigger: true },
      { text: "To claim this refund, please download the tax-refund.apk application from our portal.", isScamTrigger: true }
    ],
    explanation: "Government agencies never call out of the blue to offer immediate cash refunds, and they never instruct citizens to install unknown Android APK files. This is a malware delivery scam."
  },
  {
    id: 6,
    theme: 'Online Multi-player Game',
    caller: 'Friend (Kabir)',
    transcriptLines: [
      { text: "Hey bro! Are you online? I just created a private lobby for the custom match.", isScamTrigger: false },
      { text: "I will share the room code 'LOBBY-9082' with you via SMS.", isScamTrigger: false },
      { text: "Join in the next 5 minutes before the slots fill up!", isScamTrigger: false }
    ],
    explanation: "This is a safe and typical conversation with a known friend inviting you to play a game using standard game lobby pins."
  },
  {
    id: 7,
    theme: 'Pre-approved Loan Alert',
    caller: 'Bank Executive (ICICI)',
    transcriptLines: [
      { text: "Congratulations, your account qualifies for a pre-approved interest-free loan of ₹1,00,000.", isScamTrigger: true },
      { text: "To complete your application file, I just need you to verify your mother's maiden name and bank PIN.", isScamTrigger: true },
      { text: "Please tell me the number on the back of your debit card as well.", isScamTrigger: true }
    ],
    explanation: "No real bank representative will ever ask you to verify sensitive credentials such as credit card PINs or CVV numbers over the phone. Never share these with callers."
  },
  {
    id: 8,
    theme: 'Address Confirmation',
    caller: 'Delivery Partner (Blue Dart)',
    transcriptLines: [
      { text: "Hello, I am calling from Blue Dart courier service regarding your package.", isScamTrigger: false },
      { text: "I am currently at the gate of block C but I don't see your flat number on the box.", isScamTrigger: false },
      { text: "Could you tell me your house/flat number so I can walk up and deliver it?", isScamTrigger: false }
    ],
    explanation: "This is a standard courier call asking for simple direction or gate assistance. Since they do not ask for any OTPs, bank links, or digital card details, it is safe to reply."
  }
];

export const MissionVishing: React.FC = () => {
  const { completeMission } = useGame();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [clickedAlertCorrectly, setClickedAlertCorrectly] = useState<'correct' | 'escaped' | 'false_alarm' | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const scenario = SCENARIOS[currentIdx];
  const timerRef = useRef<any>(null);

  const playTone = (type: 'beep' | 'alarm' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(500, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(600, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {}
  };

  const startListening = () => {
    setIsPlaying(true);
    setLineIdx(0);
    setAnswered(false);
    setClickedAlertCorrectly(null);
  };

  useEffect(() => {
    if (isPlaying && !answered) {
      timerRef.current = setInterval(() => {
        setLineIdx((prev) => {
          if (prev < scenario.transcriptLines.length - 1) {
            playTone('beep');
            return prev + 1;
          } else {
            // End of script, didn't flag scam
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            setAnswered(true);

            // If scenario has no scam triggers, then not buzzing was CORRECT!
            const hasScam = scenario.transcriptLines.some(l => l.isScamTrigger);
            if (!hasScam) {
              setClickedAlertCorrectly('correct');
              setScore((prev) => prev + 1);
              playTone('alarm');
            } else {
              setClickedAlertCorrectly('escaped');
              playTone('error');
            }
            return prev;
          }
        });
      }, 3500);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, answered, scenario]);

  const handleFraudAlert = () => {
    if (!isPlaying || answered) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setAnswered(true);

    const isScam = scenario.transcriptLines[lineIdx].isScamTrigger;
    
    if (isScam) {
      setClickedAlertCorrectly('correct');
      setScore((prev) => prev + 1);
      playTone('alarm');
    } else {
      setClickedAlertCorrectly('false_alarm');
      playTone('error');
    }
  };

  const handleNext = () => {
    setAnswered(false);
    setClickedAlertCorrectly(null);
    setIsPlaying(false);
    setLineIdx(0);

    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      let stars = 1;
      if (score === SCENARIOS.length) stars = 3;
      else if (score >= SCENARIOS.length - 1) stars = 2;

      completeMission('vishing', stars, 150, 70);
      setShowSummary(true);

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  if (showSummary) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500/40 rounded-full text-emerald-700 shadow-md">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">MISSION 3 COMPLETE!</h2>
            <p className="text-sm text-indigo-700 font-black mt-1 uppercase tracking-widest">
              Fraud Fighter Badge Unlocked
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 w-full shadow-inner">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-sans">Buzzer Accuracy</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {score} / {SCENARIOS.length} Scenarios Detected
            </div>
            <p className="text-xs text-slate-700 mt-1 font-bold">
              You earned <span className="text-indigo-700 font-black">+150 XP</span> & <span className="text-cyan-700 font-black">+70 Coins</span>!
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-4 bg-primary hover:bg-indigo-700 rounded-2xl font-black text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Back to Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border-2 border-indigo-100 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">MISSION 3: VISHING DETECTIVE</h2>
          <p className="text-xs text-indigo-700 font-black uppercase tracking-wider mt-0.5">
            Case file {currentIdx + 1} of {SCENARIOS.length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Call Transcript Screen */}
        <div className="glass-panel-strong rounded-3xl p-6 border-2 border-slate-200 flex flex-col gap-5 relative overflow-hidden bg-white shadow-md">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-600"></div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-300 uppercase tracking-wider">
              {scenario.theme} Wiretap
            </span>
            <span className="text-xs text-slate-600 font-bold">
              Target: <span className="text-slate-900 font-black">{scenario.caller}</span>
            </span>
          </div>

          {!isPlaying && !answered ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-full text-rose-600 animate-pulse shadow-sm">
                <Play className="w-8 h-8 fill-rose-600" />
              </div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Start Call Recording Analysis
              </p>
              <button
                onClick={startListening}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all cursor-pointer"
              >
                Listen Wiretap
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 min-h-[160px] justify-center">
              {/* Previous Lines */}
              {scenario.transcriptLines.slice(0, lineIdx + 1).map((line, idx) => (
                <div 
                  key={idx} 
                  className={`
                    p-3.5 rounded-2xl text-xs leading-relaxed font-sans font-bold
                    ${idx === lineIdx 
                      ? 'bg-slate-900 border-2 border-indigo-500 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200 opacity-80'
                    }
                  `}
                >
                  <div className="text-[10px] uppercase tracking-wider font-black text-indigo-400 mb-1">
                    {scenario.caller}
                  </div>
                  "{line.text}"
                </div>
              ))}
            </div>
          )}

          {/* Big Fraud Buzzer */}
          {isPlaying && (
            <button
              onClick={handleFraudAlert}
              className="mt-2 w-full py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-red-400 cursor-pointer"
            >
              <AlertOctagon className="w-5 h-5 animate-bounce" />
              FLAG FRAUD NOW!
            </button>
          )}
        </div>

        {/* Audit Report Analysis */}
        <div className="glass-panel-strong rounded-3xl p-6 border-2 border-slate-200 flex flex-col gap-4 min-h-[360px] justify-between bg-white shadow-md">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-200 pb-3">
              <HelpCircle className="w-5 h-5 text-indigo-700" />
              Investigator Briefing
            </h3>

            {!answered ? (
              <div className="flex flex-col items-center justify-center text-center p-12 text-slate-600 gap-2">
                <AlertOctagon className="w-12 h-12 text-slate-400 animate-pulse" />
                <p className="text-sm font-black uppercase tracking-wider text-slate-800">Analyzing Live Call</p>
                <p className="text-xs font-bold text-slate-600">Press the Red Buzzer the exact second you hear or read a threat, banking link request, or payment instruction.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-3">
                {clickedAlertCorrectly === 'correct' && (
                  <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-xl font-black text-sm shadow-sm">
                    ✓ CORRECT DECISION: You analyzed the call accurately!
                  </div>
                )}
                {clickedAlertCorrectly === 'escaped' && (
                  <div className="p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-xl font-black text-sm shadow-sm">
                    ✗ FRAUD ESCAPED: You failed to flag the vishing attempt in time.
                  </div>
                )}
                {clickedAlertCorrectly === 'false_alarm' && (
                  <div className="p-3.5 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl font-black text-sm shadow-sm">
                    ✗ FALSE ALARM: You flagged a legitimate statement as fraud.
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-800 mb-1">Briefing Explanation:</h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold bg-slate-50 p-3.5 border border-slate-200 rounded-xl">
                    {scenario.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {answered && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-4 bg-primary hover:bg-indigo-700 rounded-2xl font-black text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
            >
              {currentIdx < SCENARIOS.length - 1 ? 'Next Case File' : 'Finish Mission'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

