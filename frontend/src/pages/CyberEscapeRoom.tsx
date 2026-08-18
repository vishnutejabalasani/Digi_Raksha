import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldAlert, Timer, Award, CheckCircle, XCircle, ArrowRight, Lock, ShieldCheck, Flame, Coins, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Puzzle {
  title: string;
  scenario: string;
  clue: string;
  hint: string;
  type: 'text' | 'choice' | 'sort';
  options?: string[];
  correctAnswer: string;
}

export const CyberEscapeRoom: React.FC = () => {
  const { user, completeMission } = useGame();
  const navigate = useNavigate();
  
  // Game state
  const [stage, setStage] = useState(0); // 0 = Intro, 1-5 = Puzzles, 6 = Finish
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  if (!user) return null;

  const puzzles: Puzzle[] = [
    {
      title: 'Stage 1: Safe Password Rule',
      scenario: 'The hacker locked the main terminal with a secret password security check. Which of the following is the SAFEST rule for passwords?',
      clue: 'Keep your password secret and strong!',
      hint: 'Never share passwords with anyone, and avoid easy codes like 123456.',
      type: 'choice',
      options: [
        'Never share your password with anyone, not even your friends',
        'Use "123456" because it is super easy to remember',
        'Write your password on a sticky note attached to your computer screen'
      ],
      correctAnswer: 'Never share your password with anyone, not even your friends'
    },
    {
      title: 'Stage 2: Phishing Trap Alert',
      scenario: 'You received an urgent email stating: "You won a FREE gaming laptop! Click here NOW or your prize will be cancelled in 2 minutes!" What should you do?',
      clue: 'Beware of fake urgency and unexpected free gifts!',
      hint: 'Scammers use fake time limits to trick you into clicking harmful links.',
      type: 'choice',
      options: [
        'Delete the fake message immediately and do NOT click the link',
        'Click the link as fast as possible before 2 minutes run out',
        'Forward the email to all your classmates so they can win too'
      ],
      correctAnswer: 'Delete the fake message immediately and do NOT click the link'
    },
    {
      title: 'Stage 3: Website Safety Check',
      scenario: 'A fake link is trying to send students to a cloned scam website. Which web address (URL) is safe and official?',
      clue: 'Look for official domain extensions like .edu.in or .ac.in!',
      hint: 'Fake websites often use long names with hyphens and strange endings like .info or .net.',
      type: 'choice',
      options: [
        'https://www.myschool.edu.in (Official Secure Site)',
        'http://www.free-games-myschool-login.net',
        'http://myschool-update-account-now.info'
      ],
      correctAnswer: 'https://www.myschool.edu.in (Official Secure Site)'
    },
    {
      title: 'Stage 4: OTP Security Rule',
      scenario: 'A stranger calls claiming to be a bank officer and says: "Read me the 6-digit OTP code sent to your phone immediately to verify your account!"',
      clue: 'OTP codes are secret keys. Who should you share them with?',
      hint: 'Real banks and official support staff will NEVER ask for your OTP over a call.',
      type: 'choice',
      options: [
        'Refuse and hang up! NEVER share your OTP code with any caller',
        'Tell them the OTP code so they can fix your account',
        'Post the OTP code online to ask if it is real'
      ],
      correctAnswer: 'Refuse and hang up! NEVER share your OTP code with any caller'
    },
    {
      title: 'Stage 5: QR Code & Money Rule',
      scenario: 'Someone sends a QR code image claiming: "Scan this QR code and type your PIN to RECEIVE ₹1,000 cash in your bank account!"',
      clue: 'Do you enter a PIN to receive money?',
      hint: 'Remember: Scanning QR codes and entering PINs is ONLY used to SEND money, never to receive it!',
      type: 'choice',
      options: [
        'Do NOT scan it. You NEVER enter a PIN or scan a QR to receive money',
        'Scan the QR code right away and type your secret PIN',
        'Forward the QR code to your friends to claim cash'
      ],
      correctAnswer: 'Do NOT scan it. You NEVER enter a PIN or scan a QR to receive money'
    }
  ];

  const playSound = (type: 'correct' | 'wrong' | 'complete' | 'alarm') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'complete') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
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

  const startEscapeRoom = () => {
    setScore(0);
    setStage(1);
    setInputValue('');
    setSelectedChoice(null);
    setFeedback(null);
    setShowHint(false);
  };

  const handleAnswerSubmit = () => {
    const currentPuzzle = puzzles[stage - 1];
    let answer = '';
    
    if (currentPuzzle.type === 'text') {
      answer = inputValue.trim().toUpperCase();
    } else {
      answer = selectedChoice || '';
    }

    if (answer === currentPuzzle.correctAnswer.toUpperCase() || answer === currentPuzzle.correctAnswer) {
      playSound('correct');
      setScore((prev) => prev + 50);
      setFeedback({ type: 'success', msg: 'ACCESS GRANTED! Safety protocol verified.' });
      
      setTimeout(() => {
        setFeedback(null);
        setInputValue('');
        setSelectedChoice(null);
        setShowHint(false);
        
        if (stage < 5) {
          setStage((prev) => prev + 1);
        } else {
          playSound('complete');
          confetti({ particleCount: 150, spread: 80 });
          setStage(6);
          completeMission('escape', 3, 300, 150);
        }
      }, 1500);

    } else {
      playSound('wrong');
      setFeedback({ type: 'error', msg: 'DECRYPTION FAILURE! Check your clues and try again.' });
      
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-sans relative z-10 select-none">
      
      {/* Intro Page */}
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

          <div className="max-w-lg text-slate-600 text-xs sm:text-sm leading-relaxed font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
            Story: A dangerous hacker has deployed a ransomware threat that is infecting the city's school network. Solve 5 security puzzles, bypass firewalls, and lock down the malware at your own pace.
            <div className="text-indigo-700 mt-2 uppercase text-[10px] font-black">🛡️ Mode: Self-paced learning. Take all the time you need to crack the puzzles!</div>
          </div>

          <button
            onClick={startEscapeRoom}
            type="button"
            className="px-8 py-4 bg-danger hover:bg-red-600 text-white font-black rounded-2xl btn-playful btn-glow-primary uppercase tracking-widest text-xs cursor-pointer"
          >
            Deploy Protocol: Start Escape
          </button>
        </div>
      )}

      {/* Escape Room Active Puzzle */}
      {stage >= 1 && stage <= 5 && (
        <div className="flex flex-col gap-6 relative">
          
          {/* Status Header Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-[#E0F2FE] rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Mode</span>
                <span className="text-xs sm:text-sm font-black text-emerald-700 font-sans tracking-wider flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Self-Paced
                </span>
              </div>
            </div>

            <div className="bg-white border-2 border-[#E0F2FE] rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Security Score</span>
                <span className="text-sm sm:text-lg font-black text-secondary flex items-center gap-1.5 mt-0.5">
                  <Coins className="w-4 h-4 text-[#06B6D4]" />
                  {score} pts
                </span>
              </div>
            </div>

            <div className="bg-white border-2 border-[#E0F2FE] rounded-2xl p-3 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Room Level</span>
                <span className="text-sm sm:text-lg font-black text-primary flex items-center gap-1 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                  {stage} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Level Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
              style={{ width: `${((stage - 1) / 5) * 100}%` }}
            ></div>
          </div>

          {/* Primary Room Panel */}
          <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden shadow-sm">
            
            <div className="flex flex-col gap-3 relative z-10">
              <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-5 h-5 text-danger animate-pulse" />
                {puzzles[stage - 1].title}
              </h2>
              
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
                <span className="text-danger font-black block mb-1">🚨 SCENARIO INTERCEPTED:</span>
                {puzzles[stage - 1].scenario}
              </div>
            </div>

            {/* Hint toggler */}
            <div className="relative z-10">
              <button
                onClick={() => {
                  setShowHint(!showHint);
                  playSound('alarm');
                }}
                type="button"
                className="text-[10px] sm:text-xs font-black text-warning border border-warning/30 bg-orange-50/50 hover:bg-orange-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                {showHint ? 'Hide Clue Decryption' : '💡 Request Advisor Hint'}
              </button>

              {showHint && (
                <div className="mt-2 p-3.5 bg-orange-50 border border-orange-200 text-xs text-orange-700 rounded-2xl leading-relaxed font-bold animate-fade-in animate-bounce-gentle">
                  {puzzles[stage - 1].hint}
                </div>
              )}
            </div>

            {/* Intercept Input fields */}
            <div className="relative z-10 flex flex-col gap-4">
              
              {puzzles[stage - 1].type === 'text' && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Input password:</span>
                  <input
                    type="text"
                    placeholder="TYPE YOUR ANSWERS IN CAPS..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="glass-input px-4 py-3.5 rounded-xl text-sm font-mono tracking-widest text-primary uppercase placeholder-slate-400"
                  />
                </div>
              )}

              {puzzles[stage - 1].type === 'choice' && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Select the safe protocol response:</span>
                  <div className="flex flex-col gap-2.5">
                    {puzzles[stage - 1].options?.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChoice(option)}
                        type="button"
                        className={`p-3.5 text-left text-xs sm:text-sm font-bold rounded-2xl border-2 transition-all cursor-pointer
                          ${selectedChoice === option 
                            ? 'bg-indigo-50 border-primary text-primary shadow-sm' 
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                          }
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback warnings */}
              {feedback && (
                <div 
                  className={`p-3 rounded-xl text-xs font-black flex items-center gap-2 border animate-pulse mt-2
                    ${feedback.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-100 text-success' 
                      : 'bg-red-50 border-red-100 text-danger'
                    }
                  `}
                >
                  {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{feedback.msg}</span>
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={handleAnswerSubmit}
                disabled={feedback !== null}
                type="button"
                className="mt-4 w-full py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize Security Decryption</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Escape Room Finish screen */}
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
              You stopped the Hacker!
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm w-full mt-4 text-[10px] font-black uppercase tracking-wider">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Stamps Unlocked</span>
              <span className="text-xs text-secondary flex items-center gap-1 font-black">
                <Award className="w-4 h-4" />
                HIDEOUT_STOPPER
              </span>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Pacing</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Self-Paced
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">XP Awarded</span>
              <span className="text-xs text-primary flex items-center gap-1 font-black">
                <Zap className="w-4 h-4" />
                +300 XP
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center">
              <span className="text-slate-400 text-[9px]">Safety Coins</span>
              <span className="text-xs text-warning flex items-center gap-1 font-black">
                <Coins className="w-4 h-4" />
                +150 Coins
              </span>
            </div>
          </div>

          {/* Badges unlocked */}
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-sm w-full flex items-center gap-4 text-left">
            <span className="p-2.5 bg-emerald-100 text-success rounded-xl text-lg">
              🎖
            </span>
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Cyber Hero Stamp</h4>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Awarded for neutralizing Hacker Ransomware threats.</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="px-8 py-3.5 bg-accent hover:bg-emerald-600 text-white font-black rounded-2xl btn-playful btn-glow-accent uppercase tracking-widest text-xs cursor-pointer"
          >
            Return to Mission Control
          </button>
        </div>
      )}

    </div>
  );
};
