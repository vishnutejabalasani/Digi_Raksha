import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Shield } from 'lucide-react';
import { RakshaMascot } from '../components/RakshaMascot';

export const Login: React.FC = () => {
  const { login } = useGame();
  const navigate = useNavigate();

  // Input states
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('Class 8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || 'Cyber Student', school || 'Public Cyber School', className, 'student');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto font-sans relative z-10 py-6 select-none">
      
      {/* Friendly Mascot Greetings */}
      <div className="flex justify-center mb-6">
        <RakshaMascot 
          expression="talk" 
          message="Welcome Student! Type your name and school to register your official Cyber Safety Passport!" 
        />
      </div>

      <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wider">
            STUDENT REGISTRATION 🚀
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Create your cyber safety profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              required
              placeholder="Enter your name (e.g. Rahul)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">School Name</label>
            <input
              type="text"
              required
              placeholder="Enter your school name"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Class / Grade</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="glass-input px-4 py-3 rounded-xl text-sm bg-white cursor-pointer"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary rounded-2xl font-black text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Shield className="w-4 h-4" />
            Secure Authorization
          </button>
        </form>
      </div>
    </div>
  );
};
