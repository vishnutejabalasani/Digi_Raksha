import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  school: string;
  className: string;
  role: 'student' | 'volunteer' | 'admin' | 'teacher';
  xp: number;
  coins: number;
  rank: string;
  badges: string[];
  stamps: string[];
  stars: Record<string, number>;
  completedMissions: string[];
  quizScore: number | null;
  signedPledge: boolean;
  pledgeSignature: string;
  posterSubmitted: boolean;
  posterData: { slogan: string; type: 'draw' | 'upload'; content: string } | null;
}

interface GameContextType {
  user: UserProfile | null;
  login: (name: string, school: string, className: string, role: UserProfile['role']) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  completeMission: (missionId: string, starsCount: number, xpEarned: number, coinsEarned: number) => void;
  submitQuiz: (score: number) => void;
  submitPoster: (slogan: string, type: 'draw' | 'upload', content: string) => void;
  signPledge: (signature: string) => void;
  resetGame: () => void;
  achievements: string[];
  clearAchievement: (id: string) => void;
  showAchievement: (badgeId: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Cyber Student',
  school: 'Greenwood Cyber Academy',
  className: 'Class 8-A',
  role: 'student',
  xp: 0,
  coins: 0,
  rank: 'Novice Guard',
  badges: [],
  stamps: [],
  stars: {},
  completedMissions: [],
  quizScore: null,
  signedPledge: false,
  pledgeSignature: '',
  posterSubmitted: false,
  posterData: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const getRankFromXP = (xp: number): string => {
  if (xp >= 1500) return 'Certified Cyber Hero';
  if (xp >= 1000) return 'Elite Agent';
  if (xp >= 600) return 'Shield Captain';
  if (xp >= 300) return 'Security Analyst';
  if (xp >= 100) return 'Cyber Sentinel';
  return 'Cyber Student';
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('digi_raksha_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('digi_raksha_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('digi_raksha_user');
    }
  }, [user]);

  const showAchievement = (badgeId: string) => {
    setAchievements((prev) => [...prev, badgeId]);
  };

  const clearAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((x) => x !== id));
  };

  const login = (name: string, school: string, className: string, role: UserProfile['role']) => {
    setUser({
      ...DEFAULT_PROFILE,
      name: name || 'Anonymous Student',
      school: school || 'Public Cyber School',
      className: className || 'Class 7',
      role,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('digi_raksha_user');
  };

  const addXP = (amount: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const newXP = prev.xp + amount;
      const oldRank = prev.rank;
      const newRank = getRankFromXP(newXP);
      
      if (newRank !== oldRank) {
        // Unlock rank achievement
        setTimeout(() => showAchievement(`Rank Up: ${newRank}!`), 500);
      }
      
      return {
        ...prev,
        xp: newXP,
        rank: newRank,
      };
    });
  };

  const addCoins = (amount: number) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        coins: prev.coins + amount,
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      if (prev.badges.includes(badgeId)) return prev;
      
      setTimeout(() => showAchievement(badgeId), 500);
      
      return {
        ...prev,
        badges: [...prev.badges, badgeId],
      };
    });
  };

  const completeMission = (missionId: string, starsCount: number, xpEarned: number, coinsEarned: number) => {
    setUser((prev) => {
      if (!prev) return null;
      
      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      
      const currentStars = prev.stars[missionId] || 0;
      const newStars = { ...prev.stars, [missionId]: Math.max(currentStars, starsCount) };
      
      // Passport Stamp
      const stampName = `${missionId.toUpperCase()}_STAMP`;
      const stamps = prev.stamps.includes(stampName) ? prev.stamps : [...prev.stamps, stampName];
      
      // Unlock badge based on mission
      let badgeToUnlock = '';
      if (missionId === 'phishing') badgeToUnlock = 'Phishing Hunter';
      if (missionId === 'otp') badgeToUnlock = 'OTP Defender';
      if (missionId === 'vishing') badgeToUnlock = 'Fraud Fighter';
      if (missionId === 'upi') badgeToUnlock = 'QR Detective';

      // Check if all missions completed to unlock Cyber Hero badge
      const isAllMissionsCompleted = completed.length === 4;

      setTimeout(() => {
        if (badgeToUnlock) unlockBadge(badgeToUnlock);
        if (isAllMissionsCompleted) {
          setTimeout(() => unlockBadge('Cyber Hero'), 1000);
        }
      }, 100);

      const oldRank = prev.rank;
      const newXP = prev.xp + xpEarned;
      const newRank = getRankFromXP(newXP);

      if (newRank !== oldRank) {
        setTimeout(() => showAchievement(`Rank Up: ${newRank}!`), 800);
      }

      return {
        ...prev,
        completedMissions: completed,
        stars: newStars,
        stamps,
        xp: newXP,
        rank: newRank,
        coins: prev.coins + coinsEarned,
      };
    });
  };

  const submitQuiz = (score: number) => {
    setUser((prev) => {
      if (!prev) return null;
      
      setTimeout(() => {
        unlockBadge('Quiz Master');
        if (score === 10) {
          setTimeout(() => unlockBadge('Perfect Score'), 800);
        }
      }, 100);

      const xpEarned = score * 15;
      const coinsEarned = score * 10;
      const oldRank = prev.rank;
      const newXP = prev.xp + xpEarned;
      const newRank = getRankFromXP(newXP);

      if (newRank !== oldRank) {
        setTimeout(() => showAchievement(`Rank Up: ${newRank}!`), 800);
      }

      return {
        ...prev,
        quizScore: score,
        xp: newXP,
        rank: newRank,
        coins: prev.coins + coinsEarned,
      };
    });
  };

  const submitPoster = (slogan: string, type: 'draw' | 'upload', content: string) => {
    setUser((prev) => {
      if (!prev) return null;
      
      setTimeout(() => unlockBadge('Creative Artist'), 100);

      const xpEarned = 100;
      const coinsEarned = 50;
      const oldRank = prev.rank;
      const newXP = prev.xp + xpEarned;
      const newRank = getRankFromXP(newXP);

      if (newRank !== oldRank) {
        setTimeout(() => showAchievement(`Rank Up: ${newRank}!`), 800);
      }

      return {
        ...prev,
        posterSubmitted: true,
        posterData: { slogan, type, content },
        xp: newXP,
        rank: newRank,
        coins: prev.coins + coinsEarned,
      };
    });
  };

  const signPledge = (signature: string) => {
    setUser((prev) => {
      if (!prev) return null;
      
      setTimeout(() => showAchievement('Cyber Pledge Signed!'), 100);

      return {
        ...prev,
        signedPledge: true,
        pledgeSignature: signature,
        xp: prev.xp + 50,
      };
    });
  };

  const resetGame = () => {
    if (user) {
      setUser({
        ...DEFAULT_PROFILE,
        name: user.name,
        school: user.school,
        className: user.className,
        role: user.role,
      });
      setAchievements([]);
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        login,
        logout,
        addXP,
        addCoins,
        unlockBadge,
        completeMission,
        submitQuiz,
        submitPoster,
        signPledge,
        resetGame,
        achievements,
        clearAchievement,
        showAchievement,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
