import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Signature, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Pledge: React.FC = () => {
  const { user, signPledge } = useGame();
  const navigate = useNavigate();

  const [signatureName, setSignatureName] = useState(user?.name || '');
  const [agreed, setAgreed] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !signatureName.trim()) return;

    signPledge(signatureName);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const rules = [
    "I will never share my passwords, OTPs, or financial PINs with anyone.",
    "I will pause and think before clicking unknown or suspicious links.",
    "I will verify caller identity and hang up on high-pressure threats.",
    "I understand that scanning QR codes is only for sending money, never receiving.",
    "I will report online bullying, scams, and unsafe interactions to parents or teachers."
  ];

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border-2 border-indigo-100 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          type="button"
          className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Signature className="w-6 h-6 text-primary animate-pulse" />
            Digital Cyber Pledge
          </h2>
          <p className="text-xs text-indigo-700 font-extrabold uppercase tracking-wider mt-0.5">
            Commit to keep your digital identity safe
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {user.signedPledge ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-200 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="p-4 bg-emerald-100 border-2 border-emerald-300 rounded-full text-emerald-700">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase">PLEDGE COMMITTED</h3>
              <p className="text-xs text-emerald-700 uppercase font-black tracking-widest mt-1">
                You are a sworn protector of the cyber realm
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 w-full italic max-w-md font-mono text-slate-700 shadow-inner">
              <span className="block text-[10px] text-slate-500 uppercase not-italic font-bold tracking-widest mb-2">Digital Signature</span>
              <span className="text-2xl font-black text-indigo-700 tracking-wide font-serif">
                {user.pledgeSignature}
              </span>
              <span className="block text-[9px] text-slate-500 not-italic uppercase font-bold mt-2">
                Verified Cadet Signature — Sec-ID: 9942A
              </span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              type="button"
              className="px-6 py-3 bg-primary hover:bg-[#4338CA] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Return to Mission Control
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 flex flex-col gap-6 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500"></div>

            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 uppercase">THE CYBER GUARD PLEDGE</h3>
              <p className="text-xs text-indigo-700 font-extrabold mt-1 uppercase tracking-widest">
                Review the security covenants before signing
              </p>
            </div>

            {/* List of rules */}
            <div className="flex flex-col gap-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs sm:text-sm text-slate-700 flex gap-3 leading-relaxed items-start font-medium shadow-xs">
                  <span className="p-1 bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-black shrink-0 w-6 h-6 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 mt-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-indigo-600 w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-bold select-none leading-normal">
                I understand these parameters and pledge to practice safe digital habits.
              </span>
            </label>

            {/* Signature Input */}
            <div className="flex flex-col gap-2 border-t border-slate-200 pt-5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Type Name to Sign Digitally</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="Enter full name for signing"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 flex-1 font-serif text-lg tracking-wide border-2 border-slate-300 focus:border-indigo-600"
                />
                
                <button
                  type="submit"
                  disabled={!agreed}
                  className={`
                    px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5 transition-all
                    ${agreed 
                      ? 'bg-primary hover:bg-[#4338CA] text-white cursor-pointer' 
                      : 'bg-slate-100 border border-slate-300 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Sparkles className="w-4 h-4" />
                  Sign Pledge
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
