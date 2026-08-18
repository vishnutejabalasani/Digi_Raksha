import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { HelpCircle, ChevronRight, ArrowLeft, ShieldCheck, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "When is it safe to share your bank account One-Time Password (OTP) or mobile banking PIN?",
    options: [
      "When a polite support agent asks on a phone call",
      "To claim a cashback reward you won online",
      "When renewing your eSIM or mobile phone connection",
      "Never share OTPs or PINs with anyone under any circumstances"
    ],
    correctAnswerIdx: 3,
    explanation: "Banks, companies, and police officers will NEVER ask for your OTP or PIN. It is your secret key to authorize transactions."
  },
  {
    id: 2,
    question: "You get a message: 'Scan this QR code to receive a ₹500 prize from your school.' What should you do?",
    options: [
      "Scan the QR code on GPay to claim the cash",
      "Do not scan. You never need to scan a QR code to receive money",
      "Enter your UPI PIN to check if the code is valid",
      "Share it with your classmates immediately"
    ],
    correctAnswerIdx: 1,
    explanation: "QR codes are 'Quick Response' codes meant to SEND money. You never need to scan a QR code to receive funds."
  },
  {
    id: 3,
    question: "What is 'Juice Jacking'?",
    options: [
      "A software to speed up game performance on mobile",
      "Scammers stealing phone data/installing malware through public USB charging ports",
      "A technique to bypass internet speed limits",
      "Sharing your school Wi-Fi password with friends"
    ],
    correctAnswerIdx: 1,
    explanation: "Public USB charging ports at airports or malls can be modified by hackers to install malware or download data from your phone. Use a power bank instead."
  },
  {
    id: 4,
    question: "A friend DMs you a link on Instagram saying 'Watch this video of you!', but the URL is 'insta-video-play.net'. What is this?",
    options: [
      "A normal video share link",
      "A phishing page designed to steal your Instagram password",
      "A virus that will break your phone screen",
      "A secure video server from Instagram"
    ],
    correctAnswerIdx: 1,
    explanation: "Hackers hack accounts to send fake links to their friends. If the login screen asks you to enter your username and password, it is a password trap."
  },
  {
    id: 5,
    question: "If a caller claims they are from the CBI / Police and threatens to arrest you unless you pay money on a call, what is this?",
    options: [
      "An official police procedure",
      "A vishing scam (police impersonation)",
      "A regular government tax collection call",
      "A prank call from a classmate"
    ],
    correctAnswerIdx: 2,
    explanation: "Real police and law enforcement officers will never arrest people on phone calls, demand secrecy, or ask for money to cancel warrants."
  },
  {
    id: 6,
    question: "Which of the following represents a secure, strong password?",
    options: [
      "admin123",
      "yourname2012",
      "ShielD#78@Student!",
      "password"
    ],
    correctAnswerIdx: 2,
    explanation: "A strong password combines uppercase letters, lowercase letters, numbers, and special symbols (like #, @, !), and is not guessable."
  },
  {
    id: 7,
    question: "What is the best way to verify if an email from 'support@google-security-notice.com' is real?",
    options: [
      "Check if the email domain ends with 'google.com' (e.g. google.com/security)",
      "Click the links inside to see if Google opens",
      "Reply back asking if they are real google employees",
      "Trust it because it contains the word 'Google' in it"
    ],
    correctAnswerIdx: 0,
    explanation: "Scammers buy domains containing brand names (like google-security-notice.com) to trick you. Always check the domain ending closely."
  },
  {
    id: 8,
    question: "If your family loses money due to an online banking scam, who should you report it to immediately?",
    options: [
      "Write a complaint post on Twitter (X)",
      "Call the National Cyber Crime Helpline on 1930 immediately",
      "Contact your mobile network service provider",
      "Wait 48 hours to see if the money returns"
    ],
    correctAnswerIdx: 1,
    explanation: "Calling 1930 within the first few hours allows the Cyber Cell to freeze the money in the scammer's bank account before they can withdraw it."
  },
  {
    id: 9,
    question: "What does the 'S' in 'HTTPS' stand for?",
    options: [
      "System",
      "Secure",
      "Speed",
      "Science"
    ],
    correctAnswerIdx: 1,
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) means data sent between your browser and the website is encrypted and secure from eavesdroppers."
  },
  {
    id: 10,
    question: "What should you do before downloading a gaming mod or cheat file from a YouTube video link?",
    options: [
      "Disable your antivirus to make it run faster",
      "Do not download it. Gaming cheats often contain hidden spyware or Trojans",
      "Share your login details with the developer to register",
      "Download it on your parents work laptop"
    ],
    correctAnswerIdx: 1,
    explanation: "Many game mod links are trojan horses that steal passwords, cookies, and game accounts from your PC or phone."
  }
];

