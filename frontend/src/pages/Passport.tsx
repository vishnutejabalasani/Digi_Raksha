import React from 'react';
import { useGame } from '../context/GameContext';
import { ShieldCheck, BookOpen, Star, HelpCircle } from 'lucide-react';
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
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'OTP_STAMP',
      title: 'OTP Defender',
      missionId: 'otp',
      desc: 'Defended SMS Pin Verification',
      emblem: '🔒',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'VISHING_STAMP',
      title: 'Fraud Fighter',
      missionId: 'vishing',
      desc: 'Investigated Call Threat Scams',
      emblem: '🛡️',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      id: 'UPI_STAMP',
      title: 'QR Detective',
      missionId: 'upi',
      desc: 'Inspected UPI Requests',
      emblem: '📲',
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-violet-400 animate-pulse" />
          Safety Credentials Passport
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
          Complete simulation missions to collect official verification stamps
        </p>
      </div>

      {/* Passport Book */}
      <div className="glass-panel-strong rounded-[32px] overflow-hidden border border-white/10 shadow-2xl max-w-3xl mx-auto w-full relative">
        <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-600 via-yellow-600 to-amber-700 opacity-80"></div>
        
        <div className="grid md:grid-cols-5 min-h-[420px]">
          
          {/* Left Page: Profile Details */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between border-r border-white/5 bg-slate-900/40 relative">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Cadet Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-md"></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-2xl border-2 border-white/10 flex items-center justify-center text-white text-3xl font-black relative z-10 shadow-lg select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-lg leading-tight uppercase">{user.name}</h3>
                <div className="text-[10px] text-cyan-400 font-bold tracking-widest mt-1 uppercase">{user.rank}</div>
              </div>
            </div>

            {/* Passport Identity Stats */}
            <div className="flex flex-col gap-2 mt-6 border-t border-white/5 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Institution</span>
                <span className="text-slate-300 font-medium truncate max-w-[130px]">{user.school}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Cohort</span>
                <span className="text-slate-300 font-medium">{user.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Total XP</span>
                <span className="text-violet-400 font-bold">{user.xp} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Coins</span>
                <span className="text-cyan-400 font-bold">{user.coins} COINS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Identity ID</span>
                <span className="text-slate-300 font-mono">STUDENT-{user.name.slice(0, 3).toUpperCase()}-9902</span>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center mt-6">
              Official Cyber Guard Passport
            </div>
          </div>

          {/* Right Page: Stamps Grid */}
          <div className="md:col-span-3 p-6 flex flex-col justify-between">
            <div>
              <h4 className="font-extrabold text-white text-sm border-b border-white/5 pb-2 mb-4 uppercase tracking-wider flex justify-between items-center">
                <span>Verification Stamps</span>
                <span className="text-xs text-cyan-400 font-bold">{user.stamps.length} / 4 Acquired</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {stampList.map((stamp) => {
                  const isStamped = user.stamps.includes(stamp.id);
                  const starCount = user.stars[stamp.missionId] || 0;

                  return (
                    <div 
                      key={stamp.id}
                      onClick={() => !isStamped && navigate(`/mission/${stamp.missionId}`)}
                      className={`
                        border rounded-2xl p-3 flex flex-col items-center justify-between text-center min-h-[140px] relative transition-all group
                        ${isStamped 
                          ? `${stamp.color} bg-opacity-10 scale-100 cursor-default`
                          : 'border-white/5 hover:border-violet-500/20 bg-slate-900/20 cursor-pointer opacity-50 hover:opacity-85'
                        }
                      `}
                    >
                      {/* Stamp Ring */}
                      <div className={`
                        w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xl select-none mb-1
                        ${isStamped ? 'border-current animate-pulse' : 'border-slate-800 text-slate-600'}
                      `}>
                        {stamp.emblem}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <div className="text-xs font-extrabold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                          {stamp.title}
                        </div>
                        <div className="text-[9px] text-slate-400 max-w-[100px] leading-tight">
                          {stamp.desc}
                        </div>
                      </div>

                      {/* Earned Stars */}
                      <div className="flex gap-0.5 mt-1.5">
                        {isStamped ? (
                          [1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= starCount 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-slate-700 fill-slate-700'
                              }`}
                            />
                          ))
                        ) : (
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-0.5">
                            <HelpCircle className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {user.completedMissions.length === 4 ? (
              <div className="mt-6 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 animate-bounce" />
                <span>ALL MISSION SIGN-OFFS COMPLETE</span>
              </div>
            ) : (
              <div className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center italic">
                Complete remaining missions to fill your passport stamps.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
