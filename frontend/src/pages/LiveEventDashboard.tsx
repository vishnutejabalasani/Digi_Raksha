import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Zap, Sparkles, Star, Users, Flame, Clock } from 'lucide-react';

interface EventAlert {
  id: string;
  message: string;
  timestamp: string;
}

interface HouseScore {
  name: string;
  points: number;
  crest: string;
  color: string;
}

export const LiveEventDashboard: React.FC = () => {
  const [timer, setTimer] = useState('11:42');
  const [totalXP, setTotalXP] = useState(15500);
  const [missionsCompleted, setMissionsCompleted] = useState(148);

  const [houses, setHouses] = useState<HouseScore[]>([
    { name: 'Agni (Fire)', points: 4320, crest: '🔥', color: 'from-orange-500 to-rose-600' },
    { name: 'Trishul (Trident)', points: 3950, crest: '🔱', color: 'from-cyan-500 to-blue-600' },
    { name: 'Prithvi (Earth)', points: 3820, crest: '🌱', color: 'from-emerald-500 to-teal-600' },
    { name: 'Akash (Space)', points: 3410, crest: '🌌', color: 'from-purple-500 to-indigo-600' }
  ]);

  const [topCadets, setTopCadets] = useState([
    { name: 'Rahul Sharma', school: 'Army Public School', className: 'Class 8-B', xp: 1820 },
    { name: 'Anjali Verma', school: 'Greenwood High', className: 'Class 9-A', xp: 1750 },
    { name: 'Vikram Sen', school: 'Model Science Academy', className: 'Class 8-A', xp: 1680 },
    { name: 'Sneha Patel', school: 'Army Public School', className: 'Class 7-C', xp: 1540 },
    { name: 'Aravind Nair', school: 'DPS Public School', className: 'Class 8-B', xp: 1480 }
  ]);

  const [alerts, setAlerts] = useState<EventAlert[]>([
    { id: '1', message: 'Anjali Verma completed Vishing Investigator with 3 Stars!', timestamp: '10s ago' },
    { id: '2', message: 'Class 8-B reached Rank #1 on School Leaderboard!', timestamp: '1m ago' },
    { id: '3', message: 'Agni House unlocked the "Elite Defender" group badge!', timestamp: '3m ago' }
  ]);

  // Live updates simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate ticking stats
      setTotalXP(prev => prev + Math.floor(Math.random() * 50) + 10);
      setMissionsCompleted(prev => prev + (Math.random() > 0.7 ? 1 : 0));
      
      // Simulate random house point gains
      setHouses(prev => {
        return prev.map(h => {
          if (Math.random() > 0.6) {
            return { ...h, points: h.points + Math.floor(Math.random() * 20) + 5 };
          }
          return h;
        });
      });

      // Spawn alert
      const randomNames = ['Amit', 'Priya', 'Karan', 'Rhea', 'Aman'];
      const randomMissions = ['Phishing sorting', 'OTP defense', 'UPI safety', 'Cyber quiz'];
      const randomHouses = ['Agni', 'Trishul', 'Prithvi', 'Akash'];
      
      if (Math.random() > 0.5) {
        const newAlert: EventAlert = {
          id: Date.now().toString(),
          message: `${randomNames[Math.floor(Math.random() * randomNames.length)]} gained +50 XP for ${randomMissions[Math.floor(Math.random() * randomMissions.length)]}!`,
          timestamp: 'Just now'
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 relative overflow-hidden font-sans border border-white/5 rounded-3xl">
      
      {/* Background Grids */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-gradient from-violet-950/20 via-transparent to-black pointer-events-none"></div>

      {/* Projector Mode Top Indicator Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/40 p-4 border border-white/5 rounded-2xl relative z-10 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping"></span>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white">
              DIGI RAKSHA: Live Hub Projection
            </h2>
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">Realtime Classroom Event Stream</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Remaining</span>
            <span className="text-lg font-black text-rose-400 font-mono tracking-widest flex items-center gap-1.5 justify-end">
              <Clock className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              {timer}
            </span>
          </div>
        </div>
      </div>

      {/* Main grids statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Cumulative Stats Card */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Total Safety XP Accumulations</span>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-mono tracking-wider mt-1.5">
              {totalXP.toLocaleString()}
            </h1>
          </div>
          
          <div className="border-t border-white/5 pt-4">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Missions completed today:</span>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{missionsCompleted} Challenges</div>
          </div>
        </div>

        {/* House Rankings list */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-3 min-h-[200px]">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">House Standings</span>
          <div className="flex flex-col gap-2.5">
            {houses.map((house, idx) => (
              <div key={house.name} className="flex justify-between items-center bg-slate-950/60 p-2 border border-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{house.crest}</span>
                  <span className="text-xs font-bold text-slate-200">{house.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-black text-amber-300 font-mono">#{idx + 1} ({house.points} pts)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live notification ticker */}
        <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-3 min-h-[200px]">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Live Event Feed</span>
          <div className="flex flex-col gap-2 overflow-hidden max-h-[140px]">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-2 bg-violet-950/20 border border-violet-500/10 rounded-xl text-[10px] text-violet-300 leading-normal flex justify-between gap-1 items-start animate-fade-in">
                <span>{alert.message}</span>
                <span className="text-[8px] text-slate-500 font-bold shrink-0">{alert.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Large Podium Leaderboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 flex-1">
        
        {/* Top 5 cadets table */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cyan-400" />
            Top Individual Students
          </h3>

          <div className="flex flex-col gap-2">
            {topCadets.map((c, idx) => (
              <div key={idx} className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black
                    ${idx === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-slate-400'}
                  `}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white">{c.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{c.school} ({c.className})</span>
                  </div>
                </div>

                <span className="text-xs font-black text-cyan-400 font-mono">
                  {c.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live visual graph chart simulator */}
        <div className="glass-panel rounded-3xl border border-white/10 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin [animation-duration:10s]" />
            Championship Activity Metrics
          </h3>

          {/* Bar metrics visualization */}
          <div className="flex-1 flex flex-col justify-around bg-slate-900/20 p-4 border border-white/5 rounded-2xl min-h-[220px]">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>PHISHING ESCAPES</span>
                <span className="text-cyan-400">85% COMPLETE</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>OTP CODE DEFENSES</span>
                <span className="text-violet-400">72% COMPLETE</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>VISHING BUZZER TESTS</span>
                <span className="text-rose-400">92% COMPLETE</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>UPI SCANNERS RESOLVED</span>
                <span className="text-amber-400">64% COMPLETE</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
