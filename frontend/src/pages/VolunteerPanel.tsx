import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, UserCheck, Check, Star, RefreshCw, ClipboardList, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingPoster {
  id: string;
  name: string;
  slogan: string;
  theme: string;
  type: 'draw' | 'upload';
  score: number;
  approved: boolean;
}

const MOCK_POSTERS: PendingPoster[] = [
  { id: '1', name: 'Kabir Dev', slogan: 'Dont Scan to Receive!', theme: 'UPI QR Protection', type: 'draw', score: 0, approved: false },
  { id: '2', name: 'Nisha Pillai', slogan: 'Keep OTP in Your Pocket', theme: 'OTP Safety', type: 'upload', score: 0, approved: false }
];

interface StationLog {
  station: string;
  leader: string;
  activeCount: number;
  status: 'Online' | 'Offline';
}

const MOCK_STATIONS: StationLog[] = [
  { station: 'Station 1: Phishing Trap', leader: 'Vol-Aravind', activeCount: 14, status: 'Online' },
  { station: 'Station 2: OTP Zone', leader: 'Vol-Sneha', activeCount: 8, status: 'Online' },
  { station: 'Station 3: Vishing Wire', leader: 'Vol-Rahul', activeCount: 12, status: 'Online' },
  { station: 'Station 4: QR Scanner', leader: 'Vol-Divya', activeCount: 5, status: 'Online' }
];

export const VolunteerPanel: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();

  const [posters, setPosters] = useState<PendingPoster[]>(MOCK_POSTERS);
  const [stations, setStations] = useState<StationLog[]>(MOCK_STATIONS);

  if (!user || (user.role !== 'volunteer' && user.role !== 'admin')) return null;

  const handleApprovePoster = (id: string, score: number) => {
    setPosters(prev => prev.map(p => p.id === id ? { ...p, score, approved: true } : p));
    
    // Quick notification beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.1, now);
      osc.frequency.setValueAtTime(580, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch(e) {}
  };

  const handleToggleStation = (stationName: string) => {
    setStations(prev => prev.map(s => s.station === stationName 
      ? { ...s, status: s.status === 'Online' ? 'Offline' : 'Online' } 
      : s
    ));
  };

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
            <ClipboardList className="w-6 h-6 text-teal-400 animate-pulse" />
            Volunteer Command Hub
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
            Oversee training stations and evaluate creative poster campaigns
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Stations & Attendance */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="font-extrabold text-white text-base border-b border-white/5 pb-2 uppercase tracking-wider">
            Active School Stations
          </h3>
          
          <div className="flex flex-col gap-3">
            {stations.map((st) => (
              <div 
                key={st.station}
                className="glass-panel rounded-2xl p-4 border border-white/5 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-white text-xs">{st.station}</h4>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Lead: <span className="text-slate-300 font-semibold">{st.leader}</span> — Active Students: <span className="text-cyan-400 font-bold">{st.activeCount}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStation(st.station)}
                  className={`
                    px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition-all
                    ${st.status === 'Online'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }
                  `}
                >
                  {st.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Poster Submissions Evaluations */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-extrabold text-white text-base border-b border-white/5 pb-2 uppercase tracking-wider flex justify-between items-center">
            <span>Pending Poster Campaigns</span>
            <span className="text-xs text-teal-400 font-bold">
              {posters.filter(x => !x.approved).length} Pending Review
            </span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {posters.map((p) => (
              <div 
                key={p.id}
                className={`
                  glass-panel-strong rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all
                  ${p.approved ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-teal-500/10 text-teal-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-teal-500/20 uppercase tracking-wide">
                      {p.theme}
                    </span>
                    <h4 className="font-extrabold text-white text-sm mt-2">{p.name}</h4>
                  </div>

                  <span className="text-[10px] text-slate-500 uppercase font-black">{p.type} file</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-300 italic">
                  "{p.slogan}"
                </div>

                {p.approved ? (
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Approved
                    </span>
                    
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= p.score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score Poster (1-5 Stars)</div>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleApprovePoster(p.id, star)}
                          className="flex-1 py-1 bg-slate-900 border border-white/5 hover:border-teal-500/40 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-0.5"
                        >
                          {star} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {posters.length === 0 && (
              <div className="sm:col-span-2 text-center py-12 text-slate-500 font-bold">
                No poster campaigns require evaluation today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
