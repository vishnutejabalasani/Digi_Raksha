import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Users, Shield, TrendingUp, Settings, Download, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminCadet {
  id: string;
  name: string;
  school: string;
  className: string;
  xp: number;
  completedMissions: number;
  quizScore: string;
  pledgeSigned: boolean;
}

const MOCK_CADETS: AdminCadet[] = [
  { id: '1', name: 'Ananya Sharma', school: 'DPS Bangalore South', className: 'Class 8-B', xp: 1680, completedMissions: 4, quizScore: '10/10', pledgeSigned: true },
  { id: '2', name: 'Vikram Malhotra', school: 'DAV Public School Sector 14', className: 'Class 9-A', xp: 1540, completedMissions: 4, quizScore: '9/10', pledgeSigned: true },
  { id: '3', name: 'Rohan Gupta', school: 'Greenwood Cyber Academy', className: 'Class 7-C', xp: 1480, completedMissions: 4, quizScore: '8/10', pledgeSigned: true },
  { id: '4', name: 'Sneha Reddy', school: 'DPS Bangalore South', className: 'Class 8-A', xp: 1220, completedMissions: 4, quizScore: '8/10', pledgeSigned: true },
  { id: '5', name: 'Rahul Krishnan', school: 'Greenwood Cyber Academy', className: 'Class 8-A', xp: 1100, completedMissions: 3, quizScore: '7/10', pledgeSigned: false }
];

export const AdminPanel: React.FC = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  const [cadets, setCadets] = useState<AdminCadet[]>(MOCK_CADETS);

  if (!user || user.role !== 'admin') return null;

  // Chart Data
  const missionStatsData = [
    { name: 'Phishing', avgScore: 92, completedCount: 88 },
    { name: 'OTP Code', avgScore: 84, completedCount: 79 },
    { name: 'Vishing', avgScore: 78, completedCount: 68 },
    { name: 'UPI Safety', avgScore: 71, completedCount: 52 }
  ];

  const enrollmentRatio = [
    { name: 'Class 6-7', value: 120 },
    { name: 'Class 8', value: 240 },
    { name: 'Class 9-10', value: 180 }
  ];

  const PIE_COLORS = ['#8b5cf6', '#14b8a6', '#ec4899'];

  const handleDeleteCadet = (id: string) => {
    setCadets(prev => prev.filter(c => c.id !== id));
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,School,Class,XP,Missions Completed,Quiz Score,Pledge Signed\r\n";
    
    cadets.forEach((c) => {
      csvContent += `${c.id},"${c.name}","${c.school}",${c.className},${c.xp},${c.completedMissions},"${c.quizScore}",${c.pledgeSigned}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "digi_raksha_cadets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase flex items-center gap-2">
              <Settings className="w-6 h-6 text-rose-500 animate-pulse" />
              HQ Command Console
            </h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
              Analyze metrics, manage students, and export reports
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Analytics Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-black">Registered Students</div>
              <div className="text-2xl font-black text-white mt-0.5">540</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+15% vs yesterday</div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-black">Missions Cleared</div>
              <div className="text-2xl font-black text-white mt-0.5">1,248</div>
              <div className="text-[10px] text-slate-400 font-bold mt-0.5">Avg: 2.3 per cadet</div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-black">Completion rate</div>
              <div className="text-2xl font-black text-white mt-0.5">64%</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">National Top: DPS South</div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Mission Analytics */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Mission Audit Accuracy (%)</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missionStatsData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Bar dataKey="avgScore" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Cohort Ratio */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Class Ratio</div>
          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollmentRatio}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enrollmentRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-white">540</span>
              <span className="text-[8px] text-slate-500 uppercase font-bold">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cadets Grid / Management */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <span className="text-xs font-black uppercase text-white tracking-wider">Active cadet registry</span>
          <span className="text-xs text-slate-400 font-bold">{cadets.length} Cadets Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-wider font-extrabold bg-slate-900/60">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Affiliated School</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Missions Completed</th>
                <th className="py-3 px-4 text-center">Quiz Score</th>
                <th className="py-3 px-4 text-center">Pledge Signed</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {cadets.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{c.school}</td>
                  <td className="py-3.5 px-4 text-slate-400">{c.className}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-cyan-400">{c.completedMissions}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-purple-400">{c.quizScore}</td>
                  <td className="py-3.5 px-4 text-center">
                    {c.pledgeSigned ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                        Signed
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-white/5 uppercase">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCadet(c.id)}
                      className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      title="Delete student record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
