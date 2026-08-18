import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  Compass, 
  HelpCircle, 
  Image as ImageIcon, 
  Award, 
  Lock, 
  Unlock, 
  Star, 
  ChevronRight, 
  Gift, 
  Shield, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CYBER_TIPS = [
  "Banks and online shops will never call or SMS to ask for your OTP. Keep it private!",
  "Always check the sender email address closely. A phishing email might say 'secure-netflix.com' instead of 'netflix.com'.",
  "If someone claims they are from the police and asks you to pay money to cancel a warrant, it is 100% a call scam. Hang up!",
  "Never scan a QR code to RECEIVE money. QR codes are only scanned to send payments.",
  "Create passwords using a combination of words, numbers, and symbols. Avoid using your birth date or pet's name!"
];

export const Dashboard: React.FC = () => {
  const { user, completeMission, addCoins, addXP } = useGame();
  const navigate = useNavigate();
  
  const [chestOpened, setChestOpened] = useState(() => {
    return localStorage.getItem('digi_raksha_chest_opened') === 'true';
  });

  const [activeTipIdx, setActiveTipIdx] = useState(0);

  // Lucky Spin Wheel states
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Password Security strength simulator states
  const [testPassword, setTestPassword] = useState('');
  const [passwordRewarded, setPasswordRewarded] = useState(false);

  if (!user) return null;

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const rewards = [
      { text: '+10 Coins!', coins: 10, xp: 0 },
      { text: '+20 XP!', coins: 0, xp: 20 },
      { text: '+5 Coins!', coins: 5, xp: 0 },
      { text: 'Jackpot +50 Coins!', coins: 50, xp: 0 },
      { text: '+15 XP!', coins: 0, xp: 15 },
      { text: 'Lucky +30 XP!', coins: 0, xp: 30 }
    ];

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const degreeForSegment = 360 / rewards.length;
    const targetDegrees = rotationDegrees + 1440 + (randomIndex * degreeForSegment);

    setRotationDegrees(targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = rewards[randomIndex];
      setSpinResult(chosen.text);
      
      if (chosen.coins > 0) addCoins(chosen.coins);
      if (chosen.xp > 0) addXP(chosen.xp);

      confetti({
        particleCount: 55,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#4F46E5', '#06B6D4', '#FACC15']
      });
    }, 3000);
  };

  const getPasswordStrength = () => {
    if (!testPassword) return { label: 'Empty', color: 'bg-slate-200', percentage: 0, criteria: [] };

    const criteria = [
      { met: testPassword.length >= 8, label: '8+ Characters' },
      { met: /[A-Z]/.test(testPassword), label: 'Uppercase Letter' },
      { met: /[0-9]/.test(testPassword), label: 'Number' },
      { met: /[^A-Za-z0-9]/.test(testPassword), label: 'Special Character' }
    ];

    const metCount = criteria.filter(c => c.met).length;
    let label = 'Weak';
    let color = 'bg-danger';
    let percentage = 25;

    if (metCount === 2) {
      label = 'Medium';
      color = 'bg-warning';
      percentage = 50;
    } else if (metCount === 3) {
      label = 'Strong';
      color = 'bg-secondary';
      percentage = 75;
    } else if (metCount === 4) {
      label = 'Unbreakable';
      color = 'bg-accent';
      percentage = 100;
    }

    return { label, color, percentage, criteria };
  };

  const passwordEval = getPasswordStrength();

  const handleClaimPasswordXP = () => {
    if (passwordRewarded || passwordEval.label !== 'Unbreakable') return;
    addXP(50);
    addCoins(30);
    setPasswordRewarded(true);
    confetti({ particleCount: 60, spread: 50 });
  };

  const missionCompletionRate = Math.round((user.completedMissions.length / 4) * 100);

  const missions = [
    {
      id: 'phishing',
      title: 'Mission 1: Phishing Trap',
      desc: 'Sift through messages to identify phishing links and scam accounts.',
      stars: user.stars['phishing'] || 0,
      completed: user.completedMissions.includes('phishing'),
      xp: '100 XP',
      coins: '50 Coins',
      border: 'border-[#E0F2FE]',
      route: '/mission/phishing',
    },
    {
      id: 'otp',
      title: 'Mission 2: OTP Danger Zone',
      desc: 'Answer urgent banking calls and defend your secret authentication codes.',
      stars: user.stars['otp'] || 0,
      completed: user.completedMissions.includes('otp'),
      xp: '150 XP',
      coins: '70 Coins',
      border: 'border-[#F3E8FF]',
      route: '/mission/otp',
    },
    {
      id: 'vishing',
      title: 'Mission 3: Vishing Detective',
      desc: 'Analyze voice threat transcripts to sound the fraud alarm instantly.',
      stars: user.stars['vishing'] || 0,
      completed: user.completedMissions.includes('vishing'),
      xp: '150 XP',
      coins: '70 Coins',
      border: 'border-orange-100',
      route: '/mission/vishing',
    },
    {
      id: 'upi',
      title: 'Mission 4: UPI & QR Safety',
      desc: 'Inspect mobile transfer requests to verify recipient security IDs.',
      stars: user.stars['upi'] || 0,
      completed: user.completedMissions.includes('upi'),
      xp: '200 XP',
      coins: '100 Coins',
      border: 'border-emerald-100',
      route: '/mission/upi',
    }
  ];

  const handleOpenChest = () => {
    if (chestOpened) return;
    
    // Play sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, time: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + dur);
      };
      
      const now = audioCtx.currentTime;
      playTone(261.63, now, 0.2); // C4
      playTone(329.63, now + 0.1, 0.2); // E4
      playTone(392.00, now + 0.2, 0.2); // G4
      playTone(523.25, now + 0.3, 0.5); // C5
    } catch(e) {}

    addCoins(30);
    setChestOpened(true);
    localStorage.setItem('digi_raksha_chest_opened', 'true');

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FACC15', '#F97316', '#4F46E5']
    });
  };

  const cycleTip = () => {
    setActiveTipIdx((prev) => (prev + 1) % CYBER_TIPS.length);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 rounded-[32px] p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl text-white">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
            Student Active Status
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-wide">
            Welcome Back, Student {user.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
            Your missions are online. Protect your virtual citizen profile, identify phishing traps, and secure the simulation systems to claim your cyber credentials.
          </p>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center shrink-0 w-28 h-28 bg-slate-900/90 rounded-full border-2 border-indigo-400/40 shadow-inner">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#1E293B"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - user.completedMissions.length / 4)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white leading-none">
              {missionCompletionRate}%
            </span>
            <span className="text-[8px] text-cyan-400 uppercase font-black tracking-wider mt-1">
              Complete
            </span>
          </div>
        </div>
      </section>

      {/* Grid of Main Missions */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black tracking-wide text-slate-800 uppercase flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Active Training Missions
          </h3>
          <span className="text-xs text-slate-400 font-black uppercase">
            {user.completedMissions.length} of 4 Complete
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => navigate(mission.route)}
              className={`
                bg-white border-2 ${mission.border} rounded-3xl p-5 flex flex-col justify-between gap-5 cursor-pointer 
                transition-all duration-200 hover:scale-102 hover:border-primary/20 shadow-sm relative group overflow-hidden
              `}
            >
              {/* Status tags */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {mission.completed ? (
                  <span className="bg-emerald-50 text-success text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                    Completed
                  </span>
                ) : (
                  <span className="bg-cyan-50 text-secondary text-[9px] font-black px-2 py-0.5 rounded-full border border-cyan-100 uppercase flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Play
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-black text-slate-800 text-sm group-hover:text-primary transition-colors uppercase tracking-wide">
                  {mission.title}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[90%] font-medium">
                  {mission.desc}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                {/* Rewards Indicators */}
                <div className="flex gap-3 text-[9px] font-black tracking-wide uppercase text-slate-400">
                  <span className="text-primary">{mission.xp}</span>
                  <span className="text-secondary">{mission.coins}</span>
                </div>

                {/* Stars Indicator */}
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= mission.stars
                          ? 'text-[#FACC15] fill-[#FACC15]'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini-Games Section */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Lucky Spin Wheel */}
        <section className="bg-white border-2 border-[#E0F2FE] rounded-[28px] p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div>
            <div className="text-[10px] font-black text-secondary uppercase tracking-widest">
              Mini Game Arena
            </div>
            <h4 className="font-black text-slate-800 text-sm mt-0.5 uppercase">
              Lucky Cyber Spin
            </h4>
            <p className="text-xs text-slate-500 font-medium">Spin the wheel once per daily session to win safety coins and experience badges.</p>
          </div>

          <div className="flex flex-col items-center justify-center py-3 relative">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-lg relative overflow-hidden flex items-center justify-center"
                 style={{ 
                   transform: `rotate(${rotationDegrees}deg)`, 
                   transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                   background: 'conic-gradient(#4F46E5 0% 16.6%, #06B6D4 16.6% 33.3%, #22C55E 33.3% 50%, #10B981 50% 66.6%, #FACC15 66.6% 83.3%, #EF4444 83.3% 100%)'
                 }}
            >
              {/* Wheel center pin */}
              <div className="w-5 h-5 bg-white rounded-full border-2 border-slate-800 absolute z-20"></div>
              <div className="absolute inset-0 border-t border-slate-800/10 rotate-0"></div>
              <div className="absolute inset-0 border-t border-slate-800/10 rotate-60"></div>
              <div className="absolute inset-0 border-t border-slate-800/10 rotate-120"></div>
            </div>

            {/* Spinner Needle */}
            <div className="absolute -top-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-danger z-30"></div>

            {spinResult && (
              <div className="mt-3 text-xs font-black text-[#FACC15] bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider animate-bounce">
                🎉 Reward: {spinResult}
              </div>
            )}
          </div>

          <button
            onClick={handleSpinWheel}
            disabled={isSpinning}
            className="w-full py-3 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            {isSpinning ? 'Spinning mainframes...' : '🎲 Spin the Wheel'}
          </button>
        </section>

        {/* Password Strength Simulator */}
        <section className="bg-white border-2 border-[#E0F2FE] rounded-[28px] p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div>
            <div className="text-[10px] font-black text-primary uppercase tracking-widest">
              Interactive Lab
            </div>
            <h4 className="font-black text-slate-800 text-sm mt-0.5 uppercase">
              Strong Password Builder
            </h4>
            <p className="text-xs text-slate-500 font-medium">Craft a password to bypass the brute-force hackers. Reach "Unbreakable" to claim XP!</p>
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Test a mock password..."
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
            />

            {/* Strength Progress Indicator */}
            {testPassword && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-slate-400">Strength:</span>
                  <span className={passwordEval.label === 'Unbreakable' ? 'text-accent animate-pulse font-black' : 'text-slate-600'}>
                    {passwordEval.label}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div className={`h-full rounded-full transition-all duration-300 ${passwordEval.color}`}
                       style={{ width: `${passwordEval.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Criteria checklist */}
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {passwordEval.criteria.map((c, idx) => (
                <div key={idx} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wide text-slate-500">
                  <span className={c.met ? 'text-accent' : 'text-slate-300'}>
                    {c.met ? '✓' : '✗'}
                  </span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {passwordEval.label === 'Unbreakable' && !passwordRewarded ? (
            <button
              onClick={handleClaimPasswordXP}
              className="w-full py-3 bg-accent hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer animate-pulse"
            >
              🎁 Claim +50 XP Reward!
            </button>
          ) : (
            <div className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest py-3 bg-slate-50 rounded-2xl border border-slate-100">
              {passwordRewarded ? '✓ Reward Claimed (+50 XP)' : 'Reach Unbreakable Status to unlock'}
            </div>
          )}
        </section>

      </div>

      {/* Interactive Cyber Tips + Rewards Panel */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Daily Safety Tip */}
        <section className="bg-white border-2 border-[#E0F2FE] rounded-[28px] p-5 flex flex-col justify-between gap-4 md:col-span-2 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-black text-primary uppercase tracking-widest">
                Daily Safety Briefing
              </div>
              <h4 className="font-black text-slate-800 text-sm mt-0.5 uppercase">
                Cyber Student Guard Tip
              </h4>
            </div>
            <button 
              onClick={cycleTip}
              type="button"
              className="text-[10px] font-black uppercase tracking-wider text-secondary hover:text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Next Briefing
            </button>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed italic bg-slate-50 p-4.5 rounded-2xl border border-slate-100 font-semibold">
            "{CYBER_TIPS[activeTipIdx]}"
          </p>

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Tip {activeTipIdx + 1} of {CYBER_TIPS.length}
          </div>
        </section>

        {/* Daily Mystery Box */}
        <section className="bg-white border-2 border-[#E0F2FE] rounded-[28px] p-5 flex flex-col items-center text-center justify-between gap-4 shadow-sm">
          <div>
            <div className="text-[10px] font-black text-warning uppercase tracking-widest">
              Daily Reward
            </div>
            <h4 className="font-black text-slate-800 text-sm mt-0.5 uppercase">
              Secure Safety Box
            </h4>
          </div>

          {chestOpened ? (
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 text-warning mb-1">
                <Gift className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-black text-warning uppercase tracking-wide">
                Box Opened!
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                New codes loaded tomorrow.
              </span>
            </div>
          ) : (
            <button 
              onClick={handleOpenChest}
              type="button"
              className="group flex flex-col items-center gap-2 hover:bg-slate-50 p-3.5 rounded-2xl w-full border-2 border-dashed border-slate-200 hover:border-warning/30 transition-all cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full group-hover:bg-yellow-400/35 transition-all"></div>
                <Gift className="w-10 h-10 text-[#FACC15] relative z-10 animate-bounce" />
              </div>
              <span className="text-xs font-black text-slate-500 group-hover:text-slate-800 uppercase tracking-wider">
                Tap to decrypt
              </span>
            </button>
          )}

          <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
            Unlock: +30 Safety Coins
          </div>
        </section>

      </div>

      {/* Challenges & Certifications */}
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-black tracking-wide text-slate-800 uppercase flex items-center gap-2">
          <Award className="w-5 h-5 text-secondary animate-pulse" />
          Safety Credentials & Events
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Cyber Quiz */}
          <div 
            onClick={() => navigate('/quiz')}
            className="bg-white border-2 border-[#E0F2FE] hover:border-primary/20 rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all shadow-sm hover:scale-102"
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-primary border border-indigo-100">
                <HelpCircle className="w-5 h-5" />
              </div>
              {user.quizScore !== null ? (
                <span className="bg-[#E2E8F0] text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Score: {user.quizScore}/10
                </span>
              ) : (
                <span className="bg-orange-50 text-warning text-[10px] font-black px-2 py-0.5 rounded-full">
                  Not Attempted
                </span>
              )}
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm uppercase">
                Cyber Safety Quiz
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed font-bold">
                Test your security knowledge with 10 interactive questions and earn XP.
              </p>
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
              Start Quiz <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Certificate */}
          <div 
            onClick={() => navigate('/certificate')}
            className={`
              bg-white border-2 border-[#E0F2FE] hover:border-primary/20 rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all shadow-sm hover:scale-102
              ${user.completedMissions.length < 4 ? 'opacity-70' : ''}
            `}
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-success border border-emerald-100">
                <Award className="w-5 h-5" />
              </div>
              {user.completedMissions.length < 4 ? (
                <span className="bg-slate-100 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              ) : (
                <span className="bg-emerald-50 text-success text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                  <Unlock className="w-3 h-3" /> Claimable
                </span>
              )}
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm uppercase">
                Safety Certificate
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed font-bold">
                Unlock your PDF credentials signed by IEEE SSIT upon finishing all 4 missions.
              </p>
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
              View Certificate <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
