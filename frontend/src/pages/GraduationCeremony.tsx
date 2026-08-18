import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Award, ShieldCheck, Printer, Download, ArrowLeft, Star, Sparkles, Coins, Zap } from 'lucide-react';
import { RakshaMascot } from '../components/RakshaMascot';
import confetti from 'canvas-confetti';

export const GraduationCeremony: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  
  const [showCertificate, setShowCertificate] = useState(false);
  const [medalDropped, setMedalDropped] = useState(false);

  if (!user) return null;

  // Trigger ceremony animations on mount
  useEffect(() => {
    // Launch initial confetti blasts
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    
    // Drop the medal after 1.5 seconds
    const timer1 = setTimeout(() => {
      setMedalDropped(true);
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
    }, 1500);

    // Show the certificate after 3.2 seconds
    const timer2 = setTimeout(() => {
      setShowCertificate(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto font-sans relative z-10 flex flex-col gap-8 min-h-[calc(100vh-100px)]">
      
      {/* Dynamic Animated Stage Backdrop */}
      {!showCertificate ? (
        <div className="flex-1 rounded-3xl border-2 border-indigo-500/30 p-6 sm:p-12 text-center flex flex-col items-center justify-center gap-6 relative overflow-hidden bg-slate-900 shadow-2xl min-h-[440px]">
          
          {/* Glowing Stage Spotlight beams */}
          <div className="absolute top-0 left-1/4 w-48 h-[500px] bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent transform -rotate-12 origin-top blur-2xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-48 h-[500px] bg-gradient-to-b from-violet-500/20 via-purple-500/10 to-transparent transform rotate-12 origin-top blur-2xl animate-pulse [animation-delay:1s]"></div>
          
          {/* Falling Medal animation */}
          <div className={`transition-all duration-[1500ms] ease-out transform z-20
            ${medalDropped ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-48 scale-50 opacity-0'}
          `}>
            <span className="p-5 bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-200 text-slate-950 rounded-full text-5xl shadow-2xl flex items-center justify-center relative shadow-amber-500/30">
              🎖️
              <span className="absolute -inset-2 rounded-full border-2 border-amber-300 animate-ping opacity-30"></span>
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-lg relative z-10">
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-md font-sans">
              Graduation Ceremony
            </h1>
            <h3 className="text-sm sm:text-base font-black text-cyan-300 uppercase tracking-widest mt-1">
              Honoring Cyber Student: <span className="text-amber-300 font-extrabold">{user.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 font-bold leading-relaxed max-w-md mx-auto">
              Step onto the stage to receive your verified Cyber Hero Graduation Certificate and security stamps.
            </p>
          </div>

          {/* Quick claim button + mascot */}
          <div className="flex flex-col items-center gap-4 mt-2 relative z-20">
            <button
              onClick={() => setShowCertificate(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer border border-emerald-300/30"
            >
              🏆 View Certificate Now
            </button>
            <RakshaMascot 
              expression="celebrate" 
              message="Sensational effort, Student! You completed all safety protocols!"
              className="scale-95" 
            />
          </div>

        </div>
      ) : (
        // Certificate Display with Options
        <div className="flex flex-col gap-6 animate-fade-in print:p-0">
          
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900/30 p-4 border border-white/5 rounded-2xl print:hidden">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Mission Control
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-black text-white border border-white/10 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              
              <button
                onClick={handlePrint} // Map download as print to PDF on windows
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Official IEEE SSIT Certificate Display */}
          <div 
            id="certificate-print-area"
            className="w-full relative shadow-2xl rounded-3xl overflow-hidden border-4 border-amber-400/40 bg-white print:border-none print:shadow-none print:m-0 print:p-0 select-none"
          >
            {/* Official Certificate Template Background */}
            <img 
              src="/certificate_official.png" 
              alt="IEEE SSIT & Anurag University Certificate of Appreciation" 
              className="w-full h-auto block"
            />
            
            {/* Dynamic Cadet Name Overlay */}
            <div 
              className="absolute text-center flex items-center justify-center font-serif font-black tracking-wider uppercase"
              style={{
                top: '43.5%',
                left: '32%',
                width: '56%',
                height: '8.5%',
                fontSize: 'clamp(14px, 2.6vw, 36px)',
                color: '#0f172a',
                letterSpacing: '0.06em',
                textShadow: '0px 0px 1px rgba(0,0,0,0.1)'
              }}
            >
              {user.name.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Print CSS Specific Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print-area, #certificate-print-area * {
            visibility: visible;
          }
          #certificate-print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: auto;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>

    </div>
  );
};
