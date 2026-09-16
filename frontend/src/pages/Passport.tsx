import React from 'react';
import { useGame } from '../context/GameContext';
import { ShieldCheck, BookOpen, Star, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Passport: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();

  if (!user) return null;

  const stampList = [
    {
      id: 'PHISHING_STAMP',
      title: 'Phishing Hunter',
      missionId: 'phishing',
      desc: 'Sorted Phishing Messages',
      emblem: '🎣',
      cardBg: 'bg-blue-50 border-blue-300 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'OTP_STAMP',
      title: 'OTP Defender',
      missionId: 'otp',
      desc: 'Defended SMS Pin Verification',
      emblem: '🔒',
      cardBg: 'bg-amber-50 border-amber-300 text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'VISHING_STAMP',
      title: 'Fraud Fighter',
      missionId: 'vishing',
      desc: 'Investigated Call Threat Scams',
      emblem: '🛡️',
      cardBg: 'bg-rose-50 border-rose-300 text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'UPI_STAMP',
      title: 'QR Detective',
      missionId: 'upi',
      desc: 'Inspected UPI Requests',
      emblem: '📲',
      cardBg: 'bg-teal-50 border-teal-300 text-teal-900',
      badgeBg: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'ESCAPE_STAMP',
      title: 'Hideout Stopper',
      missionId: 'escape',
      desc: 'Neutralized Hacker Ransomware',
      emblem: '🕵️‍♂️',
      cardBg: 'bg-purple-50 border-purple-300 text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800'
    }
  ];

  const acquiredCount = stampList.filter(s => user.stamps.includes(s.id)).length;

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
            <BookOpen className="w-6 h-6 text-primary animate-pulse" />
            Safety Credentials Passport
          </h2>
          <p className="text-xs text-indigo-700 font-extrabold uppercase tracking-wider mt-0.5">
            Complete simulation missions to collect official verification stamps
          </p>
        </div>
      </div>

      {/* Passport Book */}
      <div className="bg-white rounded-[32px] overflow-hidden border-2 border-indigo-200 shadow-xl max-w-4xl mx-auto w-full relative">
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-b from-amber-600 via-yellow-500 to-amber-700 shadow-sm z-20"></div>
        
        <div className="grid md:grid-cols-5 min-h-[440px]">
          
          {/* Left Page: Profile Details */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between border-r-2 border-indigo-100 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Cadet Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-cyan-400 rounded-2xl border-2 border-indigo-300/40 flex items-center justify-center text-white text-3xl font-black relative z-10 shadow-lg select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <h3 className="font-black text-white text-lg leading-tight uppercase tracking-wider">{user.name}</h3>
                <div className="text-[10px] text-cyan-300 font-black tracking-widest mt-1.5 uppercase bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full inline-block">
                  {user.rank}
                </div>
              </div>
            </div>

            {/* Passport Identity Stats */}
            <div className="flex flex-col gap-2.5 mt-6 border-t border-slate-800 pt-4 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-black uppercase tracking-wider text-[10px]">Institution</span>
                <span className="text-white font-bold truncate max-w-[130px]">{user.school}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-black uppercase tracking-wider text-[10px]">Cohort</span>
                <span className="text-white font-bold">{user.className}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-black uppercase tracking-wider text-[10px]">Total XP</span>
                <span className="text-amber-400 font-black">{user.xp} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-black uppercase tracking-wider text-[10px]">Coins</span>
                <span className="text-cyan-400 font-black">{user.coins} COINS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-black uppercase tracking-wider text-[10px]">Identity ID</span>
                <span className="text-emerald-300 font-bold">STUDENT-{user.name.slice(0, 3).toUpperCase()}-9902</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-300 font-mono font-bold uppercase tracking-widest text-center mt-6 border-t border-slate-800 pt-3">
              Official Cyber Guard Passport
            </div>
          </div>

          {/* Right Page: Stamps Grid */}
          <div className="md:col-span-3 p-6 flex flex-col justify-between bg-slate-50/70">
            <div>
              <h4 className="font-black text-slate-900 text-sm border-b-2 border-slate-200 pb-2.5 mb-4 uppercase tracking-wider flex justify-between items-center">
                <span>Verification Stamps</span>
                <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-black">
                  {acquiredCount} / {stampList.length} Acquired
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stampList.map((stamp) => {
                  const isStamped = user.stamps.includes(stamp.id);
                  const starCount = user.stars[stamp.missionId] || 0;

                  return (
                    <div 
                      key={stamp.id}
                      onClick={() => !isStamped && navigate(stamp.missionId === 'escape' ? '/escape-room' : `/mission/${stamp.missionId}`)}
                      className={`
                        border-2 rounded-2xl p-3 flex flex-col items-center justify-between text-center min-h-[140px] relative transition-all group
                        ${isStamped 
                          ? `${stamp.cardBg} shadow-sm hover:shadow-md cursor-default`
                          : 'border-dashed border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer'
                        }
                      `}
                    >
                      {/* Stamp Ring */}
                      <div className={`
                        w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xl select-none mb-1
                        ${isStamped ? 'border-current animate-pulse' : 'border-slate-300 text-slate-400'}
                      `}>
                        {stamp.emblem}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className={`text-xs font-black tracking-wide ${isStamped ? 'text-slate-900' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                          {stamp.title}
                        </div>
                        <div className={`text-[10px] font-bold max-w-[110px] leading-tight ${isStamped ? 'text-slate-700' : 'text-slate-500'}`}>
                          {stamp.desc}
                        </div>
                      </div>

                      {/* Earned Stars / Locked Status */}
                      <div className="flex gap-0.5 mt-1.5 items-center">
                        {isStamped ? (
                          [1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= starCount 
                                  ? 'text-amber-500 fill-amber-400' 
                                  : 'text-slate-300 fill-slate-200'
                              }`}
                            />
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                            <HelpCircle className="w-3 h-3 text-slate-500" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stampList.every(s => user.stamps.includes(s.id)) ? (
              <div className="mt-4 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-800 text-xs font-black text-center flex items-center justify-center gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>ALL MISSION & ESCAPE STAMPS COMPLETE</span>
              </div>
            ) : (
              <div className="mt-4 p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl text-indigo-900 text-[11px] font-black uppercase tracking-wider text-center">
                Complete missions & the escape room to fill your passport stamps.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
