import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Award, Printer, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Certificate: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();

  if (!user) return null;

  const isEligible = user.completedMissions.length === 4;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="p-2.5 bg-white border-2 border-[#E0F2FE] hover:bg-slate-50 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Cyber safety credentials
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mt-1">
              Verify and download your IEEE SSIT Cyber Hero certificate
            </p>
          </div>
        </div>

        {isEligible && (
          <button
            onClick={handlePrint}
            type="button"
            className="px-5 py-3.5 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        )}
      </div>

      {!isEligible ? (
        <div className="max-w-md mx-auto w-full bg-white border-2 border-[#E0F2FE] rounded-3xl p-8 text-center flex flex-col items-center gap-6 py-12 shadow-sm">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-full text-warning animate-bounce">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase">Certificate Locked</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-bold">
              You must complete all <span className="text-primary font-black">4 Simulation Missions</span> in the dashboard before claiming your Cyber Hero certificate.
            </p>
          </div>
          <div className="bg-[#EEF7FF] p-4 rounded-2xl border border-[#C5E2F6] w-full text-xs text-slate-600 font-black uppercase">
            Missions Completed: <span className="text-primary font-black">{user.completedMissions.length} / 4</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="px-6 py-3 bg-primary hover:bg-[#4338CA] rounded-xl text-xs font-black text-white uppercase tracking-wider cursor-pointer"
          >
            Open Mission Control
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-center py-4">
          
          {/* Official IEEE SSIT Certificate Display */}
          <div 
            id="certificate-print-area"
            className="w-full max-w-4xl relative shadow-2xl rounded-3xl overflow-hidden border-4 border-amber-400/40 bg-white print:border-none print:shadow-none print:m-0 print:p-0 select-none"
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
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: 2px solid #000;
          }
        }
      `}</style>
    </div>
  );
};
