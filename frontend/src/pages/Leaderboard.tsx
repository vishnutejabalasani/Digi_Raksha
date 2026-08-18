import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Award, Search, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  name: string;
  school: string;
  className: string;
  missionsCount: number;
  badgesCount: number;
  xp: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Ananya Sharma', school: 'DPS Bangalore South', className: 'Class 8-B', missionsCount: 4, badgesCount: 8, xp: 1680 },
  { rank: 2, name: 'Vikram Malhotra', school: 'DAV Public School Sector 14', className: 'Class 9-A', missionsCount: 4, badgesCount: 7, xp: 1540 },
  { rank: 3, name: 'Rohan Gupta', school: 'Greenwood Cyber Academy', className: 'Class 7-C', missionsCount: 4, badgesCount: 7, xp: 1480 },
  { rank: 4, name: 'Sneha Reddy', school: 'DPS Bangalore South', className: 'Class 8-A', missionsCount: 4, badgesCount: 6, xp: 1220 },
  { rank: 5, name: 'Rahul Krishnan', school: 'Greenwood Cyber Academy', className: 'Class 8-A', missionsCount: 3, badgesCount: 5, xp: 1100 },
  { rank: 6, name: 'Priya Sen', school: 'Army Public School Pune', className: 'Class 10-B', missionsCount: 3, badgesCount: 5, xp: 950 },
  { rank: 7, name: 'Tanmay Shah', school: 'DAV Public School Sector 14', className: 'Class 9-A', missionsCount: 3, badgesCount: 4, xp: 880 }
];

export const Leaderboard: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  // Add current user if not in mock data
  const userRankEntry: LeaderboardEntry = {
    rank: 4,
    name: user.name + ' (You)',
    school: user.school,
    className: user.className,
    missionsCount: user.completedMissions.length,
    badgesCount: user.badges.length,
    xp: user.xp
  };

  const list = [...MOCK_LEADERBOARD];
  const exists = list.some(x => x.name.includes('(You)'));
  if (!exists) {
    list.push(userRankEntry);
  }
  list.sort((a, b) => b.xp - a.xp);
  list.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  const filtered = list.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const podium = list.slice(0, 3);
  const remaining = filtered.filter(x => x.rank > 3);

  return (
    <div className="flex flex-col gap-6 select-none text-slate-800">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          type="button"
          className="p-2.5 bg-white border-2 border-[#E0F2FE] hover:bg-slate-50 rounded-xl text-slate-500 hover:text-primary transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-wider">
            Student Safety Leaderboard
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Top performing cyber students nationally
          </p>
        </div>
      </div>

      {/* Podium Representation (Top 3) */}
      <div className="grid grid-cols-3 gap-3 items-end max-w-xl mx-auto w-full py-6 select-none font-bold">
        {/* 2nd Place */}
        {podium[1] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-slate-300 to-slate-100 rounded-full flex items-center justify-center text-slate-700 text-base font-black border-2 border-slate-200 shadow-sm">
              {podium[1].name.charAt(0)}
            </div>
            <div className="text-center mt-2 w-full px-1">
              <div className="text-xs font-black text-slate-700 truncate">{podium[1].name}</div>
              <div className="text-[9px] text-[#06B6D4] font-black">{podium[1].xp} XP</div>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-t-3xl h-24 mt-3 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-black text-slate-500">2</span>
              <span className="text-[8px] text-slate-400 uppercase font-black">Silver</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {podium[0] && (
          <div className="flex flex-col items-center relative -top-3">
            <div className="absolute -top-7 text-yellow-500 animate-bounce">
              <Trophy className="w-6 h-6 fill-yellow-400" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FACC15] via-amber-400 to-[#F59E0B] rounded-full flex items-center justify-center text-white text-lg font-black border-2 border-yellow-300 shadow-md ring-4 ring-yellow-400/20">
              {podium[0].name.charAt(0)}
            </div>
            <div className="text-center mt-2 w-full px-1">
              <div className="text-sm font-black text-warning truncate">{podium[0].name}</div>
              <div className="text-[10px] text-slate-500 font-black">{podium[0].xp} XP</div>
            </div>
            <div className="w-full bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-t-3xl h-32 mt-3 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
              <span className="text-3xl font-black text-warning relative z-10">1</span>
              <span className="text-[8px] text-warning uppercase font-black relative z-10">Gold Hero</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {podium[2] && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-white text-base font-black border-2 border-amber-300 shadow-sm">
              {podium[2].name.charAt(0)}
            </div>
            <div className="text-center mt-2 w-full px-1">
              <div className="text-xs font-black text-slate-700 truncate">{podium[2].name}</div>
              <div className="text-[9px] text-[#F97316] font-black">{podium[2].xp} XP</div>
            </div>
            <div className="w-full bg-orange-50 border border-orange-100 rounded-t-3xl h-20 mt-3 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xl font-black text-[#F97316]">3</span>
              <span className="text-[8px] text-orange-400 uppercase font-black">Bronze</span>
            </div>
          </div>
        )}
      </div>

      {/* Rankings List */}
      <div className="bg-white border-2 border-[#E0F2FE] rounded-[28px] overflow-hidden shadow-sm">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full font-bold"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-500 uppercase tracking-wider font-black bg-slate-50/50">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">School & Class</th>
                <th className="py-3 px-4 text-center">Missions</th>
                <th className="py-3 px-4 text-center">Badges</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const isUser = entry.name.includes('(You)');
                return (
                  <tr 
                    key={entry.rank}
                    className={`
                      border-b border-slate-100 transition-colors hover:bg-slate-50
                      ${isUser ? 'bg-indigo-50/50 border-l-4 border-l-primary' : ''}
                    `}
                  >
                    <td className="py-3.5 px-4 text-center font-black text-slate-400">
                      {entry.rank}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-800 flex items-center gap-2">
                      {isUser && <Shield className="w-4 h-4 text-primary shrink-0" />}
                      {entry.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-bold">
                      <div className="font-black text-slate-700">{entry.school}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{entry.className}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-secondary">
                      {entry.missionsCount} / 4
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-[#A78BFA]">
                      {entry.badgesCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-800">
                      {entry.xp} <span className="text-[10px] text-primary font-black">XP</span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-black uppercase">
                    No students matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