export const Quiz: React.FC = () => {
  const { user, submitQuiz } = useGame();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const question = QUESTIONS[currentIdx];

  const playTone = (isCorrect: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {}
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;

    setSelectedIdx(idx);
    setAnswered(true);
    const correct = idx === question.correctAnswerIdx;
    playTone(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedIdx(null);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      submitQuiz(score);
      setShowSummary(true);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  if (showSummary) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500/40 rounded-full text-emerald-700 shadow-md">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase">QUIZ COMPLETED!</h2>
            <p className="text-sm text-indigo-700 font-extrabold mt-1 uppercase tracking-widest font-sans">
              Quiz Master Badge Unlocked
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 w-full shadow-inner">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Final Grade</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {score} / 10 Correct
            </div>
            <div className="text-xs text-slate-700 mt-2 font-bold">
              You earned <span className="text-indigo-700 font-black">+{score * 15} XP</span> & <span className="text-cyan-700 font-black">+{score * 10} Coins</span>!
            </div>
            {score === 10 && (
              <div className="text-xs text-amber-700 font-black mt-2 uppercase tracking-wide bg-amber-100 border border-amber-300 p-2 rounded-xl">
                🏆 PERFECT SCORE BADGE UNLOCKED!
              </div>
            )}
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
      <div className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border-2 border-indigo-100 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">CYBER SAFETY TRIVIA</h2>
            <p className="text-xs text-indigo-700 font-black uppercase tracking-wider mt-0.5">
              Question {currentIdx + 1} of {QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* Self-Paced Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
            Self-Paced
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="grid md:grid-cols-5 gap-6 items-start">
        {/* Question + Options */}
        <div className="md:col-span-3 glass-panel-strong rounded-3xl p-6 border-2 border-slate-200 flex flex-col gap-5 bg-white shadow-md">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <h3 className="font-black text-slate-900 text-base sm:text-lg leading-relaxed font-sans">
              {question.question}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correctAnswerIdx;
              const isSelected = idx === selectedIdx;

              let btnStyle = 'border-slate-200 hover:border-indigo-400 bg-slate-50 text-slate-800 hover:bg-indigo-50/50';
              if (answered) {
                if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black cursor-default';
                else if (isSelected) btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-black cursor-default';
                else btnStyle = 'border-slate-200 bg-slate-100 text-slate-400 cursor-default opacity-50';
              }

              return (
                <button
                  key={idx}
                  disabled={answered}
                  onClick={() => handleAnswer(idx)}
                  className={`
                    w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-3 cursor-pointer
                    ${btnStyle}
                  `}
                >
                  <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-black text-xs border border-slate-300 shrink-0 text-slate-700 shadow-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explain Card */}
        <div className="md:col-span-2 glass-panel-strong rounded-3xl p-6 border-2 border-slate-200 min-h-[300px] flex flex-col justify-between bg-white shadow-md">
          <div>
            <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-700" />
              Safety Briefing
            </h4>

            {!answered ? (
              <div className="flex flex-col items-center justify-center text-center p-10 text-slate-600 gap-2">
                <ShieldCheck className="w-12 h-12 text-indigo-500" />
                <p className="text-xs font-black uppercase tracking-wider text-slate-800">Self-Paced Learning</p>
                <p className="text-[11px] font-bold text-slate-600">Select the correct security practice. Take all the time you need!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedIdx === question.correctAnswerIdx ? (
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    ✓ CORRECT ANSWER
                  </span>
                ) : (
                  <span className="text-xs font-black text-rose-700 uppercase tracking-widest bg-rose-50 p-2 rounded-lg border border-rose-200">
                    ✗ INCORRECT ANSWER
                  </span>
                )}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold bg-slate-50 p-3.5 border border-slate-200 rounded-xl">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>

          {answered && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-4 bg-primary hover:bg-indigo-700 rounded-2xl font-black text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {currentIdx < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

