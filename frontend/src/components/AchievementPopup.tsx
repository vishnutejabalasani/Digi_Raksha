import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, ShieldAlert, Award, Star, Zap, Image, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const BADGE_DETAILS: Record<string, { title: string; desc: string; icon: any; color: string }> = {
  'Phishing Hunter': {
    title: 'Phishing Hunter',
    desc: 'Exposed email and chat scammers!',
    icon: ShieldAlert,
    color: 'from-blue-500 to-indigo-600',
  },
  'OTP Defender': {
    title: 'OTP Defender',
    desc: 'Kept verification codes safe and secure!',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
  },
  'Fraud Fighter': {
    title: 'Fraud Fighter',
    desc: 'Identified phone scams with ease!',
    icon: Award,
    color: 'from-rose-500 to-red-600',
  },
  'QR Detective': {
    title: 'QR Detective',
    desc: 'Spotted malicious QR codes & UPI scams!',
    icon: Star,
    color: 'from-teal-500 to-emerald-600',
  },
  'Quiz Master': {
    title: 'Quiz Master',
    desc: 'Conquered the Cyber Safety Quiz!',
    icon: HelpCircle,
    color: 'from-purple-500 to-violet-600',
  },
  'Perfect Score': {
    title: 'Perfect Score',
    desc: 'Acing cyber trivia with 10/10!',
    icon: Trophy,
    color: 'from-yellow-400 to-amber-600',
  },
  'Creative Artist': {
    title: 'Creative Artist',
    desc: 'Created an inspiring cyber awareness poster!',
    icon: Image,
    color: 'from-pink-500 to-rose-600',
  },
  'Cyber Hero': {
    title: 'Cyber Hero',
    desc: 'Completed all safety training missions!',
    icon: Award,
    color: 'from-violet-600 via-fuchsia-600 to-cyan-500',
  },
};

export const AchievementPopup: React.FC = () => {
  const { achievements, clearAchievement } = useGame();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (achievements.length > 0 && !active) {
      const nextBadge = achievements[0];
      setActive(nextBadge);
      
      // Play synthesis chime sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Arpeggio
        const playTone = (freq: number, startTime: number, duration: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + duration);
        };
        
        const now = audioCtx.currentTime;
        playTone(523.25, now, 0.4);      // C5
        playTone(659.25, now + 0.1, 0.4);  // E5
        playTone(783.99, now + 0.2, 0.4);  // G5
        playTone(1046.50, now + 0.3, 0.6); // C6
      } catch (e) {
        console.warn('Audio context blocked or unsupported', e);
      }

      // Fire confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899']
      });

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        setActive(null);
        clearAchievement(nextBadge);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [achievements, active, clearAchievement]);

  if (!active) return null;

  // Check if it's a badge or general rank up
  const isRankUp = active.startsWith('Rank Up:');
  const details = BADGE_DETAILS[active] || {
    title: isRankUp ? 'Rank Promoted!' : active,
    desc: isRankUp ? `You've risen to the level of ${active.split(': ')[1]}` : 'Achievement Unlocked!',
    icon: Trophy,
    color: 'from-violet-600 to-indigo-700',
  };

  const IconComponent = details.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 max-w-sm w-full">
      <div className="glass-panel-strong rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl p-4 flex gap-4 items-center">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${details.color} text-white flex-shrink-0 shadow-lg`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
            {isRankUp ? 'Level Up' : 'Achievement Unlocked!'}
          </div>
          <div className="text-lg font-bold text-white leading-tight mt-0.5">
            {details.title}
          </div>
          <div className="text-sm text-slate-300 mt-1">
            {details.desc}
          </div>
        </div>
        <button 
          onClick={() => {
            setActive(null);
            clearAchievement(active);
          }}
          className="text-slate-400 hover:text-white self-start text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
