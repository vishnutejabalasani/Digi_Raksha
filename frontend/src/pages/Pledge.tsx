import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, ArrowLeft, Signature, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Pledge: React.FC = () => {
  const { user, signPledge } = useGame();
  const navigate = useNavigate();
  const [signatureName, setSignatureName] = useState('');
  const [agreed, setAgreed] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    signPledge(signatureName || user.name);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const rules = [
    "I will never share my passwords, PINs, or One-Time Passwords (OTP) with anyone on a phone call or chat.",
    "I will check links and sender details carefully before clicking, downloading, or typing credentials.",
    "I will not scan QR codes to receive lottery rewards, cashback, or gaming diamonds.",
    "I will report phone scams and online threat messages to 1930 or tell my parents immediately."
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase flex items-center gap-2">
            <Signature className="w-6 h-6 text-violet-400 animate-pulse" />
            Digital Cyber Pledge
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
            Commit to keep your digital identity safe
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {user.signedPledge ? (
          <div className="glass-panel-strong rounded-3xl p-8 border border-emerald-500/20 text-center flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white uppercase">PLEDGE COMMITTED</h3>
              <p className="text-xs text-emerald-400 uppercase font-black tracking-widest mt-1">
                You are a sworn protector of the cyber realm
              </p>
            </div>

            <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5 w-full italic max-w-md font-mono text-slate-300">
              <span className="block text-[10px] text-slate-500 uppercase not-italic font-bold tracking-widest mb-2">Digital Signature</span>
              <span className="text-2xl font-black text-emerald-400 tracking-wide font-serif">
                {user.pledgeSignature}
              </span>
              <span className="block text-[8px] text-slate-600 not-italic uppercase font-bold mt-2">
                Timestamp: {new Date().toLocaleDateString()} — Sec-ID: 9942A
              </span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all"
            >
              Return to Control Center
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel-strong rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"></div>

            <div className="text-center">
              <h3 className="text-xl font-black text-white uppercase">THE CYBER GUARD PLEDGE</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                Review the security covenants before signing
              </p>
            </div>

            {/* List of rules */}
            <div className="flex flex-col gap-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-white/5 p-3.5 rounded-2xl text-xs sm:text-sm text-slate-300 flex gap-3 leading-relaxed items-start">
                  <span className="p-1 bg-violet-500/10 text-violet-400 border border-violet-500/25 rounded-lg text-xs font-black shrink-0 w-6 h-6 flex items-center justify-center">
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
                className="mt-1 accent-violet-500 w-4 h-4 rounded border-white/10 cursor-pointer"
              />
              <span className="text-xs text-slate-400 select-none leading-normal">
                I understand these parameters and agree to practice safe digital habits.
              </span>
            </label>

            {/* Signature Input */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Type Name to Sign Digitally</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  required
                  placeholder="Enter full name for signing"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 flex-1 font-serif text-lg tracking-wide"
                />
                
                <button
                  type="submit"
                  disabled={!agreed}
                  className={`
                    px-6 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-lg flex items-center gap-1.5 transition-all
                    ${agreed 
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:from-violet-700 hover:to-cyan-600 cursor-pointer' 
                      : 'bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed'
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
